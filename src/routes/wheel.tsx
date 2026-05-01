import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

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
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#14b8a6", "#f59e0b", "#a855f7", "#10b981",
];

function WheelPage() {
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [textArea, setTextArea] = useState<string>(DEFAULT_NAMES.join("\n"));
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const size = 480;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 6;
    const n = Math.max(names.length, 1);
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < n; i++) {
      const start = i * arc - Math.PI / 2;
      const end = start + arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = PALETTE[i % PALETTE.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.font = "600 16px ui-sans-serif, system-ui, sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 4;
      const label = names[i] || "";
      const maxLen = 18;
      const text = label.length > maxLen ? label.slice(0, maxLen - 1) + "…" : label;
      ctx.fillText(text, radius - 14, 0);
      ctx.restore();
    }

    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = "#0f0f0f";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [names]);

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
    }, 5200);
  };

  return (
    <main className="bg-aurora relative min-h-screen w-full px-5 py-10 sm:px-8 sm:py-14">
      <div className="relative z-10 mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-4 text-[11px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </Link>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground">Spin The Wheel</h1>
          <p className="mt-2 text-sm text-muted-foreground tracking-wide">
            Add Instagram handles, then spin to pick a winner.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[480px_1fr] lg:items-start justify-items-center">
          {/* Wheel */}
          <div className="relative" style={{ width: 480, height: 520 }}>
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
                  borderLeft: "18px solid transparent",
                  borderRight: "18px solid transparent",
                  borderTop: "30px solid #fff",
                  filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))",
                }}
              />
            </div>
            <div
              style={{
                width: 480,
                height: 480,
                marginTop: 20,
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 5s cubic-bezier(0.17, 0.67, 0.16, 1)"
                  : "none",
                borderRadius: "9999px",
                boxShadow:
                  "0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 8px rgba(255,255,255,0.06), inset 0 0 0 2px rgba(255,255,255,0.15)",
              }}
            >
              <canvas ref={canvasRef} />
            </div>
          </div>

          {/* Controls */}
          <div className="glass-card w-full max-w-md rounded-2xl p-6">
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