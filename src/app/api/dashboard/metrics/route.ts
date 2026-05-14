import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/services/dashboard-service";

export function GET() {
  return NextResponse.json({ data: getDashboardMetrics() });
}
