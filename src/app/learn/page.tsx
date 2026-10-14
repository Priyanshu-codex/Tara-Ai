"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BookOpen, Globe, Brain, Trophy, Zap, Star,
  CheckCircle2, Play, GraduationCap, ChevronRight, Sparkles,
  Bot, Target, Lock, FlaskConical
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { getStoredUser, getStudentClassNumber, formatClassName, loginAsDemo } from "@/lib/auth";
import { getCurriculumTier, CURRICULUM_TIERS_LIST, AVAILABLE_CLASSES } from "@/lib/missions/classCurriculum";
import { getWorldsForClass, getMissionsForClass } from "@/lib/missions/missionRegistry";
import ClassSelectionModal from "@/components/ClassSelectionModal";
import { isMissionCompleted, getMissionStars } from "@/lib/progress/progressManager";
import type { Student, World } from "@/lib/types";

export default function LearnPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [studentClass, setStudentClass] = useState<number>(8);
  const [showClassModal, setShowClassModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"worlds" | "activities">("worlds");

  useEffect(() => {
    const sync = () => {
      const u = getStoredUser() as Student | null;
      if (u && u.role === "student") {
        setStudent(u);
        setStudentClass(getStudentClassNumber(u) ?? 8);
      } else {
        setStudent(null);
      }
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

  const tier = getCurriculumTier(studentClass);
  const classWorlds = getWorldsForClass(studentClass);
  const classMissions = getMissionsForClass(studentClass);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation
        role={student ? "student" : null}
        userName={student?.name}
        xp={student?.xp}
        streak={student?.streak}
        level={student?.level}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-20">
        {/* ── Authenticated Student Learning Header ──────────────────────── */}
        {student ? (
          <div className="space-y-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-3xl bg-violet-100 text-violet-700 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                  {tier.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-800 text-xs flex items-center gap-1.5">
                      <GraduationCap size={13} /> Class {studentClass} • {tier.gradeRange}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 font-700 px-2.5 py-0.5 rounded-full">
                      {classMissions.length} Missions in Curriculum
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-900 text-slate-800 mb-1">
                    {tier.title} Learning Hub
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                    {tier.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <button
                  onClick={() => setShowClassModal(true)}
                  className="px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <GraduationCap size={14} /> Change School Class
                </button>
                <Link
                  href="/explore"
                  className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-800 rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Globe size={14} className="text-violet-600" /> World Map
                </Link>
              </div>
            </motion.div>

            {/* Curriculum Focus Topics */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-700 text-slate-400 whitespace-nowrap">Core Learning Topics:</span>
              {tier.focusTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-white rounded-xl text-xs font-700 text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap"
                >
                  ✓ {topic}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* ── Public Visitor Header ───────────────────────────────────── */
          <section className="relative overflow-hidden py-12 px-4 text-center rounded-3xl bg-white shadow-sm border border-slate-100 mb-8">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-xs font-700 mb-4">
                <BookOpen size={14} /> The TARA AI Learning System
              </div>
              <h1 className="text-3xl sm:text-5xl font-900 text-slate-800 mb-3">
                Class-Wise Adaptive AI Learning
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mb-6 max-w-2xl mx-auto">
                Tailored AI education for school students across Classes 1 to 12. Learn patterns, algorithms, machine learning models, and responsible innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    loginAsDemo();
                    window.location.href = "/dashboard";
                  }}
                  className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-800 cursor-pointer shadow-md"
                >
                  <Zap size={16} /> Try Instant Demo Learning
                </button>
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 rounded-2xl bg-white text-slate-700 font-800 text-sm border-2 border-slate-200 hover:border-violet-300 transition-colors flex items-center justify-center gap-2"
                >
                  Create Student Account <ArrowRight size={16} />
                </Link>
                <Link
                  href="/explore"
                  className="px-6 py-3 rounded-2xl bg-violet-50 text-violet-700 font-800 text-sm hover:bg-violet-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Globe size={16} /> Explore World Map
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Learning Worlds & Missions Grid ───────────────────────────── */}
        <section className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-900 text-slate-800">
                {student ? `Class ${studentClass} Worlds & Missions` : "Educational Curriculum Worlds"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {student
                  ? `Structured progressive missions for ${tier.name}`
                  : "Explore the 5 progressive curriculum tiers for primary to senior school"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {classWorlds.map((world, worldIdx) => {
              const liveCompleted = world.missions.filter((m) => isMissionCompleted(m.id)).length;
              const total = world.totalMissions || world.missions.length;
              const pct = total > 0 ? Math.round((liveCompleted / total) * 100) : 0;

              return (
                <motion.div
                  key={world.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: worldIdx * 0.1 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100"
                >
                  {/* World Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner flex-shrink-0"
                        style={{ background: world.bgColor }}
                      >
                        {world.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-xs font-800 text-white px-2.5 py-0.5 rounded-full"
                            style={{ background: world.color }}
                          >
                            World {worldIdx + 1}
                          </span>
                          <span className="text-xs text-slate-500 font-700">
                            {world.classRange ? `Classes ${world.classRange[0]}–${world.classRange[1]}` : tier.gradeRange}
                          </span>
                        </div>
                        <h3 className="text-xl font-900 text-slate-800">{world.name}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{world.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-600 block">Progress</span>
                        <span className="text-sm font-900" style={{ color: world.color }}>
                          {liveCompleted}/{total} Completed
                        </span>
                      </div>
                      <Link href={`/dashboard/worlds/${world.id}`}>
                        <button
                          className="px-4 py-2.5 rounded-xl text-xs font-800 text-white flex items-center gap-1.5 shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ background: world.color }}
                        >
                          View World Details <ArrowRight size={13} />
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Missions List inside this world */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {world.missions.map((mission) => {
                      const completed = isMissionCompleted(mission.id);
                      const stars = completed ? getMissionStars(mission.id) || 3 : 0;

                      return (
                        <Link
                          key={mission.id}
                          href={`/dashboard/mission/${mission.id}`}
                          className="p-4 rounded-2xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200/80 hover:border-violet-300 transition-all flex flex-col justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-800 text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-md">
                                Mission {mission.order}
                              </span>
                              <span className="text-[11px] font-800 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                +{mission.xpReward} XP
                              </span>
                            </div>

                            <h4 className="text-sm font-800 text-slate-800 group-hover:text-violet-700 transition-colors mb-1 line-clamp-1">
                              {mission.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                              {mission.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                            <span className="text-slate-400 font-600 capitalize">
                              {mission.type}
                            </span>
                            {completed ? (
                              <span className="flex items-center gap-1 text-green-700 font-800">
                                <CheckCircle2 size={13} className="text-green-600" /> Done ({stars}⭐)
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-violet-600 font-800 group-hover:translate-x-1 transition-transform">
                                Start <Play size={11} className="fill-violet-600" />
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Interactive Learning Modes ─────────────────────────────────── */}
        <section className="py-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-900 text-slate-800">Interactive Learning Modes</h2>
            <p className="text-xs sm:text-sm text-slate-500">Multiple ways to practice, explore, and build AI literacy</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Tara AI Tutor",
                desc: "Ask anything about AI concepts and get age-appropriate explanations and hints.",
                href: "/dashboard/ai-tutor",
                icon: "🤖",
                color: "#6941F5",
              },
              {
                title: "Interactive AI Lab",
                desc: "Train machine learning models with simulated datasets and live feedback.",
                href: "/dashboard/ai-lab",
                icon: "🔬",
                color: "#22C55E",
              },
              {
                title: "Daily Knowledge Quiz",
                desc: "Test your skills with progressive quizzes and level up your mastery.",
                href: "/dashboard/quiz",
                icon: "📝",
                color: "#3B82F6",
              },
              {
                title: "Real-World Challenges",
                desc: "Apply AI ethics and decision making to solve authentic real-world problems.",
                href: "/challenges",
                icon: "🌍",
                color: "#F59E0B",
              },
            ].map((mode) => (
              <Link key={mode.title} href={mode.href} className="block">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full cursor-pointer"
                >
                  <div>
                    <div className="text-4xl mb-3">{mode.icon}</div>
                    <h3 className="font-800 text-slate-800 text-base mb-1.5">{mode.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{mode.desc}</p>
                  </div>
                  <span
                    className="text-xs font-800 flex items-center gap-1"
                    style={{ color: mode.color }}
                  >
                    Launch Activity <ChevronRight size={14} />
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Class Selection Modal */}
      {showClassModal && (
        <ClassSelectionModal
          currentClass={studentClass}
          onClose={() => setShowClassModal(false)}
          onClassSelected={(newClass) => {
            setShowClassModal(false);
            setStudentClass(newClass);
          }}
        />
      )}
    </div>
  );
}
