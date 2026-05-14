import Link from "next/link";
import { Plus } from "lucide-react";
import { KnowledgeDocumentCard } from "@/components/KnowledgeDocumentCard";
import { knowledgeDocuments } from "@/lib/mock-data";

export default function KnowledgePage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Base de conhecimento</h1>
          <p className="text-sm text-muted-foreground">Documentos, chunks e embeddings para respostas com RAG.</p>
        </div>
        <Link className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90" href="/conhecimento/novo">
          <Plus size={16} />
          Novo conteúdo
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {knowledgeDocuments.map((document) => <KnowledgeDocumentCard key={document.id} document={document} />)}
      </div>
    </div>
  );
}
