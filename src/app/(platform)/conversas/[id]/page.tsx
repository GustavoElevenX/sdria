import { notFound } from "next/navigation";
import { ConversationInbox } from "@/components/ConversationInbox";
import { getConversation, getConversationHistory, getConversations } from "@/lib/services/conversation-service";

export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const active = await getConversation(id);
  if (!active) notFound();
  const conversations = await getConversations();
  const history = await getConversationHistory(active.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Conversa com {active.lead?.name}</h1>
        <p className="text-sm text-muted-foreground">IA pausa automaticamente quando humano assume.</p>
      </div>
      <ConversationInbox conversations={conversations} active={active} messages={history} />
    </div>
  );
}
