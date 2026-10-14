# 🌟 TARA — AI-Powered Smart Learning Platform

> **"Turn Curiosity Into Superpowers"**  
> TARA is an intelligent, gamified EdTech platform engineered to make school learning deeply engaging, exploratory, and adaptive. Combining fantasy world-building, interactive AI tutoring, live hands-on simulations, and teacher intelligence dashboards.

---

## ✨ Features Overview

### 🎓 1. Student Learning Worlds
- **Fantasy Floating Islands**: Interactive universe map featuring Math Kingdom, Code Galaxy, Bio Rainforest, and Quantum Realm.
- **Node-Based Progression**: Gamified learning pathways with locked/unlocked stages, level checkpoints, and boss challenges.
- **Gamified Rewards**: Dynamic XP counters, streak trackers, animated badges, and trophy showcases.

### 🤖 2. Interactive AI Tutor & Sandbox
- **Socratic Dialogue**: An empathetic AI learning companion that guides students with step-by-step hints and explanations rather than giving away answers.
- **Voice Mode Simulation**: Auditory learning toggle with real-time speech indicators.
- **AI Lab Sandbox**: Hands-on sandbox for prompt experiments, mini code blocks, and robotics logic.
- **Gamified Missions & Daily Quizzes**: Playable pattern recognition mini-game (`/dashboard/mission/spot-the-pattern`) and adaptive daily quizzes.

### 👩‍🏫 3. Teacher Command Center
- **Classroom Intelligence**: Real-time metrics on classroom engagement, student progress curves, and completion rates.
- **Diagnostic Insights**: Automated flagging of struggling students and common misconceptions with recommended interventions.
- **Curriculum & Assignment Management**: Quick creation, scheduling, and tracking of missions and assignments.
- **Student Roster Management**: In-depth individual student profiles with mastery diagnostics and behavioral notes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS with tailored design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for micro-interactions and transitions
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Google Fonts via `next/font/google` (`Nunito` + `Inter`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17.0 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Priyanshu-codex/Tara-Ai.git
   cd Tara-Ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```text
tara/
├── public/
│   └── images/                 # Custom visual assets & character illustrations
├── src/
│   ├── app/
│   │   ├── page.tsx            # Main Hero Landing Page
│   │   ├── layout.tsx          # Root Layout & Typography
│   │   ├── globals.css         # Design system tokens & keyframe animations
│   │   ├── about/              # Mission & pedagogy
│   │   ├── explore/            # Universe & world map
│   │   ├── learn/              # Curriculum catalog
│   │   ├── challenges/         # XP leaderboards & daily quests
│   │   ├── achievements/       # Trophies & badge showcase
│   │   ├── progress/           # Skill analytics & radar
│   │   ├── profile/            # Student avatar & profile editor
│   │   ├── auth/
│   │   │   ├── login/          # Role-based login (Student / Teacher / Parent)
│   │   │   └── signup/         # Interactive onboarding flow
│   │   ├── dashboard/
│   │   │   ├── page.tsx        # Student Hub
│   │   │   ├── ai-tutor/       # Conversational AI Tutor
│   │   │   ├── ai-lab/         # Interactive experimentation lab
│   │   │   ├── quiz/           # Daily quiz flow
│   │   │   ├── mission/        # Gamified pattern recognition missions
│   │   │   └── worlds/         # Floating learning islands & paths
│   │   └── teacher/
│   │       ├── page.tsx        # Teacher Portal overview
│   │       ├── dashboard/      # Classroom analytics
│   │       ├── analytics/      # Concept mastery & interventions
│   │       ├── classes/        # Roster & section manager
│   │       ├── assignments/    # Homework & quest allocator
│   │       └── students/       # Student diagnostic profiles
│   ├── components/             # Reusable UI & Navigation components
│   └── lib/                    # Types, mock data, and utilities
└── tsconfig.json
```

---

## 🔒 Security & Privacy

TARA is designed with child safety at its foundation:
- No tracking or commercial ad targeting
- Child-safe Socratic AI guardrails
- Role-based access controls for Students, Teachers, and Parents

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
