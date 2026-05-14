import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { getLearningInsights } from "@/lib/services/learning-service";

export async function getDashboardMetrics() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) {
    return {
      cards: [],
      funnel: [],
      responseByDay: [],
      insights: []
    };
  }

  const [{ data: leads, error: leadsError }, { data: messages, error: messagesError }, { data: conversations, error: conversationsError }] =
    await Promise.all([
      supabase.from("leads").select("id, stage, status, context_level, ai_status, created_at").eq("company_id", companyId),
      supabase.from("messages").select("id, sender_type, created_at, message_template_id").eq("company_id", companyId),
      supabase.from("conversations").select("id, status").eq("company_id", companyId)
    ]);

  if (leadsError) throw leadsError;
  if (messagesError) throw messagesError;
  if (conversationsError) throw conversationsError;

  const leadRows = leads ?? [];
  const messageRows = messages ?? [];
  const conversationRows = conversations ?? [];
  const sentMessages = messageRows.filter((message) => message.sender_type === "ai" || message.sender_type === "human").length;
  const leadReplies = messageRows.filter((message) => message.sender_type === "lead").length;
  const meetings = leadRows.filter((lead) => lead.stage === "Reunião agendada" || lead.ai_status === "scheduled").length;
  const qualified = leadRows.filter((lead) => lead.stage === "Qualificado").length;

  const stageCount = (stage: string) => leadRows.filter((lead) => String(lead.stage ?? "").toLowerCase().includes(stage)).length;
  const byDay = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((label, index) => {
    const sent = messageRows.filter((message) => new Date(message.created_at).getDay() === index && message.sender_type === "ai").length;
    const replies = messageRows.filter((message) => new Date(message.created_at).getDay() === index && message.sender_type === "lead").length;
    return { label, value: sent ? replies / sent : 0 };
  });

  return {
    cards: [
      { label: "Total de leads", value: leadRows.length.toString(), trend: "real" },
      { label: "Prontos para prospecção", value: leadRows.filter((lead) => lead.ai_status === "active").length.toString(), trend: "real" },
      { label: "Contexto insuficiente", value: leadRows.filter((lead) => lead.context_level === "baixo").length.toString(), trend: "real" },
      { label: "Mensagens enviadas", value: sentMessages.toString(), trend: "real" },
      { label: "Taxa de resposta", value: `${Math.round((leadReplies / Math.max(sentMessages, 1)) * 100)}%`, trend: "real" },
      { label: "Leads qualificados", value: qualified.toString(), trend: "real" },
      { label: "Reuniões agendadas", value: meetings.toString(), trend: "real" },
      { label: "Conversão para reunião", value: `${Math.round((meetings / Math.max(leadRows.length, 1)) * 100)}%`, trend: "real" },
      { label: "Tempo médio de resposta", value: "calcular", trend: "pendente" },
      { label: "Precisam de humano", value: conversationRows.filter((conversation) => conversation.status === "needs_human").length.toString(), trend: "real" }
    ],
    funnel: [
      { label: "Importados", value: leadRows.length },
      { label: "Contatados", value: messageRows.filter((message) => message.sender_type === "ai").length },
      { label: "Responderam", value: leadReplies },
      { label: "Qualificados", value: qualified || stageCount("qualificado") },
      { label: "Reunião agendada", value: meetings }
    ],
    responseByDay: byDay.filter((item) => item.value > 0),
    insights: (await getLearningInsights()).slice(0, 5)
  };
}
