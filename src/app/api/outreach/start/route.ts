import { NextResponse } from "next/server";
import { isAuthorizedRequest, unauthorized } from "@/lib/security/http";
import { startOutreach } from "@/lib/services/outreach-service";

export async function POST(request: Request) {
  if (!isAuthorizedRequest(request, "webhook")) return unauthorized();
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await startOutreach(body) });
}
