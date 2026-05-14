import { leadContexts, leads } from "@/lib/mock-data";
import type { Lead } from "@/lib/types";

export function getLeads(filters?: Partial<Pick<Lead, "stage" | "status" | "source" | "owner" | "contextLevel">>) {
  if (!filters) return leads;
  return leads.filter((lead) =>
    Object.entries(filters).every(([key, value]) => !value || lead[key as keyof Lead] === value)
  );
}

export function getLeadData(leadId: string) {
  const lead = leads.find((item) => item.id === leadId);
  if (!lead) return null;
  return {
    lead,
    context: leadContexts.find((item) => item.leadId === leadId) ?? null
  };
}

export function updateLeadContext(leadId: string, data: Record<string, unknown>) {
  return {
    leadId,
    updated: true,
    data,
    updatedAt: new Date().toISOString()
  };
}

export function updateLeadStage(leadId: string, stage: string) {
  return {
    leadId,
    stage,
    updatedAt: new Date().toISOString()
  };
}

export function markOptOut(leadId: string) {
  return {
    leadId,
    aiStatus: "opt_out",
    status: "Opt-out",
    updatedAt: new Date().toISOString()
  };
}
