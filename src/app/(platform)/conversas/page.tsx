import { ConversationInbox } from "@/components/ConversationInbox";
import { getConversationHistory, getConversations } from "@/lib/services/conversation-service";

export default function ConversationsPage() {
  const conversations = getConversations();
  const active = conversations[0];
  const history = getConversationHistory(active.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Inbox de conversas</h1>
        <p className="text-sm text-muted-foreground">WhatsApp/CRM com controle IA, humano, contexto e próxima ação.</p>
      </div>
      <ConversationInbox conversations={conversations} active={active} messages={history} />
    </div>
  );
}
