"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
  Trophy,
  ArrowUpDown,
  Sliders,
  Info,
  Check,
} from "lucide-react";

export interface SearchingGameConfig {
  algorithm: "linear" | "binary" | "both";
  array: number[];
  target: number;
  title?: string;
  story?: string;
  objective?: string;
  isCustomizable?: boolean;
}

interface SearchingAlgorithmGameProps {
  config?: SearchingGameConfig;
  onComplete: (score: number) => void;
  onAskTara?: (topic: string) => void;
}

export default function SearchingAlgorithmGame({
  config,
  onComplete,
  onAskTara,
}: SearchingAlgorithmGameProps) {
  // Default configurations if none provided
  const initialArray = config?.array || [12, 25, 34, 47, 58, 63, 79, 88, 95];
  const initialTarget = config?.target || 63;
  const initialAlgo = config?.algorithm === "linear" ? "linear" : "binary";

  const [algorithm, setAlgorithm] = useState<"linear" | "binary">(initialAlgo);
  const [array, setArray] = useState<number[]>(initialArray);
  const [target, setTarget] = useState<number>(initialTarget);
  const [isSorted, setIsSorted] = useState<boolean>(true);

  // Game Modes: "interactive" (student predicts / tests step-by-step) | "autoplay" (animated step demonstration)
  const [gameMode, setGameMode] = useState<"interactive" | "autoplay">("interactive");

  // Step state for Linear Search
  const [linearCurrentIdx, setLinearCurrentIdx] = useState<number>(-1);
  const [linearFoundIdx, setLinearFoundIdx] = useState<number | null>(null);

  // Step state for Binary Search
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(array.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [binaryFoundIdx, setBinaryFoundIdx] = useState<number | null>(null);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  // Analytics & gameplay tracking
  const [comparisons, setComparisons] = useState<number>(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [stepExplanation, setStepExplanation] = useState<string>(
    algorithm === "binary"
      ? "Binary Search starts with the whole sorted array: calculate Mid = Math.floor((Low + High) / 2)."
      : "Linear Search inspects items one by one from left to right until the target is found."
  );
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [userPrediction, setUserPrediction] = useState<"less" | "equal" | "greater" | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number>(100);

  // Autoplay control
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset function
  const resetGame = (newAlgo?: "linear" | "binary", newArr?: number[], newTgt?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);

    const activeAlgo = newAlgo || algorithm;
    const activeArr = newArr || array;
    const activeTgt = newTgt !== undefined ? newTgt : target;

    setAlgorithm(activeAlgo);
    setArray(activeArr);
    setTarget(activeTgt);
    setComparisons(0);
    setSearchHistory([]);
    setGameFinished(false);
    setUserPrediction(null);
    setPredictionFeedback(null);
    setShowHint(false);

    if (activeAlgo === "linear") {
      setLinearCurrentIdx(-1);
      setLinearFoundIdx(null);
      setStepExplanation("Ready! Click 'Next Step' or 'Play' to check index 0.");
    } else {
      setLow(0);
      setHigh(activeArr.length - 1);
      setMid(null);
      setBinaryFoundIdx(null);
      setEliminatedIndices([]);
      setStepExplanation("Ready! Calculate Mid = Math.floor((Low + High) / 2) to probe the center element.");
    }
  };

  // Switch between Linear and Binary
  const handleSelectAlgorithm = (algo: "linear" | "binary") => {
    resetGame(algo);
  };

  // Perform one step in Linear Search
  const stepLinear = () => {
    if (gameFinished) return;

    const nextIdx = linearCurrentIdx + 1;
    if (nextIdx >= array.length) {
      setLinearCurrentIdx(array.length);
      setGameFinished(true);
      setStepExplanation(`❌ Target ${target} not found in the array after checking all ${array.length} elements!`);
      return;
    }

    setLinearCurrentIdx(nextIdx);
    const newComp = comparisons + 1;
    setComparisons(newComp);

    const val = array[nextIdx];
    if (val === target) {
      setLinearFoundIdx(nextIdx);
      setGameFinished(true);
      setStepExplanation(`🎉 FOUND! Element at index ${nextIdx} is exactly ${target}! Total comparisons: ${newComp}.`);
      setSearchHistory((prev) => [...prev, `Index ${nextIdx}: ${val} === ${target} (FOUND)`]);
    } else {
      setStepExplanation(`Inspecting index ${nextIdx} (value: ${val}). ${val} !== ${target}. Moving to next card.`);
      setSearchHistory((prev) => [...prev, `Index ${nextIdx}: ${val} !== ${target}`]);
    }
  };

  // Perform one step in Binary Search
  const stepBinary = () => {
    if (gameFinished) return;

    if (low > high) {
      setGameFinished(true);
      setStepExplanation(`❌ Search space exhausted! Target ${target} is not in the array. Comparisons: ${comparisons}.`);
      return;
    }

    const currentMid = Math.floor((low + high) / 2);
    setMid(currentMid);
    const newComp = comparisons + 1;
    setComparisons(newComp);

    const midVal = array[currentMid];

    if (midVal === target) {
      setBinaryFoundIdx(currentMid);
      setGameFinished(true);
      setStepExplanation(
        `🎉 MATCH FOUND! array[${currentMid}] is ${midVal} which matches target ${target}! Found in only ${newComp} comparisons (O(log N))!`
      );
      setSearchHistory((prev) => [
        ...prev,
        `Mid=[${currentMid}] (Val ${midVal}) === Target ${target} -> FOUND!`,
      ]);
    } else if (midVal > target) {
      // Target is in the left half, eliminate right half
      const newlyEliminated: number[] = [];
      for (let i = currentMid; i <= high; i++) {
        newlyEliminated.push(i);
      }
      setEliminatedIndices((prev) => Array.from(new Set([...prev, ...newlyEliminated])));
      setHigh(currentMid - 1);
      setStepExplanation(
        `🔍 array[${currentMid}] = ${midVal} is GREATER than target ${target}. Because array is sorted, the target must be on the LEFT. Discarding indices ${currentMid} through ${high}. Range shrinks to [${low}...${currentMid - 1}].`
      );
      setSearchHistory((prev) => [
        ...prev,
        `Mid=[${currentMid}] (${midVal} > ${target}) -> Target on LEFT, High = ${currentMid - 1}`,
      ]);
    } else {
      // Target is in the right half, eliminate left half
      const newlyEliminated: number[] = [];
      for (let i = low; i <= currentMid; i++) {
        newlyEliminated.push(i);
      }
      setEliminatedIndices((prev) => Array.from(new Set([...prev, ...newlyEliminated])));
      setLow(currentMid + 1);
      setStepExplanation(
        `🔍 array[${currentMid}] = ${midVal} is LESS than target ${target}. Target must be on the RIGHT. Discarding indices ${low} through ${currentMid}. Range shrinks to [${currentMid + 1}...${high}].`
      );
      setSearchHistory((prev) => [
        ...prev,
        `Mid=[${currentMid}] (${midVal} < ${target}) -> Target on RIGHT, Low = ${currentMid + 1}`,
      ]);
    }
  };

  // Step trigger
  const handleNextStep = () => {
    if (algorithm === "linear") {
      stepLinear();
    } else {
      stepBinary();
    }
  };

  // Interactive prediction submission (student guesses relationship before revealing mid)
  const handlePredict = (guess: "less" | "equal" | "greater") => {
    setUserPrediction(guess);
    const candidateMid = Math.floor((low + high) / 2);
    const midVal = array[candidateMid];

    let actual: "less" | "equal" | "greater";
    if (midVal < target) actual = "less";
    else if (midVal === target) actual = "equal";
    else actual = "greater";

    if (guess === actual) {
      setPredictionFeedback(`🌟 Spot on! array[${candidateMid}] (${midVal}) is ${actual} than ${target}.`);
    } else {
      setPredictionFeedback(`💡 Nice try! Actually array[${candidateMid}] is ${actual} than target ${target}.`);
      setScore((s) => Math.max(70, s - 5));
    }

    // Now advance the step
    setTimeout(() => {
      stepBinary();
      setUserPrediction(null);
      setPredictionFeedback(null);
    }, 1200);
  };

  // Autoplay runner
  useEffect(() => {
    if (isPlaying && !gameFinished) {
      timerRef.current = setInterval(() => {
        handleNextStep();
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameFinished, low, high, linearCurrentIdx, algorithm, playbackSpeed]);

  // Completion trigger
  const handleFinish = () => {
    onComplete(score);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      {/* Game Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-800 uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
              Interactive Algorithm Lab
            </span>
            <span className="text-xs font-700 text-slate-400">
              Target Value: <span className="text-violet-700 font-900 text-sm">{target}</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-900 text-slate-800">
            {algorithm === "binary" ? "⚡ Binary Search Challenge" : "🔍 Linear Search Challenge"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {config?.objective ||
              "Observe how search range reduces and see the power of logarithmic search efficiency!"}
          </p>
        </div>

        {/* Algorithm Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => handleSelectAlgorithm("binary")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-800 transition-all cursor-pointer ${
              algorithm === "binary"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Binary Search (O(log N))
          </button>
          <button
            onClick={() => handleSelectAlgorithm("linear")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-800 transition-all cursor-pointer ${
              algorithm === "linear"
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Linear Search (O(N))
          </button>
        </div>
      </div>

      {/* Target & Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-violet-50/70 border border-violet-100 flex flex-col">
          <span className="text-[11px] font-700 text-violet-600 uppercase tracking-wide">Target to Find</span>
          <span className="text-2xl font-900 text-violet-900 mt-1">{target}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col">
          <span className="text-[11px] font-700 text-blue-600 uppercase tracking-wide">Comparisons Made</span>
          <span className="text-2xl font-900 text-blue-900 mt-1">{comparisons}</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col">
          <span className="text-[11px] font-700 text-amber-700 uppercase tracking-wide">
            {algorithm === "binary" ? "Active Search Space" : "Items Remaining"}
          </span>
          <span className="text-2xl font-900 text-amber-900 mt-1">
            {algorithm === "binary"
              ? Math.max(0, high - low + 1)
              : Math.max(0, array.length - (linearCurrentIdx + 1))}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col">
          <span className="text-[11px] font-700 text-emerald-700 uppercase tracking-wide">Search Status</span>
          <span className="text-sm font-900 text-emerald-900 mt-2 truncate">
            {gameFinished
              ? linearFoundIdx !== null || binaryFoundIdx !== null
                ? "🎯 FOUND!"
                : "❌ Not Found"
              : "In Progress..."}
          </span>
        </div>
      </div>

      {/* Array Cards Visual Gameboard */}
      <div className="p-6 bg-slate-50/90 rounded-3xl border border-slate-200/80 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-800 text-slate-700">ARRAY VISUALIZER:</span>
            {algorithm === "binary" && (
              <span className="text-[11px] font-700 text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Sorted Ascending ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block"></span>
              {algorithm === "binary" ? "Midpoint (Active)" : "Inspecting"}
            </span>
            {algorithm === "binary" && (
              <span className="inline-flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span> Eliminated
              </span>
            )}
          </div>
        </div>

        {/* Cards Row */}
        <div className="flex items-end justify-center gap-2 sm:gap-3 overflow-x-auto py-6 px-2 min-w-max">
          {array.map((num, idx) => {
            const isLinearInspecting = algorithm === "linear" && linearCurrentIdx === idx;
            const isLinearFound = algorithm === "linear" && linearFoundIdx === idx;

            const isBinaryMid = algorithm === "binary" && mid === idx;
            const isBinaryFound = algorithm === "binary" && binaryFoundIdx === idx;
            const isBinaryEliminated = algorithm === "binary" && eliminatedIndices.includes(idx);
            const isInSearchRange =
              algorithm === "binary" && idx >= low && idx <= high && !isBinaryEliminated;

            const isLow = algorithm === "binary" && low === idx && !gameFinished;
            const isHigh = algorithm === "binary" && high === idx && !gameFinished;

            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Pointer tags above card */}
                <div className="h-7 flex items-center justify-center mb-1.5">
                  {isBinaryFound || isLinearFound ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 text-[10px] font-900 bg-emerald-600 text-white rounded-md shadow-xs animate-bounce"
                    >
                      FOUND
                    </motion.span>
                  ) : isBinaryMid ? (
                    <motion.span
                      initial={{ y: -5 }}
                      animate={{ y: 0 }}
                      className="px-2 py-0.5 text-[10px] font-900 bg-violet-600 text-white rounded-md shadow-xs"
                    >
                      MID
                    </motion.span>
                  ) : isLinearInspecting ? (
                    <motion.span
                      initial={{ y: -5 }}
                      animate={{ y: 0 }}
                      className="px-2 py-0.5 text-[10px] font-900 bg-blue-600 text-white rounded-md shadow-xs"
                    >
                      COMPARE
                    </motion.span>
                  ) : isLow && isHigh ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-800 bg-amber-500 text-white rounded-md">
                      LOW=HIGH
                    </span>
                  ) : isLow ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-800 bg-cyan-600 text-white rounded-md">
                      LOW
                    </span>
                  ) : isHigh ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-800 bg-rose-600 text-white rounded-md">
                      HIGH
                    </span>
                  ) : isInSearchRange ? (
                    <span className="text-[9px] text-slate-400 font-600">RANGE</span>
                  ) : null}
                </div>

                {/* The Visual Card Tile */}
                <motion.div
                  animate={{
                    scale: isBinaryFound || isLinearFound ? 1.12 : isBinaryMid || isLinearInspecting ? 1.06 : 1,
                    y: isBinaryFound || isLinearFound ? -6 : isBinaryMid || isLinearInspecting ? -4 : 0,
                  }}
                  className={`w-12 sm:w-14 h-20 sm:h-22 rounded-2xl flex flex-col items-center justify-center p-2 border-2 transition-colors relative shadow-xs select-none ${
                    isBinaryFound || isLinearFound
                      ? "border-emerald-500 bg-gradient-to-b from-emerald-50 to-emerald-100 text-emerald-950 font-black shadow-emerald-200"
                      : isBinaryMid
                      ? "border-violet-600 bg-gradient-to-b from-violet-50 to-violet-100 text-violet-950 font-black shadow-violet-200"
                      : isLinearInspecting
                      ? "border-blue-500 bg-gradient-to-b from-blue-50 to-blue-100 text-blue-950 font-black"
                      : isBinaryEliminated
                      ? "border-slate-200 bg-slate-100/70 text-slate-300 opacity-40 line-through"
                      : isInSearchRange
                      ? "border-amber-300 bg-white text-slate-800 font-800 hover:border-violet-300"
                      : "border-slate-200 bg-white text-slate-700 font-700"
                  }`}
                >
                  <span className="text-lg sm:text-xl">{num}</span>
                </motion.div>

                {/* Index subscript */}
                <span className="text-[11px] font-bold text-slate-400 mt-2">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Algorithm Step Commentary Box */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-violet-100 text-violet-700 mt-0.5">
            <Info size={18} />
          </div>
          <div>
            <span className="text-xs font-800 text-slate-400 uppercase tracking-wide">
              Step Explanation & Logic:
            </span>
            <p className="text-sm font-700 text-slate-800 mt-0.5 leading-relaxed">
              {stepExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Student Prediction Mode (For Binary Search) */}
      {algorithm === "binary" && !gameFinished && (
        <div className="p-5 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-900 text-violet-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-violet-600" /> Player Prediction Challenge
            </span>
            <span className="text-xs text-slate-500 font-700">Predict the comparison!</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 font-600">
            For range [{low} ... {high}], midpoint is index <b>{Math.floor((low + high) / 2)}</b> (value:{" "}
            <b>{array[Math.floor((low + high) / 2)]}</b>). How does it compare to target <b>{target}</b>?
          </p>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => handlePredict("greater")}
              disabled={userPrediction !== null}
              className="py-2.5 px-3 rounded-xl border border-violet-200 bg-white hover:bg-violet-600 hover:text-white text-violet-800 font-800 text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              Mid &gt; Target
            </button>
            <button
              onClick={() => handlePredict("equal")}
              disabled={userPrediction !== null}
              className="py-2.5 px-3 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-600 hover:text-white text-emerald-800 font-800 text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              Mid === Target (MATCH!)
            </button>
            <button
              onClick={() => handlePredict("less")}
              disabled={userPrediction !== null}
              className="py-2.5 px-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-600 hover:text-white text-blue-800 font-800 text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              Mid &lt; Target
            </button>
          </div>

          {predictionFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-white border border-violet-200 text-xs font-800 text-violet-900"
            >
              {predictionFeedback}
            </motion.div>
          )}
        </div>
      )}

      {/* Control Buttons & Playback Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetGame()}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-700 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} /> Restart
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={gameFinished}
            className={`px-4 py-2.5 rounded-xl text-xs font-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 ${
              isPlaying ? "bg-amber-500 text-white shadow-xs" : "bg-slate-800 text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={14} /> Pause
              </>
            ) : (
              <>
                <Play size={14} /> Autoplay
              </>
            )}
          </button>

          <button
            onClick={handleNextStep}
            disabled={isPlaying || gameFinished}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-800 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs"
          >
            Next Step <SkipForward size={14} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-700 flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb size={13} /> {showHint ? "Hide Hint" : "Hint"}
          </button>

          {onAskTara && (
            <button
              onClick={() => onAskTara(`Explain why Binary Search is O(log N) compared to Linear Search`)}
              className="px-3 py-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-700 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={13} /> Ask Tara
            </button>
          )}
        </div>
      </div>

      {/* Hint Alert */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
        >
          <b>💡 Algorithmic Insight:</b>{" "}
          {algorithm === "binary"
            ? "Binary Search halves the search space every single comparison! If you have 1,000 items, Linear Search takes up to 1,000 steps, but Binary Search takes only 10 steps (log2(1000) ≈ 10). BUT it strictly requires the array to be sorted first!"
            : "Linear Search inspects every element from left to right. It works on unsorted lists, but can be very slow for large datasets with thousands of items."}
        </motion.div>
      )}

      {/* Results & Completion Screen */}
      {gameFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 text-center space-y-4"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
            <Trophy size={28} />
          </div>

          <div>
            <h3 className="text-xl font-900 text-slate-800">Challenge Completed!</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              You found target <b>{target}</b> using {algorithm === "binary" ? "Binary Search" : "Linear Search"} in{" "}
              <b>{comparisons} comparisons</b>!
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-xs border border-slate-100 text-xs font-800 text-slate-700">
            <span>Accuracy: {score}%</span>
            <span>•</span>
            <span className="text-violet-600">XP Earned: +60 XP</span>
          </div>

          <div>
            <button
              onClick={handleFinish}
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
