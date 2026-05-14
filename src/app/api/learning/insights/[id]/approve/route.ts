import { NextResponse } from "next/server";
import { approveLearningInsight } from "@/lib/services/learning-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ data: approveLearningInsight(id) });
}
