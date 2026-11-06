"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_STORAGE_KEY, markIntroDone } from "@/lib/intro";

/**
 * ~1.4s code intro that replaces the old 4 MB splash video.
 * The animation is pure CSS (so it starts at first paint and ends even if JS
 * is slow). JS only handles skip-on-click, remembering the visit, and unmounting.
 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const el = ref.current;
    const alreadySeen = document.documentElement.dataset.intro === "seen";

    if (!el || alreadySeen || getComputedStyle(el).display === "none") {
      markIntroDone();
      setMounted(false);
      return;
    }

    const finish = (e?: AnimationEvent) => {
      if (e && (e.target !== el || e.animationName !== "intro-out")) return;
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        /* storage blocked — the intro just plays again next time */
      }
      markIntroDone();
      setMounted(false);
    };

    const skip = () => el.setAttribute("data-skip", "");

    el.addEventListener("animationend", finish);
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });

    // Safety net in case animationend never fires.
    const safety = window.setTimeout(() => finish(), 2600);

    return () => {
      el.removeEventListener("animationend", finish);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.clearTimeout(safety);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={ref} className="intro" aria-hidden>
      <div className="flex flex-col items-center gap-6">
        <svg
          className="intro__glyph h-16 w-20 text-accent drop-shadow-[0_0_24px_rgb(34_197_94/0.6)]"
          viewBox="0 0 60 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path pathLength={1} d="M19 11 6 24l13 13" />
          <path pathLength={1} d="M34 7 26 41" className="text-accent-2" stroke="var(--accent-2)" />
          <path pathLength={1} d="m41 11 13 13-13 13" />
        </svg>
        <p className="intro__name font-mono text-xs uppercase tracking-[0.35em] text-fg-muted">
          Mike Julius Coloma
        </p>
        <div className="h-px w-40 overflow-hidden bg-line">
          <div className="intro__bar h-full w-full bg-gradient-to-r from-accent to-accent-2" />
        </div>
      </div>
    </div>
  );
}
