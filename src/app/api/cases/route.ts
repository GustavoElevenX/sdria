import { NextResponse } from "next/server";
import { cases } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({ data: cases });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: { id: crypto.randomUUID(), ...body, active: body.active ?? true } }, { status: 201 });
}
