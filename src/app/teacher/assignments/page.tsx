"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Send, Calendar, BookOpen, ChevronRight, X, CheckCircle2, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockTeacher, worlds } from "@/lib/mockData";

const assignments = [
  { id: "a1", title: "Spot the Pattern", world: "AI Basics", worldId: "world-1", class: "Class 8A", due: "Oct 18, 2026", submitted: 24, total: 32, status: "active" },
  { id: "a2", title: "Training Data Adventure", world: "Machine Learning", worldId: "world-2", class: "Class 8A", due: "Oct 20, 2026", submitted: 18, total: 32, status: "active" },
  { id: "a3", title: "What is AI?", world: "AI Basics", worldId: "world-1", class: "Class 8B", due: "Oct 15, 2026", submitted: 28, total: 28, status: "completed" },
  { id: "a4", title: "How Computers See", world: "Computer Vision", worldId: "world-3", class: "Class 9A", due: "Oct 22, 2026", submitted: 10, total: 30, status: "active" },
];

function CreateAssignmentModal({ onClose }: { onClose: () => void }) {
  const teacher = mockTeacher;
  const [form, setForm] = useState({ worldId: "", missionId: "", classId: "", dueDate: "", note: "" });
  const [created, setCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  const world = worlds.find(w => w.id === form.worldId);

  const handleCreate = async () => {
    if (!form.worldId || !form.missionId || !form.classId || !form.dueDate) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setCreated(true);
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
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {created ? (
          <div className="text-center py-8">
            <motion.div className="text-6xl mb-4" animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }}>🎉</motion.div>
            <h3 className="text-xl font-900 mb-2" style={{ color: "#172554" }}>Assignment Created!</h3>
            <p className="text-slate-500 text-sm mb-5">Students in {form.classId} have been notified</p>
            <button onClick={onClose} className="btn-primary px-8 py-3 rounded-2xl text-sm font-700 w-full">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-900" style={{ color: "#172554" }}>Create Assignment</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Select World",
                  field: "worldId",
                  type: "select",
                  options: [{ value: "", label: "Choose a world..." }, ...worlds.map(w => ({ value: w.id, label: `${w.icon} ${w.name}` }))]
                },
                {
                  label: "Select Mission",
                  field: "missionId",
                  type: "select",
                  options: [
                    { value: "", label: world ? "Choose a mission..." : "Select a world first" },
                    ...(world ? world.missions.filter(m => !m.isLocked).map(m => ({ value: m.id, label: `${m.title} (+${m.xpReward} XP)` })) : [])
                  ]
                },
                {
                  label: "Assign to Class",
                  field: "classId",
                  type: "select",
                  options: [{ value: "", label: "Choose a class..." }, ...teacher.classes.map(c => ({ value: c.id, label: `${c.name} (${c.students} students)` }))]
                },
              ].map(field => (
                <div key={field.field}>
                  <label className="block text-sm font-700 text-slate-600 mb-1.5">{field.label}</label>
                  <select
                    value={form[field.field as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [field.field]: e.target.value, ...(field.field === "worldId" ? { missionId: "" } : {}) }))}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 bg-white"
                    disabled={field.field === "missionId" && !form.worldId}
                  >
                    {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              ))}

              <div>
                <label className="block text-sm font-700 text-slate-600 mb-1.5">Due Date</label>
                <div className="flex items-center gap-3 border-2 border-slate-200 rounded-xl px-4 py-3 focus-within:border-violet-400">
                  <Calendar size={16} className="text-slate-400" />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="flex-1 text-sm text-slate-700 outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-700 text-slate-600 mb-1.5">Note for Students (optional)</label>
                <textarea
                  value={form.note}
                  onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="Add instructions or encouragement..."
                  rows={3}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-400 resize-none"
                />
              </div>

              <motion.button
                onClick={handleCreate}
                disabled={!form.worldId || !form.missionId || !form.classId || !form.dueDate || loading}
                className={`w-full py-3.5 rounded-2xl text-sm font-800 flex items-center justify-center gap-2 ${
                  !form.worldId || !form.missionId || !form.classId || !form.dueDate ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "btn-primary"
                }`}
                whileHover={form.worldId && form.missionId && form.classId && form.dueDate ? { scale: 1.03 } : {}}
              >
                {loading ? (
                  <motion.div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity }} />
                ) : (
                  <><Send size={16} /> Create Assignment</>
                )}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function TeacherAssignmentsPage() {
  const teacher = mockTeacher;
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filtered = assignments.filter(a => filter === "all" || a.status === filter);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="teacher" userName={teacher.name} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-900" style={{ color: "#172554" }}>Assignments</h1>
            <p className="text-slate-500 text-sm">Manage and track student assignments</p>
          </div>
          <motion.button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-700"
            whileHover={{ scale: 1.04 }}
          >
            <Plus size={16} /> Create Assignment
          </motion.button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "active", "completed"] as const).map(f => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-700 capitalize transition-all ${
                filter === f ? "bg-violet-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"
              }`}
              whileHover={{ scale: 1.04 }}
            >
              {f}
            </motion.button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((assignment, i) => {
            const pct = Math.round((assignment.submitted / assignment.total) * 100);
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-2xl flex-shrink-0">
                      📋
                    </div>
                    <div>
                      <h3 className="font-800 text-slate-800">{assignment.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{assignment.world}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400">{assignment.class}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar size={11} /> Due {assignment.due}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Submission progress */}
                    <div className="text-right">
                      <p className="text-sm font-700 text-slate-700">{assignment.submitted}/{assignment.total}</p>
                      <p className="text-xs text-slate-400">submitted</p>
                    </div>
                    <div className="w-20">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: pct === 100 ? "#22C55E" : "#6941F5" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <p className="text-xs text-center font-700 text-slate-500">{pct}%</p>
                    </div>

                    {/* Status badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-700 whitespace-nowrap ${
                      assignment.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-violet-100 text-violet-700"
                    }`}>
                      {assignment.status === "completed" ? "✅ Done" : "🔄 Active"}
                    </span>

                    <Link href={`/teacher/assignments/${assignment.id}`}>
                      <motion.button className="text-xs text-violet-600 font-700 hover:underline flex items-center gap-1" whileHover={{ x: 2 }}>
                        Details <ChevronRight size={12} />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3 opacity-40">📋</div>
            <p className="text-slate-400 font-600">No {filter} assignments found</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showModal && <CreateAssignmentModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
