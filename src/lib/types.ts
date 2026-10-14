// TARA Platform – Type Definitions

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  class?: string;
  school?: string;
  age?: number;
  isDemo?: boolean;
}

export interface Student extends User {
  role: "student";
  xp: number;
  level: number;
  levelName: string;
  streak: number;
  missionsCompleted: number;
  badges: Badge[];
  worldProgress: WorldProgress[];
  weeklyGoal: number;
  weeklyProgress: number;
  globalRank?: number;
}

export interface Administrator extends User {
  role: "admin";
  permissions: string[];
}

export interface World {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  totalMissions: number;
  completedMissions: number;
  isLocked: boolean;
  missions: Mission[];
  image?: string;
  theme: "ai" | "ml" | "cv" | "nlp" | "rai";
}

export interface WorldProgress {
  worldId: string;
  completed: number;
  total: number;
}

export interface Mission {
  id: string;
  worldId: string;
  title: string;
  description: string;
  type: "pattern" | "quiz" | "video" | "experiment" | "challenge";
  stars: number;
  xpReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  xpEarned: number;
  earnedAt?: string;
  category: "learning" | "streak" | "achievement" | "special";
}

export interface StudentProgress {
  id: string;
  name: string;
  level: number;
  xp: number;
  completion: number;
  avatar: string;
}

export interface LearningActivity {
  id: string;
  type: "lesson" | "quiz" | "game" | "experiment";
  title: string;
  subject: string;
  duration: number; // minutes
  xp: number;
  icon: string;
  color: string;
  isRecommended?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  xp: number;
  date: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Challenge {
  id: string;
  title: string;
  category: "environment" | "health" | "education" | "space" | "daily";
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  participants: number;
  deadline?: string;
  isCompleted?: boolean;
  icon: string;
  color: string;
  bgColor: string;
}

export interface WeeklyData {
  day: string;
  xp: number;
  minutes: number;
}

export interface SubjectPerformance {
  subject: string;
  score: number;
  color: string;
}


