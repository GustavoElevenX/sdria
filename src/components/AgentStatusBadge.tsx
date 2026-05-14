import { Badge } from "@/components/ui/badge";
import type { AiStatus } from "@/lib/types";

const labels: Record<AiStatus, string> = {
  active: "IA ativa",
  paused: "IA pausada",
  waiting_context: "Aguardando contexto",
  needs_human: "Precisa de humano",
  scheduled: "Reunião agendada",
  opt_out: "Opt-out"
};

export function AgentStatusBadge({ status }: { status: AiStatus }) {
  const tone = status === "active" ? "success" : status === "needs_human" || status === "opt_out" ? "danger" : "warning";
  return <Badge tone={tone}>{labels[status]}</Badge>;
}
