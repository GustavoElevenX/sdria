import { getDueAutomationJobs, updateAutomationJob, createAutomationJob } from "@/lib/services/automation-job-service";
import { getConversation, updateConversationState } from "@/lib/services/conversation-service";
import { getLeadData } from "@/lib/services/lead-service";
import { saveMessage } from "@/lib/services/message-service";
import { getFollowUpTemplate, renderTemplate } from "@/lib/services/outreach-service";
import { getAgentSettings } from "@/lib/services/settings-service";
import { sendWhatsappTemplate } from "@/lib/services/whatsapp-service";
import { logAgentDecision } from "@/lib/services/agent-service";

function allowedNow(rules: Record<string, any>) {
  const now = new Date();
  const day = now.getDay();
  if (rules.pauseWeekends && (day === 0 || day === 6)) return false;
  const [start, end] = String(rules.allowedHours ?? "09:00-18:00").split("-");
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMinute = "0"] = start.split(":");
  const [endHour, endMinute = "0"] = end.split(":");
  const startMinutes = Number(startHour) * 60 + Number(startMinute);
  const endMinutes = Number(endHour) * 60 + Number(endMinute);
  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

export async function processOutreachJobs(limit = 50) {
  const jobs = await getDueAutomationJobs("follow_up", limit);
  const settings = await getAgentSettings();
  const rules = settings.followupRules as Record<string, any>;
  const maxAttempts = Number(rules.maxAttempts ?? 4);
  const intervalHours = Number(rules.intervalHours ?? 36);
  const results = [];

  if (!allowedNow(rules)) {
    return { processed: 0, skipped: jobs.length, reason: "Fora da janela permitida" };
  }

  for (const job of jobs) {
    try {
      const leadData = await getLeadData(job.lead_id);
      const conversation = job.conversation_id ? await getConversation(job.conversation_id) : null;
      if (!leadData?.lead || !conversation) {
        await updateAutomationJob(job.id, { status: "canceled", last_error: "Lead ou conversa não encontrados" });
        continue;
      }
      if (leadData.lead.aiStatus === "opt_out" || conversation.status === "needs_human" || conversation.status === "scheduled") {
        await updateAutomationJob(job.id, { status: "canceled", last_error: "Estado bloqueia follow-up" });
        continue;
      }

      const history = conversation.messages ?? [];
      const hasReplyAfterJob = history.some((message) => message.senderType === "lead" && new Date(message.createdAt) > new Date(job.created_at));
      if (hasReplyAfterJob) {
        await updateAutomationJob(job.id, { status: "completed" });
        continue;
      }
      if (Number(job.attempt ?? 0) >= maxAttempts) {
        await updateAutomationJob(job.id, { status: "completed", last_error: "Máximo de tentativas atingido" });
        continue;
      }

      const template = await getFollowUpTemplate();
      if (!template) throw new Error("Template de follow-up aprovado não encontrado");
      const content = renderTemplate(template.content, leadData.lead);
      const sent = await sendWhatsappTemplate({
        to: leadData.lead.phone,
        templateName: template.name,
        variables: { nome: leadData.lead.name, empresa: leadData.lead.companyName, etapa: leadData.lead.stage }
      });

      await saveMessage({
        conversationId: conversation.id,
        leadId: leadData.lead.id,
        senderType: "ai",
        content,
        messageTemplateId: template.id,
        metadata: { whatsapp: sent, followUp: true, attempt: Number(job.attempt ?? 0) + 1 }
      });
      await updateConversationState(conversation.id, { status: "open", nextAction: "Aguardar resposta do follow-up" });
      await updateAutomationJob(job.id, { status: "completed" });

      const nextAttempt = Number(job.attempt ?? 0) + 1;
      if (nextAttempt < maxAttempts) {
        await createAutomationJob({
          leadId: leadData.lead.id,
          conversationId: conversation.id,
          type: "follow_up",
          scheduledAt: new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString(),
          attempt: nextAttempt,
          payload: { previousJobId: job.id }
        });
      }
      await logAgentDecision({
        runType: "follow_up",
        leadId: leadData.lead.id,
        conversationId: conversation.id,
        input: { job },
        output: { templateId: template.id, attempt: nextAttempt }
      });
      results.push({ jobId: job.id, status: "sent" });
    } catch (error) {
      await updateAutomationJob(job.id, { status: "failed", last_error: error instanceof Error ? error.message : String(error) });
      results.push({ jobId: job.id, status: "failed", error: error instanceof Error ? error.message : String(error) });
    }
  }

  return { processed: results.length, results };
}
