// Aira Interactive In-Chat Quiz Engine
import type { AiraQuizQuestion, AiraQuizResult } from "./types";

export const airaQuizBank: AiraQuizQuestion[] = [
  {
    id: "q-ai-definition",
    topic: "AI Basics",
    question: "What is Artificial Intelligence (AI)?",
    options: [
      "A physical robot made of metal only",
      "Technology that helps computers learn from patterns and solve problems",
      "A search engine that only saves websites",
      "A battery that never runs out of power",
    ],
    correctIndex: 1,
    explanation: "AI is technology that allows computer programs to recognize patterns, learn from examples, and make decisions similar to human reasoning!",
    hint: "Think about how computers learn to recognize photos or translate languages.",
  },
  {
    id: "q-training-data",
    topic: "Machine Learning",
    question: "What do we call the collection of photos or numbers used to teach an AI model?",
    options: [
      "Wi-Fi signal",
      "Training Data",
      "Computer Wallpaper",
      "Random Memory",
    ],
    correctIndex: 1,
    explanation: "Training Data is the collection of examples (like cat and dog photos) that an AI model studies to discover repeating patterns!",
    hint: "Think about what an athlete uses to train before a big championship.",
  },
  {
    id: "q-pattern-recognition",
    topic: "Pattern Recognition",
    question: "In the sequence [🔴 Circle, 🟦 Square, 🔺 Triangle, 🔴 Circle, 🟦 Square...], what comes next?",
    options: [
      "🟦 Square",
      "⭐ Star",
      "🔺 Triangle",
      "🔴 Circle",
    ],
    correctIndex: 2,
    explanation: "The pattern repeats in triplets: Circle → Square → Triangle. Following the second Square, the next shape is the Triangle!",
    hint: "Look at the 3 shapes in the first group.",
  },
  {
    id: "q-computer-vision",
    topic: "Computer Vision",
    question: "Which field of AI teaches computers to see and understand images or videos?",
    options: [
      "Computer Vision",
      "Sound Synthesis",
      "Hard Drive Recovery",
      "Screen Brightness",
    ],
    correctIndex: 0,
    explanation: "Computer Vision gives computers 'eyes' by processing pixel patterns so self-driving cars, photo tags, and medical scans work accurately!",
    hint: "The word has 'Vision' in it!",
  },
  {
    id: "q-ai-safety",
    topic: "AI Safety & Ethics",
    question: "Why should we always double-check important information that an AI chatbot gives us?",
    options: [
      "Because AI computers get tired in the evening",
      "Because AI models can make mistakes or hallucinate incorrect facts",
      "Because AI never speaks English",
      "Because AI only works for video games",
    ],
    correctIndex: 1,
    explanation: "AI models generate responses based on probabilities and can sometimes produce 'hallucinations' (convincing-sounding mistakes). Responsible AI users always verify key facts!",
    hint: "Remember: AI is powerful, but not magical or infallible.",
  },
  {
    id: "q-recommendation",
    topic: "Everyday AI",
    question: "How does a video app or music streaming platform know what to recommend next?",
    options: [
      "A human teacher watches you 24/7",
      "It uses recommendation algorithms that analyze what you and similar users enjoyed",
      "It flips a coin completely randomly",
      "It only shows videos from today",
    ],
    correctIndex: 1,
    explanation: "Recommendation algorithms detect patterns in your watch history and match your tastes with similar viewers worldwide!",
    hint: "It looks at your previous favorites and finds patterns.",
  },
];

export function getQuizQuestionForTopic(topic?: string, excludeIds: string[] = []): AiraQuizQuestion {
  const available = airaQuizBank.filter((q) => !excludeIds.includes(q.id));
  if (topic) {
    const topicMatches = available.filter((q) =>
      q.topic.toLowerCase().includes(topic.toLowerCase())
    );
    if (topicMatches.length > 0) {
      return topicMatches[Math.floor(Math.random() * topicMatches.length)];
    }
  }

  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Fallback to any random question if all have been shown
  return airaQuizBank[Math.floor(Math.random() * airaQuizBank.length)];
}

export function evaluateQuizAnswer(
  questionId: string,
  selectedIndex: number,
  currentScore: number = 0,
  totalAnswered: number = 0
): AiraQuizResult {
  const question = airaQuizBank.find((q) => q.id === questionId);

  if (!question) {
    return {
      isCorrect: false,
      correctIndex: 0,
      explanation: "Question not found in the verified question registry.",
      userScore: currentScore,
      totalAnswered: totalAnswered + 1,
      isCompleted: totalAnswered + 1 >= 3,
      xpAwarded: 0,
    };
  }

  const isCorrect = selectedIndex === question.correctIndex;
  const newScore = isCorrect ? currentScore + 1 : currentScore;
  const newTotal = totalAnswered + 1;
  const isCompleted = newTotal >= 3;
  const xpAwarded = isCorrect ? 25 : 5;

  return {
    isCorrect,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    userScore: newScore,
    totalAnswered: newTotal,
    isCompleted,
    xpAwarded,
  };
}
