"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Zap,
  Bot,
  Sparkles,
  Play,
  Lightbulb,
  Compass,
  Check,
  ChevronRight,
  Clock,
  Layers,
  HelpCircle,
  FlaskConical,
  FileQuestion,
  AlertCircle,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { getMissionById, isMissionEligibleForClass, MissionData, PatternItem } from "@/lib/missions/missionRegistry";
import { useAira } from "@/components/aira/AiraContext";
import { getStoredUser, DEMO_STUDENT, getStudentClassNumber, formatClassName } from "@/lib/auth";
import { recordMissionCompletion, isMissionCompleted, getMissionStars } from "@/lib/progress/progressManager";
import ClassSelectionModal from "@/components/ClassSelectionModal";
import type { Student } from "@/lib/types";

// SVG renderer for geometric pattern shapes
function ShapeIcon({ shape, color, size = 48 }: { shape: string; color: string; size?: number }) {
  const colorMap: Record<string, string> = {
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#22C55E",
    yellow: "#FBBF24",
    purple: "#8B5CF6",
    orange: "#F97316",
  };
  const fill = colorMap[color] || color;

  if (shape === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill={fill} />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" rx="14" fill={fill} />
      </svg>
    );
  }
  if (shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,8 94,88 6,88" fill={fill} />
      </svg>
    );
  }
  if (shape === "star") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,5 62,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 38,35" fill={fill} />
      </svg>
    );
  }
  if (shape === "hexagon") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon points="50,6 90,28 90,72 50,94 10,72 10,28" fill={fill} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points="50,8 90,50 50,92 10,50" fill={fill} />
    </svg>
  );
}

function MissionRunner({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = use(params);
  const router = useRouter();
  const { openAiraWithMission } = useAira();
  const [student, setStudent] = useState<Student>(DEMO_STUDENT);

  const mission: MissionData | null = getMissionById(missionId);

  // Gameplay state
  const [gameStarted, setGameStarted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [patternRound, setPatternRound] = useState(0);
  const [selectedPatternOpt, setSelectedPatternOpt] = useState<string | null>(null);
  const [patternSubmitted, setPatternSubmitted] = useState(false);
  const [showPatternHint, setShowPatternHint] = useState(false);

  // Sorting / checkpoint state
  const [sortedItems, setSortedItems] = useState<Record<string, string>>({});

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Experiment state
  const [experimentPhase, setExperimentPhase] = useState<"collect" | "train" | "test">("collect");
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);
  const [experimentLabels, setExperimentLabels] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<string | null>(null);

  // Challenge state
  const [challengeStep, setChallengeStep] = useState(0);
  const [selectedChallengeOptions, setSelectedChallengeOptions] = useState<Record<number, string>>({});
  const [selectedChallengeStepOpt, setSelectedChallengeStepOpt] = useState<number | null>(null);
  const [challengeStepSubmitted, setChallengeStepSubmitted] = useState(false);

  // Checkpoint question state (for video missions with multiple choice checkpoints)
  const [selectedCheckpointOpt, setSelectedCheckpointOpt] = useState<number | null>(null);
  const [checkpointSubmitted, setCheckpointSubmitted] = useState(false);

  // Class Selection Modal state
  const [showClassModal, setShowClassModal] = useState(false);

  // Completion & Reward Modal
  const [missionComplete, setMissionComplete] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);
  const [earnedXp, setEarnedXp] = useState(0);
  const [nextMissionId, setNextMissionId] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser() as Student | null;
    if (user) setStudent(user);

    const handleSync = () => {
      const updated = getStoredUser() as Student | null;
      if (updated) setStudent(updated);
    };

    window.addEventListener("tara-class-change", handleSync);
    window.addEventListener("tara-auth-change", handleSync);
    return () => {
      window.removeEventListener("tara-class-change", handleSync);
      window.removeEventListener("tara-auth-change", handleSync);
    };
  }, []);

  if (!mission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: "#EAF5FF" }}>
        <h1 className="text-3xl font-900 text-slate-800 mb-2">Mission Not Found</h1>
        <p className="text-slate-500 mb-6">The requested mission &quot;{missionId}&quot; could not be found in the curriculum registry.</p>
        <Link href="/explore" className="btn-primary px-6 py-3 rounded-2xl text-sm font-700">
          Back to World Map
        </Link>
      </div>
    );
  }

  const studentClass = getStudentClassNumber(student);
  const isEligible = isMissionEligibleForClass(mission.id, studentClass);

  // Handle final mission completion & server synchronization
  const triggerCompletion = async (score: number = 100) => {
    let stars = 3;
    if (score < 60) stars = 1;
    else if (score < 80) stars = 2;

    setEarnedStars(stars);

    try {
      const res = await fetch("/api/missions/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId: mission.id,
          score,
          userId: student.id,
          classNumber: studentClass,
        }),
      });

      const data = await res.json();
      const xp = data.xpAwarded || mission.xpReward;
      setEarnedXp(xp);
      setNextMissionId(data.nextMissionId);

      // Record in local progress manager & update reactive stats
      recordMissionCompletion(mission.id, mission.worldId, stars, xp);
    } catch {
      setEarnedXp(mission.xpReward);
      recordMissionCompletion(mission.id, mission.worldId, stars, mission.xpReward);
    }

    setMissionComplete(true);
  };

  const handlePatternSubmit = () => {
    if (!selectedPatternOpt || !mission.patternGame) return;
    setPatternSubmitted(true);
    const round = mission.patternGame.rounds[patternRound];
    const isCorrect = selectedPatternOpt === round.correctId;

    if (isCorrect) {
      if (patternRound < mission.patternGame.rounds.length - 1) {
        setTimeout(() => {
          setPatternRound((r) => r + 1);
          setSelectedPatternOpt(null);
          setPatternSubmitted(false);
          setShowPatternHint(false);
        }, 1200);
      } else {
        setTimeout(() => triggerCompletion(100), 1000);
      }
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizOpt === null || !mission.quizContent) return;
    setQuizSubmitted(true);
    const currentQ = mission.quizContent.questions[quizIndex];
    const isCorrect = selectedQuizOpt === currentQ.correctIndex;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizScore(newScore);
  };

  const handleNextQuizQuestion = () => {
    if (!mission.quizContent) return;
    if (quizIndex < mission.quizContent.questions.length - 1) {
      setQuizIndex((q) => q + 1);
      setSelectedQuizOpt(null);
      setQuizSubmitted(false);
    } else {
      const totalQ = mission.quizContent.questions.length;
      const scorePct = Math.round((quizScore / totalQ) * 100);
      triggerCompletion(scorePct);
    }
  };

  const runTrainingSimulation = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 60));
      setTrainingProgress(i);
    }
    setIsTraining(false);
    setExperimentPhase("test");
  };

  const handleTestInference = () => {
    setTestResult("Verified Accurate (Confidence: 96%)");
    setTimeout(() => triggerCompletion(100), 1200);
  };

  const alreadyDone = isMissionCompleted(mission.id);
  const bestStars = getMissionStars(mission.id);

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/dashboard/worlds/${mission.worldId}`}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to {mission.worldName}
          </Link>

          {alreadyDone && (
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-700 border border-green-200">
              <CheckCircle2 size={13} className="text-green-600" /> Completed ({bestStars} Stars)
            </div>
          )}
        </div>

        {/* Mission Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-inner flex-shrink-0"
              style={{ background: mission.worldColor }}
            >
              {mission.type === "video" ? (
                <Play size={24} className="fill-white" />
              ) : mission.type === "pattern" ? (
                <Compass size={24} />
              ) : mission.type === "experiment" ? (
                <FlaskConical size={24} />
              ) : mission.type === "quiz" ? (
                <FileQuestion size={24} />
              ) : (
                <Sparkles size={24} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <span
                  className="text-xs font-800 text-white px-2.5 py-0.5 rounded-full"
                  style={{ background: mission.worldColor }}
                >
                  World {mission.worldId.replace("world-", "")} • Mission {mission.order}
                </span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-700 capitalize">
                  {mission.difficulty}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < (alreadyDone ? bestStars : mission.stars) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"}
                    />
                  ))}
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-900 text-slate-800">{mission.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{mission.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3.5 py-1.5 rounded-xl border border-amber-200">
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-800">+{mission.xpReward} XP</span>
            </div>
          </div>
        </motion.div>

        {/* Class Eligibility Warning Banner */}
        {!isEligible && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-900 text-sm sm:text-base text-amber-950">
                  Curriculum Grade Level Notice
                </h4>
                <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
                  This mission is designed for{" "}
                  <strong>
                    {mission.classRange
                      ? `Classes ${mission.classRange[0]}–${mission.classRange[1]}`
                      : "another grade tier"}
                  </strong>
                  . Your profile is currently set to{" "}
                  <strong>{formatClassName(studentClass)}</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowClassModal(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-800 text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                Change My Class
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white hover:bg-amber-100 text-amber-900 font-700 text-xs rounded-xl border border-amber-300 cursor-pointer transition-colors"
              >
                My Class Missions
              </Link>
            </div>
          </div>
        )}

        {/* ── PRE-GAME BRIEFING / START SCREEN ────────────────────────────── */}
        {!gameStarted ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-800 text-slate-800 text-base mb-3 flex items-center gap-2">
                  <Compass size={18} className="text-violet-600" /> Mission Objective
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">{mission.description}</p>

                <h4 className="font-800 text-slate-700 text-sm mb-2.5">What You Will Learn:</h4>
                <ul className="space-y-2 mb-6">
                  {mission.learningObjectives.map((obj, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-800 text-slate-700 text-sm mb-2.5">Instructions:</h4>
                <div className="space-y-2 mb-8">
                  {mission.instructions.map((inst, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-600 border border-slate-100 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  onClick={() => setGameStarted(true)}
                  className="w-full py-4 rounded-2xl text-base font-800 text-white shadow-lg btn-primary flex items-center justify-center gap-2 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play size={18} />
                  {alreadyDone ? "Replay Mission Challenge" : "Start Mission Now"}
                </motion.button>
              </motion.div>
            </div>

            {/* Sidebar with Ask Tara */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <Bot size={19} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-800 text-sm">Need Help? Ask Tara</h4>
                    <p className="text-[11px] text-violet-200">Your AI Learning Buddy</p>
                  </div>
                </div>
                <p className="text-xs text-violet-100 mb-4 leading-relaxed">
                  Tara is ready to give you progressive hints, explain tricky terms, or answer any questions about this mission!
                </p>
                <motion.button
                  onClick={() =>
                    openAiraWithMission({
                      worldId: mission.worldId,
                      worldName: mission.worldName,
                      missionId: mission.id,
                      missionTitle: mission.title,
                      instructions: mission.instructions.join(" "),
                    })
                  }
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 rounded-xl bg-white text-violet-700 font-800 text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} className="text-violet-600" /> Ask Tara for Hints
                </motion.button>
              </motion.div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
                <h4 className="font-800 text-slate-800 text-sm">Mission Details</h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Est. Duration</span>
                  <span className="font-700 text-slate-700 flex items-center gap-1">
                    <Clock size={12} /> {mission.estimatedMinutes} mins
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Category</span>
                  <span className="font-700 text-slate-700 capitalize">{mission.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Reward</span>
                  <span className="font-700 text-violet-600">+{mission.xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── ACTIVE GAMEPLAY INTERFACE ────────────────────────────────────── */
          <div className="space-y-6">
            {/* TYPE 1: VIDEO / INTERACTIVE CONCEPT LESSON */}
            {mission.type === "video" && mission.videoLesson && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <span className="text-xs font-700 text-slate-400">
                    Concept Step {currentSlide + 1} of {mission.videoLesson.slides.length + 1}
                  </span>
                  <button
                    onClick={() =>
                      openAiraWithMission({
                        worldId: mission.worldId,
                        worldName: mission.worldName,
                        missionId: mission.id,
                        missionTitle: mission.title,
                        instructions: "Concept check question",
                      })
                    }
                    className="text-xs text-violet-600 font-700 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Bot size={13} /> Ask Tara to simplify
                  </button>
                </div>

                {currentSlide < mission.videoLesson.slides.length ? (
                  <div>
                    {(() => {
                      const slide = mission.videoLesson.slides[currentSlide];
                      return (
                        <div className="space-y-4">
                          <div className="text-5xl mb-2">{slide.icon}</div>
                          <h2 className="text-2xl font-900 text-slate-800">{slide.title}</h2>
                          <p className="text-sm font-700 text-violet-600">{slide.subtitle}</p>

                          <div className="space-y-3 py-3">
                            {slide.content.map((p, i) => (
                              <p key={i} className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                {p}
                              </p>
                            ))}
                          </div>

                          {slide.diagram && (
                            <div className="my-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-around text-center">
                              <span className="px-3 py-1.5 bg-white rounded-xl shadow-xs text-xs font-700 text-slate-700">
                                {slide.diagram.leftLabel}
                              </span>
                              <span className="text-xs font-800 text-blue-600">➔ {slide.diagram.middleArrow} ➔</span>
                              <span className="px-3 py-1.5 bg-blue-600 rounded-xl shadow-xs text-xs font-700 text-white">
                                {slide.diagram.rightLabel}
                              </span>
                            </div>
                          )}

                          <div className="pt-6 flex justify-between items-center">
                            <button
                              disabled={currentSlide === 0}
                              onClick={() => setCurrentSlide((s) => s - 1)}
                              className="px-4 py-2 text-xs font-700 text-slate-500 disabled:opacity-30 cursor-pointer"
                            >
                              ← Previous
                            </button>
                            <button
                              onClick={() => setCurrentSlide((s) => s + 1)}
                              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-800 flex items-center gap-1.5 cursor-pointer"
                            >
                              Next Concept <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  /* Interactive Checkpoint */
                  mission.videoLesson.checkpoint ? (
                    <div className="space-y-5">
                      <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-700">
                        <Sparkles size={12} /> Interactive Checkpoint
                      </div>
                      <h2 className="text-xl font-900 text-slate-800">
                        {mission.videoLesson.checkpoint.prompt}
                      </h2>

                      <div className="space-y-3">
                        {mission.videoLesson.checkpoint.items.map((item) => {
                          const currentChoice = sortedItems[item.id];
                          return (
                            <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="text-sm font-700 text-slate-700">{item.text}</span>
                              </div>
                              <div className="flex gap-2">
                                {mission.videoLesson!.checkpoint!.categories.map((cat) => (
                                  <button
                                    key={cat}
                                    onClick={() => setSortedItems((prev) => ({ ...prev, [item.id]: cat }))}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-700 transition-all cursor-pointer ${
                                      currentChoice === cat
                                        ? "bg-violet-600 text-white shadow-xs"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-violet-300"
                                    }`}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-4 flex justify-between items-center">
                        <button
                          onClick={() => setCurrentSlide((s) => s - 1)}
                          className="px-4 py-2 text-xs font-700 text-slate-500 cursor-pointer"
                        >
                          ← Back to Slides
                        </button>
                        <button
                          onClick={() => triggerCompletion(100)}
                          disabled={
                            Object.keys(sortedItems).length <
                            mission.videoLesson.checkpoint.items.length
                          }
                          className="btn-primary px-8 py-3 rounded-xl text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
                        >
                          Complete Mission & Earn XP!
                        </button>
                      </div>
                    </div>
                  ) : mission.videoLesson.checkpointQuestion ? (
                    <div className="space-y-5">
                      <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-700">
                        <Sparkles size={12} /> Knowledge Checkpoint
                      </div>
                      <h2 className="text-lg sm:text-xl font-900 text-slate-800">
                        {mission.videoLesson.checkpointQuestion.question}
                      </h2>

                      <div className="space-y-3">
                        {mission.videoLesson.checkpointQuestion.options.map((opt, idx) => {
                          const isSelected = selectedCheckpointOpt === idx;
                          return (
                            <button
                              key={idx}
                              disabled={checkpointSubmitted}
                              onClick={() => setSelectedCheckpointOpt(idx)}
                              className={`w-full text-left p-4 rounded-2xl border-2 flex items-start gap-3 transition-all cursor-pointer ${
                                isSelected
                                  ? checkpointSubmitted
                                    ? idx === mission.videoLesson!.checkpointQuestion!.correctIndex
                                      ? "border-green-500 bg-green-50 text-green-900"
                                      : "border-red-400 bg-red-50 text-red-900"
                                    : "border-violet-600 bg-violet-50"
                                  : "border-slate-200 bg-white hover:border-violet-300"
                              }`}
                            >
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-xs sm:text-sm font-600 text-slate-800">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {checkpointSubmitted && (
                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            selectedCheckpointOpt === mission.videoLesson.checkpointQuestion.correctIndex
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <div className="font-800 mb-1">
                            {selectedCheckpointOpt === mission.videoLesson.checkpointQuestion.correctIndex
                              ? "✅ Excellent Observation!"
                              : "💡 Learning Point"}
                          </div>
                          {mission.videoLesson.checkpointQuestion.explanation}
                        </div>
                      )}

                      <div className="pt-4 flex justify-between items-center">
                        <button
                          onClick={() => setCurrentSlide((s) => s - 1)}
                          className="px-4 py-2 text-xs font-700 text-slate-500 cursor-pointer"
                        >
                          ← Back to Slides
                        </button>

                        {!checkpointSubmitted ? (
                          <button
                            onClick={() => setCheckpointSubmitted(true)}
                            disabled={selectedCheckpointOpt === null}
                            className="btn-primary px-8 py-3 rounded-xl text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
                          >
                            Verify Answer
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const score =
                                selectedCheckpointOpt === mission.videoLesson!.checkpointQuestion!.correctIndex ? 100 : 75;
                              triggerCompletion(score);
                            }}
                            className="btn-primary px-8 py-3 rounded-xl text-sm font-800 cursor-pointer shadow-md"
                          >
                            Complete Mission & Earn XP!
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5 text-center py-6">
                      <div className="text-4xl">🎉</div>
                      <h3 className="text-lg font-900 text-slate-800">You mastered all lesson concepts!</h3>
                      <button
                        onClick={() => triggerCompletion(100)}
                        className="btn-primary px-8 py-3 rounded-xl text-sm font-800 cursor-pointer shadow-md"
                      >
                        Claim Your Rewards
                      </button>
                    </div>
                  )
                )}
              </div>
            )}

            {/* TYPE 2: PATTERN PUZZLE */}
            {mission.type === "pattern" && mission.patternGame && (
              <div className="space-y-6">
                {(() => {
                  const round = mission.patternGame.rounds[patternRound];
                  const isCorrect = selectedPatternOpt === round.correctId;

                  return (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-800 text-violet-700 bg-violet-50 px-3 py-1 rounded-full">
                          Round {patternRound + 1} of {mission.patternGame.rounds.length}
                        </span>
                        <button
                          onClick={() =>
                            openAiraWithMission({
                              worldId: mission.worldId,
                              worldName: mission.worldName,
                              missionId: mission.id,
                              missionTitle: mission.title,
                              instructions: round.hint,
                            })
                          }
                          className="text-xs font-700 text-violet-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Bot size={13} /> Ask Tara for Clue
                        </button>
                      </div>

                      <h2 className="text-lg sm:text-xl font-900 text-slate-800 mb-6">
                        Discover the repeating loop and find the missing piece:
                      </h2>

                      {/* Visual sequence rack */}
                      <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-8 border border-slate-200 overflow-x-auto">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-max justify-center py-2">
                          {round.sequence.map((item, idx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.08 }}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs"
                            >
                              <ShapeIcon shape={item.shape} color={item.color} size={44} />
                              <span className="text-[10px] text-slate-400 font-600">{item.label}</span>
                            </motion.div>
                          ))}

                          <div className="flex items-center text-slate-400 font-900 px-1">➔</div>

                          {/* Mystery box */}
                          <div className="w-16 h-18 sm:w-20 sm:h-22 rounded-2xl border-2 border-dashed border-violet-400 bg-violet-50/60 flex flex-col items-center justify-center p-2">
                            {patternSubmitted && selectedPatternOpt ? (
                              <div className="flex flex-col items-center">
                                {(() => {
                                  const opt = round.options.find((o) => o.id === selectedPatternOpt);
                                  return opt ? (
                                    <>
                                      <ShapeIcon shape={opt.shape} color={opt.color} size={36} />
                                      <span className="text-[9px] font-bold text-violet-700 mt-1">
                                        {isCorrect ? "Correct!" : "Try Again"}
                                      </span>
                                    </>
                                  ) : null;
                                })()}
                              </div>
                            ) : (
                              <span className="text-3xl font-black text-violet-500">?</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Options */}
                      <h4 className="text-xs font-800 text-slate-400 uppercase tracking-wider mb-3">
                        Choose the matching shape:
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                        {round.options.map((opt) => {
                          const isSelected = selectedPatternOpt === opt.id;
                          return (
                            <motion.button
                              key={opt.id}
                              disabled={patternSubmitted && isCorrect}
                              onClick={() => {
                                setSelectedPatternOpt(opt.id);
                                setPatternSubmitted(false);
                              }}
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? patternSubmitted
                                    ? isCorrect
                                      ? "border-green-500 bg-green-50"
                                      : "border-red-400 bg-red-50"
                                    : "border-violet-600 bg-violet-50 shadow-sm"
                                  : "border-slate-200 bg-white hover:border-violet-300"
                              }`}
                            >
                              <ShapeIcon shape={opt.shape} color={opt.color} size={42} />
                              <span className="text-xs font-700 text-slate-700">{opt.label}</span>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Explanation / hint display */}
                      <AnimatePresence>
                        {patternSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm leading-relaxed ${
                              isCorrect ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            <div className="font-800 mb-1">{isCorrect ? "🎉 Excellent pattern deduction!" : "❌ Not quite the right shape!"}</div>
                            {round.ruleExplanation}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowPatternHint(!showPatternHint)}
                          className="px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-700 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lightbulb size={14} /> {showPatternHint ? round.hint : "Show Hint"}
                        </button>
                        <button
                          onClick={handlePatternSubmit}
                          disabled={!selectedPatternOpt || (patternSubmitted && isCorrect)}
                          className="btn-primary flex-1 py-3 rounded-xl text-xs sm:text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
                        >
                          Submit Answer
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TYPE 3: EXPERIMENT / DATA LAB */}
            {mission.type === "experiment" && mission.experimentLab && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-900 text-slate-800">{mission.experimentLab.targetLabel}</h2>
                  <span className="text-xs font-800 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                    Interactive AI Lab
                  </span>
                </div>

                {/* Lab Steps Stepper */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className={`p-3 rounded-xl text-center text-xs font-700 ${experimentPhase === "collect" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    1. Data Preparation
                  </div>
                  <div className={`p-3 rounded-xl text-center text-xs font-700 ${experimentPhase === "train" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    2. Train Neural Weights
                  </div>
                  <div className={`p-3 rounded-xl text-center text-xs font-700 ${experimentPhase === "test" ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    3. Inference Test
                  </div>
                </div>

                {experimentPhase === "collect" && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Verify each training sample has an accurate label before feeding it into the model:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {mission.experimentLab.sampleData.map((item) => (
                        <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <p className="text-xs font-800 text-slate-800">{item.title}</p>
                              <p className="text-[11px] text-slate-400">Features: {JSON.stringify(item.features).replace(/["{}]/g, "")}</p>
                            </div>
                          </div>
                          <span className="text-xs font-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-violet-700">
                            {item.correctClass}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setExperimentPhase("train");
                        runTrainingSimulation();
                      }}
                      className="w-full btn-primary py-3.5 rounded-2xl text-sm font-800 mt-4 cursor-pointer shadow-md"
                    >
                      All Data Labeled — Start Model Training 🚀
                    </button>
                  </div>
                )}

                {experimentPhase === "train" && (
                  <div className="space-y-6 text-center py-8">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-5xl mx-auto w-fit">
                      ⚙️
                    </motion.div>
                    <h3 className="font-900 text-lg text-slate-800">
                      {isTraining ? "Optimizing Model Weights..." : "Training Complete (Loss: 0.04)"}
                    </h3>

                    <div className="max-w-md mx-auto h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-violet-600 rounded-full" style={{ width: `${trainingProgress}%` }} />
                    </div>
                    <p className="text-xs font-700 text-slate-400">{trainingProgress}% Progress</p>
                  </div>
                )}

                {experimentPhase === "test" && (
                  <div className="space-y-6">
                    <p className="text-sm text-slate-600">
                      Run inference on unseen test samples to measure validation accuracy:
                    </p>
                    <div className="space-y-3">
                      {mission.experimentLab.testCases.map((tc) => (
                        <div key={tc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{tc.icon}</span>
                            <div>
                              <p className="text-xs font-800 text-slate-800">{tc.title}</p>
                              <p className="text-[11px] text-slate-400">Features: {JSON.stringify(tc.features).replace(/["{}]/g, "")}</p>
                            </div>
                          </div>
                          <span className="text-xs font-800 text-green-700 bg-green-50 px-3 py-1 rounded-full">
                            Expected: {tc.expectedClass}
                          </span>
                        </div>
                      ))}
                    </div>

                    {testResult && (
                      <div className="p-4 rounded-2xl bg-green-50 text-green-800 text-xs font-700 border border-green-200">
                        {testResult}
                      </div>
                    )}

                    <button
                      onClick={handleTestInference}
                      className="w-full btn-primary py-3.5 rounded-2xl text-sm font-800 cursor-pointer shadow-md"
                    >
                      Run Model Inference & Finish Experiment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TYPE 4: QUIZ */}
            {mission.type === "quiz" && mission.quizContent && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                {(() => {
                  const currentQ = mission.quizContent.questions[quizIndex];
                  const isCorrect = selectedQuizOpt === currentQ.correctIndex;

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-800 text-violet-700 bg-violet-50 px-3 py-1 rounded-full">
                          Question {quizIndex + 1} of {mission.quizContent.questions.length}
                        </span>
                        <span className="text-xs font-700 text-slate-400">
                          Score: {quizScore}/{quizIndex + (quizSubmitted && isCorrect ? 1 : 0)}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-900 text-slate-800">
                        {currentQ.question}
                      </h2>

                      <div className="space-y-3">
                        {currentQ.options.map((opt, idx) => {
                          const isSelected = selectedQuizOpt === idx;
                          return (
                            <button
                              key={idx}
                              disabled={quizSubmitted}
                              onClick={() => setSelectedQuizOpt(idx)}
                              className={`w-full text-left p-4 rounded-2xl border-2 flex items-start gap-3 transition-all cursor-pointer ${
                                isSelected
                                  ? quizSubmitted
                                    ? idx === currentQ.correctIndex
                                      ? "border-green-500 bg-green-50"
                                      : "border-red-400 bg-red-50"
                                    : "border-violet-600 bg-violet-50"
                                  : "border-slate-200 bg-white hover:border-violet-300"
                              }`}
                            >
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-xs sm:text-sm font-600 text-slate-700">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isCorrect ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          <div className="font-800 mb-1">{isCorrect ? "✅ Correct!" : "❌ Incorrect"}</div>
                          {currentQ.explanation}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        {!quizSubmitted ? (
                          <button
                            onClick={handleQuizSubmit}
                            disabled={selectedQuizOpt === null}
                            className="btn-primary px-8 py-3 rounded-xl text-xs sm:text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuizQuestion}
                            className="btn-primary px-8 py-3 rounded-xl text-xs sm:text-sm font-800 flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            {quizIndex < mission.quizContent.questions.length - 1 ? (
                              <>
                                Next Question <ChevronRight size={14} />
                              </>
                            ) : (
                              "Complete Quiz & View Score"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TYPE 5: CHALLENGE STUDIO */}
            {mission.type === "challenge" && mission.challengeStudio && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-700">
                  <Trophy size={13} className="text-amber-600" /> Real-World Challenge Studio
                </div>

                <div>
                  <h2 className="text-2xl font-900 text-slate-800 mb-2">
                    {mission.challengeStudio.scenario}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {mission.challengeStudio.problemStatement}
                  </p>
                </div>

                <div className="space-y-6">
                  {mission.challengeStudio.stages.map((stage) => (
                    <div key={stage.stageNumber} className="space-y-3">
                      <h4 className="font-800 text-slate-700 text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center">
                          {stage.stageNumber}
                        </span>
                        {stage.title}
                      </h4>
                      <p className="text-xs text-slate-500">{stage.description}</p>

                      <div className="grid sm:grid-cols-2 gap-3">
                        {stage.options.map((opt) => {
                          const isChosen = selectedChallengeOptions[stage.stageNumber] === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setSelectedChallengeOptions((prev) => ({ ...prev, [stage.stageNumber]: opt.id }))}
                              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                                isChosen ? "border-violet-600 bg-violet-50/60 shadow-xs" : "border-slate-200 bg-white hover:border-violet-300"
                              }`}
                            >
                              <div className="text-3xl mb-2">{opt.icon}</div>
                              <h5 className="font-800 text-xs sm:text-sm text-slate-800 mb-1">{opt.title}</h5>
                              <p className="text-xs text-slate-500 mb-2">{opt.desc}</p>
                              <p className="text-[11px] text-green-700 font-600">✓ {opt.pros}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4">
                    <button
                      onClick={() => triggerCompletion(100)}
                      disabled={Object.keys(selectedChallengeOptions).length < mission.challengeStudio.stages.length}
                      className="w-full btn-primary py-4 rounded-2xl text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
                    >
                      Deploy Solution & Evaluate Impact
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TYPE 5b: MULTI-STEP DECISION CHALLENGE */}
            {mission.type === "challenge" && mission.challengeSteps && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-700">
                    <Trophy size={13} className="text-amber-600" /> Interactive Case Challenge
                  </div>
                  <span className="text-xs font-800 text-violet-700 bg-violet-50 px-3 py-1 rounded-full">
                    Decision {challengeStep + 1} of {mission.challengeSteps.length}
                  </span>
                </div>

                {(() => {
                  const step = mission.challengeSteps[challengeStep];
                  const isCorrect = selectedChallengeStepOpt === step.correctOption;

                  return (
                    <div className="space-y-6">
                      <h2 className="text-base sm:text-lg font-900 text-slate-800 leading-snug">
                        {step.scenario}
                      </h2>

                      <div className="space-y-3">
                        {step.options.map((opt, idx) => {
                          const isSelected = selectedChallengeStepOpt === idx;
                          return (
                            <button
                              key={idx}
                              disabled={challengeStepSubmitted}
                              onClick={() => setSelectedChallengeStepOpt(idx)}
                              className={`w-full text-left p-4 rounded-2xl border-2 flex items-start gap-3 transition-all cursor-pointer ${
                                isSelected
                                  ? challengeStepSubmitted
                                    ? idx === step.correctOption
                                      ? "border-green-500 bg-green-50 text-green-900"
                                      : "border-red-400 bg-red-50 text-red-900"
                                    : "border-violet-600 bg-violet-50"
                                  : "border-slate-200 bg-white hover:border-violet-300"
                              }`}
                            >
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-xs sm:text-sm font-600 text-slate-800">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {challengeStepSubmitted && (
                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isCorrect ? "bg-green-50 text-green-800 border border-green-200" : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <div className="font-800 mb-1">{isCorrect ? "✅ Impact Assessment" : "💡 Educational Insight"}</div>
                          {step.impact}
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        {!challengeStepSubmitted ? (
                          <button
                            onClick={() => setChallengeStepSubmitted(true)}
                            disabled={selectedChallengeStepOpt === null}
                            className="btn-primary px-8 py-3 rounded-xl text-xs sm:text-sm font-800 disabled:opacity-40 cursor-pointer shadow-md"
                          >
                            Evaluate Decision
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (challengeStep < mission.challengeSteps!.length - 1) {
                                setChallengeStep((s) => s + 1);
                                setSelectedChallengeStepOpt(null);
                                setChallengeStepSubmitted(false);
                              } else {
                                triggerCompletion(100);
                              }
                            }}
                            className="btn-primary px-8 py-3 rounded-xl text-xs sm:text-sm font-800 flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            {challengeStep < mission.challengeSteps!.length - 1 ? (
                              <>
                                Next Challenge Stage <ChevronRight size={14} />
                              </>
                            ) : (
                              "Complete Mission & Claim Rewards"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── COMPLETION REWARD MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {missionComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-violet-100"
            >
              <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center bg-amber-100 text-amber-600 shadow-inner animate-bounce">
                <Trophy size={42} />
              </div>
              <h2 className="text-2xl font-900 text-slate-800 mb-1">Mission Completed!</h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                You successfully mastered <strong>{mission.title}</strong>!
              </p>

              {/* Stars Earned */}
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 300 }}
                  >
                    <Star
                      size={32}
                      className={i < earnedStars ? "text-yellow-400 fill-yellow-400 drop-shadow-sm" : "text-slate-200"}
                    />
                  </motion.div>
                ))}
              </div>

              {/* XP Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-5 py-2 rounded-2xl border border-amber-200 font-900 text-lg mb-8 shadow-xs">
                <Zap size={20} className="text-amber-500 fill-amber-500" />
                <span>+{earnedXp} XP Earned</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {nextMissionId && (
                  <Link href={`/dashboard/mission/${nextMissionId}`} className="block">
                    <button className="w-full btn-primary py-3.5 rounded-2xl text-sm font-800 shadow-md flex items-center justify-center gap-1.5 cursor-pointer">
                      Next Mission <ChevronRight size={16} />
                    </button>
                  </Link>
                )}

                <Link href={`/dashboard/worlds/${mission.worldId}`} className="block">
                  <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-700 transition-colors cursor-pointer">
                    Back to {mission.worldName}
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class Selection Modal */}
      {showClassModal && (
        <ClassSelectionModal
          currentClass={studentClass}
          onClose={() => setShowClassModal(false)}
          onClassSelected={(newClass) => {
            setShowClassModal(false);
            setStudent((prev) => ({
              ...prev,
              classNumber: newClass,
              class: formatClassName(newClass),
            }));
          }}
        />
      )}
    </div>
  );
}

export default function MissionPage({ params }: { params: Promise<{ missionId: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#EAF5FF]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-3 animate-bounce shadow-sm">
              <Sparkles size={28} />
            </div>
            <p className="text-sm font-bold text-slate-600">Loading Mission Experience...</p>
          </div>
        </div>
      }
    >
      <MissionRunner params={params} />
    </Suspense>
  );
}
