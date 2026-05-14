import { Panel, PanelHeader } from "@/components/ui/panel";
import { ContextScoreBadge } from "@/components/ContextScoreBadge";
import type { Lead, LeadContext } from "@/lib/types";

export function LeadContextPanel({ lead, context }: { lead: Lead; context: LeadContext }) {
  return (
    <Panel>
      <PanelHeader title="Análise da IA" eyebrow="Contexto e abordagem" />
      <div className="space-y-4 p-4 text-sm">
        <ContextScoreBadge score={lead.contextScore} level={lead.contextLevel} />
        <div>
          <p className="font-medium">Resumo</p>
          <p className="mt-1 text-muted-foreground">{context.aiSummary}</p>
        </div>
        <div>
          <p className="font-medium">Abordagem sugerida</p>
          <p className="mt-1 text-muted-foreground">{context.aiRecommendedAngle}</p>
        </div>
        <div>
          <p className="font-medium">Pontos faltantes</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(context.aiMissingFields.length ? context.aiMissingFields : ["Contexto suficiente"]).map((field) => (
              <span key={field} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{field}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">Perguntas para melhorar contexto</p>
          <ol className="mt-2 space-y-2 text-muted-foreground">
            {context.suggestedQuestionsForTeam.map((question) => <li key={question}>{question}</li>)}
          </ol>
        </div>
      </div>
    </Panel>
  );
}
