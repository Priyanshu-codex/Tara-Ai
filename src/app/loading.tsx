import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#EAF5FF]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl animate-pulse"
            style={{ background: "linear-gradient(135deg, #6941F5, #4C2AD9)" }}
          >
            <Sparkles size={28} className="animate-spin-slow" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
        </div>
        <div>
          <h3 className="text-base font-900 text-slate-800">Loading TARA AI...</h3>
          <p className="text-xs text-slate-400 mt-0.5">Preparing learning worlds and adaptive missions</p>
        </div>
      </div>
    </div>
  );
}
