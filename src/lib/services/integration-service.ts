import { env } from "@/lib/env";
import { integrations } from "@/lib/mock-data";

export function getIntegrations() {
  return integrations.map((integration) => {
    if (integration.type === "openai" && env.OPENAI_API_KEY) return { ...integration, status: "conectado" as const, lastError: undefined };
    if (integration.type === "whatsapp" && env.WHATSAPP_ACCESS_TOKEN) return { ...integration, status: "conectado" as const, lastError: undefined };
    if (integration.type === "supabase" && env.DATABASE_URL) return { ...integration, status: "conectado" as const, lastError: undefined };
    if (integration.type === "google_calendar" && env.GOOGLE_CLIENT_ID) return { ...integration, status: "conectado" as const, lastError: undefined };
    return integration;
  });
}

export function testIntegration(type: string) {
  const integration = getIntegrations().find((item) => item.type === type);
  return {
    type,
    status: integration?.status ?? "desconectado",
    checkedAt: new Date().toISOString(),
    error: integration?.lastError
  };
}
