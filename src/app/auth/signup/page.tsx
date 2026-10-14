"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, School, ArrowRight,
  CheckCircle2, AlertCircle, BookOpen, Shield, Sparkles
} from "lucide-react";
import Image from "next/image";
import { loginAsDemo, loginUser, parseClassNumber } from "@/lib/auth";

type Role = "student" | "admin";

const grades = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6",
  "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"
];

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("student");
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    grade: "",
    school: "",
  });

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push("/dashboard");
  };

  const update = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.email.includes("@")) errs.email = "Enter a valid email address";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (role === "student" && !form.grade) errs.grade = "Please select your class";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    const parsed = role === "student" ? parseClassNumber(form.grade) : null;
    const classNum = parsed !== null ? parsed : undefined;
    loginUser({
      name: form.fullName,
      email: form.email,
      role,
      class: form.grade,
      classNumber: classNum,
      school: form.school,
    });
    setSuccess(true);
    // Background sync with profile API
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classNumber: classNum, school: form.school }),
    }).catch(() => {});
    await new Promise(r => setTimeout(r, 1600));
    router.push("/dashboard");
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#EAF5FF" }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 bg-white rounded-3xl shadow-xl border border-violet-100 max-w-md mx-4"
        >
          <motion.div
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-3xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-6 shadow-inner"
          >
            <Sparkles size={40} />
          </motion.div>
          <h2 className="text-3xl font-900 mb-2" style={{ color: "#172554" }}>Welcome to TARA!</h2>
          <p className="text-slate-500 mb-6">Your personalized learning world is ready. Taking you to your dashboard...</p>
          <motion.div
            className="w-24 h-1.5 rounded-full mx-auto"
            style={{ background: "#6941F5" }}
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#EAF5FF" }}>
      {/* Left Panel – Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}>
        <div className="absolute inset-0">
          <Image src="/images/hero_bg.jpg" alt="TARA World" fill className="object-cover opacity-20" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <Link href="/" className="flex items-center gap-2 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-900">⭐</div>
            <span className="text-2xl font-900">TARA</span>
          </Link>

          <h2 className="text-5xl font-900 leading-tight mb-6">
            Begin Your
            <br />AI Adventure!
          </h2>
          <p className="text-violet-200 text-lg mb-12">
            Join thousands of students turning curiosity into real-world skills.
          </p>

          {/* Characters */}
          <div className="flex justify-center items-end gap-6">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-40"
            >
              <Image src="/images/robot.jpg" alt="TARA Robot" width={160} height={200} className="object-contain drop-shadow-2xl" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-44"
            >
              <Image src="/images/student.jpg" alt="Student" width={180} height={240} className="object-contain drop-shadow-2xl" />
            </motion.div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute top-1/4 right-8 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-white"
          >
            <p className="text-sm font-700">🏆 10,000+ Missions</p>
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 3, delay: 1, repeat: Infinity }}
            className="absolute bottom-1/3 right-16 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-white"
          >
            <p className="text-sm font-700">⭐ 1000+ Students</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-900" style={{ background: "#6941F5" }}>⭐</div>
          <span className="text-2xl font-900 text-violet-600">TARA</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Back to login */}
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-6 transition-colors">
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-900 mb-2" style={{ color: "#172554" }}>Create Your Account</h1>
          <p className="text-slate-500 mb-8">Start your learning journey with TARA</p>

          {/* Quick Demo Access Button */}
          <motion.button
            type="button"
            onClick={handleDemoLogin}
            className="w-full mb-6 py-4 px-5 rounded-2xl font-800 text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg shadow-violet-200/50 border-2 border-violet-400 text-white transition-all group cursor-pointer"
            style={{ background: "linear-gradient(135deg, #6941F5 0%, #4C2AD9 100%)" }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={18} className="text-yellow-300 fill-yellow-300 transition-transform group-hover:rotate-12" />
            <span>Continue with Demo Account</span>
            <span className="text-xs font-700 bg-white/20 px-2.5 py-1 rounded-full text-violet-100">1-Click</span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs uppercase tracking-wider font-700 text-slate-400">or register with email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Role selector */}
          <div className="flex rounded-2xl overflow-hidden border-2 border-violet-100 mb-8 p-1 bg-violet-50">
            {(["student", "admin"] as Role[]).map((r) => (
              <motion.button
                key={r}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-700 text-sm transition-all ${
                  role === r ? "bg-white shadow-md text-violet-700" : "text-slate-500"
                }`}
                onClick={() => setRole(r)}
                whileTap={{ scale: 0.97 }}
              >
                {r === "student" ? <BookOpen size={16} /> : <Shield size={16} />}
                {r === "student" ? "Student" : "Administrator"}
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-700 text-slate-600 mb-1.5">Full Name</label>
              <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-colors ${
                errors.fullName ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus-within:border-violet-400"
              }`}>
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={e => update("fullName", e.target.value)}
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-700 text-slate-600 mb-1.5">Email Address</label>
              <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-colors ${
                errors.email ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus-within:border-violet-400"
              }`}>
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-700 text-slate-600 mb-1.5">Password</label>
              <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-colors ${
                errors.password ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus-within:border-violet-400"
              }`}>
                <Lock size={18} className="text-slate-400" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={e => update("password", e.target.value)}
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-300 bg-transparent"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-400 hover:text-violet-600">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.password}</p>}
            </div>

            {/* Role-specific fields */}
            <AnimatePresence mode="wait">
              {role === "student" && (
                <motion.div
                  key="student-grade"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-700 text-slate-600 mb-1.5">Class / Grade</label>
                  <div className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-colors ${
                    errors.grade ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus-within:border-violet-400"
                  }`}>
                    <School size={18} className="text-slate-400" />
                    <select
                      value={form.grade}
                      onChange={e => update("grade", e.target.value)}
                      className="flex-1 outline-none text-sm text-slate-700 bg-transparent"
                    >
                      <option value="">Select your class</option>
                      {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  {errors.grade && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.grade}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-800 mt-2"
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
                <>Create Account <ArrowRight size={18} /></>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-600">or continue with</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              {["🌐 Google", "🪟 Microsoft"].map(p => (
                <motion.button
                  key={p}
                  type="button"
                  className="border-2 border-slate-200 bg-white rounded-xl py-3 text-sm font-700 text-slate-600 hover:border-violet-300 hover:bg-violet-50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-violet-600 font-700 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
