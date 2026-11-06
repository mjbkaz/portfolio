"use client";

import { useSyncExternalStore } from "react";

/**
 * Shared state for the Bubble Pop Rush easter egg:
 * - whether the game is open (the bubble nav and cursor trail step aside)
 * - the visitor's personal best (stored only in their browser)
 */
let active = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setGameActive(value: boolean) {
  if (active === value) return;
  active = value;
  if (value) document.documentElement.dataset.game = "on";
  else delete document.documentElement.dataset.game;
  emit();
}

export function useGameActive() {
  return useSyncExternalStore(subscribe, () => active, () => false);
}

const BEST_KEY = "mjc-bubble-pop-best";

export function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function saveBest(score: number) {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    /* storage blocked — best just isn't remembered */
  }
  emit();
}

export function useBestScore() {
  return useSyncExternalStore(subscribe, readBest, () => 0);
}
