"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, Star, ArrowRight, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockTeacher, studentProgressData } from "@/lib/mockData";

export default function TeacherStudentsPage() {
  const teacher = mockTeacher;
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "xp" | "level" | "completion">("xp");

  const sorted = [...studentProgressData]
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "xp") return b.xp - a.xp;
      if (sortBy === "level") return b.level - a.level;
      return b.completion - a.completion;
    });

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="teacher" userName={teacher.name} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-900" style={{ color: "#172554" }}>Student List</h1>
            <p className="text-slate-500">Class 8A — {studentProgressData.length} students</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="outline-none text-sm text-slate-700 placeholder-slate-300 w-36"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm font-600 text-slate-700 outline-none"
            >
              <option value="xp">Sort by XP</option>
              <option value="level">Sort by Level</option>
              <option value="completion">Sort by Completion</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-xs font-700 text-slate-400 px-5 py-4">#</th>
                  <th className="text-left text-xs font-700 text-slate-400 px-4 py-4">Student</th>
                  <th className="text-left text-xs font-700 text-slate-400 px-4 py-4">Level</th>
                  <th className="text-left text-xs font-700 text-slate-400 px-4 py-4">XP</th>
                  <th className="text-left text-xs font-700 text-slate-400 px-4 py-4">Completion</th>
                  <th className="text-left text-xs font-700 text-slate-400 px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sorted.map((student, i) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm font-700 text-slate-400">{i + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-xl">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-700 text-slate-800 text-sm">{student.name}</p>
                          <p className="text-xs text-slate-400">Class 8A</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-700 text-slate-700">Level {student.level}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-700 text-violet-600">{student.xp} XP</span>
                    </td>
                    <td className="px-4 py-4 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${student.completion}%` }}
                          />
                        </div>
                        <span className="text-xs font-700 text-slate-600 w-8">{student.completion}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/teacher/students/${student.id}`}>
                        <motion.button
                          className="text-xs text-violet-600 font-700 bg-violet-50 px-3 py-1.5 rounded-lg hover:bg-violet-100 transition-colors flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          View Details <ArrowRight size={12} />
                        </motion.button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
