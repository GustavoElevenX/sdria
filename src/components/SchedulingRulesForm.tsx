"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { AgentSettings } from "@/lib/types";

export function SchedulingRulesForm({ settings }: { settings: AgentSettings }) {
  const [rules, setRules] = useState(JSON.stringify(settings.schedulingRules, null, 2));
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("Salvando...");
    const response = await fetch("/api/settings/agent", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...settings, schedulingRules: JSON.parse(rules) })
    });
    setStatus(response.ok ? "Regras salvas." : `Erro: ${await response.text()}`);
  }

  return (
    <div className="grid gap-3 p-4">
      <textarea className="min-h-80 rounded-md border border-border p-3 font-mono text-xs outline-none focus:border-primary" value={rules} onChange={(event) => setRules(event.target.value)} />
      <div className="flex items-center gap-3">
        <Button type="button" onClick={save}>Salvar regras de agenda</Button>
        {status ? <span className="text-sm text-muted-foreground">{status}</span> : null}
      </div>
    </div>
  );
}
