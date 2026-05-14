import { conversations, leads, messages } from "@/lib/mock-data";

export function getConversations() {
  return conversations.map((conversation) => ({
    ...conversation,
    lead: leads.find((lead) => lead.id === conversation.leadId)
  }));
}

export function getConversationHistory(conversationId: string) {
  return messages.filter((message) => message.conversationId === conversationId);
}

export function getConversation(conversationId: string) {
  const conversation = conversations.find((item) => item.id === conversationId);
  if (!conversation) return null;
  return {
    ...conversation,
    lead: leads.find((lead) => lead.id === conversation.leadId),
    messages: getConversationHistory(conversationId)
  };
}

export function escalateToHuman(conversationId: string, reason: string) {
  return {
    conversationId,
    status: "needs_human",
    reason,
    updatedAt: new Date().toISOString()
  };
}
