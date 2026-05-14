import { env } from "@/lib/env";
import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapIntegration } from "@/lib/supabase/mappers";

export async function getIntegrations() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) {
    return [
      { id: "whatsapp", type: "whatsapp" as const, status: env.WHATSAPP_ACCESS_TOKEN ? "conectado" as const : "desconectado" as const, lastError: env.WHATSAPP_ACCESS_TOKEN ? undefined : "WHATSAPP_ACCESS_TOKEN ausente" },
      { id: "openai", type: "openai" as const, status: env.OPENAI_API_KEY ? "conectado" as const : "desconectado" as const, lastError: env.OPENAI_API_KEY ? undefined : "OPENAI_API_KEY ausente" },
      { id: "supabase", type: "supabase" as const, status: "desconectado" as const, lastError: "Supabase não configurado" },
      { id: "google_calendar", type: "google_calendar" as const, status: env.GOOGLE_REFRESH_TOKEN ? "conectado" as const : "desconectado" as const, lastError: env.GOOGLE_REFRESH_TOKEN ? undefined : "GOOGLE_REFRESH_TOKEN ausente" }
    ];
  }

  const { data, error } = await supabase.from("integrations").select("*").eq("company_id", companyId).order("type");
  if (error) throw error;

  const persisted = (data ?? []).map(mapIntegration);
  const required = ["whatsapp", "openai", "supabase", "google_calendar"] as const;
  return required.map((type) => {
    const saved = persisted.find((item) => item.type === type);
    if (saved) return saved;
    return {
      id: type,
      type,
      status: type === "openai" && env.OPENAI_API_KEY ? "conectado" as const : type === "whatsapp" && env.WHATSAPP_ACCESS_TOKEN ? "conectado" as const : type === "supabase" ? "conectado" as const : "desconectado" as const,
      lastError: undefined
    };
  });
}

export async function recordIntegrationTest(type: string, status: string, error?: string) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return { type, status, checkedAt: new Date().toISOString(), error };

  const { data, error: dbError } = await supabase
    .from("integrations")
    .upsert(
      {
        company_id: companyId,
        type,
        status,
        last_checked_at: new Date().toISOString(),
        last_error: error ?? null
      },
      { onConflict: "company_id,type" }
    )
    .select("*")
    .single();

  if (dbError) throw dbError;
  return mapIntegration(data);
}

export async function testIntegration(type: string) {
  if (type === "openai") return recordIntegrationTest(type, env.OPENAI_API_KEY ? "conectado" : "desconectado", env.OPENAI_API_KEY ? undefined : "OPENAI_API_KEY ausente");
  if (type === "whatsapp") return recordIntegrationTest(type, env.WHATSAPP_ACCESS_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID ? "conectado" : "desconectado", env.WHATSAPP_ACCESS_TOKEN ? undefined : "WHATSAPP_ACCESS_TOKEN ausente");
  if (type === "google_calendar") return recordIntegrationTest(type, env.GOOGLE_REFRESH_TOKEN ? "conectado" : "desconectado", env.GOOGLE_REFRESH_TOKEN ? undefined : "GOOGLE_REFRESH_TOKEN ausente");
  if (type === "supabase") return recordIntegrationTest(type, getSupabaseAdmin() ? "conectado" : "desconectado", getSupabaseAdmin() ? undefined : "Supabase não configurado");
  return recordIntegrationTest(type, "desconectado", "Integração desconhecida");
}
