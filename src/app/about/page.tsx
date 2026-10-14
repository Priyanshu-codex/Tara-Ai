"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Globe, BookOpen, Zap, Award, Users, Target } from "lucide-react";
import Navigation from "@/components/Navigation";

const team = [
  { name: "Dr. Aisha Nair", role: "AI Curriculum Lead", emoji: "👩‍🔬" },
  { name: "Priyanshu Raj", role: "Product & Engineering", emoji: "👨‍💻" },
  { name: "Ms. Sunita Roy", role: "Pedagogy Expert", emoji: "👩‍🏫" },
  { name: "Vikram Malhotra", role: "Design Director", emoji: "🎨" },
];

const values = [
  { icon: "💡", title: "Curiosity First", desc: "We design every feature to spark wonder and make learning feel like an adventure." },
  { icon: "🌍", title: "Accessible to All", desc: "Quality AI education should not be limited by geography or income." },
  { icon: "🛡️", title: "Child-Safe & Responsible", desc: "Designed from the ground up with strict safety guardrails and privacy protections." },
  { icon: "🔬", title: "Science-Backed", desc: "Every learning pathway is designed using proven cognitive science and pedagogy." },
];

const stats = [
  { value: "50,000+", label: "Active Students" },
  { value: "1,200+", label: "Learning Modules" },
  { value: "500+", label: "Schools" },
  { value: "10M+", label: "Missions Completed" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-6">
          <div className="absolute inset-0">
            <Image src="/images/hero_bg.jpg" alt="About TARA" fill className="object-cover opacity-10" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl mb-6"
            >
              🤖
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-900 mb-5"
              style={{ color: "#172554" }}
            >
              About TARA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto"
            >
              TARA (Teaching & AI Realisation for All) is an EdTech platform on a mission to make
              every school student an AI-literate, future-ready innovator.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/auth/signup">
                <motion.button className="btn-primary px-8 py-4 rounded-2xl font-800 text-base flex items-center gap-2 mx-auto" whileHover={{ scale: 1.04 }}>
                  Join the Mission <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-violet-600 to-blue-600 rounded-3xl p-10 text-white text-center"
          >
            <Heart size={36} className="mx-auto mb-4 text-pink-300" />
            <h2 className="text-3xl font-900 mb-4">Our Mission</h2>
            <p className="text-violet-100 text-lg leading-relaxed">
              To democratize AI education and give every student — regardless of background —
              the knowledge, skills, and confidence to shape the AI-powered future they will inherit.
            </p>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center"
              >
                <p className="text-3xl font-900 mb-1" style={{ color: "#6941F5" }}>{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-900" style={{ color: "#172554" }}>What We Stand For</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex gap-5 items-start"
              >
                <div className="text-4xl flex-shrink-0">{v.icon}</div>
                <div>
                  <h3 className="text-lg font-800 text-slate-800 mb-2">{v.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="py-16 px-4 sm:px-6" style={{ background: "#F0ECFF" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <h2 className="text-3xl font-900" style={{ color: "#172554" }}>Our Team</h2>
              <p className="text-slate-500 mt-2">Educators and technologists united by one goal</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 text-center"
                >
                  <div className="text-5xl mb-3">{member.emoji}</div>
                  <h3 className="font-800 text-slate-800 text-sm mb-0.5">{member.name}</h3>
                  <p className="text-xs text-slate-400">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-900 mb-3" style={{ color: "#172554" }}>Join 50,000+ Students Shaping the Future</h2>
            <p className="text-slate-500 mb-6">Free to start. Loved by families and students. Designed for every learner.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <motion.button className="btn-primary px-8 py-4 rounded-2xl font-800 text-base flex items-center gap-2" whileHover={{ scale: 1.04 }}>
                  Start Learning Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/explore">
                <motion.button className="bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-700 text-base flex items-center gap-2 hover:border-violet-300 transition-all" whileHover={{ scale: 1.04 }}>
                  <Globe size={18} /> Explore Worlds
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 px-4 sm:px-6 text-center">
        <p className="text-sm text-slate-400">© 2026 TARA. Turning Curiosity Into Superpowers. 🚀</p>
      </footer>
    </div>
  );
}
