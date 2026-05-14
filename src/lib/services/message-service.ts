import type { SenderType } from "@/lib/types";

export function saveMessage(input: {
  conversationId: string;
  leadId: string;
  senderType: SenderType;
  content: string;
  messageTemplateId?: string;
}) {
  return {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString()
  };
}

export function classifyLeadIntent(message: string) {
  const normalized = message.toLowerCase();
  if (["parar", "remover", "não quero", "nao quero"].some((term) => normalized.includes(term))) return "opt_out";
  if (["agenda", "horário", "horario", "reunião", "reuniao"].some((term) => normalized.includes(term))) return "scheduling";
  if (["caro", "preço", "preco", "orçamento", "orcamento"].some((term) => normalized.includes(term))) return "objection";
  if (["sim", "faz sentido", "quero", "interesse"].some((term) => normalized.includes(term))) return "interested";
  if (normalized.includes("?")) return "question";
  return "unknown";
}
