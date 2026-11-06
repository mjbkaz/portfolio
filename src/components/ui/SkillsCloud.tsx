"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { iconCloudSlugs } from "@/lib/data";

// The 3D cloud (and its icon fetch) only loads once the tile is near the viewport.
const IconCloud = dynamic(
  () => import("@/components/ui/interactive-icon-cloud").then((mod) => mod.IconCloud),
  { ssr: false, loading: () => <div className="aspect-square w-full" /> },
);

export default function SkillsCloud() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "300px" });

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[340px]">
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(34_197_94/0.18),transparent)]"
      />
      {inView && <IconCloud iconSlugs={iconCloudSlugs} />}
    </div>
  );
}
