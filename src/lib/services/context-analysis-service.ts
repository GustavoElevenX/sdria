import { cases, leadContexts } from "@/lib/mock-data";
import { calculateContextScore, canProspectAutomatically, classifyContextLevel, getMissingContextFields } from "@/lib/scoring";
import type { AgentSettings, Lead } from "@/lib/types";

export function calculateLeadScore(lead: Lead) {
  const recencyBonus = lead.lastInteractionAt ? 8 : 0;
  const sourceBonus = lead.source.toLowerCase().includes("anúncio") || lead.source.toLowerCase().includes("ads") ? 10 : 0;
  return Math.min(100, Math.round(lead.contextScore * 0.7 + recencyBonus + sourceBonus));
}

export function analyzeLeadContext(lead: Lead, settings?: AgentSettings) {
  const context = leadContexts.find((item) => item.leadId === lead.id);
  const contextScore = calculateContextScore(lead, context);
  const contextLevel = classifyContextLevel(contextScore);
  const missingFields = getMissingContextFields(lead, context);
  const readyForOutreach = canProspectAutomatically(contextLevel, settings?.qualificationRules);
  const recommendedCases = cases
    .filter((caseStudy) => caseStudy.active)
    .filter((caseStudy) => {
      const haystack = `${caseStudy.segment} ${caseStudy.subsegment} ${caseStudy.tags.join(" ")}`.toLowerCase();
      return haystack.includes((context?.serviceInterest ?? "").toLowerCase().split(" ")[0]) || haystack.includes("saude");
    })
    .slice(0, 2)
    .map((caseStudy) => caseStudy.id);

  return {
    context_score: contextScore,
    context_level: contextLevel,
    missing_fields: missingFields,
    suggested_questions_for_team:
      context?.suggestedQuestionsForTeam.length ? context.suggestedQuestionsForTeam : [
        "Qual serviço foi apresentado para esse lead?",
        "Ele recebeu proposta?",
        "Qual era a principal dor dele?",
        "Ele demonstrou objeção de preço, prazo ou confiança?",
        "Quem participa da decisão?",
        "Existe algum case que a equipe quer priorizar?"
      ],
    recommended_angle:
      context?.aiRecommendedAngle ??
      "Pedir mais contexto interno antes de montar uma abordagem de prospecção.",
    recommended_cases: recommendedCases,
    risk:
      contextLevel === "baixo"
        ? "contexto insuficiente para prospecção ativa"
        : contextLevel === "medio"
          ? "abordagem deve passar por revisão humana"
          : "seguir sem prometer resultados garantidos",
    ready_for_outreach: readyForOutreach
  };
}
