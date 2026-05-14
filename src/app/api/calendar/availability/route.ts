import { NextResponse } from "next/server";
import { checkCalendarAvailability } from "@/lib/services/calendar-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.json({
    data: await checkCalendarAvailability(url.searchParams.get("userId") ?? "closer-default", {
      start: url.searchParams.get("start") ?? new Date().toISOString(),
      end: url.searchParams.get("end") ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  });
}
