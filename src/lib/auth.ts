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

export function getStoredUser(): Student | User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.isDemo) {
      return { ...DEMO_STUDENT, ...parsed };
    }
    return parsed;
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
  }
  return DEMO_STUDENT;
}

export function loginUser(user: Partial<User>): User {
  const fullUser: User = {
    id: user.id || `user-${Date.now()}`,
    name: user.name || "Student",
    email: user.email || "user@school.edu",
    role: user.role || "student",
    isDemo: false,
    class: user.class || "Class 8",
    school: user.school || "School",
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullUser));
    localStorage.removeItem(DEMO_FLAG_KEY);
    window.dispatchEvent(new Event("tara-auth-change"));
  }
  return fullUser;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(DEMO_FLAG_KEY);
    window.dispatchEvent(new Event("tara-auth-change"));
  }
}
