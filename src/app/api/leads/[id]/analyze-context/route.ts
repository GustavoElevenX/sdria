import { NextResponse } from "next/server";
import { agentSettings } from "@/lib/mock-data";
import { analyzeLeadContext } from "@/lib/services/context-analysis-service";
import { getLeadData } from "@/lib/services/lead-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getLeadData(id);
  if (!data?.lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  return NextResponse.json({ data: analyzeLeadContext(data.lead, agentSettings) });
}
