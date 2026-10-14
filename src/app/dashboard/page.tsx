"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star, Flame, BookOpen, Globe, Trophy, Brain, FlaskConical,
  Play, ArrowRight, Lock, CheckCircle2, TrendingUp, Target
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { worlds, learningActivities, recentAchievements } from "@/lib/mockData";
import { getStoredUser, loginAsDemo, logout, DEMO_STUDENT } from "@/lib/auth";
import type { Student } from "@/lib/types";

function XPBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full xp-gradient"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}

function WorldCard({ world, progress }: { world: typeof worlds[0]; progress?: { completed: number; total: number } }) {
  const completed = progress?.completed ?? world.completedMissions;
  const total = progress?.total ?? world.totalMissions;
  const pct = Math.round((completed / total) * 100);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group"
    >
      {/* World banner */}
      <div className="h-24 relative flex items-center justify-center" style={{ background: world.bgColor }}>
        <span className="text-5xl">{world.icon}</span>
        {world.isLocked && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
            <Lock size={24} className="text-white" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 rounded-lg px-2 py-1">
          <span className="text-xs font-700" style={{ color: world.color }}>{completed}/{total}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-800 text-slate-800 mb-1 text-sm">{world.name}</h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-1">{world.description}</p>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ background: world.color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <Link href={world.isLocked ? "#" : `/dashboard/worlds/${world.id}`}>
          <motion.button
            className={`w-full py-2 rounded-xl text-xs font-700 transition-all ${
              world.isLocked
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : pct === 100
                  ? "bg-green-100 text-green-700"
                  : "text-white"
            }`}
            style={!world.isLocked && pct < 100 ? { background: world.color } : {}}
            whileHover={!world.isLocked ? { scale: 1.03 } : {}}
          >
            {world.isLocked ? "🔒 Locked" : pct === 100 ? "✅ Completed!" : "Continue"}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

function ActivityCard({ activity }: { activity: typeof learningActivities[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 transition-transform group-hover:scale-110" style={{ background: activity.color + "20" }}>
        {activity.icon}
      </div>
      <h4 className="text-xs font-800 text-slate-800 mb-0.5">{activity.title}</h4>
      <p className="text-xs text-slate-400 mb-2">{activity.subject}</p>
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <span style={{ color: activity.color }}>+{activity.xp} XP</span>
        <span>•</span>
        <span>{activity.duration}m</span>
      </div>
    </motion.div>
  );
}

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student>(DEMO_STUDENT);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (user && user.role === "student") {
      setStudent(user as Student);
      setIsDemo(Boolean(user.isDemo));
    } else {
      // Auto-fallback to Demo Student Account for immediate seamless testing
      const demo = loginAsDemo();
      setStudent(demo);
      setIsDemo(true);
    }
  }, []);

  const xpNeeded = 500;
  const currentXP = student.xp;

  const subjects = [
    { name: "Mathematics", topic: "Linear Equations", progress: 70, color: "#6941F5" },
    { name: "Science", topic: "Photosynthesis", progress: 40, color: "#22C55E" },
    { name: "English", topic: "Reading Comprehension", progress: 85, color: "#3B82F6" },
    { name: "Social Science", topic: "Independence Movement", progress: 30, color: "#F59E0B" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation
        role="student"
        userName={student.name}
        xp={student.xp}
        streak={student.streak}
        level={student.level}
        isDemo={isDemo}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Demo Mode Indicator Banner ─────────────────────────────────── */}
        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-amber-50 via-amber-100/80 to-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-xs font-900 text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  Demo Student Active
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </p>
                <p className="text-xs text-amber-700">
                  Exploring TARA as <strong>{student.name}</strong> ({student.class}) • Full access to learning worlds, AI Tutor, and quizzes. Data is isolated to this session.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                window.location.href = "/auth/login";
              }}
              className="text-xs font-800 text-amber-900 hover:text-black bg-white hover:bg-amber-100/50 px-4 py-2 rounded-xl border border-amber-300 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
            >
              Exit Demo Mode
            </button>
          </motion.div>
        )}

        {/* ── Greeting & Stats ──────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-5 mb-6">
          {/* Welcome card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 rounded-3xl p-6 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -right-4 bottom-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10">
              <p className="text-violet-200 text-sm font-600 mb-1">Good Morning, {student.name.split(" ")[0]}! 👋</p>
              <h1 className="text-xl font-900 mb-1">Let&apos;s make today a productive learning day.</h1>
              <p className="text-violet-200 text-xs mb-4">You&apos;re on a {student.streak}-day streak! Keep it up! 🔥</p>

              {/* XP progress */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-violet-200 mb-1">
                  <span>Level {student.level} Progress</span>
                  <span>{currentXP}/{xpNeeded} XP</span>
                </div>
                <XPBar current={currentXP} max={xpNeeded} />
              </div>
            </div>
          </motion.div>

          {/* Stat cards */}
          {[
            { label: "Learning Streak", value: `${student.streak} Days`, icon: "🔥", color: "#EA580C", bg: "from-orange-50 to-amber-50", border: "border-orange-100" },
            { label: "AI Explorer", value: `Level ${student.level}`, icon: "⭐", color: "#6941F5", bg: "from-violet-50 to-purple-50", border: "border-violet-100" },
            { label: "XP Earned", value: `${currentXP}/500`, icon: "💎", color: "#3B82F6", bg: "from-blue-50 to-sky-50", border: "border-blue-100" },
            { label: "Missions Done", value: `${student.missionsCompleted}`, icon: "✅", color: "#22C55E", bg: "from-green-50 to-emerald-50", border: "border-green-100" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border ${stat.border} flex items-center gap-4`}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-white shadow-sm">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500 font-600">{stat.label}</p>
                <p className="text-2xl font-900" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Main column ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Your Journey */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-900" style={{ color: "#172554" }}>Continue Your Journey</h2>
                <Link href="/dashboard/worlds" className="text-sm text-violet-600 font-700 flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {/* Subject progress cards */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {subjects.map((subj, i) => (
                  <motion.div
                    key={subj.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                  >
                    <p className="text-xs font-600 text-slate-400 mb-1">{subj.name}</p>
                    <p className="text-sm font-700 text-slate-800 mb-3">{subj.topic}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: subj.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${subj.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-xs font-700" style={{ color: subj.color }}>{subj.progress}%</span>
                    </div>
                    <Link href="/dashboard/worlds">
                      <motion.button
                        className="mt-3 w-full py-2 rounded-xl text-xs font-700 border-2 transition-all"
                        style={{ borderColor: subj.color, color: subj.color }}
                        whileHover={{ background: subj.color, color: "white" }}
                      >
                        Continue
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* World Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {worlds.map((world) => {
                  const prog = student.worldProgress.find(p => p.worldId === world.id);
                  return <WorldCard key={world.id} world={world} progress={prog} />;
                })}
              </div>
            </motion.div>

            {/* Daily Goal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Target size={20} className="text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-900" style={{ color: "#172554" }}>Daily Learning Goal</h2>
                    <p className="text-xs text-slate-400">Complete {student.weeklyGoal} missions this week</p>
                  </div>
                </div>
                <span className="text-sm font-700 text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                  {student.weeklyProgress}/{student.weeklyGoal}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #6941F5, #22C55E)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(student.weeklyProgress / student.weeklyGoal) * 100}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>{student.weeklyProgress} missions done</span>
                <span>{student.weeklyGoal - student.weeklyProgress} remaining</span>
              </div>
            </motion.div>
          </div>

          {/* ── Sidebar column ─────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Quick actions */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-xl font-900 mb-4" style={{ color: "#172554" }}>Recommended for You</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "🤖", label: "AI Basics", sub: "Learn how AI works", href: "/dashboard/worlds/world-1", color: "#6941F5" },
                  { icon: "📝", label: "Daily Quiz", sub: "Test your knowledge", href: "/dashboard/quiz", color: "#22C55E" },
                  { icon: "🌍", label: "Real World Challenge", sub: "Solve real problems", href: "/challenges", color: "#3B82F6" },
                  { icon: "🏆", label: "Earn Certificates", sub: "Show your progress", href: "/achievements", color: "#FBBF24" },
                ].map((item, i) => (
                  <Link key={item.label} href={item.href}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-pointer"
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <p className="text-xs font-800 text-slate-800 leading-tight">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Quick access buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-800 mb-4">Quick Access</h3>
              <div className="space-y-2">
                {[
                  { icon: <Brain size={18} />, label: "AI Tutor", href: "/dashboard/ai-tutor", color: "#6941F5" },
                  { icon: <FlaskConical size={18} />, label: "AI Lab", href: "/dashboard/ai-lab", color: "#22C55E" },
                  { icon: <BookOpen size={18} />, label: "My Missions", href: "/dashboard/worlds", color: "#3B82F6" },
                  { icon: <Globe size={18} />, label: "Challenges", href: "/challenges", color: "#F59E0B" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.color + "20", color: item.color }}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-700 text-slate-700">{item.label}</span>
                      <ArrowRight size={14} className="text-slate-300 ml-auto" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-800 text-slate-800">Recent Achievements</h3>
                <Link href="/achievements" className="text-xs text-violet-600 font-700">View All</Link>
              </div>
              <div className="space-y-3">
                {recentAchievements.map((ach, i) => (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-lg">{ach.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-700 text-slate-700 truncate">{ach.title}</p>
                      <p className="text-xs text-slate-400">{ach.date}</p>
                    </div>
                    <span className="text-xs font-700 text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">+{ach.xp} XP</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
