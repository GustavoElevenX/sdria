import { createAutomationJob } from "@/lib/services/automation-job-service";
import { chooseExperimentVariant } from "@/lib/services/experiment-service";
import { getAgentSettings } from "@/lib/services/settings-service";
import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapLead, mapMessageTemplate } from "@/lib/supabase/mappers";
import { getOrCreateConversation, updateConversationState } from "@/lib/services/conversation-service";
import { saveMessage } from "@/lib/services/message-service";
import { sendWhatsappTemplate } from "@/lib/services/whatsapp-service";
import { logAgentDecision } from "@/lib/services/agent-service";
import type { Lead, MessageTemplate } from "@/lib/types";

function validPhone(phone: string) {
  return /^\+\d{12,15}$/.test(phone);
}

function renderTemplate(content: string, lead: Lead) {
  return content
    .replaceAll("{{nome}}", lead.name || "")
    .replaceAll("{{empresa}}", lead.companyName || "")
    .replaceAll("{{etapa}}", lead.stage || "");
}

export async function getEligibleOutreachLeads(input: { leadIds?: string[]; limit?: number }) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  let query = supabase
    .from("leads")
    .select("*, profiles:owner_id(name), lead_contexts!inner(ready_for_outreach), meetings(id)")
    .eq("company_id", companyId)
    .eq("ai_status", "active")
    .eq("lead_contexts.ready_for_outreach", true)
    .not("phone", "is", null)
    .neq("status", "Opt-out")
    .limit(input.limit ?? 20);

  if (input.leadIds?.length) query = query.in("id", input.leadIds);
  const { data, error } = await query;
  if (error) throw error;

  const leads = (data ?? []).map(mapLead).filter((lead) => validPhone(lead.phone) && !lead.hasMeeting && lead.aiStatus !== "opt_out");
  const eligible = [];
  for (const lead of leads) {
    const { data: recent, error: recentError } = await supabase
      .from("conversations")
      .select("id, last_message_at, status")
      .eq("lead_id", lead.id)
      .gte("last_message_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .maybeSingle();
    if (recentError) throw recentError;
    if (!recent || recent.status === "closed") eligible.push(lead);
  }
  return eligible;
}

async function chooseTemplate(lead: Lead, templateId?: string) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const experimentChoice = await chooseExperimentVariant(lead.id);
  const experimentalTemplateId = experimentChoice?.variant?.templateId as string | undefined;

  let query = supabase
    .from("message_templates")
    .select("*")
    .eq("company_id", companyId)
    .eq("active", true)
    .eq("approved_on_whatsapp", true);

  if (templateId || experimentalTemplateId) query = query.eq("id", templateId ?? experimentalTemplateId!);
  const { data, error } = await query;
  if (error) throw error;
  const templates = (data ?? []).map(mapMessageTemplate);
  const selected =
    templates.find((template) => lead.stage && template.stageTarget?.toLowerCase().includes(lead.stage.toLowerCase())) ??
    templates.find((template) => template.category === "reactivation") ??
    templates[0];

  return { template: selected, experimentChoice };
}

export async function startOutreach(input: { leadIds?: string[]; limit?: number; templateId?: string; dryRun?: boolean }) {
  const leads = await getEligibleOutreachLeads(input);
  const results = [];

  for (const lead of leads) {
    const { template, experimentChoice } = await chooseTemplate(lead, input.templateId);
    if (!template) {
      results.push({ leadId: lead.id, status: "skipped", reason: "Nenhum template aprovado encontrado" });
      continue;
    }

    const conversation = await getOrCreateConversation(lead.id);
    const content = renderTemplate(template.content, lead);
    if (input.dryRun) {
      results.push({ leadId: lead.id, status: "dry_run", templateId: template.id, content });
      continue;
    }

    const sent = await sendWhatsappTemplate({
      to: lead.phone,
      templateName: template.name,
      variables: { nome: lead.name, empresa: lead.companyName, etapa: lead.stage }
    });

    const message = await saveMessage({
      conversationId: conversation.id,
      leadId: lead.id,
      senderType: "ai",
      content,
      messageTemplateId: template.id,
      metadata: {
        whatsapp: sent,
        outreach: true,
        experimentId: experimentChoice?.experiment?.id,
        variantId: experimentChoice?.variant?.id ?? experimentChoice?.variant?.name
      }
    });

    const settings = await getAgentSettings();
    const intervalHours = Number((settings.followupRules as any).intervalHours ?? 36);
    const nextActionAt = new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString();
    await updateConversationState(conversation.id, { status: "open", nextAction: "Aguardar resposta ou follow-up" });
    await createAutomationJob({
      leadId: lead.id,
      conversationId: conversation.id,
      type: "follow_up",
      scheduledAt: nextActionAt,
      attempt: 1,
      payload: { templateId: template.id }
    });
    await logAgentDecision({
      runType: "outreach",
      leadId: lead.id,
      conversationId: conversation.id,
      input,
      output: { templateId: template.id, messageId: message.id, nextActionAt },
      status: "completed"
    });
    results.push({ leadId: lead.id, status: "sent", templateId: template.id, conversationId: conversation.id });
  }

  return { count: results.length, results };
}

export async function getFollowUpTemplate(): Promise<MessageTemplate | null> {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return null;
  const { data, error } = await supabase
    .from("message_templates")
    .select("*")
    .eq("company_id", companyId)
    .eq("active", true)
    .eq("approved_on_whatsapp", true)
    .eq("category", "follow_up")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapMessageTemplate(data) : null;
}

export { renderTemplate };
