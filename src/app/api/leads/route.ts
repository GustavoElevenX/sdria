import { NextResponse } from "next/server";
import { getLeads } from "@/lib/services/lead-service";

export function GET() {
  return NextResponse.json({ data: getLeads() });
}
