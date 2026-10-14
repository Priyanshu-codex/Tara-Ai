"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Play, BookOpen, Beaker, Globe, Trophy,
  Star, Zap, Users, Clock, ChevronRight, Sparkles,
  Brain, Gamepad2, FlaskConical, Target, MessageSquare,
  TrendingUp, Shield, CheckCircle2
} from "lucide-react";
import Navigation from "@/components/Navigation";
import LeftHeroFloatingEmojis from "@/components/LeftHeroFloatingEmojis";

// ── Floating decoration ──────────────────────────────────────────────────────
function FloatingIcon({ icon, className, delay = 0, duration = 3 }: {
  icon: string; className: string; delay?: number; duration?: number;
}) {
  return (
    <motion.div
      className={`absolute text-2xl select-none pointer-events-none ${className}`}
      animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {icon}
    </motion.div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────
function StatBadge({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <motion.div
      className="flex items-center gap-3 glass-card px-5 py-4 rounded-2xl"
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-lg font-900 leading-none" style={{ color }}>{value}</p>
        <p className="text-xs text-slate-500 font-600">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color, delay = 0 }: {
  icon: string; title: string; desc: string; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card card-hover rounded-3xl p-6"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-base font-800 mb-1.5" style={{ color: "#172554" }}>{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ── World card ────────────────────────────────────────────────────────────────
function WorldCard({ world, delay = 0 }: { world: { icon: string; name: string; desc: string; color: string; bg: string }; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
      style={{ background: world.bg }}
    >
      <div className="p-6">
        <div className="text-5xl mb-3 group-hover:animate-bounce">{world.icon}</div>
        <h3 className="font-800 text-lg mb-1" style={{ color: world.color }}>{world.name}</h3>
        <p className="text-sm text-slate-600">{world.desc}</p>
      </div>
      <div className="px-6 pb-5">
        <Link href="/explore">
          <motion.button
            className="flex items-center gap-2 text-sm font-700 px-4 py-2 rounded-xl text-white shadow-md"
            style={{ background: world.color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore <ArrowRight size={14} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

// ── How it works step ─────────────────────────────────────────────────────────
function HowStep({ num, title, desc, icon, delay = 0 }: {
  num: number; title: string; desc: string; icon: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: num % 2 === 0 ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-start gap-5"
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}>
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <div className="text-xs font-700 text-violet-400 mb-1">STEP {num}</div>
        <h3 className="text-lg font-800 mb-1.5" style={{ color: "#172554" }}>{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

const learningWorlds = [
  { icon: "🤖", name: "AI Basics", desc: "Start your AI journey with fun missions!", color: "#3B82F6", bg: "linear-gradient(135deg, #DBEAFE, #BFDBFE)" },
  { icon: "📊", name: "Machine Learning", desc: "Find patterns and train your first AI model.", color: "#7C3AED", bg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)" },
  { icon: "👁️", name: "Computer Vision", desc: "Teach AI to recognize cats, dogs, and more!", color: "#059669", bg: "linear-gradient(135deg, #D1FAE5, #A7F3D0)" },
  { icon: "💬", name: "NLP", desc: "Help AI understand and generate language.", color: "#D97706", bg: "linear-gradient(135deg, #FEF3C7, #FDE68A)" },
  { icon: "🌍", name: "Responsible AI", desc: "Build AI that is fair, safe, and ethical.", color: "#EA580C", bg: "linear-gradient(135deg, #FED7AA, #FDBA74)" },
];

const howSteps = [
  { icon: <BookOpen size={20} />, title: "Choose Your World", desc: "Pick a learning world — from AI Basics to Responsible AI." },
  { icon: <Gamepad2 size={20} />, title: "Complete Missions", desc: "Play games, solve puzzles, and complete interactive challenges." },
  { icon: <Brain size={20} />, title: "Ask Your AI Tutor", desc: "TARA's AI Tutor explains any topic in simple, fun language." },
  { icon: <Trophy size={20} />, title: "Earn XP & Badges", desc: "Level up, unlock achievements, and climb the leaderboard!" },
];

const testimonials = [
  { name: "Riya Sharma", class: "Class 8", text: "TARA made me actually excited to learn AI! I built my first image classifier in the AI Lab!", avatar: "👧" },
  { name: "Arjun Mehta", class: "Class 7", text: "The pattern missions are so fun. I learned more in one week than in a whole term!", avatar: "👦" },
  { name: "Sneha Rao", class: "Class 9", text: "I love how TARA explains hard topics with simple examples and visuals.", avatar: "👧" },
];

export default function HomePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -80]);
  const cloudY1 = useTransform(scrollY, [0, 300], [0, -30]);
  const cloudY2 = useTransform(scrollY, [0, 300], [0, -50]);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation />

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <motion.div style={{ y: heroY }} className="absolute inset-0">
            <Image
              src="/images/hero_bg.jpg"
              alt="TARA magical learning world"
              fill
              className="object-cover object-center opacity-30"
              priority
            />
          </motion.div>
          {/* Sky gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-violet-50/60 to-sky-100/80" />
        </div>

        {/* Floating clouds */}
        <motion.div style={{ y: cloudY1 }} className="absolute top-20 left-[5%] w-32 h-14 bg-white/70 rounded-full blur-sm animate-cloud-drift z-0" />
        <motion.div style={{ y: cloudY2 }} className="absolute top-32 right-[15%] w-24 h-10 bg-white/60 rounded-full blur-sm animate-cloud-drift-2 z-0" />
        <motion.div style={{ y: cloudY1 }} className="absolute top-48 left-[30%] w-20 h-8 bg-white/50 rounded-full blur-sm animate-cloud-drift z-0" />

        {/* ── Left-Side Floating Educational Emojis ────────────────────── */}
        <LeftHeroFloatingEmojis />

        {/* Ambient right-side icons */}
        <FloatingIcon icon="💡" className="top-[20%] right-[12%] opacity-60" delay={0.8} duration={4} />
        <FloatingIcon icon="🚀" className="top-[35%] right-[8%] opacity-60" delay={1.2} duration={3.8} />
        <FloatingIcon icon="🎮" className="top-[60%] right-[18%] opacity-50" delay={0.6} duration={4.5} />
        <FloatingIcon icon="🌟" className="top-[15%] right-[30%] opacity-50" delay={2} duration={3} />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text + CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-700 mb-6"
            >
              <Sparkles size={14} />
              AI Powered Learning for Future Ready Students
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-900 leading-tight mb-6"
              style={{ color: "#172554" }}
            >
              Turn Curiosity
              <br />
              <span className="relative">
                <span style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Into Superpowers
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg"
            >
              A smart education platform that helps school students learn more effectively, efficiently, flexibly and comfortably in the digital age through AI, games and real-world challenges.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link href="/auth/signup">
                <motion.button
                  className="btn-primary flex items-center gap-2.5 text-base px-7 py-3.5 rounded-2xl font-800"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start Learning <ArrowRight size={18} />
                </motion.button>
              </Link>
              <motion.button
                onClick={() => setVideoModalOpen(true)}
                className="flex items-center gap-2.5 bg-white text-slate-700 border-2 border-slate-200 px-7 py-3.5 rounded-2xl font-700 text-base hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                  <Play size={14} className="text-violet-600 fill-violet-600 ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <StatBadge icon="🔬" value="10+" label="Subjects" color="#6941F5" />
              <StatBadge icon="⚡" value="50+" label="Interactive Missions" color="#22C55E" />
              <StatBadge icon="👨‍🎓" value="1000+" label="Students Learning" color="#3B82F6" />
              <StatBadge icon="🤖" value="24/7" label="AI Study Support" color="#FBBF24" />
            </motion.div>
          </div>

          {/* Right: Characters */}
          <div className="relative hidden lg:flex justify-center items-end h-[480px]">
            {/* Robot character */}
            <motion.div
              className="absolute right-10 bottom-0 w-52 z-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/robot.jpg"
                  alt="TARA AI Robot"
                  width={220}
                  height={280}
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Student character */}
            <motion.div
              className="absolute left-8 bottom-0 w-56 z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/student.jpg"
                  alt="TARA Student"
                  width={240}
                  height={320}
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Floating info cards */}
            <motion.div
              className="absolute top-10 left-20 glass-card rounded-2xl px-4 py-3 shadow-lg z-20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <div>
                  <p className="text-xs font-700 text-slate-700">Learn</p>
                  <p className="text-xs text-slate-400">50+ Missions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-24 right-4 glass-card rounded-2xl px-4 py-3 shadow-lg z-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🌍</span>
                <div>
                  <p className="text-xs font-700 text-slate-700">Explore</p>
                  <p className="text-xs text-slate-400">5 Worlds</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-20 right-2 glass-card rounded-2xl px-4 py-3 shadow-lg z-20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <div>
                  <p className="text-xs font-700 text-slate-700">+50 XP earned!</p>
                  <div className="h-1.5 w-16 bg-slate-100 rounded-full mt-1">
                    <div className="h-1.5 w-10 bg-violet-500 rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Feature Cards ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-900 mb-3" style={{ color: "#172554" }}>Why Students Love TARA</h2>
          <p className="text-slate-500 text-lg">Learning that&apos;s fun, engaging, and actually works</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard icon="🎮" title="Play & Learn" desc="Game-based missions make every lesson an adventure. Earn XP, badges and level up!" color="#6941F5" delay={0} />
          <FeatureCard icon="🔬" title="Real Experiments" desc="Train actual AI models in the AI Lab. Watch your code come to life!" color="#22C55E" delay={0.1} />
          <FeatureCard icon="🌍" title="Real-World Challenges" desc="Solve actual global problems with AI — clean oceans, detect fake news and more." color="#3B82F6" delay={0.2} />
          <FeatureCard icon="🏆" title="Achievements" desc="Track your progress with XP, streak badges, certificates and leaderboards." color="#FBBF24" delay={0.3} />
        </div>
      </section>

      {/* ── Explore Learning Worlds ───────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6" style={{ background: "linear-gradient(180deg, #EAF5FF 0%, #F0ECFF 100%)" }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-900 mb-3" style={{ color: "#172554" }}>Explore Learning Worlds</h2>
            <p className="text-slate-500 text-lg">Complete missions to unlock new worlds and master concepts!</p>
          </motion.div>

          {/* World Map Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden mb-10 shadow-2xl"
          >
            <Image
              src="/images/world_map.jpg"
              alt="TARA Learning World Map"
              width={1200}
              height={600}
              className="w-full h-72 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
              <Link href="/explore">
                <motion.button
                  className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl"
                  whileHover={{ scale: 1.04 }}
                >
                  Explore All Worlds <ArrowRight size={18} />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {learningWorlds.map((world, i) => (
              <WorldCard key={world.name} world={world} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-700 mb-6">
                  <Zap size={14} /> How It Works
                </div>
                <h2 className="text-4xl font-900 mb-4" style={{ color: "#172554" }}>
                  Start your AI journey
                  <br />in 4 simple steps
                </h2>
                <p className="text-slate-500 mb-8">TARA guides you from curious beginner to confident AI creator through structured, engaging learning paths.</p>
              </motion.div>

              <div className="space-y-7">
                {howSteps.map((step, i) => (
                  <HowStep key={step.title} num={i + 1} {...step} delay={i * 0.1} />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <Link href="/auth/signup">
                  <motion.button
                    className="btn-primary flex items-center gap-2 px-7 py-3.5 rounded-2xl text-base font-800"
                    whileHover={{ scale: 1.04 }}
                  >
                    Get Started Free <ArrowRight size={18} />
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Visual side */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-3xl p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🤖", label: "AI Tutor", color: "#6941F5" },
                    { icon: "🔬", label: "AI Lab", color: "#22C55E" },
                    { icon: "🎮", label: "Missions", color: "#3B82F6" },
                    { icon: "🏆", label: "Rewards", color: "#FBBF24" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      className="bg-white rounded-2xl p-5 text-center shadow-sm"
                      whileHover={{ scale: 1.05, y: -4 }}
                      animate={{ y: [0, i % 2 === 0 ? -5 : 5, 0] }}
                      transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <p className="text-sm font-700" style={{ color: item.color }}>{item.label}</p>
                    </motion.div>
                  ))}
                </div>
                {/* Sample mission preview */}
                <motion.div
                  className="mt-4 bg-white rounded-2xl p-4 shadow-sm border border-violet-100"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-700 text-slate-700">AI Basics World</span>
                    <span className="text-xs text-violet-600 font-700 bg-violet-50 px-2 py-0.5 rounded-full">4/6 Done</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #6941F5, #22C55E)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: "67%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-900 mb-3" style={{ color: "#172554" }}>What Students Say</h2>
            <p className="text-slate-500">Real feedback from real learners</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-xl">{t.avatar}</div>
                  <div>
                    <p className="font-700 text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.class}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #6941F5 0%, #4C2AD9 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🚀
            </motion.div>
            <h2 className="text-4xl font-900 text-white mb-4">
              Ready to become an AI Explorer?
            </h2>
            <p className="text-violet-200 text-lg mb-8">
              Join thousands of students already learning with TARA. Free to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <motion.button
                  className="bg-white text-violet-700 font-800 px-8 py-4 rounded-2xl text-base flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start Learning Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link href="/explore">
                <motion.button
                  className="border-2 border-white/50 text-white font-700 px-8 py-4 rounded-2xl text-base hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.04 }}
                >
                  Explore Worlds
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-900" style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}>⭐</div>
                <span className="text-xl font-900 text-violet-600">TARA</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">An AI-powered smart education platform turning curiosity into superpowers for school students.</p>
            </div>

            <div>
              <h4 className="font-800 text-slate-700 mb-4">Platform</h4>
              <div className="space-y-2">
                {["Learn", "Explore Worlds", "AI Tutor", "AI Lab", "Challenges"].map(l => (
                  <Link key={l} href="#" className="block text-sm text-slate-500 hover:text-violet-600 transition-colors">{l}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-800 text-slate-700 mb-4">Community</h4>
              <div className="space-y-2">
                {["Challenges", "Achievements", "Learning Paths", "Safety Guidelines", "Parent Guide"].map(l => (
                  <Link key={l} href="#" className="block text-sm text-slate-500 hover:text-violet-600 transition-colors">{l}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-800 text-slate-700 mb-4">About</h4>
              <div className="space-y-2">
                {["Our Mission", "Team", "Blog", "Privacy Policy", "Terms of Service"].map(l => (
                  <Link key={l} href="#" className="block text-sm text-slate-500 hover:text-violet-600 transition-colors">{l}</Link>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400">© 2026 TARA. Turning Curiosity Into Superpowers. 🚀</p>
            <div className="flex gap-2">
              {["🌐", "📘", "🐦", "▶️"].map((icon) => (
                <button key={icon} className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-lg hover:bg-violet-100 transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── Video Demo Modal ───────────────────────────────────────────────────── */}
      {videoModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setVideoModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-900 mb-3" style={{ color: "#172554" }}>TARA Demo</h3>
            <p className="text-slate-500 mb-6">See how TARA transforms learning into an exciting adventure!</p>
            <div className="bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl aspect-video flex items-center justify-center mb-6">
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Play size={32} className="text-white fill-white ml-2" />
                </motion.div>
                <p className="text-violet-700 font-700">Demo Video Coming Soon!</p>
              </div>
            </div>
            <button onClick={() => setVideoModalOpen(false)} className="btn-primary px-8 py-3 rounded-xl">
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
