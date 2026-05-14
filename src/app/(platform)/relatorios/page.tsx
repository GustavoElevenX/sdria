import { MetricCard } from "@/components/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { getReportMetrics } from "@/lib/services/report-service";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const data = await getReportMetrics(params);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Filtros por período, etapa, origem e responsável.</p>
      </div>
      <Panel className="p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {["from", "to", "stage", "source", "owner", "segment", "template", "case"].map((filter) => (
            <label key={filter} className="grid gap-2 text-sm">
              <span>{filter}</span>
              <input name={filter} defaultValue={params[filter] ?? ""} className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" />
            </label>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.cards.map((indicator) => <MetricCard key={indicator.label} label={indicator.label} value={indicator.value} />)}
      </div>
      <Panel>
        <PanelHeader title="Quebras de performance" />
        <div className="grid gap-3 p-4 md:grid-cols-3">
          {data.breakdowns.map((item) => (
            <div key={item.label} className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{item.label}</p>
              <pre className="mt-2 whitespace-pre-wrap text-xs">{JSON.stringify(item.value, null, 2)}</pre>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
