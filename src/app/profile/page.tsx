"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Star, Flame, Trophy, Camera, CheckCircle2, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent, worlds, recentAchievements } from "@/lib/mockData";
import Link from "next/link";

export default function ProfilePage() {
  const student = mockStudent;
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(student.name);
  const [bio, setBio] = useState("AI Explorer & Future Technologist 🚀");
  const [savedName, setSavedName] = useState(student.name);
  const [savedBio, setSavedBio] = useState("AI Explorer & Future Technologist 🚀");

  const handleSave = () => {
    setSavedName(displayName);
    setSavedBio(bio);
    setEditing(false);
  };

  const totalXP = student.badges.reduce((a, b) => a + b.xpEarned, 0);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl p-8 mb-6 text-white relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center text-5xl shadow-xl">
                👦
              </div>
              <motion.button
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md"
                whileHover={{ scale: 1.1 }}
              >
                <Camera size={14} className="text-violet-600" />
              </motion.button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="bg-white/20 text-white rounded-xl px-4 py-2 text-xl font-900 outline-none border border-white/40 w-full"
                    placeholder="Your name"
                  />
                  <input
                    type="text"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="bg-white/20 text-white rounded-xl px-4 py-2 text-sm outline-none border border-white/40 w-full"
                    placeholder="Your bio"
                  />
                  <div className="flex gap-2">
                    <motion.button onClick={handleSave} className="bg-white text-violet-700 font-700 px-5 py-2 rounded-xl text-sm" whileHover={{ scale: 1.03 }}>
                      Save Changes
                    </motion.button>
                    <motion.button onClick={() => setEditing(false)} className="bg-white/20 text-white font-600 px-5 py-2 rounded-xl text-sm" whileHover={{ scale: 1.03 }}>
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                    <h1 className="text-2xl font-900">{savedName}</h1>
                    <motion.button
                      onClick={() => setEditing(true)}
                      className="self-center sm:self-auto flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-700 transition-colors"
                      whileHover={{ scale: 1.04 }}
                    >
                      <Edit3 size={12} /> Edit Profile
                    </motion.button>
                  </div>
                  <p className="text-violet-200 text-sm mb-1">{savedBio}</p>
                  <p className="text-violet-200 text-sm">{student.levelName} · Class 8 · {student.missionsCompleted} Missions</p>
                </>
              )}
            </div>

            {/* XP level ring */}
            <div className="bg-white/15 rounded-2xl px-6 py-4 text-center flex-shrink-0">
              <div className="text-4xl font-900 mb-1">{student.level}</div>
              <p className="text-xs text-violet-200">Level</p>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full w-24">
                <div className="h-full bg-white rounded-full" style={{ width: `${(student.xp / 500) * 100}%` }} />
              </div>
              <p className="text-xs text-violet-300 mt-1">{student.xp}/500 XP</p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: "🔥", label: "Day Streak", value: `${student.streak}`, color: "#EA580C" },
            { icon: "✅", label: "Missions Done", value: `${student.missionsCompleted}`, color: "#22C55E" },
            { icon: "🏅", label: "Badges Earned", value: `${student.badges.length}`, color: "#6941F5" },
            { icon: "🌟", label: "Total XP", value: `${totalXP}`, color: "#F59E0B" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-3xl mb-1">{stat.icon}</div>
              <p className="text-xl font-900" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-900" style={{ color: "#172554" }}>My Badges</h2>
              <Link href="/achievements" className="text-xs text-violet-600 font-700 flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {student.badges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ background: badge.color + "20" }}
                  >
                    {badge.icon}
                  </div>
                  <p className="text-xs text-slate-500 text-center leading-tight">{badge.name.split(" ")[0]}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* World Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-900" style={{ color: "#172554" }}>World Progress</h2>
              <Link href="/explore" className="text-xs text-violet-600 font-700 flex items-center gap-1">
                Explore <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {worlds.map((world, i) => {
                const prog = student.worldProgress.find(p => p.worldId === world.id);
                const completed = prog?.completed ?? world.completedMissions;
                const total = prog?.total ?? world.totalMissions;
                const pct = Math.round((completed / total) * 100);

                return (
                  <div key={world.id} className="flex items-center gap-3">
                    <div className="text-xl w-8">{world.isLocked ? "🔒" : world.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-600 text-slate-700 truncate">{world.name}</span>
                        <span className="font-700" style={{ color: world.color }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: world.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-900" style={{ color: "#172554" }}>Recent Activity</h2>
              <Link href="/achievements" className="text-xs text-violet-600 font-700">View All</Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {recentAchievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">{ach.icon}</div>
                  <div>
                    <p className="text-xs font-700 text-slate-800 leading-tight">{ach.title}</p>
                    <p className="text-xs text-violet-600 font-700">+{ach.xp} XP</p>
                    <p className="text-xs text-slate-400">{ach.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
