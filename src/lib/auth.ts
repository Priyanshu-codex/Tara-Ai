// TARA Authentication & Session Management
import type { Student, User } from "./types";
import { mockStudent } from "./mockData";

export const DEMO_STUDENT: Student = {
  ...mockStudent,
  id: "demo-student-001",
  name: "Aarav Sharma",
  email: "demo.student@tara.edu",
  role: "student",
  isDemo: true,
  class: "Class 8",
  classNumber: 8,
  age: 13,
  school: "Oakridge International School",
  avatar: "👦",
  xp: 450,
  level: 5,
  levelName: "AI Explorer",
  streak: 14,
  missionsCompleted: 28,
  globalRank: 12,
  weeklyGoal: 5,
  weeklyProgress: 4,
};

export const AUTH_STORAGE_KEY = "tara_user";
export const DEMO_FLAG_KEY = "tara_is_demo";

export function parseClassNumber(input: string | number | undefined | null): number | null {
  if (input === undefined || input === null) return null;
  if (typeof input === "number") {
    return input >= 1 && input <= 12 ? Math.floor(input) : null;
  }
  const str = String(input).trim();
  const match = str.match(/\d+/);
  if (match) {
    const val = parseInt(match[0], 10);
    return val >= 1 && val <= 12 ? val : null;
  }
  return null;
}

export function formatClassName(classNum: number | string | null | undefined): string {
  const parsed = parseClassNumber(classNum);
  if (!parsed) return "Class Selection Pending";
  return `Class ${parsed}`;
}

export function getStudentClassNumber(user: Student | User | null): number | null {
  if (!user) return null;
  if (typeof user.classNumber === "number" && user.classNumber >= 1 && user.classNumber <= 12) {
    return user.classNumber;
  }
  return parseClassNumber(user.class);
}

export function getStoredUser(): Student | User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const classNum = getStudentClassNumber(parsed);
    const enriched = {
      ...parsed,
      classNumber: classNum ?? undefined,
      class: classNum ? `Class ${classNum}` : parsed.class,
    };
    if (parsed.isDemo) {
      return { ...DEMO_STUDENT, ...enriched };
    }
    return enriched;
  } catch {
    return null;
  }
}

export function isDemoSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const isDemoFlag = localStorage.getItem(DEMO_FLAG_KEY) === "true";
    const user = getStoredUser();
    return isDemoFlag || Boolean(user?.isDemo);
  } catch {
    return false;
  }
}

export function loginAsDemo(): Student {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_STUDENT));
    localStorage.setItem(DEMO_FLAG_KEY, "true");
    window.dispatchEvent(new Event("tara-auth-change"));
    window.dispatchEvent(new Event("tara-class-change"));
  }
  return DEMO_STUDENT;
}

export function loginUser(user: Partial<User>): User {
  const classNum = parseClassNumber(user.classNumber ?? user.class) ?? 8;
  const fullUser: User = {
    id: user.id || `user-${Date.now()}`,
    name: user.name || "Student",
    email: user.email || "user@school.edu",
    role: user.role || "student",
    isDemo: false,
    classNumber: classNum,
    class: `Class ${classNum}`,
    school: user.school || "School",
    age: user.age || (classNum ? classNum + 5 : 13),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullUser));
    localStorage.removeItem(DEMO_FLAG_KEY);
    window.dispatchEvent(new Event("tara-auth-change"));
    window.dispatchEvent(new Event("tara-class-change"));
  }
  return fullUser;
}

export function updateUserClass(newClassNumber: number): User | null {
  const valid = parseClassNumber(newClassNumber);
  if (!valid || typeof window === "undefined") return null;

  try {
    const current = getStoredUser();
    if (!current) return null;

    const updated: User = {
      ...current,
      classNumber: valid,
      class: `Class ${valid}`,
      age: valid + 5, // Approximate age
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("tara-auth-change"));
    window.dispatchEvent(new Event("tara-class-change"));
    window.dispatchEvent(new Event("tara-progress-change"));
    return updated;
  } catch (err) {
    console.error("Failed to update user class:", err);
    return null;
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(DEMO_FLAG_KEY);
    window.dispatchEvent(new Event("tara-auth-change"));
    window.dispatchEvent(new Event("tara-class-change"));
  }
}
