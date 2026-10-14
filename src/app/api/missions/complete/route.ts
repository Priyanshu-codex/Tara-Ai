import { NextRequest, NextResponse } from "next/server";
import { getMissionById, isMissionEligibleForClass, getNextMissionInClass } from "@/lib/missions/missionRegistry";
import { parseClassNumber } from "@/lib/auth";

// In-memory store for server-side persistence fallback
const completedMissionsStore = new Map<string, Set<string>>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { missionId, score, answers, timeSpentSeconds, userId = "student-1", classNumber } = body;

    if (!missionId) {
      return NextResponse.json(
        { success: false, error: "Mission ID is required." },
        { status: 400 }
      );
    }

    const mission = getMissionById(missionId);
    if (!mission) {
      return NextResponse.json(
        { success: false, error: `Mission "${missionId}" not found in registry.` },
        { status: 404 }
      );
    }

    // Class eligibility check
    const studentClass = parseClassNumber(classNumber);
    if (studentClass && !isMissionEligibleForClass(mission.id, studentClass)) {
      const [minC, maxC] = mission.classRange || [6, 8];
      return NextResponse.json(
        {
          success: false,
          error: `Mission "${mission.title}" is designed for Classes ${minC}–${maxC}. It cannot be awarded for Class ${studentClass}.`,
        },
        { status: 403 }
      );
    }

    // Server-side XP and Stars validation
    const userCompleted = completedMissionsStore.get(userId) || new Set();
    const isFirstTime = !userCompleted.has(mission.id);

    // Calculate stars: 3 stars for score >= 80%, 2 stars for >= 60%, 1 star for completion
    let calculatedStars = 3;
    if (typeof score === "number") {
      if (score >= 80) calculatedStars = 3;
      else if (score >= 60) calculatedStars = 2;
      else calculatedStars = 1;
    }

    // Calculate XP: full reward on first completion, 15 practice XP on replays to prevent exploitation
    const xpAwarded = isFirstTime ? mission.xpReward : 15;

    // Record completion
    userCompleted.add(mission.id);
    completedMissionsStore.set(userId, userCompleted);

    // Determine next mission in class sequence
    const nextMissionId = getNextMissionInClass(mission.id, studentClass);

    return NextResponse.json(
      {
        success: true,
        missionId: mission.id,
        worldId: mission.worldId,
        stars: calculatedStars,
        xpAwarded,
        isFirstCompletion: isFirstTime,
        nextMissionId,
        message: isFirstTime
          ? `Congratulations! You mastered "${mission.title}" and earned +${xpAwarded} XP!`
          : `Great replay practice! You earned +${xpAwarded} XP!`,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
