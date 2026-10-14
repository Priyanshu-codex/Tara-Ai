"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, BookOpen, GraduationCap } from "lucide-react";
import Image from "next/image";

type Role = "student" | "teacher";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    localStorage.setItem("tara_user", JSON.stringify({ email: form.email, role, name: role === "teacher" ? "Ms. Priya" : "Aarav Sharma" }));
    router.push(role === "teacher" ? "/teacher/dashboard" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#EAF5FF" }}>
      {/* Left Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}>
        <div className="absolute inset-0">
          <Image src="/images/hero_bg.jpg" alt="TARA World" fill className="object-cover opacity-20" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-900">⭐</div>
            <span className="text-2xl font-900">TARA</span>
          </Link>
          <h2 className="text-5xl font-900 leading-tight mb-6">Welcome Back,<br />Explorer! 🚀</h2>
          <p className="text-violet-200 text-lg mb-12">Continue your learning adventure. Your missions await!</p>
          <div className="flex justify-center items-end gap-6">
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-36">
              <Image src="/images/robot.jpg" alt="TARA Robot" width={150} height={190} className="object-contain drop-shadow-2xl" />
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }} className="w-40">
              <Image src="/images/student.jpg" alt="Student" width={160} height={220} className="object-contain drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right – Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-900" style={{ background: "#6941F5" }}>⭐</div>
          <span className="text-2xl font-900 text-violet-600">TARA</span>
        </Link>

        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors">
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-900 mb-2" style={{ color: "#172554" }}>Sign In to TARA</h1>
          <p className="text-slate-500 mb-8">Continue your learning adventure</p>

          {/* Role Selector */}
          <div className="flex rounded-2xl overflow-hidden border-2 border-violet-100 mb-8 p-1 bg-violet-50">
            {(["student", "teacher"] as Role[]).map((r) => (
              <motion.button
                key={r}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-700 text-sm transition-all ${
                  role === r ? "bg-white shadow-md text-violet-700" : "text-slate-500"
                }`}
                onClick={() => setRole(r)}
                whileTap={{ scale: 0.97 }}
              >
                {r === "student" ? <BookOpen size={16} /> : <GraduationCap size={16} />}
                {r === "student" ? "Student" : "Teacher"}
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Demo hint */}
            <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
              <p className="text-xs text-violet-600 font-600">
                🎯 Demo Mode: Enter any email & password to sign in as {role === "student" ? "Aarav (Student)" : "Ms. Priya (Teacher)"}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-700 text-slate-600 mb-1.5">Email Address</label>
              <div className="flex items-center gap-3 border-2 border-slate-200 bg-white rounded-xl px-4 py-3 focus-within:border-violet-400 transition-colors">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  placeholder={role === "student" ? "aarav@school.edu" : "priya@school.edu"}
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-700 text-slate-600">Password</label>
                <Link href="#" className="text-xs text-violet-600 hover:underline font-600">Forgot Password?</Link>
              </div>
              <div className="flex items-center gap-3 border-2 border-slate-200 bg-white rounded-xl px-4 py-3 focus-within:border-violet-400 transition-colors">
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-violet-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl"
              >
                <AlertCircle size={16} />{error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-800"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <> Sign In <ArrowRight size={18} /></>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-600">or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["🌐 Google", "🪟 Microsoft"].map(p => (
                <motion.button key={p} type="button" className="border-2 border-slate-200 bg-white rounded-xl py-3 text-sm font-700 text-slate-600 hover:border-violet-300 hover:bg-violet-50 transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {p}
                </motion.button>
              ))}
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-violet-600 font-700 hover:underline">Sign Up Free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
