"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "framer-motion";
import { Bug, Clock, Play, RotateCcw, Sparkles, Trophy, X, Zap } from "lucide-react";
import { readBest, saveBest, setGameActive } from "@/lib/game";
import { lockScroll, unlockScroll } from "@/lib/scroll";

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const ROUND = 30; // seconds
const COMBO_WINDOW = 1.1; // seconds between pops to keep a combo
const MAX_COMBO = 8;
const BUG_PENALTY = 50;
const GOLD_BONUS = 3; // seconds
const LABELS = ["React", "Laravel", "PHP", "Vue", "TS", "JS", "Git", "MySQL", "Vite", "Next", "Tailwind", "Inertia"];
const TECH_HUES = [150, 168, 190, 205, 255];

type Phase = "ready" | "countdown" | "playing" | "over";
type Kind = "tech" | "bug" | "gold";

type GBubble = {
  x0: number;
  x: number;
  y: number;
  vy: number;
  r: number;
  kind: Kind;
  label: string;
  hue: number;
  phase: number;
  amp: number;
};
type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: number; size: number };
type Ring = { x: number; y: number; r: number; life: number; hue: number };
type Floater = { x: number; y: number; text: string; color: string; life: number; size: number };

type Result = {
  score: number;
  best: number;
  isBest: boolean;
  popped: number;
  maxCombo: number;
  accuracy: number;
  bugs: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fmt = (n: number) => n.toLocaleString("en-US");

/* ------------------------------------------------------------------ */
/* Drawing helpers                                                     */
/* ------------------------------------------------------------------ */

function drawBug(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.save();
  ctx.strokeStyle = "#fca5a5";
  ctx.lineWidth = Math.max(1.4, s * 0.1);
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    for (const k of [-1, 0, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + side * s * 0.3, y + k * s * 0.32 + s * 0.12);
      ctx.lineTo(x + side * s * 0.78, y + k * s * 0.42 + s * 0.05);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x + side * s * 0.1, y - s * 0.62);
    ctx.lineTo(x + side * s * 0.34, y - s * 0.92);
    ctx.stroke();
  }
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.ellipse(x, y + s * 0.12, s * 0.4, s * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f87171";
  ctx.beginPath();
  ctx.arc(x, y - s * 0.48, s * 0.24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(15,23,42,0.6)";
  ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.beginPath();
  ctx.moveTo(x, y - s * 0.32);
  ctx.lineTo(x, y + s * 0.6);
  ctx.stroke();
  ctx.restore();
}

function drawBubble(ctx: CanvasRenderingContext2D, b: GBubble, font: string) {
  const { x, y, r, hue } = b;
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.05, x, y, r);
  g.addColorStop(0, "rgba(255,255,255,0.42)");
  g.addColorStop(0.28, `hsla(${hue},80%,60%,0.08)`);
  g.addColorStop(0.85, `hsla(${hue},80%,45%,0.22)`);
  g.addColorStop(1, `hsla(${hue},85%,65%,0.5)`);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = b.kind === "gold" ? 2.5 : 1.5;
  ctx.strokeStyle = `hsla(${hue},85%,70%,0.9)`;
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.22, r * 0.11, -0.7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fill();

  if (b.kind === "bug") {
    drawBug(ctx, x, y + r * 0.05, r * 0.55);
    return;
  }
  const size = Math.min(r * 0.46, (r * 1.6) / (b.label.length * 0.58));
  ctx.font = `600 ${size}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = b.kind === "gold" ? "#fde68a" : "#f1f5f9";
  ctx.fillText(b.label, x, y + size * 0.05);
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function BubblePopGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreEl = useRef<HTMLSpanElement>(null);
  const comboEl = useRef<HTMLSpanElement>(null);
  const timeEl = useRef<HTMLSpanElement>(null);
  const primaryBtn = useRef<HTMLButtonElement>(null);

  const [phase, setPhase] = useState<Phase>("ready");
  const [count, setCount] = useState(3);
  const [result, setResult] = useState<Result | null>(null);
  const [best] = useState(readBest);

  const phaseRef = useRef<Phase>("ready");
  const game = useRef({
    bubbles: [] as GBubble[],
    particles: [] as Particle[],
    rings: [] as Ring[],
    floaters: [] as Floater[],
    score: 0,
    combo: 1,
    maxCombo: 1,
    lastPop: -10,
    time: ROUND,
    elapsed: 0,
    clock: 0,
    popped: 0,
    misses: 0,
    bugs: 0,
    spawnT: 0,
    shake: 0,
    flash: 0,
    scale: 1,
    finish: () => {},
  });

  /* Open: take over the hero, lock scroll. Close: give it back. */
  useEffect(() => {
    setGameActive(true);
    lockScroll();
    return () => {
      setGameActive(false);
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  /* Phase transitions */
  useEffect(() => {
    phaseRef.current = phase;
    if (phase === "ready" || phase === "over") primaryBtn.current?.focus();

    if (phase === "countdown") {
      const t1 = window.setTimeout(() => setCount(2), 650);
      const t2 = window.setTimeout(() => setCount(1), 1300);
      const t3 = window.setTimeout(() => setPhase("playing"), 1950);
      return () => [t1, t2, t3].forEach(window.clearTimeout);
    }

    if (phase === "playing") {
      const g = game.current;
      Object.assign(g, {
        bubbles: [],
        score: 0,
        combo: 1,
        maxCombo: 1,
        lastPop: -10,
        time: ROUND,
        elapsed: 0,
        popped: 0,
        misses: 0,
        bugs: 0,
        spawnT: 0,
      });
    }
  }, [phase]);

  /* Render loop (runs for the whole lifetime; ambient bubbles between rounds) */
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const font =
      getComputedStyle(document.documentElement).getPropertyValue("--font-grotesk").trim() || "system-ui, sans-serif";
    let W = 0;
    let H = 0;
    const g = game.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.scale = Math.min(1.15, Math.max(0.72, Math.min(W, H) / 820));
    };
    resize();
    window.addEventListener("resize", resize);

    g.finish = () => {
      phaseRef.current = "over";
      // Finale: every bubble left on screen pops at once.
      for (const b of g.bubbles) {
        g.rings.push({ x: b.x, y: b.y, r: b.r, life: 0, hue: b.hue });
        for (let k = 0; k < 8; k++) {
          const a = rand(0, Math.PI * 2);
          const sp = rand(60, 200) * g.scale;
          g.particles.push({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.4, 0.8), hue: b.hue, size: rand(1.5, 3) });
        }
      }
      g.bubbles = [];
      g.spawnT = 1.2;
      const prev = readBest();
      const isBest = g.score > prev;
      if (isBest) saveBest(g.score);
      const attempts = g.popped + g.misses + g.bugs;
      setResult({
        score: g.score,
        best: Math.max(prev, g.score),
        isBest,
        popped: g.popped,
        maxCombo: g.maxCombo,
        accuracy: attempts ? Math.round((g.popped / attempts) * 100) : 0,
        bugs: g.bugs,
      });
      setPhase("over");
    };

    const spawn = (playing: boolean) => {
      const prog = Math.min(1, g.elapsed / ROUND);
      const roll = Math.random();
      const kind: Kind = playing ? (roll < 0.13 + prog * 0.07 ? "bug" : roll > 0.965 ? "gold" : "tech") : "tech";
      const s = g.scale;
      const r = (kind === "gold" ? 26 : rand(24, 48)) * s;
      let speed = rand(60, 130) * s * (playing ? 1 + prog * 0.9 : 0.55);
      if (kind === "gold") speed *= 1.45;
      g.bubbles.push({
        x0: rand(r + 8, W - r - 8),
        x: 0,
        y: H + r,
        vy: -speed,
        r,
        kind,
        label: kind === "tech" ? pick(LABELS) : kind === "gold" ? `+${GOLD_BONUS}s` : "",
        hue: kind === "bug" ? 0 : kind === "gold" ? 45 : pick(TECH_HUES),
        phase: rand(0, Math.PI * 2),
        amp: rand(8, 26),
      });
    };

    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      g.clock += dt;
      const playing = phaseRef.current === "playing";

      if (playing) {
        g.time -= dt;
        g.elapsed += dt;
        if (g.time <= 0) {
          g.time = 0;
          g.finish();
        }
      }

      // Spawning gets faster as the round goes on.
      g.spawnT -= dt;
      const prog = Math.min(1, g.elapsed / ROUND);
      if (g.spawnT <= 0 && g.bubbles.length < (playing ? 34 : 12)) {
        spawn(playing);
        g.spawnT = (playing ? lerp(0.55, 0.24, prog) : 0.9) * rand(0.7, 1.3);
      }

      // Update
      for (let i = g.bubbles.length - 1; i >= 0; i--) {
        const b = g.bubbles[i];
        b.y += b.vy * dt;
        b.x = b.x0 + Math.sin(g.clock * 1.6 + b.phase) * b.amp;
        if (b.y < -b.r - 20) g.bubbles.splice(i, 1);
      }
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.life += dt;
        if (p.life >= p.max) {
          g.particles.splice(i, 1);
          continue;
        }
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 60 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      for (let i = g.rings.length - 1; i >= 0; i--) {
        g.rings[i].life += dt * 2.4;
        if (g.rings[i].life >= 1) g.rings.splice(i, 1);
      }
      for (let i = g.floaters.length - 1; i >= 0; i--) {
        const f = g.floaters[i];
        f.life += dt / 0.9;
        f.y -= 46 * dt;
        if (f.life >= 1) g.floaters.splice(i, 1);
      }
      g.shake = Math.max(0, g.shake - dt);
      g.flash = Math.max(0, g.flash - dt * 3);

      // Draw
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (g.shake > 0) ctx.translate(rand(-1, 1) * g.shake * 40, rand(-1, 1) * g.shake * 40);

      for (const b of g.bubbles) drawBubble(ctx, b, font);

      for (const ring of g.rings) {
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r * (1 + ring.life * 0.9), 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${ring.hue},85%,70%,${(1 - ring.life) * 0.8})`;
        ctx.lineWidth = 2 * (1 - ring.life) + 0.5;
        ctx.stroke();
      }
      for (const p of g.particles) {
        const a = 1 - p.life / p.max;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.4 + a * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},85%,70%,${a})`;
        ctx.fill();
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const f of g.floaters) {
        ctx.globalAlpha = 1 - f.life * f.life;
        ctx.font = `700 ${f.size}px ${font}`;
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      if (g.flash > 0) {
        ctx.fillStyle = `rgba(239,68,68,${g.flash * 0.16})`;
        ctx.fillRect(0, 0, W, H);
      }

      // HUD (direct DOM writes — no React re-render per frame)
      if (playing) {
        if (scoreEl.current) scoreEl.current.textContent = fmt(g.score);
        if (comboEl.current) comboEl.current.textContent = `×${g.combo}`;
        if (timeEl.current) {
          timeEl.current.textContent = g.time.toFixed(1);
          if (g.time < 5) timeEl.current.dataset.low = "";
          else delete timeEl.current.dataset.low;
        }
      }

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* Input */
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = game.current;
    const x = e.clientX;
    const y = e.clientY;
    const pad = e.pointerType === "mouse" ? 4 : 14;
    const playing = phaseRef.current === "playing";

    for (let i = g.bubbles.length - 1; i >= 0; i--) {
      const b = g.bubbles[i];
      if (Math.hypot(x - b.x, y - b.y) > b.r + pad) continue;

      g.bubbles.splice(i, 1);
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * Math.PI * 2 + rand(0, 0.4);
        const sp = rand(80, 240) * g.scale;
        g.particles.push({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(0.35, 0.7), hue: b.hue, size: rand(1.5, 3.5) });
      }
      g.rings.push({ x: b.x, y: b.y, r: b.r, life: 0, hue: b.hue });
      if (!playing) return;

      const size = 22 * g.scale;
      if (b.kind === "bug") {
        g.score = Math.max(0, g.score - BUG_PENALTY);
        g.combo = 1;
        g.bugs++;
        g.shake = 0.25;
        g.flash = 1;
        g.floaters.push({ x: b.x, y: b.y, text: `-${BUG_PENALTY}`, color: "#f87171", life: 0, size });
        return;
      }

      g.combo = g.clock - g.lastPop < COMBO_WINDOW ? Math.min(g.combo + 1, MAX_COMBO) : 1;
      g.lastPop = g.clock;
      g.maxCombo = Math.max(g.maxCombo, g.combo);
      const base = Math.max(10, Math.round(10 + (48 * g.scale - b.r) * 0.9));
      const pts = base * g.combo;
      g.score += pts;
      g.popped++;
      g.floaters.push({
        x: b.x,
        y: b.y,
        text: g.combo > 1 ? `+${pts} ×${g.combo}` : `+${pts}`,
        color: g.combo >= 5 ? "#67e8f9" : "#86efac",
        life: 0,
        size: size * (1 + Math.min(g.combo, 6) * 0.06),
      });
      if (b.kind === "gold") {
        g.time += GOLD_BONUS;
        g.floaters.push({ x: b.x, y: b.y - size * 1.2, text: `+${GOLD_BONUS}s`, color: "#fde68a", life: 0, size });
      }
      return;
    }

    // Clicked empty space: breaks the combo.
    if (playing) {
      g.misses++;
      if (g.combo > 1) {
        g.floaters.push({ x, y, text: "combo lost", color: "#94a3b8", life: 0, size: 14 * g.scale });
      }
      g.combo = 1;
    }
  };

  const start = () => {
    setResult(null);
    setCount(3);
    setPhase("countdown");
  };

  const showBest = result?.best ?? best;

  return createPortal(
    <m.div
      role="dialog"
      aria-modal="true"
      aria-label="Bubble Pop Rush mini-game"
      className="fixed inset-0 z-[80] bg-[rgb(7_11_20/0.82)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        className="absolute inset-0 h-full w-full cursor-crosshair touch-none select-none"
        aria-hidden
      />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
        <div className="game-panel flex items-center gap-4 rounded-2xl px-4 py-2.5 font-mono sm:gap-6 sm:px-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Score</p>
            <span ref={scoreEl} className="text-lg font-semibold text-fg tabular-nums sm:text-xl">0</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Combo</p>
            <span ref={comboEl} className="text-lg font-semibold text-accent tabular-nums sm:text-xl">×1</span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Time</p>
            <span
              ref={timeEl}
              className="text-lg font-semibold text-fg tabular-nums data-[low]:animate-pulse data-[low]:text-[#f87171] sm:text-xl"
            >
              {ROUND.toFixed(1)}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Best</p>
            <span className="text-lg font-semibold text-fg-muted tabular-nums sm:text-xl">{fmt(showBest)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit game (Esc)"
          className="game-panel pointer-events-auto grid h-11 w-11 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors hover:text-fg"
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      {/* Center cards */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center p-5">
        <AnimatePresence mode="wait">
          {phase === "ready" && (
            <m.div
              key="ready"
              className="game-panel pointer-events-auto w-full max-w-md rounded-3xl p-7 text-center sm:p-9"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Easter egg unlocked</p>
              <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-fg">
                Bubble Pop <span className="text-gradient">Rush</span>
              </h2>
              <ul className="mt-6 space-y-2.5 text-left text-sm text-fg-muted">
                <li className="flex items-center gap-3"><Sparkles size={16} className="shrink-0 text-accent" aria-hidden /> Pop tech bubbles — smaller ones score more.</li>
                <li className="flex items-center gap-3"><Zap size={16} className="shrink-0 text-accent-2" aria-hidden /> Pop fast to chain combos up to ×{MAX_COMBO}. Misses break it.</li>
                <li className="flex items-center gap-3"><Bug size={16} className="shrink-0 text-[#f87171]" aria-hidden /> Avoid bugs: −{BUG_PENALTY} and your combo resets.</li>
                <li className="flex items-center gap-3"><Clock size={16} className="shrink-0 text-[#facc15]" aria-hidden /> Golden bubbles add +{GOLD_BONUS}s. You have {ROUND}s.</li>
              </ul>
              {best > 0 && (
                <p className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-fg-muted">
                  <Trophy size={15} className="text-[#facc15]" aria-hidden /> Your best: <span className="text-fg">{fmt(best)}</span>
                </p>
              )}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  ref={primaryBtn}
                  type="button"
                  onClick={start}
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 font-semibold text-bg transition-transform active:scale-[0.97]"
                >
                  <Play size={17} aria-hidden /> Start
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-line px-6 text-fg-muted transition-colors hover:text-fg"
                >
                  Back to site
                </button>
              </div>
              <p className="mt-5 font-mono text-[11px] text-fg-subtle">Esc to exit anytime</p>
            </m.div>
          )}

          {phase === "countdown" && (
            <m.p
              key={`count-${count}`}
              className="font-heading text-[8rem] leading-none font-bold text-gradient"
              initial={{ opacity: 0, scale: 1.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              aria-live="assertive"
            >
              {count}
            </m.p>
          )}

          {phase === "over" && result && (
            <m.div
              key="over"
              className="game-panel pointer-events-auto w-full max-w-md rounded-3xl p-7 text-center sm:p-9"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">Time&apos;s up</p>
              <p className="mt-3 font-heading text-6xl font-bold tracking-tight text-fg tabular-nums" aria-live="polite">
                {fmt(result.score)}
              </p>
              {result.isBest ? (
                <m.p
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#facc15]/40 bg-[#facc15]/10 px-3 py-1 text-sm font-medium text-[#fde68a]"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.2 }}
                >
                  <Trophy size={15} aria-hidden /> New personal best!
                </m.p>
              ) : (
                <p className="mt-3 font-mono text-sm text-fg-muted">Best: {fmt(result.best)}</p>
              )}
              <dl className="mt-7 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                {[
                  ["Popped", fmt(result.popped)],
                  ["Max combo", `×${result.maxCombo}`],
                  ["Accuracy", `${result.accuracy}%`],
                  ["Bugs hit", fmt(result.bugs)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-line bg-white/[0.02] p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">{k}</dt>
                    <dd className="mt-1 font-semibold text-fg tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  ref={primaryBtn}
                  type="button"
                  onClick={start}
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 font-semibold text-bg transition-transform active:scale-[0.97]"
                >
                  <RotateCcw size={17} aria-hidden /> Play again
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-line px-6 text-fg-muted transition-colors hover:text-fg"
                >
                  Back to site
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>,
    document.body,
  );
}
