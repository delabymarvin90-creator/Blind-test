import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, Play, Users, Zap, Clock, Hash } from "lucide-react";

const avatars = ["🎵", "🎤", "🎸", "🎹", "🥁", "🎷", "🎺", "🎧", "🎼", "⚡", "🔥", "⭐", "🎮", "👑", "💎", "🦄"];

export default function GameSetup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, mode } = location.state || {};

  const [players, setPlayers] = useState(
    mode === "solo"
      ? [{ name: "", avatar: "🎵", score: 0 }]
      : mode === "tournament"
      ? [
          { name: "Team Alpha", avatar: "🔥", score: 0 },
          { name: "Team Omega", avatar: "⚡", score: 0 },
        ]
      : [
          { name: "", avatar: "🎵", score: 0 },
          { name: "", avatar: "🎤", score: 0 },
        ]
  );
  const [numQuestions, setNumQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  if (!theme) {
    navigate("/");
    return null;
  }

  const maxPlayers = mode === "solo" ? 1 : mode === "tournament" ? 4 : 6;
  const minPlayers = mode === "solo" ? 1 : 2;
  const playerLabel = mode === "tournament" ? "équipe" : "joueur";

  const addPlayer = () => {
    if (players.length >= maxPlayers) return;
    setPlayers([...players, { name: "", avatar: avatars[players.length], score: 0 }]);
  };

  const removePlayer = (i) => {
    if (players.length <= minPlayers) return;
    setPlayers(players.filter((_, idx) => idx !== i));
  };

  const updatePlayer = (i, field, value) => {
    const updated = [...players];
    updated[i] = { ...updated[i], [field]: value };
    setPlayers(updated);
  };

  const cycleAvatar = (i) => {
    const currentIdx = avatars.indexOf(players[i].avatar);
    const nextIdx = (currentIdx + 1) % avatars.length;
    updatePlayer(i, "avatar", avatars[nextIdx]);
  };

  const canStart = players.every((p) => p.name.trim().length > 0);

  const startGame = () => {
    const finalPlayers = players.map((p) => ({ ...p, name: p.name.trim(), score: 0 }));
    navigate("/play", {
      state: { theme, mode, players: finalPlayers, config: { numQuestions, timePerQuestion } },
    });
  };

  return (
    <div className="min-h-screen bg-background bg-radial-glow">
      <div className="bg-grid min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-5">
          <button
            onClick={() => navigate("/themes", { state: { mode } })}
            className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold text-white transition-colors hover:border-primary/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-2">
            <span className="text-xl">{theme.icon}</span>
            <span className="font-bold text-white">{theme.name}</span>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 pb-12">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-black text-white md:text-4xl">
              Configuration
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "solo" ? "Prépare-toi à défier la musique" : mode === "tournament" ? "Configure tes équipes" : "Ajoute les joueurs"}
            </p>
          </div>

          {/* Players */}
          <div className="mb-6 rounded-2xl comic-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-black text-white">
                <Users className="h-5 w-5 text-primary" />
                {players.length} {playerLabel}{players.length > 1 ? "s" : ""}
              </h2>
              {players.length < maxPlayers && (
                <button
                  onClick={addPlayer}
                  className="flex items-center gap-1.5 rounded-lg gradient-pink px-3 py-1.5 text-xs font-bold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </button>
              )}
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {players.map((player, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3"
                  >
                    <button
                      onClick={() => cycleAvatar(i)}
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl gradient-purple text-2xl transition-transform hover:scale-110"
                    >
                      {player.avatar}
                    </button>
                    <input
                      type="text"
                      placeholder={`Nom du ${playerLabel} ${i + 1}`}
                      value={player.name}
                      onChange={(e) => updatePlayer(i, "name", e.target.value)}
                      maxLength={20}
                      className="flex-1 rounded-xl border-2 border-border bg-background px-4 py-3 text-sm font-bold text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                    {players.length > minPlayers && (
                      <button
                        onClick={() => removePlayer(i)}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-400/10 text-red-400 transition-colors hover:bg-red-400/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Game options */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {/* Number of questions */}
            <div className="rounded-2xl comic-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4 text-secondary" />
                <span className="text-sm font-bold text-white">Nombre de questions</span>
              </div>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map((n) => (
                  <button
                    key={n}
                    onClick={() => setNumQuestions(n)}
                    className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                      numQuestions === n
                        ? "gradient-cyan text-black"
                        : "bg-muted text-muted-foreground hover:text-white"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Time per question */}
            <div className="rounded-2xl comic-border bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-sm font-bold text-white">Temps par question</span>
              </div>
              <div className="flex gap-2">
                {[15, 20, 30, 45].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimePerQuestion(t)}
                    className={`flex-1 rounded-lg py-2 text-sm font-bold transition-all ${
                      timePerQuestion === t
                        ? "gradient-yellow text-black"
                        : "bg-muted text-muted-foreground hover:text-white"
                    }`}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Start button */}
          <button
            onClick={startGame}
            disabled={!canStart}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-black transition-all ${
              canStart
                ? "gradient-pink text-white comic-border animate-pulse-glow hover:scale-[1.02]"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            <Play className="h-5 w-5 fill-current" />
            Lancer la partie
          </button>
          {!canStart && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Remplis tous les noms pour commencer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
