import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function isSupabaseConfigured() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) return null;

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function getCompanyId() {
  if (env.DEFAULT_COMPANY_ID) return env.DEFAULT_COMPANY_ID;

  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.from("companies").select("id").order("created_at", { ascending: true }).limit(1).maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}
