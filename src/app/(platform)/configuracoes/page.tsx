import { SettingsForm } from "@/components/SettingsForm";
import { getAgentSettings } from "@/lib/services/settings-service";

export default async function SettingsPage() {
  const settings = await getAgentSettings();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Configuração de negócio pela interface, sem backend hardcoded.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Agente", "Comercial", "Qualificação", "Follow-up", "Agendamento", "WhatsApp", "Escalação humana", "Opt-out", "Segurança"].map((tab) => (
          <button key={tab} className="h-9 rounded-md border border-border bg-white px-3 text-sm hover:bg-muted">{tab}</button>
        ))}
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
