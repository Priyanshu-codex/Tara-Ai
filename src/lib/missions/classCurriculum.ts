// ==============================================================================
// TARA AI — Class-Wise Adaptive Curriculum & Tier Definitions
// Supports Classes 1 to 12 with dedicated, progressive pedagogical content.
// ==============================================================================

import type { CurriculumTierInfo, CurriculumTierId, World, Mission } from "@/lib/types";
import type { MissionData } from "./missionRegistry";

export const AVAILABLE_CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type ValidClassNumber = typeof AVAILABLE_CLASSES[number];

export const CURRICULUM_TIERS: Record<CurriculumTierId, CurriculumTierInfo> = {
  "tier-1-3": {
    id: "tier-1-3",
    name: "Foundation Tier",
    title: "Foundation Tier",
    minClass: 1,
    maxClass: 3,
    classes: [1, 2, 3],
    classRangeLabel: "Classes 1–3",
    gradeRange: "Classes 1–3",
    ageRangeLabel: "Ages 6–8",
    description: "Basic patterns, smart toys, simple instructions, and everyday examples of AI helpers.",
    icon: "🌱",
    color: "#10B981",
    focusTopics: [
      "Repeating Patterns",
      "Smart Helpers in Homes",
      "Object Sorting Machines",
      "Friendly AI Rules",
    ],
  },
  "tier-4-5": {
    id: "tier-4-5",
    name: "Explorers Tier",
    title: "Explorers Tier",
    minClass: 4,
    maxClass: 5,
    classes: [4, 5],
    classRangeLabel: "Classes 4–5",
    gradeRange: "Classes 4–5",
    ageRangeLabel: "Ages 9–10",
    description: "Algorithms, loops, classification, data patterns, and introductory AI concepts.",
    icon: "🧭",
    color: "#3B82F6",
    focusTopics: [
      "Step-by-Step Algorithms",
      "Sequence Loops",
      "Data Classification",
      "Smart Sorting Rules",
    ],
  },
  "tier-6-8": {
    id: "tier-6-8",
    name: "Innovators Tier",
    title: "Innovators Tier",
    minClass: 6,
    maxClass: 8,
    classes: [6, 7, 8],
    classRangeLabel: "Classes 6–8",
    gradeRange: "Classes 6–8",
    ageRangeLabel: "Ages 11–13",
    description: "Training data, machine learning basics, computer vision, natural language, and AI safety.",
    icon: "🚀",
    color: "#6941F5",
    focusTopics: [
      "Machine Learning Loops",
      "Training Data & Labels",
      "Computer Vision & Pixels",
      "Responsible AI & Safety",
    ],
  },
  "tier-9-10": {
    id: "tier-9-10",
    name: "Builders Tier",
    title: "Builders Tier",
    minClass: 9,
    maxClass: 10,
    classes: [9, 10],
    classRangeLabel: "Classes 9–10",
    gradeRange: "Classes 9–10",
    ageRangeLabel: "Ages 14–15",
    description: "Supervised vs unsupervised learning, prediction, bias, evaluation, and decision trees.",
    icon: "⚡",
    color: "#F59E0B",
    focusTopics: [
      "Supervised Learning",
      "Decision Trees & Thresholds",
      "Confusion Matrix & Precision",
      "Algorithmic Bias & Fairness",
    ],
  },
  "tier-11-12": {
    id: "tier-11-12",
    name: "Masters Tier",
    title: "Masters Tier",
    minClass: 11,
    maxClass: 12,
    classes: [11, 12],
    classRangeLabel: "Classes 11–12",
    gradeRange: "Classes 11–12",
    ageRangeLabel: "Ages 16–18",
    description: "Deep learning, neural networks, backpropagation, transformers & LLMs, and AI governance.",
    icon: "🔬",
    color: "#EC4899",
    focusTopics: [
      "Neural Networks & Gradient Descent",
      "Hyperparameters & Overfitting",
      "Transformers & Attention Mechanisms",
      "AI Governance & Enterprise Ethics",
    ],
  },
};

export const CURRICULUM_TIERS_LIST = Object.values(CURRICULUM_TIERS);

export function getCurriculumTier(classNumber: number | null | undefined): CurriculumTierInfo {
  const c = typeof classNumber === "number" && classNumber >= 1 && classNumber <= 12 ? classNumber : 8;
  if (c <= 3) return CURRICULUM_TIERS["tier-1-3"];
  if (c <= 5) return CURRICULUM_TIERS["tier-4-5"];
  if (c <= 8) return CURRICULUM_TIERS["tier-6-8"];
  if (c <= 10) return CURRICULUM_TIERS["tier-9-10"];
  return CURRICULUM_TIERS["tier-11-12"];
}

