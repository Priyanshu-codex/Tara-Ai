"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotThePatternRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/mission/m1-2");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF5FF]">
      <div className="text-center">
        <div className="text-5xl animate-bounce mb-3">🧩</div>
        <p className="text-sm font-bold text-slate-600">Loading Spot the Pattern...</p>
      </div>
    </div>
  );
}
