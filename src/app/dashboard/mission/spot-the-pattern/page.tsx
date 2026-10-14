"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lightbulb, Star, CheckCircle2, RotateCcw, Trophy, Zap, Bot, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent } from "@/lib/mockData";
import { useAira } from "@/components/aira/AiraContext";
import Image from "next/image";

type Shape = { color: string; shape: "circle" | "square" | "triangle" | "star"; label: string };
type Option = Shape & { id: string };

const sequence: Shape[] = [
  { color: "red", shape: "circle", label: "Red Circle" },
  { color: "blue", shape: "square", label: "Blue Square" },
  { color: "green", shape: "triangle", label: "Green Triangle" },
  { color: "red", shape: "circle", label: "Red Circle" },
  { color: "blue", shape: "square", label: "Blue Square" },
];

const options: Option[] = [
  { id: "a", color: "green", shape: "triangle", label: "Green Triangle" },
  { id: "b", color: "red", shape: "circle", label: "Red Circle" },
  { id: "c", color: "yellow", shape: "star", label: "Yellow Star" },
  { id: "d", color: "blue", shape: "square", label: "Blue Square" },
];

const correctAnswer = "a"; // pattern repeats: red circle, blue square, green triangle
const correctId = "a";

function ShapeIcon({ shape, color, size = 56 }: { shape: string; color: string; size?: number }) {
  const colors: Record<string, string> = {
    red: "#EF4444", blue: "#3B82F6", green: "#22C55E", yellow: "#FBBF24",
  };
  const fill = colors[color] || color;

  if (shape === "circle") return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill={fill} />
    </svg>
  );
  if (shape === "square") return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="10" y="10" width="80" height="80" rx="10" fill={fill} />
    </svg>
  );
  if (shape === "triangle") return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,5 95,90 5,90" fill={fill} />
    </svg>
  );
  if (shape === "star") return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={fill} />
    </svg>
  );
  return null;
}

export default function SpotThePatternMission() {
  const student = mockStudent;
  const { openAiraWithMission } = useAira();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const isCorrect = selected === correctId;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (selected === correctId) {
      setXpGained(80);
      setTimeout(() => setShowReward(true), 800);
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setSubmitted(false);
    setShowHint(false);
    setShowReward(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <Link href="/dashboard/worlds/world-1" className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to World
        </Link>

        {/* Mission Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-2xl">🔮</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-900" style={{ color: "#172554" }}>Mission 2: Spot the Pattern</h1>
              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-700">Level 2</span>
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => <Star key={i} size={14} className={i < 2 ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />)}
              </div>
            </div>
            <p className="text-sm text-slate-500">Help TARA find the correct pattern and complete the sequence!</p>
          </div>
          <div className="hidden sm:flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-sm font-700 text-yellow-700">+80 XP</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main game area */}
          <div className="lg:col-span-2">
            {/* AI Robot hint */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-3xl p-5 border border-violet-100 mb-5 flex items-start gap-4"
            >
              <div className="w-20 h-20 flex-shrink-0 relative">
                <Image src="/images/robot.jpg" alt="TARA Robot" width={80} height={80} className="object-contain" />
              </div>
              <div>
                <p className="text-sm font-700 text-violet-700 mb-1">🤖 TARA says:</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  <strong>Look carefully!</strong> What comes next in the sequence?<br />
                  I can see there&apos;s a pattern here... can you spot it? 🧩
                </p>
              </div>
            </motion.div>

            {/* Sequence display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-5"
            >
              <p className="text-sm font-700 text-slate-500 mb-4 uppercase tracking-wide">The Pattern Sequence:</p>
              <div className="flex items-center gap-3 flex-wrap justify-center">
                {sequence.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                    className="flex flex-col items-center gap-1"
                  >
                    <ShapeIcon shape={item.shape} color={item.color} size={56} />
                    <p className="text-xs text-slate-400 hidden sm:block">{item.label}</p>
                  </motion.div>
                ))}

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-2xl text-violet-400 font-900"
                >
                  →
                </motion.div>

                {/* Question mark */}
                <motion.div
                  className="w-14 h-14 rounded-2xl border-3 border-dashed border-violet-300 flex items-center justify-center"
                  animate={{ borderColor: ["#a78bfa", "#6941F5", "#a78bfa"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-2xl font-900 text-violet-400">?</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Answer options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-5"
            >
              <p className="text-sm font-700 text-slate-500 mb-4 uppercase tracking-wide">Select the correct answer:</p>
              <div className="grid grid-cols-4 gap-4">
                {options.map((opt, i) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    onClick={() => !submitted && setSelected(opt.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      submitted
                        ? opt.id === correctId
                          ? "border-green-400 bg-green-50"
                          : opt.id === selected
                            ? "border-red-400 bg-red-50"
                            : "border-slate-200 opacity-50"
                        : selected === opt.id
                          ? "border-violet-500 bg-violet-50 shadow-lg"
                          : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                    }`}
                    whileHover={!submitted ? { scale: 1.08, y: -4 } : {}}
                    whileTap={!submitted ? { scale: 0.95 } : {}}
                  >
                    <ShapeIcon shape={opt.shape} color={opt.color} size={48} />
                    {submitted && (
                      <div>
                        {opt.id === correctId
                          ? <CheckCircle2 size={18} className="text-green-500" />
                          : opt.id === selected
                            ? <span className="text-red-500 text-lg">✗</span>
                            : null}
                      </div>
                    )}
                    <span className="text-xs text-slate-500 font-600 hidden sm:block">{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3"
                >
                  <Lightbulb size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-700 text-amber-700 text-sm mb-1">💡 Hint!</p>
                    <p className="text-sm text-amber-600">
                      Look at the first three items: Red Circle → Blue Square → Green Triangle.<br />
                      This pattern <strong>repeats!</strong> So after Blue Square, the next should be...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feedback */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl p-5 mb-4 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{isCorrect ? "🎉" : "😅"}</span>
                    <div>
                      <p className={`font-800 mb-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                        {isCorrect ? "Excellent! You got it right!" : "Not quite! Try again!"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {isCorrect
                          ? "The pattern was: Red Circle → Blue Square → Green Triangle (repeating). After Blue Square comes Green Triangle! 🌟"
                          : "The sequence repeats: Red Circle → Blue Square → Green Triangle. So after Blue Square, the next in the pattern is Green Triangle!"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {!submitted ? (
                <>
                  <motion.button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 px-5 py-3 border-2 border-amber-200 text-amber-700 bg-amber-50 rounded-xl text-sm font-700"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Lightbulb size={16} /> Hint (-10 XP)
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!selected}
                    className={`flex-1 py-3 rounded-xl text-sm font-800 text-white shadow-md ${!selected ? "opacity-50 cursor-not-allowed bg-slate-400" : "btn-primary"}`}
                    whileHover={selected ? { scale: 1.04 } : {}}
                    whileTap={selected ? { scale: 0.97 } : {}}
                  >
                    Submit Answer
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-5 py-3 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-700"
                    whileHover={{ scale: 1.04 }}
                  >
                    <RotateCcw size={16} /> Try Again
                  </motion.button>
                  {isCorrect && (
                    <Link href="/dashboard/worlds/world-1" className="flex-1">
                      <motion.button
                        className="w-full py-3 rounded-xl text-sm font-800 btn-primary flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.04 }}
                      >
                        Next Mission →
                      </motion.button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Mission info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-800 mb-4">Mission Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">World</span>
                  <span className="font-700 text-blue-600">AI Basics 🤖</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Mission Type</span>
                  <span className="font-700 text-slate-700">Pattern Recognition</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Difficulty</span>
                  <span className="font-700 text-green-600">Easy</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Max Reward</span>
                  <span className="font-700 text-violet-600">+80 XP</span>
                </div>
              </div>
            </motion.div>

            {/* Tips from TARA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-violet-50 rounded-3xl p-5 border border-violet-100"
            >
              <h3 className="font-800 text-violet-800 mb-3">🤖 TARA&apos;s Tips</h3>
              <ul className="space-y-2">
                {[
                  "Look for repeating groups in the sequence",
                  "Check color patterns separately from shapes",
                  "Count how many items before repetition",
                ].map((tip, i) => (
                  <li key={i} className="text-xs text-violet-700 flex items-start gap-2">
                    <span className="text-violet-400 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Ask Aira Learning Buddy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bot size={19} className="text-white" />
                </div>
                <div>
                  <h4 className="font-800 text-sm">Need Help? Ask Aira</h4>
                  <p className="text-[11px] text-violet-200">Your AI Learning Buddy</p>
                </div>
              </div>
              <p className="text-xs text-violet-100 mb-3.5 leading-relaxed">
                Stuck on this sequence? Aira gives progressive clues to help you figure it out step-by-step!
              </p>
              <motion.button
                onClick={() =>
                  openAiraWithMission({
                    worldId: "world-1",
                    worldName: "AI Basics",
                    missionId: "m1-2",
                    missionTitle: "Spot the Pattern",
                    instructions:
                      "Find the repeating shape and color pattern in the sequence: Red Circle, Blue Square, Green Triangle...",
                  })
                }
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl bg-white text-violet-700 font-800 text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={13} className="text-violet-600" /> Ask Aira for Hints
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>

      {/* XP Reward Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <motion.div
                className="text-7xl mb-4"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🏆
              </motion.div>
              <h2 className="text-2xl font-900 text-slate-800 mb-2">Mission Complete!</h2>
              <p className="text-slate-500 mb-6">You spotted the pattern like a pro!</p>

              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <motion.p
                    className="text-3xl font-900 text-violet-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    +{xpGained}
                  </motion.p>
                  <p className="text-xs text-slate-400">XP Earned</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl">⭐⭐⭐</p>
                  <p className="text-xs text-slate-400">Stars</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/dashboard/worlds/world-1" className="flex-1">
                  <motion.button
                    className="w-full py-3 btn-primary rounded-2xl font-700 text-sm"
                    whileHover={{ scale: 1.04 }}
                  >
                    Next Mission →
                  </motion.button>
                </Link>
                <motion.button
                  onClick={() => setShowReward(false)}
                  className="px-4 py-3 border-2 border-slate-200 text-slate-600 rounded-2xl font-700 text-sm"
                  whileHover={{ scale: 1.04 }}
                >
                  Review
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
