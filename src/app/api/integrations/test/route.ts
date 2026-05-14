import { NextResponse } from "next/server";
import { testIntegration } from "@/lib/services/integration-service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: testIntegration(body.type ?? "openai") });
}
