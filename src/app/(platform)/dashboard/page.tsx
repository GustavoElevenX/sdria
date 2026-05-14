import { AIInsightCard } from "@/components/AIInsightCard";
import { FunnelChart } from "@/components/FunnelChart";
import { MetricCard } from "@/components/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { getDashboardMetrics } from "@/lib/services/dashboard-service";
import { formatPercent } from "@/lib/utils";

export default function DashboardPage() {
  const data = getDashboardMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão executiva da operação, IA, funil e aprendizado.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {data.cards.map((card) => <MetricCard key={card.label} {...card} />)}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <FunnelChart data={data.funnel} />
        <Panel>
          <PanelHeader title="Taxa de resposta por dia" eyebrow="Últimos dias úteis" />
          <div className="grid grid-cols-5 items-end gap-3 p-4">
            {data.responseByDay.map((item) => (
              <div key={item.label} className="grid gap-2 text-center text-sm">
                <div className="mx-auto flex h-40 w-full max-w-16 items-end rounded-md bg-muted">
                  <div className="w-full rounded-md bg-accent" style={{ height: `${item.value * 100}%` }} />
                </div>
                <span className="text-muted-foreground">{item.label}</span>
                <strong>{formatPercent(item.value)}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold">Insights da IA</h2>
          <p className="text-sm text-muted-foreground">Sugestões operacionais pendentes de aprovação humana.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {data.insights.map((insight) => <AIInsightCard key={insight.id} insight={insight} />)}
        </div>
      </section>
    </div>
  );
}
