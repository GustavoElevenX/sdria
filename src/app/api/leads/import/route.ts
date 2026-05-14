import { NextResponse } from "next/server";
import { previewImport } from "@/lib/services/lead-import-service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({ rows: [] }));
  return NextResponse.json({
    data: previewImport(body.rows ?? []),
    nextStep: "Rodar análise inicial de contexto com IA"
  });
}
