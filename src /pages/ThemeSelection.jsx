import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Music } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ThemeCard from "@/components/game/ThemeCard";

const categories = [
  { id: "all", label: "Tout", icon: "🎵" },
  { id: "movies", label: "Films", icon: "🎬" },
  { id: "series", label: "Séries", icon: "📺" },
  { id: "decades", label: "Décennies", icon: "🕺" },
  { id: "genres", label: "Genres", icon: "🎸" },
  { id: "games", label: "Jeux", icon: "🎮" },
];

export default function ThemeSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "solo";
  const modeLabels = {
    solo: "Solo", friends: "Entre Amis", tournament: "Tournoi",
    blitz: "Blitz", survival: "Survie", marathon: "Marathon",
  };
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const data = await base44.entities.Theme.list();
      setThemes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = themes.filter((t) => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || t.category === category;
    return matchSearch && matchCat;
  });

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
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Mode</p>
            <p className="font-black text-white capitalize">{modeLabels[mode] || mode}</p>
          </div>
        </header>

        {/* Title */}
        <div className="px-5 pb-4 text-center">
          <h1 className="text-3xl font-black text-white md:text-4xl">
            Choisis ton <span className="text-gradient-pink">thème</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} thème{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto max-w-5xl px-5">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un thème..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-card py-3 pl-11 pr-4 text-sm font-semibold text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Category filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  category === cat.id
                    ? "gradient-pink text-white comic-border"
                    : "border-2 border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Themes grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-card" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Music className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Aucun thème trouvé</p>
            </div>
          ) : (
            <div className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((theme, i) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  index={i}
                  onClick={() => {
                    if (mode === "blitz" || mode === "survival") {
                      navigate("/play", {
                        state: {
                          theme,
                          mode,
                          players: [{ name: "Toi", avatar: "🎵", score: 0 }],
                          config: {
                            numQuestions: mode === "blitz" ? 10 : 60,
                            timePerQuestion: mode === "blitz" ? 10 : 30,
                          },
                        },
                      });
                    } else {
                      navigate("/setup", { state: { theme, mode } });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
