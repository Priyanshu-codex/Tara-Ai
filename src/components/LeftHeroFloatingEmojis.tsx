"use client";

import { motion, useReducedMotion } from "framer-motion";

interface EmojiItem {
  id: string;
  emoji: string;
  label: string;
  // Positioning classes for responsiveness
  positionClass: string;
  sizeClass: string;
  opacityClass: string;
  glowColor: string;
  // Animation configuration
  yOffset: number;
  xOffset: number;
  rotateDeg: number;
  duration: number;
  delay: number;
  // Whether to wrap in a subtle glass badge
  hasGlassCard?: boolean;
  // Hide on narrow mobile screens to prevent clutter
  mobileHide?: boolean;
}

const leftEmojis: EmojiItem[] = [
  {
    id: "rocket",
    emoji: "🚀",
    label: "Superpowered Learning",
    positionClass: "top-[8%] left-[2%] sm:left-[4%] lg:left-[2%]",
    sizeClass: "text-2xl sm:text-3xl lg:text-4xl",
    opacityClass: "opacity-85",
    glowColor: "rgba(105, 65, 245, 0.2)",
    yOffset: -18,
    xOffset: 8,
    rotateDeg: 12,
    duration: 4.6,
    delay: 0,
    hasGlassCard: true,
  },
  {
    id: "star",
    emoji: "⭐",
    label: "Achievement & Excellence",
    positionClass: "top-[18%] left-[18%] sm:left-[22%] lg:left-[16%]",
    sizeClass: "text-xl sm:text-2xl",
    opacityClass: "opacity-75",
    glowColor: "rgba(251, 191, 36, 0.25)",
    yOffset: -12,
    xOffset: -5,
    rotateDeg: -10,
    duration: 3.8,
    delay: 0.6,
  },
  {
    id: "lightbulb",
    emoji: "💡",
    label: "Curiosity & Ideas",
    positionClass: "top-[32%] left-[4%] sm:left-[7%] lg:left-[3%]",
    sizeClass: "text-2xl sm:text-3xl",
    opacityClass: "opacity-80",
    glowColor: "rgba(245, 158, 11, 0.2)",
    yOffset: -15,
    xOffset: 6,
    rotateDeg: 8,
    duration: 5.2,
    delay: 1.2,
    hasGlassCard: true,
  },
  {
    id: "book",
    emoji: "📚",
    label: "Knowledge & Curriculum",
    positionClass: "top-[48%] left-[16%] sm:left-[20%] lg:left-[12%]",
    sizeClass: "text-xl sm:text-2xl lg:text-3xl",
    opacityClass: "opacity-70",
    glowColor: "rgba(59, 130, 246, 0.2)",
    yOffset: -14,
    xOffset: -7,
    rotateDeg: -6,
    duration: 4.8,
    delay: 0.3,
    mobileHide: true,
  },
  {
    id: "atom",
    emoji: "⚛️",
    label: "Science & AI",
    positionClass: "top-[62%] left-[2%] sm:left-[5%] lg:left-[1%]",
    sizeClass: "text-2xl sm:text-3xl",
    opacityClass: "opacity-75",
    glowColor: "rgba(139, 92, 246, 0.2)",
    yOffset: -16,
    xOffset: 9,
    rotateDeg: 15,
    duration: 5.6,
    delay: 0.9,
    hasGlassCard: true,
  },
  {
    id: "puzzle",
    emoji: "🧩",
    label: "Problem Solving",
    positionClass: "top-[74%] left-[14%] sm:left-[18%] lg:left-[10%]",
    sizeClass: "text-xl sm:text-2xl",
    opacityClass: "opacity-65",
    glowColor: "rgba(34, 197, 94, 0.2)",
    yOffset: -11,
    xOffset: -4,
    rotateDeg: -12,
    duration: 4.2,
    delay: 1.5,
    mobileHide: true,
  },
  {
    id: "planet",
    emoji: "🪐",
    label: "Exploration Worlds",
    positionClass: "top-[86%] left-[4%] sm:left-[8%] lg:left-[4%]",
    sizeClass: "text-2xl sm:text-3xl lg:text-4xl",
    opacityClass: "opacity-85",
    glowColor: "rgba(124, 58, 237, 0.2)",
    yOffset: -17,
    xOffset: 7,
    rotateDeg: 10,
    duration: 5.0,
    delay: 0.5,
    hasGlassCard: true,
  },
  {
    id: "gradcap",
    emoji: "🎓",
    label: "Mastery",
    positionClass: "top-[94%] left-[18%] sm:left-[24%] lg:left-[15%]",
    sizeClass: "text-xl sm:text-2xl",
    opacityClass: "opacity-70",
    glowColor: "rgba(105, 65, 245, 0.15)",
    yOffset: -10,
    xOffset: -6,
    rotateDeg: -8,
    duration: 4.4,
    delay: 1.8,
    mobileHide: true,
  },
];

export default function LeftHeroFloatingEmojis() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 bottom-0 left-0 w-full sm:w-[48%] lg:w-[38%] pointer-events-none select-none z-1 overflow-hidden"
    >
      {leftEmojis.map((item) => {
        const animationProps = shouldReduceMotion
          ? {}
          : {
              animate: {
                y: [0, item.yOffset, 0],
                x: [0, item.xOffset, 0],
                rotate: [0, item.rotateDeg, 0],
              },
              transition: {
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            };

        return (
          <motion.div
            key={item.id}
            className={`absolute ${item.positionClass} ${item.mobileHide ? "hidden sm:block" : "block"} ${item.opacityClass}`}
            {...animationProps}
          >
            {item.hasGlassCard ? (
              <div
                className="rounded-2xl p-2 sm:p-2.5 backdrop-blur-xs flex items-center justify-center transition-transform"
                style={{
                  background: "rgba(255, 255, 255, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: `0 8px 24px -4px ${item.glowColor}, 0 2px 6px rgba(0, 0, 0, 0.04)`,
                }}
              >
                <span className={`${item.sizeClass} leading-none drop-shadow-sm`}>
                  {item.emoji}
                </span>
              </div>
            ) : (
              <span
                className={`${item.sizeClass} leading-none block`}
                style={{
                  filter: `drop-shadow(0 4px 10px ${item.glowColor})`,
                }}
              >
                {item.emoji}
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
