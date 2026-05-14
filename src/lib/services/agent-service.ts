import { buildAgentPrompt } from "@/lib/ai/prompt";
import { agentSettings, cases, knowledgeDocuments, leadContexts } from "@/lib/mock-data";
import type { AgentDecision, Lead, Message } from "@/lib/types";
import { searchRelevantCases } from "@/lib/services/case-search-service";
import { searchKnowledgeBase } from "@/lib/services/knowledge-search-service";
import { classifyLeadIntent } from "@/lib/services/message-service";

export function logAgentDecision(data: Record<string, unknown>) {
  return {
    id: crypto.randomUUID(),
    runType: data.runType ?? "message_reply",
    status: "logged",
    data,
    createdAt: new Date().toISOString()
  };
}

export function generateAgentReply(lead: Lead, history: Message[]): AgentDecision & { prompt: string } {
  const context = leadContexts.find((item) => item.leadId === lead.id) ?? leadContexts[0];
  const lastLeadMessage = [...history].reverse().find((message) => message.senderType === "lead")?.content ?? "";
  const intent = classifyLeadIntent(lastLeadMessage);
  const relevantCases = searchRelevantCases(lastLeadMessage, context).slice(0, 2);
  const relevantKnowledge = searchKnowledgeBase(`${lastLeadMessage} ${context.knownObjections}`).slice(0, 3);
  const prompt = buildAgentPrompt({
    settings: agentSettings,
    lead,
    context,
    history,
    cases: relevantCases.length ? relevantCases : cases.filter((caseStudy) => context.aiRecommendedCases.includes(caseStudy.id)),
    knowledge: relevantKnowledge.length ? relevantKnowledge : knowledgeDocuments.slice(0, 2)
  });

  const shouldEscalate = intent === "question" && relevantKnowledge.length === 0;
  const shouldSchedule = intent === "scheduling" || (intent === "interested" && lead.leadScore >= 70);
  const message =
    intent === "objection"
      ? "Entendi. Para eu te responder com precisão: a trava hoje é orçamento, prioridade ou confiança de que a operação vai funcionar no seu cenário?"
      : shouldSchedule
        ? "Perfeito. Posso te passar duas opções de horário para uma conversa rápida com o closer e validar se faz sentido?"
        : "Entendi. Pelo seu cenário, parece que o ponto é organizar atendimento, qualificação e próximo passo dos leads. Hoje isso fica concentrado em alguém do time?";

  const decision: AgentDecision = {
    message_to_send: message,
    intent,
    lead_stage_suggestion: shouldSchedule ? "qualificado" : lead.stage,
    should_send: intent !== "opt_out" && !shouldEscalate,
    should_escalate_to_human: shouldEscalate,
    should_schedule: shouldSchedule,
    case_used_ids: relevantCases.map((caseStudy) => caseStudy.id),
    knowledge_used_ids: relevantKnowledge.map((document) => document.id),
    next_action: shouldSchedule ? "oferecer_horarios" : shouldEscalate ? "aguardar_humano" : "aguardar_resposta",
    confidence: shouldEscalate ? 0.54 : 0.82
  };

  logAgentDecision({ runType: "message_reply", leadId: lead.id, output: decision });
  return { ...decision, prompt };
}
