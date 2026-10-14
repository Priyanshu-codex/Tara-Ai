import { NextRequest, NextResponse } from "next/server";
import { parseClassNumber, formatClassName } from "@/lib/auth";
import { getCurriculumTier } from "@/lib/missions/classCurriculum";
import { getWorldsForClass, getMissionsForClass } from "@/lib/missions/missionRegistry";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classParam = searchParams.get("class");
  const parsedClass = parseClassNumber(classParam) ?? 8;

  const tier = getCurriculumTier(parsedClass);
  const worlds = getWorldsForClass(parsedClass);
  const missions = getMissionsForClass(parsedClass);

  return NextResponse.json({
    success: true,
    classNumber: parsedClass,
    className: formatClassName(parsedClass),
    tier,
    worlds,
    totalMissions: missions.length,
    missions: missions.map((m) => ({
      id: m.id,
      worldId: m.worldId,
      order: m.order,
      title: m.title,
      type: m.type,
      xpReward: m.xpReward,
      difficulty: m.difficulty,
      classRange: m.classRange,
      tierId: m.tierId,
    })),
  });
}
