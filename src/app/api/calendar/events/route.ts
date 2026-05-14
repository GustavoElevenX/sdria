import { NextResponse } from "next/server";
import { createCalendarEvent } from "@/lib/services/calendar-service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: createCalendarEvent(body) }, { status: 201 });
}
