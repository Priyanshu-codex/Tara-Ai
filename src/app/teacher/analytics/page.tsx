"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockTeacher, conceptMasteryData, studentProgressData } from "@/lib/mockData";

const engagementData = [
  { week: "W1", active: 28, completed: 18 },
  { week: "W2", active: 30, completed: 22 },
  { week: "W3", active: 32, completed: 26 },
  { week: "W4", active: 29, completed: 24 },
];

const pieData = [
  { name: "AI Basics", value: 35, color: "#6941F5" },
  { name: "Machine Learning", value: 25, color: "#7C3AED" },
  { name: "Computer Vision", value: 20, color: "#059669" },
  { name: "NLP", value: 12, color: "#D97706" },
  { name: "Resp. AI", value: 8, color: "#EA580C" },
];

const topicAccuracy = [
  { topic: "What is AI?", avg: 92 },
  { topic: "Spot the Pattern", avg: 78 },
  { topic: "Training Data", avg: 71 },
  { topic: "Computer Vision", avg: 65 },
  { topic: "Ethics", avg: 82 },
];

export default function TeacherAnalyticsPage() {
  const teacher = mockTeacher;
  const [period, setPeriod] = useState("Last 30 days");

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="teacher" userName={teacher.name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-900" style={{ color: "#172554" }}>Classroom Analytics</h1>
            <p className="text-slate-500 text-sm">Deep insights into your class&apos;s learning patterns</p>
          </div>
          <div className="flex gap-3">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm font-600 text-slate-700 outline-none"
            >
              {["Last 7 days", "Last 30 days", "Last 3 months"].map(p => <option key={p}>{p}</option>)}
            </select>
            <motion.button
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-700 text-slate-600 hover:border-violet-300 transition-colors"
              whileHover={{ scale: 1.04 }}
            >
              <Download size={16} /> Export
            </motion.button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Avg Quiz Score", value: "78%", change: "+5%", up: true, color: "#6941F5" },
            { label: "Mission Completion", value: "72%", change: "+8%", up: true, color: "#22C55E" },
            { label: "Avg Study Time", value: "42min/day", change: "+12min", up: true, color: "#3B82F6" },
            { label: "Drop-off Rate", value: "8%", change: "-3%", up: false, color: "#EF4444" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <p className="text-xs text-slate-400 font-600 mb-2">{kpi.label}</p>
              <p className="text-2xl font-900 mb-1" style={{ color: kpi.color }}>{kpi.value}</p>
              <div className={`flex items-center gap-1 text-xs font-700 ${kpi.up ? "text-green-600" : "text-red-500"}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.change} vs last period
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Engagement Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="font-900 text-lg mb-4" style={{ color: "#172554" }}>Student Engagement</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={engagementData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="active" name="Active Students" fill="#6941F5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completed" name="Missions Completed" fill="#22C55E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Topic Accuracy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="font-900 text-lg mb-4" style={{ color: "#172554" }}>Topic-wise Quiz Accuracy</h2>
              <div className="space-y-3">
                {topicAccuracy.map((t, i) => (
                  <div key={t.topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-600 text-slate-700">{t.topic}</span>
                      <span className="font-700" style={{ color: t.avg >= 80 ? "#22C55E" : t.avg >= 70 ? "#F59E0B" : "#EF4444" }}>{t.avg}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: t.avg >= 80 ? "#22C55E" : t.avg >= 70 ? "#F59E0B" : "#EF4444" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${t.avg}%` }}
                        transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Student Rankings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="font-900 text-lg mb-4" style={{ color: "#172554" }}>🏆 Top Performers</h2>
              <div className="space-y-3">
                {studentProgressData.slice(0, 5).map((s, i) => (
                  <div key={s.id} className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-900 text-white ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-orange-400" : "bg-violet-200 text-violet-700"}`}>
                      {i + 1}
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-lg">{s.avatar}</div>
                    <div className="flex-1">
                      <p className="text-sm font-700 text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400">{s.xp} XP • Level {s.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-700 text-violet-600">{s.completion}%</p>
                      <p className="text-xs text-slate-400">completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* World Distribution Pie */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="font-900 text-lg mb-4" style={{ color: "#172554" }}>World Distribution</h2>
              <div className="flex justify-center mb-4">
                <PieChart width={160} height={160}>
                  <Pie data={pieData} cx={80} cy={80} innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </div>
              <div className="space-y-2">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-slate-600">{d.name}</span>
                    </div>
                    <span className="font-700 text-slate-700">{d.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Concept Mastery */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="font-900 text-lg mb-4" style={{ color: "#172554" }}>Concept Mastery</h2>
              <div className="space-y-3">
                {conceptMasteryData.map((c, i) => (
                  <div key={c.concept}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-600 text-slate-700">{c.concept}</span>
                      <span className="font-700" style={{ color: c.color }}>{c.mastery}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.mastery}%` }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-amber-50 rounded-3xl p-5 border border-amber-100"
            >
              <h3 className="font-800 text-amber-800 mb-3">⚠️ Needs Attention</h3>
              <div className="space-y-2">
                {[
                  { name: "Dev Gupta", issue: "40% completion — falling behind" },
                  { name: "Karan Mehta", issue: "55% — needs motivation boost" },
                ].map(a => (
                  <div key={a.name} className="bg-white rounded-xl p-3">
                    <p className="text-xs font-700 text-slate-700">{a.name}</p>
                    <p className="text-xs text-amber-600">{a.issue}</p>
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
