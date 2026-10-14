"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { TrendingUp, Target, BookOpen, Brain, ArrowRight, Sparkles, Bot, Zap, Trophy, FlaskConical, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent, weeklyData, monthlyData, subjectPerformance } from "@/lib/mockData";
import { getStoredUser } from "@/lib/auth";
import type { Student } from "@/lib/types";
import Link from "next/link";

type Filter = "weekly" | "monthly" | "overall";

const overallData = [
  { day: "Oct W1", xp: 280, minutes: 180 },
  { day: "Oct W2", xp: 350, minutes: 220 },
  { day: "Oct W3", xp: 420, minutes: 280 },
  { day: "Oct W4", xp: 390, minutes: 255 },
  { day: "Nov W1", xp: 450, minutes: 300 },
  { day: "Nov W2", xp: 480, minutes: 320 },
];

const quizData = [
  { subject: "AI", accuracy: 88 },
  { subject: "Math", accuracy: 76 },
  { subject: "Science", accuracy: 82 },
  { subject: "English", accuracy: 70 },
];

const revisionTopics = [
  { topic: "Linear Equations", subject: "Mathematics", score: 45, color: "#EF4444" },
  { topic: "Chemical Bonding", subject: "Science", score: 52, color: "#F59E0B" },
  { topic: "Essay Writing", subject: "English", score: 58, color: "#3B82F6" },
];

const nextSteps = [
  { icon: <Sparkles size={18} className="text-violet-600" />, label: "Spot the Pattern Mission", href: "/dashboard/mission/m1-2", color: "#6941F5" },
  { icon: <Brain size={18} className="text-purple-600" />, label: "Machine Learning World", href: "/dashboard/worlds/world-2", color: "#7C3AED" },
  { icon: <Bot size={18} className="text-emerald-600" />, label: "Ask AI Tutor", href: "/dashboard/ai-tutor", color: "#22C55E" },
];

export default function ProgressPage() {
  const [student, setStudent] = useState(mockStudent);
  const [filter, setFilter] = useState<Filter>("weekly");

  useEffect(() => {
    const sync = () => {
      const u = getStoredUser();
      if (u && u.role === "student") {
        setStudent(prev => ({ ...prev, ...(u as Student) }));
      }
    };
    sync();
    window.addEventListener("tara-auth-change", sync);
    window.addEventListener("tara-progress-change", sync);
    return () => {
      window.removeEventListener("tara-auth-change", sync);
      window.removeEventListener("tara-progress-change", sync);
    };
  }, []);

  const chartData = filter === "weekly" ? weeklyData : filter === "monthly" ? monthlyData : overallData;

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-900" style={{ color: "#172554" }}>My Learning Progress</h1>
          <p className="text-slate-500 mt-1">Track your learning journey and identify areas for growth</p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(["weekly", "monthly", "overall"] as Filter[]).map(f => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-700 capitalize transition-all ${
                filter === f ? "bg-violet-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Activity Chart ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-900" style={{ color: "#172554" }}>Learning Activity</h2>
                <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full font-600">XP Earned</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "white", border: "none", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                    labelStyle={{ color: "#172554", fontWeight: 700 }}
                  />
                  <Bar dataKey="xp" fill="#6941F5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quiz Accuracy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-900 mb-5" style={{ color: "#172554" }}>Quiz Accuracy</h2>
              <div className="space-y-3">
                {quizData.map((q, i) => (
                  <div key={q.subject}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-600 text-slate-700">{q.subject}</span>
                      <span className="font-700 text-violet-600">{q.accuracy}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #6941F5, #8B5CF6)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${q.accuracy}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mission Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-900 mb-4" style={{ color: "#172554" }}>Mission Completion by World</h2>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={[
                  { world: "AI Basics", completed: 67, fullMark: 100 },
                  { world: "ML", completed: 60, fullMark: 100 },
                  { world: "Comp Vision", completed: 33, fullMark: 100 },
                  { world: "NLP", completed: 0, fullMark: 100 },
                  { world: "Resp AI", completed: 0, fullMark: 100 },
                ]}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="world" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Radar dataKey="completed" stroke="#6941F5" fill="#6941F5" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Subject Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-900 mb-4" style={{ color: "#172554" }}>Subject Performance</h2>
              <div className="space-y-3">
                {subjectPerformance.map((subj, i) => (
                  <div key={subj.subject}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-700 text-slate-700">{subj.subject}</span>
                      <span className="font-700" style={{ color: subj.color }}>{subj.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: subj.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${subj.score}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Topics needing revision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-900 mb-4" style={{ color: "#172554" }}>
                📌 Needs Revision
              </h2>
              <div className="space-y-3">
                {revisionTopics.map((topic, i) => (
                  <motion.div
                    key={topic.topic}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-red-50 border border-red-100 rounded-xl p-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-700 text-slate-800">{topic.topic}</p>
                      <span className="text-xs font-700 text-red-600">{topic.score}%</span>
                    </div>
                    <p className="text-xs text-slate-400">{topic.subject}</p>
                    <div className="h-1.5 bg-red-100 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${topic.score}%` }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-900" style={{ color: "#172554" }}>Recent Achievements</h2>
                <Link href="/achievements" className="text-xs text-violet-600 font-700">View All</Link>
              </div>
              {[
                { icon: <Target size={16} className="text-violet-600" />, title: "Completed Pattern Challenges", xp: 80, time: "Today" },
                { icon: <FlaskConical size={16} className="text-emerald-600" />, title: "Scored 90% in AI Quiz", xp: 30, time: "Yesterday" },
                { icon: <Zap size={16} className="text-amber-500 fill-amber-500" />, title: "Completed 5 Daily Missions", xp: 100, time: "2 days ago" },
              ].map((ach, i) => (
                <motion.div
                  key={ach.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">{ach.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-700 text-slate-700 truncate">{ach.title}</p>
                    <p className="text-xs text-slate-400">{ach.time}</p>
                  </div>
                  <span className="text-xs font-700 text-green-600 bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">+{ach.xp} XP</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Next suggested steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-violet-50 rounded-3xl p-5 border border-violet-100"
            >
              <h2 className="text-lg font-900 mb-4 text-violet-800 flex items-center gap-2">
                <Sparkles size={18} className="text-violet-600" /> Suggested Next Steps
              </h2>
              <div className="space-y-2">
                {nextSteps.map((step) => (
                  <Link key={step.label} href={step.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl hover:shadow-sm transition-all"
                    >
                      <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <span className="text-sm font-700 text-slate-700 flex-1">{step.label}</span>
                      <ArrowRight size={14} className="text-slate-300" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
