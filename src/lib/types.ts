export type ContextLevel = "baixo" | "medio" | "alto";
export type AiStatus = "paused" | "active" | "waiting_context" | "needs_human" | "scheduled" | "opt_out";
export type ConversationStatus = "open" | "closed" | "needs_human" | "scheduled";
export type SenderType = "lead" | "ai" | "human" | "system";
export type InsightStatus = "pending" | "approved" | "rejected" | "applied";

export type Lead = {
  id: string;
  name: string;
  title?: string;
  companyName: string;
  phone: string;
  email?: string;
  source: string;
  stage: string;
  status: string;
  owner: string;
  estimatedValue: number;
  contextLevel: ContextLevel;
  contextScore: number;
  leadScore: number;
  aiStatus: AiStatus;
  lastInteractionAt?: string;
  nextActionAt?: string;
  readyForOutreach: boolean;
  needsHuman: boolean;
  hasMeeting: boolean;
};

export type LeadContext = {
  leadId: string;
  mainPain?: string;
  serviceInterest?: string;
  knownObjections?: string;
  urgency?: string;
  decisionMaker?: string;
  commercialContext?: string;
  internalNotes?: string;
  aiSummary: string;
  aiRecommendedAngle: string;
  aiMissingFields: string[];
  aiRecommendedCases: string[];
  risks: string[];
  suggestedQuestionsForTeam: string[];
};

export type CaseStudy = {
  id: string;
  title: string;
  clientAlias: string;
  isConfidential: boolean;
  segment: string;
  subsegment: string;
  initialProblem: string;
  beforeScenario: string;
  implementedSolution: string;
  soldService: string;
  resultObtained: string;
  timeToResult: string;
  objectionsFaced: string;
  whenToUse: string;
  whenNotToUse: string;
  proofsAvailable: string;
  internalNotes: string;
  tags: string[];
  active: boolean;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  type: string;
  content: string;
  tags: string[];
  active: boolean;
  updatedAt: string;
};

export type Conversation = {
  id: string;
  leadId: string;
  status: ConversationStatus;
  lastMessageAt: string;
  needsHuman: boolean;
  summary: string;
  nextAction: string;
};

export type Message = {
  id: string;
  conversationId: string;
  leadId: string;
  senderType: SenderType;
  content: string;
  createdAt: string;
  templateId?: string;
};

export type LearningInsight = {
  id: string;
  type: string;
  summary: string;
  evidence: Record<string, string | number | boolean>;
  recommendation: string;
  status: InsightStatus;
  createdAt: string;
};

export type MessageTemplate = {
  id: string;
  name: string;
  category: "initial_outreach" | "follow_up" | "proposal" | "reactivation" | "ad_response";
  content: string;
  stageTarget: string;
  active: boolean;
  approvedOnWhatsapp: boolean;
};

export type IntegrationStatus = {
  id: string;
  type: "whatsapp" | "google_calendar" | "openai" | "supabase";
  status: "conectado" | "desconectado" | "erro";
  lastCheckedAt?: string;
  lastError?: string;
};

export type AgentSettings = {
  agentName: string;
  agentRole: string;
  toneOfVoice: string;
  writingStyle: string;
  forbiddenWords: string[];
  preferredWords: string[];
  maxResponseLength: number;
  qualificationRules: Record<string, unknown>;
  followupRules: Record<string, unknown>;
  schedulingRules: Record<string, unknown>;
  humanEscalationRules: Record<string, unknown>;
  optOutRules: Record<string, unknown>;
  commercialRules: Record<string, unknown>;
};

export type AgentDecision = {
  message_to_send: string;
  intent: "interested" | "objection" | "no_interest" | "scheduling" | "question" | "opt_out" | "unknown";
  lead_stage_suggestion: string;
  should_send: boolean;
  should_escalate_to_human: boolean;
  should_schedule: boolean;
  case_used_ids: string[];
  knowledge_used_ids: string[];
  next_action: string;
  confidence: number;
};
