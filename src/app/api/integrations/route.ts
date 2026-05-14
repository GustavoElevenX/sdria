import { NextResponse } from "next/server";
import { getIntegrations } from "@/lib/services/integration-service";

export async function GET() {
  return NextResponse.json({ data: await getIntegrations() });
}
