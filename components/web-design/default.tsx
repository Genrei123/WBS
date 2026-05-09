"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── Theme definitions ────────────────────────────────────────────────────────

type Theme = {
  name: string;
  swatch: string; // single colour shown in the swatch circle
  from: string; // gradient start
  mid: string; // gradient midpoint
  to: string; // gradient end
};

const THEMES: Theme[] = [
  { name: "Midnight", swatch: "#0f0c29", from: "#0f0c29", mid: "#302b63", to: "#24243e" },
  { name: "Aurora", swatch: "#0ba360", from: "#0ba360", mid: "#3cba92", to: "#0d7a4e" },
  { name: "Ember", swatch: "#c94b4b", from: "#c94b4b", mid: "#4b134f", to: "#a63232" },
  { name: "Ocean", swatch: "#1a6985", from: "#1a6985", mid: "#2193b0", to: "#0d4f63" },
  { name: "Dusk", swatch: "#f7971e", from: "#f7971e", mid: "#ffd200", to: "#e08a10" },
  { name: "Violet", swatch: "#6a3093", from: "#6a3093", mid: "#a044ff", to: "#4e2070" },
  { name: "Rose", swatch: "#c94082", from: "#c94082", mid: "#f15d5d", to: "#a02d62" },
  { name: "Slate", swatch: "#2b5876", from: "#2b5876", mid: "#4e4376", to: "#1e3f56" },
  { name: "Forest", swatch: "#1d5016", from: "#1d5016", mid: "#2e7d32", to: "#143b10" },
  { name: "Candy", swatch: "#f953c6", from: "#f953c6", mid: "#b91d73", to: "#d23ea0" },
  { name: "Steel", swatch: "#232526", from: "#232526", mid: "#414345", to: "#1a1c1d" },
  { name: "Citrus", swatch: "#d35400", from: "#d35400", mid: "#f39c12", to: "#b24500" },
];

const STATS = [
  { num: "48", label: "Components" },
  { num: "12", label: "Themes" },
  { num: "∞", label: "Combinations" },
  { num: "100%", label: "Customizable" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebDesignPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pageRef = useRef<HTMLDivElement | null>(null);

  const theme = THEMES[activeIdx];
  const background = `linear-gradient(135deg, ${theme.from} 0%, ${theme.mid} 50%, ${theme.to} 100%)`;

  // Sync fullscreen state with the browser API
  useEffect(() => {
    const sync = () => {
      setIsFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === pageRef.current));
    };
    document.addEventListener("fullscreenchange", sync);
    sync();
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const randomize = useCallback(() => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 400);
    setActiveIdx((prev) => {
      let next: number;
      do {
        next = Math.floor(Math.random() * THEMES.length);
      } while (next === prev);
      return next;
    });
  }, []);

  const toggleFullscreen = async () => {
    if (!pageRef.current || !document.fullscreenEnabled) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await pageRef.current.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen errors.
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-7xl", isFullscreen && "max-w-none")}>
      <div
        ref={pageRef}
        className={cn(
          "flex flex-col overflow-hidden rounded-2xl shadow-2xl",
          isFullscreen && "fixed inset-0 z-50 rounded-none shadow-none"
        )}
        style={{ background, transition: "background 0.5s ease" }}
      >
        {/* ── Toolbar ── */}
        <div
          className="sticky top-0 z-50 flex flex-wrap items-center gap-3 px-5 py-2.5"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            borderBottom: "0.5px solid rgba(255,255,255,0.18)",
          }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
            Theme
          </span>

          {/* Swatches */}
          <div className="flex flex-wrap gap-1.5">
            {THEMES.map((t, i) => (
              <button
                key={t.name}
                title={t.name}
                onClick={() => setActiveIdx(i)}
                className="group relative"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: t.swatch,
                  border: i === activeIdx ? "2.5px solid white" : "2.5px solid transparent",
                  outline: "none",
                  cursor: "pointer",
                  transform: i === activeIdx ? "scale(1.15)" : "scale(1)",
                  transition: "transform 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (i !== activeIdx) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)";
                }}
                onMouseLeave={(e) => {
                  if (i !== activeIdx) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                <span
                  className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ fontSize: 9, letterSpacing: "0.05em" }}
                >
                  {t.name}
                </span>
              </button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Randomize */}
          <button
            onClick={randomize}
            className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-white"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
            }}
          >
            <span style={{ display: "inline-block", fontSize: 16, animation: spinning ? "spin 0.4s ease" : "none" }}>
              ⟳
            </span>
            Randomize
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-white"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
            }}
          >
            {isFullscreen ? "↙ Exit" : "↗ Fullscreen"}
          </button>
        </div>

        {/* ── Hero ── */}
        <div
          className={cn(
            "flex flex-1 flex-col items-center justify-center px-6 py-16 text-center",
            isFullscreen ? "min-h-[calc(100vh-52px)]" : "min-h-[680px]"
          )}
        >
          {/* Badge */}
          <span
            className="mb-6 inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase"
            style={{ background: "rgba(255,255,255,0.16)" }}
          >
            Design System
          </span>

          {/* Headline */}
          <h1
            className="mb-5 leading-none font-extrabold tracking-tight text-white"
            style={{
              fontSize: "clamp(40px, 8vw, 96px)",
              letterSpacing: "-0.03em",
              maxWidth: 900,
              transition: "all 0.5s ease",
            }}
          >
            Your Brand,
            <br />
            Your Identity.
          </h1>

          {/* Sub-copy */}
          <p
            className="mb-10 leading-relaxed"
            style={{
              fontSize: "clamp(15px, 2vw, 19px)",
              color: "rgba(255,255,255,0.68)",
              maxWidth: 520,
            }}
          >
            Pick a colour theme or hit Randomize to discover unexpected palettes. Every detail adapts — headline, cards,
            and buttons included.
          </p>

          {/* CTAs */}
          <div className="mb-20 flex flex-wrap justify-center gap-3">
            <button
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold"
              style={{ color: theme.from, cursor: "pointer", transition: "opacity 0.15s" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              }}
            >
              Get Started
            </button>
            <button
              className="rounded-full px-8 py-3.5 text-sm font-semibold text-white"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1.5px solid rgba(255,255,255,0.4)",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
              }}
            >
              Learn More
            </button>
          </div>

          {/* Stat cards */}
          <div className="flex flex-wrap justify-center gap-4" style={{ maxWidth: 900, width: "100%" }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-1 flex-col rounded-2xl text-left"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "0.5px solid rgba(255,255,255,0.2)",
                  backdropFilter: "blur(8px)",
                  padding: "24px 28px",
                  minWidth: 140,
                  maxWidth: 210,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <span
                  className="mb-1.5 leading-none font-extrabold text-white"
                  style={{ fontSize: 36, letterSpacing: "-0.02em" }}
                >
                  {s.num}
                </span>
                <span
                  className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spin keyframe */}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
