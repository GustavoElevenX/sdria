import { Badge } from "@/components/ui/badge";
import type { ContextLevel } from "@/lib/types";

export function ContextScoreBadge({ score, level }: { score: number; level: ContextLevel }) {
  const tone = level === "alto" ? "success" : level === "medio" ? "warning" : "danger";
  return <Badge tone={tone}>{score}/100 · contexto {level}</Badge>;
}
