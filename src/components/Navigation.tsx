"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Menu, X, Star, Flame, ChevronDown,
  Home, BookOpen, Globe, Trophy, LogOut, User,
  Settings, BarChart2, Zap, Sparkles, ArrowRight,
  type LucideIcon
} from "lucide-react";
import type { UserRole } from "@/lib/types";
import { logout, isDemoSession } from "@/lib/auth";

interface NavProps {
  role?: UserRole | null;
  userName?: string;
  xp?: number;
  streak?: number;
  level?: number;
  isDemo?: boolean;
}

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "/learn" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
];

const studentLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Explore", href: "/explore", icon: Globe },
  { label: "Challenges", href: "/challenges", icon: Star },
  { label: "Achievements", href: "/achievements", icon: Trophy },
];

export default function Navigation({ role = null, userName, xp = 0, streak = 0, level = 1, isDemo }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [demoActive, setDemoActive] = useState(isDemo ?? false);

  useEffect(() => {
    setDemoActive(isDemo !== undefined ? isDemo : isDemoSession());
    const onAuthChange = () => setDemoActive(isDemoSession());
    window.addEventListener("tara-auth-change", onAuthChange);
    return () => window.removeEventListener("tara-auth-change", onAuthChange);
  }, [isDemo]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  const links = role === "student" ? studentLinks : publicLinks;
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-violet-100/50"
            : "bg-white/90 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={role === "student" ? "/dashboard" : "/"} className="flex items-center gap-2 flex-shrink-0">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Sparkles size={18} />
              </motion.div>
              <span className="text-xl font-black" style={{ color: "#6941F5" }}>TARA</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-600 transition-all duration-200 relative ${
                    isActive(link.href)
                      ? "text-violet-600 font-700 bg-violet-50"
                      : "text-slate-600 hover:text-violet-600 hover:bg-violet-50"
                  }`}
                  style={{ fontWeight: isActive(link.href) ? 700 : 600 }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "#6941F5" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <motion.button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl text-slate-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search size={20} />
              </motion.button>

              {!role && (
                <>
                  <Link
                    href="/auth/login"
                    className="hidden sm:block px-4 py-2 text-sm font-700 text-slate-600 hover:text-violet-600 transition-colors rounded-xl hover:bg-violet-50"
                    style={{ fontWeight: 700 }}
                  >
                    Sign In
                  </Link>
                  <Link href="/auth/signup">
                    <motion.button
                      className="btn-primary text-sm px-5 py-2.5 rounded-xl"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Get Started
                    </motion.button>
                  </Link>
                </>
              )}

              {role === "student" && (
                <div className="hidden sm:flex items-center gap-2">
                  {/* Demo indicator */}
                  {demoActive && (
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-800 shadow-sm" title="Exploring with Demo Student Account">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>Demo Mode</span>
                    </div>
                  )}

                  {/* Notifications */}
                  <div className="relative">
                    <motion.button
                      onClick={() => {
                        setNotifOpen(!notifOpen);
                        setProfileOpen(false);
                      }}
                      className="relative p-2 rounded-xl text-slate-500 hover:bg-violet-50 hover:text-violet-600 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bell size={20} />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </motion.button>

                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 overflow-hidden"
                        >
                          <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-800 text-sm text-slate-800">Notifications</span>
                            <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">New</span>
                          </div>
                          <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                            <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-2.5">
                              <Flame size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-800">7-Day Streak Maintained!</p>
                                <p className="text-[11px] text-slate-500">Keep it up to unlock the Fire Master badge.</p>
                              </div>
                            </div>
                            <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-2.5">
                              <Sparkles size={16} className="text-violet-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-800">New Mission Unlocked</p>
                                <p className="text-[11px] text-slate-500">World 1 Mission 3 is ready for exploration.</p>
                              </div>
                            </div>
                            <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-2.5">
                              <Zap size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-800">Tara is Online</p>
                                <p className="text-[11px] text-slate-500">Have a question about AI or patterns? Ask anytime!</p>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 px-3 border-t border-slate-100 text-center">
                            <button
                              onClick={() => setNotifOpen(false)}
                              className="text-xs font-bold text-violet-600 hover:text-violet-700 cursor-pointer"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* XP Badge */}
                  <div className="flex items-center gap-1 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-100">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-700 text-violet-700">{xp} XP</span>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                    <Flame size={14} className="text-orange-500" />
                    <span className="text-xs font-700 text-orange-600">{streak}d</span>
                  </div>

                  {/* Profile */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-100 hover:bg-violet-100 transition-colors"
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-violet-200 flex items-center justify-center text-xs font-700 text-violet-700">
                        {userName?.[0] || "A"}
                      </div>
                      <span className="text-xs font-700 text-violet-700 max-w-[80px] truncate">{userName || "Aarav"}</span>
                      <ChevronDown size={12} className="text-violet-500" />
                    </motion.button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden"
                        >
                          {demoActive && (
                            <div className="px-4 py-2 bg-amber-50/90 border-b border-amber-100 mb-1">
                              <p className="text-xs font-800 text-amber-800 flex items-center gap-1">
                                <Zap size={13} className="text-amber-500 fill-amber-500" /> Demo Account
                              </p>
                              <p className="text-[10px] text-amber-600 font-600">Sample Student • Aarav Sharma</p>
                            </div>
                          )}
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-sm text-slate-600">
                            <User size={16} /> Profile
                          </Link>
                          <Link href="/progress" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-sm text-slate-600">
                            <BarChart2 size={16} /> My Progress
                          </Link>
                          <hr className="my-1 border-slate-100" />
                          <button
                            onClick={() => {
                              logout();
                              window.location.href = "/";
                            }}
                            className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-500 font-600"
                          >
                            <LogOut size={16} /> {demoActive ? "Exit Demo Account" : "Sign Out"}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-violet-50 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Search Panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 bg-white shadow-lg"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
                  <Search size={20} className="text-violet-400" />
                  <input
                    type="text"
                    placeholder="Search topics, missions, subjects..."
                    className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => setSearchOpen(false)} className="cursor-pointer">
                    <X size={18} className="text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                {searchQuery && (
                  <div className="mt-2 space-y-1">
                    {[
                      { title: "AI Basics World", path: "/dashboard/worlds/world-1", subtitle: "World 1 • 5 Interactive Missions" },
                      { title: "Machine Learning World", path: "/dashboard/worlds/world-2", subtitle: "World 2 • 5 Interactive Missions" },
                      { title: "Computer Vision World", path: "/dashboard/worlds/world-3", subtitle: "World 3 • 4 Interactive Missions" },
                      { title: "Spot the Pattern Mission", path: "/dashboard/mission/m1-2", subtitle: "Interactive Challenge" },
                      { title: "Train a Mini AI Mission", path: "/dashboard/mission/m1-3", subtitle: "Interactive Lab" },
                      { title: "Ask Tara (AI Tutor)", path: "/dashboard/ai-tutor", subtitle: "Personal AI Learning Buddy" },
                      { title: "Real-World Challenges", path: "/challenges", subtitle: "Solve real-world problems with AI" },
                      { title: "Achievements & Badges", path: "/achievements", subtitle: "View earned trophies and certificates" },
                    ]
                      .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(r => (
                        <button
                          key={r.title}
                          onClick={() => {
                            router.push(r.path);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-violet-50 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <Search size={15} className="text-violet-500 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-slate-800">{r.title}</p>
                              <p className="text-xs text-slate-400">{r.subtitle}</p>
                            </div>
                          </div>
                          <span className="text-xs text-violet-600 font-bold flex items-center gap-1">Go <ArrowRight size={12} /></span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-black text-violet-600">TARA</span>
                  <button onClick={() => setMobileOpen(false)}>
                    <X size={24} className="text-slate-500" />
                  </button>
                </div>

                {role === "student" && (
                  <div className="mb-6 p-4 bg-violet-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-violet-200 flex items-center justify-center text-lg">
                        {userName?.[0] || "A"}
                      </div>
                      <div>
                        <p className="font-700 text-slate-800">{userName || "Aarav"}</p>
                        <p className="text-xs text-violet-600">Level {level} • {xp} XP</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white rounded-xl px-3 py-2 text-center">
                        <p className="text-xs text-slate-500">XP</p>
                        <p className="font-700 text-violet-600">{xp}</p>
                      </div>
                      <div className="flex-1 bg-white rounded-xl px-3 py-2 text-center">
                        <p className="text-xs text-slate-500">Streak</p>
                        <p className="font-700 text-orange-500 flex items-center justify-center gap-1">
                          <Flame size={14} /> {streak}d
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <nav className="space-y-1">
                  {links.map((link) => {
                    const Icon = (link as { icon?: LucideIcon }).icon ?? null;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm ${
                          isActive(link.href)
                            ? "bg-violet-100 text-violet-700 font-700"
                            : "text-slate-600 hover:bg-slate-50 font-600"
                        }`}
                        style={{ fontWeight: isActive(link.href) ? 700 : 600 }}
                      >
                        {Icon && <Icon size={18} />}
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                {!role && (
                  <div className="mt-6 space-y-3">
                    <Link href="/auth/login" className="block w-full text-center py-3 border-2 border-violet-200 text-violet-600 font-700 rounded-xl hover:bg-violet-50 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="block w-full text-center py-3 btn-primary rounded-xl font-700">
                      Get Started Free
                    </Link>
                  </div>
                )}

                {role && (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    {demoActive && (
                      <div className="mb-3 px-3 py-2 bg-amber-50 rounded-xl text-xs font-700 text-amber-800 border border-amber-200 flex items-center justify-between">
                        <span>⚡ Demo Mode</span>
                        <span className="text-amber-600 font-600 text-[11px]">Aarav Sharma</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        window.location.href = "/";
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-600"
                    >
                      <LogOut size={18} /> {demoActive ? "Exit Demo Account" : "Sign Out"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* Overlay close for dropdowns */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
      {notifOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
      )}
    </>
  );
}
