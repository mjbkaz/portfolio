"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max 3D tilt in degrees (0 disables tilt). */
  tilt?: number;
  /** Show the glass glare sweep that follows the cursor. */
  glare?: boolean;
  /** Disable the scroll reveal animation. */
  noReveal?: boolean;
  /** Extra delay for staggered reveals. */
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  tilt = 8,
  glare = true,
  noReveal = false,
  delay = 0,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position in pixels relative to the card center.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [tilt, -tilt]), {
    stiffness: 260,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-tilt, tilt]), {
    stiffness: 260,
    damping: 18,
  });

  // Glare position (percentages) follows the cursor.
  const glareX = useTransform(mx, [-0.5, 0.5], [20, 80]);
  const glareY = useTransform(my, [-0.5, 0.5], [20, 80]);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]: number[]) =>
      `radial-gradient(280px circle at ${x}% ${y}%, rgba(34,197,94,0.10) 0%, rgba(6,182,212,0.06) 30%, transparent 65%)`
  );

  function handleMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  const reveal = noReveal
    ? undefined
    : {
        initial: { opacity: 0, y: 40, scale: 0.96 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: {
          type: "spring" as const,
          stiffness: 120,
          damping: 16,
          delay,
        },
      };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      {...reveal}
      className={`relative overflow-hidden rounded-xl bg-[#1A2332] border border-[#475569]/20 hover:border-[#22C55E]/30 transition-colors duration-300 ${className}`}
    >
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: glareBackground }}
        />
      )}
      <div className="relative z-0">{children}</div>
    </motion.div>
  );
}
