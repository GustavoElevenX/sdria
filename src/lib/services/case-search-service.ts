import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapCase } from "@/lib/supabase/mappers";
import type { CaseStudy, LeadContext } from "@/lib/types";

export async function getCases(): Promise<CaseStudy[]> {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  const { data, error } = await supabase
    .from("cases")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapCase);
}

export async function getCaseById(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapCase(data) : null;
}

export async function upsertCase(input: Partial<CaseStudy> & { id?: string }) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("cases")
    .upsert({
      id: input.id,
      company_id: companyId,
      title: input.title,
      client_alias: input.clientAlias,
      is_confidential: input.isConfidential ?? true,
      segment: input.segment,
      subsegment: input.subsegment,
      initial_problem: input.initialProblem,
      before_scenario: input.beforeScenario,
      implemented_solution: input.implementedSolution,
      sold_service: input.soldService,
      result_obtained: input.resultObtained,
      time_to_result: input.timeToResult,
      objections_faced: input.objectionsFaced,
      when_to_use: input.whenToUse,
      when_not_to_use: input.whenNotToUse,
      proofs_available: input.proofsAvailable,
      internal_notes: input.internalNotes,
      tags: input.tags ?? [],
      active: input.active ?? true,
      updated_at: new Date().toISOString()
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapCase(data);
}

export async function deleteCase(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");
  const { error } = await supabase.from("cases").delete().eq("id", id);
  if (error) throw error;
  return { id, deleted: true };
}

export async function searchRelevantCases(query: string, leadContext?: Partial<LeadContext>): Promise<CaseStudy[]> {
  const cases = await getCases();
  const terms = `${query} ${leadContext?.serviceInterest ?? ""} ${leadContext?.mainPain ?? ""}`.toLowerCase();
  return cases
    .filter((caseStudy) => caseStudy.active)
    .map((caseStudy) => {
      const searchable = [
        caseStudy.title,
        caseStudy.segment,
        caseStudy.subsegment,
        caseStudy.initialProblem,
        caseStudy.soldService,
        caseStudy.tags.join(" ")
      ].join(" ").toLowerCase();
      const score = terms.split(/\s+/).filter((term) => term.length > 3 && searchable.includes(term)).length;
      return { caseStudy, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.caseStudy);
}
