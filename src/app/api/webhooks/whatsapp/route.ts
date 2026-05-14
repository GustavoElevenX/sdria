import { NextResponse } from "next/server";
import { verifyWebhookToken } from "@/lib/services/whatsapp-service";

export function GET(request: Request) {
  const url = new URL(request.url);
  const challenge = verifyWebhookToken(url.searchParams.get("hub.verify_token"), url.searchParams.get("hub.challenge"));
  if (!challenge) return NextResponse.json({ error: "Token inválido" }, { status: 403 });
  return new Response(challenge);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    data: {
      received: true,
      action: "Criar ou atualizar lead, salvar mensagem, classificar intenção e acionar agente",
      body
    }
  });
}
