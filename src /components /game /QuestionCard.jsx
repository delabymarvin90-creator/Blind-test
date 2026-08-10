import React from "react";
import { motion } from "framer-motion";
import { Check, X, Clock } from "lucide-react";
import AudioPlayer from "@/components/game/AudioPlayer";

const typeLabels = {
  guess_artist: "Devine l'artiste",
  guess_song: "Devine la chanson",
  guess_movie: "Devine le film/série",
  guess_year: "Devine la décennie",
  true_false: "Vrai ou Faux",
  complete_lyrics: "Complète les paroles",
};

export default function QuestionCard({ question, selectedAnswer, showResult, onSelect, timeLeft, questionNumber, totalQuestions }) {
  const choices = question.choices || [];

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative w-full"
    >
      {/* Question number badge */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          Question {questionNumber}/{totalQuestions}
        </span>
        <span className="rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
          {typeLabels[question.question_type] || "Question"}
        </span>
      </div>

      {/* Audio player */}
      <AudioPlayer audioUrl={question.audio_url} />

      {/* Question text */}
      <h2 className="mb-8 text-center text-2xl font-black text-white md:text-3xl">
        {question.question_text}
      </h2>

      {question.hint && showResult && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-center text-sm text-muted-foreground italic"
        >
          💡 {question.hint}
        </motion.p>
      )}

      {/* Answer choices */}
      <div className="grid gap-3 md:grid-cols-2">
        {choices.map((choice, i) => {
          const isSelected = selectedAnswer === choice;
          const isCorrect = choice === question.correct_answer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={!showResult ? { scale: 1.03, y: -2 } : {}}
              whileTap={!showResult ? { scale: 0.97 } : {}}
              onClick={() => !showResult && onSelect(choice)}
              disabled={showResult}
              className={`relative flex items-center gap-3 rounded-xl border-2 p-4 text-left font-bold transition-all ${
                showCorrect
                  ? "border-green-400 bg-green-400/20 text-white animate-bounce-in"
                  : showWrong
                  ? "border-red-400 bg-red-400/20 text-white animate-shake"
                  : isSelected
                  ? "border-primary bg-primary/20 text-white"
                  : "border-border bg-card text-white hover:border-primary/50"
              }`}
            >
              <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-black ${
                showCorrect ? "bg-green-400 text-black" : showWrong ? "bg-red-400 text-black" : "bg-muted text-white"
              }`}>
                {showCorrect ? <Check className="h-5 w-5" /> : showWrong ? <X className="h-5 w-5" /> : String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{choice}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Timer bar */}
      <div className="mt-6 flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full gradient-pink"
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <span className="w-8 text-right text-sm font-bold text-white">{timeLeft}s</span>
      </div>
    </motion.div>
  );
}
