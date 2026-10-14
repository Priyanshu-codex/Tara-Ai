// Comprehensive TARA Mission Registry — Adaptive Across Classes 1 to 12
// Includes game mechanics, instructions, steps, hints, and validation logic.

import { classMissionsList } from "./classMissionsData";
import { getCurriculumTier, CURRICULUM_TIERS } from "./classCurriculum";
import type { World, CurriculumTierId } from "@/lib/types";

export type MissionType = "video" | "pattern" | "experiment" | "quiz" | "challenge";

export interface PatternItem {
  id: string;
  shape: "circle" | "square" | "triangle" | "star" | "hexagon" | "diamond";
  color: "red" | "blue" | "green" | "yellow" | "purple" | "orange";
  label: string;
}

export interface QuizQuestionData {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveCheckpoint {
  id: string;
  prompt: string;
  items: {
    id: string;
    text: string;
    category: string; // target category
    emoji?: string;
  }[];
  categories: string[];
  explanation: string;
}

export interface MissionData {
  id: string;
  worldId: string;
  worldName: string;
  worldColor: string;
  worldBg: string;
  order: number;
  title: string;
  tagline: string;
  description: string;
  type: MissionType;
  stars: number;
  xpReward: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  learningObjectives: string[];
  instructions: string[];
  classRange?: [number, number];
  tierId?: "tier-1-3" | "tier-4-5" | "tier-6-8" | "tier-9-10" | "tier-11-12";

  // Interactive Content Payloads
  videoLesson?: {
    slides: {
      title: string;
      subtitle: string;
      icon: string;
      content: string[];
      diagram?: {
        leftLabel: string;
        rightLabel: string;
        middleArrow?: string;
        centerSymbol?: string;
        color?: string;
      };
    }[];
    checkpoint?: InteractiveCheckpoint;
    checkpointQuestion?: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  };

  patternGame?: {
    rounds: {
      sequence: PatternItem[];
      options: (PatternItem & { id: string })[];
      correctId: string;
      ruleExplanation?: string;
      explanation?: string;
      hint: string;
    }[];
  };

  experimentLab?: {
    experimentType?: "classifier" | "dataset_cleaning" | "feature_selection" | "landmarks" | "chatbot_tree" | string;
    targetLabel: string;
    sampleData: {
      id: string;
      title: string;
      icon: string;
      features: Record<string, string | number>;
      correctClass: string;
    }[];
    classes: string[];
    testCases: {
      id: string;
      title: string;
      icon: string;
      features: Record<string, string | number>;
      expectedClass: string;
    }[];
    evaluationCriteria: string;
  };

  quizContent?: {
    questions: QuizQuestionData[];
  };

  challengeSteps?: {
    stepNumber: number;
    scenario: string;
    options: string[];
    correctOption: number;
    impact: string;
  }[];

  challengeStudio?: {
    brief: string;
    problemStatement: string;
    scenario: string;
    stages: {
      stageNumber: number;
      title: string;
      description: string;
      options: {
        id: string;
        title: string;
        desc: string;
        icon: string;
        isRecommended?: boolean;
        pros: string;
        cons: string;
      }[];
    }[];
    reflectionPrompt: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// The 27 Missions Registry
// ─────────────────────────────────────────────────────────────────────────────

export const missionRegistry: Record<string, MissionData> = {
  // ── WORLD 1: AI BASICS ──────────────────────────────────────────────────────
  "m1-1": {
    id: "m1-1",
    worldId: "world-1",
    worldName: "AI Basics",
    worldColor: "#3B82F6",
    worldBg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    order: 1,
    title: "What is AI?",
    tagline: "Discover what Artificial Intelligence is and how it powers smart systems",
    description: "Learn how AI differs from standard computer code by recognizing patterns and learning from data.",
    type: "video",
    stars: 3,
    xpReward: 50,
    difficulty: "Beginner",
    estimatedMinutes: 5,
    learningObjectives: [
      "Understand the difference between traditional rule-based code and AI",
      "Learn how computers use patterns to make decisions",
      "Identify everyday examples of artificial intelligence",
    ],
    instructions: [
      "Read through each interactive slide carefully.",
      "Explore the comparison diagram between Traditional Software and AI.",
      "Complete the sorting checkpoint by classifying 4 items into Traditional Code vs AI.",
    ],
    videoLesson: {
      slides: [
        {
          title: "Welcome to the World of AI!",
          subtitle: "How machines think and learn",
          icon: "🤖",
          content: [
            "Computers are incredible at calculating math problems quickly, but normally they only follow strict instructions typed by a programmer.",
            "If a programmer doesn't tell a computer what to do in a specific situation, the computer gets stuck!",
            "Artificial Intelligence (AI) changes this by allowing computers to learn from examples instead of needing a rule for everything.",
          ],
        },
        {
          title: "Traditional Code vs Artificial Intelligence",
          subtitle: "Rules vs Learning from Data",
          icon: "🧠",
          content: [
            "Traditional Code: A programmer writes exact rules (e.g., 'If temperature > 30, turn on fan').",
            "Artificial Intelligence: We give the computer thousands of examples, and it discovers the rules on its own!",
            "Think of it like learning to ride a bicycle: you learn by balance and practice, not just by memorizing a textbook.",
          ],
          diagram: {
            leftLabel: "Data + Rules",
            rightLabel: "Answers",
            middleArrow: "Traditional Code",
            color: "#3B82F6",
          },
        },
        {
          title: "How Does AI Recognize a Cat?",
          subtitle: "Finding patterns in pixels",
          icon: "🐱",
          content: [
            "Imagine describing a cat with code: pointy ears, whiskers, furry tail.",
            "What if a cat is sleeping curled up? Or what if it's a hairless cat? A rigid rule would fail!",
            "AI looks at 10,000 photos of cats and learns the subtle patterns connecting all cat pictures automatically.",
          ],
        },
      ],
      checkpoint: {
        id: "m1-1-check",
        prompt: "Classify these 4 technologies into Traditional Code or AI-Powered:",
        items: [
          { id: "c1", text: "Basic Pocket Calculator (2 + 2 = 4)", category: "Traditional Code", emoji: "🔢" },
          { id: "c2", text: "Phone Face Unlock (Recognizing your face)", category: "AI-Powered", emoji: "📱" },
          { id: "c3", text: "Mechanical Kitchen Microwave Timer", category: "Traditional Code", emoji: "⏱️" },
          { id: "c4", text: "Music App Recommending Songs You'll Love", category: "AI-Powered", emoji: "🎵" },
        ],
        categories: ["Traditional Code", "AI-Powered"],
        explanation: "Pocket calculators and timers use fixed mechanical/digital rules. Face unlock and music recommendations learn from data and user patterns!",
      },
    },
  },

  "m1-2": {
    id: "m1-2",
    worldId: "world-1",
    worldName: "AI Basics",
    worldColor: "#3B82F6",
    worldBg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    order: 2,
    title: "Spot the Pattern",
    tagline: "Help TARA discover repeating patterns and complete the algorithm",
    description: "Solve algorithmic sequence puzzles to understand how AI detects recurring cycles in data.",
    type: "pattern",
    stars: 3,
    xpReward: 80,
    difficulty: "Beginner",
    estimatedMinutes: 6,
    learningObjectives: [
      "Master repeating sequence recognition",
      "Understand periodicity and cycles in algorithmic sequences",
      "Prepare for predictive machine learning concepts",
    ],
    instructions: [
      "Study the sequence of colored shapes from left to right.",
      "Identify the core repeating group (the loop).",
      "Select the option that logically completes the empty mystery spot (?).",
    ],
    patternGame: {
      rounds: [
        {
          sequence: [
            { id: "s1", shape: "circle", color: "red", label: "Red Circle" },
            { id: "s2", shape: "square", color: "blue", label: "Blue Square" },
            { id: "s3", shape: "triangle", color: "green", label: "Green Triangle" },
            { id: "s4", shape: "circle", color: "red", label: "Red Circle" },
            { id: "s5", shape: "square", color: "blue", label: "Blue Square" },
          ],
          options: [
            { id: "opt-a", shape: "triangle", color: "green", label: "Green Triangle" },
            { id: "opt-b", shape: "circle", color: "red", label: "Red Circle" },
            { id: "opt-c", shape: "star", color: "yellow", label: "Yellow Star" },
            { id: "opt-d", shape: "square", color: "blue", label: "Blue Square" },
          ],
          correctId: "opt-a",
          ruleExplanation: "The repeating triplet is (Red Circle → Blue Square → Green Triangle). Since the sequence ends with Red Circle then Blue Square, the next shape is the Green Triangle!",
          hint: "Notice that after every Blue Square, a Green Triangle appears.",
        },
        {
          sequence: [
            { id: "s6", shape: "star", color: "yellow", label: "Yellow Star" },
            { id: "s7", shape: "circle", color: "purple", label: "Purple Circle" },
            { id: "s8", shape: "star", color: "yellow", label: "Yellow Star" },
            { id: "s9", shape: "circle", color: "purple", label: "Purple Circle" },
            { id: "s10", shape: "star", color: "yellow", label: "Yellow Star" },
          ],
          options: [
            { id: "opt-e", shape: "circle", color: "purple", label: "Purple Circle" },
            { id: "opt-f", shape: "square", color: "green", label: "Green Square" },
            { id: "opt-g", shape: "star", color: "yellow", label: "Yellow Star" },
            { id: "opt-h", shape: "triangle", color: "red", label: "Red Triangle" },
          ],
          correctId: "opt-e",
          ruleExplanation: "The sequence alternates strictly: Yellow Star, Purple Circle, Yellow Star, Purple Circle, Yellow Star... The next item is Purple Circle!",
          hint: "It alternates between two shapes back and forth.",
        },
      ],
    },
  },

  "m1-3": {
    id: "m1-3",
    worldId: "world-1",
    worldName: "AI Basics",
    worldColor: "#3B82F6",
    worldBg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    order: 3,
    title: "Train a Mini AI",
    tagline: "Build, train, and test your first computer vision classifier",
    description: "Collect training data, train a model on features, and test its accuracy on new unseen items.",
    type: "experiment",
    stars: 3,
    xpReward: 100,
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    learningObjectives: [
      "Understand what training data is and why data quantity matters",
      "Learn how models adjust weights over training cycles (epochs)",
      "Evaluate classifier accuracy on test datasets",
    ],
    instructions: [
      "Inspect the animal samples in the training dataset.",
      "Label images accurately into Cat vs Dog classes.",
      "Click 'Run Training Cycles' to train the model.",
      "Test your trained model on mystery test images to verify accuracy!",
    ],
    experimentLab: {
      experimentType: "classifier",
      targetLabel: "Cat vs Dog Classifier",
      sampleData: [
        { id: "tr1", title: "Orange Tabby", icon: "🐈", features: { ears: "Pointy", whiskers: "Yes", sound: "Meow" }, correctClass: "Cat" },
        { id: "tr2", title: "Golden Pup", icon: "🐕", features: { ears: "Floppy", whiskers: "No", sound: "Woof" }, correctClass: "Dog" },
        { id: "tr3", title: "Siamese Kitten", icon: "🐱", features: { ears: "Pointy", whiskers: "Yes", sound: "Purr" }, correctClass: "Cat" },
        { id: "tr4", title: "Bulldog", icon: "🐶", features: { ears: "Folded", whiskers: "No", sound: "Bark" }, correctClass: "Dog" },
        { id: "tr5", title: "Calico Cat", icon: "😸", features: { ears: "Pointy", whiskers: "Yes", sound: "Meow" }, correctClass: "Cat" },
        { id: "tr6", title: "Husky", icon: "🐺", features: { ears: "Pointy", whiskers: "No", sound: "Howl" }, correctClass: "Dog" },
      ],
      classes: ["Cat", "Dog"],
      testCases: [
        { id: "ts1", title: "Mystery Animal 1 (Pointy ears, whiskers)", icon: "🐈‍⬛", features: { ears: "Pointy", whiskers: "Yes" }, expectedClass: "Cat" },
        { id: "ts2", title: "Mystery Animal 2 (Floppy ears, barking)", icon: "🦮", features: { ears: "Floppy", whiskers: "No" }, expectedClass: "Dog" },
      ],
      evaluationCriteria: "Accuracy reaches 90%+ when training dataset has balanced samples from both classes.",
    },
  },

  "m1-4": {
    id: "m1-4",
    worldId: "world-1",
    worldName: "AI Basics",
    worldColor: "#3B82F6",
    worldBg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    order: 4,
    title: "AI in Real Life",
    tagline: "Spot Artificial Intelligence at work in your daily routine",
    description: "Explore how navigation apps, voice assistants, and streaming engines use AI every day.",
    type: "quiz",
    stars: 3,
    xpReward: 60,
    difficulty: "Beginner",
    estimatedMinutes: 5,
    learningObjectives: [
      "Recognize AI in smartphone apps, smart homes, and web services",
      "Understand how real-time traffic prediction algorithms operate",
      "Understand collaborative filtering in recommendation algorithms",
    ],
    instructions: [
      "Read each real-world scenario carefully.",
      "Pick the best answer for how AI helps solve that problem.",
      "Review explanations to solidify your understanding.",
    ],
    quizContent: {
      questions: [
        {
          id: "q-m1-4-1",
          question: "How does a GPS map app (like Google Maps) predict real-time traffic jams?",
          options: [
            "A police officer manually updates every road in the world",
            "It collects anonymized speed data from millions of active drivers and detects slowdown patterns",
            "It guesses randomly based on the day of the week",
            "It looks at satellite weather photos only",
          ],
          correctIndex: 1,
          explanation: "GPS services analyze anonymized speed and location patterns from phones on the road to instantly detect and predict traffic jams!",
        },
        {
          id: "q-m1-4-2",
          question: "When a video platform suggests a video you like, it is using:",
          options: [
            "A Recommendation Engine that matches your taste with similar viewers",
            "A coin flip program",
            "Only videos recorded in the last 10 minutes",
            "A human moderator choosing videos for you personally",
          ],
          correctIndex: 0,
          explanation: "Recommendation engines detect patterns in your watch history and match your preferences with millions of similar users worldwide.",
        },
        {
          id: "q-m1-4-3",
          question: "Which of these everyday smartphone features relies on Computer Vision AI?",
          options: [
            "Setting a mechanical alarm",
            "Adjusting the speaker volume slider",
            "Face recognition to unlock your phone",
            "Checking the battery percentage",
          ],
          correctIndex: 2,
          explanation: "Face unlock uses computer vision to analyze facial depth and landmarks from the camera to verify your identity.",
        },
      ],
    },
  },

  "m1-5": {
    id: "m1-5",
    worldId: "world-1",
    worldName: "AI Basics",
    worldColor: "#3B82F6",
    worldBg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    order: 5,
    title: "AI Myths vs Facts",
    tagline: "Bust common misconceptions about Artificial Intelligence",
    description: "Separate science fiction from the real science of computer intelligence.",
    type: "quiz",
    stars: 3,
    xpReward: 70,
    difficulty: "Beginner",
    estimatedMinutes: 5,
    learningObjectives: [
      "Distinguish between real AI capabilities and sci-fi movie tropes",
      "Understand that AI models do not possess consciousness or biological emotions",
      "Recognize the human role in building, guiding, and auditing AI",
    ],
    instructions: [
      "Decide whether each statement is a FACT or a MYTH.",
      "Learn the scientific reason behind each answer.",
    ],
    quizContent: {
      questions: [
        {
          id: "q-m1-5-1",
          question: "Myth or Fact: 'AI computers have real human feelings and feel happy when you praise them.'",
          options: [
            "Fact — AI robots have feelings like humans",
            "Myth — AI processes numbers and algorithms without emotional consciousness",
            "Fact — AI only feels sad when turned off",
            "Myth — AI only has feelings if connected to Wi-Fi",
          ],
          correctIndex: 1,
          explanation: "Myth! AI models do not experience feelings, pain, or joy. They simulate conversational text based on mathematical probabilities.",
        },
        {
          id: "q-m1-5-2",
          question: "Myth or Fact: 'AI can make mistakes or generate false information (hallucinations).'",
          options: [
            "Myth — AI is always 100% correct because it's a computer",
            "Fact — AI can produce convincing mistakes and must always be double-checked",
            "Myth — AI never makes mistakes in math or science",
            "Fact — AI only makes mistakes on weekends",
          ],
          correctIndex: 1,
          explanation: "Fact! AI models predict probable answers from patterns and can 'hallucinate' plausible-sounding errors. Always verify important facts!",
        },
        {
          id: "q-m1-5-3",
          question: "Myth or Fact: 'AI learns from human data, so if human data has bias, AI can become biased too.'",
          options: [
            "Fact — AI mirrors the biases present in its training dataset",
            "Myth — AI automatically deletes all human bias",
            "Fact — AI only has bias if programmed by hackers",
            "Myth — Computers are immune to bias",
          ],
          correctIndex: 0,
          explanation: "Fact! If an AI is trained on historical data containing human biases, it will repeat those biases unless engineers actively audit and rebalance the data.",
        },
      ],
    },
  },

  "m1-6": {
    id: "m1-6",
    worldId: "world-1",
    worldName: "AI Basics",
    worldColor: "#3B82F6",
    worldBg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    order: 6,
    title: "AI Superhero",
    tagline: "Design an AI system to solve an urgent environmental or social challenge",
    description: "Choose a mission, select appropriate sensors and models, and launch your AI solution.",
    type: "challenge",
    stars: 3,
    xpReward: 120,
    difficulty: "Intermediate",
    estimatedMinutes: 10,
    learningObjectives: [
      "Apply AI concepts to solve real humanitarian or ecological issues",
      "Evaluate sensor, model, and hardware choices",
      "Balance accuracy, privacy, and cost constraints",
    ],
    instructions: [
      "Select an urgent challenge (e.g., Wildfire Prevention or Ocean Cleanup).",
      "Choose the best sensor hardware and AI model architecture.",
      "Deploy your solution and evaluate your impact score!",
    ],
    challengeStudio: {
      brief: "The Global Innovation League needs young AI architects to design smart systems for environmental protection.",
      problemStatement: "Early detection of wildfires saves lives and forests. How can AI detect smoke before a fire spreads?",
      scenario: "Wildfire Early Warning Network",
      stages: [
        {
          stageNumber: 1,
          title: "Choose Detection Hardware",
          description: "Which sensor network provides the fastest, most reliable coverage across dense forests?",
          options: [
            {
              id: "hw-1",
              title: "Solar-Powered Drone Fleet with Thermal Cameras",
              desc: "Autonomous drones patrol forest canopies using infrared thermal imaging.",
              icon: "🛸",
              isRecommended: true,
              pros: "Real-time coverage and detects underground heat spots.",
              cons: "Requires weather-resistant maintenance.",
            },
            {
              id: "hw-2",
              title: "Stationary Lookout Towers with Binoculars",
              desc: "Fixed human observation towers placed 50 km apart.",
              icon: "🗼",
              pros: "Low technology cost.",
              cons: "Slow detection and limited night visibility.",
            },
          ],
        },
        {
          stageNumber: 2,
          title: "Select the AI Model",
          description: "Which algorithm best separates smoke and heat from ordinary clouds and fog?",
          options: [
            {
              id: "ai-1",
              title: "Thermal Computer Vision Classifier",
              desc: "Trained on 50,000 aerial infrared images of fog vs smoke.",
              icon: "👁️",
              isRecommended: true,
              pros: "Accurately distinguishes smoke columns from clouds in under 2 seconds.",
              cons: "Needs GPU processing onboard the drone.",
            },
            {
              id: "ai-2",
              title: "Basic Temperature Threshold Sensor",
              desc: "Sounds alarm if air temperature passes 40°C.",
              icon: "🌡️",
              pros: "Very cheap simple chip.",
              cons: "High false alarm rate on hot summer days.",
            },
          ],
        },
      ],
      reflectionPrompt: "By combining thermal drone sensors with computer vision, forest rangers can respond to fires in 5 minutes instead of 3 hours!",
    },
  },

  // ── WORLD 2: MACHINE LEARNING ───────────────────────────────────────────────
  "m2-1": {
    id: "m2-1",
    worldId: "world-2",
    worldName: "Machine Learning",
    worldColor: "#7C3AED",
    worldBg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    order: 1,
    title: "What is Machine Learning?",
    tagline: "Explore the three major branches: Supervised, Unsupervised, and Reinforcement Learning",
    description: "Learn how algorithms learn from data to make predictions and optimize behaviors.",
    type: "video",
    stars: 3,
    xpReward: 50,
    difficulty: "Beginner",
    estimatedMinutes: 6,
    learningObjectives: [
      "Understand the difference between Supervised, Unsupervised, and Reinforcement Learning",
      "Learn how labeled training datasets teach algorithms",
      "Identify real-world examples of each ML paradigm",
    ],
    instructions: [
      "Explore the 3 core types of Machine Learning in the lesson slides.",
      "Complete the interactive matching checkpoint.",
    ],
    videoLesson: {
      slides: [
        {
          title: "The Three Kingdoms of Machine Learning",
          subtitle: "Supervised, Unsupervised & Reinforcement",
          icon: "📊",
          content: [
            "Machine Learning is the engine inside modern AI.",
            "Instead of hand-crafting every decision, we use algorithms that improve automatically with experience.",
            "Scientists divide ML into three main categories based on how the algorithm receives feedback.",
          ],
        },
        {
          title: "1. Supervised Learning",
          subtitle: "Learning with a Teacher",
          icon: "👨‍🏫",
          content: [
            "In Supervised Learning, the training data has labels (answers).",
            "Example: We show photos of fruits labeled 'Apple' or 'Orange'. The model learns to predict labels for new fruits.",
            "It is like a student doing homework with an answer key to check their mistakes.",
          ],
        },
        {
          title: "2. Unsupervised & 3. Reinforcement Learning",
          subtitle: "Discovering Patterns & Trial-and-Error",
          icon: "🎮",
          content: [
            "Unsupervised: No labels! The algorithm finds hidden clusters and groups on its own (like grouping customer shopping habits).",
            "Reinforcement: An agent learns by playing a game, earning points for good moves and losing points for mistakes (like teaching AI to beat Super Mario).",
          ],
        },
      ],
      checkpoint: {
        id: "m2-1-check",
        prompt: "Match each scenario to its correct Machine Learning type:",
        items: [
          { id: "ml1", text: "Email Spam Filter trained on emails marked 'Spam' vs 'Not Spam'", category: "Supervised Learning", emoji: "📧" },
          { id: "ml2", text: "Grouping 1,000 museum visitors by viewing habits without any predefined labels", category: "Unsupervised Learning", emoji: "🏛️" },
          { id: "ml3", text: "An AI robot learning to walk by balancing and receiving score rewards", category: "Reinforcement Learning", emoji: "🤖" },
        ],
        categories: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"],
        explanation: "Supervised uses labels, Unsupervised finds natural clusters, and Reinforcement learns via scores and rewards!",
      },
    },
  },

  "m2-2": {
    id: "m2-2",
    worldId: "world-2",
    worldName: "Machine Learning",
    worldColor: "#7C3AED",
    worldBg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    order: 2,
    title: "Training Data Adventure",
    tagline: "Clean, label, and balance a raw dataset to supercharge model accuracy",
    description: "Experience how data quality directly impacts machine learning performance.",
    type: "experiment",
    stars: 3,
    xpReward: 80,
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    learningObjectives: [
      "Understand the 'Garbage In, Garbage Out' principle in data science",
      "Identify mislabeled and corrupted data points",
      "Balance dataset distributions to prevent skew",
    ],
    instructions: [
      "Inspect the fruit inspection dataset for mistakes.",
      "Fix mislabeled data items (e.g., a lemon labeled as an apple).",
      "Run the training benchmark to see model accuracy jump from 50% to 95%!",
    ],
    experimentLab: {
      experimentType: "dataset_cleaning",
      targetLabel: "Fruit Quality Sorter",
      sampleData: [
        { id: "fd1", title: "Red Gala Apple", icon: "🍎", features: { color: "Red", shape: "Round" }, correctClass: "Apple" },
        { id: "fd2", title: "Yellow Cavendish Banana", icon: "🍌", features: { color: "Yellow", shape: "Curved" }, correctClass: "Banana" },
        { id: "fd3", title: "Sour Lemon (Mislabeled!)", icon: "🍋", features: { color: "Yellow", shape: "Oval" }, correctClass: "Lemon" },
        { id: "fd4", title: "Green Granny Smith", icon: "🍏", features: { color: "Green", shape: "Round" }, correctClass: "Apple" },
      ],
      classes: ["Apple", "Banana", "Lemon"],
      testCases: [
        { id: "t-fd1", title: "Mystery Fruit (Curved & Yellow)", icon: "🍌", features: { color: "Yellow", shape: "Curved" }, expectedClass: "Banana" },
      ],
      evaluationCriteria: "Data cleaning removes label noise and allows decision boundaries to separate fruits cleanly.",
    },
  },

  "m2-3": {
    id: "m2-3",
    worldId: "world-2",
    worldName: "Machine Learning",
    worldColor: "#7C3AED",
    worldBg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    order: 3,
    title: "The Learning Loop",
    tagline: "Fine-tune training epochs and learning rates to master convergence",
    description: "Understand the cycle of prediction, loss calculation, and weight optimization.",
    type: "pattern",
    stars: 3,
    xpReward: 90,
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    learningObjectives: [
      "Understand how loss functions measure error",
      "Learn what epochs and learning rates represent",
      "Avoid underfitting and overfitting",
    ],
    instructions: [
      "Observe the training loop sequence: Prediction → Error Measurement → Weight Adjustment.",
      "Identify the missing algorithmic step in the optimization pipeline.",
    ],
    patternGame: {
      rounds: [
        {
          sequence: [
            { id: "lp1", shape: "circle", color: "blue", label: "1. Input Data" },
            { id: "lp2", shape: "hexagon", color: "purple", label: "2. Model Prediction" },
            { id: "lp3", shape: "square", color: "red", label: "3. Calculate Loss (Error)" },
            { id: "lp4", shape: "circle", color: "blue", label: "1. Input Data" },
            { id: "lp5", shape: "hexagon", color: "purple", label: "2. Model Prediction" },
          ],
          options: [
            { id: "opt-loss", shape: "square", color: "red", label: "3. Calculate Loss (Error)" },
            { id: "opt-data", shape: "circle", color: "blue", label: "1. Input Data" },
            { id: "opt-random", shape: "star", color: "yellow", label: "Random Guess" },
            { id: "opt-sound", shape: "triangle", color: "green", label: "Play Audio" },
          ],
          correctId: "opt-loss",
          ruleExplanation: "Every training epoch follows the cycle: Input Data → Model Prediction → Calculate Loss → Update Weights! The next step after Prediction is Calculate Loss.",
          hint: "The model needs to check its error right after making a prediction.",
        },
      ],
    },
  },

  "m2-4": {
    id: "m2-4",
    worldId: "world-2",
    worldName: "Machine Learning",
    worldColor: "#7C3AED",
    worldBg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    order: 4,
    title: "Predict the Future",
    tagline: "Use regression and classification models to forecast outcomes",
    description: "Learn how ML predicts continuous numbers and discrete categories.",
    type: "quiz",
    stars: 3,
    xpReward: 100,
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    learningObjectives: [
      "Distinguish between Regression (continuous value) and Classification (category)",
      "Understand trends and correlations in scatter data",
    ],
    instructions: [
      "Solve the 3 prediction questions by choosing the right ML technique.",
    ],
    quizContent: {
      questions: [
        {
          id: "q-m2-4-1",
          question: "Predicting tomorrow's exact temperature (e.g. 24.5°C) is an example of:",
          options: [
            "Regression (predicting a continuous number)",
            "Classification (choosing a label like Cat or Dog)",
            "Clustering without numbers",
            "Random generation",
          ],
          correctIndex: 0,
          explanation: "Regression predicts numerical values along a continuous scale (like temperature, house prices, or running speed).",
        },
        {
          id: "q-m2-4-2",
          question: "If study hours increase from 1 hour to 5 hours and test scores consistently rise, this indicates:",
          options: [
            "A positive correlation that an ML model can learn",
            "Zero relationship",
            "A negative correlation",
            "That study hours have no impact on learning",
          ],
          correctIndex: 0,
          explanation: "When both variables increase together, they show positive correlation that regression algorithms use to make predictions.",
        },
      ],
    },
  },

  "m2-5": {
    id: "m2-5",
    worldId: "world-2",
    worldName: "Machine Learning",
    worldColor: "#7C3AED",
    worldBg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    order: 5,
    title: "Build Your Classifier",
    tagline: "Design decision boundaries to classify sports equipment",
    description: "Select optimal features to separate footballs, tennis balls, and basketballs.",
    type: "experiment",
    stars: 3,
    xpReward: 150,
    difficulty: "Advanced",
    estimatedMinutes: 8,
    learningObjectives: [
      "Understand feature selection (weight vs diameter)",
      "Learn how decision trees create split points",
    ],
    instructions: [
      "Select features (Weight and Diameter) to build split rules.",
      "Verify that sports balls are sorted with 100% precision.",
    ],
    experimentLab: {
      experimentType: "feature_selection",
      targetLabel: "Sports Ball Classifier",
      sampleData: [
        { id: "sb1", title: "Tennis Ball", icon: "🎾", features: { weightG: 58, diameterCm: 6.7 }, correctClass: "Tennis" },
        { id: "sb2", title: "Basketball", icon: "🏀", features: { weightG: 620, diameterCm: 24 }, correctClass: "Basketball" },
        { id: "sb3", title: "Soccer Ball", icon: "⚽", features: { weightG: 430, diameterCm: 22 }, correctClass: "Soccer" },
      ],
      classes: ["Tennis", "Basketball", "Soccer"],
      testCases: [
        { id: "t-sb1", title: "Small lightweight ball (59g)", icon: "🎾", features: { weightG: 59, diameterCm: 6.8 }, expectedClass: "Tennis" },
      ],
      evaluationCriteria: "Feature boundaries cleanly isolate small, medium, and heavy sports balls.",
    },
  },

  // ── WORLD 3: COMPUTER VISION ───────────────────────────────────────────────
  "m3-1": {
    id: "m3-1",
    worldId: "world-3",
    worldName: "Computer Vision",
    worldColor: "#059669",
    worldBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    order: 1,
    title: "How Computers See",
    tagline: "Demystify pixels, RGB channels, and digital matrices",
    description: "Learn how cameras translate light into numbers that computers can analyze.",
    type: "video",
    stars: 3,
    xpReward: 50,
    difficulty: "Beginner",
    estimatedMinutes: 6,
    learningObjectives: [
      "Understand that digital images are 2D grids of numbers (pixels)",
      "Learn how Red, Green, and Blue (RGB) values mix from 0 to 255",
      "See how filters extract edges from brightness differences",
    ],
    instructions: [
      "Explore how computers see pixels as numerical grids.",
      "Complete the pixel color checkpoint.",
    ],
    videoLesson: {
      slides: [
        {
          title: "Images are Just Grids of Numbers!",
          subtitle: "Pixels and numerical values",
          icon: "👁️",
          content: [
            "To your eyes, an image is a photo of a dog or a sunset.",
            "To a computer, that exact same image is just a spreadsheet of numbers!",
            "Each tiny square dot in an image is called a PIXEL.",
          ],
        },
        {
          title: "The RGB Color Formula",
          subtitle: "Red, Green, Blue from 0 to 255",
          icon: "🎨",
          content: [
            "Every color pixel is made of three values: Red, Green, and Blue.",
            "Values range from 0 (completely dark) to 255 (maximum brightness).",
            "RGB(255, 0, 0) is pure Red. RGB(0, 0, 0) is Black. RGB(255, 255, 255) is White!",
          ],
        },
      ],
      checkpoint: {
        id: "m3-1-check",
        prompt: "Identify the RGB color matches:",
        items: [
          { id: "rgb1", text: "RGB(255, 0, 0)", category: "Pure Red", emoji: "🔴" },
          { id: "rgb2", text: "RGB(0, 255, 0)", category: "Pure Green", emoji: "🟢" },
          { id: "rgb3", text: "RGB(0, 0, 255)", category: "Pure Blue", emoji: "🔵" },
        ],
        categories: ["Pure Red", "Pure Green", "Pure Blue"],
        explanation: "The first value controls Red, the second controls Green, and the third controls Blue!",
      },
    },
  },

  "m3-2": {
    id: "m3-2",
    worldId: "world-3",
    worldName: "Computer Vision",
    worldColor: "#059669",
    worldBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    order: 2,
    title: "Spot the Cat!",
    tagline: "Use edge filters to highlight outlines and key feline features",
    description: "Discover how convolution filters find edges, whiskers, and contours.",
    type: "experiment",
    stars: 3,
    xpReward: 100,
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    learningObjectives: [
      "Understand edge detection and Sobel filtering",
      "Learn how convolutional layers detect low-level shapes",
    ],
    instructions: [
      "Activate the Edge Detection filter on animal silhouettes.",
      "Verify that cat contours are recognized.",
    ],
    experimentLab: {
      experimentType: "classifier",
      targetLabel: "Cat Edge Detector",
      sampleData: [
        { id: "cd1", title: "Cat Outline", icon: "🐈", features: { edges: "Pointy ear lines", whiskers: "Detected" }, correctClass: "Cat" },
        { id: "cd2", title: "Bear Outline", icon: "🐻", features: { edges: "Round ear lines", whiskers: "None" }, correctClass: "Other" },
      ],
      classes: ["Cat", "Other"],
      testCases: [
        { id: "t-cd1", title: "Test Feline", icon: "🐱", features: { edges: "Pointy ear lines" }, expectedClass: "Cat" },
      ],
      evaluationCriteria: "Edge filters distinguish pointy ears and whisker lines reliably.",
    },
  },

  "m3-3": {
    id: "m3-3",
    worldId: "world-3",
    worldName: "Computer Vision",
    worldColor: "#059669",
    worldBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    order: 3,
    title: "Object Detection Quest",
    tagline: "Identify objects and locate their coordinates in a scene",
    description: "Go beyond simple classification to locate WHERE objects are located using bounding boxes.",
    type: "pattern",
    stars: 3,
    xpReward: 90,
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    learningObjectives: [
      "Learn the difference between Image Classification and Object Detection",
      "Understand bounding box coordinates [x, y, width, height]",
    ],
    instructions: [
      "Follow the sequence of detection steps: Raw Image → Feature Grid → Bounding Box Proposal → Final Classification.",
      "Select the missing step in the detection pipeline.",
    ],
    patternGame: {
      rounds: [
        {
          sequence: [
            { id: "od1", shape: "square", color: "blue", label: "1. Raw Pixels" },
            { id: "od2", shape: "hexagon", color: "green", label: "2. Feature Map" },
            { id: "od3", shape: "star", color: "yellow", label: "3. Bounding Boxes" },
            { id: "od4", shape: "square", color: "blue", label: "1. Raw Pixels" },
            { id: "od5", shape: "hexagon", color: "green", label: "2. Feature Map" },
          ],
          options: [
            { id: "opt-bb", shape: "star", color: "yellow", label: "3. Bounding Boxes" },
            { id: "opt-raw", shape: "square", color: "blue", label: "1. Raw Pixels" },
            { id: "opt-audio", shape: "triangle", color: "purple", label: "Audio Track" },
          ],
          correctId: "opt-bb",
          ruleExplanation: "Object detection extracts feature maps, then proposes bounding box locations! After Feature Map comes Bounding Boxes.",
          hint: "The step that puts boxes around detected objects.",
        },
      ],
    },
  },

  "m3-4": {
    id: "m3-4",
    worldId: "world-3",
    worldName: "Computer Vision",
    worldColor: "#059669",
    worldBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    order: 4,
    title: "Face Recognition Challenge",
    tagline: "Map 68 facial landmarks to recognize expressions and identities",
    description: "Explore geometric facial landmark analysis used in face filters and biometric safety.",
    type: "experiment",
    stars: 3,
    xpReward: 120,
    difficulty: "Advanced",
    estimatedMinutes: 8,
    learningObjectives: [
      "Understand geometric facial landmarks (eyes, nose, jawline, lips)",
      "Learn how distance ratios remain consistent regardless of smiling or frowning",
    ],
    instructions: [
      "Inspect landmark point coordinates on test faces.",
      "Classify expressions into Happy, Surprised, or Neutral based on landmark distances.",
    ],
    experimentLab: {
      experimentType: "landmarks",
      targetLabel: "Facial Landmark Analyzer",
      sampleData: [
        { id: "fl1", title: "Smiling Face", icon: "😄", features: { mouthCornerDistance: "Wide", lipCurve: "Upward" }, correctClass: "Happy" },
        { id: "fl2", title: "Wide Eyed Face", icon: "😲", features: { eyebrowHeight: "High", mouthOpen: "Yes" }, correctClass: "Surprised" },
        { id: "fl3", title: "Calm Expression", icon: "😐", features: { mouthCornerDistance: "Standard", lipCurve: "Flat" }, correctClass: "Neutral" },
      ],
      classes: ["Happy", "Surprised", "Neutral"],
      testCases: [
        { id: "t-fl1", title: "Test Face (Upward curved lips)", icon: "😊", features: { lipCurve: "Upward" }, expectedClass: "Happy" },
      ],
      evaluationCriteria: "Facial landmark ratios accurately detect smiles and open-mouth surprises.",
    },
  },

  "m3-5": {
    id: "m3-5",
    worldId: "world-3",
    worldName: "Computer Vision",
    worldColor: "#059669",
    worldBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    order: 5,
    title: "Real World Vision",
    tagline: "Equip an autonomous self-driving car with reliable vision safety",
    description: "Address challenging real-world driving conditions like heavy rain, fog, and night glare.",
    type: "challenge",
    stars: 3,
    xpReward: 150,
    difficulty: "Advanced",
    estimatedMinutes: 9,
    learningObjectives: [
      "Solve sensor fusion challenges (Cameras + Radar + LiDAR)",
      "Handle edge cases in computer vision safety",
    ],
    instructions: [
      "Configure the perception stack for an autonomous school bus.",
      "Select camera types and safety redundancies.",
    ],
    challengeStudio: {
      brief: "The Smart City Transport Board is piloting an autonomous student shuttle and needs your computer vision expertise.",
      problemStatement: "How can the vehicle detect pedestrians in heavy monsoon rains when camera lenses get covered with raindrops?",
      scenario: "Autonomous Shuttle Vision Stack",
      stages: [
        {
          stageNumber: 1,
          title: "Sensor Redundancy",
          description: "What should complement optical cameras during heavy rain?",
          options: [
            {
              id: "sen-1",
              title: "Sensor Fusion: Optical Cameras + 77GHz Radar",
              desc: "Radar waves penetrate water droplets and fog effortlessly, while cameras identify colors.",
              icon: "📡",
              isRecommended: true,
              pros: "100% weather resilience.",
              cons: "Requires synchronizing data from two sensor types.",
            },
            {
              id: "sen-2",
              title: "Single Front Windshield Camera Only",
              desc: "Relies entirely on optical glass with wipers.",
              icon: "📷",
              pros: "Cheap and simple.",
              cons: "High risk of blind spots during sudden splash events.",
            },
          ],
        },
      ],
      reflectionPrompt: "Sensor fusion ensures that if one sensor gets blinded by rain or sun glare, another sensor keeps passengers safe!",
    },
  },

  "m3-6": {
    id: "m3-6",
    worldId: "world-3",
    worldName: "Computer Vision",
    worldColor: "#059669",
    worldBg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    order: 6,
    title: "Vision Master",
    tagline: "Prove your mastery of pixels, convolutions, and visual neural networks",
    description: "Complete the comprehensive Computer Vision capstone assessment.",
    type: "quiz",
    stars: 3,
    xpReward: 200,
    difficulty: "Advanced",
    estimatedMinutes: 8,
    learningObjectives: [
      "Review pixels, RGB colors, edge detection, and object detection",
      "Demonstrate comprehensive computer vision literacy",
    ],
    instructions: [
      "Answer all questions correctly to claim the Vision Master certification badge!",
    ],
    quizContent: {
      questions: [
        {
          id: "q-m3-6-1",
          question: "What is the primary difference between Image Classification and Object Detection?",
          options: [
            "Classification tells 'WHAT' is in the image, while Object Detection tells 'WHAT' and 'WHERE' (with bounding boxes)",
            "Classification is only for black-and-white photos",
            "Object detection works only with audio",
            "There is no difference between them",
          ],
          correctIndex: 0,
          explanation: "Image classification gives a label for the whole image, whereas object detection locates every object with coordinates.",
        },
        {
          id: "q-m3-6-2",
          question: "Why do computer vision models use grayscale or normalized numbers (0.0 to 1.0) during training?",
          options: [
            "Because smaller, standardized numbers help neural network math compute faster and avoid calculation overflow",
            "Because computers cannot store numbers above 10",
            "Because colors are illegal in machine learning",
            "Because screens turn off without normalization",
          ],
          correctIndex: 0,
          explanation: "Normalizing pixel values speeds up mathematical optimization and gradient descent calculations significantly.",
        },
      ],
    },
  },

  // ── WORLD 4: NATURAL LANGUAGE PROCESSING ───────────────────────────────────
  "m4-1": {
    id: "m4-1",
    worldId: "world-4",
    worldName: "Natural Language Processing",
    worldColor: "#D97706",
    worldBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    order: 1,
    title: "Words and Meaning",
    tagline: "Explore how computers read, tokenize, and understand human language",
    description: "Learn how text is chopped into tokens and mapped into mathematical meaning vectors.",
    type: "video",
    stars: 3,
    xpReward: 50,
    difficulty: "Beginner",
    estimatedMinutes: 6,
    learningObjectives: [
      "Understand Tokenization: Breaking sentences into words and subwords",
      "Learn how Word Embeddings place words with similar meanings close together",
    ],
    instructions: [
      "Read through the NLP lesson slides.",
      "Complete the tokenization sorting checkpoint.",
    ],
    videoLesson: {
      slides: [
        {
          title: "How Do Computers Read?",
          subtitle: "Turning text into numbers",
          icon: "💬",
          content: [
            "Computers don't understand English, Hindi, or Spanish directly — they only understand numbers!",
            "To understand a sentence, an AI first breaks it into tiny pieces called TOKENS.",
            "Tokens can be whole words (like 'dog') or pieces of words (like 'play' + 'ing').",
          ],
        },
        {
          title: "Word Embeddings: Meaning Maps",
          subtitle: "Math for semantics",
          icon: "🗺️",
          content: [
            "How does an AI know that 'king' and 'queen' are related, or that 'puppy' is a young 'dog'?",
            "AI assigns every word a coordinate in a multi-dimensional map called an EMBEDDING.",
            "Words with similar meanings sit near each other in this semantic neighborhood!",
          ],
        },
      ],
      checkpoint: {
        id: "m4-1-check",
        prompt: "Group these words into their semantic neighborhoods:",
        items: [
          { id: "w1", text: "King & Queen", category: "Royalty", emoji: "👑" },
          { id: "w2", text: "Puppy & Kitten", category: "Baby Animals", emoji: "🐾" },
          { id: "w3", text: "Monarch & Crown", category: "Royalty", emoji: "🏰" },
          { id: "w4", text: "Calf & Foal", category: "Baby Animals", emoji: "🐎" },
        ],
        categories: ["Royalty", "Baby Animals"],
        explanation: "Word embeddings group royalty terms together and animal terms together in semantic space!",
      },
    },
  },

  "m4-2": {
    id: "m4-2",
    worldId: "world-4",
    worldName: "Natural Language Processing",
    worldColor: "#D97706",
    worldBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    order: 2,
    title: "Sentiment Detector",
    tagline: "Classify reviews and messages as Positive, Negative, or Neutral",
    description: "Learn how sentiment analysis helps companies understand customer feedback automatically.",
    type: "pattern",
    stars: 3,
    xpReward: 80,
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    learningObjectives: [
      "Understand sentiment polarity analysis",
      "Identify emotional keywords and negation words (e.g. 'not good')",
    ],
    instructions: [
      "Follow the sentiment cycle pattern and select the missing sentiment category.",
    ],
    patternGame: {
      rounds: [
        {
          sequence: [
            { id: "sm1", shape: "star", color: "green", label: "Positive ('Loved it!')" },
            { id: "sm2", shape: "circle", color: "blue", label: "Neutral ('Arrived today')" },
            { id: "sm3", shape: "diamond", color: "red", label: "Negative ('Broken box')" },
            { id: "sm4", shape: "star", color: "green", label: "Positive ('Loved it!')" },
            { id: "sm5", shape: "circle", color: "blue", label: "Neutral ('Arrived today')" },
          ],
          options: [
            { id: "opt-neg", shape: "diamond", color: "red", label: "Negative ('Broken box')" },
            { id: "opt-pos", shape: "star", color: "green", label: "Positive ('Loved it!')" },
            { id: "opt-audio", shape: "square", color: "purple", label: "Music Track" },
          ],
          correctId: "opt-neg",
          ruleExplanation: "The sequence repeats: Positive → Neutral → Negative! Following Neutral comes Negative.",
          hint: "The red diamond category comes next.",
        },
      ],
    },
  },

  "m4-3": {
    id: "m4-3",
    worldId: "world-4",
    worldName: "Natural Language Processing",
    worldColor: "#D97706",
    worldBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    order: 3,
    title: "Chatbot Builder",
    tagline: "Design an intelligent conversational tree for school homework help",
    description: "Map user intents to accurate, encouraging educational responses.",
    type: "experiment",
    stars: 3,
    xpReward: 150,
    difficulty: "Intermediate",
    estimatedMinutes: 8,
    learningObjectives: [
      "Understand Intent Recognition and Entity Extraction",
      "Design dialog management fallback strategies",
    ],
    instructions: [
      "Match incoming student questions with the correct chatbot intent.",
      "Test the chatbot flow with sample homework prompts.",
    ],
    experimentLab: {
      experimentType: "chatbot_tree",
      targetLabel: "Homework Buddy Chatbot",
      sampleData: [
        { id: "cb1", title: "Greeting Intent", icon: "👋", features: { userText: "Hello there!", intent: "greet" }, correctClass: "Greeting" },
        { id: "cb2", title: "Math Intent", icon: "📐", features: { userText: "What is 15 * 8?", intent: "calculate" }, correctClass: "Math" },
        { id: "cb3", title: "Science Intent", icon: "🌱", features: { userText: "How do plants eat?", intent: "explain" }, correctClass: "Science" },
      ],
      classes: ["Greeting", "Math", "Science"],
      testCases: [
        { id: "t-cb1", title: "Test Query: 'Solve 2x + 4 = 10'", icon: "✏️", features: { userText: "Solve 2x + 4 = 10" }, expectedClass: "Math" },
      ],
      evaluationCriteria: "Chatbot accurately categorizes math queries into the Math tutoring handler.",
    },
  },

  "m4-4": {
    id: "m4-4",
    worldId: "world-4",
    worldName: "Natural Language Processing",
    worldColor: "#D97706",
    worldBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    order: 4,
    title: "Language Translator",
    tagline: "Solve language ambiguities across multiple cultural contexts",
    description: "Understand how context resolves multiple meanings of words during machine translation.",
    type: "challenge",
    stars: 3,
    xpReward: 120,
    difficulty: "Advanced",
    estimatedMinutes: 8,
    learningObjectives: [
      "Understand homonyms and contextual disambiguation",
      "Learn how attention mechanisms attend to surrounding words",
    ],
    instructions: [
      "Help the translation model choose the correct meaning of ambiguous words based on surrounding context.",
    ],
    challengeStudio: {
      brief: "Translate an English science article into multiple languages without embarrassing misunderstandings.",
      problemStatement: "The word 'BANK' can mean a financial institution or a riverbank. How does an attention model know?",
      scenario: "Contextual Attention Translation",
      stages: [
        {
          stageNumber: 1,
          title: "Analyze Sentence Context",
          description: "Sentence: 'The river bank was muddy after the rain.' Which surrounding words tell the AI the true meaning?",
          options: [
            {
              id: "tr-1",
              title: "Surrounding words: 'river', 'muddy', 'rain'",
              desc: "The attention weights focus on nature terms, confirming this is a geographical riverbank.",
              icon: "🌊",
              isRecommended: true,
              pros: "100% accurate translation to river shoreline.",
              cons: "Requires attention across the full sentence window.",
            },
            {
              id: "tr-2",
              title: "Default to Most Frequent Dictionary Meaning ('Money Bank')",
              desc: "Translates to a financial money vault.",
              icon: "🏦",
              pros: "No context parsing needed.",
              cons: "Results in hilarious mistranslation: 'The financial vault was muddy'!",
            },
          ],
        },
      ],
      reflectionPrompt: "Modern Transformer models look at all surrounding words simultaneously so words are translated in true context!",
    },
  },

  "m4-5": {
    id: "m4-5",
    worldId: "world-4",
    worldName: "Natural Language Processing",
    worldColor: "#D97706",
    worldBg: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    order: 5,
    title: "NLP Master",
    tagline: "Demonstrate your mastery of Large Language Models and prompt engineering",
    description: "Complete the capstone Natural Language Processing assessment.",
    type: "quiz",
    stars: 3,
    xpReward: 200,
    difficulty: "Advanced",
    estimatedMinutes: 8,
    learningObjectives: [
      "Review tokenization, embeddings, and prompt design",
      "Understand limitations and responsible usage of LLMs",
    ],
    instructions: [
      "Score 100% on the NLP Master quiz to earn your Language AI badge!",
    ],
    quizContent: {
      questions: [
        {
          id: "q-m4-5-1",
          question: "What is a 'Prompt' in Large Language Models like Tara or ChatGPT?",
          options: [
            "The input instruction or question provided by the user that guides the AI's response",
            "A hardware wire that plugs into the computer",
            "A secret password known only to programmers",
            "A fee you pay per letter",
          ],
          correctIndex: 0,
          explanation: "A prompt is the text instruction given to an AI. Better, clearer prompts lead to more helpful answers!",
        },
        {
          id: "q-m4-5-2",
          question: "Why can an AI chatbot sometimes sound very confident while stating an incorrect fact?",
          options: [
            "Because it is trying to trick you on purpose",
            "Because it generates text based on language patterns, not conscious fact-checking",
            "Because computers don't like homework",
            "Because it runs out of memory at night",
          ],
          correctIndex: 1,
          explanation: "Language models predict probable word sequences. They don't have human judgment, which is why students should always verify facts!",
        },
      ],
    },
  },

  // ── WORLD 5: RESPONSIBLE AI ────────────────────────────────────────────────
  "m5-1": {
    id: "m5-1",
    worldId: "world-5",
    worldName: "Responsible AI",
    worldColor: "#EA580C",
    worldBg: "linear-gradient(135deg, #FED7AA, #FDBA74)",
    order: 1,
    title: "AI Ethics 101",
    tagline: "Understand the 4 pillars of ethical, human-centered technology",
    description: "Explore fairness, accountability, transparency, and privacy in modern tech.",
    type: "video",
    stars: 3,
    xpReward: 60,
    difficulty: "Beginner",
    estimatedMinutes: 6,
    learningObjectives: [
      "Learn the core principles of AI Ethics",
      "Understand why technology must be designed to benefit everyone equally",
    ],
    instructions: [
      "Study the 4 ethical pillars.",
      "Complete the real-world scenario checkpoint.",
    ],
    videoLesson: {
      slides: [
        {
          title: "With Great AI Comes Great Responsibility!",
          subtitle: "Why ethics matters in engineering",
          icon: "🌍",
          content: [
            "Artificial Intelligence is one of the most powerful inventions in human history.",
            "Like electricity or medicine, AI can do enormous good — or cause harm if built carelessly.",
            "Responsible AI means creating systems that are Fair, Safe, Transparent, and Respectful of Privacy.",
          ],
        },
        {
          title: "The Four Pillars of Ethical AI",
          subtitle: "Guiding principles for future innovators",
          icon: "🛡️",
          content: [
            "1. Fairness: Treating all people equally without bias or prejudice.",
            "2. Transparency: Being open about how AI makes decisions and admitting when AI is in use.",
            "3. Privacy: Keeping personal data safe and never collecting unnecessary info.",
            "4. Human Benefit: Solving problems that help society thrive.",
          ],
        },
      ],
      checkpoint: {
        id: "m5-1-check",
        prompt: "Match each scenario to its Ethical AI Pillar:",
        items: [
          { id: "eth1", text: "Ensuring facial recognition works with equal accuracy across all skin tones", category: "Fairness", emoji: "⚖️" },
          { id: "eth2", text: "A chatbot clearly telling you it is an AI and not a human doctor", category: "Transparency", emoji: "🔍" },
          { id: "eth3", text: "Encrypting student homework and never selling browsing records to advertisers", category: "Privacy", emoji: "🔒" },
        ],
        categories: ["Fairness", "Transparency", "Privacy"],
        explanation: "Fairness prevents demographic bias, Transparency ensures honesty, and Privacy guards personal records!",
      },
    },
  },

  "m5-2": {
    id: "m5-2",
    worldId: "world-5",
    worldName: "Responsible AI",
    worldColor: "#EA580C",
    worldBg: "linear-gradient(135deg, #FED7AA, #FDBA74)",
    order: 2,
    title: "Bias Busters",
    tagline: "Audit datasets and eliminate unfair representation in AI models",
    description: "Detect systemic bias in training data and restore fairness for all users.",
    type: "pattern",
    stars: 3,
    xpReward: 100,
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    learningObjectives: [
      "Recognize historical bias in dataset collection",
      "Learn how diversity in training data creates fair models",
    ],
    instructions: [
      "Follow the bias auditing workflow to restore balance in the training pipeline.",
    ],
    patternGame: {
      rounds: [
        {
          sequence: [
            { id: "bb1", shape: "circle", color: "purple", label: "1. Audit Dataset" },
            { id: "bb2", shape: "square", color: "orange", label: "2. Detect Skew" },
            { id: "bb3", shape: "star", color: "green", label: "3. Add Diverse Data" },
            { id: "bb4", shape: "circle", color: "purple", label: "1. Audit Dataset" },
            { id: "bb5", shape: "square", color: "orange", label: "2. Detect Skew" },
          ],
          options: [
            { id: "opt-diverse", shape: "star", color: "green", label: "3. Add Diverse Data" },
            { id: "opt-delete", shape: "circle", color: "blue", label: "Delete Entire Computer" },
            { id: "opt-ignore", shape: "hexagon", color: "red", label: "Ignore the Bias" },
          ],
          correctId: "opt-diverse",
          ruleExplanation: "After detecting skew, ethical engineers add diverse, representative data to balance the model! The next step is Add Diverse Data.",
          hint: "The green star action that fixes the skew.",
        },
      ],
    },
  },

  "m5-3": {
    id: "m5-3",
    worldId: "world-5",
    worldName: "Responsible AI",
    worldColor: "#EA580C",
    worldBg: "linear-gradient(135deg, #FED7AA, #FDBA74)",
    order: 3,
    title: "Privacy Protectors",
    tagline: "Shield personal data, passwords, and student identities from leakage",
    description: "Master digital self-defense, data minimization, and safe AI usage habits.",
    type: "quiz",
    stars: 3,
    xpReward: 80,
    difficulty: "Beginner",
    estimatedMinutes: 6,
    learningObjectives: [
      "Identify Personally Identifiable Information (PII)",
      "Practice safe habits when interacting with AI chatbots",
    ],
    instructions: [
      "Answer the privacy scenario questions to earn your Privacy Defender badge.",
    ],
    quizContent: {
      questions: [
        {
          id: "q-m5-3-1",
          question: "When chatting with an AI buddy or public assistant, you should NEVER share:",
          options: [
            "Your favourite subject in school",
            "Your home address, phone number, school location, or family passwords",
            "Questions about how volcanos erupt",
            "A request for a science joke",
          ],
          correctIndex: 1,
          explanation: "Never share sensitive PII (Personally Identifiable Information) like addresses, phone numbers, or passwords with any AI or website!",
        },
        {
          id: "q-m5-3-2",
          question: "What is 'Data Minimization' in privacy law?",
          options: [
            "Apps should only collect the minimum information strictly needed to provide the service",
            "Making files as small as possible so they fit on floppy disks",
            "Deleting all computers every night",
            "Typing in lowercase letters only",
          ],
          correctIndex: 0,
          explanation: "Data minimization means collecting only what is strictly necessary — keeping students safer from unnecessary data harvesting.",
        },
      ],
    },
  },

  "m5-4": {
    id: "m5-4",
    worldId: "world-5",
    worldName: "Responsible AI",
    worldColor: "#EA580C",
    worldBg: "linear-gradient(135deg, #FED7AA, #FDBA74)",
    order: 4,
    title: "AI for Good",
    tagline: "Deploy smart routing for emergency healthcare during natural disasters",
    description: "Design an AI dispatch coordinator to get emergency supplies to stranded communities.",
    type: "challenge",
    stars: 3,
    xpReward: 150,
    difficulty: "Intermediate",
    estimatedMinutes: 9,
    learningObjectives: [
      "Apply optimization algorithms for humanitarian relief",
      "Prioritize urgency, safety, and equitable distribution",
    ],
    instructions: [
      "Set route priorities for emergency medical drone dispatch.",
    ],
    challengeStudio: {
      brief: "Flooding has blocked roads to three remote villages. You are the AI logistics coordinator.",
      problemStatement: "How should the AI prioritize medicine deliveries when battery power is limited?",
      scenario: "Emergency Medical Drone Routing",
      stages: [
        {
          stageNumber: 1,
          title: "Prioritization Algorithm",
          description: "Which algorithm optimization strategy saves the most lives?",
          options: [
            {
              id: "em-1",
              title: "Triage Urgency + Route Efficiency Optimizer",
              desc: "Considers critical patient severity first, then chains nearest villages to conserve battery.",
              icon: "🚁",
              isRecommended: true,
              pros: "Ensures critical insulin and anti-venom reaches patients in under 30 minutes.",
              cons: "Requires dynamic recalculation as weather shifts.",
            },
            {
              id: "em-2",
              title: "First-Come, First-Served Order Queue",
              desc: "Delivers based solely on who called first, regardless of severity.",
              icon: "📋",
              pros: "Easy to write in code.",
              cons: "Leaves critical patients waiting while delivering minor supplies.",
            },
          ],
        },
      ],
      reflectionPrompt: "AI for Good uses mathematics to ensure emergency resources reach the most vulnerable people first!",
    },
  },

  "m5-5": {
    id: "m5-5",
    worldId: "world-5",
    worldName: "Responsible AI",
    worldColor: "#EA580C",
    worldBg: "linear-gradient(135deg, #FED7AA, #FDBA74)",
    order: 5,
    title: "Future Builder",
    tagline: "Draft, sign, and adopt the TARA Student Responsible AI Charter",
    description: "Synthesize all five worlds to become a certified Responsible AI Ambassador.",
    type: "experiment",
    stars: 3,
    xpReward: 250,
    difficulty: "Advanced",
    estimatedMinutes: 10,
    learningObjectives: [
      "Synthesize concepts across all 5 learning worlds",
      "Adopt personal ethics principles for AI development and creative tool use",
    ],
    instructions: [
      "Review the Student AI Pledge clauses.",
      "Check off each pledge commitment to earn your Grand Graduation Certificate!",
    ],
    experimentLab: {
      experimentType: "classifier",
      targetLabel: "Student AI Charter",
      sampleData: [
        { id: "ch1", title: "Truth & Verification", icon: "🔍", features: { pledge: "I will double-check AI answers with books and teachers" }, correctClass: "Adopted" },
        { id: "ch2", title: "Kindness & Safety", icon: "🤝", features: { pledge: "I will never use AI to bully, deceive, or cheat" }, correctClass: "Adopted" },
        { id: "ch3", title: "Human Creativity", icon: "🎨", features: { pledge: "I will use AI to boost my imagination, not replace my own thinking" }, correctClass: "Adopted" },
      ],
      classes: ["Adopted"],
      testCases: [
        { id: "t-ch1", title: "Future Innovator Pledge", icon: "🎓", features: { commitment: "Certified" }, expectedClass: "Adopted" },
      ],
      evaluationCriteria: "Completing all pledge criteria unlocks the Grand TARA AI Laureate certificate.",
    },
  },
};

// Register all class-specific missions into the central registry
for (const cm of classMissionsList) {
  if (!cm.classRange) {
    if (cm.id.startsWith("c13-")) {
      cm.classRange = [1, 3];
      cm.tierId = "tier-1-3";
    } else if (cm.id.startsWith("c45-")) {
      cm.classRange = [4, 5];
      cm.tierId = "tier-4-5";
    } else if (cm.id.startsWith("c910-")) {
      cm.classRange = [9, 10];
      cm.tierId = "tier-9-10";
    } else if (cm.id.startsWith("c1112-")) {
      cm.classRange = [11, 12];
      cm.tierId = "tier-11-12";
    }
  }
  missionRegistry[cm.id] = cm;
}

// Mark existing Middle School missions with tier-6-8
for (const m of Object.values(missionRegistry)) {
  if (!m.classRange) {
    m.classRange = [6, 8];
    m.tierId = "tier-6-8";
  }
}

export function getMissionById(missionIdOrSlug: string): MissionData | null {
  if (!missionIdOrSlug) return null;
  const slug = missionIdOrSlug.toLowerCase().trim();

  // Alias for spot the pattern
  if (slug === "spot-the-pattern") return missionRegistry["m1-2"];

  if (missionRegistry[slug]) return missionRegistry[slug];

  // Try matching by slugified title
  for (const mission of Object.values(missionRegistry)) {
    const titleSlug = mission.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (titleSlug === slug || titleSlug.includes(slug)) {
      return mission;
    }
  }

  return null;
}

export function isMissionEligibleForClass(
  missionId: string,
  classNum: number | null | undefined
): boolean {
  const mission = getMissionById(missionId);
  if (!mission) return false;
  if (!classNum) return true; // Fallback if class not selected yet
  const [minC, maxC] = mission.classRange || [6, 8];
  return classNum >= minC && classNum <= maxC;
}

export function getMissionsForClass(classNum: number | null | undefined): MissionData[] {
  const targetClass = typeof classNum === "number" ? classNum : 8;
  return Object.values(missionRegistry).filter((m) => {
    const [minC, maxC] = m.classRange || [6, 8];
    return targetClass >= minC && targetClass <= maxC;
  });
}

export function getWorldsForClass(classNum: number | null | undefined): World[] {
  const targetClass = typeof classNum === "number" ? classNum : 8;
  const tier = getCurriculumTier(targetClass);

  if (tier.id === "tier-1-3") {
    const w1Missions = Object.values(missionRegistry)
      .filter((m) => m.worldId === "c13-world-1")
      .map((m) => ({
        id: m.id,
        worldId: m.worldId,
        title: m.title,
        description: m.description,
        type: m.type,
        stars: m.stars,
        xpReward: m.xpReward,
        isCompleted: false,
        isLocked: false,
        order: m.order,
        classRange: m.classRange,
        tierId: m.tierId,
      }));

    return [
      {
        id: "c13-world-1",
        name: "Smart Helpers & Toys",
        description: "Explore smart machines, voice helpers, and colorful pattern loops!",
        icon: "🌱",
        color: "#10B981",
        bgColor: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
        totalMissions: w1Missions.length,
        completedMissions: 0,
        isLocked: false,
        theme: "foundations",
        classRange: [1, 3],
        tierId: "tier-1-3",
        missions: w1Missions,
      },
    ];
  }

  if (tier.id === "tier-4-5") {
    const w1Missions = Object.values(missionRegistry)
      .filter((m) => m.worldId === "c45-world-1")
      .map((m) => ({
        id: m.id,
        worldId: m.worldId,
        title: m.title,
        description: m.description,
        type: m.type,
        stars: m.stars,
        xpReward: m.xpReward,
        isCompleted: false,
        isLocked: false,
        order: m.order,
        classRange: m.classRange,
        tierId: m.tierId,
      }));

    return [
      {
        id: "c45-world-1",
        name: "Algorithms & Logic",
        description: "Master computer recipes, sequence loops, and environmental robotics!",
        icon: "🧭",
        color: "#3B82F6",
        bgColor: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
        totalMissions: w1Missions.length,
        completedMissions: 0,
        isLocked: false,
        theme: "algorithms",
        classRange: [4, 5],
        tierId: "tier-4-5",
        missions: w1Missions,
      },
    ];
  }

  if (tier.id === "tier-9-10") {
    const w1Missions = Object.values(missionRegistry)
      .filter((m) => m.worldId === "c910-world-1")
      .map((m) => ({
        id: m.id,
        worldId: m.worldId,
        title: m.title,
        description: m.description,
        type: m.type,
        stars: m.stars,
        xpReward: m.xpReward,
        isCompleted: false,
        isLocked: false,
        order: m.order,
        classRange: m.classRange,
        tierId: m.tierId,
      }));

    return [
      {
        id: "c910-world-1",
        name: "ML Paradigms & Datasets",
        description: "Supervised vs unsupervised learning, decision tree classifiers, and algorithmic fairness.",
        icon: "⚡",
        color: "#F59E0B",
        bgColor: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
        totalMissions: w1Missions.length,
        completedMissions: 0,
        isLocked: false,
        theme: "ml",
        classRange: [9, 10],
        tierId: "tier-9-10",
        missions: w1Missions,
      },
    ];
  }

  if (tier.id === "tier-11-12") {
    const w1Missions = Object.values(missionRegistry)
      .filter((m) => m.worldId === "c1112-world-1")
      .map((m) => ({
        id: m.id,
        worldId: m.worldId,
        title: m.title,
        description: m.description,
        type: m.type,
        stars: m.stars,
        xpReward: m.xpReward,
        isCompleted: false,
        isLocked: false,
        order: m.order,
        classRange: m.classRange,
        tierId: m.tierId,
      }));

    return [
      {
        id: "c1112-world-1",
        name: "Deep Learning Architectures",
        description: "Neural network backpropagation, hyperparameter optimization, and medical AI pipelines.",
        icon: "🔬",
        color: "#EC4899",
        bgColor: "linear-gradient(135deg, #FCE7F3, #FBCFE8)",
        totalMissions: w1Missions.length,
        completedMissions: 0,
        isLocked: false,
        theme: "deep-learning",
        classRange: [11, 12],
        tierId: "tier-11-12",
        missions: w1Missions,
      },
    ];
  }

  // Tier 6-8 (Middle School Default)
  // Build worlds 1 through 5 using existing missions
  const worldMeta = [
    { id: "world-1", name: "AI Basics", icon: "🤖", color: "#3B82F6", bgColor: "linear-gradient(135deg, #DBEAFE, #BFDBFE)", theme: "ai" as const, desc: "Start your AI journey! Learn what AI is and how it works with fun missions." },
    { id: "world-2", name: "Machine Learning", icon: "📊", color: "#7C3AED", bgColor: "linear-gradient(135deg, #EDE9FE, #DDD6FE)", theme: "ml" as const, desc: "Find patterns in data! Teach computers to learn from examples." },
    { id: "world-3", name: "Computer Vision", icon: "👁️", color: "#059669", bgColor: "linear-gradient(135deg, #D1FAE5, #A7F3D0)", theme: "cv" as const, desc: "Teach AI to see! Help computers understand images and videos." },
    { id: "world-4", name: "Natural Language Processing", icon: "💬", color: "#D97706", bgColor: "linear-gradient(135deg, #FEF3C7, #FDE68A)", theme: "nlp" as const, desc: "Help AI understand language! Explore how computers read and write." },
    { id: "world-5", name: "Responsible AI", icon: "🌍", color: "#EA580C", bgColor: "linear-gradient(135deg, #FED7AA, #FDBA74)", theme: "rai" as const, desc: "Build a better future! Learn to create AI that is fair, safe, and good." },
  ];

  return worldMeta.map((wm) => {
    const ms = Object.values(missionRegistry)
      .filter((m) => m.worldId === wm.id)
      .sort((a, b) => a.order - b.order)
      .map((m) => ({
        id: m.id,
        worldId: m.worldId,
        title: m.title,
        description: m.description,
        type: m.type,
        stars: m.stars,
        xpReward: m.xpReward,
        isCompleted: false,
        isLocked: false,
        order: m.order,
        classRange: m.classRange,
        tierId: m.tierId,
      }));

    return {
      id: wm.id,
      name: wm.name,
      description: wm.desc,
      icon: wm.icon,
      color: wm.color,
      bgColor: wm.bgColor,
      totalMissions: ms.length,
      completedMissions: 0,
      isLocked: false,
      theme: wm.theme,
      classRange: [6, 8] as [number, number],
      tierId: "tier-6-8" as const,
      missions: ms,
    };
  });
}

export function getNextMissionInClass(
  currentMissionId: string,
  classNum: number | null | undefined
): string | null {
  const missions = getMissionsForClass(classNum);
  const currentIdx = missions.findIndex((m) => m.id === currentMissionId);
  if (currentIdx >= 0 && currentIdx < missions.length - 1) {
    return missions[currentIdx + 1].id;
  }
  return null;
}

export function getWorldById(worldId: string, classNum?: number | null): World | null {
  // First check student's class worlds
  const studentWorlds = getWorldsForClass(classNum);
  const found = studentWorlds.find((w) => w.id === worldId);
  if (found) return found;

  // Search across all grade tiers
  for (const sampleClass of [2, 5, 7, 10, 12]) {
    const tierWorlds = getWorldsForClass(sampleClass);
    const match = tierWorlds.find((w) => w.id === worldId);
    if (match) return match;
  }
  return null;
}

