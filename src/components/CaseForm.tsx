"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const fields = [
  ["title", "Título"],
  ["clientAlias", "Nome público/apelido"],
  ["segment", "Segmento"],
  ["subsegment", "Subsegmento"],
  ["initialProblem", "Problema inicial"],
  ["beforeScenario", "Cenário antes"],
  ["implementedSolution", "Solução implementada"],
  ["soldService", "Serviço vendido"],
  ["resultObtained", "Resultado obtido"],
  ["timeToResult", "Tempo para resultado"],
  ["objectionsFaced", "Objeções enfrentadas"],
  ["whenToUse", "Quando usar"],
  ["whenNotToUse", "Quando não usar"],
  ["proofsAvailable", "Provas disponíveis"],
  ["internalNotes", "Observações internas"],
  ["tags", "Tags"]
];

export function CaseForm() {
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Salvando...");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    const response = await fetch("/api/cases", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...payload,
        tags: payload.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [],
        isConfidential: formData.get("isConfidential") === "on",
        active: formData.get("active") === "on"
      })
    });
    setStatus(response.ok ? "Case salvo no Supabase." : `Erro: ${await response.text()}`);
  }

  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 p-4 md:grid-cols-2">
        {fields.map(([name, label]) => (
          <label key={name} className="grid gap-2 text-sm">
            <span>{label}</span>
            <input name={name} className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm">
          <input name="isConfidential" type="checkbox" defaultChecked />
          Confidencial
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" defaultChecked />
          Ativo
        </label>
      </div>
      <div className="flex items-center gap-3 border-t border-border p-4">
        <Button type="submit">Salvar case</Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </div>
    </form>
  );
}
