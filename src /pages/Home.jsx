import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, User, Trophy, Zap, ArrowRight, Crown, Heart, Flame, Gamepad2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/game/Logo";

const modes = [
  {
    id: "solo",
    title: "Solo",
    description: "Teste ta connaissance musicale seul et bats ton record",
    icon: User,
    color: "gradient-cyan",
    glow: "rgba(0,245,255,0.3)",
  },
  {
    id: "friends",
    title: "Entre Amis",
    description: "Affronte tes potes en pass-and-play, jusqu'à 6 joueurs",
    icon: Users,
    color: "gradient-pink",
    glow: "rgba(255,45,117,0.3)",
  },
  {
    id: "tournament",
    title: "Tournoi",
    description: "Affrontement par équipes pour la couronne ultime",
    icon: Trophy,
    color: "gradient-yellow",
    glow: "rgba(255,215,0,0.3)",
  },
];

const challenges = [
  {
    id: "blitz",
    title: "Blitz",
    description: "10 questions, 10 secondes chacune. Sois rapide !",
    icon: Zap,
    color: "gradient-green",
    glow: "rgba(57,255,20,0.3)",
  },
  {
    id: "survival",
    title: "Survie",
    description: "3 vies, pas le droit à l'erreur. Jusqu'où iras-tu ?",
    icon: Heart,
    color: "gradient-red",
    glow: "rgba(239,68,68,0.3)",
  },
  {
    id: "marathon",
    title: "Marathon",
    description: "20 questions de tous les thèmes mélangés. Le test ultime !",
    icon: Flame,
    color: "gradient-orange",
    glow: "rgba(255,140,0,0.3)",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [topScores, setTopScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const scores = await base44.entities.Leaderboard.list("-score", 5);
      setTopScores(scores);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleModeClick = (modeId) => {
    if (modeId === "marathon") {
      navigate("/play", {
        state: {
          theme: { name: "Marathon", icon: "🏆", id: "all" },
          mode: "marathon",
          players: [{ name: "Toi", avatar: "🎵", score: 0 }],
          config: { numQuestions: 20, timePerQuestion: 30 },
        },
      });
    } else {
      navigate("/themes", { state: { mode: modeId } });
    }
  };

  return (
    <div className="min-h-screen bg-background bg-radial-glow">
      <div className="bg-grid min-h-screen">
        {/* Floating decorations */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          {["🎵", "🎤", "🎸", "🎹", "🥁", "🎷", "🎧", "🎶"].map((note, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-5"
              style={{ left: `${(i * 13 + 5) % 95}%`, top: `${(i * 19 + 10) % 90}%` }}
              animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            >
              {note}
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between p-4 md:p-5">
          <Logo size="md" />
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-3 py-2 text-xs font-bold text-white transition-colors hover:border-primary/50 md:px-4 md:text-sm"
          >
            <Crown className="h-4 w-4 text-yellow-400" />
            <span className="hidden sm:inline">Classement</span>
          </Link>
        </header>

        {/* Hero */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-4 pb-8 text-center md:px-5 md:pt-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary md:text-xs">
              <Zap className="h-3.5 w-3.5" />
              Le blind test musical ultime
            </div>
            <h1 className="text-4xl font-black leading-tight text-white md:text-7xl">
              Devine la <span className="text-gradient-pink text-stroke-black">musique</span>,
              <br />
              deviens la <span className="text-gradient-cyan text-stroke-black">légende</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-lg">
              Des centaines de questions sur tes films, séries, décennies et artistes préférés.
              Solo, entre potes ou en tournoi — à toi de jouer ! 🎮
            </p>
          </motion.div>
        </div>

        {/* Modes de jeu */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 md:px-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Gamepad2 className="h-4 w-4" />
            Modes de jeu
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
            {modes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleModeClick(mode.id)}
                  className="group relative overflow-hidden rounded-2xl comic-border bg-card p-5 text-left md:p-6"
                >
                  <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${mode.color} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`} />
                  <div className={`relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${mode.color} md:h-16 md:w-16`}>
                    <Icon className="h-7 w-7 text-black md:h-8 md:w-8" />
                  </div>
                  <h3 className="relative z-10 text-xl font-black text-white md:text-2xl">{mode.title}</h3>
                  <p className="relative z-10 mt-1 text-xs text-muted-foreground md:text-sm">{mode.description}</p>
                  <div className="relative z-10 mt-3 flex items-center gap-1 text-xs font-bold text-primary md:text-sm">
                    Jouer <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Défis */}
        <div className="relative z-10 mx-auto mt-8 max-w-5xl px-4 md:px-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Flame className="h-4 w-4 text-orange-400" />
            Défis
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
            {challenges.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleModeClick(mode.id)}
                  className="group relative overflow-hidden rounded-2xl comic-border bg-card p-5 text-left md:p-6"
                >
                  <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full ${mode.color} opacity-20 blur-3xl transition-opacity group-hover:opacity-40`} />
                  <div className={`relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${mode.color} md:h-16 md:w-16`}>
                    <Icon className="h-7 w-7 text-black md:h-8 md:w-8" />
                  </div>
                  <h3 className="relative z-10 text-xl font-black text-white md:text-2xl">{mode.title}</h3>
                  <p className="relative z-10 mt-1 text-xs text-muted-foreground md:text-sm">{mode.description}</p>
                  <div className="relative z-10 mt-3 flex items-center gap-1 text-xs font-bold text-primary md:text-sm">
                    Relever le défi <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Top scores preview */}
        <div className="relative z-10 mx-auto mt-8 max-w-5xl px-4 pb-8 md:px-5 md:pb-12">
          <div className="rounded-2xl comic-border bg-card p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-black text-white">Top Scores</h3>
            </div>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : topScores.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Aucun score enregistré. Sois le premier ! 🏆
              </p>
            ) : (
              <div className="space-y-2">
                {topScores.map((score, i) => (
                  <div
                    key={score.id}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5 md:px-4"
                  >
                    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      i === 0 ? "bg-yellow-400 text-black" : i === 1 ? "bg-gray-300 text-black" : i === 2 ? "bg-orange-400 text-black" : "bg-muted text-white"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-base md:text-lg">{score.avatar || "🎵"}</span>
                    <span className="flex-1 truncate text-sm font-bold text-white">{score.player_name}</span>
                    <span className="font-black text-primary">{score.score} pts</span>
                    <span className="hidden text-xs text-muted-foreground sm:inline">{score.theme_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-border py-6 text-center">
          <p className="text-xs text-muted-foreground">
            BeatQuiz Mania 🎵 — Fait avec ❤️ pour les amoureux de la musique
          </p>
        </footer>
      </div>
    </div>
  );
}
