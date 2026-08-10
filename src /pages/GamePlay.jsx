import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, ChevronRight, Heart, Home, Skull } from "lucide-react";
import { base44 } from "@/api/base44Client";
import QuestionCard from "@/components/game/QuestionCard";

const modeLabels = {
  solo: "Solo",
  friends: "Entre Amis",
  tournament: "Tournoi",
  blitz: "Blitz",
  survival: "Survie",
  marathon: "Marathon",
};

export default function GamePlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, mode, players: initialPlayers, config } = location.state || {};

  const defaultTime = mode === "blitz" ? 10 : config?.timePerQuestion || 30;
  const defaultQuestions = mode === "blitz" ? 10 : mode === "marathon" ? 20 : config?.numQuestions || 10;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [players, setPlayers] = useState(initialPlayers || [{ name: "Toi", avatar: "🎵", score: 0 }]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [lastPoints, setLastPoints] = useState(0);
  const [lives, setLives] = useState(mode === "survival" ? 3 : 0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const loadQuestions = useCallback(async () => {
    try {
      let allQuestions;
      if (mode === "marathon" || theme?.id === "all") {
        allQuestions = await base44.entities.Question.list();
      } else {
        allQuestions = await base44.entities.Question.filter({ theme_id: theme.id });
      }
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
      const num = mode === "survival" ? shuffled.length : Math.min(defaultQuestions, shuffled.length);
      setQuestions(shuffled.slice(0, num));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [theme, mode, defaultQuestions]);

  useEffect(() => {
    if (!theme && mode !== "marathon") {
      navigate("/");
      return;
    }
    loadQuestions();
  }, []);

  const maxTime = mode === "blitz" ? 10 : config?.timePerQuestion || 30;

  // Timer
  useEffect(() => {
    if (loading || showResult || questions.length === 0) return;
    if (timeLeft <= 0) {
      handleAnswer(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, loading, showResult, questions.length]);

  const handleAnswer = (answer) => {
    if (showResult || questions.length === 0) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    setQuestionsAnswered((q) => q + 1);

    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.correct_answer;
    let points = 0;

    if (isCorrect) {
      const timeBonus = Math.ceil((timeLeft / maxTime) * (mode === "blitz" ? 20 : 10));
      points = 10 + timeBonus;
      setLastPoints(points);
      const updated = [...players];
      updated[currentPlayerIndex].score = (updated[currentPlayerIndex].score || 0) + points;
      setPlayers(updated);
    } else {
      setLastPoints(0);
    }

    // Survival: lose a life
    const newLives = mode === "survival" ? lives - (isCorrect ? 0 : 1) : lives;
    if (mode === "survival") {
      setLives(newLives);
    }

    setTimeout(() => {
      // Survival: game over when lives = 0
      if (mode === "survival" && newLives <= 0) {
        navigate("/results", { state: { theme, players, mode, questionsAnswered: questionsAnswered + 1 } });
        return;
      }

      if (currentIndex + 1 >= questions.length) {
        if (mode === "survival") {
          // Reshuffle for endless mode
          const reshuffled = [...questions].sort(() => Math.random() - 0.5);
          setQuestions(reshuffled);
          setCurrentIndex(0);
        } else {
          navigate("/results", { state: { theme, players, mode } });
          return;
        }
      } else {
        setCurrentIndex((i) => i + 1);
        if (players.length > 1) {
          setCurrentPlayerIndex((i) => (i + 1) % players.length);
        }
      }
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(maxTime);
    }, 3500);
  };

  const quitGame = () => {
    if (questions.length > 0 && players.some((p) => p.score > 0)) {
      navigate("/results", { state: { theme, players, mode } });
    } else {
      navigate("/");
    }
  };

  if (!theme && mode !== "marathon") {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="mb-4 flex items-end gap-1">
          {[0.4, 0.7, 1, 0.7, 0.4].map((h, i) => (
            <motion.div
              key={i}
              className="w-2 rounded-full gradient-pink"
              animate={{ height: [8, 30, 8] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              style={{ height: 8 }}
            />
          ))}
        </div>
        <p className="text-sm font-bold text-muted-foreground">Chargement des questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
        <span className="mb-3 text-5xl">🎵</span>
        <p className="mb-4 text-lg font-bold text-white">Aucune question disponible pour ce thème</p>
        <button
          onClick={() => navigate("/themes", { state: { mode } })}
          className="rounded-xl gradient-pink px-6 py-3 text-sm font-bold text-white"
        >
          Choisir un autre thème
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentPlayer = players[currentPlayerIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isChallenge = mode === "blitz" || mode === "survival" || mode === "marathon";

  return (
    <div className="min-h-screen bg-background bg-radial-glow">
      <div className="bg-grid min-h-screen">
        {/* Header */}
        <header className="p-3 md:p-5">
          <div className="mx-auto max-w-4xl">
            {/* Top row: progress + quit */}
            <div className="mb-2 flex items-center gap-3">
              <button
                onClick={quitGame}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-border bg-card text-white transition-colors hover:border-primary/50"
              >
                <Home className="h-4 w-4" />
              </button>
              <span className="text-xs font-bold text-white md:text-sm">
                {currentIndex + 1}<span className="text-muted-foreground">/{isChallenge && mode !== "marathon" ? "∞" : questions.length}</span>
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full gradient-pink"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <span className="hidden text-xs text-muted-foreground sm:inline">{theme?.icon} {theme?.name}</span>
            </div>

            {/* Player scores + lives */}
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
                {players.map((player, i) => (
                  <div
                    key={i}
                    className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border-2 px-2.5 py-1 transition-all md:px-3 md:py-1.5 ${
                      i === currentPlayerIndex
                        ? "border-primary bg-primary/20 scale-105"
                        : "border-border bg-card opacity-60"
                    }`}
                  >
                    <span className="text-sm md:text-base">{player.avatar}</span>
                    <span className="text-xs font-bold text-white">{player.name}</span>
                    <span className="text-xs font-black text-primary">{player.score}</span>
                  </div>
                ))}
              </div>

              {/* Lives for survival mode */}
              {mode === "survival" && (
                <div className="flex flex-shrink-0 items-center gap-1 rounded-full border-2 border-red-400/30 bg-red-400/10 px-2.5 py-1 md:px-3 md:py-1.5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`h-4 w-4 md:h-5 md:w-5 ${i < lives ? "text-red-400 fill-red-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Current player indicator (skip for solo challenge modes) */}
        {!isChallenge && players.length > 1 && (
          <div className="mb-4 text-center">
            <motion.div
              key={currentPlayerIndex}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 rounded-full gradient-purple px-4 py-2 text-sm font-black text-white comic-border md:px-5"
            >
              <span className="text-base md:text-lg">{currentPlayer.avatar}</span>
              À {currentPlayer.name} de jouer !
            </motion.div>
          </div>
        )}

        {/* Question */}
        <div className="mx-auto max-w-3xl px-3 pb-8 md:px-5">
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentIndex}
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              onSelect={handleAnswer}
              timeLeft={timeLeft}
              questionNumber={currentIndex + 1}
              totalQuestions={questions.length}
            />
          </AnimatePresence>

          {/* Result feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 text-center md:mt-6"
              >
                {selectedAnswer === currentQuestion.correct_answer ? (
                  <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-xl bg-green-400/20 px-4 py-3 text-base font-black text-green-400 comic-border md:px-6 md:text-lg">
                    <Check className="h-5 w-5" />
                    Correct ! +{lastPoints} points
                  </div>
                ) : (
                  <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-xl bg-red-400/20 px-4 py-3 text-base font-black text-red-400 comic-border md:px-6 md:text-lg">
                    {mode === "survival" ? (
                      <>
                        <Skull className="h-5 w-5" />
                        {selectedAnswer === null ? "Temps écoulé !" : "Faux !"} -1 vie
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5" />
                        {selectedAnswer === null ? "Temps écoulé !" : "Faux !"}
                        <span className="text-white">Réponse: {currentQuestion.correct_answer}</span>
                      </>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground md:text-sm">
                  {mode === "survival" && lives <= 0 ? "Partie terminée..." : "Prochaine question"} <ChevronRight className="h-4 w-4 animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
