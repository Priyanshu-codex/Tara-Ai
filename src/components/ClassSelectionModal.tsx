"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Sparkles, Check, X, ArrowRight, BookOpen } from "lucide-react";
import { CURRICULUM_TIERS, AVAILABLE_CLASSES, getCurriculumTier } from "@/lib/missions/classCurriculum";
import { updateUserClass, formatClassName } from "@/lib/auth";

interface ClassSelectionModalProps {
  isOpen?: boolean;
  currentClass?: number | null;
  onClose: () => void;
  onClassSelected?: (newClassNumber: number) => void;
}

export default function ClassSelectionModal({
  isOpen = true,
  currentClass,
  onClose,
  onClassSelected,
}: ClassSelectionModalProps) {
  const [selectedClass, setSelectedClass] = useState<number>(currentClass || 8);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const currentTier = getCurriculumTier(selectedClass);

  const handleSave = async () => {
    setIsSaving(true);
    updateUserClass(selectedClass);

    // Call API to persist to backend
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classNumber: selectedClass }),
      });
    } catch (err) {
      console.warn("Backend profile sync notice:", err);
    }

    if (onClassSelected) {
      onClassSelected(selectedClass);
    }
    setIsSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-violet-50 to-indigo-50/50 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-900 text-slate-900">Select Your School Class</h3>
                <p className="text-xs text-slate-500">
                  TARA AI adapts missions, learning worlds, and quizzes specifically to your grade level.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white/80 rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Class Number Grid (1 to 12) */}
            <div>
              <label className="block text-xs font-800 text-slate-700 uppercase tracking-wider mb-2.5">
                Choose Grade (Classes 1 to 12)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {AVAILABLE_CLASSES.map((c) => {
                  const isSelected = selectedClass === c;
                  const tier = getCurriculumTier(c);
                  return (
                    <motion.button
                      key={c}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedClass(c)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer border-2 ${
                        isSelected
                          ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200"
                          : "border-slate-200 bg-slate-50/60 hover:bg-violet-50 hover:border-violet-300 text-slate-700"
                      }`}
                    >
                      <span className="text-xs font-600 opacity-80">Class</span>
                      <span className="text-lg font-900 leading-tight">{c}</span>
                      <span
                        className="w-2 h-2 rounded-full mt-1"
                        style={{ backgroundColor: isSelected ? "#ffffff" : tier.color }}
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Selected Tier Preview Card */}
            <div
              className="rounded-3xl p-5 border-2 transition-all relative overflow-hidden"
              style={{
                backgroundColor: currentTier.color + "10",
                borderColor: currentTier.color + "40",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ backgroundColor: currentTier.color + "25" }}
                  >
                    {currentTier.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-900 text-slate-900 text-base">{currentTier.name}</h4>
                      <span
                        className="text-[11px] font-800 px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: currentTier.color }}
                      >
                        {formatClassName(selectedClass)}
                      </span>
                    </div>
                    <p className="text-xs font-700 text-slate-500">
                      {currentTier.ageRangeLabel} • {currentTier.classRangeLabel}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 mb-4 leading-relaxed font-500">
                {currentTier.description}
              </p>

              <div>
                <span className="text-[11px] font-800 text-slate-600 uppercase tracking-wide block mb-2">
                  Curriculum Learning Focus:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentTier.focusTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-xl font-700 text-slate-800 flex items-center gap-1 shadow-xs"
                    >
                      <Check size={12} className="text-violet-600" />
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-700 text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary px-7 py-2.5 rounded-xl text-xs font-800 flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSaving ? "Saving..." : `Confirm ${formatClassName(selectedClass)}`}
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
