import { NextResponse } from "next/server";
import { createLead } from "@/lib/services/lead-service";
import { getOrCreateConversation } from "@/lib/services/conversation-service";
import { handleIncomingLeadMessage } from "@/lib/services/agent-service";
import { extractWhatsappMessages, verifyWebhookToken, verifyWhatsappSignature } from "@/lib/services/whatsapp-service";
import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapLead } from "@/lib/supabase/mappers";

export function GET(request: Request) {
  const url = new URL(request.url);
  const challenge = verifyWebhookToken(url.searchParams.get("hub.verify_token"), url.searchParams.get("hub.challenge"));
  if (!challenge) return NextResponse.json({ error: "Token inválido" }, { status: 403 });
  return new Response(challenge);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const validSignature = await verifyWhatsappSignature(request, rawBody);
  if (!validSignature) return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });

  const body = JSON.parse(rawBody || "{}");
  const messages = extractWhatsappMessages(body);
  const processed = [];

  for (const message of messages) {
    if (!message.text) continue;
    const lead = await findOrCreateWhatsappLead(message.from, message.name);
    const conversation = await getOrCreateConversation(lead.id);
    const decision = await handleIncomingLeadMessage({
      lead,
      conversationId: conversation.id,
      content: message.text,
      whatsappMessageId: message.whatsappMessageId
    });
    processed.push({ leadId: lead.id, conversationId: conversation.id, decision });
  }

  return NextResponse.json({ data: { received: true, processed } });
}

async function findOrCreateWhatsappLead(phone: string, name: string) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("leads")
    .select("*, profiles:owner_id(name), lead_contexts(ready_for_outreach), meetings(id)")
    .eq("company_id", companyId)
    .eq("phone", `+${phone}`)
    .maybeSingle();

  if (error) throw error;
  if (data) return mapLead(data);

  const created = await createLead({
    name: name || phone,
    phone: `+${phone}`,
    source: "WhatsApp anúncio",
    stage: "Novo lead",
    status: "Entrada WhatsApp",
    contextLevel: "baixo",
    contextScore: 30,
    aiStatus: "active"
  });
  await supabase.from("lead_contexts").insert({
    company_id: companyId,
    lead_id: created.id,
    ai_summary: "Lead criado automaticamente a partir de mensagem recebida no WhatsApp.",
    ai_missing_fields: ["empresa", "dor principal", "serviço de interesse"],
    ai_suggested_questions: ["Qual empresa você representa?", "Hoje o maior gargalo está em responder, qualificar ou agendar leads?"],
    ready_for_outreach: true
  });
  return created;
}
