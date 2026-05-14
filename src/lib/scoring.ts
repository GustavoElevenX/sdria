import type { ContextLevel, Lead, LeadContext } from "@/lib/types";
import { normalizePhone } from "@/lib/utils";

export function calculateContextScore(lead: Partial<Lead>, context?: Partial<LeadContext>) {
  let score = 0;

  if (lead.name) score += 10;
  if (normalizePhone(lead.phone).length >= 13) score += 20;
  if (lead.companyName) score += 10;
  if (lead.stage) score += 10;
  if (context?.serviceInterest) score += 15;
  if (context?.mainPain) score += 15;
  if (context?.knownObjections) score += 10;
  if (context?.commercialContext || context?.internalNotes) score += 10;

  return Math.min(score, 100);
}

export function classifyContextLevel(score: number): ContextLevel {
  if (score < 40) return "baixo";
  if (score < 70) return "medio";
  return "alto";
}

export function getMissingContextFields(lead: Partial<Lead>, context?: Partial<LeadContext>) {
  const missing: string[] = [];
  if (!lead.phone || normalizePhone(lead.phone).length < 13) missing.push("telefone válido");
  if (!lead.companyName) missing.push("empresa");
  if (!lead.stage) missing.push("etapa do funil");
  if (!context?.serviceInterest) missing.push("serviço de interesse");
  if (!context?.mainPain) missing.push("dor principal");
  if (!context?.knownObjections) missing.push("objeção conhecida");
  if (!context?.commercialContext && !context?.internalNotes) missing.push("histórico ou observação útil");
  return missing;
}

export function canProspectAutomatically(level: ContextLevel, rules?: Record<string, unknown>) {
  const automatic = rules?.automaticProspectingByContext as Record<string, boolean> | undefined;
  return automatic?.[level] ?? level === "alto";
}
