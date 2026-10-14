"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Flame, Trophy, Edit3, ArrowRight, Lock, CheckCircle2, TrendingUp, Award, BookOpen, Target } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent, worlds, recentAchievements } from "@/lib/mockData";
import { getStoredUser } from "@/lib/auth";
import type { Student } from "@/lib/types";
import Image from "next/image";

function BadgeCard({ badge, delay }: { badge: typeof mockStudent.badges[0]; delay: number }) {
  const [showUnlock, setShowUnlock] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.08, y: -4 }}
      className="flex flex-col items-center gap-2 cursor-pointer group"
      onClick={() => setShowUnlock(true)}
    >
      <motion.div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md relative"
        style={{ background: badge.color }}
        animate={{ boxShadow: [`0 0 0 0 ${badge.color}40`, `0 0 20px 4px ${badge.color}40`, `0 0 0 0 ${badge.color}40`] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {badge.icon}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle2 size={12} className="text-white" />
        </div>
      </motion.div>
      <p className="text-xs font-700 text-slate-700 text-center">{badge.name}</p>
      <p className="text-xs text-slate-400">+{badge.xpEarned} XP</p>

      {/* Unlock animation overlay */}
      <AnimatePresence>
        {showUnlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setShowUnlock(false); }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                {badge.icon}
              </motion.div>
              <h3 className="text-xl font-900 mb-1" style={{ color: "#172554" }}>{badge.name}</h3>
              <p className="text-slate-500 text-sm mb-2">{badge.description}</p>
              <span className="text-xs px-3 py-1 rounded-full font-700 text-white" style={{ background: badge.color }}>
                +{badge.xpEarned} XP Earned
              </span>
              <p className="text-xs text-slate-400 mt-3">Earned: {badge.earnedAt}</p>
              <button onClick={() => setShowUnlock(false)} className="mt-4 btn-primary px-6 py-2.5 rounded-xl text-sm font-700 w-full">
                Awesome! 🎉
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AchievementsPage() {
  const [student, setStudent] = useState(mockStudent);
  const [activeTab, setActiveTab] = useState<"badges" | "certificates" | "history" | "mastery">("badges");
  const [selectedCert, setSelectedCert] = useState<{ title: string; desc: string; icon: string; date: string; color: string } | null>(null);

  useEffect(() => {
    const sync = () => {
      const u = getStoredUser();
      if (u && u.role === "student") {
        setStudent(prev => ({
          ...prev,
          ...(u as Student),
        }));
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

  const tabs = [
    { id: "badges", label: "My Badges", icon: "🏅" },
    { id: "certificates", label: "Certificates", icon: "🎓" },
    { id: "history", label: "Mission History", icon: "📜" },
    { id: "mastery", label: "Subject Mastery", icon: "📊" },
  ] as const;

  const subjectMastery = [
    { subject: "AI Basics", level: 4, xp: 320, color: "#6941F5", pct: 64 },
    { subject: "Machine Learning", level: 3, xp: 240, color: "#7C3AED", pct: 48 },
    { subject: "Computer Vision", level: 2, xp: 160, color: "#059669", pct: 32 },
    { subject: "Mathematics", level: 5, xp: 450, color: "#3B82F6", pct: 90 },
    { subject: "Science", level: 4, xp: 380, color: "#22C55E", pct: 76 },
  ];

  const missionHistory = [
    { title: "What is AI?", world: "AI Basics", stars: 3, xp: 50, date: "Oct 12, 2026" },
    { title: "Spot the Pattern", world: "AI Basics", stars: 3, xp: 80, date: "Oct 11, 2026" },
    { title: "Train a Mini AI", world: "AI Basics", stars: 2, xp: 100, date: "Oct 10, 2026" },
    { title: "AI in Real Life", world: "AI Basics", stars: 3, xp: 60, date: "Oct 9, 2026" },
    { title: "Training Data Adventure", world: "Machine Learning", stars: 3, xp: 80, date: "Oct 8, 2026" },
    { title: "How Computers See", world: "Computer Vision", stars: 3, xp: 50, date: "Oct 7, 2026" },
  ];

  const certificates = [
    { title: "AI Basics Explorer", desc: "Completed AI Basics World with 90%+ accuracy", icon: "🤖", date: "Oct 12, 2026", color: "#6941F5" },
    { title: "Pattern Master", desc: "Solved 10 pattern recognition missions", icon: "🔮", date: "Oct 10, 2026", color: "#7C3AED" },
    { title: "Data Scientist Jr.", desc: "Trained your first machine learning model", icon: "📊", date: "Oct 8, 2026", color: "#059669" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl p-6 mb-6 text-white relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-10 bottom-0 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
              👦
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h1 className="text-2xl font-900">{student.name}</h1>
                <Link href="/profile" className="self-center sm:self-auto">
                  <span className="flex items-center gap-1.5 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer">
                    <Edit3 size={12} /> Edit Profile
                  </span>
                </Link>
              </div>
              <p className="text-violet-200 mb-3">{student.levelName || "AI Explorer"} • Class 8 • {student.missionsCompleted || 9} Missions</p>

              {/* XP bar */}
              <div className="max-w-xs">
                <div className="flex justify-between text-xs text-violet-200 mb-1">
                  <span>Level {student.level}</span>
                  <span>{student.xp} XP</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (student.xp / 1000) * 100)}%` }}
                    transition={{ duration: 1.2 }}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 flex-shrink-0">
              <div className="bg-white/15 rounded-2xl px-4 py-3 text-center">
                <Flame size={18} className="text-orange-300 mx-auto mb-1" />
                <p className="text-lg font-900">{student.streak}</p>
                <p className="text-xs text-violet-200">Day Streak</p>
              </div>
              <div className="bg-white/15 rounded-2xl px-4 py-3 text-center">
                <Trophy size={18} className="text-yellow-300 mx-auto mb-1" />
                <p className="text-lg font-900">{student.badges.length}</p>
                <p className="text-xs text-violet-200">Badges</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Streak", value: `${student.streak} Days`, icon: "🔥", color: "#EA580C" },
            { label: "Missions", value: `${student.missionsCompleted || 9}`, icon: "✅", color: "#22C55E" },
            { label: "Badges", value: `${student.badges.length}`, icon: "🏅", color: "#6941F5" },
            { label: "Global Rank", value: `Top 5%`, icon: "🏆", color: "#F59E0B" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center"
            >
              <div className="text-3xl mb-1">{stat.icon}</div>
              <p className="text-lg font-900" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 transition-all cursor-pointer ${
                activeTab === tab.id ? "bg-violet-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "badges" && (
            <motion.div key="badges" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-900" style={{ color: "#172554" }}>My Badges</h2>
                  <span className="text-sm text-violet-600 font-700 bg-violet-50 px-3 py-1 rounded-full">{student.badges.length} Earned</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-6">
                  {student.badges.map((badge, i) => (
                    <BadgeCard key={badge.id} badge={badge} delay={i * 0.1} />
                  ))}
                  {/* Locked badge examples */}
                  {["🌟", "🎯", "💫"].map((icon, i) => (
                    <motion.div
                      key={icon}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0.4, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-slate-100 relative grayscale">
                        {icon}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock size={16} className="text-slate-400" />
                        </div>
                      </div>
                      <p className="text-xs font-700 text-slate-300 text-center">Locked</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "certificates" && (
            <motion.div key="certs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                {certificates.map((cert, i) => (
                  <motion.div
                    key={cert.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-5"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md flex-shrink-0" style={{ background: cert.color + "20" }}>
                      {cert.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-800 text-slate-800 mb-1">{cert.title}</h3>
                      <p className="text-sm text-slate-500">{cert.desc}</p>
                      <p className="text-xs text-slate-400 mt-1">Earned: {cert.date}</p>
                    </div>
                    <motion.button
                      onClick={() => setSelectedCert(cert)}
                      className="px-4 py-2 rounded-xl text-sm font-700 border-2 transition-all cursor-pointer"
                      style={{ borderColor: cert.color, color: cert.color }}
                      whileHover={{ scale: 1.05 }}
                    >
                      View Certificate
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-xl font-900 mb-4" style={{ color: "#172554" }}>Mission History</h2>
                <div className="space-y-3">
                  {missionHistory.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-lg flex-shrink-0">✅</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-700 text-slate-800 truncate">{m.title}</p>
                        <p className="text-xs text-slate-400">{m.world} • {m.date}</p>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[...Array(3)].map((_, j) => (
                          <Star key={j} size={12} className={j < m.stars ? "text-yellow-400 fill-yellow-400" : "text-slate-200"} />
                        ))}
                      </div>
                      <span className="text-xs font-700 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+{m.xp} XP</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "mastery" && (
            <motion.div key="mastery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                <h2 className="text-xl font-900 mb-4" style={{ color: "#172554" }}>Subject Mastery</h2>
                <div className="space-y-5">
                  {subjectMastery.map((subj, i) => (
                    <motion.div
                      key={subj.subject}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-700 text-slate-800">{subj.subject}</p>
                          <p className="text-xs text-slate-400">Level {subj.level} • {subj.xp} XP</p>
                        </div>
                        <span className="text-sm font-700" style={{ color: subj.color }}>{subj.pct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: subj.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${subj.pct}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl relative border-4 border-yellow-300 text-center"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>

              <div className="text-5xl mb-2">{selectedCert.icon}</div>
              <div className="text-xs uppercase tracking-widest text-violet-600 font-900 mb-1">
                Certificate of Achievement
              </div>
              <h2 className="text-2xl font-900 text-slate-800 mb-2">
                {selectedCert.title}
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                This certifies that <span className="font-bold text-slate-800 underline decoration-violet-500">{student.name}</span> has successfully completed the curriculum and demonstrated excellence in:
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-sm text-slate-700 font-semibold">
                &ldquo;{selectedCert.desc}&rdquo;
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-4 mb-6">
                <div className="text-left">
                  <p className="font-bold text-slate-600">Issued Date</p>
                  <p>{selectedCert.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-600">Verified Platform</p>
                  <p>TARA AI & Tara Learning</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.print()}
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-700 flex items-center gap-2 cursor-pointer"
                >
                  🖨️ Print / Save PDF
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-700 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
