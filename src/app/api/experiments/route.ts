import { NextResponse } from "next/server";
import { isAuthorizedRequest, unauthorized } from "@/lib/security/http";
import { createExperiment, getExperiments } from "@/lib/services/experiment-service";

export async function GET(request: Request) {
  if (!isAuthorizedRequest(request, "webhook")) return unauthorized();
  return NextResponse.json({ data: await getExperiments() });
}

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request, "webhook")) return unauthorized();
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await createExperiment(body) }, { status: 201 });
}
