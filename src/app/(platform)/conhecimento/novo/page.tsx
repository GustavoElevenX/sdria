import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";

const types = ["Quem somos", "Serviços", "Metodologia", "Diferenciais", "FAQ", "Objeções", "Política comercial", "Processo de implantação", "Limites do que pode prometer", "Tom de voz", "Playbook comercial"];

export default function NewKnowledgePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Novo conteúdo</h1>
        <p className="text-sm text-muted-foreground">Ao salvar, o sistema gera chunks e embeddings para busca semântica.</p>
      </div>
      <Panel>
        <PanelHeader title="Documento da empresa" />
        <div className="grid gap-4 p-4">
          <label className="grid gap-2 text-sm">
            <span>Título</span>
            <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" />
          </label>
          <label className="grid gap-2 text-sm">
            <span>Tipo</span>
            <select className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary">
              {types.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            <span>Conteúdo</span>
            <textarea className="min-h-56 rounded-md border border-border p-3 outline-none focus:border-primary" />
          </label>
          <label className="grid gap-2 text-sm">
            <span>Tags</span>
            <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" placeholder="sdr, whatsapp, objeções" />
          </label>
        </div>
        <div className="border-t border-border p-4">
          <Button>Salvar e gerar embeddings</Button>
        </div>
      </Panel>
    </div>
  );
}
