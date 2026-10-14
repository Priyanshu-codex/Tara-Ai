"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, ArrowRight, Users, Zap, Star, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent, challenges } from "@/lib/mockData";
import { getStoredUser } from "@/lib/auth";
import { getCompletedChallenges, recordChallengeCompletion } from "@/lib/progress/progressManager";
import type { Challenge, Student } from "@/lib/types";

const categories = ["All", "Environment", "Health", "Education", "Space", "Daily Life"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

const difficultyColors: Record<string, string> = {
  beginner: "#22C55E",
  intermediate: "#F59E0B",
  advanced: "#EF4444",
};

function ChallengeCard({ challenge, isDone, onStart }: { challenge: Challenge; isDone: boolean; onStart: (c: Challenge) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer group"
    >
      {/* Card header */}
      <div className="h-28 flex items-center justify-center relative" style={{ background: challenge.bgColor }}>
        <motion.div
          className="text-6xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {challenge.icon}
        </motion.div>
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-700 text-white" style={{ background: difficultyColors[challenge.difficulty] }}>
          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </div>
        {isDone && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-green-500 rounded-full flex items-center gap-1 text-white text-xs font-bold shadow">
            <CheckCircle2 size={12} /> Done
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-2">
          <div>
            <h3 className="font-800 text-slate-800 mb-1 group-hover:text-violet-700 transition-colors">{challenge.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-600 capitalize" style={{ background: challenge.color + "20", color: challenge.color }}>
              {challenge.category}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4 leading-relaxed line-clamp-2">{challenge.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Users size={12} />
            <span>{challenge.participants.toLocaleString()} participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-sm font-700 text-yellow-600">+{challenge.xpReward} XP</span>
          </div>
        </div>

        <motion.button
          onClick={() => onStart(challenge)}
          className="w-full py-2.5 rounded-xl text-sm font-700 text-white flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          style={{ background: isDone ? "#059669" : challenge.color }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {isDone ? "Review Challenge" : "Take Challenge"} <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

function ChallengeModal({ challenge, onClose, onClaimed }: { challenge: Challenge; onClose: () => void; onClaimed?: (challengeId: string) => void }) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const steps = [
    { title: "Understand the Problem", icon: "📖", desc: "Read and understand the challenge brief" },
    { title: "Research & Plan", icon: "🔍", desc: "Research solutions and create a plan" },
    { title: "Design Your Solution", icon: "✏️", desc: "Sketch your AI-powered solution" },
    { title: "Submit & Share", icon: "🚀", desc: "Share your solution with the community" },
  ];

  const handleClaim = async () => {
    setClaiming(true);
    try {
      recordChallengeCompletion(challenge.id, challenge.xpReward);
      await fetch("/api/challenges/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.id }),
      });
      setClaimed(true);
      if (onClaimed) onClaimed(challenge.id);
      setTimeout(() => {
        onClose();
      }, 900);
    } catch {
      recordChallengeCompletion(challenge.id, challenge.xpReward);
      setClaimed(true);
      if (onClaimed) onClaimed(challenge.id);
      setTimeout(() => {
        onClose();
      }, 900);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="h-32 rounded-t-3xl flex items-center justify-center relative" style={{ background: challenge.bgColor }}>
          <span className="text-6xl">{challenge.icon}</span>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-slate-600 hover:bg-white cursor-pointer">✕</button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-900 mb-1" style={{ color: "#172554" }}>{challenge.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-600 capitalize" style={{ background: challenge.color + "20", color: challenge.color }}>{challenge.category}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-600 text-white" style={{ background: difficultyColors[challenge.difficulty] }}>{challenge.difficulty}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-900 text-yellow-500">+{challenge.xpReward}</p>
              <p className="text-xs text-slate-400">XP Reward</p>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed mb-6">{challenge.description}</p>

          <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Users size={14} /> {challenge.participants.toLocaleString()} participants</span>
          </div>

          {/* Challenge steps */}
          <h3 className="font-800 text-slate-700 mb-3">Challenge Steps:</h3>
          <div className="space-y-2 mb-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  !started ? "border-slate-100" : i <= step ? "border-violet-300 bg-violet-50" : "border-slate-100"
                }`}
                animate={started && i === step ? { borderColor: challenge.color } : {}}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: started && i <= step ? challenge.color + "20" : "#f8fafc" }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-700 text-slate-700">{s.title}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
                {started && i <= step && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-green-500 font-bold">✓</motion.div>}
              </motion.div>
            ))}
          </div>

          {!started ? (
            <motion.button
              onClick={() => setStarted(true)}
              className="w-full py-4 rounded-2xl text-sm font-800 text-white shadow-lg cursor-pointer"
              style={{ background: challenge.color }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              🚀 Start This Challenge!
            </motion.button>
          ) : step < steps.length - 1 ? (
            <motion.button
              onClick={() => setStep(s => s + 1)}
              className="w-full py-4 rounded-2xl text-sm font-800 text-white shadow-lg btn-primary cursor-pointer"
              whileHover={{ scale: 1.04 }}
            >
              Next Step: {steps[step + 1].title} →
            </motion.button>
          ) : (
            <motion.div className="text-center">
              <div className="text-4xl mb-2">{claimed ? "🌟" : "🎉"}</div>
              <p className="font-800 text-green-700 mb-3">
                {claimed ? "Reward Claimed!" : "Challenge Completed!"}
              </p>
              <button
                onClick={handleClaim}
                disabled={claiming || claimed}
                className="btn-primary px-8 py-3 rounded-2xl text-sm font-700 cursor-pointer disabled:opacity-60"
              >
                {claiming ? "Saving..." : claimed ? "Claimed ✓" : `Claim +${challenge.xpReward} XP`}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ChallengesPage() {
  const [userState, setUserState] = useState(mockStudent);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const sync = () => {
      setCompletedIds(getCompletedChallenges());
      const u = getStoredUser();
      if (u && u.role === "student") {
        setUserState(prev => ({
          ...prev,
          ...(u as Student),
        }));
      }
    };
    sync();
    window.addEventListener("tara-progress-change", sync);
    window.addEventListener("tara-auth-change", sync);
    return () => {
      window.removeEventListener("tara-progress-change", sync);
      window.removeEventListener("tara-auth-change", sync);
    };
  }, []);

  const filtered = challenges.map(c => ({
    ...c,
    isCompleted: completedIds.includes(c.id) || c.isCompleted,
  })).filter(c => {
    const catMatch = activeCategory === "All" || c.category.toLowerCase().replace(/\s/g, "") === activeCategory.toLowerCase().replace(/\s/g, "");
    const diffMatch = activeDifficulty === "All" || c.difficulty === activeDifficulty.toLowerCase();
    const searchMatch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return catMatch && diffMatch && searchMatch;
  });

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={userState.name} xp={userState.xp} streak={userState.streak} level={userState.level} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-3">🌍</div>
          <h1 className="text-3xl font-900 mb-2" style={{ color: "#172554" }}>Real-World Challenges</h1>
          <p className="text-slate-500 text-lg">Solve real global problems with AI. Make a difference!</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
          {/* Search */}
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-200 shadow-sm mb-4 max-w-md">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-700 transition-all ${
                  activeCategory === cat
                    ? "bg-violet-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300"
                }`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Difficulty filters */}
          <div className="flex flex-wrap gap-2">
            {difficulties.map(diff => (
              <motion.button
                key={diff}
                onClick={() => setActiveDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-700 transition-all ${
                  activeDifficulty === diff
                    ? "text-white shadow-sm"
                    : "bg-white text-slate-500 border border-slate-200"
                }`}
                style={activeDifficulty === diff ? { background: diff === "All" ? "#6941F5" : difficultyColors[diff.toLowerCase()] || "#6941F5" } : {}}
                whileHover={{ scale: 1.04 }}
              >
                {diff}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Challenge grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 opacity-50">🔍</div>
            <p className="text-slate-400 font-600">No challenges found. Try adjusting filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => (
              <ChallengeCard
                key={c.id}
                challenge={c}
                isDone={Boolean(c.isCompleted)}
                onStart={setSelectedChallenge}
              />
            ))}
          </div>
        )}
      </main>

      {/* Challenge Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <ChallengeModal
            challenge={selectedChallenge}
            onClose={() => setSelectedChallenge(null)}
            onClaimed={(id) => {
              setCompletedIds(prev => prev.includes(id) ? prev : [...prev, id]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
