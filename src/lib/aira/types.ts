// Aira — Your AI Learning Buddy: Type Definitions

export type AiraRole = "user" | "assistant" | "system";

export interface AiraMissionContext {
  worldId?: string;
  worldName?: string;
  missionId?: string;
  missionTitle?: string;
  missionType?: "pattern" | "quiz" | "video" | "experiment" | "challenge" | string;
  instructions?: string;
  hintLevel?: number; // 1, 2, or 3
  rules?: string[];
  currentChallenge?: string;
}

export interface AiraQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  hint?: string;
}

export interface AiraQuizSubmission {
  questionId: string;
  selectedOption: number;
  user_id?: string;
  conversationId?: string;
  topic?: string;
}

export interface AiraQuizResult {
  isCorrect: boolean;
  correctIndex: number;
  explanation: string;
  userScore: number;
  totalAnswered: number;
  isCompleted: boolean;
  xpAwarded?: number;
}

export interface AiraMessage {
  id: string;
  role: AiraRole;
  content: string;
  timestamp: string | Date;
  missionContext?: AiraMissionContext;
  quizQuestion?: AiraQuizQuestion;
  quizEvaluation?: AiraQuizResult;
  selectedQuizOption?: number;
  isTyping?: boolean;
  isError?: boolean;
  quickReplies?: string[];
}

export interface AiraConversation {
  id: string;
  userId: string;
  title: string;
  messages: AiraMessage[];
  createdAt: string;
  updatedAt: string;
  currentMission?: AiraMissionContext;
}

export interface AiraChatRequest {
  message: string;
  conversationId?: string;
  actionType?:
    | "explain"
    | "mission_hint"
    | "quiz"
    | "simplify"
    | "misconception"
    | "next_step"
    | "safety"
    | "projects"
    | "general";
  studentProfile?: {
    id?: string;
    name?: string;
    age?: number;
    grade?: string;
    xp?: number;
    level?: number;
    completedMissions?: number;
  };
  missionContext?: AiraMissionContext;
  quizAnswer?: {
    questionId: string;
    selectedOption: number;
    currentScore: number;
    totalAnswered: number;
  };
  history?: {
    role: "user" | "assistant";
    content: string;
  }[];
}

export interface AiraChatResponse {
  success: boolean;
  messageId: string;
  conversationId: string;
  reply: string;
  provider: "gemini" | "openai" | "pedagogical_engine";
  missionContext?: AiraMissionContext;
  quizQuestion?: AiraQuizQuestion;
  quizResult?: AiraQuizResult;
  followUps?: string[];
  error?: string;
}
