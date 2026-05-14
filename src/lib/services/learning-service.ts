import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapLearningInsight } from "@/lib/supabase/mappers";

export async function getLearningInsights() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  const { data, error } = await supabase
    .from("learning_insights")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapLearningInsight);
}

export async function approveLearningInsight(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("learning_insights")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapLearningInsight(data);
}

export async function rejectLearningInsight(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("learning_insights")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapLearningInsight(data);
}

async function createInsight(input: { type: string; summary: string; evidence: Record<string, unknown>; recommendation: string }) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("learning_insights")
    .insert({
      company_id: companyId,
      type: input.type,
      summary: input.summary,
      evidence: input.evidence,
      recommendation: input.recommendation,
      status: "pending"
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapLearningInsight(data);
}

export async function runDailyLearningAnalysis() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) {
    return { analyzedMessages: 0, responseRate: 0, generatedInsights: [], createdAt: new Date().toISOString() };
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*, message_templates(name, category), conversations(status), leads(stage, source)")
    .eq("company_id", companyId)
    .gte("created_at", since);

  if (error) throw error;

  const rows = messages ?? [];
  const aiMessages = rows.filter((message) => message.sender_type === "ai");
  const leadReplies = rows.filter((message) => message.sender_type === "lead");
  const generatedInsights = [];
  const responseRate = aiMessages.length ? leadReplies.length / aiMessages.length : 0;

  const templateStats = new Map<string, { sent: number; replies: number; name: string }>();
  for (const message of aiMessages) {
    const templateId = message.message_template_id ?? "sem_template";
    const current = templateStats.get(templateId) ?? { sent: 0, replies: 0, name: message.message_templates?.name ?? "Sem template" };
    current.sent += 1;
    templateStats.set(templateId, current);
  }

  for (const reply of leadReplies) {
    const prior = aiMessages
      .filter((message) => message.lead_id === reply.lead_id && new Date(message.created_at) <= new Date(reply.created_at))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    if (prior) {
      const templateId = prior.message_template_id ?? "sem_template";
      const current = templateStats.get(templateId);
      if (current) current.replies += 1;
    }
  }

  const rankedTemplates = [...templateStats.entries()]
    .map(([id, stats]) => ({ id, ...stats, rate: stats.sent ? stats.replies / stats.sent : 0 }))
    .sort((a, b) => b.rate - a.rate);

  const best = rankedTemplates[0];
  if (best && best.sent >= 3) {
    generatedInsights.push(
      await createInsight({
        type: "message_performance",
        summary: `O template ${best.name} teve a melhor taxa de resposta do período.`,
        evidence: { templateId: best.id, sent: best.sent, replies: best.replies, responseRate: best.rate },
        recommendation: `Priorizar ${best.name} em segmentos/etapas similares e criar uma variação para teste A/B.`
      })
    );
  }

  const objectionTerms = ["preço", "preco", "caro", "prazo", "confiança", "confianca", "desconto"];
  const objectionCounts = objectionTerms
    .map((term) => ({ term, count: leadReplies.filter((message) => String(message.content).toLowerCase().includes(term)).length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  if (objectionCounts[0]) {
    generatedInsights.push(
      await createInsight({
        type: "objection",
        summary: `A objeção mais frequente foi ${objectionCounts[0].term}.`,
        evidence: { objections: objectionCounts },
        recommendation: `Revisar resposta aprovada para ${objectionCounts[0].term} no playbook e testar uma abordagem mais consultiva.`
      })
    );
  }

  return {
    analyzedMessages: rows.length,
    responseRate,
    generatedInsights,
    createdAt: new Date().toISOString()
  };
}
