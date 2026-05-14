import { agentSettings } from "@/lib/mock-data";

export function getAgentSettings() {
  return agentSettings;
}

export function updateAgentSettings(data: Record<string, unknown>) {
  return {
    ...agentSettings,
    ...data,
    updatedAt: new Date().toISOString()
  };
}
