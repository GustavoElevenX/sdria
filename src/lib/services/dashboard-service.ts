import { conversations, leads, learningInsights, messages } from "@/lib/mock-data";

export function getDashboardMetrics() {
  const sentMessages = messages.filter((message) => message.senderType === "ai" || message.senderType === "human").length;
  const leadReplies = messages.filter((message) => message.senderType === "lead").length;
  const meetings = leads.filter((lead) => lead.hasMeeting).length;

  return {
    cards: [
      { label: "Total de leads", value: leads.length.toString(), trend: "+12%" },
      { label: "Prontos para prospecção", value: leads.filter((lead) => lead.readyForOutreach).length.toString(), trend: "+8%" },
      { label: "Contexto insuficiente", value: leads.filter((lead) => lead.contextLevel === "baixo").length.toString(), trend: "-5%" },
      { label: "Mensagens enviadas", value: sentMessages.toString(), trend: "+21%" },
      { label: "Taxa de resposta", value: `${Math.round((leadReplies / Math.max(sentMessages, 1)) * 100)}%`, trend: "+6%" },
      { label: "Leads qualificados", value: leads.filter((lead) => lead.stage === "Qualificado").length.toString(), trend: "+3%" },
      { label: "Reuniões agendadas", value: meetings.toString(), trend: "+4%" },
      { label: "Conversão para reunião", value: `${Math.round((meetings / leads.length) * 100)}%`, trend: "+2%" },
      { label: "Tempo médio de resposta", value: "8 min", trend: "-3 min" },
      { label: "Precisam de humano", value: conversations.filter((conversation) => conversation.needsHuman).length.toString(), trend: "atenção" }
    ],
    funnel: [
      { label: "Importados", value: 128 },
      { label: "Contatados", value: 92 },
      { label: "Responderam", value: 47 },
      { label: "Qualificados", value: 24 },
      { label: "Reunião agendada", value: 14 }
    ],
    responseByDay: [
      { label: "Seg", value: 0.31 },
      { label: "Ter", value: 0.42 },
      { label: "Qua", value: 0.39 },
      { label: "Qui", value: 0.46 },
      { label: "Sex", value: 0.34 }
    ],
    insights: learningInsights.slice(0, 5)
  };
}
