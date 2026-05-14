import { getCompanyId, getSupabaseAdmin } from "@/lib/supabase/server";
import { mapAgentSettings } from "@/lib/supabase/mappers";
import type { AgentSettings } from "@/lib/types";

export const defaultAgentSettings: AgentSettings = {
  agentName: "Lia",
  agentRole: "SDR consultiva",
  toneOfVoice: "Natural, profissional e objetiva",
  writingStyle: "Mensagens curtas, uma pergunta por vez, sem parecer formulário",
  forbiddenWords: ["garantido", "resultado certo", "sem esforço"],
  preferredWords: ["diagnóstico", "cenário", "próximo passo", "oportunidades"],
  maxResponseLength: 520,
  qualificationRules: {
    requiredFields: ["principal problema", "decisor", "urgência", "objeção principal"],
    minimumScoreForMeeting: 70,
    automaticProspectingByContext: { baixo: false, medio: false, alto: true }
  },
  followupRules: {
    maxAttempts: 4,
    intervalHours: 36,
    allowedHours: "09:00-18:00",
    pauseWeekends: true,
    stopAfterNegativeReply: true
  },
  schedulingRules: {
    defaultDurationMinutes: 45,
    availableDays: ["terça", "quarta", "quinta", "sexta"],
    minimumNoticeHours: 12,
    bufferMinutes: 15,
    eventTitle: "Diagnóstico comercial",
    meetingLink: "Google Meet"
  },
  humanEscalationRules: {
    riskWords: ["jurídico", "reclamação", "cancelar", "processo"],
    complexNegotiation: true,
    outsideKnowledgeBase: true
  },
  optOutRules: {
    stopTerms: ["parar", "remover", "não quero", "cancelar contato"],
    confirmationMessage: "Tudo certo, não vou te chamar por aqui novamente."
  },
  commercialRules: {
    icp: "Empresas com volume de leads e operação comercial consultiva",
    allowedPromises: ["organizar follow-up", "melhorar velocidade de resposta", "dar visibilidade ao funil"],
    forbiddenPromises: ["garantia de venda", "quantidade garantida de reuniões"]
  }
};

export async function getAgentSettings() {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) return defaultAgentSettings;

  const { data, error } = await supabase.from("agent_settings").select("*").eq("company_id", companyId).maybeSingle();
  if (error) throw error;
  return data ? mapAgentSettings(data) : defaultAgentSettings;
}

export async function updateAgentSettings(data: Partial<AgentSettings>) {
  const supabase = getSupabaseAdmin();
  const companyId = await getCompanyId();
  if (!supabase || !companyId) throw new Error("Supabase não configurado");

  const payload = {
    company_id: companyId,
    agent_name: data.agentName,
    agent_role: data.agentRole,
    tone_of_voice: data.toneOfVoice,
    writing_style: data.writingStyle,
    forbidden_words: data.forbiddenWords,
    preferred_words: data.preferredWords,
    max_response_length: data.maxResponseLength,
    qualification_rules: data.qualificationRules,
    followup_rules: data.followupRules,
    scheduling_rules: data.schedulingRules,
    human_escalation_rules: data.humanEscalationRules,
    opt_out_rules: data.optOutRules,
    commercial_rules: data.commercialRules,
    updated_at: new Date().toISOString()
  };

  const { data: saved, error } = await supabase
    .from("agent_settings")
    .upsert(payload, { onConflict: "company_id" })
    .select("*")
    .single();

  if (error) throw error;
  return mapAgentSettings(saved);
}
