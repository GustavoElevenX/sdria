import { NextResponse } from "next/server";
import { deleteKnowledgeDocument, upsertKnowledgeDocument } from "@/lib/services/knowledge-search-service";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await upsertKnowledgeDocument({ id, ...body }) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ data: await deleteKnowledgeDocument(id) });
}
