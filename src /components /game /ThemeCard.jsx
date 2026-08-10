import React from "react";
import { motion } from "framer-motion";

const colorMap = {
  pink: { bg: "gradient-pink", text: "text-gradient-pink", solid: "bg-[#ff2d75]" },
  cyan: { bg: "gradient-cyan", text: "text-gradient-cyan", solid: "bg-[#00f5ff]" },
  purple: { bg: "gradient-purple", text: "text-gradient-purple", solid: "bg-[#a855f7]" },
  yellow: { bg: "gradient-yellow", text: "text-gradient-yellow", solid: "bg-[#ffd700]" },
  green: { bg: "gradient-green", text: "text-[#39ff14]", solid: "bg-[#39ff14]" },
  orange: { bg: "gradient-orange", text: "text-[#ff8c00]", solid: "bg-[#ff8c00]" },
  blue: { bg: "gradient-blue", text: "text-[#3b82f6]", solid: "bg-[#3b82f6]" },
  red: { bg: "gradient-red", text: "text-[#ef4444]", solid: "bg-[#ef4444]" },
};

const difficultyLabels = {
  easy: { label: "Facile", color: "text-green-400 bg-green-400/10" },
  medium: { label: "Moyen", color: "text-yellow-400 bg-yellow-400/10" },
  hard: { label: "Difficile", color: "text-red-400 bg-red-400/10" },
};

export default function ThemeCard({ theme, onClick, index = 0 }) {
  const c = colorMap[theme.color] || colorMap.purple;
  const diff = difficultyLabels[theme.difficulty] || difficultyLabels.medium;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl comic-border bg-card p-5 text-left transition-all hover:shadow-xl"
    >
      <div className={`absolute inset-0 ${c.bg} opacity-10 transition-opacity group-hover:opacity-20`} />
      <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${c.bg} opacity-20 blur-2xl`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${c.bg} text-3xl shadow-lg`}>
            {theme.icon}
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${diff.color}`}>
            {diff.label}
          </span>
        </div>
        <h3 className="text-lg font-black text-white leading-tight">{theme.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className={`inline-block h-2 w-2 rounded-full ${c.solid}`} />
          {theme.question_count || 0} questions
        </div>
      </div>
    </motion.button>
  );
}
