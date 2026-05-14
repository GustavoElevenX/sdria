import { KnowledgeForm } from "@/components/KnowledgeForm";
import { Panel, PanelHeader } from "@/components/ui/panel";

export default function NewKnowledgePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Novo conteúdo</h1>
        <p className="text-sm text-muted-foreground">Ao salvar, o sistema gera chunks e embeddings para busca semântica.</p>
      </div>
      <Panel>
        <PanelHeader title="Documento da empresa" />
        <KnowledgeForm />
      </Panel>
    </div>
  );
}
