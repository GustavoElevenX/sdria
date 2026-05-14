import { calculateContextScore, canProspectAutomatically, classifyContextLevel, getMissingContextFields } from "@/lib/scoring";
import { searchRelevantCases } from "@/lib/services/case-search-service";
import { getLeadData, updateLeadAiState, updateLeadContext } from "@/lib/services/lead-service";
import { getAgentSettings } from "@/lib/services/settings-service";
import type { Lead, LeadContext } from "@/lib/types";

export function calculateLeadScore(lead: Lead) {
  const recencyBonus = lead.lastInteractionAt ? 8 : 0;
  const sourceBonus = lead.source.toLowerCase().includes("anúncio") || lead.source.toLowerCase().includes("ads") ? 10 : 0;
  return Math.min(100, Math.round(lead.contextScore * 0.7 + recencyBonus + sourceBonus));
}

function suggestedQuestions(missingFields: string[]) {
  const questions: Record<string, string> = {
    "telefone válido": "Existe telefone válido ou WhatsApp confirmado para esse lead?",
    empresa: "Qual empresa ou operação esse lead representa?",
    "etapa do funil": "Em qual etapa comercial esse lead parou?",
    "serviço de interesse": "Qual serviço foi apresentado para esse lead?",
    "dor principal": "Qual era a principal dor dele?",
    "objeção conhecida": "Ele demonstrou objeção de preço, prazo, confiança ou prioridade?",
    "histórico ou observação útil": "Existe histórico, proposta, call anterior ou observação útil para contextualizar a abordagem?"
  };

  return missingFields.map((field) => questions[field] ?? `Complete a informação: ${field}`);
}

export async function analyzeLeadContext(lead: Lead, context?: LeadContext | null) {
  const settings = await getAgentSettings();
  const contextScore = calculateContextScore(lead, context ?? undefined);
  const contextLevel = classifyContextLevel(contextScore);
  const missingFields = getMissingContextFields(lead, context ?? undefined);
  const readyForOutreach = canProspectAutomatically(contextLevel, settings?.qualificationRules);
  const relevantCases = await searchRelevantCases(`${lead.companyName} ${lead.stage} ${context?.serviceInterest ?? ""} ${context?.mainPain ?? ""}`, context ?? undefined);

  return {
    context_score: contextScore,
    context_level: contextLevel,
    missing_fields: missingFields,
    suggested_questions_for_team: suggestedQuestions(missingFields),
    recommended_angle:
      context?.aiRecommendedAngle ||
      (contextLevel === "baixo"
        ? "Pedir contexto interno antes de prospectar para evitar abordagem genérica."
        : "Retomar conversa com foco em diagnóstico, dor registrada e próximo passo qualificado."),
    recommended_cases: relevantCases.slice(0, 3).map((caseStudy) => caseStudy.id),
    risk:
      contextLevel === "baixo"
        ? "Contexto insuficiente para prospecção ativa."
        : contextLevel === "medio"
          ? "Pode prospectar apenas com revisão humana."
          : "Pode prospectar, mantendo limites de promessa e uso de cases aprovados.",
    ready_for_outreach: readyForOutreach
  };
}

export async function analyzeAndPersistLeadContext(leadId: string) {
  const data = await getLeadData(leadId);
  if (!data?.lead) return null;

  const analysis = await analyzeLeadContext(data.lead, data.context);
  await updateLeadAiState(leadId, {
    contextScore: analysis.context_score,
    contextLevel: analysis.context_level,
    leadScore: calculateLeadScore({ ...data.lead, contextScore: analysis.context_score }),
    aiStatus: analysis.ready_for_outreach ? "active" : "waiting_context",
    status: analysis.ready_for_outreach ? "Pronto para prospecção" : "Contexto insuficiente"
  });

  await updateLeadContext(leadId, {
    ...(data.context ?? {}),
    aiSummary: data.context?.aiSummary || `Contexto ${analysis.context_level} com score ${analysis.context_score}.`,
    aiRecommendedAngle: analysis.recommended_angle,
    aiMissingFields: analysis.missing_fields,
    aiRecommendedCases: analysis.recommended_cases,
    risks: [analysis.risk],
    suggestedQuestionsForTeam: analysis.suggested_questions_for_team,
    readyForOutreach: analysis.ready_for_outreach
  });

  return analysis;
}
