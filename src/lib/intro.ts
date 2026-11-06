"use client";

import { useSyncExternalStore } from "react";

export { INTRO_STORAGE_KEY } from "./intro-boot";

/**
 * Tiny global store for "the intro overlay has finished".
 * The bubble nav waits for it so the bubbles can burst in after the intro.
 */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
