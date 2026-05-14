"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LeadImportForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Array<Record<string, unknown>>>([]);
  const [status, setStatus] = useState("");

  async function send(previewOnly: boolean) {
    if (!file) return;
    setStatus(previewOnly ? "Gerando preview..." : "Importando e analisando contexto...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("preview", previewOnly ? "true" : "false");

    const response = await fetch("/api/leads/import", {
      method: "POST",
      body: formData
    });
    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error ?? "Erro ao importar");
      return;
    }
    if (previewOnly) setPreview(payload.data ?? []);
    setStatus(previewOnly ? "Preview pronto." : `Importação concluída: ${payload.data?.imported?.length ?? 0} leads.`);
  }

  return (
    <div className="space-y-4">
      <div className="grid min-h-60 place-items-center rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center">
        <div>
          <Upload className="mx-auto text-primary" size={42} />
          <h2 className="mt-4 font-semibold">Envie um CSV ou XLSX</h2>
          <p className="mt-1 text-sm text-muted-foreground">O arquivo é lido, normalizado, deduplicado e importado no Supabase.</p>
          <input className="mt-4 block text-sm" type="file" accept=".csv,.xlsx,.xls" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          <div className="mt-4 flex justify-center gap-2">
            <Button type="button" variant="secondary" onClick={() => send(true)} disabled={!file}>Preview</Button>
            <Button type="button" onClick={() => send(false)} disabled={!file}>Importar e analisar</Button>
          </div>
          {status ? <p className="mt-3 text-sm text-muted-foreground">{status}</p> : null}
        </div>
      </div>
      {preview.length ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-white">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                {Object.keys(preview[0]).map((key) => <th key={key} className="px-3 py-2">{key}</th>)}
              </tr>
            </thead>
            <tbody>
              {preview.slice(0, 20).map((row, index) => (
                <tr key={index} className="border-t border-border">
                  {Object.values(row).map((value, valueIndex) => <td key={valueIndex} className="px-3 py-2">{String(value)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
