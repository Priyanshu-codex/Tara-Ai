"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Menu, X, Star, Flame, ChevronDown,
  Home, BookOpen, Globe, Trophy, LogOut, User,
  Settings, BarChart2,
  type LucideIcon
} from "lucide-react";
import type { UserRole } from "@/lib/types";

interface NavProps {
  role?: UserRole | null;
  userName?: string;
  xp?: number;
  streak?: number;
  level?: number;
}

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "/learn" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
];

const studentLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Learn", href: "/dashboard/worlds", icon: BookOpen },
  { label: "Explore", href: "/explore", icon: Globe },
  { label: "Challenges", href: "/challenges", icon: Star },
  { label: "Achievements", href: "/achievements", icon: Trophy },
];

export default function Navigation({ role = null, userName, xp = 0, streak = 0, level = 1 }: NavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black text-white shadow-md"
                style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ⭐
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
                  {/* Notifications */}
                  <motion.button
                    className="relative p-2 rounded-xl text-slate-500 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </motion.button>

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
                          className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                        >
                          <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-sm text-slate-600">
                            <User size={16} /> Profile
                          </Link>
                          <Link href="/progress" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-sm text-slate-600">
                            <BarChart2 size={16} /> My Progress
                          </Link>
                          <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-sm text-slate-600">
                            <Settings size={16} /> Settings
                          </Link>
                          <hr className="my-1 border-slate-100" />
                          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-500">
                            <LogOut size={16} /> Sign Out
                          </Link>
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
              className="border-t border-slate-100 bg-white"
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
                  <button onClick={() => setSearchOpen(false)}>
                    <X size={18} className="text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                {searchQuery && (
                  <div className="mt-2 space-y-1">
                    {["AI Basics", "Machine Learning", "Linear Equations", "Photosynthesis"].filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).map(r => (
                      <button key={r} className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-violet-50 rounded-xl transition-colors">
                        🔍 {r}
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
                        <p className="font-700 text-orange-500">🔥 {streak}d</p>
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
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-600">
                      <LogOut size={18} /> Sign Out
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* Overlay close for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
}
