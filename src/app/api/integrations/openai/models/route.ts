import { NextResponse } from "next/server";
import { isAuthorizedRequest, unauthorized } from "@/lib/security/http";
import { validateConfiguredOpenAIModels } from "@/lib/services/openai-model-service";

export async function GET(request: Request) {
  if (!isAuthorizedRequest(request, "webhook")) return unauthorized();
  return NextResponse.json({ data: await validateConfiguredOpenAIModels() });
}
