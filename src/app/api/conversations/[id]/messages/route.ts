import { NextResponse } from "next/server";
import { getConversation } from "@/lib/services/conversation-service";
import { saveMessage } from "@/lib/services/message-service";
import { generateAgentReply } from "@/lib/services/agent-service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const conversation = getConversation(id);
  if (!conversation?.lead) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });

  const message = saveMessage({
    conversationId: id,
    leadId: conversation.lead.id,
    senderType: body.senderType ?? "human",
    content: body.content ?? ""
  });

  const aiDecision =
    body.senderType === "lead"
      ? generateAgentReply(conversation.lead, [...conversation.messages, message])
      : { should_send: false, next_action: "ia_pausada_por_mensagem_humana" };

  return NextResponse.json({ data: { message, aiDecision } });
}
