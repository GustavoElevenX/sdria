import { NextResponse } from "next/server";
import { getLeads } from "@/lib/services/lead-service";

export async function GET() {
  return NextResponse.json({ data: await getLeads() });
}
