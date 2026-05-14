import { IntegrationStatusCard } from "@/components/IntegrationStatusCard";
import { getIntegrations } from "@/lib/services/integration-service";

export default async function IntegrationsPage() {
  const integrations = await getIntegrations();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Integrações</h1>
        <p className="text-sm text-muted-foreground">Status de WhatsApp, OpenAI, Supabase e Google Calendar.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {integrations.map((integration) => <IntegrationStatusCard key={integration.id} integration={integration} />)}
      </div>
    </div>
  );
}
