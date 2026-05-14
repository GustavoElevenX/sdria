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

export const leads: Lead[] = [
  {
    id: "lead-ana",
    name: "Ana Ribeiro",
    title: "Diretora Comercial",
    companyName: "Clínica Vitta",
    phone: "+5585999912345",
    email: "ana@clinicavitta.com",
    source: "Meta Ads",
    stage: "Enviar proposta",
    status: "Reativação",
    owner: "Marina Lopes",
    estimatedValue: 18000,
    contextLevel: "alto",
    contextScore: 85,
    leadScore: 78,
    aiStatus: "active",
    lastInteractionAt: "2026-05-14T12:30:00-03:00",
    nextActionAt: "2026-05-14T16:00:00-03:00",
    readyForOutreach: true,
    needsHuman: false,
    hasMeeting: false
  },
  {
    id: "lead-bruno",
    name: "Bruno Alves",
    companyName: "Franquia Norte",
    phone: "+5585988877665",
    email: "bruno@franquianorte.com",
    source: "Base antiga",
    stage: "Diagnóstico",
    status: "Contexto insuficiente",
    owner: "Rafael Costa",
    estimatedValue: 9500,
    contextLevel: "medio",
    contextScore: 58,
    leadScore: 52,
    aiStatus: "waiting_context",
    lastInteractionAt: "2026-05-13T10:15:00-03:00",
    nextActionAt: "2026-05-15T09:00:00-03:00",
    readyForOutreach: false,
    needsHuman: false,
    hasMeeting: false
  },
  {
    id: "lead-camila",
    name: "Camila Sousa",
    companyName: "",
    phone: "8597777",
    source: "WhatsApp anúncio",
    stage: "Novo lead",
    status: "Aguardando dados",
    owner: "Marina Lopes",
    estimatedValue: 0,
    contextLevel: "baixo",
    contextScore: 30,
    leadScore: 31,
    aiStatus: "needs_human",
    lastInteractionAt: "2026-05-14T14:20:00-03:00",
    nextActionAt: "2026-05-14T14:40:00-03:00",
    readyForOutreach: false,
    needsHuman: true,
    hasMeeting: false
  },
  {
    id: "lead-diego",
    name: "Diego Martins",
    companyName: "Odonto Prime",
    phone: "+5585990011223",
    email: "diego@odontoprime.com",
    source: "Indicação",
    stage: "Qualificado",
    status: "Reunião agendada",
    owner: "Patrícia Lima",
    estimatedValue: 22000,
    contextLevel: "alto",
    contextScore: 92,
    leadScore: 88,
    aiStatus: "scheduled",
    lastInteractionAt: "2026-05-14T09:45:00-03:00",
    nextActionAt: "2026-05-16T11:00:00-03:00",
    readyForOutreach: true,
    needsHuman: false,
    hasMeeting: true
  }
];

export const leadContexts: LeadContext[] = [
  {
    leadId: "lead-ana",
    mainPain: "A clínica perde velocidade no atendimento dos leads de anúncios.",
    serviceInterest: "Agente SDR com IA e organização do follow-up comercial.",
    knownObjections: "Medo de parecer atendimento automatizado demais.",
    urgency: "Alta, quer recuperar campanhas antes do próximo mês.",
    decisionMaker: "Ana decide com o sócio financeiro.",
    commercialContext: "Recebeu proposta, mas parou quando perguntou sobre implantação.",
    internalNotes: "Valor estimado já validado. Evitar promessa de aumento garantido.",
    aiSummary: "Lead com dor clara, proposta pendente e bom fit para retomada consultiva.",
    aiRecommendedAngle: "Retomar com foco em atendimento consultivo, velocidade de resposta e recuperação de oportunidades paradas.",
    aiMissingFields: [],
    aiRecommendedCases: ["case-clinica", "case-odontologia"],
    risks: ["Não prometer quantidade fixa de reuniões."],
    suggestedQuestionsForTeam: ["Existe alguma objeção nova desde a proposta?", "O sócio financeiro participou da call anterior?"]
  },
  {
    leadId: "lead-bruno",
    mainPain: "Equipe comercial responde leads de forma irregular.",
    serviceInterest: "",
    knownObjections: "Preço e tempo de implantação.",
    urgency: "Média.",
    decisionMaker: "Bruno influencia, diretoria aprova.",
    commercialContext: "Parou após diagnóstico inicial.",
    internalNotes: "",
    aiSummary: "Há sinais de fit, mas falta confirmar serviço de interesse e trava principal.",
    aiRecommendedAngle: "Pedir contexto interno antes de prospectar e evitar abordagem genérica.",
    aiMissingFields: ["serviço de interesse", "trava principal", "case prioritário"],
    aiRecommendedCases: ["case-franquia"],
    risks: ["Abordagem pode soar ampla se não houver serviço de interesse."],
    suggestedQuestionsForTeam: [
      "Qual serviço foi apresentado para esse lead?",
      "Ele chegou a receber proposta?",
      "Qual foi a principal trava da negociação?"
    ]
  },
  {
    leadId: "lead-camila",
    mainPain: "",
    serviceInterest: "",
    knownObjections: "",
    urgency: "",
    decisionMaker: "",
    commercialContext: "",
    internalNotes: "",
    aiSummary: "Lead de anúncio com contexto fraco e telefone incompleto. Precisa de validação humana.",
    aiRecommendedAngle: "Responder rapidamente apenas para entender necessidade e pedir confirmação de contato.",
    aiMissingFields: ["telefone válido", "empresa", "dor principal", "serviço de interesse", "decisor"],
    aiRecommendedCases: [],
    risks: ["Não iniciar prospecção ativa sem opt-in e telefone válido."],
    suggestedQuestionsForTeam: [
      "Qual campanha gerou esse lead?",
      "Há mensagem inicial do WhatsApp?",
      "Existe telefone válido no CRM?"
    ]
  },
  {
    leadId: "lead-diego",
    mainPain: "Lead chega, mas o retorno do time acontece tarde.",
    serviceInterest: "Implantação de SDR IA para clínicas odontológicas.",
    knownObjections: "Confiança no uso de IA com pacientes.",
    urgency: "Alta.",
    decisionMaker: "Diego é sócio operador e decide com a esposa.",
    commercialContext: "Aceitou conversar após ver exemplo de operação parecida.",
    internalNotes: "Reunião marcada com closer.",
    aiSummary: "Lead qualificado e agendado. Próximo passo é preparação do closer.",
    aiRecommendedAngle: "Levar diagnóstico do tempo de resposta e exemplos permitidos.",
    aiMissingFields: [],
    aiRecommendedCases: ["case-odontologia"],
    risks: ["Evitar citar nomes reais de clientes confidenciais."],
    suggestedQuestionsForTeam: ["Confirmar participantes internos da reunião."]
  }
];

export const cases: CaseStudy[] = [
  {
    id: "case-clinica",
    title: "Reativação de leads para clínica estética",
    clientAlias: "Clínica X",
    isConfidential: true,
    segment: "Saúde",
    subsegment: "Estética",
    initialProblem: "Leads de anúncios ficavam sem follow-up depois da primeira resposta.",
    beforeScenario: "Atendimento dependia de uma pessoa e não havia cadência clara.",
    implementedSolution: "Agente SDR com triagem, respostas aprovadas e alerta para humano.",
    soldService: "SDR IA WhatsApp",
    resultObtained: "Mais clareza sobre oportunidades, próximas ações e reuniões qualificadas.",
    timeToResult: "Primeiras melhorias operacionais em 30 dias.",
    objectionsFaced: "Receio de atendimento frio e dúvidas sobre implantação.",
    whenToUse: "Leads de saúde com alto volume de anúncios e follow-up irregular.",
    whenNotToUse: "Quando o lead exige garantia de resultado numérico.",
    proofsAvailable: "Resumo interno e print anonimizado aprovado.",
    internalNotes: "Nunca citar nome real nem números não aprovados.",
    tags: ["saude", "clinica", "reativacao"],
    active: true
  },
  {
    id: "case-franquia",
    title: "Padronização comercial para rede de franquias",
    clientAlias: "Franquia Y",
    isConfidential: true,
    segment: "Franquias",
    subsegment: "Serviços locais",
    initialProblem: "Cada unidade abordava os leads de uma forma diferente.",
    beforeScenario: "Muita perda por demora, falta de contexto e baixa cadência.",
    implementedSolution: "Playbook, templates e agente para qualificar antes do closer.",
    soldService: "CRM operacional + SDR IA",
    resultObtained: "Processo comercial mais previsível e melhor leitura de gargalos.",
    timeToResult: "45 dias para estabilizar a operação.",
    objectionsFaced: "Adoção da equipe e governança das mensagens.",
    whenToUse: "Leads de franquia com múltiplos responsáveis e necessidade de padrão.",
    whenNotToUse: "Operações sem responsável por aprovar playbook.",
    proofsAvailable: "Relatório interno anonimizado.",
    internalNotes: "Bom para objeção de processo, não para promessa de venda.",
    tags: ["franquias", "processo", "playbook"],
    active: true
  },
  {
    id: "case-odontologia",
    title: "Atendimento consultivo para odontologia premium",
    clientAlias: "Odonto Z",
    isConfidential: true,
    segment: "Saúde",
    subsegment: "Odontologia",
    initialProblem: "Pacientes pediam preço e sumiam antes da avaliação.",
    beforeScenario: "A equipe respondia dúvidas pontuais sem conduzir para diagnóstico.",
    implementedSolution: "Respostas consultivas, critérios de qualificação e agenda do closer.",
    soldService: "SDR IA + Google Calendar",
    resultObtained: "Conversas mais qualificadas antes de oferecer avaliação.",
    timeToResult: "3 semanas para o primeiro ciclo de aprendizado.",
    objectionsFaced: "Preço, confiança e medo de abordagem robótica.",
    whenToUse: "Clínicas com tickets altos e objeção de preço recorrente.",
    whenNotToUse: "Conversas que exigem orientação clínica individual.",
    proofsAvailable: "Playbook de objeções aprovado.",
    internalNotes: "Encaminhar dúvidas clínicas para humano.",
    tags: ["odontologia", "preco", "agenda"],
    active: true
  }
];

export const knowledgeDocuments: KnowledgeDocument[] = [
  {
    id: "know-metodologia",
    title: "Metodologia de SDR IA",
    type: "Metodologia",
    content: "O agente conversa de forma consultiva, usa contexto do CRM, cases aprovados e regras de qualificação antes de sugerir reunião.",
    tags: ["metodologia", "sdr", "ia"],
    active: true,
    updatedAt: "2026-05-12T15:00:00-03:00"
  },
  {
    id: "know-promessas",
    title: "Limites do que pode prometer",
    type: "Limites do que pode prometer",
    content: "Não prometer volume garantido de vendas, reuniões ou faturamento. Falar em organização, velocidade de atendimento e leitura de oportunidades.",
    tags: ["seguranca", "promessas"],
    active: true,
    updatedAt: "2026-05-10T10:00:00-03:00"
  },
  {
    id: "know-objection-price",
    title: "Objeção de preço",
    type: "Objeções",
    content: "Quando o lead disser que está caro, entender se a trava é orçamento, prioridade, confiança ou comparação com outra solução.",
    tags: ["objeção", "preço"],
    active: true,
    updatedAt: "2026-05-11T09:00:00-03:00"
  }
];

export const conversations: Conversation[] = [
  {
    id: "conv-ana",
    leadId: "lead-ana",
    status: "open",
    lastMessageAt: "2026-05-14T12:30:00-03:00",
    needsHuman: false,
    summary: "Lead retomada com proposta pendente e dúvida sobre implantação.",
    nextAction: "Enviar template aprovado de retomada com contexto da proposta."
  },
  {
    id: "conv-camila",
    leadId: "lead-camila",
    status: "needs_human",
    lastMessageAt: "2026-05-14T14:20:00-03:00",
    needsHuman: true,
    summary: "Lead de anúncio sem telefone válido e sem empresa identificada.",
    nextAction: "Humano deve validar dados antes da IA continuar."
  },
  {
    id: "conv-diego",
    leadId: "lead-diego",
    status: "scheduled",
    lastMessageAt: "2026-05-14T09:45:00-03:00",
    needsHuman: false,
    summary: "Lead aceitou reunião e escolheu horário.",
    nextAction: "Preparar closer com resumo do contexto."
  }
];

export const messages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-ana",
    leadId: "lead-ana",
    senderType: "ai",
    content: "Ana, retomando nossa conversa: pelo que vi, o ponto central era não deixar os leads de campanha esfriarem depois do primeiro contato. Faz sentido revisarmos isso numa conversa rápida esta semana?",
    createdAt: "2026-05-14T12:15:00-03:00",
    templateId: "tmpl-proposal"
  },
  {
    id: "msg-2",
    conversationId: "conv-ana",
    leadId: "lead-ana",
    senderType: "lead",
    content: "Faz sim. Só queria entender melhor se a implantação é muito pesada.",
    createdAt: "2026-05-14T12:30:00-03:00"
  },
  {
    id: "msg-3",
    conversationId: "conv-camila",
    leadId: "lead-camila",
    senderType: "lead",
    content: "Oi, quero saber como funciona.",
    createdAt: "2026-05-14T14:20:00-03:00"
  },
  {
    id: "msg-4",
    conversationId: "conv-diego",
    leadId: "lead-diego",
    senderType: "ai",
    content: "Perfeito, Diego. Agendei para sábado às 11h com a Patrícia. Vou enviar o resumo para ela chegar com o diagnóstico organizado.",
    createdAt: "2026-05-14T09:45:00-03:00"
  }
];

export const messageTemplates: MessageTemplate[] = [
  {
    id: "tmpl-reactivation",
    name: "Retomada consultiva",
    category: "reactivation",
    content: "Oi, {{nome}}. Retomando nossa conversa sobre {{dor}}, faz sentido revisar próximos passos numa conversa rápida?",
    stageTarget: "Leads parados",
    active: true,
    approvedOnWhatsapp: true
  },
  {
    id: "tmpl-proposal",
    name: "Proposta pendente",
    category: "proposal",
    content: "Oi, {{nome}}. Vi que ficamos na etapa de proposta. Quer que eu te ajude a revisar se ainda faz sentido para o cenário atual?",
    stageTarget: "Enviar proposta",
    active: true,
    approvedOnWhatsapp: true
  },
  {
    id: "tmpl-ad-response",
    name: "Resposta lead anúncio",
    category: "ad_response",
    content: "Oi! Vi seu contato por aqui. Para eu te direcionar melhor: hoje o maior gargalo está em responder leads, qualificar ou agendar reuniões?",
    stageTarget: "Novo lead",
    active: true,
    approvedOnWhatsapp: false
  }
];

export const learningInsights: LearningInsight[] = [
  {
    id: "insight-template",
    type: "message_performance",
    summary: "A abordagem com proposta pendente respondeu 38% acima da média.",
    evidence: { template: "Proposta pendente", responseRate: 0.57, baseline: 0.41 },
    recommendation: "Usar variação com contexto de proposta em leads na etapa Enviar proposta.",
    status: "pending",
    createdAt: "2026-05-14T08:00:00-03:00"
  },
  {
    id: "insight-objection",
    type: "objection",
    summary: "Preço foi a objeção mais frequente nos últimos 7 dias.",
    evidence: { mentions: 19, period: "7 dias" },
    recommendation: "Atualizar resposta aprovada para diferenciar orçamento, prioridade e confiança.",
    status: "pending",
    createdAt: "2026-05-14T08:10:00-03:00"
  },
  {
    id: "insight-case",
    type: "case_usage",
    summary: "O case de clínica apareceu em 12 conversas e gerou 4 reuniões.",
    evidence: { case: "Clínica X", conversations: 12, meetings: 4 },
    recommendation: "Testar o case em leads de saúde com objeção de atendimento automatizado.",
    status: "approved",
    createdAt: "2026-05-13T08:00:00-03:00"
  }
];

export const integrations: IntegrationStatus[] = [
  { id: "int-whatsapp", type: "whatsapp", status: "desconectado", lastError: "Token não configurado" },
  { id: "int-openai", type: "openai", status: "desconectado", lastError: "OPENAI_API_KEY ausente" },
  { id: "int-supabase", type: "supabase", status: "desconectado", lastError: "DATABASE_URL ausente" },
  { id: "int-calendar", type: "google_calendar", status: "desconectado", lastError: "OAuth não conectado" }
];

export const agentSettings: AgentSettings = {
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
