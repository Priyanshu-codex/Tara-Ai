// Tara Curriculum & Mission Context Knowledge Base
import { worlds } from "@/lib/mockData";
import type { AiraMissionContext } from "./types";

export interface MissionKnowledge {
  id: string;
  worldId: string;
  worldName: string;
  title: string;
  description: string;
  rules: string[];
  hints: {
    level1: string; // Observation prompt
    level2: string; // Pattern/rule explanation
    level3: string; // Guided solution step
  };
  sampleQuestion: string;
}

export const missionKnowledgeBase: Record<string, MissionKnowledge> = {
  "m1-2": {
    id: "m1-2",
    worldId: "world-1",
    worldName: "AI Basics",
    title: "Spot the Pattern",
    description: "Help TARA find the repeating shape and color pattern in the sequence.",
    rules: [
      "Look at each shape from left to right.",
      "Identify the group of shapes that repeats.",
      "Find which shape is missing at the end of the sequence.",
    ],
    hints: {
      level1: "Let's look carefully at the shapes. A circle, square, circle, square... Which shape do you think should come next? Look for the repeating pattern!",
      level2: "Notice the 3-shape loop: Red Circle 🔴 → Blue Square 🟦 → Green Triangle 🔺. Look at the second group: we have Red Circle then Blue Square. What always follows Blue Square?",
      level3: "The repeating unit is (Red Circle → Blue Square → Green Triangle). Since the sequence has Red Circle, Blue Square, Green Triangle, Red Circle, Blue Square... the next shape is the **Green Triangle (Option A)**!",
    },
    sampleQuestion: "How do I complete Spot the Pattern?",
  },
  "m1-1": {
    id: "m1-1",
    worldId: "world-1",
    worldName: "AI Basics",
    title: "What is AI?",
    description: "Discover what Artificial Intelligence is and how it powers smart systems.",
    rules: [
      "AI stands for Artificial Intelligence.",
      "It helps computers recognize patterns, learn from examples, and make decisions.",
      "Unlike standard code with fixed rules, AI learns from experience.",
    ],
    hints: {
      level1: "Think about how you learn to ride a bicycle — by practising and learning from balance, rather than reading a 100-page manual!",
      level2: "Computers normally only do exactly what humans type. AI is different because it studies patterns in data to figure out answers on its own.",
      level3: "Key takeaway: AI = Pattern Recognition + Learning from Examples + Problem Solving.",
    },
    sampleQuestion: "What is AI and how does it learn?",
  },
  "m1-3": {
    id: "m1-3",
    worldId: "world-1",
    worldName: "AI Basics",
    title: "Train a Mini AI",
    description: "Create and train your first computer vision classifier.",
    rules: [
      "Gather labeled images (e.g., cats vs dogs).",
      "Feed the training dataset into the model.",
      "Test accuracy on new images the model hasn't seen yet.",
    ],
    hints: {
      level1: "To teach an AI to recognise something, you need training data. More diverse pictures mean a smarter AI!",
      level2: "If you only show an AI pictures of orange cats, it might not recognize a black cat! Diverse examples make AI fair and accurate.",
      level3: "Steps to train: 1) Collect photos 2) Label them 3) Run training cycles 4) Test on new pictures.",
    },
    sampleQuestion: "How do I train a mini AI?",
  },
  "m1-4": {
    id: "m1-4",
    worldId: "world-1",
    worldName: "AI Basics",
    title: "AI in Real Life",
    description: "Identify everyday artificial intelligence around you.",
    rules: [
      "Recognize AI in search engines, voice assistants, and recommendation engines.",
      "Understand why recommendation systems suggest videos or music you might like.",
    ],
    hints: {
      level1: "Have you ever wondered how YouTube or Spotify knows what songs you like? That's an AI recommendation engine at work!",
      level2: "AI looks at what you listened to previously, compares it with millions of other listeners with similar taste, and predicts your next favorite song.",
      level3: "Everyday AI includes: Siri/Alexa, YouTube recommendations, photo facial filters, spellcheck, and GPS traffic predictions.",
    },
    sampleQuestion: "Where do we use AI in everyday life?",
  },
  "m2-1": {
    id: "m2-1",
    worldId: "world-2",
    worldName: "Machine Learning",
    title: "What is Machine Learning?",
    description: "Explore supervised, unsupervised, and reinforcement learning.",
    rules: [
      "Machine learning is a branch of AI.",
      "It focuses on using data and algorithms to imitate the way humans learn.",
    ],
    hints: {
      level1: "Machine Learning is like teaching a puppy new tricks using treats whenever it gets something right!",
      level2: "The 3 main types: Supervised (learning with a teacher/labels), Unsupervised (finding hidden groups), and Reinforcement (learning through trial and score).",
      level3: "Remember: Standard programming = Rules + Data → Answers. Machine Learning = Data + Answers → Rules!",
    },
    sampleQuestion: "What are the three types of Machine Learning?",
  },
};

export function getMissionContext(missionIdOrSlug?: string): MissionKnowledge | null {
  if (!missionIdOrSlug) return null;
  const slug = missionIdOrSlug.toLowerCase().trim();

  if (missionKnowledgeBase[slug]) return missionKnowledgeBase[slug];

  // Try matching by slug name (e.g. 'spot-the-pattern')
  for (const item of Object.values(missionKnowledgeBase)) {
    const titleSlug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (titleSlug === slug || slug.includes(titleSlug) || titleSlug.includes(slug)) {
      return item;
    }
  }

  // Try searching worlds mockData
  for (const world of worlds) {
    for (const mission of world.missions) {
      if (mission.id === slug || mission.title.toLowerCase().includes(slug)) {
        return {
          id: mission.id,
          worldId: world.id,
          worldName: world.name,
          title: mission.title,
          description: mission.description,
          rules: ["Follow the on-screen instructions to complete this mission."],
          hints: {
            level1: `Take your time to read the instructions for "${mission.title}". What is the main goal?`,
            level2: `Break the mission into two steps: check the input data first, then choose your answer.`,
            level3: `Remember what you learned in ${world.name} — apply those concepts here!`,
          },
          sampleQuestion: `How do I complete ${mission.title}?`,
        };
      }
    }
  }

  return null;
}

export function calculateStudentAge(grade?: string, profileAge?: number): number {
  if (profileAge && profileAge >= 5 && profileAge <= 20) return profileAge;
  if (!grade) return 13; // default middle school age

  const match = grade.match(/\d+/);
  if (match) {
    const classNum = parseInt(match[0], 10);
    // Class 1 = 6 yo, Class 8 = 13 yo
    return Math.max(6, Math.min(18, classNum + 5));
  }
  return 13;
}
