// TARA Platform – Mock Data

import type {
  Student, Administrator, World, Badge, LearningActivity,
  Achievement, Challenge, WeeklyData, SubjectPerformance,
  StudentProgress
} from "./types";

// ── Mock Student ──────────────────────────────────────────────────────────────
export const mockStudent: Student = {
  id: "student-1",
  name: "Aarav Sharma",
  email: "aarav@tara.edu",
  role: "student",
  class: "Class 8",
  xp: 320,
  level: 5,
  levelName: "AI Explorer",
  streak: 12,
  missionsCompleted: 25,
  globalRank: 42,
  weeklyGoal: 5,
  weeklyProgress: 3,
  badges: [
    {
      id: "b1", name: "First Steps", description: "Completed your first mission",
      icon: "🚀", color: "#6941F5", xpEarned: 50, earnedAt: "2026-10-01", category: "learning"
    },
    {
      id: "b2", name: "Pattern Pro", description: "Solved 5 pattern missions",
      icon: "🔮", color: "#8B5CF6", xpEarned: 100, earnedAt: "2026-10-05", category: "learning"
    },
    {
      id: "b3", name: "AI Creator", description: "Built your first AI model",
      icon: "🤖", color: "#22C55E", xpEarned: 150, earnedAt: "2026-10-08", category: "achievement"
    },
    {
      id: "b4", name: "Challenge Master", description: "Completed 10 real-world challenges",
      icon: "⚡", color: "#FBBF24", xpEarned: 200, earnedAt: "2026-10-10", category: "achievement"
    },
    {
      id: "b5", name: "Top Learner", description: "Ranked in top 5% globally",
      icon: "🏆", color: "#F59E0B", xpEarned: 300, earnedAt: "2026-10-12", category: "special"
    },
  ],
  worldProgress: [
    { worldId: "world-1", completed: 4, total: 6 },
    { worldId: "world-2", completed: 3, total: 5 },
    { worldId: "world-3", completed: 2, total: 6 },
    { worldId: "world-4", completed: 0, total: 5 },
    { worldId: "world-5", completed: 0, total: 5 },
  ],
};

// ── Mock Administrator ────────────────────────────────────────────────────────
export const mockAdmin: Administrator = {
  id: "admin-1",
  name: "Platform Administrator",
  email: "admin@tara.edu",
  role: "admin",
  permissions: ["manage_content", "view_analytics", "manage_curriculum", "system_settings"],
};

// ── Learning Worlds ───────────────────────────────────────────────────────────
export const worlds: World[] = [
  {
    id: "world-1",
    name: "AI Basics",
    description: "Start your AI journey! Learn what AI is and how it works with fun missions.",
    icon: "🤖",
    color: "#3B82F6",
    bgColor: "linear-gradient(135deg, #DBEAFE, #BFDBFE)",
    totalMissions: 6,
    completedMissions: 4,
    isLocked: false,
    theme: "ai",
    missions: [
      { id: "m1-1", worldId: "world-1", title: "What is AI?", description: "Discover what Artificial Intelligence is!", type: "video", stars: 3, xpReward: 50, isCompleted: true, isLocked: false, order: 1 },
      { id: "m1-2", worldId: "world-1", title: "Spot the Pattern", description: "Help TARA find the pattern in the sequence!", type: "pattern", stars: 3, xpReward: 80, isCompleted: true, isLocked: false, order: 2 },
      { id: "m1-3", worldId: "world-1", title: "Train a Mini AI", description: "Create your first simple AI model", type: "experiment", stars: 2, xpReward: 100, isCompleted: true, isLocked: false, order: 3 },
      { id: "m1-4", worldId: "world-1", title: "AI in Real Life", description: "Find AI around you every day", type: "quiz", stars: 3, xpReward: 60, isCompleted: true, isLocked: false, order: 4 },
      { id: "m1-5", worldId: "world-1", title: "AI Myths vs Facts", description: "Bust common AI myths!", type: "quiz", stars: 0, xpReward: 70, isCompleted: false, isLocked: false, order: 5 },
      { id: "m1-6", worldId: "world-1", title: "AI Superhero", description: "Design an AI that helps society", type: "challenge", stars: 0, xpReward: 120, isCompleted: false, isLocked: true, order: 6 },
    ],
  },
  {
    id: "world-2",
    name: "Machine Learning",
    description: "Find patterns in data! Teach computers to learn from examples.",
    icon: "📊",
    color: "#7C3AED",
    bgColor: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    totalMissions: 5,
    completedMissions: 3,
    isLocked: false,
    theme: "ml",
    missions: [
      { id: "m2-1", worldId: "world-2", title: "What is Machine Learning?", description: "Understand how machines learn!", type: "video", stars: 3, xpReward: 50, isCompleted: true, isLocked: false, order: 1 },
      { id: "m2-2", worldId: "world-2", title: "Training Data Adventure", description: "Collect and label training data", type: "experiment", stars: 3, xpReward: 80, isCompleted: true, isLocked: false, order: 2 },
      { id: "m2-3", worldId: "world-2", title: "The Learning Loop", description: "See how training improves accuracy", type: "pattern", stars: 2, xpReward: 90, isCompleted: true, isLocked: false, order: 3 },
      { id: "m2-4", worldId: "world-2", title: "Predict the Future", description: "Use ML to make predictions", type: "quiz", stars: 0, xpReward: 100, isCompleted: false, isLocked: false, order: 4 },
      { id: "m2-5", worldId: "world-2", title: "Build Your Classifier", description: "Create your own ML classifier", type: "experiment", stars: 0, xpReward: 150, isCompleted: false, isLocked: true, order: 5 },
    ],
  },
  {
    id: "world-3",
    name: "Computer Vision",
    description: "Teach AI to see! Help computers understand images and videos.",
    icon: "👁️",
    color: "#059669",
    bgColor: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
    totalMissions: 6,
    completedMissions: 2,
    isLocked: false,
    theme: "cv",
    missions: [
      { id: "m3-1", worldId: "world-3", title: "How Computers See", description: "Understand pixels and images", type: "video", stars: 3, xpReward: 50, isCompleted: true, isLocked: false, order: 1 },
      { id: "m3-2", worldId: "world-3", title: "Spot the Cat!", description: "Train AI to recognize animals", type: "experiment", stars: 3, xpReward: 100, isCompleted: true, isLocked: false, order: 2 },
      { id: "m3-3", worldId: "world-3", title: "Object Detection Quest", description: "Find objects in images", type: "pattern", stars: 0, xpReward: 90, isCompleted: false, isLocked: false, order: 3 },
      { id: "m3-4", worldId: "world-3", title: "Face Recognition Challenge", description: "Detect and identify faces", type: "experiment", stars: 0, xpReward: 120, isCompleted: false, isLocked: true, order: 4 },
      { id: "m3-5", worldId: "world-3", title: "Real World Vision", description: "Apply CV to real problems", type: "challenge", stars: 0, xpReward: 150, isCompleted: false, isLocked: true, order: 5 },
      { id: "m3-6", worldId: "world-3", title: "Vision Master", description: "Advanced CV techniques", type: "quiz", stars: 0, xpReward: 200, isCompleted: false, isLocked: true, order: 6 },
    ],
  },
  {
    id: "world-4",
    name: "Natural Language Processing",
    description: "Help AI understand language! Explore how computers read and write.",
    icon: "💬",
    color: "#D97706",
    bgColor: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
    totalMissions: 5,
    completedMissions: 0,
    isLocked: true,
    theme: "nlp",
    missions: [
      { id: "m4-1", worldId: "world-4", title: "Words and Meaning", description: "How AI understands text", type: "video", stars: 0, xpReward: 50, isCompleted: false, isLocked: true, order: 1 },
      { id: "m4-2", worldId: "world-4", title: "Sentiment Detector", description: "Detect if text is happy or sad", type: "pattern", stars: 0, xpReward: 80, isCompleted: false, isLocked: true, order: 2 },
      { id: "m4-3", worldId: "world-4", title: "Chatbot Builder", description: "Create your own simple chatbot", type: "experiment", stars: 0, xpReward: 150, isCompleted: false, isLocked: true, order: 3 },
      { id: "m4-4", worldId: "world-4", title: "Language Translator", description: "Translate text with AI", type: "challenge", stars: 0, xpReward: 120, isCompleted: false, isLocked: true, order: 4 },
      { id: "m4-5", worldId: "world-4", title: "NLP Master", description: "Combine all language skills", type: "quiz", stars: 0, xpReward: 200, isCompleted: false, isLocked: true, order: 5 },
    ],
  },
  {
    id: "world-5",
    name: "Responsible AI",
    description: "Build a better future! Learn to create AI that is fair, safe, and good for everyone.",
    icon: "🌍",
    color: "#EA580C",
    bgColor: "linear-gradient(135deg, #FED7AA, #FDBA74)",
    totalMissions: 5,
    completedMissions: 0,
    isLocked: true,
    theme: "rai",
    missions: [
      { id: "m5-1", worldId: "world-5", title: "AI Ethics 101", description: "What makes AI ethical?", type: "video", stars: 0, xpReward: 60, isCompleted: false, isLocked: true, order: 1 },
      { id: "m5-2", worldId: "world-5", title: "Bias Busters", description: "Find and fix AI bias", type: "pattern", stars: 0, xpReward: 100, isCompleted: false, isLocked: true, order: 2 },
      { id: "m5-3", worldId: "world-5", title: "Privacy Protectors", description: "Keep data private and safe", type: "quiz", stars: 0, xpReward: 80, isCompleted: false, isLocked: true, order: 3 },
      { id: "m5-4", worldId: "world-5", title: "AI for Good", description: "Use AI to help society", type: "challenge", stars: 0, xpReward: 150, isCompleted: false, isLocked: true, order: 4 },
      { id: "m5-5", worldId: "world-5", title: "Future Builder", description: "Design your responsible AI solution", type: "experiment", stars: 0, xpReward: 250, isCompleted: false, isLocked: true, order: 5 },
    ],
  },
];

// ── Learning Activities ───────────────────────────────────────────────────────
export const learningActivities: LearningActivity[] = [
  { id: "la1", type: "lesson", title: "AI Basics", subject: "Artificial Intelligence", duration: 15, xp: 50, icon: "🤖", color: "#6941F5", isRecommended: true },
  { id: "la2", type: "quiz", title: "Daily Quiz", subject: "Machine Learning", duration: 5, xp: 30, icon: "📝", color: "#22C55E", isRecommended: true },
  { id: "la3", type: "game", title: "Real World Challenge", subject: "Problem Solving", duration: 20, xp: 80, icon: "🌍", color: "#FBBF24", isRecommended: true },
  { id: "la4", type: "lesson", title: "Earn Certificates", subject: "Achievements", duration: 10, xp: 100, icon: "🏆", color: "#F59E0B", isRecommended: false },
];

// ── Recent Achievements ───────────────────────────────────────────────────────
export const recentAchievements: Achievement[] = [
  { id: "a1", title: "Completed Linear Equations", xp: 80, date: "Today", icon: "📐" },
  { id: "a2", title: "Scored 90% in Science Quiz", xp: 30, date: "Yesterday", icon: "🧪" },
  { id: "a3", title: "Completed 5 Daily Challenges", xp: 100, date: "2 days ago", icon: "⚡" },
];

// ── Challenges ────────────────────────────────────────────────────────────────
export const challenges: Challenge[] = [
  {
    id: "ch1", title: "Clean the Ocean",
    category: "environment",
    description: "Design an AI system to detect and remove plastic pollution from oceans using drones and computer vision.",
    difficulty: "intermediate",
    xpReward: 200, participants: 1247,
    icon: "🌊", color: "#0EA5E9", bgColor: "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
  },
  {
    id: "ch2", title: "Detect Fake News",
    category: "education",
    description: "Build a text classifier that identifies misinformation and fake news articles using NLP techniques.",
    difficulty: "advanced",
    xpReward: 300, participants: 892,
    icon: "📰", color: "#7C3AED", bgColor: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
  },
  {
    id: "ch3", title: "Smart Farming",
    category: "environment",
    description: "Create an AI that helps farmers predict crop diseases and optimize irrigation using satellite data.",
    difficulty: "intermediate",
    xpReward: 250, participants: 634,
    icon: "🌾", color: "#16A34A", bgColor: "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
  },
  {
    id: "ch4", title: "AI Health Monitor",
    category: "health",
    description: "Design a wearable AI system that monitors vital signs and alerts users to potential health risks.",
    difficulty: "advanced",
    xpReward: 350, participants: 421,
    icon: "❤️", color: "#DC2626", bgColor: "linear-gradient(135deg, #FEE2E2, #FECACA)",
  },
  {
    id: "ch5", title: "Space Explorer AI",
    category: "space",
    description: "Program a virtual Mars rover to navigate terrain and collect scientific data using reinforcement learning.",
    difficulty: "advanced",
    xpReward: 400, participants: 318,
    icon: "🚀", color: "#9333EA", bgColor: "linear-gradient(135deg, #F3E8FF, #E9D5FF)",
  },
  {
    id: "ch6", title: "Traffic Flow Optimizer",
    category: "daily",
    description: "Use AI to reduce traffic congestion in cities by optimizing traffic light timing based on real-time data.",
    difficulty: "beginner",
    xpReward: 150, participants: 2104,
    icon: "🚦", color: "#D97706", bgColor: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
  },
];

// ── Weekly Chart Data ─────────────────────────────────────────────────────────
export const weeklyData: WeeklyData[] = [
  { day: "Mon", xp: 45, minutes: 30 },
  { day: "Tue", xp: 80, minutes: 55 },
  { day: "Wed", xp: 60, minutes: 40 },
  { day: "Thu", xp: 100, minutes: 70 },
  { day: "Fri", xp: 75, minutes: 50 },
  { day: "Sat", xp: 90, minutes: 65 },
  { day: "Sun", xp: 40, minutes: 25 },
];

export const monthlyData: WeeklyData[] = [
  { day: "W1", xp: 280, minutes: 180 },
  { day: "W2", xp: 350, minutes: 220 },
  { day: "W3", xp: 420, minutes: 280 },
  { day: "W4", xp: 390, minutes: 255 },
];

// ── Subject Performance ───────────────────────────────────────────────────────
export const subjectPerformance: SubjectPerformance[] = [
  { subject: "Mathematics", score: 88, color: "#6941F5" },
  { subject: "Science", score: 72, color: "#22C55E" },
  { subject: "English", score: 68, color: "#3B82F6" },
  { subject: "Social Science", score: 60, color: "#F59E0B" },
];

// ── Student Progress & Leaderboard Data ─────────────────────────────────────────
export const studentProgressData: StudentProgress[] = [
  { id: "s1", name: "Aarav Sharma", level: 5, xp: 450, completion: 92, avatar: "👦" },
  { id: "s2", name: "Diya Patel", level: 4, xp: 380, completion: 78, avatar: "👧" },
  { id: "s3", name: "Rohan Verma", level: 4, xp: 360, completion: 74, avatar: "👦" },
  { id: "s4", name: "Ananya Singh", level: 3, xp: 280, completion: 60, avatar: "👧" },
  { id: "s5", name: "Karan Mehta", level: 3, xp: 240, completion: 55, avatar: "👦" },
  { id: "s6", name: "Priya Nair", level: 5, xp: 420, completion: 88, avatar: "👧" },
  { id: "s7", name: "Dev Gupta", level: 2, xp: 160, completion: 40, avatar: "👦" },
  { id: "s8", name: "Sneha Rao", level: 4, xp: 340, completion: 72, avatar: "👧" },
];

export const conceptMasteryData = [
  { concept: "AI Basics", mastery: 92, color: "#6941F5" },
  { concept: "Machine Learning", mastery: 76, color: "#7C3AED" },
  { concept: "Computer Vision", mastery: 68, color: "#059669" },
  { concept: "NLP", mastery: 60, color: "#D97706" },
  { concept: "Responsible AI", mastery: 80, color: "#EA580C" },
];

// ── AI Tutor Responses ────────────────────────────────────────────────────────
export const tutorResponses: Record<string, string> = {
  "linear equation": `Great question! 🎉 A linear equation is an equation in the form **ax + b = 0**, where a and b are constants and x is the variable.

**Example:**
Solve: 2x + 3 = 11
- Step 1: Subtract 3 from both sides → 2x = 8
- Step 2: Divide by 2 → x = 4 ✅

Think of it like a balance scale — whatever you do to one side, you must do to the other!`,

  "machine learning": `Machine Learning is amazing! 🤖 It's a way of teaching computers to learn from examples, rather than programming every single rule.

**Simple Analogy:**
Instead of telling a computer "a cat has pointy ears, fur, and whiskers," you show it 1,000 cat photos and it figures out the pattern on its own!

**Three types of ML:**
1. **Supervised Learning** – Learn from labeled examples
2. **Unsupervised Learning** – Find hidden patterns
3. **Reinforcement Learning** – Learn by trial and error (like video games!)`,

  "photosynthesis": `Photosynthesis is how plants make their own food! 🌱

**The Formula:**
6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂

**In Simple Terms:**
Plants take in:
- Carbon dioxide (CO₂) from the air
- Water (H₂O) from the soil  
- Sunlight ☀️

And produce:
- Glucose (sugar for energy)
- Oxygen (which we breathe!)`,

  "default": `That's an interesting question! Let me help you understand it step by step. 

I'm TARA, your AI learning assistant! I can explain concepts, give examples, show visuals, and create practice questions for you.

Try asking me about:
- **Math**: Linear equations, fractions, geometry
- **Science**: Photosynthesis, gravity, chemical reactions
- **AI & Tech**: Machine learning, computer vision, coding
- **History & Geography**: World events, maps, cultures

What would you like to explore? 🚀`,
};

export const suggestedQuestions = [
  "Can you explain linear equations with an example?",
  "What is machine learning and how does it work?",
  "How does photosynthesis work?",
  "What are the laws of motion?",
  "Explain DNA and genetics",
  "How does the internet work?",
];

// ── AI Lab Sample Data ────────────────────────────────────────────────────────
export const sampleCatImages = [
  { id: "cat1", emoji: "🐈", label: "Cat", color: "#FEF3C7" },
  { id: "cat2", emoji: "🐱", label: "Cat", color: "#FEE2E2" },
  { id: "cat3", emoji: "😸", label: "Cat", color: "#DCFCE7" },
];

export const sampleDogImages = [
  { id: "dog1", emoji: "🐕", label: "Dog", color: "#DBEAFE" },
  { id: "dog2", emoji: "🐶", label: "Dog", color: "#EDE9FE" },
  { id: "dog3", emoji: "🦮", label: "Dog", color: "#F0FDF4" },
];
