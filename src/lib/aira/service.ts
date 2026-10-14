// Tara Service: Pedagogical AI Engine & Provider Orchestrator
import type {
  AiraChatRequest,
  AiraChatResponse,
  AiraQuizQuestion,
  AiraQuizResult,
  AiraMissionContext,
} from "./types";
import { getMissionContext, calculateStudentAge } from "./curriculum";
import {
  getQuizQuestionForTopic,
  evaluateQuizAnswer,
} from "./quizEngine";
import { worlds } from "@/lib/mockData";

export interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory rate limiting map (per student / IP)
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 25;

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (existing.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  existing.count += 1;
  return true;
}

// Build system prompt for LLM providers (Gemini or OpenAI)
export function buildAiraSystemPrompt(
  age: number,
  grade: string,
  missionContext?: AiraMissionContext
): string {
  return `You are Tara, a friendly, supportive, curious, patient, and encouraging AI Learning Buddy for school students on the TARA AI platform.

Student Profile:
- Age: ${age} years old
- Grade: ${grade || "Middle School"}

Curriculum Context:
${
  missionContext
    ? `Active Mission: "${missionContext.missionTitle || missionContext.missionId}" (World: ${
        missionContext.worldName || "AI Learning World"
      }).
Instructions: ${missionContext.instructions || "Interactive challenge"}.`
    : "No specific mission currently active. General AI & STEM learning mode."
}

Core Rules:
1. Tone: Warm, curious, joyful, and encouraging. Never condescending or boring.
2. Language: Calibrated for a ${age}-year-old student. Use simple, crisp sentences, clear analogies (like recipes, video games, sports, animal behaviors), and relatable everyday examples.
3. Pedagogy:
   - When asked to explain a concept ("Explain AI", "What is ML?"), explain what it is, give an analogy, and end with an engaging quick follow-up question.
   - When helping with a mission, NEVER give the answer away immediately! Offer progressive hints: start with an observation hint, then guide toward the pattern rule.
   - When a student asks "Simplify this" or "I don't understand", explain in even fewer words with a step-by-step physical metaphor.
   - If asked about AI Safety, teach fairness, privacy (never sharing passwords or personal info), bias, and checking for hallucinations.
4. Safety: Never ask for personal identifying information (PII), home address, passwords, or phone numbers. If asked to do something unsafe, politely redirect to positive AI topics.
5. Emphasize that AI is a tool created by humans, can sometimes make mistakes, and students should think critically and verify information.`;
}

export const buildTaraSystemPrompt = buildAiraSystemPrompt;

// Pedagogical Rule-Based Engine (Guaranteed, zero-downtime, fully tailored fallback)
export function processWithPedagogicalEngine(request: AiraChatRequest): AiraChatResponse {
  const message = (request.message || "").trim();
  const lower = message.toLowerCase();
  const studentAge = calculateStudentAge(
    request.studentProfile?.grade,
    request.studentProfile?.age
  );
  const conversationId = request.conversationId || `conv-${Date.now()}`;
  const responseId = `msg-${Date.now()}`;

  // 1. Check for Quiz Submission first
  if (request.quizAnswer) {
    const { questionId, selectedOption, currentScore, totalAnswered } =
      request.quizAnswer;
    const result: AiraQuizResult = evaluateQuizAnswer(
      questionId,
      selectedOption,
      currentScore,
      totalAnswered
    );

    let reply = "";
    if (result.isCorrect) {
      reply = `🎉 **Spot on! That's correct!**\n\n${result.explanation}\n\n`;
    } else {
      reply = `✨ **Nice try! You're very close!**\n\n${result.explanation}\n\n`;
    }

    if (result.isCompleted) {
      reply += `🏆 **Quiz Complete!** You scored **${result.userScore}/${result.totalAnswered}**! You earned +${
        result.userScore * 20
      } XP on TARA! Would you like another challenge or help with a mission?`;
      return {
        success: true,
        messageId: responseId,
        conversationId,
        reply,
        provider: "pedagogical_engine",
        quizResult: result,
        followUps: [
          "Explain AI",
          "Help Me With This Mission",
          "What Should I Learn Next?",
        ],
      };
    } else {
      // Pick next question
      const nextQ = getQuizQuestionForTopic(undefined, [questionId]);
      reply += `Ready for the next question? Let's keep the streak going! 🚀`;
      return {
        success: true,
        messageId: responseId,
        conversationId,
        reply,
        provider: "pedagogical_engine",
        quizQuestion: nextQ,
        quizResult: result,
        followUps: ["Need a Hint", "Simplify This", "Skip Question"],
      };
    }
  }

  // 2. Action: Quiz Me
  if (
    request.actionType === "quiz" ||
    lower.includes("quiz me") ||
    lower === "quiz" ||
    lower.includes("test my knowledge") ||
    lower.includes("practice questions")
  ) {
    const question = getQuizQuestionForTopic(request.missionContext?.worldName);
    return {
      success: true,
      messageId: responseId,
      conversationId,
      reply: `Let's do a quick knowledge check! Here's your question on **${question.topic}**:`,
      provider: "pedagogical_engine",
      quizQuestion: question,
      followUps: ["Need a Hint", "Explain AI", "Help Me With This Mission"],
    };
  }

  // 3. Action: Help Me With This Mission / Mission Hints
  const isMissionQuery =
    request.actionType === "mission_hint" ||
    lower.includes("help me with this mission") ||
    lower.includes("mission") ||
    lower.includes("spot the pattern") ||
    lower.includes("hint") ||
    lower.includes("stuck");

  if (isMissionQuery) {
    const currentMissionId =
      request.missionContext?.missionId ||
      (lower.includes("spot the pattern") ? "m1-2" : undefined);
    const mission = getMissionContext(currentMissionId);

    if (mission) {
      const hintLevel = request.missionContext?.hintLevel || 1;
      let hintText = "";
      let nextLevel = hintLevel;

      if (hintLevel === 1) {
        hintText = `🎯 **Mission Hint for "${mission.title}":**\n\n${mission.hints.level1}\n\nCan you see what comes next, or would you like a deeper clue?`;
        nextLevel = 2;
      } else if (hintLevel === 2) {
        hintText = `🔍 **Clue Level 2 for "${mission.title}":**\n\n${mission.hints.level2}\n\nWhat do you think the next piece should be?`;
        nextLevel = 3;
      } else {
        hintText = `💡 **Guided Solution for "${mission.title}":**\n\n${mission.hints.level3}\n\nTry selecting that option in your mission view! You've got this!`;
        nextLevel = 3;
      }

      return {
        success: true,
        messageId: responseId,
        conversationId,
        reply: hintText,
        provider: "pedagogical_engine",
        missionContext: {
          ...request.missionContext,
          missionId: mission.id,
          missionTitle: mission.title,
          worldId: mission.worldId,
          worldName: mission.worldName,
          hintLevel: nextLevel,
        },
        followUps:
          nextLevel < 3
            ? ["Give me another hint", "Explain the concept", "Quiz Me"]
            : ["Quiz Me", "What Should I Learn Next?", "Explain AI"],
      };
    } else {
      return {
        success: true,
        messageId: responseId,
        conversationId,
        reply: `I'd love to help you with your mission! Which mission are you playing right now? You can try **Spot the Pattern** in World 1, or tell me the topic you are working on!`,
        provider: "pedagogical_engine",
        followUps: [
          "Help with Spot the Pattern",
          "Explain AI",
          "Quiz Me",
        ],
      };
    }
  }

  // 4. Action: Explain AI
  if (
    request.actionType === "explain" ||
    lower.includes("explain ai") ||
    lower === "what is ai" ||
    lower.includes("what is artificial intelligence") ||
    lower.includes("what is ai?")
  ) {
    let reply = "";
    if (studentAge <= 9) {
      reply = `🤖 **What is AI?**\n\nAI (Artificial Intelligence) is like giving a computer a super-curious brain!\n\nNormal computers only follow strict rules you type. But AI learns by looking at examples — just like how you learn what a dog is by seeing real puppies!\n\n💡 **Quick Example:** If you show an AI 1,000 photos of cats, it learns the pointy ears, whiskers, and furry faces, so it can spot cats in new pictures all by itself!\n\nWhat would you like to build with AI one day? A robot helper or a game?`;
    } else {
      reply = `🤖 **What is AI?**\n\nAI is technology that helps computers recognise patterns, learn from experience, and solve problems.\n\nImagine teaching a computer to recognise cats. Instead of writing millions of rules describing whiskers and fur, you show it many pictures of cats. The computer learns patterns that help it recognise new pictures automatically!\n\n**Three Key Ingredients:**\n1. 📊 **Data:** The examples the computer learns from.\n2. 🧠 **Model / Algorithm:** The math that finds the patterns.\n3. 🎯 **Decision:** Applying the pattern to make predictions.\n\nWould you like an example of how Netflix or YouTube uses this every day?`;
    }

    return {
      success: true,
      messageId: responseId,
      conversationId,
      reply,
      provider: "pedagogical_engine",
      followUps: [
        "How does machine learning work?",
        "Simplify this for me",
        "Help Me With This Mission",
        "Quiz Me",
      ],
    };
  }

  // 5. Action: Simplify This
  if (
    request.actionType === "simplify" ||
    lower.includes("simplify this") ||
    lower.includes("explain simpler") ||
    lower.includes("too hard") ||
    lower.includes("i don't understand")
  ) {
    return {
      success: true,
      messageId: responseId,
      conversationId,
      reply: `Let's make it super simple! 🎈\n\nThink of AI like a **smart sorting box**:\n1. You put in lots of toys to teach it (training data).\n2. It notices shapes and colors (patterns).\n3. When you drop in a new mystery toy, it guesses where it belongs!\n\nThat's all it is: **learning patterns from examples!**\n\nDoes that make sense, or would you like another fun example?`,
      provider: "pedagogical_engine",
      followUps: [
        "Give another example",
        "Explain AI",
        "Help Me With This Mission",
        "Quiz Me",
      ],
    };
  }

  // 6. Action: AI Safety Coach
  if (
    request.actionType === "safety" ||
    lower.includes("safety") ||
    lower.includes("ethics") ||
    lower.includes("bias") ||
    lower.includes("hallucination") ||
    lower.includes("privacy")
  ) {
    return {
      success: true,
      messageId: responseId,
      conversationId,
      reply: `🛡️ **Tara's AI Safety Guide:**\n\nAs young AI explorers, remembering these 4 Golden Rules keeps everyone safe:\n\n1. 🔒 **Protect Your Privacy:** Never give an AI chatbot your home address, full name, passwords, or school location.\n2. 🔍 **Verify Facts:** AI is smart, but it can hallucinate (make confident-sounding mistakes). Always double-check important homework with trusted books and teachers.\n3. ⚖️ **Watch for Bias:** AI learns from data created by humans. If the data is unfair, the AI can make biased choices.\n4. 🤝 **Use AI for Good:** Use AI to create, learn, and solve problems, never to deceive or bully others.\n\nWould you like a quiz on AI safety?`,
      provider: "pedagogical_engine",
      followUps: ["Quiz Me on AI Safety", "Explain AI", "Project Ideas"],
    };
  }

  // 7. Action: Project Ideas
  if (
    request.actionType === "projects" ||
    lower.includes("project idea") ||
    lower.includes("build") ||
    lower.includes("make a project")
  ) {
    return {
      success: true,
      messageId: responseId,
      conversationId,
      reply: `🚀 **Fun AI Projects for School Students:**\n\n1. 🐾 **Pet Mood Detector (Computer Vision):**\n   - **Goal:** Train a model on Teachable Machine or TARA AI Lab to tell if a dog or cat looks happy or sleepy.\n   - **Tools:** Webcam, Teachable Machine, TARA AI Lab.\n\n2. ♻️ **Smart Recycling Sorter:**\n   - **Goal:** Detect plastic bottles vs paper vs aluminum cans.\n   - **Tools:** Image classifier model and cardboard prototype bins.\n\n3. 📚 **Story-Bot Companion:**\n   - **Goal:** Build a prompt-based writing helper that creates custom sci-fi adventures.\n\nWhich project sounds exciting to try?`,
      provider: "pedagogical_engine",
      followUps: [
        "Tell me more about Pet Mood Detector",
        "Explain Machine Learning",
        "Quiz Me",
      ],
    };
  }

  // 8. Action: What Should I Learn Next?
  if (
    request.actionType === "next_step" ||
    lower.includes("what should i learn next") ||
    lower.includes("next mission") ||
    lower.includes("recommend")
  ) {
    return {
      success: true,
      messageId: responseId,
      conversationId,
      reply: `🌟 **Your Next Recommended Step:**\n\nBased on your progress in **World 1 (AI Basics)**:\n- You've mastered **Spot the Pattern** and learned about algorithms!\n- Your next challenge: **Train a Mini AI (Mission 3)** to see how training data shapes model accuracy!\n- Or dive into **AI Myths vs Facts** to bust common sci-fi misconceptions!\n\nWould you like to start **Train a Mini AI** now, or test your skills with a quiz?`,
      provider: "pedagogical_engine",
      followUps: [
        "Help with Train a Mini AI",
        "Quiz Me",
        "Explain AI",
      ],
    };
  }

  // 9. Safety Check for Sensitive queries
  if (
    lower.includes("password") ||
    lower.includes("hack") ||
    lower.includes("credit card") ||
    lower.includes("address") ||
    lower.includes("where do i live")
  ) {
    return {
      success: true,
      messageId: responseId,
      conversationId,
      reply: `🛡️ As your AI Learning Buddy, I never ask for or store private credentials like passwords, banking details, or home addresses! Let's focus on fun learning adventures — what AI concept would you like to explore?`,
      provider: "pedagogical_engine",
      followUps: ["Explain AI", "Quiz Me", "Help Me With This Mission"],
    };
  }

  // 10. General Conversational Fallback with Educational Prompt
  return {
    success: true,
    messageId: responseId,
    conversationId,
    reply: `Hi! I'm **Tara**, your AI Learning Buddy! 🌟\n\nI can help you understand AI, guide you through missions like **Spot the Pattern**, test your skills with mini-quizzes, or brainstorm AI project ideas.\n\nWhat would you like to explore right now?`,
    provider: "pedagogical_engine",
    followUps: [
      "Explain AI",
      "Help Me With This Mission",
      "Quiz Me",
      "AI Safety Coach",
    ],
  };
}

// Orchestrator that tries Gemini / OpenAI if keys are present, else uses pedagogical engine
export async function generateAiraResponse(
  request: AiraChatRequest
): Promise<AiraChatResponse> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // If action is specific quiz submission or hint progression, pedagogical engine is deterministic and verified
  if (request.quizAnswer || request.actionType === "quiz") {
    return processWithPedagogicalEngine(request);
  }

  const studentAge = calculateStudentAge(
    request.studentProfile?.grade,
    request.studentProfile?.age
  );
  const systemPrompt = buildAiraSystemPrompt(
    studentAge,
    request.studentProfile?.grade || "Class 8",
    request.missionContext
  );

  // 1. Try Gemini if configured
  if (geminiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: `${systemPrompt}\n\nStudent Message: ${request.message}` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          return {
            success: true,
            messageId: `msg-${Date.now()}`,
            conversationId: request.conversationId || `conv-${Date.now()}`,
            reply: candidate,
            provider: "gemini",
            followUps: [
              "Explain AI",
              "Help Me With This Mission",
              "Quiz Me",
            ],
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to pedagogical engine:", err);
    }
  }

  // 2. Try OpenAI if configured
  if (openaiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...(request.history || []).map((h) => ({
              role: h.role,
              content: h.content,
            })),
            { role: "user", content: request.message },
          ],
          max_tokens: 450,
          temperature: 0.7,
        }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return {
            success: true,
            messageId: `msg-${Date.now()}`,
            conversationId: request.conversationId || `conv-${Date.now()}`,
            reply: text,
            provider: "openai",
            followUps: [
              "Explain AI",
              "Help Me With This Mission",
              "Quiz Me",
            ],
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to pedagogical engine:", err);
    }
  }

  // 3. Guaranteed Pedagogical Engine
  return processWithPedagogicalEngine(request);
}

export const generateTaraResponse = generateAiraResponse;
