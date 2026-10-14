"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Lightbulb, RotateCcw, ArrowRight, Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent } from "@/lib/mockData";

const questions = [
  {
    id: 1,
    question: "What does AI stand for?",
    options: ["Automatic Intelligence", "Artificial Intelligence", "Advanced Information", "Automated Instruction"],
    correct: 1,
    explanation: "AI stands for Artificial Intelligence — technology that enables computers to perform tasks that normally require human intelligence.",
  },
  {
    id: 2,
    question: "Which of these is an example of Machine Learning?",
    options: ["A calculator adding numbers", "A GPS using fixed rules", "Netflix recommending movies based on your history", "A thermostat at a set temperature"],
    correct: 2,
    explanation: "Netflix uses ML to learn your preferences from your viewing history and recommend similar content you might enjoy.",
  },
  {
    id: 3,
    question: "What is training data in Machine Learning?",
    options: ["Data used to test a model", "Data the model learns patterns from", "Data stored in a cloud", "Random noise in a system"],
    correct: 1,
    explanation: "Training data is the labeled dataset used to teach a machine learning model to recognize patterns and make predictions.",
  },
  {
    id: 4,
    question: "Computer Vision is used to:",
    options: ["Translate languages", "Analyze and understand images/videos", "Predict stock prices", "Write computer code"],
    correct: 1,
    explanation: "Computer Vision is the AI field that enables computers to interpret and understand visual information from images and videos.",
  },
  {
    id: 5,
    question: "Which is NOT a type of Machine Learning?",
    options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Sequential Learning"],
    correct: 3,
    explanation: "The three main types of ML are: Supervised, Unsupervised, and Reinforcement Learning. 'Sequential Learning' is not a standard ML category.",
  },
];

export default function DailyQuizPage() {
  const student = mockStudent;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

  const question = questions[currentQ];
  const isCorrect = selected === question.correct;

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (selected === question.correct) setScore(s => s + 1);
    setAnswers(prev => { const next = [...prev]; next[currentQ] = selected; return next; });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setSubmitted(false);
      setShowHint(false);
    } else {
      setDone(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setSubmitted(false);
    setShowHint(false);
    setScore(0);
    setDone(false);
    setAnswers(Array(questions.length).fill(null));
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const xpEarned = score * 10 + (pct === 100 ? 20 : 0);

    return (
      <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
        <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="text-8xl mb-5">{pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "📚"}</div>
            <h1 className="text-3xl font-900 mb-2" style={{ color: "#172554" }}>Quiz Complete!</h1>
            <p className="text-slate-500 mb-6 text-lg">
              You scored {score}/{questions.length} ({pct}%)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: "Score", value: `${score}/${questions.length}`, icon: "🎯", color: "#6941F5" },
              { label: "Accuracy", value: `${pct}%`, icon: "📊", color: "#22C55E" },
              { label: "XP Earned", value: `+${xpEarned}`, icon: "⚡", color: "#F59E0B" },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-lg font-900" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Answer review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 text-left"
          >
            <h3 className="font-800 text-slate-800 mb-3">Answer Review:</h3>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={q.id} className={`flex items-center gap-3 p-2 rounded-xl ${answers[i] === q.correct ? "bg-green-50" : "bg-red-50"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${answers[i] === q.correct ? "bg-green-500" : "bg-red-500"}`}>
                    {answers[i] === q.correct ? <Check size={12} className="text-white" /> : <X size={12} className="text-white" />}
                  </div>
                  <p className="text-xs text-slate-700 flex-1 truncate">{q.question}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex gap-3">
            <motion.button onClick={handleRetry} className="flex-1 border-2 border-slate-200 text-slate-600 py-3.5 rounded-2xl font-700 flex items-center justify-center gap-2" whileHover={{ scale: 1.03 }}>
              <RotateCcw size={16} /> Try Again
            </motion.button>
            <Link href="/dashboard" className="flex-1">
              <motion.button className="w-full btn-primary py-3.5 rounded-2xl font-700 flex items-center justify-center gap-2" whileHover={{ scale: 1.03 }}>
                Dashboard <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-5 transition-colors w-fit">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">📝</div>
              <div>
                <h1 className="font-900 text-slate-800">Daily AI Quiz</h1>
                <p className="text-xs text-slate-400">Question {currentQ + 1} of {questions.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-violet-50 px-3 py-1.5 rounded-xl">
              <Zap size={14} className="text-violet-500" />
              <span className="text-sm font-700 text-violet-700">+10 XP/question</span>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i < currentQ
                    ? (answers[i] === questions[i].correct ? "bg-green-500" : "bg-red-400")
                    : i === currentQ
                      ? "bg-violet-500"
                      : "bg-slate-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <p className="text-lg font-800 text-slate-800 leading-relaxed">{question.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt, i) => (
                <motion.button
                  key={i}
                  onClick={() => !submitted && setSelected(i)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    submitted
                      ? i === question.correct
                        ? "border-green-400 bg-green-50"
                        : i === selected
                          ? "border-red-400 bg-red-50"
                          : "border-slate-100 opacity-60"
                      : selected === i
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50"
                  }`}
                  whileHover={!submitted ? { scale: 1.01 } : {}}
                  whileTap={!submitted ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-800 flex-shrink-0 ${
                      submitted && i === question.correct
                        ? "bg-green-500 text-white"
                        : submitted && i === selected
                          ? "bg-red-500 text-white"
                          : selected === i
                            ? "bg-violet-500 text-white"
                            : "bg-slate-100 text-slate-600"
                    }`}>
                      {submitted
                        ? i === question.correct
                          ? <Check size={14} />
                          : i === selected
                            ? <X size={14} />
                            : String.fromCharCode(65 + i)
                        : String.fromCharCode(65 + i)
                      }
                    </div>
                    <span className="text-sm font-600 text-slate-700">{opt}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && !submitted && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3"
                >
                  <Lightbulb size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">Think about real-world AI applications you encounter daily — like recommendations, voice assistants, or image recognition!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explanation */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-4 ${isCorrect ? "bg-green-50 border border-green-200" : "bg-blue-50 border border-blue-200"}`}
                >
                  <p className="font-700 text-sm mb-1" style={{ color: isCorrect ? "#15803D" : "#1D4ED8" }}>
                    {isCorrect ? "✅ Correct!" : `❌ The correct answer is: ${question.options[question.correct]}`}
                  </p>
                  <p className="text-sm text-slate-600">{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex gap-3">
              {!submitted ? (
                <>
                  <motion.button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-amber-200 text-amber-700 bg-amber-50 rounded-xl text-sm font-700"
                    whileHover={{ scale: 1.04 }}
                  >
                    <Lightbulb size={16} /> Hint
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className={`flex-1 py-3 rounded-xl text-sm font-800 ${selected === null ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "btn-primary"}`}
                    whileHover={selected !== null ? { scale: 1.04 } : {}}
                  >
                    Submit Answer
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={handleNext}
                  className="flex-1 btn-primary py-3 rounded-xl text-sm font-800 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.04 }}
                >
                  {currentQ < questions.length - 1 ? <>Next Question <ArrowRight size={16} /></> : <>See Results 🏆</>}
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
