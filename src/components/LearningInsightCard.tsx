import { Check, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { LearningInsight } from "@/lib/types";

export function LearningInsightCard({ insight }: { insight: LearningInsight }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <Badge tone={insight.status === "pending" ? "warning" : "success"}>{insight.status}</Badge>
        <span className="text-xs text-muted-foreground">{insight.type}</span>
      </div>
      <h3 className="mt-3 font-semibold">{insight.summary}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{insight.recommendation}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="h-8"><Check size={15} /> Aprovar</Button>
        <Button className="h-8" variant="secondary"><X size={15} /> Rejeitar</Button>
        <Button className="h-8" variant="secondary"><Pencil size={15} /> Editar e aprovar</Button>
        <Button className="h-8" variant="secondary">Teste A/B</Button>
        <Button className="h-8" variant="ghost">Arquivar</Button>
      </div>
    </Panel>
  );
}
