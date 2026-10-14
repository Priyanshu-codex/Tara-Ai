"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  AiraMessage,
  AiraMissionContext,
  AiraChatRequest,
  AiraChatResponse,
  AiraQuizQuestion,
} from "@/lib/aira/types";
import { loadStoredAiraState, saveAiraState, clearStoredAiraState } from "@/lib/aira/storage";
import { getStoredUser, DEMO_STUDENT } from "@/lib/auth";
import type { Student } from "@/lib/types";

interface AiraContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
  missionContext: AiraMissionContext | null;
  setMissionContext: (ctx: AiraMissionContext | null) => void;
  openAiraWithMission: (mission: AiraMissionContext) => void;
  openTaraWithMission: (mission: AiraMissionContext) => void;
  openAiraForQuiz: () => void;
  openTaraForQuiz: () => void;
  openAiraWithTopic: (topic: string) => void;
  openTaraWithTopic: (topic: string) => void;
  messages: AiraMessage[];
  isTyping: boolean;
  sendMessage: (text: string, actionType?: AiraChatRequest["actionType"]) => Promise<void>;
  submitQuizOption: (questionId: string, optionIndex: number) => Promise<void>;
  startNewChat: () => void;
  retryLastMessage: () => void;
  currentQuizState: { score: number; total: number };
}

const AiraContext = createContext<AiraContextType | undefined>(undefined);

const INITIAL_WELCOME_MESSAGE: AiraMessage = {
  id: "welcome-1",
  role: "assistant",
  content:
    "Hi there! I'm **Tara**, your AI Learning Buddy! 🌟\n\nI can help you understand how AI works, give you clues on learning missions, or challenge you with interactive quizzes!\n\nWhat would you like to explore today?",
  timestamp: new Date().toISOString(),
  quickReplies: ["Explain AI", "Help Me With This Mission", "Quiz Me"],
};

export function AiraProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>("conv-init");
  const [messages, setMessages] = useState<AiraMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [missionContext, setMissionContext] = useState<AiraMissionContext | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [lastUserText, setLastUserText] = useState<string>("");
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });

  // Load stored state on mount
  useEffect(() => {
    const stored = loadStoredAiraState();
    if (stored.messages && stored.messages.length > 0) {
      setMessages(stored.messages);
      setConversationId(stored.conversationId);
    } else {
      const newId = `conv-${Date.now()}`;
      setConversationId(newId);
      setMessages([INITIAL_WELCOME_MESSAGE]);
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (messages.length > 0) {
      saveAiraState(conversationId, messages);
    }
  }, [conversationId, messages]);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openAiraWithMission = useCallback((mission: AiraMissionContext) => {
    setMissionContext(mission);
    setIsOpen(true);

    // Add proactive contextual prompt if not already provided
    const missionMsg: AiraMessage = {
      id: `ctx-${Date.now()}`,
      role: "assistant",
      content: `🎯 **I noticed you're working on "${mission.missionTitle || "this mission"}"!**\n\nWould you like a clue to get started, or an explanation of how it works?`,
      timestamp: new Date().toISOString(),
      missionContext: mission,
      quickReplies: ["Give me a hint", "Explain the rules", "Quiz Me"],
    };
    setMessages((prev) => [...prev, missionMsg]);
  }, []);

  const openAiraForQuiz = useCallback(() => {
    setIsOpen(true);
    sendMessage("Quiz Me", "quiz");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAiraWithTopic = useCallback((topic: string) => {
    setIsOpen(true);
    sendMessage(`Explain ${topic}`, "explain");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    async (text: string, actionType?: AiraChatRequest["actionType"]) => {
      const clean = text.trim();
      if (!clean && !actionType) return;

      const userMsg: AiraMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: clean,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setLastUserText(clean);
      setIsTyping(true);

      const student = (getStoredUser() as Student) || DEMO_STUDENT;

      const payload: AiraChatRequest = {
        message: clean,
        conversationId,
        actionType,
        missionContext: missionContext || undefined,
        studentProfile: {
          id: student.id,
          name: student.name,
          age: student.age || 13,
          grade: student.class || "Class 8",
          xp: student.xp || 450,
          level: student.level || 5,
          completedMissions: student.missionsCompleted || 25,
        },
        history: messages.slice(-6).map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      };

      try {
        const res = await fetch("/api/tara/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data: AiraChatResponse = await res.json();

        if (data && data.success) {
          const assistantMsg: AiraMessage = {
            id: data.messageId || `a-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString(),
            missionContext: data.missionContext,
            quizQuestion: data.quizQuestion,
            quizEvaluation: data.quizResult,
            quickReplies: data.followUps,
          };

          if (data.missionContext) {
            setMissionContext(data.missionContext);
          }

          setMessages((prev) => [...prev, assistantMsg]);
        } else {
          const errorMsg: AiraMessage = {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              data?.error ||
              "I encountered a temporary connection glitch. Would you like to retry?",
            timestamp: new Date().toISOString(),
            isError: true,
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      } catch (err) {
        console.error("Failed to send message to Tara:", err);
        const networkErrorMsg: AiraMessage = {
          id: `net-err-${Date.now()}`,
          role: "assistant",
          content:
            "I could not connect to my learning circuits. Please check your internet connection and try again!",
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setMessages((prev) => [...prev, networkErrorMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [conversationId, messages, missionContext]
  );

  const submitQuizOption = useCallback(
    async (questionId: string, optionIndex: number) => {
      setIsTyping(true);

      const userChoiceMsg: AiraMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content: `Option ${String.fromCharCode(65 + optionIndex)}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userChoiceMsg]);

      const payload: AiraChatRequest = {
        message: `Answered Option ${optionIndex}`,
        conversationId,
        quizAnswer: {
          questionId,
          selectedOption: optionIndex,
          currentScore: quizScore.score,
          totalAnswered: quizScore.total,
        },
      };

      try {
        const res = await fetch("/api/tara/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data: AiraChatResponse = await res.json();

        if (data && data.success) {
          if (data.quizResult) {
            setQuizScore({
              score: data.quizResult.userScore,
              total: data.quizResult.totalAnswered,
            });
          }

          const evaluationMsg: AiraMessage = {
            id: data.messageId || `eval-${Date.now()}`,
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toISOString(),
            quizQuestion: data.quizQuestion,
            quizEvaluation: data.quizResult,
            quickReplies: data.followUps,
          };
          setMessages((prev) => [...prev, evaluationMsg]);
        }
      } catch (err) {
        console.error("Quiz submission error:", err);
      } finally {
        setIsTyping(false);
      }
    },
    [conversationId, quizScore]
  );

  const startNewChat = useCallback(() => {
    const newId = `conv-${Date.now()}`;
    setConversationId(newId);
    setMissionContext(null);
    setQuizScore({ score: 0, total: 0 });
    const freshWelcome: AiraMessage = {
      id: `new-${Date.now()}`,
      role: "assistant",
      content:
        "Started a brand new conversation! 🚀\n\nWhat would you like to explore? We can dive into **Explain AI**, get hints on a mission, or take an interactive quiz!",
      timestamp: new Date().toISOString(),
      quickReplies: ["Explain AI", "Help Me With This Mission", "Quiz Me"],
    };
    setMessages([freshWelcome]);
    clearStoredAiraState();
    saveAiraState(newId, [freshWelcome]);
  }, []);

  const retryLastMessage = useCallback(() => {
    if (lastUserText) {
      sendMessage(lastUserText);
    }
  }, [lastUserText, sendMessage]);

  return (
    <AiraContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleOpen,
        missionContext,
        setMissionContext,
        openAiraWithMission,
        openTaraWithMission: openAiraWithMission,
        openAiraForQuiz,
        openTaraForQuiz: openAiraForQuiz,
        openAiraWithTopic,
        openTaraWithTopic: openAiraWithTopic,
        messages,
        isTyping,
        sendMessage,
        submitQuizOption,
        startNewChat,
        retryLastMessage,
        currentQuizState: quizScore,
      }}
    >
      {children}
    </AiraContext.Provider>
  );
}

export function useAira() {
  const context = useContext(AiraContext);
  if (!context) {
    throw new Error("useAira must be used within an AiraProvider");
  }
  return context;
}

export const useTara = useAira;
export const TaraProvider = AiraProvider;
export const TaraContext = AiraContext;
