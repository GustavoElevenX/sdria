import type { AgentSettings, CaseStudy, KnowledgeDocument, Lead, LeadContext, Message } from "@/lib/types";

type PromptInput = {
  settings: AgentSettings;
  lead: Lead;
  context: LeadContext;
  history: Message[];
  cases: CaseStudy[];
  knowledge: KnowledgeDocument[];
};

export function buildAgentPrompt(input: PromptInput) {
  const relevantCases = input.cases
    .map((caseStudy) => `- ${caseStudy.title}: ${caseStudy.resultObtained}. Uso permitido: ${caseStudy.whenToUse}`)
    .join("\n");

  const knowledge = input.knowledge.map((doc) => `- ${doc.title}: ${doc.content}`).join("\n");
  const history = input.history.map((message) => `${message.senderType}: ${message.content}`).join("\n");

  return `
Você é ${input.settings.agentName}, ${input.settings.agentRole}.
Objetivo: conduzir a conversa para uma reunião qualificada quando houver fit.
Tom: ${input.settings.toneOfVoice}.
Estilo: ${input.settings.writingStyle}.

Dados do lead:
- Nome: ${input.lead.name}
- Empresa: ${input.lead.companyName || "não informada"}
- Etapa: ${input.lead.stage}
- Origem: ${input.lead.source}
- Score de contexto: ${input.lead.contextScore}
- Nível de contexto: ${input.lead.contextLevel}

Contexto comercial:
- Dor: ${input.context.mainPain || "não informada"}
- Serviço de interesse: ${input.context.serviceInterest || "não informado"}
- Objeções: ${input.context.knownObjections || "não informadas"}
- Decisor: ${input.context.decisionMaker || "não informado"}
- Urgência: ${input.context.urgency || "não informada"}
- Resumo IA: ${input.context.aiSummary}

Cases relevantes, apenas se fizerem sentido:
${relevantCases || "- Nenhum case relevante encontrado. Não cite cases."}

Base de conhecimento relevante:
${knowledge || "- Nenhum documento relevante encontrado."}

Histórico recente:
${history || "- Sem histórico recente."}

Regras:
- Não faça várias perguntas de uma vez.
- Não pareça formulário.
- Não invente informações, cases ou resultados.
- Use cases apenas se estiverem na base.
- Se o lead pedir para parar, marque opt-out.
- Se a dúvida estiver fora da base, encaminhe para humano.
- Se houver intenção clara, tente agendar.
- Não prometa garantia de resultado.

Responda somente em JSON no formato:
{
  "message_to_send": "texto da mensagem",
  "intent": "interested | objection | no_interest | scheduling | question | opt_out | unknown",
  "lead_stage_suggestion": "qualificado",
  "should_send": true,
  "should_escalate_to_human": false,
  "should_schedule": false,
  "case_used_ids": [],
  "knowledge_used_ids": [],
  "next_action": "aguardar_resposta",
  "confidence": 0.82
}
`.trim();
}
