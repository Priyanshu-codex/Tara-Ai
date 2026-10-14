"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Platform error encountered:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#EAF5FF]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-red-100 text-center">
        <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <AlertCircle size={40} />
        </div>

        <span className="text-xs font-900 text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
          Platform Alert
        </span>

        <h1 className="text-2xl sm:text-3xl font-900 text-slate-800 mt-4 mb-2">
          Something went wrong
        </h1>

        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          We encountered an unexpected display glitch. Don&apos;t worry, your progress and completed missions are safely saved.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full btn-primary py-3.5 rounded-2xl text-sm font-800 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} /> Try Again
          </button>

          <Link
            href="/dashboard"
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3.5 rounded-2xl text-sm font-700 border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
