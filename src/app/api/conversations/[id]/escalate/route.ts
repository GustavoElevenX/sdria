import { NextResponse } from "next/server";
import { escalateToHuman } from "@/lib/services/conversation-service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: escalateToHuman(id, body.reason ?? "Solicitado pelo operador") });
}
