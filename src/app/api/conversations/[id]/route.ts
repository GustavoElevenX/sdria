import { NextResponse } from "next/server";
import { getConversation } from "@/lib/services/conversation-service";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = getConversation(id);
  if (!data) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
  return NextResponse.json({ data });
}
