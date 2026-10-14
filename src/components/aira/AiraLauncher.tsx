"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";
import { useAira } from "./AiraContext";

export default function AiraLauncher() {
  const { isOpen, toggleOpen, missionContext } = useAira();

  if (isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none"
    >
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white pl-3.5 pr-4 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md cursor-pointer transition-shadow hover:shadow-violet-500/30"
        style={{
          boxShadow:
            "0 12px 30px -5px rgba(105, 65, 245, 0.4), 0 4px 10px rgba(0, 0, 0, 0.05)",
        }}
        aria-label="Open Tara AI Learning Buddy"
      >
        {/* Animated Robot Avatar Container */}
        <div className="relative">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <Bot size={18} className="text-white group-hover:rotate-12 transition-transform" />
          </div>
          {/* Online ping dot */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400 border border-violet-700" />
          </span>
        </div>

        {/* Text Label */}
        <div className="text-left">
          <div className="flex items-center gap-1 leading-tight">
            <span className="font-800 text-sm tracking-wide">Tara</span>
            <Sparkles size={11} className="text-amber-300" />
          </div>
          <span className="text-[10px] text-violet-200 block font-600 leading-tight">
            {missionContext ? "Mission Clues" : "Learning Buddy"}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}
