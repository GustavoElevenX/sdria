import { cases } from "@/lib/mock-data";
import type { LeadContext } from "@/lib/types";

export function searchRelevantCases(query: string, leadContext?: Partial<LeadContext>) {
  const terms = `${query} ${leadContext?.serviceInterest ?? ""} ${leadContext?.mainPain ?? ""}`.toLowerCase();
  return cases
    .filter((caseStudy) => caseStudy.active)
    .map((caseStudy) => {
      const searchable = [
        caseStudy.title,
        caseStudy.segment,
        caseStudy.subsegment,
        caseStudy.initialProblem,
        caseStudy.soldService,
        caseStudy.tags.join(" ")
      ].join(" ").toLowerCase();
      const score = terms.split(/\s+/).filter((term) => term.length > 3 && searchable.includes(term)).length;
      return { caseStudy, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.caseStudy);
}
