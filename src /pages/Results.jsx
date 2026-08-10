import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RotateCcw, Crown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Podium from "@/components/game/Podium";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, players, mode } = location.state || {};

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!players) return;
    saveScores();
  }, []);

  const saveScores = async () => {
    try {
      const records = players.map((p) => ({
        player_name: p.name,
        score: p.score || 0,
        theme_name: theme?.name || "",
        mode: mode || "solo",
        avatar: p.avatar || "🎵",
      }));
      await base44.entities.Leaderboard.bulkCreate(records);
      setSaved(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (!players) {
    navigate("/");
    return null;
  }

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <div className="min-h-screen bg-background bg-radial-glow">
      <div className="bg-grid min-h-screen">
        {/* Confetti emojis */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl md:text-2xl"
              style={{ left: `${(i * 5 + 2) % 100}%` }}
              initial={{ y: -50, opacity: 1 }}
              animate={{ y: "110vh", rotate: 360 }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: (i % 5) * 0.6,
              }}
            >
              {["🎵", "🎤", "🎸", "⭐", "🔥", "🎶"][i % 6]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-5 pt-12 pb-12 text-center">
          {/* Winner banner */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mb-6"
          >
            <div className="mb-3 text-6xl animate-float">{winner?.avatar || "🏆"}</div>
            <h1 className="text-4xl font-black text-white md:text-5xl">
              {winner?.name} <span className="text-gradient-yellow">gagne !</span>
            </h1>
            <p className="mt-2 text-lg font-bold text-muted-foreground">
              {winner?.score} points • {theme?.name}
            </p>
          </motion.div>

          {/* Podium */}
          {players.length > 1 && (
            <div className="mb-8">
              <Podium players={players} />
            </div>
          )}

          {/* Detailed scores */}
          <div className="mx-auto mb-8 max-w-md rounded-2xl comic-border bg-card p-5">
            <h3 className="mb-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
              <Crown className="h-4 w-4 text-yellow-400" />
              Classement détaillé
            </h3>
            <div className="space-y-2">
              {sorted.map((player, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 ${
                    i === 0 ? "bg-yellow-400/10" : "bg-muted/50"
                  }`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                    i === 0 ? "bg-yellow-400 text-black" : i === 1 ? "bg-gray-300 text-black" : i === 2 ? "bg-orange-400 text-black" : "bg-muted text-white"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-lg">{player.avatar}</span>
                  <span className="flex-1 text-left font-bold text-white">{player.name}</span>
                  <span className="font-black text-primary">{player.score} pts</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/themes", { state: { mode } })}
              className="flex items-center justify-center gap-2 rounded-xl gradient-pink px-6 py-3 text-sm font-black text-white comic-border transition-transform hover:scale-105"
            >
              <RotateCcw className="h-4 w-4" />
              Rejouer
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-6 py-3 text-sm font-black text-white transition-colors hover:border-primary/50"
            >
              <Home className="h-4 w-4" />
              Accueil
            </button>
            <button
              onClick={() => navigate("/leaderboard")}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-6 py-3 text-sm font-black text-white transition-colors hover:border-primary/50"
            >
              <Crown className="h-4 w-4 text-yellow-400" />
              Classement
            </button>
          </div>

          {saved && (
            <p className="mt-4 text-xs text-green-400">✓ Scores enregistrés au classement</p>
          )}
        </div>
      </div>
    </div>
  );
}
