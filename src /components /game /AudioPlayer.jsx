import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Music } from "lucide-react";

export default function AudioPlayer({ audioUrl }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setHasInteracted(false);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    setHasInteracted(true);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setHasError(true));
    }
  };

  if (!audioUrl) {
    return (
      <div className="mb-6 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Music className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Extrait audio indisponible
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col items-center gap-3">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
      />

      {/* Pulsing rings when playing */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-secondary"
              animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        <button
          onClick={togglePlay}
          className="relative flex h-20 w-20 items-center justify-center rounded-full gradient-purple comic-border transition-transform hover:scale-110 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 fill-white text-white" />
          ) : (
            <Play className="h-8 w-8 fill-white text-white ml-1" />
          )}
        </button>
      </div>

      {/* Sound wave bars */}
      {isPlaying && (
        <div className="flex items-center gap-1">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full gradient-pink"
              animate={{ height: [6, 16 + Math.random() * 20, 6] }}
              transition={{ duration: 0.3 + Math.random() * 0.2, repeat: Infinity, delay: i * 0.04 }}
              style={{ height: 6 }}
            />
          ))}
        </div>
      )}

      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {hasError ? "Extrait indisponible" : isPlaying ? "🎧 En écoute..." : hasInteracted ? "Clique pour réécouter" : "▶ Écoute le morceau"}
      </p>
    </div>
  );
}
