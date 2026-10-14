"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Star, ArrowRight, Map, CheckCircle2, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import { worlds } from "@/lib/mockData";
import { mockStudent } from "@/lib/mockData";

function WorldBadge({ icon, name, number, completed, total, isLocked, color, theme, delay }: {
  icon: string; name: string; number: number; completed: number;
  total: number; isLocked: boolean; color: string; theme: string; delay: number;
}) {
  const pct = Math.round((completed / total) * 100);
  const worldId = `world-${number}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="absolute group"
      style={{
        left: number === 1 ? "8%" : number === 2 ? "28%" : number === 3 ? "18%" : number === 4 ? "52%" : "70%",
        top: number === 1 ? "15%" : number === 2 ? "8%" : number === 3 ? "52%" : number === 4 ? "35%" : "10%",
      }}
    >
      {/* Connection line to next */}
      {number < 5 && !isLocked && (
        <div className="absolute top-1/2 left-full w-16 h-0.5 border-t-2 border-dashed border-violet-300 opacity-60" />
      )}

      <Link href={isLocked ? "#" : `/dashboard/worlds/${worldId}`}>
        <motion.div
          whileHover={!isLocked ? { scale: 1.12, y: -8 } : {}}
          whileTap={!isLocked ? { scale: 0.95 } : {}}
          className={`relative flex flex-col items-center cursor-pointer`}
        >
          {/* World marker */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-4 border-white ${
              isLocked ? "opacity-60 grayscale" : ""
            }`}
            style={{ background: color }}
          >
            {isLocked ? "🔒" : icon}
          </div>

          {/* World number badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-violet-200 flex items-center justify-center text-xs font-800 text-violet-700 shadow">
            {number}
          </div>

          {/* Stars */}
          {!isLocked && (
            <div className="absolute -bottom-1 flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(pct / 34) ? "text-yellow-400 fill-yellow-400" : "text-white"}
                />
              ))}
            </div>
          )}

          {/* Tooltip card */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileHover={{ opacity: 1, y: -5, scale: 1 }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 w-36 pointer-events-none z-20 opacity-0 group-hover:opacity-100"
          >
            <p className="text-xs font-800 text-slate-800 mb-0.5">{name}</p>
            <p className="text-xs text-slate-400">{completed}/{total} missions</p>
            {!isLocked && (
              <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
            )}
            {isLocked && <p className="text-xs text-orange-500 mt-1">🔒 Locked</p>}
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ExplorePage() {
  const [activeWorld, setActiveWorld] = useState<string | null>(null);
  const student = mockStudent;

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-700 mb-3">
            <Map size={14} /> Learning World Map
          </div>
          <h1 className="text-3xl font-900" style={{ color: "#172554" }}>Explore Learning Worlds</h1>
          <p className="text-slate-500 mt-2">Complete missions to unlock new worlds and master concepts!</p>
        </motion.div>

        {/* ── Interactive World Map ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-8"
          style={{ minHeight: 400 }}
        >
          <Image
            src="/images/world_map.jpg"
            alt="Learning World Map"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/30 to-sky-400/20" />

          {/* World Markers */}
          {worlds.map((world, i) => {
            const prog = student.worldProgress.find(p => p.worldId === world.id);
            return (
              <WorldBadge
                key={world.id}
                icon={world.icon}
                name={world.name}
                number={i + 1}
                completed={prog?.completed ?? world.completedMissions}
                total={prog?.total ?? world.totalMissions}
                isLocked={world.isLocked}
                color={world.color}
                theme={world.theme}
                delay={i * 0.15}
              />
            );
          })}

          {/* Floating clouds */}
          <motion.div
            className="absolute top-4 right-[20%] w-20 h-8 bg-white/70 rounded-full blur-sm"
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-12 left-[30%] w-16 h-6 bg-white/60 rounded-full blur-sm"
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ── World Grid Cards ──────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {worlds.map((world, i) => {
            const prog = student.worldProgress.find(p => p.worldId === world.id);
            const completed = prog?.completed ?? world.completedMissions;
            const total = prog?.total ?? world.totalMissions;
            const pct = Math.round((completed / total) * 100);

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`bg-white rounded-3xl overflow-hidden shadow-md border border-slate-100 ${world.isLocked ? "opacity-80" : ""}`}
              >
                {/* World header */}
                <div className="h-28 flex items-center justify-center text-5xl relative" style={{ background: world.bgColor }}>
                  {world.isLocked ? "🔒" : world.icon}
                  <div className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-xs font-800" style={{ color: world.color }}>
                    {i + 1}
                  </div>
                  {pct === 100 && !world.isLocked && (
                    <div className="absolute top-3 left-3 w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-800 text-slate-800 mb-1">{world.name}</h3>
                  <p className="text-xs text-slate-500 mb-3 leading-relaxed">{world.description}</p>

                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(3)].map((_, j) => (
                      <Star key={j} size={14} className={
                        !world.isLocked && j < Math.floor(pct / 34)
                          ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                      } />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">{completed}/{total}</span>
                  </div>

                  {/* Progress */}
                  {!world.isLocked && (
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: world.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                      />
                    </div>
                  )}

                  <Link href={world.isLocked ? "#" : `/dashboard/worlds/${world.id}`}>
                    <motion.button
                      className={`w-full py-2.5 rounded-xl text-sm font-700 flex items-center justify-center gap-1.5 ${
                        world.isLocked
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "text-white"
                      }`}
                      style={!world.isLocked ? { background: world.color } : {}}
                      whileHover={!world.isLocked ? { scale: 1.03 } : {}}
                      whileTap={!world.isLocked ? { scale: 0.97 } : {}}
                    >
                      {world.isLocked ? "🔒 Locked" : pct === 0 ? <>Start <ArrowRight size={14} /></> : pct === 100 ? "✅ Completed!" : <>Continue <ArrowRight size={14} /></>}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
