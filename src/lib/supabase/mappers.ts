import type {
  AgentSettings,
  CaseStudy,
  Conversation,
  IntegrationStatus,
  KnowledgeDocument,
  Lead,
  LeadContext,
  LearningInsight,
  Message,
  MessageTemplate
} from "@/lib/types";

export function mapLead(row: Record<string, any>): Lead {
  return {
    id: row.id,
    name: row.name ?? "",
    companyName: row.company_name ?? "",
    phone: row.phone ?? "",
    email: row.email ?? undefined,
    source: row.source ?? "",
    stage: row.stage ?? "Novo lead",
    status: row.status ?? "Importado",
    owner: row.profiles?.name ?? "",
    estimatedValue: Number(row.estimated_value ?? 0),
    contextLevel: row.context_level ?? "baixo",
    contextScore: Number(row.context_score ?? 0),
    leadScore: Number(row.lead_score ?? 0),
    aiStatus: row.ai_status ?? "waiting_context",
    lastInteractionAt: row.last_interaction_at ?? undefined,
    nextActionAt: row.next_action_at ?? undefined,
    readyForOutreach: Boolean(row.lead_contexts?.[0]?.ready_for_outreach ?? false),
    needsHuman: row.ai_status === "needs_human",
    hasMeeting: Boolean(row.meetings?.length)
  };
}

export function mapLeadContext(row: Record<string, any>): LeadContext {
  return {
    leadId: row.lead_id,
    mainPain: row.main_pain ?? "",
    serviceInterest: row.service_interest ?? "",
    knownObjections: row.known_objections ?? "",
    urgency: row.urgency ?? "",
    decisionMaker: row.decision_maker ?? "",
    commercialContext: row.commercial_context ?? "",
    internalNotes: row.internal_notes ?? "",
    aiSummary: row.ai_summary ?? "",
    aiRecommendedAngle: row.ai_recommended_angle ?? "",
    aiMissingFields: row.ai_missing_fields ?? [],
    aiRecommendedCases: row.ai_recommended_cases ?? [],
    risks: row.ai_risks ?? [],
    suggestedQuestionsForTeam: row.ai_suggested_questions ?? []
  };
}

export function mapCase(row: Record<string, any>): CaseStudy {
  return {
    id: row.id,
    title: row.title ?? "",
    clientAlias: row.client_alias ?? "",
    isConfidential: Boolean(row.is_confidential),
    segment: row.segment ?? "",
    subsegment: row.subsegment ?? "",
    initialProblem: row.initial_problem ?? "",
    beforeScenario: row.before_scenario ?? "",
    implementedSolution: row.implemented_solution ?? "",
    soldService: row.sold_service ?? "",
    resultObtained: row.result_obtained ?? "",
    timeToResult: row.time_to_result ?? "",
    objectionsFaced: row.objections_faced ?? "",
    whenToUse: row.when_to_use ?? "",
    whenNotToUse: row.when_not_to_use ?? "",
    proofsAvailable: row.proofs_available ?? "",
    internalNotes: row.internal_notes ?? "",
    tags: row.tags ?? [],
    active: Boolean(row.active)
  };
}

export function mapKnowledgeDocument(row: Record<string, any>): KnowledgeDocument {
  return {
    id: row.id,
    title: row.title ?? "",
    type: row.type ?? "",
    content: row.content ?? "",
    tags: row.tags ?? [],
    active: Boolean(row.active),
    updatedAt: row.updated_at ?? row.created_at
  };
}

export function mapConversation(row: Record<string, any>): Conversation {
  return {
    id: row.id,
    leadId: row.lead_id,
    status: row.status ?? "open",
    lastMessageAt: row.last_message_at ?? row.created_at,
    needsHuman: row.status === "needs_human",
    summary: row.summary ?? "",
    nextAction: row.next_action ?? ""
  };
}

export function mapMessage(row: Record<string, any>): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    leadId: row.lead_id,
    senderType: row.sender_type,
    content: row.content ?? "",
    createdAt: row.created_at,
    templateId: row.message_template_id ?? undefined
  };
}

export function mapLearningInsight(row: Record<string, any>): LearningInsight {
  return {
    id: row.id,
    type: row.type ?? "",
    summary: row.summary ?? "",
    evidence: row.evidence ?? {},
    recommendation: row.recommendation ?? "",
    status: row.status ?? "pending",
    createdAt: row.created_at
  };
}

export function mapMessageTemplate(row: Record<string, any>): MessageTemplate {
  return {
    id: row.id,
    name: row.name ?? "",
    category: row.category ?? "initial_outreach",
    content: row.content ?? "",
    stageTarget: row.stage_target ?? "",
    active: Boolean(row.active),
    approvedOnWhatsapp: Boolean(row.approved_on_whatsapp)
  };
}

export function mapIntegration(row: Record<string, any>): IntegrationStatus {
  return {
    id: row.id,
    type: row.type,
    status: row.status ?? "desconectado",
    lastCheckedAt: row.last_checked_at ?? undefined,
    lastError: row.last_error ?? undefined
  };
}

export function mapAgentSettings(row: Record<string, any>): AgentSettings {
  return {
    agentName: row.agent_name ?? "",
    agentRole: row.agent_role ?? "",
    toneOfVoice: row.tone_of_voice ?? "",
    writingStyle: row.writing_style ?? "",
    forbiddenWords: row.forbidden_words ?? [],
    preferredWords: row.preferred_words ?? [],
    maxResponseLength: Number(row.max_response_length ?? 500),
    qualificationRules: row.qualification_rules ?? {},
    followupRules: row.followup_rules ?? {},
    schedulingRules: row.scheduling_rules ?? {},
    humanEscalationRules: row.human_escalation_rules ?? {},
    optOutRules: row.opt_out_rules ?? {},
    commercialRules: row.commercial_rules ?? {}
  };
}
