import { LearningInsightCard } from "@/components/LearningInsightCard";
import { MetricCard } from "@/components/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { getLearningInsights } from "@/lib/services/learning-service";

export default async function LearningPage() {
  const insights = await getLearningInsights();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Aprendizado operacional</h1>
        <p className="text-sm text-muted-foreground">Padrões de conversas, mensagens, cases, objeções e sugestões aprováveis.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Insights registrados" value={insights.length.toString()} />
        <MetricCard label="Aprovados" value={insights.filter((item) => item.status === "approved").length.toString()} />
        <MetricCard label="Sugestões pendentes" value={insights.filter((item) => item.status === "pending").length.toString()} />
      </div>
      <Panel>
        <PanelHeader title="Métricas de aprendizado" />
        <div className="grid gap-3 p-4 text-sm md:grid-cols-2 lg:grid-cols-4">
          {["Melhores mensagens", "Piores mensagens", "Melhores ângulos por etapa", "Objeções comuns", "Cases que avançam", "Horários de resposta", "Segmentos que convertem", "Motivos de perda"].map((metric) => (
            <div key={metric} className="rounded-md bg-muted p-3 text-muted-foreground">{metric}</div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4">
        {insights.map((insight) => <LearningInsightCard key={insight.id} insight={insight} />)}
      </div>
    </div>
  );
}
