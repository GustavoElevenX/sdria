import { NextResponse } from "next/server";
import { knowledgeDocuments } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({ data: knowledgeDocuments });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json(
    {
      data: {
        id: crypto.randomUUID(),
        ...body,
        chunksGenerated: true,
        embeddingsQueued: true
      }
    },
    { status: 201 }
  );
}
