"use client";

import { useRef } from "react";

/**
 * One pointer listener for a whole grid: writes --x/--y onto every `.spotlight`
 * child so the light (and border glow) follow the cursor across cards.
 */
export default function SpotlightGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const cards = ref.current.querySelectorAll<HTMLElement>(".spotlight");
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", `${e.clientX - r.left}px`);
      card.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  };

  return (
    <div ref={ref} onPointerMove={onMove} className={`spotlight-group ${className}`}>
      {children}
    </div>
  );
}
