import { Filter, Pause, Play, Upload, UserPlus } from "lucide-react";
import { LeadTable } from "@/components/LeadTable";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getLeads } from "@/lib/services/lead-service";

const filters = ["Etapa", "Status", "Origem", "Responsável", "Nível de contexto", "Pronto para prospecção", "Precisa de humano", "Com reunião", "Sem telefone", "Sem contexto"];

export default async function LeadsPage() {
  const leads = await getLeads();
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">CRM simples com contexto, score, IA e ações em massa.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary"><Upload size={16} /> Importar leads</Button>
          <Button><Play size={16} /> Analisar com IA</Button>
          <Button variant="secondary"><Pause size={16} /> Pausar IA</Button>
          <Button variant="secondary"><UserPlus size={16} /> Responsável</Button>
        </div>
      </div>
      <Panel className="p-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button key={filter} className="inline-flex h-8 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm text-muted-foreground hover:bg-muted">
              <Filter size={14} />
              {filter}
            </button>
          ))}
        </div>
      </Panel>
      <LeadTable leads={leads} />
    </div>
  );
}
