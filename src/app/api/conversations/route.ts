import { NextResponse } from "next/server";
import { getConversations } from "@/lib/services/conversation-service";

export async function GET() {
  return NextResponse.json({ data: await getConversations() });
}
