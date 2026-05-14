import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { LearningInsight } from "@/lib/types";

export function AIInsightCard({ insight }: { insight: LearningInsight }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={insight.status === "pending" ? "warning" : "success"}>{insight.status}</Badge>
        <span className="text-xs text-muted-foreground">{insight.type}</span>
      </div>
      <h3 className="mt-3 text-sm font-semibold">{insight.summary}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{insight.recommendation}</p>
    </Panel>
  );
}
