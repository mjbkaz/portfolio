"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * LazyMotion + `m.*` components keeps Motion's bundle small (~15kb instead of ~34kb).
 * reducedMotion="user" makes every Motion animation respect the OS setting.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
