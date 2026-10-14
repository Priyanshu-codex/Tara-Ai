"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Lock, CheckCircle2, ChevronRight, Trophy, Play, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import { worlds } from "@/lib/mockData";
import { mockStudent } from "@/lib/mockData";
import { Suspense, use } from "react";

function WorldContent({ params }: { params: Promise<{ worldId: string }> }) {
  const { worldId } = use(params);
  const world = worlds.find(w => w.id === worldId) ?? worlds[0];
  const student = mockStudent;
  const progress = student.worldProgress.find(p => p.worldId === worldId);
  const completed = progress?.completed ?? world.completedMissions;
  const total = progress?.total ?? world.totalMissions;
  const pct = Math.round((completed / total) * 100);

  const [expandedMission, setExpandedMission] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <Link href="/explore" className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to World Map
        </Link>

        {/* World Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden mb-6 shadow-xl"
          style={{ background: world.bgColor }}
        >
          <div className="p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-8">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl sm:text-9xl"
            >
              {world.icon}
            </motion.div>
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 bg-white/50 text-slate-700 px-3 py-1 rounded-full text-xs font-700 mb-3">
                🌍 Learning World
              </div>
              <h1 className="text-4xl font-900 mb-2" style={{ color: world.color }}>{world.name}</h1>
              <p className="text-slate-600 text-lg mb-4">{world.description}</p>

              {/* Progress */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: world.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm font-700" style={{ color: world.color }}>{completed}/{total} Missions</span>
              </div>

              {/* Stars */}
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} size={22} className={i < Math.floor(pct / 34) ? "text-yellow-400 fill-yellow-400" : "text-white/40"} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Missions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-900 mb-4" style={{ color: "#172554" }}>Missions</h2>
            <div className="space-y-3">
              {world.missions.map((mission, i) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${mission.isLocked ? "opacity-70" : ""}`}
                >
                  <button
                    className="w-full p-4 flex items-center gap-4 text-left"
                    onClick={() => setExpandedMission(expandedMission === mission.id ? null : mission.id)}
                    disabled={mission.isLocked}
                  >
                    {/* Mission number / status */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                      mission.isCompleted
                        ? "bg-green-100"
                        : mission.isLocked
                          ? "bg-slate-100"
                          : "bg-violet-100"
                    }`}>
                      {mission.isCompleted ? "✅" : mission.isLocked ? "🔒" : mission.order}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-700 text-sm ${mission.isLocked ? "text-slate-400" : "text-slate-800"}`}>{mission.title}</p>
                      <p className="text-xs text-slate-400 truncate">{mission.description}</p>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 flex-shrink-0">
                      {[...Array(3)].map((_, j) => (
                        <Star key={j} size={12} className={j < mission.stars ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
                      ))}
                    </div>

                    {/* XP */}
                    <span className="text-xs font-700 text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full ml-2">
                      +{mission.xpReward} XP
                    </span>
                    {!mission.isLocked && <ChevronRight size={16} className={`text-slate-300 transition-transform ${expandedMission === mission.id ? "rotate-90" : ""}`} />}
                  </button>

                  <AnimatePresence>
                    {expandedMission === mission.id && !mission.isLocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100"
                      >
                        <div className="p-4 bg-slate-50">
                          <p className="text-sm text-slate-600 mb-4">{mission.description}</p>
                          <div className="flex gap-4 mb-4">
                            <div className="text-xs text-slate-500">
                              <span className="font-700">Type:</span> {mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}
                            </div>
                            <div className="text-xs text-slate-500">
                              <span className="font-700">Reward:</span> +{mission.xpReward} XP
                            </div>
                          </div>
                          <Link href={mission.type === "pattern" ? "/dashboard/mission/spot-the-pattern" : "#"}>
                            <motion.button
                              className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl"
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <Play size={16} />
                              {mission.isCompleted ? "Replay Mission" : "Start Mission"}
                            </motion.button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar: World Info */}
          <div className="space-y-4">
            {/* World Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-800 mb-4">World Progress</h3>
              <div className="text-center mb-4">
                <motion.div
                  className="text-6xl font-900 mb-1"
                  style={{ color: world.color }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {pct}%
                </motion.div>
                <p className="text-sm text-slate-500">{completed} of {total} missions</p>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: world.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <Link href={`/dashboard/mission/spot-the-pattern`}>
                <motion.button
                  className="w-full py-3 rounded-2xl text-sm font-700 text-white shadow-md"
                  style={{ background: world.color }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {pct === 0 ? "🚀 Start World" : pct === 100 ? "✅ World Complete!" : "▶ Continue"}
                </motion.button>
              </Link>
            </motion.div>

            {/* Learning Objectives */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-800 mb-4">🎯 Learning Objectives</h3>
              <div className="space-y-2">
                {[
                  `Understand core ${world.name} concepts`,
                  "Apply skills to real-world problems",
                  "Complete interactive missions",
                  "Earn XP and unlock achievements",
                ].map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    {obj}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rewards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-5 border border-yellow-100"
            >
              <h3 className="font-800 text-slate-800 mb-4">🏆 World Rewards</h3>
              <div className="space-y-2">
                {[
                  { icon: "💎", label: "Complete all missions", reward: `+${world.missions.reduce((a, m) => a + m.xpReward, 0)} XP` },
                  { icon: "🥇", label: "3-star all missions", reward: "Gold Badge" },
                  { icon: "🎓", label: "100% completion", reward: "Certificate" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{r.icon} {r.label}</span>
                    <span className="font-700 text-amber-600">{r.reward}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function WorldDetailPage({ params }: { params: Promise<{ worldId: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sky-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-violet-700 font-700 text-sm">Loading learning world...</p>
          </div>
        </div>
      }
    >
      <WorldContent params={params} />
    </Suspense>
  );
}
