"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel, PanelHeader } from "@/components/ui/panel";
import type { AgentSettings } from "@/lib/types";

function csv(value: string[]) {
  return value.join(", ");
}

function split(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function SettingsForm({ settings }: { settings: AgentSettings }) {
  const [form, setForm] = useState({
    agentName: settings.agentName,
    agentRole: settings.agentRole,
    toneOfVoice: settings.toneOfVoice,
    writingStyle: settings.writingStyle,
    forbiddenWords: csv(settings.forbiddenWords),
    preferredWords: csv(settings.preferredWords),
    maxResponseLength: String(settings.maxResponseLength),
    qualificationRules: JSON.stringify(settings.qualificationRules, null, 2),
    followupRules: JSON.stringify(settings.followupRules, null, 2),
    schedulingRules: JSON.stringify(settings.schedulingRules, null, 2),
    humanEscalationRules: JSON.stringify(settings.humanEscalationRules, null, 2),
    optOutRules: JSON.stringify(settings.optOutRules, null, 2),
    commercialRules: JSON.stringify(settings.commercialRules, null, 2)
  });
  const [status, setStatus] = useState<string>("");

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("Salvando...");

    const payload: AgentSettings = {
      agentName: form.agentName,
      agentRole: form.agentRole,
      toneOfVoice: form.toneOfVoice,
      writingStyle: form.writingStyle,
      forbiddenWords: split(form.forbiddenWords),
      preferredWords: split(form.preferredWords),
      maxResponseLength: Number(form.maxResponseLength),
      qualificationRules: JSON.parse(form.qualificationRules),
      followupRules: JSON.parse(form.followupRules),
      schedulingRules: JSON.parse(form.schedulingRules),
      humanEscalationRules: JSON.parse(form.humanEscalationRules),
      optOutRules: JSON.parse(form.optOutRules),
      commercialRules: JSON.parse(form.commercialRules)
    };

    const response = await fetch("/api/settings/agent", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setStatus(`Erro ao salvar: ${await response.text()}`);
      return;
    }

    setStatus("Configurações salvas no Supabase.");
  }

  return (
    <form className="space-y-5" onSubmit={submit}>
      <Panel>
        <PanelHeader title="Agente" />
        <div className="grid gap-4 p-4 md:grid-cols-2">
          {[
            ["agentName", "Nome do agente"],
            ["agentRole", "Cargo simulado"],
            ["toneOfVoice", "Tom de voz"],
            ["writingStyle", "Estilo de escrita"],
            ["forbiddenWords", "Palavras proibidas"],
            ["preferredWords", "Palavras preferidas"],
            ["maxResponseLength", "Tamanho máximo de resposta"]
          ].map(([key, label]) => (
            <label key={key} className="grid gap-2 text-sm">
              <span className="font-medium">{label}</span>
              <input className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" value={form[key as keyof typeof form]} onChange={(event) => update(key as keyof typeof form, event.target.value)} />
            </label>
          ))}
        </div>
      </Panel>
      <Panel>
        <PanelHeader title="Regras em JSON editável" eyebrow="Comercial, follow-up, agenda, qualificação, opt-out e escalação" />
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          {[
            ["qualificationRules", "Qualificação"],
            ["followupRules", "Follow-up"],
            ["schedulingRules", "Agendamento"],
            ["humanEscalationRules", "Escalação humana"],
            ["optOutRules", "Opt-out"],
            ["commercialRules", "Comercial"]
          ].map(([key, label]) => (
            <label key={key} className="grid gap-2 text-sm">
              <span className="font-medium">{label}</span>
              <textarea className="min-h-44 rounded-md border border-border p-3 font-mono text-xs outline-none focus:border-primary" value={form[key as keyof typeof form]} onChange={(event) => update(key as keyof typeof form, event.target.value)} />
            </label>
          ))}
        </div>
      </Panel>
      <div className="flex items-center gap-3">
        <Button type="submit">Salvar configurações</Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </div>
    </form>
  );
}
