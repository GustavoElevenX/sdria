import { Badge } from "@/components/ui/badge";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { messageTemplates } from "@/lib/mock-data";

export default function PlaybookPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Playbook</h1>
        <p className="text-sm text-muted-foreground">Templates, abordagens, objeções e regras que alimentam o agente.</p>
      </div>
      <Panel>
        <PanelHeader title="Templates de WhatsApp" eyebrow="Contato ativo exige template aprovado" />
        <div className="divide-y divide-border">
          {messageTemplates.map((template) => (
            <div key={template.id} className="grid gap-2 p-4 md:grid-cols-[220px_1fr_160px]">
              <div>
                <p className="font-medium">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.category}</p>
              </div>
              <p className="text-sm text-muted-foreground">{template.content}</p>
              <Badge tone={template.approvedOnWhatsapp ? "success" : "warning"}>{template.approvedOnWhatsapp ? "aprovado" : "não aprovado"}</Badge>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-3">
        {["Qualificação natural", "Resposta a objeções", "Transferência para humano"].map((title) => (
          <Panel key={title} className="p-4">
            <h2 className="font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">Regras editáveis pela interface e usadas no prompt dinâmico.</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
