import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";

export async function createAutomationJob(input: {
  leadId: string;
  conversationId?: string;
  type: "follow_up" | "learning" | "outreach";
  scheduledAt: string;
  attempt?: number;
  payload?: Record<string, unknown>;
}) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("automation_jobs")
    .insert({
      company_id: companyId,
      lead_id: input.leadId,
      conversation_id: input.conversationId,
      type: input.type,
      scheduled_at: input.scheduledAt,
      attempt: input.attempt ?? 0,
      payload: input.payload ?? {}
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getDueAutomationJobs(type: string, limit = 50) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  const { data, error } = await supabase
    .from("automation_jobs")
    .select("*")
    .eq("company_id", companyId)
    .eq("type", type)
    .eq("status", "pending")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function updateAutomationJob(id: string, data: Record<string, unknown>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");

  const { data: saved, error } = await supabase
    .from("automation_jobs")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return saved;
}
