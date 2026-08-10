import React from "react";
import { motion } from "framer-motion";

export default function Logo({ size = "md" }) {
  const sizes = {
    sm: { text: "text-2xl", icon: "text-3xl", bars: "h-6" },
    md: { text: "text-4xl", icon: "text-5xl", bars: "h-8" },
    lg: { text: "text-6xl", icon: "text-7xl", bars: "h-12" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-end gap-0.5">
        {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
          <motion.div
            key={i}
            className={`w-1.5 ${s.bars} rounded-full gradient-pink`}
            animate={{ height: `${h * 100}%` }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
            style={{ height: "100%" }}
          />
        ))}
      </div>
      <div className="flex flex-col">
        <span className={`font-black ${s.text} text-white tracking-tight leading-none`}>
          Beat<span className="text-gradient-pink">Quiz</span>
        </span>
        <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
          Mania
        </span>
      </div>
    </div>
  );
}
