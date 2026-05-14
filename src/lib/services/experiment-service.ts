import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";

export async function getActiveExperiment() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return null;

  const { data, error } = await supabase
    .from("experiments")
    .select("*")
    .eq("company_id", companyId)
    .eq("status", "running")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getExperiments() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];
  const { data, error } = await supabase.from("experiments").select("*").eq("company_id", companyId).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createExperiment(input: { name: string; hypothesis?: string; variants: Array<Record<string, unknown>>; status?: string }) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("experiments")
    .insert({
      company_id: companyId,
      name: input.name,
      hypothesis: input.hypothesis,
      variants: input.variants,
      metrics: { primary: "response_rate", secondary: "scheduled_meeting" },
      status: input.status ?? "draft"
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function chooseExperimentVariant(leadId: string) {
  const experiment = await getActiveExperiment();
  const variants = experiment?.variants as Array<Record<string, any>> | undefined;
  if (!experiment || !variants?.length) return null;
  const index = Math.abs([...leadId].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % variants.length;
  return { experiment, variant: variants[index] };
}

export async function calculateExperimentMetrics(experimentId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");

  const { data: experiment, error: experimentError } = await supabase.from("experiments").select("*").eq("id", experimentId).single();
  if (experimentError) throw experimentError;

  const variants = (experiment.variants ?? []) as Array<Record<string, any>>;
  const metrics = [];
  for (const variant of variants) {
    const variantId = String(variant.id ?? variant.name);
    const { data: sent, error } = await supabase
      .from("messages")
      .select("lead_id, created_at")
      .contains("metadata", { experimentId, variantId });
    if (error) throw error;
    const leadIds = [...new Set((sent ?? []).map((message) => message.lead_id))];
    const { data: replies } = leadIds.length
      ? await supabase.from("messages").select("lead_id").in("lead_id", leadIds).eq("sender_type", "lead")
      : { data: [] };
    metrics.push({
      variantId,
      sent: sent?.length ?? 0,
      replies: replies?.length ?? 0,
      responseRate: sent?.length ? (replies?.length ?? 0) / sent.length : 0
    });
  }

  const winner = metrics.sort((a, b) => b.responseRate - a.responseRate)[0]?.variantId;
  await supabase.from("experiments").update({ metrics, winner_variant: winner, updated_at: new Date().toISOString() }).eq("id", experimentId);
  return { experimentId, metrics, winnerVariant: winner };
}
