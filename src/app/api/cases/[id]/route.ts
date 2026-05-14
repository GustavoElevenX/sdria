import { NextResponse } from "next/server";
import { cases } from "@/lib/mock-data";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: { id, ...body } });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exists = cases.some((item) => item.id === id);
  return NextResponse.json({ data: { id, deleted: exists } });
}
