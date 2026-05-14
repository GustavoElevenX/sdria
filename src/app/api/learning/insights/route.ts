import { NextResponse } from "next/server";
import { getLearningInsights, runDailyLearningAnalysis } from "@/lib/services/learning-service";

export async function GET() {
  return NextResponse.json({ data: await getLearningInsights() });
}

export async function POST() {
  return NextResponse.json({ data: await runDailyLearningAnalysis() });
}
