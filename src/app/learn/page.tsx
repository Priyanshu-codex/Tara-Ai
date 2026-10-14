"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Globe, Brain, Trophy, Zap, Star, CheckCircle2, Play } from "lucide-react";
import Navigation from "@/components/Navigation";
import { worlds } from "@/lib/mockData";

export default function LearnPage() {
  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-16 px-4 sm:px-6">
          <div className="absolute inset-0 opacity-20">
            <Image src="/images/hero_bg.jpg" alt="Learn" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-violet-50/80" />
          <div className="relative max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-700 mb-5">
              <BookOpen size={14} /> Learn with TARA
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-900 mb-4" style={{ color: "#172554" }}>
              Your AI Learning Journey
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Master AI concepts through structured worlds, interactive missions, and real-world challenges — all designed for school students.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <motion.button className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-800" whileHover={{ scale: 1.04 }}>
                  Start Learning Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/explore">
                <motion.button className="bg-white border-2 border-slate-200 text-slate-700 flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-700 hover:border-violet-300 transition-all" whileHover={{ scale: 1.04 }}>
                  <Globe size={18} /> Explore Worlds
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Learning Worlds */}
        <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-900 mb-3" style={{ color: "#172554" }}>5 Learning Worlds</h2>
            <p className="text-slate-500 text-lg">Progress through worlds to build complete AI literacy</p>
          </motion.div>

          <div className="space-y-5">
            {worlds.map((world, i) => (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl flex-shrink-0 shadow-md" style={{ background: world.bgColor }}>
                  {world.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-900" style={{ color: world.color }}>{world.name}</h3>
                    <span className="text-xs font-700 text-white px-2.5 py-0.5 rounded-full" style={{ background: world.color }}>
                      World {i + 1}
                    </span>
                    {world.isLocked && <span className="text-xs text-slate-400 font-600">🔒 Locked</span>}
                  </div>
                  <p className="text-slate-600 mb-3">{world.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">{world.totalMissions} Missions</span>
                    {world.missions.slice(0, 3).map(m => (
                      <span key={m.id} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{m.type}</span>
                    ))}
                  </div>
                </div>
                <Link href={world.isLocked ? "/auth/signup" : `/dashboard/worlds/${world.id}`}>
                  <motion.button
                    className="px-5 py-2.5 rounded-xl text-sm font-700 text-white flex-shrink-0"
                    style={{ background: world.isLocked ? "#94a3b8" : world.color }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {world.isLocked ? "Unlock" : "Start World"} <ArrowRight size={14} className="inline ml-1" />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Learning Methods */}
        <section className="py-16 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, #EAF5FF 0%, #F0ECFF 100%)" }}>
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl font-900 mb-3" style={{ color: "#172554" }}>How You Learn with TARA</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: "🎮", title: "Game Missions", desc: "Interactive pattern-recognition, quizzes, and puzzles that make learning addictive.", color: "#6941F5" },
                { icon: "🔬", title: "Experiments", desc: "Hands-on AI lab where you train real (simulated) machine learning models.", color: "#22C55E" },
                { icon: "📺", title: "Video Lessons", desc: "Short, engaging video explanations narrated by TARA for every concept.", color: "#3B82F6" },
                { icon: "🤖", title: "AI Tutor", desc: "Ask any question, get instant personalized explanations and examples.", color: "#F59E0B" },
              ].map((m, i) => (
                <motion.div
                  key={m.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                >
                  <div className="text-4xl mb-3">{m.icon}</div>
                  <h3 className="font-800 text-slate-800 mb-2">{m.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl p-12 text-white"
          >
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl font-900 mb-3">Ready to become an AI Explorer?</h2>
            <p className="text-violet-200 mb-8">Free to get started. No credit card needed.</p>
            <Link href="/auth/signup">
              <motion.button className="bg-white text-violet-700 font-800 px-10 py-4 rounded-2xl text-base flex items-center gap-2 mx-auto" whileHover={{ scale: 1.04 }}>
                Start Learning Free <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 sm:px-6 text-center">
        <p className="text-sm text-slate-400">© 2026 TARA. Turning Curiosity Into Superpowers. 🚀</p>
      </footer>
    </div>
  );
}
