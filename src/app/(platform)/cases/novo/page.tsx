import { CaseForm } from "@/components/CaseForm";
import { Panel, PanelHeader } from "@/components/ui/panel";

export default function NewCasePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Novo case</h1>
        <p className="text-sm text-muted-foreground">Estruture o case para uso consultivo, sem promessas ou resultados inventados.</p>
      </div>
      <Panel>
        <PanelHeader title="Campos do case" />
        <CaseForm />
      </Panel>
    </div>
  );
}
