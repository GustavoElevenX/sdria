import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import type { KnowledgeDocument } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function KnowledgeDocumentCard({ document }: { document: KnowledgeDocument }) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold">{document.title}</h3>
        <Badge>{document.type}</Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{document.content}</p>
      <p className="mt-3 text-xs text-muted-foreground">Atualizado em {formatDateTime(document.updatedAt)} · chunks e embeddings ao salvar</p>
    </Panel>
  );
}
