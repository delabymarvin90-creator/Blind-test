import React from "react";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";

const podiumColors = [
  { bg: "gradient-yellow", text: "text-yellow-300", icon: Crown, label: "1er" },
  { bg: "gradient-purple", text: "text-purple-300", icon: Medal, label: "2e" },
  { bg: "gradient-orange", text: "text-orange-300", icon: Trophy, label: "3e" },
];

const heights = ["h-44", "h-32", "h-24"];

export default function Podium({ players }) {
  const sorted = [...players].sort((a, b) => b.score - a.score).slice(0, 3);
  const display = [sorted[1], sorted[0], sorted[2]].filter(Boolean);

  return (
    <div className="flex items-end justify-center gap-3 md:gap-6">
      {display.map((player, i) => {
        const realIndex = sorted.indexOf(player);
        const p = podiumColors[realIndex] || podiumColors[2];
        const h = heights[realIndex] || heights[2];
        const Icon = p.icon;

        return (
          <motion.div
            key={player.name + i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 0.3, type: "spring", stiffness: 150 }}
            className="flex flex-col items-center"
          >
            <div className="mb-2 text-4xl">{player.avatar || "🎵"}</div>
            <div className={`mb-1 max-w-[100px] truncate text-center text-sm font-bold text-white`}>
              {player.name}
            </div>
            <div className={`mb-3 text-2xl font-black ${p.text}`}>{player.score}</div>
            <div className={`relative ${h} w-20 ${p.bg} flex items-center justify-center rounded-t-xl comic-border md:w-28`}>
              <Icon className={`h-10 w-10 text-black/80`} />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl font-black text-white text-stroke-black">
                {p.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
