import { knowledgeDocuments } from "@/lib/mock-data";

export function searchKnowledgeBase(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter((term) => term.length > 3);
  return knowledgeDocuments
    .filter((document) => document.active)
    .map((document) => {
      const searchable = `${document.title} ${document.type} ${document.content} ${document.tags.join(" ")}`.toLowerCase();
      const score = terms.filter((term) => searchable.includes(term)).length;
      return { document, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.document);
}
