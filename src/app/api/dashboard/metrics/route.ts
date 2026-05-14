import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/services/dashboard-service";

export async function GET() {
  return NextResponse.json({ data: await getDashboardMetrics() });
}
