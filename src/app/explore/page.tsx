"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Star, ArrowRight, Map, CheckCircle2, ChevronRight, GraduationCap, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent } from "@/lib/mockData";
import { getStoredUser, getStudentClassNumber, formatClassName, updateUserClass } from "@/lib/auth";
import { CURRICULUM_TIERS, CURRICULUM_TIERS_LIST, getCurriculumTier, AVAILABLE_CLASSES } from "@/lib/missions/classCurriculum";
import { getWorldsForClass } from "@/lib/missions/missionRegistry";
import ClassSelectionModal from "@/components/ClassSelectionModal";
import { isMissionCompleted } from "@/lib/progress/progressManager";
import type { Student, World } from "@/lib/types";

function WorldBadge({
  world,
  number,
  completed,
  total,
  delay,
  totalCount,
}: {
  world: World;
  number: number;
  completed: number;
  total: number;
  delay: number;
  totalCount: number;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Distribute positions nicely whether there are 1, 3, or 5 worlds
  const positions = [
    { left: "12%", top: "25%" },
    { left: "32%", top: "15%" },
    { left: "50%", top: "45%" },
    { left: "68%", top: "20%" },
    { left: "85%", top: "35%" },
  ];
  const pos = positions[(number - 1) % positions.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="absolute group z-10"
      style={{ left: pos.left, top: pos.top }}
    >
      {/* Connection line to next */}
      {number < totalCount && (
        <div className="absolute top-1/2 left-full w-12 sm:w-16 h-0.5 border-t-2 border-dashed border-violet-300 opacity-60 hidden sm:block" />
      )}

      <Link href={world.isLocked ? "#" : `/dashboard/worlds/${world.id}`}>
        <motion.div
          whileHover={!world.isLocked ? { scale: 1.12, y: -8 } : {}}
          whileTap={!world.isLocked ? { scale: 0.95 } : {}}
          className="relative flex flex-col items-center cursor-pointer"
        >
          {/* World marker */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-4 border-white ${
              world.isLocked ? "opacity-60 grayscale" : ""
            }`}
            style={{ background: world.color }}
          >
            {world.isLocked ? "🔒" : world.icon}
          </div>

          {/* World number badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-violet-200 flex items-center justify-center text-xs font-800 text-violet-700 shadow-sm">
            {number}
          </div>

          {/* Stars */}
          {!world.isLocked && (
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
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 w-40 pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <p className="text-xs font-800 text-slate-800 mb-0.5 truncate">{world.name}</p>
            <p className="text-xs text-slate-400">{completed}/{total} missions</p>
            {!world.isLocked && (
              <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: world.color }} />
              </div>
            )}
            {world.isLocked && <p className="text-xs text-orange-500 mt-1">🔒 Locked</p>}
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function ExplorePage() {
  const [student, setStudent] = useState<Student>(mockStudent);
  const [studentClass, setStudentClass] = useState<number>(8);
  const [viewingClass, setViewingClass] = useState<number>(8);
  const [showClassModal, setShowClassModal] = useState(false);
  const [progressTick, setProgressTick] = useState(0);

  useEffect(() => {
    const sync = () => {
      const u = getStoredUser() as Student | null;
      if (u && u.role === "student") {
        setStudent((prev) => ({ ...prev, ...u }));
        const cls = getStudentClassNumber(u) ?? 8;
        setStudentClass(cls);
        setViewingClass(cls);
      }
      setProgressTick((t) => t + 1);
    };

    sync();
    window.addEventListener("tara-auth-change", sync);
    window.addEventListener("tara-class-change", sync);
    window.addEventListener("tara-progress-change", sync);
    return () => {
      window.removeEventListener("tara-auth-change", sync);
      window.removeEventListener("tara-class-change", sync);
      window.removeEventListener("tara-progress-change", sync);
    };
  }, []);

  const viewingTier = getCurriculumTier(viewingClass);
  const activeWorlds = getWorldsForClass(viewingClass);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation
        role="student"
        userName={student.name}
        xp={student.xp}
        streak={student.streak}
        level={student.level}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-700 mb-2">
            <Map size={14} /> Adaptive Learning Universe
          </div>
          <h1 className="text-2xl sm:text-3xl font-900 text-slate-800">Explore Learning Worlds</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            Class-tailored educational curriculum from primary school foundations to senior machine learning engineering.
          </p>
        </motion.div>

        {/* ── Curriculum Tier Filter & Enrolled Class Bar ─────────────────── */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-700 text-slate-400 mr-1">Curriculum Tier:</span>
            {CURRICULUM_TIERS_LIST.map((tier) => {
              const isSelected = tier.id === viewingTier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => setViewingClass(tier.classes[0])}
                  className={`px-3 py-1.5 rounded-xl text-xs font-800 transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <span>{tier.icon}</span>
                  <span>{tier.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {tier.gradeRange}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-end">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-600">Your Enrolled Profile</span>
              <span className="text-xs font-900 text-violet-700">Class {studentClass}</span>
            </div>
            <button
              onClick={() => setShowClassModal(true)}
              className="px-3.5 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <GraduationCap size={14} /> Switch Class
            </button>
          </div>
        </div>

        {/* ── Interactive World Map ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden shadow-xl mb-8 border-4 border-white"
          style={{ minHeight: 380 }}
        >
          <Image src="/images/world_map.jpg" alt="Learning World Map" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-sky-300/30 via-sky-200/20 to-sky-400/30" />

          {/* Map Header Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-xs border border-white">
            <div className="flex items-center gap-2">
              <span className="text-xl">{viewingTier.icon}</span>
              <div>
                <p className="text-xs font-900 text-slate-800">
                  {viewingTier.title} ({viewingTier.gradeRange})
                </p>
                <p className="text-[11px] text-slate-500">{activeWorlds.length} Learning Worlds Available</p>
              </div>
            </div>
          </div>

          {/* World Markers */}
          {activeWorlds.map((world, i) => {
            const liveCompleted = world.missions.filter((m) => isMissionCompleted(m.id)).length;
            const completed = Math.max(liveCompleted, world.completedMissions || 0);
            const total = world.totalMissions || world.missions.length;

            return (
              <WorldBadge
                key={world.id}
                world={world}
                number={i + 1}
                completed={completed}
                total={total}
                delay={i * 0.15}
                totalCount={activeWorlds.length}
              />
            );
          })}

          {/* Floating clouds */}
          <motion.div
            className="absolute top-4 right-[20%] w-20 h-8 bg-white/70 rounded-full blur-xs pointer-events-none"
            animate={{ x: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-12 left-[30%] w-16 h-6 bg-white/60 rounded-full blur-xs pointer-events-none"
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ── World Grid Cards ──────────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeWorlds.map((world, i) => {
            const liveCompleted = world.missions.filter((m) => isMissionCompleted(m.id)).length;
            const completed = Math.max(liveCompleted, world.completedMissions || 0);
            const total = world.totalMissions || world.missions.length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between ${
                  world.isLocked ? "opacity-80" : ""
                }`}
              >
                {/* World header */}
                <div>
                  <div
                    className="h-28 flex items-center justify-center text-5xl relative"
                    style={{ background: world.bgColor }}
                  >
                    {world.isLocked ? "🔒" : world.icon}
                    <div
                      className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-xs font-800"
                      style={{ color: world.color }}
                    >
                      {i + 1}
                    </div>
                    {pct === 100 && !world.isLocked && (
                      <div className="absolute top-3 left-3 w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center shadow-xs">
                        <CheckCircle2 size={16} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-900 text-slate-800 text-base">{world.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed line-clamp-2">
                      {world.description}
                    </p>

                    {/* Progress details */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span>{completed}/{total} Missions Done</span>
                      <span className="font-800" style={{ color: world.color }}>{pct}%</span>
                    </div>

                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: world.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link href={`/dashboard/worlds/${world.id}`} className="block">
                    <motion.button
                      className="w-full py-2.5 rounded-xl text-xs font-800 text-white flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-transform"
                      style={{ background: world.color }}
                      whileHover={{ scale: 1.02 }}
                    >
                      Enter World <ChevronRight size={14} />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Class Selection Modal */}
      {showClassModal && (
        <ClassSelectionModal
          currentClass={studentClass}
          onClose={() => setShowClassModal(false)}
          onClassSelected={(newClass) => {
            setShowClassModal(false);
            setStudentClass(newClass);
            setViewingClass(newClass);
            updateUserClass(newClass);
          }}
        />
      )}
    </div>
  );
}
