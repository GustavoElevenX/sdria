import { NextResponse } from "next/server";
import { approveLearningInsight } from "@/lib/services/learning-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await _request.json().catch(() => ({}));
  return NextResponse.json({ data: await approveLearningInsight(id, body.action) });
}
