import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapMessage } from "@/lib/supabase/mappers";
import type { SenderType } from "@/lib/types";

export async function saveMessage(input: {
  conversationId: string;
  leadId: string;
  senderType: SenderType;
  content: string;
  messageTemplateId?: string;
  whatsappMessageId?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const createdAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      company_id: companyId,
      conversation_id: input.conversationId,
      lead_id: input.leadId,
      sender_type: input.senderType,
      content: input.content,
      whatsapp_message_id: input.whatsappMessageId,
      message_template_id: input.messageTemplateId,
      metadata: input.metadata ?? {},
      created_at: createdAt
    })
    .select("*")
    .single();

  if (error) throw error;

  await supabase
    .from("conversations")
    .update({ last_message_at: createdAt, updated_at: createdAt })
    .eq("id", input.conversationId);

  await supabase
    .from("leads")
    .update({ last_interaction_at: createdAt, updated_at: createdAt })
    .eq("id", input.leadId);

  return mapMessage(data);
}

export async function getMessagesForLead(leadId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

export function classifyLeadIntent(message: string) {
  const normalized = message.toLowerCase();
  if (["parar", "remover", "não quero", "nao quero"].some((term) => normalized.includes(term))) return "opt_out";
  if (["agenda", "horário", "horario", "reunião", "reuniao"].some((term) => normalized.includes(term))) return "scheduling";
  if (["caro", "preço", "preco", "orçamento", "orcamento"].some((term) => normalized.includes(term))) return "objection";
  if (["sim", "faz sentido", "quero", "interesse"].some((term) => normalized.includes(term))) return "interested";
  if (normalized.includes("?")) return "question";
  return "unknown";
}
