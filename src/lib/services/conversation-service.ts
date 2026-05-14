import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapConversation, mapLead, mapMessage } from "@/lib/supabase/mappers";
import type { Conversation, Lead, Message } from "@/lib/types";

export type ConversationWithLead = Conversation & { lead?: Lead; messages?: Message[] };

export async function getConversations(): Promise<ConversationWithLead[]> {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select("*, leads(*)")
    .eq("company_id", companyId)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...mapConversation(row),
    lead: row.leads ? mapLead(row.leads) : undefined
  }));
}

export async function getConversationHistory(conversationId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

export async function getConversation(conversationId: string): Promise<ConversationWithLead | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase.from("conversations").select("*, leads(*)").eq("id", conversationId).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    ...mapConversation(data),
    lead: data.leads ? mapLead(data.leads) : undefined,
    messages: await getConversationHistory(conversationId)
  };
}

export async function getOrCreateConversation(leadId: string) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data: existing, error: existingError } = await supabase
    .from("conversations")
    .select("*, leads(*)")
    .eq("company_id", companyId)
    .eq("lead_id", leadId)
    .eq("channel", "whatsapp")
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return { ...mapConversation(existing), lead: existing.leads ? mapLead(existing.leads) : undefined };

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      company_id: companyId,
      lead_id: leadId,
      channel: "whatsapp",
      status: "open",
      last_message_at: new Date().toISOString()
    })
    .select("*, leads(*)")
    .single();

  if (error) throw error;
  return { ...mapConversation(data), lead: data.leads ? mapLead(data.leads) : undefined };
}

export async function updateConversationState(conversationId: string, data: { status?: string; summary?: string; nextAction?: string; assignedTo?: string | null }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase não configurado");

  const { data: saved, error } = await supabase
    .from("conversations")
    .update({
      status: data.status,
      summary: data.summary,
      next_action: data.nextAction,
      assigned_to: data.assignedTo,
      updated_at: new Date().toISOString()
    })
    .eq("id", conversationId)
    .select("*, leads(*)")
    .single();

  if (error) throw error;
  return { ...mapConversation(saved), lead: saved.leads ? mapLead(saved.leads) : undefined };
}

export async function escalateToHuman(conversationId: string, reason: string) {
  return updateConversationState(conversationId, {
    status: "needs_human",
    nextAction: `Aguardando humano: ${reason}`
  });
}
