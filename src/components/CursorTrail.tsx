"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  hue: number;
};

const MAX_PARTICLES = 48;

/**
 * Bubble cursor trail drawn on one <canvas>.
 * The old version re-rendered React on every mouse move; this one never touches
 * React state, only animates while bubbles exist, and is off on touch devices
 * and for reduced-motion users.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let lastPointer: { x: number; y: number } | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.max) {
          particles.splice(i, 1);
          continue;
        }
        p.vy -= 18 * dt; // bubbles accelerate upwards
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const t = p.life / p.max;
        const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
        const r = p.r * (0.5 + 0.6 * Math.min(1, t * 4));

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${p.hue}, 75%, 68%, ${0.65 * alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${0.08 * alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x - r * 0.35, p.y - r * 0.35, Math.max(0.8, r * 0.22), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.55 * alpha})`;
        ctx.fill();
      }

      if (particles.length) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || document.documentElement.dataset.game) return;
      const prev = lastPointer;
      lastPointer = { x: e.clientX, y: e.clientY };
      if (!prev || Math.hypot(e.clientX - prev.x, e.clientY - prev.y) < 12) return;
      if (Math.random() > 0.5) return;

      if (particles.length >= MAX_PARTICLES) particles.shift();
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 24,
        vy: -12 - Math.random() * 26,
        r: 3 + Math.random() * 6,
        life: 0,
        max: 0.9 + Math.random() * 0.5,
        hue: Math.random() > 0.5 ? 150 : 190,
      });

      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
    />
  );
}
