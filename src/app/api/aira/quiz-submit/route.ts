import { NextRequest, NextResponse } from "next/server";
import { evaluateQuizAnswer } from "@/lib/aira/quizEngine";
import type { AiraQuizSubmission } from "@/lib/aira/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AiraQuizSubmission & {
      currentScore?: number;
      totalAnswered?: number;
    };

    if (!body || !body.questionId || typeof body.selectedOption !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid quiz submission parameters." },
        { status: 400 }
      );
    }

    if (body.selectedOption < 0 || body.selectedOption > 5) {
      return NextResponse.json(
        { success: false, error: "Selected option index out of bounds." },
        { status: 400 }
      );
    }

    const evaluation = evaluateQuizAnswer(
      body.questionId,
      body.selectedOption,
      body.currentScore || 0,
      body.totalAnswered || 0
    );

    return NextResponse.json(
      {
        success: true,
        evaluation,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
