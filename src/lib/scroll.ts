import type Lenis from "lenis";

/** Shared Lenis instance (null when reduced motion is on or before mount). */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Smoothly scroll to "#id", update the URL and move focus for screen readers. */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = document.getElementById(id);
  if (!el) return;

  const focus = () => el.focus({ preventScroll: true });

  if (lenis) {
    lenis.scrollTo(el, { duration: 1.2, onComplete: focus });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    focus();
  }
  history.replaceState(null, "", id === "home" ? " " : `#${id}`);
}

/** Jump to the top and freeze scrolling (used while the mini-game is open). */
export function lockScroll() {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
    lenis.stop();
  } else {
    window.scrollTo(0, 0);
  }
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  document.documentElement.style.overflow = "";
  lenis?.start();
}

export function scrollToTop() {
  scrollToHash("#home");
}
