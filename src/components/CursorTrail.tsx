"use client";

import { useEffect, useRef, useState } from "react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  driftX: number;
  driftY: number;
  hue: number;
  born: number;
}

export default function CursorTrail() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const idRef = useRef(0);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;

    const onMove = (e: PointerEvent) => {
      if (reducedMotion.current) return;

      const last = lastRef.current;
      const dist = last
        ? Math.hypot(e.clientX - last.x, e.clientY - last.y)
        : Infinity;
      lastRef.current = { x: e.clientX, y: e.clientY };

      // Only spawn when the cursor is actually moving.
      if (dist < 10) return;
      if (Math.random() > 0.55) return;

      const size = 6 + Math.random() * 14;
      setBubbles((prev) => [
        ...prev.slice(-45),
        {
          id: idRef.current++,
          x: e.clientX,
          y: e.clientY,
          size,
          driftX: (Math.random() - 0.5) * 30,
          driftY: -20 - Math.random() * 40,
          hue: Math.random() > 0.5 ? 160 : 190, // green ~160, cyan ~190
          born: Date.now(),
        },
      ]);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Remove bubbles after their float animation completes.
  useEffect(() => {
    if (bubbles.length === 0) return;
    const t = setTimeout(() => {
      const cutoff = Date.now() - 1200;
      setBubbles((prev) => prev.filter((b) => b.born > cutoff));
    }, 200);
    return () => clearTimeout(t);
  }, [bubbles]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble-trail absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.x,
            top: b.y,
            border: `1px solid hsla(${b.hue}, 70%, 70%, 0.6)`,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), hsla(${b.hue}, 80%, 60%, 0.15) 40%, transparent 70%)`,
            boxShadow: `0 0 8px hsla(${b.hue}, 80%, 60%, 0.4), inset 0 0 6px hsla(${b.hue}, 80%, 70%, 0.3)`,
            transform: "translate(-50%, -50%)",
            animation: "bubble-trail-rise 1.2s ease-out forwards",
            ["--drift-x" as string]: `${b.driftX}px`,
            ["--drift-y" as string]: `${b.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}
