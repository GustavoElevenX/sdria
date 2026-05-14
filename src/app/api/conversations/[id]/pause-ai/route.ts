import { NextResponse } from "next/server";
import { updateConversationState } from "@/lib/services/conversation-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ data: await updateConversationState(id, { status: "open", nextAction: "IA pausada pelo operador" }) });
}
