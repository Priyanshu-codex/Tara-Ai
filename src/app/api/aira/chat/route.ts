import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, generateAiraResponse } from "@/lib/aira/service";
import type { AiraChatRequest } from "@/lib/aira/types";

export async function POST(req: NextRequest) {
  try {
    // 1. Identify client for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const authHeader = req.headers.get("authorization") || "anonymous";
    const clientId = `${ip}:${authHeader}`;

    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        {
          success: false,
          error: "You are sending messages too quickly. Please pause for a moment!",
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate body
    const body = (await req.json()) as AiraChatRequest;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const message = body.message ? String(body.message).trim() : "";

    // Require either a message or a quizAnswer submission
    if (!message && !body.quizAnswer && !body.actionType) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    if (message.length > 1200) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is too long. Please keep questions under 1,200 characters.",
        },
        { status: 400 }
      );
    }

    // 3. Process with Aira orchestrator
    const result = await generateAiraResponse(body);

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown internal server error.";
    console.error("Aira Chat API Error:", errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: "Aira is momentarily recharging her circuits. Please try again in a few seconds!",
        details: process.env.NODE_ENV === "development" ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}
