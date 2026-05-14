"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import type { Conversation, Lead, Message } from "@/lib/types";

type InboxConversation = Conversation & { lead?: Lead };

export function ConversationInbox({
  conversations,
  active,
  messages
}: {
  conversations: InboxConversation[];
  active: InboxConversation;
  messages: Message[];
}) {
  const [content, setContent] = useState("");

  async function post(path: string, body?: Record<string, unknown>) {
    await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    window.location.reload();
  }

  return (
    <div className="grid min-h-[680px] grid-cols-[300px_1fr_320px] overflow-hidden rounded-lg border border-border bg-white">
      <aside className="border-r border-border">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold">Conversas</h2>
        </div>
        <div className="divide-y divide-border">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/conversas/${conversation.id}`} className="block p-4 hover:bg-muted/60">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{conversation.lead?.name}</p>
                  <p className="text-sm text-muted-foreground">{conversation.lead?.companyName || "Sem empresa"}</p>
                </div>
                {conversation.needsHuman ? <Badge tone="danger">humano</Badge> : <Badge tone="success">IA</Badge>}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{conversation.summary}</p>
            </Link>
          ))}
        </div>
      </aside>
      <main className="flex flex-col">
        <div className="border-b border-border p-4">
          <h2 className="font-semibold">{active.lead?.name}</h2>
          <p className="text-sm text-muted-foreground">{active.summary}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
          {messages.map((message) => <MessageBubble key={message.id} message={message} />)}
        </div>
        <div className="border-t border-border p-4">
          <textarea className="h-20 w-full resize-none rounded-md border border-border p-3 text-sm outline-none focus:border-primary" placeholder="Mensagem humana ou nota interna" value={content} onChange={(event) => setContent(event.target.value)} />
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => post(`/api/conversations/${active.id}/messages`, { senderType: "system", content })}>Nota interna</Button>
            <Button onClick={() => post(`/api/conversations/${active.id}/messages`, { senderType: "human", content })}>Enviar e pausar IA</Button>
          </div>
        </div>
      </main>
      <aside className="border-l border-border p-4">
        <Panel className="p-4">
          <p className="text-sm text-muted-foreground">Score do lead</p>
          <strong className="text-2xl">{active.lead?.leadScore ?? 0}</strong>
          <p className="mt-3 text-sm text-muted-foreground">{active.nextAction}</p>
        </Panel>
        <div className="mt-4 grid gap-2">
          <Button onClick={() => post(`/api/conversations/${active.id}/escalate`, { reason: "Operador assumiu conversa" })}>Assumir conversa</Button>
          <Button variant="secondary" onClick={() => post(`/api/conversations/${active.id}/resume-ai`)}>Devolver para IA</Button>
          <Button variant="secondary" onClick={() => post("/api/calendar/events", { leadId: active.lead?.id, conversationId: active.id, startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), title: "Diagnóstico comercial" })}>Agendar reunião</Button>
          <Button variant="danger" onClick={() => post(`/api/leads/${active.lead?.id}/opt-out`)}>Marcar opt-out</Button>
        </div>
      </aside>
    </div>
  );
}
