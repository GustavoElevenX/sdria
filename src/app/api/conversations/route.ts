import { NextResponse } from "next/server";
import { getConversations } from "@/lib/services/conversation-service";

export function GET() {
  return NextResponse.json({ data: getConversations() });
}
