import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GameTimer({ seconds, onTimeout, paused = false }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (paused) return;
    if (timeLeft <= 0) {
      onTimeout?.();
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, paused]);

  const pct = (timeLeft / seconds) * 100;
  const radius = 45;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;
  const color = timeLeft <= 5 ? "#ef4444" : timeLeft <= 10 ? "#ffa500" : "#ff2d75";

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <motion.circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ ease: "linear" }}
        />
      </svg>
      <div className="text-center">
        <span className="text-3xl font-black" style={{ color }}>{timeLeft}</span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">sec</p>
      </div>
    </div>
  );
}
