import { Bot } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#EAF5FF]">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 shadow-inner animate-bounce">
          <Bot size={28} />
        </div>
        <p className="text-sm font-800 text-slate-700">Loading Student Dashboard...</p>
        <div className="flex gap-1.5 mt-1">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse delay-75" />
          <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
}
