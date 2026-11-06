"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion, scrollToHash, setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling (skipped for reduced-motion users) plus one global
 * handler for in-page "#anchor" links. We don't use Lenis' own `anchors` option
 * because it ignores preventDefault — which the bubble nav needs so that a
 * drag-and-throw doesn't also count as a click.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null;
    if (!prefersReducedMotion()) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
      setLenis(lenis);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href.length < 2 || !document.getElementById(href.slice(1))) return;
      e.preventDefault();
      scrollToHash(href);
    };
    // Registered after React's root listener, so React handlers run first.
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
