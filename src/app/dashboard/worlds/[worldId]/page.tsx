"use client";

import { useState, useEffect, useMemo, Suspense, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star, Lock, CheckCircle2, ChevronRight, Trophy, Play, BookOpen, GraduationCap, AlertCircle, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import { getWorldById, getWorldsForClass } from "@/lib/missions/missionRegistry";
import { getStoredUser, getStudentClassNumber, formatClassName, DEMO_STUDENT } from "@/lib/auth";
import { getCurriculumTier } from "@/lib/missions/classCurriculum";
import ClassSelectionModal from "@/components/ClassSelectionModal";
import { isMissionCompleted, getMissionStars, isMissionUnlocked } from "@/lib/progress/progressManager";
import type { Student, World } from "@/lib/types";

function WorldContent({ params }: { params: Promise<{ worldId: string }> }) {
  const { worldId } = use(params);
  const [student, setStudent] = useState<Student>(DEMO_STUDENT);
  const [progressTick, setProgressTick] = useState(0);
  const [expandedMission, setExpandedMission] = useState<string | null>(null);
  const [showClassModal, setShowClassModal] = useState(false);

  useEffect(() => {
    const user = getStoredUser() as Student | null;
    if (user) setStudent(user);

    const handleSync = () => {
      const updated = getStoredUser() as Student | null;
      if (updated) setStudent(updated);
      setProgressTick((t) => t + 1);
    };

    window.addEventListener("tara-class-change", handleSync);
    window.addEventListener("tara-auth-change", handleSync);
    window.addEventListener("tara-progress-change", handleSync);
    return () => {
      window.removeEventListener("tara-class-change", handleSync);
      window.removeEventListener("tara-auth-change", handleSync);
      window.removeEventListener("tara-progress-change", handleSync);
    };
  }, []);

  const studentClass = getStudentClassNumber(student) ?? 8;
  const world = useMemo(() => {
    return getWorldById(worldId, studentClass) ?? getWorldsForClass(studentClass)[0];
  }, [worldId, studentClass]);

  const completedList = useMemo(() => {
    if (!world) return [];
    return world.missions.filter((m) => isMissionCompleted(m.id)).map((m) => m.id);
  }, [world, progressTick]);

  if (!world) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "#EAF5FF" }}>
        <h1 className="text-3xl font-900 text-slate-800 mb-2">World Not Found</h1>
        <p className="text-slate-500 mb-6">Could not locate world &quot;{worldId}&quot;.</p>
        <Link href="/explore" className="btn-primary px-6 py-3 rounded-2xl text-sm font-700">
          Back to World Map
        </Link>
      </div>
    );
  }

  const completed = Math.max(completedList.length, world.completedMissions);
  const total = world.totalMissions || world.missions.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const tier = getCurriculumTier(studentClass);
  const isWorldEligible = !world.classRange || (studentClass >= world.classRange[0] && studentClass <= world.classRange[1]);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation
        role="student"
        userName={student.name}
        xp={student.xp}
        streak={student.streak}
        level={student.level}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/explore" className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 transition-colors w-fit">
            <ArrowLeft size={16} /> Back to World Map
          </Link>
          <button
            onClick={() => setShowClassModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-violet-300 text-xs font-700 shadow-xs cursor-pointer transition-colors"
          >
            <GraduationCap size={14} className="text-violet-600" />
            Class {studentClass} ({tier.name})
          </button>
        </div>

        {/* Grade level warning if visiting world outside current student class */}
        {!isWorldEligible && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-800 text-xs sm:text-sm text-amber-950">
                  Different Grade Level Curriculum
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  This world is designed for{" "}
                  <strong>
                    {world.classRange ? `Classes ${world.classRange[0]}–${world.classRange[1]}` : "another grade tier"}
                  </strong>
                  . You are logged in as a <strong>{formatClassName(studentClass)}</strong> student.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowClassModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-800 text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex-shrink-0"
            >
              Change My Class
            </button>
          </div>
        )}

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
              <div className="inline-flex items-center gap-1.5 bg-white/50 text-slate-700 px-3 py-1 rounded-full text-xs font-700 mb-3">
                <Globe size={13} className="text-violet-600" />
                <span>Learning World • {world.classRange ? `Classes ${world.classRange[0]}–${world.classRange[1]}` : "Curriculum"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-900 mb-2" style={{ color: world.color }}>{world.name}</h1>
              <p className="text-slate-600 text-sm sm:text-base mb-4 leading-relaxed">{world.description}</p>

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
              <div className="flex gap-2 justify-center sm:justify-start">
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
            <h2 className="text-xl font-900 mb-4" style={{ color: "#172554" }}>
              Missions ({world.missions.length})
            </h2>
            <div className="space-y-3">
              {world.missions.map((mission, i) => {
                const isDone = completedList.includes(mission.id) || mission.isCompleted;
                const isUnlocked = isMissionUnlocked(world.id, mission.id, mission.order);
                const isLocked = !isUnlocked;
                const stars = isDone ? Math.max(getMissionStars(mission.id), mission.stars || 3) : 0;

                return (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${isLocked ? "opacity-70" : ""}`}
                  >
                    <button
                      className="w-full p-4 flex items-center gap-4 text-left cursor-pointer"
                      onClick={() => setExpandedMission(expandedMission === mission.id ? null : mission.id)}
                    >
                      {/* Mission number / status */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-800 flex-shrink-0 ${
                        isDone
                          ? "bg-green-100 text-green-700"
                          : isLocked
                            ? "bg-slate-100 text-slate-400"
                            : "bg-violet-100 text-violet-700"
                      }`}>
                        {isDone ? <CheckCircle2 size={18} className="text-green-600" /> : isLocked ? <Lock size={16} /> : mission.order}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-700 text-sm ${isLocked ? "text-slate-400" : "text-slate-800"}`}>{mission.title}</p>
                          {isDone && (
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Completed</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{mission.description}</p>
                      </div>

                      {/* Stars */}
                      <div className="flex gap-0.5 flex-shrink-0">
                        {[...Array(3)].map((_, j) => (
                          <Star key={j} size={12} className={j < stars ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
                        ))}
                      </div>

                      {/* XP */}
                      <span className="text-xs font-700 text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full ml-2">
                        +{mission.xpReward} XP
                      </span>
                      <ChevronRight size={16} className={`text-slate-300 transition-transform ${expandedMission === mission.id ? "rotate-90" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {expandedMission === mission.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-100"
                        >
                          <div className="p-4 bg-slate-50">
                            <p className="text-sm text-slate-600 mb-4">{mission.description}</p>
                            <div className="flex flex-wrap gap-4 mb-4">
                              <div className="text-xs text-slate-500">
                                <span className="font-700">Type:</span> {mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}
                              </div>
                              <div className="text-xs text-slate-500">
                                <span className="font-700">Reward:</span> +{mission.xpReward} XP
                              </div>
                              <div className="text-xs text-slate-500">
                                <span className="font-700">Est. Time:</span> ~5 mins
                              </div>
                            </div>
                            <Link href={`/dashboard/mission/${mission.id}`}>
                              <motion.button
                                className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl cursor-pointer shadow-md"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <Play size={16} />
                                {isDone ? "Replay Mission" : "Start Mission"}
                              </motion.button>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
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
                  className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-2xl font-900 border-4 mb-2 shadow-inner"
                  style={{ borderColor: world.color, color: world.color, background: world.bgColor }}
                >
                  {pct}%
                </motion.div>
                <p className="text-xs text-slate-400">{completed} of {total} missions done</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-400">Total Missions</span>
                  <span className="font-700 text-slate-700">{total}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-400">Completed</span>
                  <span className="font-700 text-green-600">{completed}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-400">Total XP Available</span>
                  <span className="font-700 text-violet-600">
                    +{world.missions.reduce((a, m) => a + m.xpReward, 0)} XP
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Learning Objectives */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-800 mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-violet-600" /> What You&apos;ll Learn
              </h3>
              <div className="space-y-2">
                {[
                  `Understand core ${world.name} concepts`,
                  "Apply skills to real-world problems",
                  "Complete interactive missions",
                  "Earn XP and unlock achievements",
                ].map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
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
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{r.icon} {r.label}</span>
                    <span className="font-700 text-amber-600">{r.reward}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Class Selection Modal */}
      {showClassModal && (
        <ClassSelectionModal
          currentClass={studentClass}
          onClose={() => setShowClassModal(false)}
          onClassSelected={(newClass) => {
            setShowClassModal(false);
            setStudent((prev) => ({
              ...prev,
              classNumber: newClass,
              class: formatClassName(newClass),
            }));
          }}
        />
      )}
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
