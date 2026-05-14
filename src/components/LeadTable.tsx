import Link from "next/link";
import { AgentStatusBadge } from "@/components/AgentStatusBadge";
import { ContextScoreBadge } from "@/components/ContextScoreBadge";
import type { Lead } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <div className="table-scroll overflow-x-auto rounded-lg border border-border bg-white">
      <table className="min-w-[1180px] w-full border-collapse text-sm">
        <thead className="bg-muted/70 text-left text-xs uppercase text-muted-foreground">
          <tr>
            {["Nome", "Empresa", "Telefone", "Etapa", "Status", "Origem", "Contexto", "Score", "Última interação", "Próxima ação", "IA", "Responsável", ""].map((column) => (
              <th key={column} className="px-3 py-3 font-medium">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t border-border">
              <td className="px-3 py-3 font-medium">{lead.name}</td>
              <td className="px-3 py-3">{lead.companyName || "Sem empresa"}</td>
              <td className="px-3 py-3">{lead.phone || "Sem telefone"}</td>
              <td className="px-3 py-3">{lead.stage}</td>
              <td className="px-3 py-3">{lead.status}</td>
              <td className="px-3 py-3">{lead.source}</td>
              <td className="px-3 py-3"><ContextScoreBadge score={lead.contextScore} level={lead.contextLevel} /></td>
              <td className="px-3 py-3">{lead.leadScore}</td>
              <td className="px-3 py-3">{formatDateTime(lead.lastInteractionAt)}</td>
              <td className="px-3 py-3">{formatDateTime(lead.nextActionAt)}</td>
              <td className="px-3 py-3"><AgentStatusBadge status={lead.aiStatus} /></td>
              <td className="px-3 py-3">{lead.owner}</td>
              <td className="px-3 py-3 text-right">
                <Link className="inline-flex h-8 items-center rounded-md border border-border bg-white px-3 text-sm font-medium hover:bg-muted" href={`/leads/${lead.id}`}>
                  Abrir
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
