import { LeadImportForm } from "@/components/LeadImportForm";
import { Panel, PanelHeader } from "@/components/ui/panel";

const steps = ["Upload do arquivo", "Preview das linhas", "Mapeamento de colunas", "Normalização de telefone", "Deduplicação", "Validação", "Importação", "Análise inicial de contexto"];
const fields = ["nome", "titulo", "empresa", "telefone", "email", "etapa", "status", "origem", "responsavel", "valor", "observacoes", "historico"];

export default function ImportLeadsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Importar leads</h1>
        <p className="text-sm text-muted-foreground">CSV/XLSX com preview, deduplicação e análise de contexto após importar.</p>
      </div>
      <LeadImportForm />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Fluxo de importação" />
          <ol className="grid gap-2 p-4 text-sm text-muted-foreground">
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </Panel>
        <Panel>
          <PanelHeader title="Campos esperados" />
          <div className="flex flex-wrap gap-2 p-4">
            {fields.map((field) => <span key={field} className="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">{field}</span>)}
          </div>
        </Panel>
      </div>
    </div>
  );
}
