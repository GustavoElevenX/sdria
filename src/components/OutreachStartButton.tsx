"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OutreachStartButton({ leadIds }: { leadIds?: string[] }) {
  const [status, setStatus] = useState("");

  async function start() {
    setStatus("Iniciando prospecção...");
    const response = await fetch("/api/outreach/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ leadIds, limit: leadIds?.length ?? 20, dryRun: false })
    });
    const payload = await response.json();
    setStatus(response.ok ? `${payload.data?.count ?? 0} leads processados.` : `Erro: ${payload.error ?? "falha"}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" onClick={start}><Send size={16} /> Iniciar prospecção</Button>
      {status ? <span className="text-sm text-muted-foreground">{status}</span> : null}
    </div>
  );
}
