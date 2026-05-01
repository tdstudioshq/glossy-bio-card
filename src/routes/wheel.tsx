import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import casinoBg from "@/assets/casino-bg.png";

export const Route = createFileRoute("/wheel")({
  head: () => ({
    meta: [
      { title: "Spin The Wheel — TD STUDIOS" },
      { name: "description", content: "Wheel of fortune giveaway spinner by TD Studios." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" },
    ],
  }),
  component: WheelPage,
});

const STORAGE_KEY = "td-wheel-names";
const DEFAULT_NAMES = ["@friend1", "@friend2", "@friend3", "@friend4", "@friend5", "@friend6"];

const PALETTE = [
  "#e11d48", "#f59e0b", "#fbbf24", "#16a34a",
  "#0891b2", "#2563eb", "#7c3aed", "#db2777",
  "#0d9488", "#ea580c", "#9333ea", "#059669",
];

function WheelPage() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [textArea, setTextArea] = useState<string>(DEFAULT_NAMES.join("\n"));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelWrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(320);

  // Responsive wheel sizing based on container/viewport
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Fit within viewport with padding; cap at 480
      const maxByWidth = Math.min(vw - 40, 480);
      const maxByHeight = vh - 260; // leave room for header + button
      const next = Math.max(260, Math.min(maxByWidth, maxByHeight, 480));
      setSize(Math.floor(next));
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved) as string[];
        if (Array.isArray(arr) && arr.length > 0) {
          setNames(arr);
          setTextArea(arr.join("\n"));
        }
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
    } catch {}
  }, [names]);

  // Draw wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;
    const n = Math.max(names.length, 1);
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < n; i++) {
      const start = i * arc - Math.PI / 2;
      const end = start + arc;
      const baseColor = PALETTE[i % PALETTE.length];
      // Radial gradient for depth
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius);
      grad.addColorStop(0, shade(baseColor, 0.25));
      grad.addColorStop(0.7, baseColor);
      grad.addColorStop(1, shade(baseColor, -0.35));
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      const fontSize = Math.max(10, Math.round(size * 0.034));
      ctx.font = `700 ${fontSize}px ui-sans-serif, system-ui, sans-serif`;
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 6;
      const label = names[i] || "";
      const maxLen = size < 360 ? 12 : size < 440 ? 15 : 18;
      const text = label.length > maxLen ? label.slice(0, maxLen - 1) + "…" : label;
      ctx.fillText(text, radius - Math.max(10, size * 0.035), 0);
      ctx.restore();
    }

    // Glossy top highlight (arc reflection on upper half)
    ctx.save();
    const gloss = ctx.createLinearGradient(0, 0, 0, size);
    gloss.addColorStop(0, "rgba(255,255,255,0.35)");
    gloss.addColorStop(0.45, "rgba(255,255,255,0.05)");
    gloss.addColorStop(0.5, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = gloss;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    // Outer rim (gold-ish glossy ring)
    const rimGrad = ctx.createLinearGradient(0, 0, 0, size);
    rimGrad.addColorStop(0, "#fde68a");
    rimGrad.addColorStop(0.5, "#f59e0b");
    rimGrad.addColorStop(1, "#92400e");
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center hub with glossy gradient
    const hubGrad = ctx.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, 32);
    hubGrad.addColorStop(0, "#ffffff");
    hubGrad.addColorStop(0.4, "#cbd5e1");
    hubGrad.addColorStop(1, "#0f172a");
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner hub dot
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#0f172a";
    ctx.fill();
  }, [names, size]);

  // Helper to lighten/darken hex colors
  function shade(hex: string, percent: number): string {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const adj = (c: number) =>
      Math.max(0, Math.min(255, Math.round(c + (percent > 0 ? (255 - c) * percent : c * percent))));
    return `rgb(${adj(r)}, ${adj(g)}, ${adj(b)})`;
  }

  const applyNames = () => {
    const arr = textArea
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (arr.length > 0) {
      setNames(arr);
      setWinner(null);
    }
  };

  const spin = () => {
    if (spinning || names.length === 0) return;
    setWinner(null);
    const n = names.length;
    const arc = 360 / n;
    const winnerIndex = Math.floor(Math.random() * n);
    const fullSpins = 6 + Math.floor(Math.random() * 3);
    // Pointer at top (12 o'clock). Segment i center angle (relative to wheel) = i*arc + arc/2 (from top, clockwise)
    // We want that segment center to land at pointer (top). Final rotation mod 360 should equal -(i*arc + arc/2)
    const targetMod = (360 - (winnerIndex * arc + arc / 2)) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((targetMod - currentMod) + 360) % 360;
    const finalRotation = rotation + fullSpins * 360 + delta;
    setSpinning(true);
    setRotation(finalRotation);
    window.setTimeout(() => {
      setSpinning(false);
      setWinner(names[winnerIndex]);
      fireConfetti();
    }, 5200);
  };

  const fireConfetti = () => {
    const gold = ["#fde68a", "#f59e0b", "#fbbf24", "#ffffff", "#facc15"];
    const defaults = {
      colors: gold,
      ticks: 220,
      gravity: 0.85,
      scalar: 0.9,
      disableForReducedMotion: true,
    };
    // Center burst
    confetti({
      ...defaults,
      particleCount: 80,
      spread: 70,
      startVelocity: 38,
      origin: { x: 0.5, y: 0.45 },
    });
    // Side cannons
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 60,
        spread: 60,
        startVelocity: 45,
        origin: { x: 0, y: 0.7 },
      });
      confetti({
        ...defaults,
        particleCount: 50,
        angle: 120,
        spread: 60,
        startVelocity: 45,
        origin: { x: 1, y: 0.7 },
      });
    }, 180);
    // Gentle drift
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 40,
        spread: 100,
        startVelocity: 25,
        gravity: 0.6,
        scalar: 0.75,
        origin: { x: 0.5, y: 0.3 },
      });
    }, 450);
  };

  return (
    <main
      className="relative min-h-screen w-full px-4 py-6 sm:px-8 sm:py-14"
      style={{
        backgroundImage: `url(${casinoBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,6,16,0.65) 0%, rgba(8,6,16,0.55) 50%, rgba(8,6,16,0.8) 100%)",
          backdropFilter: "blur(2px)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-6 sm:mb-8 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-4 text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
          <h1 className="font-display text-4xl sm:text-6xl text-foreground">Spin The Wheel</h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground tracking-wide px-2">
            Add Instagram handles, then spin to pick a winner.
          </p>
        </header>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[480px_1fr] lg:items-start justify-items-center">
          {/* Wheel */}
          <div
            ref={wheelWrapRef}
            className="relative mx-auto"
            style={{ width: size, height: size + 40 }}
          >
            {/* Rim glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: size + 60,
                height: size + 60,
                marginTop: 10,
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.45) 0%, rgba(245,158,11,0.15) 40%, transparent 70%)",
                filter: "blur(30px)",
              }}
            />
            {/* Pointer */}
            <div
              className="absolute left-1/2 -translate-x-1/2 z-20"
              style={{ top: -2 }}
              aria-hidden
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${Math.max(14, size * 0.04)}px solid transparent`,
                  borderRight: `${Math.max(14, size * 0.04)}px solid transparent`,
                  borderTop: `${Math.max(24, size * 0.07)}px solid #fde68a`,
                  filter:
                    "drop-shadow(0 0 12px rgba(245,158,11,0.9)) drop-shadow(0 4px 6px rgba(0,0,0,0.6))",
                }}
              />
            </div>
            <div
              className="relative"
              style={{
                width: size,
                height: size,
                marginTop: 20,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 5s cubic-bezier(0.17, 0.67, 0.16, 1)"
                  : "none",
                borderRadius: "9999px",
                boxShadow:
                  "0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px rgba(245,158,11,0.25), 0 0 0 6px rgba(255,255,255,0.08), 0 0 0 10px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.2)",
              }}
            >
              <canvas ref={canvasRef} />
            </div>
          </div>

          {/* Controls */}
          <div
            className="glass-card w-full max-w-md rounded-2xl p-4 sm:p-6"
            style={{ backdropFilter: "blur(40px) saturate(200%)", WebkitBackdropFilter: "blur(40px) saturate(200%)" }}
          >
            <button
              onClick={spin}
              disabled={spinning || names.length === 0}
              className="glass-button w-full rounded-2xl px-6 py-4 text-foreground disabled:opacity-50"
            >
              <span className="font-display text-2xl">
                {spinning ? "Spinning…" : "SPIN"}
              </span>
            </button>

            {winner && (
              <div className="animate-fade-up mt-4 rounded-xl border border-border bg-card/60 p-4 text-center">
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  Winner
                </div>
                <div className="font-display text-3xl mt-1 text-foreground">{winner}</div>
              </div>
            )}

            <div className="mt-6">
              <label className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
                Names (one per line)
              </label>
              <textarea
                value={textArea}
                onChange={(e) => setTextArea(e.target.value)}
                rows={10}
                className="mt-2 w-full rounded-xl border border-border bg-background/50 p-3 text-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="@username1&#10;@username2&#10;@username3"
              />
              <button
                onClick={applyNames}
                className="glass-button mt-3 w-full rounded-xl px-4 py-3 text-foreground"
              >
                <span className="font-display text-lg">Update Wheel</span>
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                {names.length} {names.length === 1 ? "entry" : "entries"} • saved to this device
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}