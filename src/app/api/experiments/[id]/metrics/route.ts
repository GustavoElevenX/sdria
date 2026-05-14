import { NextResponse } from "next/server";
import { isAuthorizedRequest, unauthorized } from "@/lib/security/http";
import { calculateExperimentMetrics } from "@/lib/services/experiment-service";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthorizedRequest(request, "webhook")) return unauthorized();
  const { id } = await params;
  return NextResponse.json({ data: await calculateExperimentMetrics(id) });
}
