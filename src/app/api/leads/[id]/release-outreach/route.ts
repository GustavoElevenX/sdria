import { NextResponse } from "next/server";
import { analyzeLeadContext } from "@/lib/services/context-analysis-service";
import { getLeadData, updateLeadAiState } from "@/lib/services/lead-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getLeadData(id);
  if (!data?.lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  const analysis = await analyzeLeadContext(data.lead, data.context);
  if (!analysis.ready_for_outreach) {
    return NextResponse.json(
      {
        error: "Lead não liberado",
        reason: "Configuração bloqueia prospecção automática para este nível de contexto.",
        analysis
      },
      { status: 409 }
    );
  }
  await updateLeadAiState(id, { aiStatus: "active", status: "Liberado para prospecção" });
  return NextResponse.json({ data: { leadId: id, aiStatus: "active", status: "Liberado para prospecção", analysis } });
}
