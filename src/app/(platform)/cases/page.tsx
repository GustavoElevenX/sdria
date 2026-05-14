import Link from "next/link";
import { Plus } from "lucide-react";
import { CaseCard } from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { getCases } from "@/lib/services/case-search-service";

export default async function CasesPage() {
  const cases = await getCases();
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Base de cases</h1>
          <p className="text-sm text-muted-foreground">A IA só pode citar cases cadastrados e aprovados.</p>
        </div>
        <Link className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90" href="/cases/novo">
          <Plus size={16} />
          Novo case
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {cases.map((caseStudy) => <CaseCard key={caseStudy.id} caseStudy={caseStudy} />)}
      </div>
      <Button variant="secondary">Reprocessar recomendação de cases</Button>
    </div>
  );
}
