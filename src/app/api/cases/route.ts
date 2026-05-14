import { NextResponse } from "next/server";
import { getCases, upsertCase } from "@/lib/services/case-search-service";

export async function GET() {
  return NextResponse.json({ data: await getCases() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: await upsertCase(body) }, { status: 201 });
}
