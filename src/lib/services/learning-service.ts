import { learningInsights, messages } from "@/lib/mock-data";

export function getLearningInsights() {
  return learningInsights;
}

export function approveLearningInsight(id: string) {
  return { id, status: "approved", updatedAt: new Date().toISOString() };
}

export function rejectLearningInsight(id: string) {
  return { id, status: "rejected", updatedAt: new Date().toISOString() };
}

export function runDailyLearningAnalysis() {
  const leadReplies = messages.filter((message) => message.senderType === "lead").length;
  const aiMessages = messages.filter((message) => message.senderType === "ai").length;
  return {
    analyzedMessages: messages.length,
    responseRate: aiMessages ? leadReplies / aiMessages : 0,
    generatedInsights: learningInsights.filter((insight) => insight.status === "pending"),
    createdAt: new Date().toISOString()
  };
}
