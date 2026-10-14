"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Star, Flame, Trophy, Camera, CheckCircle2, ArrowRight, GraduationCap, Sparkles, User } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent, recentAchievements } from "@/lib/mockData";
import { getStoredUser, updateUserClass, getStudentClassNumber, formatClassName } from "@/lib/auth";
import { getCurriculumTier, AVAILABLE_CLASSES } from "@/lib/missions/classCurriculum";
import { getWorldsForClass } from "@/lib/missions/missionRegistry";
import ClassSelectionModal from "@/components/ClassSelectionModal";
import Link from "next/link";
import type { Student } from "@/lib/types";

export default function ProfilePage() {
  const [student, setStudent] = useState<Student>(mockStudent);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(mockStudent.name);
  const [bio, setBio] = useState("AI Explorer & Future Technologist 🚀");
  const [savedName, setSavedName] = useState(mockStudent.name);
  const [savedBio, setSavedBio] = useState("AI Explorer & Future Technologist 🚀");
  const [selectedClass, setSelectedClass] = useState<number>(8);
  const [showClassModal, setShowClassModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getStoredUser() as Student | null;
    if (user) {
      setStudent(user);
      if (user.name) {
        setDisplayName(user.name);
        setSavedName(user.name);
      }
      const clsNum = getStudentClassNumber(user);
      setSelectedClass(clsNum ?? 8);
    }

    const handleSync = () => {
      const updated = getStoredUser() as Student | null;
      if (updated) {
        setStudent(updated);
        setSelectedClass(getStudentClassNumber(updated) ?? 8);
      }
    };

    window.addEventListener("tara-class-change", handleSync);
    window.addEventListener("tara-auth-change", handleSync);
    return () => {
      window.removeEventListener("tara-class-change", handleSync);
      window.removeEventListener("tara-auth-change", handleSync);
    };
  }, []);

  const currentTier = getCurriculumTier(selectedClass);
  const classWorlds = getWorldsForClass(selectedClass);

  const handleSave = async () => {
    setSaving(true);
    setSavedName(displayName);
    setSavedBio(bio);

    // Permanently update class in auth store and Supabase profile
    updateUserClass(selectedClass);

    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: student.id,
          name: displayName,
          classNumber: selectedClass,
          school: student.school,
          bio: bio,
        }),
      });
    } catch {
      // Local updates already persisted
    }

    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation
        role="student"
        userName={savedName}
        xp={student.xp}
        streak={student.streak}
        level={student.level}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Profile Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-8 mb-6 text-white relative overflow-hidden shadow-lg"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center text-white shadow-xl backdrop-blur-xs font-900 text-3xl">
                {savedName ? savedName[0] : <User size={40} />}
              </div>
              <motion.button
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md cursor-pointer"
                whileHover={{ scale: 1.1 }}
                title="Change Avatar"
              >
                <Camera size={14} className="text-violet-600" />
              </motion.button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-violet-200 block mb-1 font-700">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-white/20 text-white rounded-xl px-4 py-2 text-lg font-800 outline-none border border-white/40 w-full"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-violet-200 block mb-1 font-700">Bio / Motto</label>
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="bg-white/20 text-white rounded-xl px-4 py-2 text-sm outline-none border border-white/40 w-full"
                      placeholder="Your bio"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-violet-200 block mb-1 font-700">School Class / Grade Level</label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(Number(e.target.value))}
                        className="bg-white/20 text-white rounded-xl px-4 py-2 text-sm font-700 outline-none border border-white/40 cursor-pointer flex-1"
                      >
                        {AVAILABLE_CLASSES.map((c) => (
                          <option key={c} value={c} className="text-slate-800">
                            Class {c} ({getCurriculumTier(c).name})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowClassModal(true)}
                        className="px-3 py-2 bg-white/30 hover:bg-white/40 text-white text-xs font-700 rounded-xl transition-colors cursor-pointer"
                      >
                        View Tiers
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <motion.button
                      disabled={saving}
                      onClick={handleSave}
                      className="bg-white text-violet-700 font-800 px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer disabled:opacity-50"
                      whileHover={{ scale: 1.03 }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <motion.button
                      onClick={() => setEditing(false)}
                      className="bg-white/20 text-white font-700 px-5 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-white/30"
                      whileHover={{ scale: 1.03 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                    <h1 className="text-2xl font-900">{savedName}</h1>
                    <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                      <motion.button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-700 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.04 }}
                      >
                        <Edit3 size={12} /> Edit Profile
                      </motion.button>
                      <motion.button
                        onClick={() => setShowClassModal(true)}
                        className="flex items-center gap-1.5 bg-white/25 hover:bg-white/35 text-white px-3 py-1.5 rounded-xl text-xs font-700 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.04 }}
                      >
                        <GraduationCap size={13} /> Change Class
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-violet-200 text-sm mb-2">{savedBio}</p>
                  
                  {/* Verified Class Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-xl text-xs font-700 backdrop-blur-xs">
                    <span>{currentTier.icon}</span>
                    <span>Class {selectedClass}</span>
                    <span className="opacity-60">•</span>
                    <span>{currentTier.name}</span>
                    <span className="opacity-60">•</span>
                    <span>Age {student.age || 13}</span>
                  </div>
                </>
              )}
            </div>

            {/* XP level ring */}
            <div className="bg-white/15 rounded-2xl px-6 py-4 text-center flex-shrink-0 backdrop-blur-xs">
              <div className="text-4xl font-900 mb-1">{student.level}</div>
              <p className="text-xs text-violet-200">Student Level</p>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full w-24">
                <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, (student.xp / 500) * 100)}%` }} />
              </div>
              <p className="text-xs text-violet-300 mt-1">{student.xp}/500 XP</p>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Flame size={20} className="text-orange-500" />, label: "Day Streak", value: `${student.streak}`, color: "#EA580C" },
            { icon: <CheckCircle2 size={20} className="text-emerald-500" />, label: "Missions Done", value: `${student.missionsCompleted}`, color: "#22C55E" },
            { icon: <Star size={20} className="text-amber-500 fill-amber-500" />, label: "Total Stars", value: `${student.stars ?? 0}`, color: "#EAB308" },
            { icon: <GraduationCap size={20} className="text-violet-600" />, label: "Grade Tier", value: currentTier.name, color: "#6941F5" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-900" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-slate-400 font-600">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Learning Tier Curriculum Focus Banner */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center text-2xl flex-shrink-0">
                {currentTier.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-800 text-xs">
                    {currentTier.gradeRange}
                  </span>
                  <h3 className="font-900 text-base text-slate-800">{currentTier.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {currentTier.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {currentTier.focusTopics.map((topic) => (
                    <span key={topic} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-600">
                      ✓ {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowClassModal(true)}
              className="px-4 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-700 text-xs rounded-xl transition-colors cursor-pointer flex-shrink-0"
            >
              Switch Class Level
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* World Progress for Current Class */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-900" style={{ color: "#172554" }}>
                Class {selectedClass} Worlds ({classWorlds.length})
              </h2>
              <Link href="/explore" className="text-xs text-violet-600 font-700 flex items-center gap-1">
                Explore Map <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {classWorlds.map((world, i) => {
                const completed = world.completedMissions || 0;
                const total = world.totalMissions || 5;
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
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-900" style={{ color: "#172554" }}>Recent Achievements</h2>
              <Link href="/achievements" className="text-xs text-violet-600 font-700">View All</Link>
            </div>
            <div className="space-y-2.5">
              {recentAchievements.slice(0, 3).map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-xs">{ach.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-700 text-slate-800 leading-tight truncate">{ach.title}</p>
                    <p className="text-xs text-violet-600 font-700">+{ach.xp} XP</p>
                    <p className="text-[11px] text-slate-400">{ach.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Class Selection Modal */}
      {showClassModal && (
        <ClassSelectionModal
          currentClass={selectedClass}
          onClose={() => setShowClassModal(false)}
          onClassSelected={(newClass) => {
            setSelectedClass(newClass);
            setShowClassModal(false);
          }}
        />
      )}
    </div>
  );
}
