import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";

const fields = [
  "titulo",
  "nome_cliente_publico_ou_apelido",
  "segmento",
  "subsegmento",
  "problema_inicial",
  "cenario_antes",
  "solucao_implementada",
  "servico_vendido",
  "resultado_obtido",
  "tempo_para_resultado",
  "objeções_enfrentadas",
  "quando_usar",
  "quando_nao_usar",
  "provas_disponiveis",
  "observacoes_internas",
  "tags"
];

export default function NewCasePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Novo case</h1>
        <p className="text-sm text-muted-foreground">Estruture o case para uso consultivo, sem promessas ou resultados inventados.</p>
      </div>
      <Panel>
        <PanelHeader title="Campos do case" />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field} className="grid gap-2 text-sm">
              <span>{field}</span>
              <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" />
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked />
            Confidencial
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" defaultChecked />
            Ativo
          </label>
        </div>
        <div className="border-t border-border p-4">
          <Button>Salvar case</Button>
        </div>
      </Panel>
    </div>
  );
}
