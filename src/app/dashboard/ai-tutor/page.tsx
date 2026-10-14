"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, BookOpen, Brain, Lightbulb, Image as ImageIcon, HelpCircle, ArrowLeft, Plus, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { mockStudent, tutorResponses, suggestedQuestions } from "@/lib/mockData";
import type { ChatMessage } from "@/lib/types";
import ImageComp from "next/image";

const subjects = ["Mathematics", "Science", "English", "Social Science", "Ask Anything"];

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("linear") || q.includes("equation")) return tutorResponses["linear equation"];
  if (q.includes("machine learning") || q.includes("ml")) return tutorResponses["machine learning"];
  if (q.includes("photosynthesis") || q.includes("plant")) return tutorResponses["photosynthesis"];
  return tutorResponses["default"];
}

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-700 text-slate-800 mt-2">{line.slice(2, -2)}</p>;
    }
    line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="text-slate-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />;
  });
}

export default function AITutorPage() {
  const student = mockStudent;
  const [selectedSubject, setSelectedSubject] = useState("Ask Anything");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm TARA, your AI learning assistant! 👋\n\nI can help you with **any subject** — Math, Science, English, AI concepts, and more!\n\nWhat would you like to learn today?",
      timestamp: new Date("2026-10-14T10:00:00Z"),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [newChat, setNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const userMsg: ChatMessage = { id: `u-${now.getTime()}`, role: "user", content: text, timestamp: now };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    const response = getMockResponse(text);
    const aiDate = new Date();
    const aiMsg: ChatMessage = { id: `a-${aiDate.getTime()}`, role: "assistant", content: response, timestamp: aiDate };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleNewChat = () => {
    const welcomeDate = new Date();
    setMessages([{
      id: "welcome-new",
      role: "assistant",
      content: "Starting a new conversation! 🚀 What would you like to explore?",
      timestamp: welcomeDate,
    }]);
    setInput("");
  };

  const quickActions = [
    { label: "Explain Simply", icon: "💡", prompt: "Explain this concept in simple terms: " },
    { label: "More Examples", icon: "📚", prompt: "Give me more examples for: " },
    { label: "Practice Questions", icon: "✏️", prompt: "Give me practice questions on: " },
    { label: "Show Visual", icon: "🖼️", prompt: "Show me a visual explanation of: " },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#EAF5FF" }}>
      <Navigation role="student" userName={student.name} xp={student.xp} streak={student.streak} level={student.level} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-5">
        <div className="grid lg:grid-cols-4 gap-5 h-full" style={{ minHeight: "calc(100vh - 120px)" }}>
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Robot mascot */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 text-center"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-28 h-28 mx-auto mb-3"
                >
                  <ImageComp src="/images/robot.jpg" alt="TARA AI Tutor" width={112} height={112} className="object-contain" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <h2 className="font-800 text-slate-800">AI Tutor</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your personal learning assistant</p>
              <motion.button
                onClick={handleNewChat}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 btn-primary rounded-xl text-sm font-700"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus size={16} /> New Chat
              </motion.button>
            </motion.div>

            {/* Subject selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-700 text-sm mb-3">Select Subject</h3>
              <div className="space-y-1">
                {subjects.map(s => (
                  <motion.button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                      selectedSubject === s
                        ? "bg-violet-100 text-violet-700 font-700"
                        : "text-slate-600 hover:bg-slate-50 font-600"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {selectedSubject === s ? "▸ " : ""}{s}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Suggested questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100"
            >
              <h3 className="font-800 text-slate-700 text-sm mb-3">Related Topics</h3>
              <div className="space-y-1.5">
                {["Inverse Operations", "One-Step Equations", "Two-Step Equations", "Word Problems", "Practice Quiz"].map(t => (
                  <motion.button
                    key={t}
                    onClick={() => sendMessage(t)}
                    className="w-full text-left text-xs text-slate-500 hover:text-violet-600 hover:bg-violet-50 px-3 py-2 rounded-lg transition-all"
                    whileHover={{ x: 2 }}
                  >
                    → {t}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-lg">🤖</div>
                <div>
                  <p className="font-700 text-slate-800 text-sm">AI Tutor — {selectedSubject}</p>
                  <p className="text-xs text-green-500 font-600">● Online</p>
                </div>
              </div>
              <Link href="/dashboard" className="text-xs text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-1">
                <ArrowLeft size={12} /> Dashboard
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(100vh - 380px)" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === "assistant" ? "bg-violet-100" : "bg-slate-100"
                  }`}>
                    {msg.role === "assistant" ? <Bot size={16} className="text-violet-600" /> : <User size={16} className="text-slate-600" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-tr-sm"
                      : "bg-slate-50 border border-slate-100 rounded-tl-sm"
                  }`}>
                    {msg.role === "user"
                      ? <p className="text-sm text-white">{msg.content}</p>
                      : <div className="space-y-1">{renderMarkdown(msg.content)}</div>
                    }
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                      <Bot size={16} className="text-violet-600" />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1.5">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div
                            key={delay}
                            className="w-2 h-2 rounded-full bg-violet-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {quickActions.map(action => (
                <motion.button
                  key={action.label}
                  onClick={() => {
                    const topic = messages[messages.length - 1]?.content.substring(0, 30) || "linear equations";
                    sendMessage(action.prompt + topic);
                  }}
                  className="flex items-center gap-1.5 text-xs text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-xl whitespace-nowrap font-600 hover:bg-violet-100 transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.04 }}
                >
                  {action.icon} {action.label}
                </motion.button>
              ))}
            </div>

            {/* Suggested questions (on first load) */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map(q => (
                  <motion.button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all text-left"
                    whileHover={{ scale: 1.02 }}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 border-2 border-slate-200 focus-within:border-violet-400 transition-colors">
                <input
                  type="text"
                  placeholder={`Ask anything about ${selectedSubject}...`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                  className="flex-1 outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
                />
                <motion.button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() ? "btn-primary" : "bg-slate-200 cursor-not-allowed"
                  }`}
                  whileHover={input.trim() ? { scale: 1.1 } : {}}
                  whileTap={input.trim() ? { scale: 0.9 } : {}}
                >
                  <Send size={16} className={input.trim() ? "text-white" : "text-slate-400"} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
