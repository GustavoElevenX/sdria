import { notFound } from "next/navigation";
import { CaseCard } from "@/components/CaseCard";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { getCaseById } from "@/lib/services/case-search-service";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseStudy = await getCaseById(id);
  if (!caseStudy) notFound();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">{caseStudy.title}</h1>
        <p className="text-sm text-muted-foreground">Regras de uso e limites para a IA.</p>
      </div>
      <CaseCard caseStudy={caseStudy} />
      <Panel>
        <PanelHeader title="Governança do case" />
        <div className="grid gap-3 p-4 text-sm text-muted-foreground">
          <p>A IA não pode inventar resultados, nomes reais ou garantias.</p>
          <p>Se o case estiver confidencial, use apenas o apelido público.</p>
          <p>Use como argumento consultivo e nunca como promessa comercial.</p>
        </div>
      </Panel>
    </div>
  );
}
