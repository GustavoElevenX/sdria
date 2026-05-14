import { NextResponse } from "next/server";
import { getKnowledgeDocuments, upsertKnowledgeDocument } from "@/lib/services/knowledge-search-service";

export async function GET() {
  return NextResponse.json({ data: await getKnowledgeDocuments() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(
    {
      data: await upsertKnowledgeDocument(body)
    },
    { status: 201 }
  );
}
