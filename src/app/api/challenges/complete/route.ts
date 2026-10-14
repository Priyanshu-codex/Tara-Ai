import { NextRequest, NextResponse } from "next/server";
import { challenges } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { challengeId, userId = "student-1" } = body;

    if (!challengeId) {
      return NextResponse.json({ success: false, error: "Challenge ID is required." }, { status: 400 });
    }

    const challenge = challenges.find((c) => c.id === challengeId);
    const xpReward = challenge ? challenge.xpReward : 100;

    return NextResponse.json({
      success: true,
      challengeId,
      xpAwarded: xpReward,
      message: `Challenge completed! You earned +${xpReward} XP!`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
