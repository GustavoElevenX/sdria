import { PlugZap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { IntegrationStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function IntegrationStatusCard({ integration }: { integration: IntegrationStatus }) {
  const tone = integration.status === "conectado" ? "success" : integration.status === "erro" ? "danger" : "warning";
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-muted">
            <PlugZap size={18} />
          </div>
          <div>
            <h3 className="font-semibold">{integration.type}</h3>
            <p className="text-sm text-muted-foreground">Último teste: {formatDateTime(integration.lastCheckedAt)}</p>
          </div>
        </div>
        <Badge tone={tone}>{integration.status}</Badge>
      </div>
      {integration.lastError ? <p className="mt-3 text-sm text-danger">{integration.lastError}</p> : null}
      <div className="mt-4 flex gap-2">
        <Button className="h-8">Testar conexão</Button>
        <Button className="h-8" variant="secondary">Reconectar</Button>
      </div>
    </Panel>
  );
}
