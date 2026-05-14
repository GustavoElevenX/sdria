import { ConversationInbox } from "@/components/ConversationInbox";
import { getConversationHistory, getConversations } from "@/lib/services/conversation-service";

export default async function ConversationsPage() {
  const conversations = await getConversations();
  const active = conversations[0];
  const history = active ? await getConversationHistory(active.id) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Inbox de conversas</h1>
        <p className="text-sm text-muted-foreground">WhatsApp/CRM com controle IA, humano, contexto e próxima ação.</p>
      </div>
      {active ? <ConversationInbox conversations={conversations} active={active} messages={history} /> : <p className="rounded-lg border border-border bg-white p-6 text-sm text-muted-foreground">Nenhuma conversa encontrada no Supabase.</p>}
    </div>
  );
}
