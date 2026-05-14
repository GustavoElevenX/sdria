import { MetricCard } from "@/components/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/panel";

const indicators = [
  "Leads importados",
  "Leads contatados",
  "Leads respondidos",
  "Leads qualificados",
  "Reuniões agendadas",
  "Taxa de resposta",
  "Taxa de qualificação",
  "Taxa de reunião",
  "Taxa de opt-out",
  "Tempo médio até primeira resposta",
  "Conversas assumidas por humano"
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Filtros por período, etapa, origem e responsável.</p>
      </div>
      <Panel className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {["Período", "Etapa", "Origem", "Responsável"].map((filter) => (
            <label key={filter} className="grid gap-2 text-sm">
              <span>{filter}</span>
              <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" />
            </label>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicators.map((indicator, index) => <MetricCard key={indicator} label={indicator} value={index < 5 ? String(24 + index * 7) : `${31 + index}%`} />)}
      </div>
      <Panel>
        <PanelHeader title="Quebras de performance" />
        <div className="grid gap-3 p-4 md:grid-cols-3">
          {["Performance por etapa", "Performance por origem", "Performance por responsável"].map((item) => (
            <div key={item} className="rounded-md bg-muted p-4 text-sm text-muted-foreground">{item}</div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
