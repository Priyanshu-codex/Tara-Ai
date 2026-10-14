"use client";

import { worlds, mockStudent } from "@/lib/mockData";
import { getStoredUser } from "@/lib/auth";
import type { Student } from "@/lib/types";

const STORAGE_KEY_COMPLETED_MISSIONS = "tara_completed_missions";
const STORAGE_KEY_MISSION_STARS = "tara_mission_stars";
const STORAGE_KEY_COMPLETED_CHALLENGES = "tara_completed_challenges";
const STORAGE_KEY_TOTAL_XP = "tara_student_xp";

export interface MissionRecord {
  missionId: string;
  worldId: string;
  stars: number;
  score: number;
  xpEarned: number;
  completedAt: string;
}

export function getCompletedMissions(): string[] {
  if (typeof window === "undefined") return ["m1-1", "m1-2", "m1-3", "m1-4", "m2-1", "m2-2", "m2-3", "m3-1", "m3-2"];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_MISSIONS);
    if (!raw) {
      // Default completed missions matching mockStudent profile
      const defaults = ["m1-1", "m1-2", "m1-3", "m1-4", "m2-1", "m2-2", "m2-3", "m3-1", "m3-2"];
      localStorage.setItem(STORAGE_KEY_COMPLETED_MISSIONS, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return ["m1-1", "m1-2"];
  }
}

export function getMissionStarsMap(): Record<string, number> {
  if (typeof window === "undefined") return { "m1-1": 3, "m1-2": 3, "m1-3": 2, "m1-4": 3, "m2-1": 3, "m2-2": 3, "m2-3": 2, "m3-1": 3, "m3-2": 3 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MISSION_STARS);
    if (!raw) {
      const defaults = { "m1-1": 3, "m1-2": 3, "m1-3": 2, "m1-4": 3, "m2-1": 3, "m2-2": 3, "m2-3": 2, "m3-1": 3, "m3-2": 3 };
      localStorage.setItem(STORAGE_KEY_MISSION_STARS, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function isMissionCompleted(missionId: string): boolean {
  const completed = getCompletedMissions();
  return completed.includes(missionId);
}

export function getMissionStars(missionId: string): number {
  const starsMap = getMissionStarsMap();
  return starsMap[missionId] || (isMissionCompleted(missionId) ? 3 : 0);
}

export function getCompletedChallenges(): string[] {
  if (typeof window === "undefined") return ["c-1", "c-3"];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_CHALLENGES);
    if (!raw) {
      const defaults = ["c-1", "c-3"];
      localStorage.setItem(STORAGE_KEY_COMPLETED_CHALLENGES, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isChallengeCompleted(challengeId: string): boolean {
  return getCompletedChallenges().includes(challengeId);
}

export function isMissionUnlocked(worldId: string, missionId: string, missionOrder: number): boolean {
  // First mission of world 1, 2, 3 is always unlocked
  if (missionOrder === 1 && (worldId === "world-1" || worldId === "world-2" || worldId === "world-3")) {
    return true;
  }

  // If already completed, it's always accessible for replay
  if (isMissionCompleted(missionId)) return true;

  // Check if previous mission in the same world was completed
  const world = worlds.find((w) => w.id === worldId);
  if (!world) return true;

  const prevMission = world.missions.find((m) => m.order === missionOrder - 1);
  if (!prevMission) return true;

  return isMissionCompleted(prevMission.id);
}

export function recordMissionCompletion(
  missionId: string,
  worldId: string,
  stars: number,
  xpAwarded: number
) {
  if (typeof window === "undefined") return;

  try {
    // 1. Update completed missions list
    const currentCompleted = getCompletedMissions();
    if (!currentCompleted.includes(missionId)) {
      currentCompleted.push(missionId);
      localStorage.setItem(STORAGE_KEY_COMPLETED_MISSIONS, JSON.stringify(currentCompleted));
    }

    // 2. Update stars
    const currentStars = getMissionStarsMap();
    currentStars[missionId] = Math.max(currentStars[missionId] || 0, stars);
    localStorage.setItem(STORAGE_KEY_MISSION_STARS, JSON.stringify(currentStars));

    // 3. Update student user XP
    const user = getStoredUser() as Student | null;
    if (user) {
      const currentXp = user.xp || 450;
      const updatedXp = currentXp + xpAwarded;
      const updatedMissions = Math.max(user.missionsCompleted || 0, currentCompleted.length);
      const updatedLevel = Math.floor(updatedXp / 100) + 1;

      const updatedUser = {
        ...user,
        xp: updatedXp,
        level: updatedLevel,
        missionsCompleted: updatedMissions,
      };

      localStorage.setItem("tara_user", JSON.stringify(updatedUser));
    }

    // 4. Dispatch reactive event across window
    window.dispatchEvent(new Event("tara-auth-change"));
    window.dispatchEvent(new Event("tara-progress-change"));
  } catch (err) {
    console.error("Failed to record mission completion:", err);
  }
}

export function recordChallengeCompletion(challengeId: string, xpReward: number) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_CHALLENGES);
    const completedChallenges: string[] = raw ? JSON.parse(raw) : [];

    if (!completedChallenges.includes(challengeId)) {
      completedChallenges.push(challengeId);
      localStorage.setItem(STORAGE_KEY_COMPLETED_CHALLENGES, JSON.stringify(completedChallenges));

      // Add XP to user
      const user = getStoredUser() as Student | null;
      if (user) {
        const updatedUser = {
          ...user,
          xp: (user.xp || 450) + xpReward,
        };
        localStorage.setItem("tara_user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("tara-auth-change"));
        window.dispatchEvent(new Event("tara-progress-change"));
      }
    }
  } catch (err) {
    console.error("Failed to record challenge completion:", err);
  }
}
