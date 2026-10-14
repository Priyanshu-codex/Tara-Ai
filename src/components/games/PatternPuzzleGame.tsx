"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import type { PatternItem } from "@/lib/missions/missionRegistry";

export interface PatternRound {
  sequence: (PatternItem | { id: string; label: string; text?: string; color?: string; shape?: string; icon?: string })[];
  options: (PatternItem & { id: string; icon?: string })[];
  correctId: string;
  ruleExplanation?: string;
  explanation?: string;
  hint: string;
  difficulty?: "Warm-Up" | "Challenge" | "Master";
}

export interface PatternPuzzleConfig {
  rounds: PatternRound[];
  title?: string;
  objective?: string;
}

interface PatternPuzzleGameProps {
  config: PatternPuzzleConfig;
  onComplete: (score: number) => void;
  onAskTara?: (prompt: string) => void;
}

// Render geometric shape or icon
function PatternItemVisual({
  item,
  size = 46,
}: {
  item: { shape?: string; color?: string; label: string; icon?: string; text?: string };
  size?: number;
}) {
  const colorMap: Record<string, string> = {
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#22C55E",
    yellow: "#FBBF24",
    purple: "#8B5CF6",
    orange: "#F97316",
    cyan: "#06B6D4",
    pink: "#EC4899",
  };
  const fill = (item.color && colorMap[item.color]) || item.color || "#6941F5";

  if (item.icon) {
    return <span className="text-3xl select-none">{item.icon}</span>;
  }

  if (item.shape === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill={fill} />
      </svg>
    );
  }
  if (item.shape === "square") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" rx="14" fill={fill} />
      </svg>
    );
  }
  if (item.shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,8 94,88 6,88" fill={fill} />
      </svg>
    );
  }
  if (item.shape === "star") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,5 62,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 38,35" fill={fill} />
      </svg>
    );
  }
  if (item.shape === "hexagon") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" fill={fill} />
      </svg>
    );
  }

  // Fallback text or diamond
  if (item.text) {
    return <span className="text-2xl font-black text-slate-800">{item.text}</span>;
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,8 90,50 50,92 10,50" fill={fill} />
    </svg>
  );
}

export default function PatternPuzzleGame({
  config,
  onComplete,
  onAskTara,
}: PatternPuzzleGameProps) {
  const rounds = config.rounds || [];
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [score, setScore] = useState<number>(100);
  const [completedRounds, setCompletedRounds] = useState<number[]>([]);
  const [allFinished, setAllFinished] = useState<boolean>(false);

  const round = rounds[currentRoundIdx];
  const isCorrect = selectedOptionId === round?.correctId;

  const handleSubmitChoice = () => {
    if (!selectedOptionId || !round) return;
    setIsSubmitted(true);
    setAttempts((a) => a + 1);

    if (isCorrect) {
      if (!completedRounds.includes(currentRoundIdx)) {
        setCompletedRounds((prev) => [...prev, currentRoundIdx]);
      }

      if (currentRoundIdx < rounds.length - 1) {
        setTimeout(() => {
          setCurrentRoundIdx((idx) => idx + 1);
          setSelectedOptionId(null);
          setIsSubmitted(false);
          setShowHint(false);
        }, 1400);
      } else {
        setTimeout(() => {
          setAllFinished(true);
        }, 1200);
      }
    } else {
      // Deduct small score for retry
      setScore((s) => Math.max(60, s - 10));
    }
  };

  const handleRetryRound = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setShowHint(false);
  };

  if (!round) {
    return <div className="p-6 text-center text-slate-500">No pattern rounds configured.</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-800 uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
              Interactive Pattern Puzzle
            </span>
            <span className="text-xs font-700 text-slate-400">
              Level {currentRoundIdx + 1} of {rounds.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-900 text-slate-800">
            {config.title || "Crack the Pattern Code"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {config.objective || "Analyze the sequence, identify the invariant rule, and place the missing piece!"}
          </p>
        </div>

        {/* Level Indicator Pills */}
        <div className="flex items-center gap-2">
          {rounds.map((_, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-800 transition-all ${
                i === currentRoundIdx
                  ? "bg-violet-600 text-white shadow-xs scale-110"
                  : completedRounds.includes(i)
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {completedRounds.includes(i) ? "✓" : i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Main Pattern Sequence Rack */}
      <div className="p-6 bg-slate-50/90 rounded-3xl border border-slate-200/80 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-800 text-slate-600 uppercase tracking-wide">
            Sequence Rack:
          </span>
          <span className="text-xs font-700 text-violet-600">
            Find the repeating or progressive mathematical loop
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-4 min-w-max">
          {round.sequence.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.07 }}
              className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs min-w-[70px] sm:min-w-[80px]"
            >
              <PatternItemVisual item={item} size={48} />
              <span className="text-[11px] font-bold text-slate-500 text-center">{item.label}</span>
            </motion.div>
          ))}

          <div className="flex items-center text-slate-300 font-black text-xl px-2">➔</div>

          {/* Mystery Target Drop/Placement Box */}
          <div
            className={`w-20 sm:w-24 h-28 sm:h-32 rounded-3xl border-3 border-dashed flex flex-col items-center justify-center p-3 transition-all relative ${
              selectedOptionId
                ? isSubmitted
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-50/70"
                    : "border-rose-400 bg-rose-50/70"
                  : "border-violet-600 bg-violet-50/70 shadow-xs"
                : "border-violet-300 bg-violet-50/30"
            }`}
          >
            {selectedOptionId ? (
              <div className="flex flex-col items-center gap-2">
                {(() => {
                  const opt = round.options.find((o) => o.id === selectedOptionId);
                  return opt ? (
                    <>
                      <PatternItemVisual item={opt} size={44} />
                      <span className="text-[10px] font-800 text-slate-700 truncate max-w-[70px]">
                        {opt.label}
                      </span>
                    </>
                  ) : null;
                })()}
              </div>
            ) : (
              <div className="text-center">
                <span className="text-3xl font-black text-violet-400">?</span>
                <p className="text-[10px] font-700 text-violet-500 mt-1">Tap Option</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Answer Options Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-800 text-slate-400 uppercase tracking-wide">
            Select or Tap the Matching Option:
          </span>
          <span className="text-xs text-slate-500">Click to place into mystery box</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {round.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <motion.button
                key={opt.id}
                disabled={isSubmitted && isCorrect}
                onClick={() => {
                  setSelectedOptionId(opt.id);
                  setIsSubmitted(false);
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? isSubmitted
                      ? isCorrect
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-rose-400 bg-rose-50"
                      : "border-violet-600 bg-violet-50/80 shadow-xs"
                    : "border-slate-200 bg-white hover:border-violet-300"
                }`}
              >
                <PatternItemVisual item={opt} size={42} />
                <span className="text-xs font-800 text-slate-700">{opt.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Educational Feedback Box */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              isCorrect
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-rose-50 text-rose-900 border border-rose-200"
            }`}
          >
            <div className="font-800 mb-1 flex items-center gap-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-600" /> Brilliant Pattern Deduction!
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-rose-600" /> Not Quite Right — Take Another Look
                </>
              )}
            </div>
            <p>{round.ruleExplanation || round.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb size={14} /> {showHint ? "Hide Hint" : "Need a Hint?"}
          </button>

          {onAskTara && (
            <button
              onClick={() => onAskTara(`Give me a clue for pattern puzzle round ${currentRoundIdx + 1}`)}
              className="px-3.5 py-2.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} /> Ask Tara
            </button>
          )}

          {isSubmitted && !isCorrect && (
            <button
              onClick={handleRetryRound}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} /> Try Another Option
            </button>
          )}
        </div>

        <button
          onClick={handleSubmitChoice}
          disabled={!selectedOptionId || (isSubmitted && isCorrect)}
          className="btn-primary px-8 py-3 rounded-2xl text-xs sm:text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
        >
          Check My Pattern Answer ➔
        </button>
      </div>

      {/* Hint Accordion */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
        >
          <b>💡 Tara&apos;s Clue:</b> {round.hint}
        </motion.div>
      )}

      {/* Final Results Modal */}
      {allFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-center space-y-4"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy size={28} />
          </div>

          <div>
            <h3 className="text-xl font-900 text-slate-800">All Pattern Puzzles Solved!</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              You recognized the repeating logic and completed all {rounds.length} rounds!
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-xs border border-slate-100 text-xs font-800 text-slate-700">
            <span>Accuracy: {score}%</span>
            <span>•</span>
            <span className="text-violet-600">XP Earned: +60 XP</span>
          </div>

          <div>
            <button
              onClick={() => onComplete(score)}
              className="btn-primary px-8 py-3 rounded-2xl text-sm font-800 shadow-md cursor-pointer"
            >
              Claim Rewards & Continue Mission 🚀
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
