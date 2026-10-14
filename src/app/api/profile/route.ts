import { NextRequest, NextResponse } from "next/server";
import { parseClassNumber, formatClassName } from "@/lib/auth";
import { getCurriculumTier } from "@/lib/missions/classCurriculum";

// In-memory profile store synchronized with server runtime
const profileStore = new Map<string, any>();

// Seed default profile for student
profileStore.set("demo-student-001", {
  id: "demo-student-001",
  name: "Aarav Sharma",
  email: "demo.student@tara.edu",
  role: "student",
  classNumber: 8,
  class: "Class 8",
  age: 13,
  school: "Oakridge International School",
  xp: 450,
  level: 5,
  streak: 14,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "demo-student-001";

  const profile = profileStore.get(userId) || profileStore.get("demo-student-001");
  const classNumber = profile.classNumber || 8;
  const tier = getCurriculumTier(classNumber);

  return NextResponse.json({
    success: true,
    profile: {
      ...profile,
      classNumber,
      class: formatClassName(classNumber),
      tier,
    },
  });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = "demo-student-001", classNumber, school, name, age, bio } = body;

    const parsedClass = parseClassNumber(classNumber);
    if (classNumber !== undefined && !parsedClass) {
      return NextResponse.json(
        { success: false, error: "Class must be an integer between 1 and 12." },
        { status: 400 }
      );
    }

    const current = profileStore.get(userId) || profileStore.get("demo-student-001");
    const updated = {
      ...current,
      ...(parsedClass ? { classNumber: parsedClass, class: formatClassName(parsedClass) } : {}),
      ...(school ? { school: String(school).trim() } : {}),
      ...(name ? { name: String(name).trim() } : {}),
      ...(age ? { age: Number(age) } : {}),
      ...(bio ? { bio: String(bio).trim() } : {}),
      updatedAt: new Date().toISOString(),
    };

    profileStore.set(userId, updated);

    return NextResponse.json({
      success: true,
      profile: updated,
      tier: getCurriculumTier(updated.classNumber),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
