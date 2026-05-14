import { NextResponse } from "next/server";
import { isAuthorizedRequest, unauthorized } from "@/lib/security/http";
import { processOutreachJobs } from "@/lib/services/followup-service";

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request, "cron")) return unauthorized();
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await processOutreachJobs(body.limit ?? 50) });
}
