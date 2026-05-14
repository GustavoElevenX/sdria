import { NextResponse } from "next/server";
import { importLeadRows, parseLeadFile, previewImport } from "@/lib/services/lead-import-service";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    const rows = await parseLeadFile(file);
    const previewOnly = form.get("preview") === "true";
    if (previewOnly) return NextResponse.json({ data: previewImport(rows) });
    return NextResponse.json({ data: await importLeadRows(rows) });
  }

  const body = await request.json().catch(() => ({ rows: [] }));
  if (body.import === true) return NextResponse.json({ data: await importLeadRows(body.rows ?? []) });
  return NextResponse.json({
    data: previewImport(body.rows ?? []),
    nextStep: "Rodar análise inicial de contexto com IA"
  });
}
