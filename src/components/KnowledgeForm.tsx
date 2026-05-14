"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const types = ["Quem somos", "Serviços", "Metodologia", "Diferenciais", "FAQ", "Objeções", "Política comercial", "Processo de implantação", "Limites do que pode prometer", "Tom de voz", "Playbook comercial"];

export function KnowledgeForm() {
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Salvando e gerando embeddings...");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>;
    const response = await fetch("/api/knowledge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...payload,
        tags: payload.tags?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [],
        active: true
      })
    });
    setStatus(response.ok ? "Documento salvo, chunks gerados e embeddings processados quando OpenAI estiver configurado." : `Erro: ${await response.text()}`);
  }

  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 p-4">
        <label className="grid gap-2 text-sm">
          <span>Título</span>
          <input name="title" className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" />
        </label>
        <label className="grid gap-2 text-sm">
          <span>Tipo</span>
          <select name="type" className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary">
            {types.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span>Conteúdo</span>
          <textarea name="content" className="min-h-56 rounded-md border border-border p-3 outline-none focus:border-primary" />
        </label>
        <label className="grid gap-2 text-sm">
          <span>Tags</span>
          <input name="tags" className="h-10 rounded-md border border-border px-3 outline-none focus:border-primary" placeholder="sdr, whatsapp, objeções" />
        </label>
      </div>
      <div className="flex items-center gap-3 border-t border-border p-4">
        <Button type="submit">Salvar e gerar embeddings</Button>
        {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      </div>
    </form>
  );
}
