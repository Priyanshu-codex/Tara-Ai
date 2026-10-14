import { NextRequest, NextResponse } from "next/server";
import type { AiraMessage } from "@/lib/aira/types";

// In-memory conversation store as reliable local server backup
const inMemoryConversations = new Map<string, AiraMessage[]>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId") || "default";

  const messages = inMemoryConversations.get(conversationId) || [];
  return NextResponse.json({
    success: true,
    conversationId,
    messages,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const conversationId = body.conversationId || `conv-${Date.now()}`;
    const messages: AiraMessage[] = body.messages || [];

    inMemoryConversations.set(conversationId, messages);

    return NextResponse.json({
      success: true,
      conversationId,
      count: messages.length,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId") || "default";

  inMemoryConversations.delete(conversationId);

  return NextResponse.json({
    success: true,
    message: "Conversation history cleared successfully.",
  });
}
