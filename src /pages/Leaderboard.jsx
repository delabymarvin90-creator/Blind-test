import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Trophy, Medal } from "lucide-react";
import { base44 } from "@/api/base44Client";

const modeLabels = {
  solo: { label: "Solo", color: "text-cyan-400 bg-cyan-400/10" },
  friends: { label: "Entre Amis", color: "text-pink-400 bg-pink-400/10" },
  tournament: { label: "Tournoi", color: "text-yellow-400 bg-yellow-400/10" },
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const data = await base44.entities.Leaderboard.list("-score", 50);
      setScores(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "all" ? scores : scores.filter((s) => s.mode === filter);
  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <div className="min-h-screen bg-background bg-radial-glow">
      <div className="bg-grid min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-5">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold text-white transition-colors hover:border-primary/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            <span className="font-black text-white">Classement</span>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 pb-12">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-black text-white md:text-4xl">
              Hall of <span className="text-gradient-yellow">Fame</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Les meilleures partitions du BeatQuiz</p>
          </div>

          {/* Filter */}
          <div className="mb-6 flex justify-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                filter === "all" ? "gradient-pink text-white" : "border-2 border-border bg-card text-muted-foreground hover:text-white"
              }`}
            >
              Tous
            </button>
            {Object.entries(modeLabels).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  filter === key ? "gradient-pink text-white" : "border-2 border-border bg-card text-muted-foreground hover:text-white"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-card" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Trophy className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun score enregistré pour ce mode</p>
            </div>
          ) : (
            <>
              {/* Top 3 */}
              {top3.length > 0 && (
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {top3.map((score, i) => {
                    const heights = ["mt-0", "mt-6", "mt-10"];
                    const icons = [Crown, Medal, Trophy];
                    const colors = ["gradient-yellow", "gradient-purple", "gradient-orange"];
                    const Icon = icons[i];
                    return (
                      <motion.div
                        key={score.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className={`flex flex-col items-center ${heights[i]}`}
                      >
                        <div className="mb-1 text-2xl">{score.avatar || "🎵"}</div>
                        <div className={`mb-2 flex h-20 w-full items-center justify-center ${colors[i]} rounded-xl comic-border`}>
                          <Icon className="h-8 w-8 text-black" />
                        </div>
                        <p className="max-w-full truncate text-xs font-bold text-white">{score.player_name}</p>
                        <p className="text-sm font-black text-primary">{score.score} pts</p>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Rest of leaderboard */}
              <div className="space-y-2">
                {rest.map((score, i) => (
                  <motion.div
                    key={score.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 rounded-lg bg-card px-4 py-3"
                  >
                    <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 4}</span>
                    <span className="text-lg">{score.avatar || "🎵"}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">{score.player_name}</p>
                      <p className="text-xs text-muted-foreground">{score.theme_name}</p>
                    </div>
                    {score.mode && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${modeLabels[score.mode]?.color || ""}`}>
                        {modeLabels[score.mode]?.label || score.mode}
                      </span>
                    )}
                    <span className="font-black text-primary">{score.score}</span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
