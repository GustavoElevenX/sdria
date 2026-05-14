import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { CaseStudy } from "@/lib/types";

export function CaseCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{caseStudy.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{caseStudy.clientAlias} · {caseStudy.segment}</p>
        </div>
        <Badge tone={caseStudy.active ? "success" : "muted"}>{caseStudy.active ? "ativo" : "inativo"}</Badge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{caseStudy.initialProblem}</p>
      <p className="mt-3 text-sm"><strong>Uso:</strong> {caseStudy.whenToUse}</p>
    </Panel>
  );
}
