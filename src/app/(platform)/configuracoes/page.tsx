import { SettingsSection } from "@/components/SettingsSection";
import { getAgentSettings } from "@/lib/services/settings-service";

export default function SettingsPage() {
  const settings = getAgentSettings();
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
      <SettingsSection
        title="Agente"
        fields={[
          { label: "Nome do agente", value: settings.agentName },
          { label: "Cargo simulado", value: settings.agentRole },
          { label: "Tom de voz", value: settings.toneOfVoice },
          { label: "Estilo de escrita", value: settings.writingStyle },
          { label: "Palavras proibidas", value: settings.forbiddenWords.join(", ") },
          { label: "Palavras preferidas", value: settings.preferredWords.join(", ") },
          { label: "Tamanho máximo de resposta", value: String(settings.maxResponseLength) }
        ]}
      />
      <SettingsSection
        title="Comercial"
        fields={[
          { label: "ICP", value: String(settings.commercialRules.icp) },
          { label: "Segmentos prioritários", value: "Saúde, franquias, serviços locais" },
          { label: "Serviços vendidos", value: "SDR IA, CRM operacional, Playbook" },
          { label: "Promessas permitidas", value: String(settings.commercialRules.allowedPromises) },
          { label: "Promessas proibidas", value: String(settings.commercialRules.forbiddenPromises) }
        ]}
      />
      <SettingsSection
        title="Qualificação, follow-up e segurança"
        fields={[
          { label: "Score mínimo para reunião", value: String(settings.qualificationRules.minimumScoreForMeeting) },
          { label: "Número máximo de tentativas", value: String(settings.followupRules.maxAttempts) },
          { label: "Intervalo entre tentativas", value: `${settings.followupRules.intervalHours}h` },
          { label: "Quando humano deve assumir", value: "Risco, desconto, reclamação, dúvida fora da base" },
          { label: "Termos de opt-out", value: String(settings.optOutRules.stopTerms) }
        ]}
      />
    </div>
  );
}
