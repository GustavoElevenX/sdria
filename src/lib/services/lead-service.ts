import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapLead, mapLeadContext } from "@/lib/supabase/mappers";
import type { Lead } from "@/lib/types";

const leadSelect = `
  *,
  profiles:owner_id(name),
  lead_contexts(ready_for_outreach),
  meetings(id)
`;

export async function getLeads(filters?: Partial<Pick<Lead, "stage" | "status" | "source" | "owner" | "contextLevel">>) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  let query = supabase.from("leads").select(leadSelect).eq("company_id", companyId).order("created_at", { ascending: false });

  if (filters?.stage) query = query.eq("stage", filters.stage);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.contextLevel) query = query.eq("context_level", filters.contextLevel);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapLead);
}

export async function getLeadData(leadId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const [{ data: lead, error: leadError }, { data: context, error: contextError }] = await Promise.all([
    supabase.from("leads").select(leadSelect).eq("id", leadId).maybeSingle(),
    supabase.from("lead_contexts").select("*").eq("lead_id", leadId).maybeSingle()
  ]);

  if (leadError) throw leadError;
  if (contextError) throw contextError;
  if (!lead) return null;

  return {
    lead: mapLead(lead),
    context: context ? mapLeadContext(context) : null
  };
}

export async function createLead(input: Partial<Lead> & Record<string, unknown>) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("leads")
    .insert({
      company_id: companyId,
      name: input.name,
      company_name: input.companyName,
      phone: input.phone,
      email: input.email,
      source: input.source ?? "Importação",
      stage: input.stage ?? "Novo lead",
      status: input.status ?? "Importado",
      estimated_value: input.estimatedValue ?? 0,
      context_level: input.contextLevel ?? "baixo",
      context_score: input.contextScore ?? 0,
      lead_score: input.leadScore ?? 0,
      ai_status: input.aiStatus ?? "waiting_context"
    })
    .select(leadSelect)
    .single();

  if (error) throw error;
  return mapLead(data);
}

export async function updateLeadContext(leadId: string, data: Record<string, unknown>) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const payload = {
    company_id: companyId,
    lead_id: leadId,
    main_pain: data.mainPain,
    service_interest: data.serviceInterest,
    known_objections: data.knownObjections,
    urgency: data.urgency,
    decision_maker: data.decisionMaker,
    commercial_context: data.commercialContext,
    internal_notes: data.internalNotes,
    ai_summary: data.aiSummary,
    ai_recommended_angle: data.aiRecommendedAngle,
    ai_missing_fields: data.aiMissingFields,
    ai_recommended_cases: data.aiRecommendedCases,
    ai_risks: data.risks,
    ai_suggested_questions: data.suggestedQuestionsForTeam,
    ready_for_outreach: data.readyForOutreach,
    updated_at: new Date().toISOString()
  };

  const { data: saved, error } = await supabase
    .from("lead_contexts")
    .upsert(payload, { onConflict: "lead_id" })
    .select("*")
    .single();

  if (error) throw error;
  return mapLeadContext(saved);
}

export async function updateLeadStage(leadId: string, stage: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("leads")
    .update({ stage, updated_at: new Date().toISOString() })
    .eq("id", leadId)
    .select(leadSelect)
    .single();

  if (error) throw error;
  return mapLead(data);
}

export async function updateLeadAiState(leadId: string, data: { aiStatus?: string; status?: string; leadScore?: number; contextScore?: number; contextLevel?: string }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");

  const { data: saved, error } = await supabase
    .from("leads")
    .update({
      ai_status: data.aiStatus,
      status: data.status,
      lead_score: data.leadScore,
      context_score: data.contextScore,
      context_level: data.contextLevel,
      updated_at: new Date().toISOString()
    })
    .eq("id", leadId)
    .select(leadSelect)
    .single();

  if (error) throw error;
  return mapLead(saved);
}

export async function markOptOut(leadId: string) {
  return updateLeadAiState(leadId, { aiStatus: "opt_out", status: "Opt-out" });
}
