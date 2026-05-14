import { NextResponse } from "next/server";
import { markOptOut } from "@/lib/services/lead-service";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ data: await markOptOut(id) });
}
