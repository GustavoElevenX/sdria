import { NextResponse } from "next/server";
import { getLeadData, updateLeadContext } from "@/lib/services/lead-service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getLeadData(id);
  if (!data) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: updateLeadContext(id, body) });
}
