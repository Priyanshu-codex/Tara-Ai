"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import {
  Users, CheckCircle2, TrendingUp, AlertCircle, BookOpen,
  ArrowRight, Search, Filter, Send, X, ChevronDown
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockTeacher, studentProgressData, conceptMasteryData, worlds } from "@/lib/mockData";

const weeklyClassData = [
  { week: "W1", completion: 65, missions: 8 },
  { week: "W2", completion: 72, missions: 11 },
  { week: "W3", completion: 78, missions: 14 },
  { week: "W4", completion: 75, missions: 12 },
];

const misconceptions = [
  "Many students think AI can think like humans.",
  "Students confuse 'training data' with 'test data'.",
  "Common misconception: more data always = better model.",
];

function AssignMissionModal({ onClose }: { onClose: () => void }) {
  const [selectedWorld, setSelectedWorld] = useState("");
  const [selectedMission, setSelectedMission] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sent, setSent] = useState(false);

  const world = worlds.find(w => w.id === selectedWorld);

  const handleAssign = async () => {
    if (!selectedWorld || !selectedMission || !dueDate) return;
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-900 mb-2" style={{ color: "#172554" }}>Mission Assigned!</h3>
            <p className="text-slate-500 text-sm mb-4">The mission has been sent to all students in Class 8A</p>
            <button onClick={onClose} className="btn-primary px-6 py-3 rounded-xl font-700 text-sm">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-900" style={{ color: "#172554" }}>Assign Mission</h2>
              <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
            </div>

            <div className="space-y-4">
              {/* World selector */}
              <div>
                <label className="block text-sm font-700 text-slate-600 mb-1.5">Select World</label>
                <select
                  value={selectedWorld}
                  onChange={e => { setSelectedWorld(e.target.value); setSelectedMission(""); }}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
                >
                  <option value="">Choose a world...</option>
                  {worlds.map(w => <option key={w.id} value={w.id}>{w.icon} {w.name}</option>)}
                </select>
              </div>

              {/* Mission selector */}
              {world && (
                <div>
                  <label className="block text-sm font-700 text-slate-600 mb-1.5">Select Mission</label>
                  <select
                    value={selectedMission}
                    onChange={e => setSelectedMission(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
                  >
                    <option value="">Choose a mission...</option>
                    {world.missions.filter(m => !m.isLocked).map(m => (
                      <option key={m.id} value={m.id}>{m.title} (+{m.xpReward} XP)</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Due date */}
              <div>
                <label className="block text-sm font-700 text-slate-600 mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400"
                />
              </div>

              {/* Class */}
              <div className="bg-violet-50 rounded-xl px-4 py-3">
                <p className="text-xs font-700 text-violet-600">Assigning to: Class 8A (32 students)</p>
              </div>

              <motion.button
                onClick={handleAssign}
                disabled={!selectedWorld || !selectedMission || !dueDate}
                className={`w-full py-3.5 rounded-2xl text-sm font-800 flex items-center justify-center gap-2 ${
                  !selectedWorld || !selectedMission || !dueDate ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "btn-primary"
                }`}
                whileHover={selectedWorld && selectedMission && dueDate ? { scale: 1.03 } : {}}
              >
                <Send size={16} /> Send to Class
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function TeacherDashboard() {
  const teacher = mockTeacher;
  const activeClass = teacher.classes[0];
  const [assignModal, setAssignModal] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedClassId, setSelectedClassId] = useState(teacher.classes[0].id);
  const [filterPeriod, setFilterPeriod] = useState("Last 30 days");

  const filteredStudents = studentProgressData.filter(s =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="teacher" userName={teacher.name} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-900" style={{ color: "#172554" }}>Teacher Dashboard</h1>
            <p className="text-slate-500 text-sm">Track your students&apos; learning progress and impact</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Class selector */}
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="border-2 border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm font-700 text-slate-700 outline-none focus:border-violet-400"
            >
              {teacher.classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {/* Period filter */}
            <select
              value={filterPeriod}
              onChange={e => setFilterPeriod(e.target.value)}
              className="border-2 border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm font-700 text-slate-700 outline-none focus:border-violet-400"
            >
              {["Last 7 days", "Last 30 days", "Last 3 months", "This year"].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <motion.button
              onClick={() => setAssignModal(true)}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-700"
              whileHover={{ scale: 1.04 }}
            >
              <BookOpen size={16} /> Assign Mission
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Students", value: `${activeClass.students}`, icon: "👥", color: "#6941F5", sub: "Active learners" },
            { label: "Avg Completion", value: `${activeClass.avgCompletion}%`, icon: "✅", color: "#22C55E", sub: "This week" },
            { label: "Missions Completed", value: "24", icon: "🎯", color: "#3B82F6", sub: "Across all students" },
            { label: "% Improvement", value: "15%", icon: "📈", color: "#F59E0B", sub: "vs last week" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statCardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-2xl font-900" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Concept Mastery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-900" style={{ color: "#172554" }}>Concept Mastery</h2>
                <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full font-600">Class 8A Average</span>
              </div>
              <div className="space-y-3">
                {conceptMasteryData.map((c, i) => (
                  <div key={c.concept}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-600 text-slate-700">{c.concept}</span>
                      <span className="font-700" style={{ color: c.color }}>{c.mastery}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.mastery}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Class activity chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h2 className="text-lg font-900 mb-4" style={{ color: "#172554" }}>Class Completion Trend</h2>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weeklyClassData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "white", border: "none", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Line dataKey="completion" stroke="#6941F5" strokeWidth={2.5} dot={{ fill: "#6941F5", r: 4 }} type="monotone" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Student Progress Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-900" style={{ color: "#172554" }}>Student Progress</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-1.5">
                    <Search size={14} className="text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchStudent}
                      onChange={e => setSearchStudent(e.target.value)}
                      className="text-xs outline-none text-slate-700 placeholder-slate-300 w-28"
                    />
                  </div>
                  <Link href="/teacher/students" className="text-xs text-violet-600 font-700">View All</Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="text-xs font-700 text-slate-400 pb-3">Name</th>
                      <th className="text-xs font-700 text-slate-400 pb-3">Level</th>
                      <th className="text-xs font-700 text-slate-400 pb-3">Progress</th>
                      <th className="text-xs font-700 text-slate-400 pb-3">XP</th>
                      <th className="text-xs font-700 text-slate-400 pb-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredStudents.map((s, i) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-base">{s.avatar}</div>
                            <span className="text-sm font-700 text-slate-700">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-700 text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">Lv. {s.level}</span>
                        </td>
                        <td className="py-3 w-24">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-violet-500" style={{ width: `${s.completion}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">{s.completion}%</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-sm font-700 text-slate-600">{s.xp} XP</span>
                        </td>
                        <td className="py-3">
                          <Link href={`/teacher/students/${s.id}`}>
                            <motion.button
                              className="text-xs text-violet-600 font-700 hover:underline"
                              whileHover={{ x: 2 }}
                            >
                              View →
                            </motion.button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Common misconceptions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={18} className="text-amber-500" />
                <h2 className="text-lg font-900" style={{ color: "#172554" }}>Common Misconceptions</h2>
              </div>
              <div className="space-y-3">
                {misconceptions.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2"
                  >
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠️</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{m}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="mt-4 w-full btn-primary py-2.5 rounded-xl text-sm font-700 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setAssignModal(true)}
              >
                <Send size={14} /> Send to Class
              </motion.button>
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: "👥", label: "My Classes", href: "/teacher/classes", color: "#6941F5" },
                  { icon: "👤", label: "Student List", href: "/teacher/students", color: "#22C55E" },
                  { icon: "📋", label: "Assignments", href: "/teacher/assignments", color: "#3B82F6" },
                  { icon: "📊", label: "Analytics", href: "/teacher/analytics", color: "#F59E0B" },
                ].map(item => (
                  <Link key={item.label} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: item.color + "20" }}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-700 text-slate-700 flex-1">{item.label}</span>
                      <ArrowRight size={14} className="text-slate-300" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-violet-50 rounded-3xl p-5 border border-violet-100"
            >
              <h3 className="font-800 text-violet-800 mb-3">💡 AI Recommendations</h3>
              <div className="space-y-2">
                {[
                  "Schedule revision session on AI Ethics",
                  "Assign bonus missions to top performers",
                  "Review ML concepts with struggling students",
                ].map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-violet-700">
                    <span className="text-violet-400 flex-shrink-0">•</span>
                    {rec}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Assign Mission Modal */}
      <AnimatePresence>
        {assignModal && <AssignMissionModal onClose={() => setAssignModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
