import Link from "next/link";
import { Compass, Home, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#EAF5FF]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-violet-100 text-center">
        <div className="w-20 h-20 rounded-3xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Compass size={40} className="animate-spin-slow" />
        </div>

        <span className="text-xs font-900 text-violet-600 uppercase tracking-widest bg-violet-50 px-3 py-1 rounded-full">
          Error 404 • Lost in Space
        </span>

        <h1 className="text-2xl sm:text-3xl font-900 text-slate-800 mt-4 mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The learning path or world you are looking for doesn&apos;t seem to exist or has moved to another sector of our educational universe.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full btn-primary py-3.5 rounded-2xl text-sm font-800 shadow-md flex items-center justify-center gap-2"
          >
            <Home size={16} /> Return to Dashboard
          </Link>

          <Link
            href="/learn"
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-3.5 rounded-2xl text-sm font-700 border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen size={16} /> Explore Learning Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
