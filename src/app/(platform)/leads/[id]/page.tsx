import { notFound } from "next/navigation";
import { AgentStatusBadge } from "@/components/AgentStatusBadge";
import { CaseCard } from "@/components/CaseCard";
import { LeadContextPanel } from "@/components/LeadContextPanel";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { getCases } from "@/lib/services/case-search-service";
import { getLeadData } from "@/lib/services/lead-service";
import { getMessagesForLead } from "@/lib/services/message-service";
import { formatCurrency } from "@/lib/utils";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLeadData(id);
  if (!data?.lead || !data.context) notFound();
  const [allCases, history] = await Promise.all([getCases(), getMessagesForLead(data.lead.id)]);
  const relatedCases = allCases.filter((caseStudy) => data.context?.aiRecommendedCases.includes(caseStudy.id));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{data.lead.name}</h1>
          <p className="text-sm text-muted-foreground">{data.lead.companyName || "Empresa não informada"} · {data.lead.source}</p>
        </div>
        <AgentStatusBadge status={data.lead.aiStatus} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <PanelHeader title="Dados básicos" />
          <dl className="grid gap-3 p-4 text-sm md:grid-cols-2">
            {[
              ["Telefone", data.lead.phone],
              ["Email", data.lead.email ?? "Não informado"],
              ["Etapa", data.lead.stage],
              ["Status", data.lead.status],
              ["Responsável", data.lead.owner],
              ["Valor estimado", formatCurrency(data.lead.estimatedValue)]
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel>
          <PanelHeader title="Contexto comercial" />
          <dl className="grid gap-3 p-4 text-sm md:grid-cols-2">
            {[
              ["Serviço de interesse", data.context.serviceInterest || "Não informado"],
              ["Principal dor", data.context.mainPain || "Não informada"],
              ["Objeções conhecidas", data.context.knownObjections || "Não informadas"],
              ["Urgência", data.context.urgency || "Não informada"],
              ["Decisor", data.context.decisionMaker || "Não informado"],
              ["Observações internas", data.context.internalNotes || "Sem notas"]
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
      <LeadContextPanel lead={data.lead} context={data.context} />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Panel>
          <PanelHeader title="Histórico de conversa" />
          <div className="space-y-3 p-4 text-sm">
            {history.map((message) => (
              <div key={message.id} className="rounded-md bg-muted p-3">
                <p className="font-medium">{message.senderType}</p>
                <p className="text-muted-foreground">{message.content}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Ações" />
          <div className="grid gap-2 p-4">
            {["Analisar contexto novamente", "Liberar prospecção", "Pausar IA", "Assumir conversa", "Agendar reunião manualmente", "Marcar como perdido", "Marcar opt-out"].map((action) => (
              <Button key={action} variant={action.includes("opt-out") ? "danger" : "secondary"}>{action}</Button>
            ))}
          </div>
        </Panel>
      </div>
      <section>
        <h2 className="mb-3 text-lg font-semibold">Cases relacionados</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {relatedCases.map((caseStudy) => <CaseCard key={caseStudy.id} caseStudy={caseStudy} />)}
        </div>
      </section>
    </div>
  );
}
