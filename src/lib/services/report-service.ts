import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";

export async function getReportMetrics(filters: Record<string, string | undefined> = {}) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return { cards: [], breakdowns: [] };

  let leadsQuery = supabase.from("leads").select("id, stage, status, source, owner_id, created_at, ai_status, context_level").eq("company_id", companyId);
  if (filters.stage) leadsQuery = leadsQuery.eq("stage", filters.stage);
  if (filters.source) leadsQuery = leadsQuery.eq("source", filters.source);
  if (filters.from) leadsQuery = leadsQuery.gte("created_at", filters.from);
  if (filters.to) leadsQuery = leadsQuery.lte("created_at", filters.to);

  const [{ data: leads, error: leadsError }, { data: messages, error: messagesError }, { data: conversations, error: conversationsError }] =
    await Promise.all([
      leadsQuery,
      supabase.from("messages").select("id, lead_id, sender_type, created_at, message_template_id, metadata").eq("company_id", companyId),
      supabase.from("conversations").select("id, lead_id, status, created_at").eq("company_id", companyId)
    ]);

  if (leadsError) throw leadsError;
  if (messagesError) throw messagesError;
  if (conversationsError) throw conversationsError;

  const leadRows = leads ?? [];
  const messageRows = messages ?? [];
  const conversationRows = conversations ?? [];
  const leadIds = new Set(leadRows.map((lead) => lead.id));
  const scopedMessages = messageRows.filter((message) => leadIds.has(message.lead_id));
  const contacted = new Set(scopedMessages.filter((message) => message.sender_type === "ai").map((message) => message.lead_id)).size;
  const responded = new Set(scopedMessages.filter((message) => message.sender_type === "lead").map((message) => message.lead_id)).size;
  const qualified = leadRows.filter((lead) => String(lead.stage).toLowerCase().includes("qualificado")).length;
  const meetings = leadRows.filter((lead) => String(lead.stage).toLowerCase().includes("reunião") || lead.ai_status === "scheduled").length;
  const optOut = leadRows.filter((lead) => lead.ai_status === "opt_out" || lead.status === "Opt-out").length;

  const firstResponseMinutes = leadRows
    .map((lead) => {
      const firstAi = scopedMessages.filter((message) => message.lead_id === lead.id && message.sender_type === "ai").sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
      const firstLead = scopedMessages.filter((message) => message.lead_id === lead.id && message.sender_type === "lead").sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
      if (!firstAi || !firstLead) return null;
      return Math.max(0, Math.round((new Date(firstLead.created_at).getTime() - new Date(firstAi.created_at).getTime()) / 60000));
    })
    .filter((value): value is number => value !== null);

  return {
    cards: [
      { label: "Leads importados", value: leadRows.length.toString() },
      { label: "Leads contatados", value: contacted.toString() },
      { label: "Leads respondidos", value: responded.toString() },
      { label: "Leads qualificados", value: qualified.toString() },
      { label: "Reuniões agendadas", value: meetings.toString() },
      { label: "Taxa de resposta", value: `${Math.round((responded / Math.max(contacted, 1)) * 100)}%` },
      { label: "Taxa de qualificação", value: `${Math.round((qualified / Math.max(leadRows.length, 1)) * 100)}%` },
      { label: "Taxa de reunião", value: `${Math.round((meetings / Math.max(leadRows.length, 1)) * 100)}%` },
      { label: "Taxa de opt-out", value: `${Math.round((optOut / Math.max(leadRows.length, 1)) * 100)}%` },
      { label: "Tempo médio até primeira resposta", value: firstResponseMinutes.length ? `${Math.round(firstResponseMinutes.reduce((sum, item) => sum + item, 0) / firstResponseMinutes.length)} min` : "sem dados" },
      { label: "Conversas assumidas por humano", value: conversationRows.filter((conversation) => conversation.status === "needs_human").length.toString() }
    ],
    breakdowns: [
      { label: "Performance por etapa", value: groupBy(leadRows, "stage") },
      { label: "Performance por origem", value: groupBy(leadRows, "source") },
      { label: "Performance por template", value: groupBy(scopedMessages, "message_template_id") },
      { label: "Performance por case usado", value: groupMetadata(scopedMessages, "case_used_ids") }
    ]
  };
}

function groupBy(rows: Array<Record<string, any>>, key: string) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const value = row[key] ?? "Sem informação";
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

function groupMetadata(rows: Array<Record<string, any>>, key: string) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    const values = row.metadata?.[key] ?? [];
    for (const value of Array.isArray(values) ? values : [values]) {
      if (!value) continue;
      acc[value] = (acc[value] ?? 0) + 1;
    }
    return acc;
  }, {});
}
