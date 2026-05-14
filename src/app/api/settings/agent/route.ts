import { NextResponse } from "next/server";
import { getAgentSettings, updateAgentSettings } from "@/lib/services/settings-service";

export function GET() {
  return NextResponse.json({ data: getAgentSettings() });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: updateAgentSettings(body) });
}
