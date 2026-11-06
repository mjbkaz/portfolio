"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "framer-motion";

/** Vertical timeline rail whose glowing fill tracks scroll progress. */
export default function TimelineProgress({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative">
      <div aria-hidden className="absolute top-3 bottom-3 left-[11px] w-px bg-line" />
      <m.div
        aria-hidden
        className="absolute top-3 bottom-3 left-[11px] w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3 shadow-[0_0_12px_rgb(34_197_94/0.8)]"
        style={{ scaleY }}
      />
      {children}
    </div>
  );
}
