"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  X,
  RotateCcw,
  Send,
  HelpCircle,
  Lightbulb,
  Compass,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Zap,
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useAira } from "./AiraContext";
import type { AiraMessage, AiraQuizQuestion } from "@/lib/aira/types";

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Headers
        if (line.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-800 text-slate-800 text-sm mt-2">
              {line.replace("### ", "")}
            </h4>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-800 text-slate-900 text-base mt-2">
              {line.replace("## ", "")}
            </h3>
          );
        }

        // Bullet lists
        if (line.startsWith("- ") || line.startsWith("* ")) {
          const content = line.slice(2);
          const formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
          return (
            <div key={idx} className="flex items-start gap-2 ml-1">
              <span className="text-violet-500 font-bold">•</span>
              <span
                dangerouslySetInnerHTML={{ __html: formatted }}
                className="text-slate-700"
              />
            </div>
          );
        }

        // Bold formatting
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return (
          <p
            key={idx}
            dangerouslySetInnerHTML={{ __html: formatted }}
            className="text-slate-700"
          />
        );
      })}
    </div>
  );
}

function QuizCard({
  quiz,
  onSelectOption,
  disabled,
}: {
  quiz: AiraQuizQuestion;
  onSelectOption: (index: number) => void;
  disabled?: boolean;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (disabled || selectedIdx !== null) return;
    setSelectedIdx(idx);
    onSelectOption(idx);
  };

  return (
    <div className="mt-3 bg-violet-50/80 border border-violet-200/80 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-800 text-violet-700 uppercase tracking-wider bg-violet-100/90 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Zap size={11} /> {quiz.topic || "AI Quiz"}
        </span>
        <span className="text-[11px] text-slate-400 font-600">Pick 1 option</span>
      </div>

      <p className="font-700 text-slate-800 text-sm mb-3">{quiz.question}</p>

      <div className="space-y-2">
        {quiz.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isChosen = selectedIdx === idx;

          return (
            <motion.button
              key={idx}
              disabled={disabled || selectedIdx !== null}
              onClick={() => handleSelect(idx)}
              whileHover={disabled || selectedIdx !== null ? {} : { scale: 1.01 }}
              whileTap={disabled || selectedIdx !== null ? {} : { scale: 0.99 }}
              className={`w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-600 transition-all ${
                isChosen
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-violet-300 hover:bg-violet-50/50"
              } ${disabled || selectedIdx !== null ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  isChosen ? "bg-white text-violet-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {letter}
              </span>
              <span className="leading-snug flex-1">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default function AiraChatPanel() {
  const {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    sendMessage,
    submitQuizOption,
    startNewChat,
    missionContext,
    setMissionContext,
    retryLastMessage,
  } = useAira();

  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={`fixed z-50 bottom-4 right-4 sm:right-6 flex flex-col bg-white rounded-3xl shadow-2xl border border-violet-100 overflow-hidden transition-all duration-300 ${
          isExpanded
            ? "w-[94vw] sm:w-[580px] h-[90vh] max-h-[820px]"
            : "w-[94vw] sm:w-[410px] h-[82vh] max-h-[640px]"
        }`}
        style={{
          boxShadow:
            "0 20px 50px -10px rgba(105, 65, 245, 0.25), 0 0 0 1px rgba(105, 65, 245, 0.08)",
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-3.5 sm:p-4 flex items-center justify-between flex-shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
                <Bot size={22} className="text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-violet-700 rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-800 text-sm sm:text-base leading-tight">Tara</h3>
                <span className="text-[11px] bg-white/25 px-2 py-0.5 rounded-full font-700">
                  AI Buddy
                </span>
              </div>
              <p className="text-[11px] text-violet-100 flex items-center gap-1">
                <Sparkles size={10} /> Online & Ready to Help
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex p-1.5 hover:bg-white/15 rounded-xl transition-colors text-white/90 hover:text-white"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <button
              onClick={startNewChat}
              className="p-1.5 hover:bg-white/15 rounded-xl transition-colors text-white/90 hover:text-white"
              title="Start New Chat"
            >
              <RotateCcw size={16} />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/15 rounded-xl transition-colors text-white/90 hover:text-white ml-0.5"
              title="Close Tara"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mission Context Ribbon (if active) */}
        {missionContext && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-2 flex items-center justify-between text-xs text-amber-900 flex-shrink-0">
            <div className="flex items-center gap-2 truncate">
              <Compass size={14} className="text-amber-600 flex-shrink-0" />
              <span className="truncate">
                Active Mission: <strong>{missionContext.missionTitle || missionContext.missionId}</strong>
              </span>
            </div>
            <button
              onClick={() => setMissionContext(null)}
              className="text-amber-700 hover:text-amber-950 text-[11px] font-700 underline flex-shrink-0 ml-2"
            >
              Clear
            </button>
          </div>
        )}

        {/* Quick Action Toolbar */}
        <div className="bg-slate-50/90 border-b border-slate-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0 scrollbar-none">
          <button
            onClick={() => sendMessage("Explain AI", "explain")}
            className="flex items-center gap-1 text-[11px] font-700 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all shadow-2xs whitespace-nowrap"
          >
            <Lightbulb size={12} className="text-amber-500" />
            Explain AI
          </button>

          <button
            onClick={() => sendMessage("Help Me With This Mission", "mission_hint")}
            className="flex items-center gap-1 text-[11px] font-700 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all shadow-2xs whitespace-nowrap"
          >
            <Compass size={12} className="text-violet-500" />
            Help With Mission
          </button>

          <button
            onClick={() => sendMessage("Quiz Me", "quiz")}
            className="flex items-center gap-1 text-[11px] font-700 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all shadow-2xs whitespace-nowrap"
          >
            <Zap size={12} className="text-emerald-500" />
            Quiz Me
          </button>

          <button
            onClick={() => sendMessage("AI Safety Coach", "safety")}
            className="flex items-center gap-1 text-[11px] font-700 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-all shadow-2xs whitespace-nowrap"
          >
            <ShieldCheck size={12} className="text-blue-500" />
            Safety
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";

            return (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
                className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 flex-shrink-0 mt-0.5 shadow-xs">
                    <Bot size={17} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs ${
                    isUser
                      ? "bg-violet-600 text-white rounded-br-xs font-500 text-sm"
                      : msg.isError
                        ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-xs"
                        : "bg-white text-slate-800 border border-slate-100 rounded-bl-xs shadow-xs"
                  }`}
                >
                  {isUser ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    renderMarkdown(msg.content)
                  )}

                  {/* Quiz Interactive Card */}
                  {msg.quizQuestion && (
                    <QuizCard
                      quiz={msg.quizQuestion}
                      onSelectOption={(idx) => submitQuizOption(msg.quizQuestion!.id, idx)}
                      disabled={isTyping}
                    />
                  )}

                  {/* Error Retry Option */}
                  {msg.isError && (
                    <div className="mt-2.5 pt-2 border-t border-red-100 flex items-center gap-2">
                      <button
                        onClick={retryLastMessage}
                        className="text-xs font-700 text-red-700 hover:text-red-900 flex items-center gap-1 underline"
                      >
                        <RotateCcw size={12} /> Try again
                      </button>
                    </div>
                  )}

                  {/* Quick replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && !isTyping && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.quickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => sendMessage(reply)}
                          className="text-[11px] font-600 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100 hover:border-violet-200 transition-colors flex items-center gap-1"
                        >
                          {reply} <ArrowRight size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 flex-shrink-0">
                <Bot size={17} />
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-xs px-4 py-3 shadow-2xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-violet-600 animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer / Input Area */}
        <div className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5 focus-within:border-violet-400 focus-within:bg-white transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Tara anything about AI or your mission..."
              disabled={isTyping}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none py-1"
              maxLength={1000}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-2 rounded-xl text-white transition-all ${
                input.trim() && !isTyping
                  ? "bg-violet-600 hover:bg-violet-700 shadow-sm"
                  : "bg-slate-300 cursor-not-allowed text-slate-500"
              }`}
            >
              <Send size={15} />
            </button>
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Press Enter to send</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck size={11} className="text-violet-400" /> Safe learning space
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
