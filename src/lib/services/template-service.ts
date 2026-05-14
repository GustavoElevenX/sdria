import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapMessageTemplate } from "@/lib/supabase/mappers";
import type { MessageTemplate } from "@/lib/types";

export async function getMessageTemplates() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return [];

  const { data, error } = await supabase
    .from("message_templates")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMessageTemplate);
}

export async function upsertMessageTemplate(input: Partial<MessageTemplate> & { id?: string }) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const { data, error } = await supabase
    .from("message_templates")
    .upsert({
      id: input.id,
      company_id: companyId,
      name: input.name,
      category: input.category,
      content: input.content,
      stage_target: input.stageTarget,
      active: input.active ?? true,
      approved_on_whatsapp: input.approvedOnWhatsapp ?? false,
      updated_at: new Date().toISOString()
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapMessageTemplate(data);
}
