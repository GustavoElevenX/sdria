import { NextResponse } from "next/server";
import { getIntegrations } from "@/lib/services/integration-service";

export function GET() {
  return NextResponse.json({ data: getIntegrations() });
}
