"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Check,
} from "lucide-react";

export interface ClassificationItem {
  id: string;
  name: string;
  category: string; // The correct target category
  emoji?: string;
  icon?: string;
  description?: string;
  features?: string[];
}

export interface ClassificationConfig {
  categories: {
    id: string;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
  }[];
  items: ClassificationItem[];
  title?: string;
  story?: string;
  ruleExplanation?: string;
  objective?: string;
}

interface ClassificationSortingGameProps {
  config: ClassificationConfig;
  onComplete: (score: number) => void;
  onAskTara?: (prompt: string) => void;
}

export default function ClassificationSortingGame({
  config,
  onComplete,
  onAskTara,
}: ClassificationSortingGameProps) {
  const categories = config.categories || [
    { id: "traditional", name: "Traditional Code", color: "#3B82F6", icon: "⚙️" },
    { id: "ai", name: "AI-Powered", color: "#8B5CF6", icon: "🧠" },
  ];

  const items = config.items || [];

  // Current selections: item.id -> categoryId
  const [placedItems, setPlacedItems] = useState<Record<string, string>>({});
  // Selected item for click-to-place
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [evaluationResults, setEvaluationResults] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState<number>(100);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Remaining unplaced items
  const unplacedItems = items.filter((item) => !placedItems[item.id]);

  // Click an unplaced or placed item to select it
  const handleItemClick = (itemId: string) => {
    if (isEvaluated) return;
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  // Click a target bucket to place the selected item
  const handleCategoryBucketClick = (catId: string) => {
    if (!selectedItemId || isEvaluated) return;
    setPlacedItems((prev) => ({
      ...prev,
      [selectedItemId]: catId,
    }));
    setSelectedItemId(null);
  };

  // Remove an item from a bucket
  const handleRemoveFromBucket = (itemId: string) => {
    if (isEvaluated) return;
    setPlacedItems((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  // Evaluate placements
  const handleEvaluate = () => {
    const results: Record<string, boolean> = {};
    let correctCount = 0;

    items.forEach((item) => {
      const chosenCat = placedItems[item.id];
      const isMatch =
        chosenCat === item.category ||
        categories.find((c) => c.id === chosenCat)?.name === item.category;

      results[item.id] = !!isMatch;
      if (isMatch) correctCount++;
    });

    setEvaluationResults(results);
    setIsEvaluated(true);

    const calculatedScore = Math.round((correctCount / items.length) * 100);
    setScore(calculatedScore);

    if (correctCount === items.length) {
      setTimeout(() => setIsFinished(true), 1200);
    }
  };

  // Retry mistakes
  const handleRetryMistakes = () => {
    setPlacedItems((prev) => {
      const copy: Record<string, string> = {};
      Object.entries(prev).forEach(([id, catId]) => {
        if (evaluationResults[id]) {
          copy[id] = catId; // Keep correct ones
        }
      });
      return copy;
    });
    setIsEvaluated(false);
    setSelectedItemId(null);
  };

  // Reset all
  const handleResetAll = () => {
    setPlacedItems({});
    setSelectedItemId(null);
    setIsEvaluated(false);
    setEvaluationResults({});
    setIsFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-800 uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
              Classification & Categorization Lab
            </span>
            <span className="text-xs font-700 text-slate-400">
              Placed: {Object.keys(placedItems).length} / {items.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-900 text-slate-800">
            {config.title || "Smart Classification Challenge"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {config.objective ||
              "Select an item from the rack and place it into the appropriate category bucket."}
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetAll}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-700 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={13} /> Clear
          </button>
        </div>
      </div>

      {/* Unplaced Items Rack */}
      <div className="p-5 bg-slate-50/90 rounded-3xl border border-slate-200/80 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-800 text-slate-500 uppercase tracking-wide">
            Item Rack (Tap to Select):
          </span>
          {selectedItemId && (
            <span className="text-xs font-800 text-violet-600 animate-pulse">
              Now tap a destination category bucket below ➔
            </span>
          )}
        </div>

        {unplacedItems.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {unplacedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-violet-600 bg-violet-50 text-violet-900 shadow-md ring-2 ring-violet-300"
                      : "border-slate-200 bg-white hover:border-violet-300 text-slate-800 shadow-2xs"
                  }`}
                >
                  <span className="text-2xl select-none">{item.emoji || "📦"}</span>
                  <div className="text-left">
                    <p className="text-xs font-800 leading-tight">{item.name}</p>
                    {item.description && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.description}</p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-center text-xs font-700 text-emerald-700 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            🎉 All items placed into category buckets! Click &apos;Verify Classifications&apos; below.
          </div>
        )}
      </div>

      {/* Target Category Buckets */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const itemsInCat = items.filter(
            (it) => placedItems[it.id] === cat.id || placedItems[it.id] === cat.name
          );

          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryBucketClick(cat.id)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative min-h-[160px] flex flex-col justify-between ${
                selectedItemId
                  ? "border-violet-400 bg-violet-50/40 hover:bg-violet-50/80 shadow-md"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cat.icon || "📂"}</span>
                    <h3 className="text-sm sm:text-base font-900 text-slate-800">{cat.name}</h3>
                  </div>
                  <span className="text-xs font-800 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {itemsInCat.length}
                  </span>
                </div>
                {cat.description && (
                  <p className="text-xs text-slate-500 mb-3">{cat.description}</p>
                )}

                {/* Items in this bucket */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {itemsInCat.map((item) => {
                    const isRight = evaluationResults[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-700 transition-all ${
                          isEvaluated
                            ? isRight
                              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                              : "bg-rose-50 text-rose-900 border-rose-300"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span>{item.emoji || "📦"}</span>
                        <span>{item.name}</span>
                        {!isEvaluated && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromBucket(item.id);
                            }}
                            className="ml-1 text-slate-400 hover:text-slate-700 font-bold"
                          >
                            ×
                          </button>
                        )}
                        {isEvaluated && (
                          <span>{isRight ? "✓" : "✗"}</span>
                        )}
                      </div>
                    );
                  })}
                  {itemsInCat.length === 0 && (
                    <span className="text-xs text-slate-400 italic py-2">
                      Drop or tap items here...
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluation Results Banner */}
      {isEvaluated && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
            score === 100
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-amber-50 text-amber-900 border border-amber-200"
          }`}
        >
          <div className="font-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              {score === 100 ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-600" /> Perfect Classification!
                </>
              ) : (
                <>
                  <Lightbulb size={16} className="text-amber-600" /> Some Items Need Adjustment
                </>
              )}
            </span>
            <span className="font-900">Score: {score}%</span>
          </div>
          <p>{config.ruleExplanation || "AI algorithms learn categories by discovering common patterns across features!"}</p>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb size={14} /> {showHint ? "Hide Hint" : "Classification Hint"}
          </button>

          {onAskTara && (
            <button
              onClick={() => onAskTara(`How do I classify these items based on features?`)}
              className="px-3.5 py-2.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} /> Ask Tara
            </button>
          )}

          {isEvaluated && score < 100 && (
            <button
              onClick={handleRetryMistakes}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} /> Retry Misplaced Items
            </button>
          )}
        </div>

        {!isEvaluated ? (
          <button
            onClick={handleEvaluate}
            disabled={Object.keys(placedItems).length === 0}
            className="btn-primary px-8 py-3 rounded-2xl text-xs sm:text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
          >
            Verify Classifications ➔
          </button>
        ) : score === 100 ? (
          <button
            onClick={() => onComplete(score)}
            className="btn-primary px-8 py-3 rounded-2xl text-xs sm:text-sm font-800 cursor-pointer shadow-md"
          >
            Claim Rewards & Continue Mission 🚀
          </button>
        ) : null}
      </div>

      {/* Hint Text */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed"
        >
          <b>💡 Feature Recognition Principle:</b> Ask yourself what attributes define each category. Traditional software relies on exact IF-THEN rules; AI applications learn from datasets, images, voice samples, or text corpora to generalize to new instances!
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
            <h3 className="text-xl font-900 text-slate-800">Classification Mastered!</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
              You correctly categorized all items into their proper classes!
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
