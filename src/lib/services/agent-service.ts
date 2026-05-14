import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { buildAgentPrompt } from "@/lib/ai/prompt";
import { env } from "@/lib/env";
import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { getLeadData, markOptOut, updateLeadStage } from "@/lib/services/lead-service";
import { searchRelevantCases } from "@/lib/services/case-search-service";
import { searchKnowledgeBase } from "@/lib/services/knowledge-search-service";
import { getAgentSettings } from "@/lib/services/settings-service";
import { getConversationHistory, updateConversationState } from "@/lib/services/conversation-service";
import { saveMessage } from "@/lib/services/message-service";
import { sendWhatsappText } from "@/lib/services/whatsapp-service";
import type { AgentDecision, Lead, Message } from "@/lib/types";

const AgentDecisionSchema = z.object({
  message_to_send: z.string(),
  intent: z.enum(["interested", "objection", "no_interest", "scheduling", "question", "opt_out", "unknown"]),
  lead_stage_suggestion: z.string(),
  should_send: z.boolean(),
  should_escalate_to_human: z.boolean(),
  should_schedule: z.boolean(),
  case_used_ids: z.array(z.string()),
  knowledge_used_ids: z.array(z.string()),
  next_action: z.string(),
  confidence: z.number()
});

export async function logAgentDecision(data: Record<string, unknown>) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return null;

  const { data: saved, error } = await supabase
    .from("agent_runs")
    .insert({
      company_id: companyId,
      lead_id: data.leadId,
      conversation_id: data.conversationId,
      run_type: data.runType ?? "message_reply",
      input: data.input ?? {},
      output: data.output ?? {},
      status: data.status ?? "completed",
      error: data.error
    })
    .select("*")
    .single();

  if (error) throw error;
  return saved;
}

export async function generateAgentReply(lead: Lead, history: Message[], conversationId?: string): Promise<AgentDecision & { prompt: string }> {
  if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY ausente");

  const leadData = await getLeadData(lead.id);
  if (!leadData?.context) throw new Error("Contexto do lead não encontrado");

  const settings = await getAgentSettings();
  const lastLeadMessage = [...history].reverse().find((message) => message.senderType === "lead")?.content ?? "";
  const relevantCases = await searchRelevantCases(lastLeadMessage, leadData.context);
  const relevantKnowledge = await searchKnowledgeBase(`${lastLeadMessage} ${leadData.context.knownObjections}`);
  const prompt = buildAgentPrompt({
    settings,
    lead,
    context: leadData.context,
    history,
    cases: relevantCases,
    knowledge: relevantKnowledge
  });

  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const response = await openai.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: prompt
      },
      {
        role: "user",
        content: lastLeadMessage || "Gere a próxima decisão operacional para esta conversa."
      }
    ],
    text: {
      format: zodTextFormat(AgentDecisionSchema, "agent_decision")
    }
  });

  const decision = response.output_parsed;
  if (!decision) throw new Error("OpenAI não retornou decisão estruturada");

  await logAgentDecision({
    runType: "message_reply",
    leadId: lead.id,
    conversationId,
    input: { prompt, history, relevantCaseIds: relevantCases.map((item) => item.id), relevantKnowledgeIds: relevantKnowledge.map((item) => item.id) },
    output: decision
  });

  return { ...decision, prompt };
}

export async function handleIncomingLeadMessage(input: { lead: Lead; conversationId: string; content: string; whatsappMessageId?: string }) {
  await saveMessage({
    conversationId: input.conversationId,
    leadId: input.lead.id,
    senderType: "lead",
    content: input.content,
    whatsappMessageId: input.whatsappMessageId
  });

  const history = await getConversationHistory(input.conversationId);
  const decision = await generateAgentReply(input.lead, history, input.conversationId);

  if (decision.intent === "opt_out") {
    await markOptOut(input.lead.id);
    await updateConversationState(input.conversationId, { status: "closed", nextAction: "Lead pediu opt-out" });
    return decision;
  }

  if (decision.should_escalate_to_human) {
    await updateConversationState(input.conversationId, { status: "needs_human", nextAction: decision.next_action });
    return decision;
  }

  if (decision.lead_stage_suggestion) {
    await updateLeadStage(input.lead.id, decision.lead_stage_suggestion);
  }

  await updateConversationState(input.conversationId, {
    status: decision.should_schedule ? "scheduled" : "open",
    nextAction: decision.next_action
  });

  if (decision.should_send && decision.message_to_send) {
    const sent = await sendWhatsappText({ to: input.lead.phone, message: decision.message_to_send });
    await saveMessage({
      conversationId: input.conversationId,
      leadId: input.lead.id,
      senderType: "ai",
      content: decision.message_to_send,
      metadata: { whatsapp: sent, decision }
    });
  }

  return decision;
}
