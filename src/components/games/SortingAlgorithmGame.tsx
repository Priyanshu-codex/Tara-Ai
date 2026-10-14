"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
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
  Sliders,
  Info,
  Check,
  RefreshCw,
} from "lucide-react";

export interface SortingAlgoConfig {
  algorithm?: "bubble" | "selection" | "insertion";
  initialArray?: number[];
  title?: string;
  story?: string;
  objective?: string;
}

interface SortingAlgorithmGameProps {
  config?: SortingAlgoConfig;
  onComplete: (score: number) => void;
  onAskTara?: (topic: string) => void;
}

type AlgorithmType = "bubble" | "selection" | "insertion";

interface SortStep {
  array: number[];
  comparingIndices: [number, number] | null;
  swappingIndices: [number, number] | null;
  sortedIndices: number[];
  currentMinIdx?: number | null;
  explanation: string;
  tag?: "COMPARE" | "SWAP" | "KEEP" | "INSERT" | "SORTED" | "CURRENT MIN";
  shouldSwap?: boolean;
}

export default function SortingAlgorithmGame({
  config,
  onComplete,
  onAskTara,
}: SortingAlgorithmGameProps) {
  const defaultArray = config?.initialArray || [45, 18, 72, 29, 64, 33];
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmType>(config?.algorithm || "bubble");
  const [array, setArray] = useState<number[]>([...defaultArray]);

  // Precomputed steps for selected algorithm
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Stats
  const [comparisons, setComparisons] = useState<number>(0);
  const [swaps, setSwaps] = useState<number>(0);
  const [score, setScore] = useState<number>(100);

  // Playback & Interactive mode
  const [isAutoplay, setIsAutoplay] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);
  const [interactivePrediction, setInteractivePrediction] = useState<"swap" | "keep" | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generator: Bubble Sort steps
  const generateBubbleSortSteps = (arr: number[]): SortStep[] => {
    const list = [...arr];
    const n = list.length;
    const generated: SortStep[] = [];
    const sorted: number[] = [];

    generated.push({
      array: [...list],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: [],
      explanation: "Bubble Sort compares adjacent cards. If the left card is greater than the right card, they swap!",
      tag: undefined,
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const left = list[j];
        const right = list[j + 1];
        const willSwap = left > right;

        // Step 1: Compare
        generated.push({
          array: [...list],
          comparingIndices: [j, j + 1],
          swappingIndices: null,
          sortedIndices: [...sorted],
          explanation: `Compare index ${j} (value: ${left}) with index ${j + 1} (value: ${right}). Is ${left} > ${right}?`,
          tag: "COMPARE",
          shouldSwap: willSwap,
        });

        // Step 2: Swap or Keep
        if (willSwap) {
          list[j] = right;
          list[j + 1] = left;
          generated.push({
            array: [...list],
            comparingIndices: null,
            swappingIndices: [j, j + 1],
            sortedIndices: [...sorted],
            explanation: `YES! ${left} is greater than ${right}, so we SWAP them!`,
            tag: "SWAP",
          });
        } else {
          generated.push({
            array: [...list],
            comparingIndices: [j, j + 1],
            swappingIndices: null,
            sortedIndices: [...sorted],
            explanation: `NO SWAP. ${left} is already in correct relative order before ${right}. KEEP.`,
            tag: "KEEP",
          });
        }
      }
      sorted.unshift(n - 1 - i);
      generated.push({
        array: [...list],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [...sorted],
        explanation: `Pass complete! The largest element in this pass has 'bubbled up' to index ${n - 1 - i} (SORTED).`,
        tag: "SORTED",
      });
    }

    sorted.unshift(0);
    generated.push({
      array: [...list],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: "🎉 Whole array is completely SORTED! Every element is in ascending order.",
      tag: "SORTED",
    });

    return generated;
  };

  // Generator: Selection Sort steps
  const generateSelectionSortSteps = (arr: number[]): SortStep[] => {
    const list = [...arr];
    const n = list.length;
    const generated: SortStep[] = [];
    const sorted: number[] = [];

    generated.push({
      array: [...list],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: [],
      explanation: "Selection Sort finds the minimum value in the unsorted portion and swaps it into the current position.",
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      generated.push({
        array: [...list],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [...sorted],
        currentMinIdx: minIdx,
        explanation: `Starting pass for position ${i}. Assume current minimum is at index ${minIdx} (value ${list[minIdx]}).`,
        tag: "CURRENT MIN",
      });

      for (let j = i + 1; j < n; j++) {
        generated.push({
          array: [...list],
          comparingIndices: [minIdx, j],
          swappingIndices: null,
          sortedIndices: [...sorted],
          currentMinIdx: minIdx,
          explanation: `Compare current min ${list[minIdx]} with item at index ${j} (${list[j]}).`,
          tag: "COMPARE",
          shouldSwap: list[j] < list[minIdx],
        });

        if (list[j] < list[minIdx]) {
          minIdx = j;
          generated.push({
            array: [...list],
            comparingIndices: null,
            swappingIndices: null,
            sortedIndices: [...sorted],
            currentMinIdx: minIdx,
            explanation: `Found smaller element! New minimum is index ${minIdx} (value ${list[minIdx]}).`,
            tag: "CURRENT MIN",
          });
        }
      }

      if (minIdx !== i) {
        const temp = list[i];
        list[i] = list[minIdx];
        list[minIdx] = temp;
        generated.push({
          array: [...list],
          comparingIndices: null,
          swappingIndices: [i, minIdx],
          sortedIndices: [...sorted],
          explanation: `Swap minimum item ${list[i]} into position ${i}.`,
          tag: "SWAP",
        });
      }

      sorted.push(i);
      generated.push({
        array: [...list],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: [...sorted],
        explanation: `Position ${i} is now officially locked as SORTED.`,
        tag: "SORTED",
      });
    }

    sorted.push(n - 1);
    generated.push({
      array: [...list],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: "🎉 Selection Sort completed! All elements sorted.",
      tag: "SORTED",
    });

    return generated;
  };

  // Generator: Insertion Sort steps
  const generateInsertionSortSteps = (arr: number[]): SortStep[] => {
    const list = [...arr];
    const n = list.length;
    const generated: SortStep[] = [];
    const sorted: number[] = [0];

    generated.push({
      array: [...list],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: [0],
      explanation: `Insertion Sort builds a sorted hand from left to right. Index 0 (${list[0]}) starts as sorted.`,
      tag: "SORTED",
    });

    for (let i = 1; i < n; i++) {
      const key = list[i];
      let j = i - 1;

      generated.push({
        array: [...list],
        comparingIndices: [j, i],
        swappingIndices: null,
        sortedIndices: [...sorted],
        explanation: `Pick item at index ${i} (value ${key}) to insert into the sorted left portion.`,
        tag: "COMPARE",
        shouldSwap: list[j] > key,
      });

      while (j >= 0 && list[j] > key) {
        list[j + 1] = list[j];
        generated.push({
          array: [...list],
          comparingIndices: null,
          swappingIndices: [j, j + 1],
          sortedIndices: [...sorted],
          explanation: `Shift item ${list[j + 1]} right because it is greater than ${key}.`,
          tag: "SWAP",
        });
        j = j - 1;
      }

      list[j + 1] = key;
      sorted.push(i);
      generated.push({
        array: [...list],
        comparingIndices: null,
        swappingIndices: null,
        sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
        explanation: `Inserted ${key} into position ${j + 1}. First ${i + 1} cards are now SORTED.`,
        tag: "INSERT",
      });
    }

    generated.push({
      array: [...list],
      comparingIndices: null,
      swappingIndices: null,
      sortedIndices: Array.from({ length: n }, (_, k) => k),
      explanation: "🎉 Insertion Sort complete! Array fully sorted.",
      tag: "SORTED",
    });

    return generated;
  };

  // Initialize steps whenever algorithm or initial array changes
  const initAlgorithm = (algo: AlgorithmType, arrToUse = defaultArray) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAutoplay(false);

    let generated: SortStep[] = [];
    if (algo === "bubble") generated = generateBubbleSortSteps(arrToUse);
    else if (algo === "selection") generated = generateSelectionSortSteps(arrToUse);
    else generated = generateInsertionSortSteps(arrToUse);

    setSteps(generated);
    setCurrentStepIdx(0);
    setComparisons(0);
    setSwaps(0);
    setIsFinished(false);
    setInteractivePrediction(null);
    setPredictionFeedback(null);
    setSelectedAlgo(algo);
  };

  useEffect(() => {
    initAlgorithm(selectedAlgo, defaultArray);
  }, [selectedAlgo]);

  // Current active step
  const currentStep = steps[currentStepIdx] || {
    array: defaultArray,
    comparingIndices: null,
    swappingIndices: null,
    sortedIndices: [],
    explanation: "Initializing...",
  };

  // Step forward
  const handleStepForward = () => {
    if (currentStepIdx >= steps.length - 1) {
      setIsFinished(true);
      setIsAutoplay(false);
      return;
    }

    const nextIdx = currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);

    const step = steps[nextIdx];
    if (step.tag === "COMPARE") {
      setComparisons((c) => c + 1);
    } else if (step.tag === "SWAP") {
      setSwaps((s) => s + 1);
    }

    if (nextIdx === steps.length - 1) {
      setIsFinished(true);
      setIsAutoplay(false);
    }
  };

  // Autoplay effect
  useEffect(() => {
    if (isAutoplay && !isFinished) {
      timerRef.current = setInterval(() => {
        handleStepForward();
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay, isFinished, currentStepIdx, speed, steps]);

  // Student Prediction: SWAP vs KEEP
  const handlePredictDecision = (choice: "swap" | "keep") => {
    setInteractivePrediction(choice);

    const expected = currentStep.shouldSwap ? "swap" : "keep";
    if (choice === expected) {
      setPredictionFeedback(`🌟 Correct decision! ${choice === "swap" ? "Elements must SWAP!" : "No swap needed, KEEP!"}`);
    } else {
      setPredictionFeedback(`💡 Keep learning! The correct move is to ${expected.toUpperCase()}.`);
      setScore((s) => Math.max(70, s - 5));
    }

    // Auto advance after short delay
    setTimeout(() => {
      handleStepForward();
      setInteractivePrediction(null);
      setPredictionFeedback(null);
    }, 1100);
  };

  // Maximum value for bar scaling
  const maxValue = Math.max(...defaultArray, 100);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-800 uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Interactive Sorting Arena
            </span>
            <span className="text-xs font-700 text-slate-400">
              Passes & Swaps Visualizer
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-900 text-slate-800 capitalize">
            {selectedAlgo} Sort Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Predict comparisons, watch elements bubble and shift, and master sorting complexity!
          </p>
        </div>

        {/* Algorithm Selection Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => initAlgorithm("bubble")}
            className={`px-3 py-1.5 rounded-xl text-xs font-800 transition-all cursor-pointer ${
              selectedAlgo === "bubble" ? "bg-violet-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Bubble Sort
          </button>
          <button
            onClick={() => initAlgorithm("selection")}
            className={`px-3 py-1.5 rounded-xl text-xs font-800 transition-all cursor-pointer ${
              selectedAlgo === "selection" ? "bg-violet-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Selection Sort
          </button>
          <button
            onClick={() => initAlgorithm("insertion")}
            className={`px-3 py-1.5 rounded-xl text-xs font-800 transition-all cursor-pointer ${
              selectedAlgo === "insertion" ? "bg-violet-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Insertion Sort
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col">
          <span className="text-[11px] font-700 text-blue-600 uppercase">Comparisons</span>
          <span className="text-2xl font-900 text-blue-900 mt-1">{comparisons}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-violet-50/70 border border-violet-100 flex flex-col">
          <span className="text-[11px] font-700 text-violet-600 uppercase">Swaps / Shifts</span>
          <span className="text-2xl font-900 text-violet-900 mt-1">{swaps}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col">
          <span className="text-[11px] font-700 text-amber-700 uppercase">Progress</span>
          <span className="text-2xl font-900 text-amber-900 mt-1">
            {steps.length > 0 ? Math.round((currentStepIdx / (steps.length - 1)) * 100) : 0}%
          </span>
        </div>
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col">
          <span className="text-[11px] font-700 text-emerald-700 uppercase">Status</span>
          <span className="text-sm font-900 text-emerald-900 mt-2">
            {isFinished ? "🎯 Fully Sorted!" : currentStep.tag || "Comparing..."}
          </span>
        </div>
      </div>

      {/* Visual Gameboard: Bars & Numbered Tiles */}
      <div className="p-6 bg-slate-50/90 rounded-3xl border border-slate-200/80 shadow-inner">
        {/* Visual Bar Height & Tile View */}
        <div className="h-56 flex items-end justify-center gap-3 sm:gap-4 px-2 pb-2">
          {currentStep.array.map((val, idx) => {
            const isComparing = currentStep.comparingIndices?.includes(idx);
            const isSwapping = currentStep.swappingIndices?.includes(idx);
            const isSorted = currentStep.sortedIndices.includes(idx);
            const isMin = currentStep.currentMinIdx === idx;

            // Height scaling: from 60px to 190px
            const barHeight = Math.max(55, Math.round((val / maxValue) * 180));

            return (
              <div key={idx} className="flex flex-col items-center flex-1 max-w-[68px]">
                {/* Active Indicator Tag */}
                <div className="h-6 flex items-center justify-center mb-1">
                  {isSwapping ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-1.5 py-0.5 text-[9px] font-900 bg-rose-600 text-white rounded-md shadow-xs animate-bounce"
                    >
                      SWAP
                    </motion.span>
                  ) : isComparing ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-1.5 py-0.5 text-[9px] font-900 bg-amber-500 text-white rounded-md shadow-xs"
                    >
                      COMPARE
                    </motion.span>
                  ) : isMin ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-900 bg-cyan-600 text-white rounded-md shadow-xs">
                      MIN
                    </span>
                  ) : isSorted ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-900 bg-emerald-600 text-white rounded-md shadow-xs">
                      SORTED
                    </span>
                  ) : null}
                </div>

                {/* Animated Vertical Bar */}
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  style={{ height: `${barHeight}px` }}
                  className={`w-full rounded-2xl flex flex-col justify-between items-center p-2 border-2 transition-all shadow-xs select-none ${
                    isSwapping
                      ? "border-rose-500 bg-gradient-to-t from-rose-500 to-rose-400 text-white shadow-rose-200"
                      : isComparing
                      ? "border-amber-400 bg-gradient-to-t from-amber-400 to-amber-300 text-amber-950 shadow-amber-200"
                      : isSorted
                      ? "border-emerald-500 bg-gradient-to-t from-emerald-500 to-emerald-400 text-white shadow-emerald-200"
                      : isMin
                      ? "border-cyan-500 bg-gradient-to-t from-cyan-500 to-cyan-400 text-white"
                      : "border-violet-200 bg-gradient-to-t from-violet-500 to-violet-400 text-white"
                  }`}
                >
                  <span className="text-xs sm:text-sm font-900">{val}</span>
                  <div className="w-4 h-1 bg-white/40 rounded-full mb-1" />
                </motion.div>

                {/* Index subscript */}
                <span className="text-[11px] font-bold text-slate-400 mt-2">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Algorithm Step Explanation Box */}
        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-violet-100 text-violet-700 mt-0.5">
            <Info size={18} />
          </div>
          <div>
            <span className="text-xs font-800 text-slate-400 uppercase tracking-wide">
              Step #{currentStepIdx + 1} Action & Commentary:
            </span>
            <p className="text-sm font-700 text-slate-800 mt-0.5 leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Move Prediction Challenge */}
      {currentStep.tag === "COMPARE" && currentStep.shouldSwap !== undefined && !isFinished && (
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-900 text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-600" /> Student Decision Challenge
            </span>
            <span className="text-xs text-amber-700 font-700">Predict the next algorithmic move!</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 font-700">
            Based on the highlighted comparison, what should the algorithm do now?
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handlePredictDecision("swap")}
              disabled={interactivePrediction !== null}
              className="py-3 px-4 rounded-xl border-2 border-rose-300 bg-white hover:bg-rose-500 hover:text-white text-rose-700 font-900 text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              🔄 SWAP THESE ELEMENTS
            </button>
            <button
              onClick={() => handlePredictDecision("keep")}
              disabled={interactivePrediction !== null}
              className="py-3 px-4 rounded-xl border-2 border-blue-300 bg-white hover:bg-blue-500 hover:text-white text-blue-700 font-900 text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
            >
              ✋ KEEP IN PLACE (NO SWAP)
            </button>
          </div>

          {predictionFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-white border border-amber-300 text-xs font-800 text-amber-900"
            >
              {predictionFeedback}
            </motion.div>
          )}
        </div>
      )}

      {/* Playback & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => initAlgorithm(selectedAlgo)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-700 text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} /> Restart
          </button>

          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            disabled={isFinished}
            className={`px-4 py-2.5 rounded-xl text-xs font-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 ${
              isAutoplay ? "bg-amber-500 text-white shadow-xs" : "bg-slate-800 text-white"
            }`}
          >
            {isAutoplay ? (
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
            onClick={handleStepForward}
            disabled={isAutoplay || isFinished}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-800 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-xs"
          >
            Next Step <SkipForward size={14} />
          </button>

          {/* Speed selector */}
          <div className="flex items-center gap-1 ml-2 text-xs font-700 text-slate-500">
            <span>Speed:</span>
            <button
              onClick={() => setSpeed(1400)}
              className={`px-2 py-1 rounded-lg ${speed === 1400 ? "bg-violet-600 text-white" : "bg-slate-100"}`}
            >
              0.5x
            </button>
            <button
              onClick={() => setSpeed(900)}
              className={`px-2 py-1 rounded-lg ${speed === 900 ? "bg-violet-600 text-white" : "bg-slate-100"}`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeed(450)}
              className={`px-2 py-1 rounded-lg ${speed === 450 ? "bg-violet-600 text-white" : "bg-slate-100"}`}
            >
              2x
            </button>
          </div>
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
              onClick={() =>
                onAskTara(`Explain the difference between Bubble, Selection, and Insertion Sort time complexity O(N^2)`)
              }
              className="px-3 py-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-200 text-xs font-700 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={13} /> Ask Tara
            </button>
          )}
        </div>
      </div>

      {/* Educational Hint Box */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
        >
          <b>💡 Sorting Complexity Guide:</b>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li><b>Bubble Sort:</b> Repeatedly swaps adjacent out-of-order cards. Best case O(N), Worst case O(N²).</li>
            <li><b>Selection Sort:</b> Always makes O(N²) comparisons because it scans the remaining array to find the true minimum, but only makes at most N swaps!</li>
            <li><b>Insertion Sort:</b> Inserts elements into a sorted prefix. Extremely fast (nearly O(N)) when the data is already mostly sorted!</li>
          </ul>
        </motion.div>
      )}

      {/* Completion Modal / Banner */}
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
            <h3 className="text-xl font-900 text-slate-800">Sorting Arena Mastered!</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              You completely sorted the array using <b>{selectedAlgo.toUpperCase()} SORT</b> with{" "}
              <b>{comparisons} comparisons</b> and <b>{swaps} swaps</b>!
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-xs border border-slate-100 text-xs font-800 text-slate-700">
            <span>Accuracy: {score}%</span>
            <span>•</span>
            <span className="text-violet-600">XP Earned: +75 XP</span>
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
