import { NextResponse } from "next/server";
import { getLearningInsights, runDailyLearningAnalysis } from "@/lib/services/learning-service";

export function GET() {
  return NextResponse.json({ data: getLearningInsights(), dailyAnalysis: runDailyLearningAnalysis() });
}
