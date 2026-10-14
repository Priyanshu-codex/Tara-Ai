"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Star, TrendingUp, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockTeacher } from "@/lib/mockData";

export default function TeacherClassesPage() {
  const teacher = mockTeacher;

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="teacher" userName={teacher.name} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-900" style={{ color: "#172554" }}>My Classes</h1>
          <p className="text-slate-500">Manage your classes and track student progress</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teacher.classes.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-violet-50">🏫</div>
                <div>
                  <h3 className="font-900 text-slate-800">{cls.name}</h3>
                  <p className="text-xs text-slate-400">Section {cls.section}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { icon: <Users size={14} />, label: "Students", value: cls.students, color: "#6941F5" },
                  { icon: <TrendingUp size={14} />, label: "Avg Completion", value: `${cls.avgCompletion}%`, color: "#22C55E" },
                  { icon: <Star size={14} />, label: "Avg Level", value: cls.avgLevel, color: "#F59E0B" },
                  { icon: <BookOpen size={14} />, label: "Active", value: "Now", color: "#3B82F6" },
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1" style={{ color: stat.color }}>
                      {stat.icon}
                      <span className="text-xs">{stat.label}</span>
                    </div>
                    <p className="font-900 text-slate-800">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full rounded-full bg-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${cls.avgCompletion}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                />
              </div>
              <Link href={`/teacher/students`}>
                <motion.button className="w-full btn-primary py-2.5 rounded-xl text-sm font-700 flex items-center justify-center gap-2" whileHover={{ scale: 1.03 }}>
                  View Students <ArrowRight size={14} />
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
