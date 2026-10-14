"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Trophy,
  HelpCircle,
  Code2,
} from "lucide-react";

export interface AlgorithmInstructionStep {
  id: string;
  order: number;
  text: string;
  codeSnippet?: string;
  explanation?: string;
}

export interface DebuggingLogicConfig {
  title?: string;
  scenario: string;
  bugDescription?: string;
  steps: AlgorithmInstructionStep[]; // Scrambled order
  correctOrder: string[]; // Array of step IDs in correct sequence
  hint: string;
}

interface DebuggingLogicGameProps {
  config: DebuggingLogicConfig;
  onComplete: (score: number) => void;
  onAskTara?: (prompt: string) => void;
}

export default function DebuggingLogicGame({
  config,
  onComplete,
  onAskTara,
}: DebuggingLogicGameProps) {
  // Ordered step list controlled by the player
  const [currentSteps, setCurrentSteps] = useState<AlgorithmInstructionStep[]>([...config.steps]);
  const [activeRunningIdx, setActiveRunningIdx] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number>(100);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Move step up
  const handleMoveUp = (index: number) => {
    if (index === 0 || isRunning || isEvaluated) return;
    setCurrentSteps((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Move step down
  const handleMoveDown = (index: number) => {
    if (index === currentSteps.length - 1 || isRunning || isEvaluated) return;
    setCurrentSteps((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Run the algorithm simulation step-by-step
  const handleRunAlgorithm = async () => {
    setIsRunning(true);
    setIsEvaluated(false);

    // Trace execution
    for (let i = 0; i < currentSteps.length; i++) {
      setActiveRunningIdx(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    setActiveRunningIdx(null);
    setIsRunning(false);
    setIsEvaluated(true);

    // Check if the IDs match the correct order
    const playerOrder = currentSteps.map((s) => s.id);
    const correct = config.correctOrder.every((id, idx) => playerOrder[idx] === id);

    setIsCorrect(correct);

    if (correct) {
      setFeedback("🎉 Algorithm executed flawlessly! Output is valid and bug-free.");
      setTimeout(() => setIsFinished(true), 1200);
    } else {
      setScore((s) => Math.max(65, s - 10));
      setFeedback("❌ Logic error detected during trace! Steps are out of sequential order.");
    }
  };

  // Reset to original scrambled steps
  const handleReset = () => {
    setCurrentSteps([...config.steps]);
    setIsEvaluated(false);
    setIsCorrect(false);
    setFeedback(null);
    setActiveRunningIdx(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-800 uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
              Algorithm Debugging Arena
            </span>
            <span className="text-xs font-700 text-slate-400">
              Sequential Logic Challenge
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-900 text-slate-800">
            {config.title || "Fix the Broken Code Pipeline"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {config.scenario}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={13} /> Reset Order
        </button>
      </div>

      {/* Code Blocks Rack */}
      <div className="space-y-2.5">
        <span className="text-xs font-800 text-slate-400 uppercase tracking-wide">
          Arrange instructions into valid execution sequence (Use ▲ and ▼):
        </span>

        {currentSteps.map((step, idx) => {
          const isCurrentActive = activeRunningIdx === idx;

          return (
            <motion.div
              key={step.id}
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                isCurrentActive
                  ? "border-violet-600 bg-violet-50/80 shadow-md ring-2 ring-violet-300"
                  : isEvaluated
                  ? isCorrect
                    ? "border-emerald-300 bg-emerald-50/40"
                    : "border-slate-200 bg-white"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-900 text-xs flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-xs sm:text-sm font-800 text-slate-800">{step.text}</p>
                  {step.codeSnippet && (
                    <code className="text-[11px] font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded mt-1 inline-block">
                      {step.codeSnippet}
                    </code>
                  )}
                </div>
              </div>

              {/* Move up / down buttons */}
              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0 || isRunning || isEvaluated}
                  onClick={() => handleMoveUp(idx)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-violet-600 hover:text-white text-slate-600 disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Move Up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  disabled={idx === currentSteps.length - 1 || isRunning || isEvaluated}
                  onClick={() => handleMoveDown(idx)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-violet-600 hover:text-white text-slate-600 disabled:opacity-30 cursor-pointer transition-colors"
                  aria-label="Move Down"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {feedback && (
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
                <CheckCircle2 size={16} className="text-emerald-600" /> Success!
              </>
            ) : (
              <>
                <XCircle size={16} className="text-rose-600" /> Logic Error
              </>
            )}
          </div>
          <p>{feedback}</p>
        </motion.div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb size={14} /> {showHint ? "Hide Hint" : "Algorithmic Hint"}
          </button>

          {onAskTara && (
            <button
              onClick={() => onAskTara(`How do I logically order steps for this algorithm?`)}
              className="px-3.5 py-2.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} /> Ask Tara
            </button>
          )}

          {isEvaluated && !isCorrect && (
            <button
              onClick={() => setIsEvaluated(false)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} /> Adjust Steps
            </button>
          )}
        </div>

        <button
          onClick={handleRunAlgorithm}
          disabled={isRunning || (isEvaluated && isCorrect)}
          className="btn-primary px-8 py-3 rounded-2xl text-xs sm:text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md flex items-center gap-2"
        >
          <Play size={15} /> Run & Verify Code Pipeline ➔
        </button>
      </div>

      {/* Hint Accordion */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
        >
          <b>💡 Step-by-Step Hint:</b> {config.hint}
        </motion.div>
      )}

      {/* Completion Modal */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-center space-y-4"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy size={28} />
          </div>

          <div>
            <h3 className="text-xl font-900 text-slate-800">Algorithm Logic Solved!</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              You correctly arranged the sequence of execution and eliminated the logical bug!
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-xs border border-slate-100 text-xs font-800 text-slate-700">
            <span>Accuracy: {score}%</span>
            <span>•</span>
            <span className="text-violet-600">XP Earned: +65 XP</span>
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
