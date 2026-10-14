import { NextRequest, NextResponse } from "next/server";
import { worlds } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "student-1";

  // Standard initialized completed missions
  const completedMissions = [
    "m1-1", "m1-2", "m1-3", "m1-4",
    "m2-1", "m2-2", "m2-3",
    "m3-1", "m3-2"
  ];

  return NextResponse.json({
    success: true,
    userId,
    completedMissions,
    worlds: worlds.map((w) => ({
      id: w.id,
      name: w.name,
      totalMissions: w.totalMissions,
      completedMissions: w.completedMissions,
      isLocked: w.isLocked,
    })),
  });
}
