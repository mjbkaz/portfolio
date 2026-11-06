import { ImageResponse } from "next/og";
import { site } from "@/lib/data";

// Social share card, generated at build time (shown when the link is shared).
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#f1f5f9",
          background:
            "radial-gradient(60% 80% at 0% 0%, rgba(34,197,94,0.35), transparent 60%), radial-gradient(60% 80% at 100% 0%, rgba(6,182,212,0.3), transparent 60%), radial-gradient(70% 60% at 60% 120%, rgba(129,140,248,0.25), transparent 60%), #070b14",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#22c55e" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#22c55e" }} />
          Available for opportunities
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Mike Julius</div>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1.05,
              backgroundImage: "linear-gradient(90deg, #22c55e, #06b6d4, #818cf8)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Coloma
          </div>
          <div style={{ marginTop: 28, fontSize: 34, color: "#9fb0c6" }}>
            Web Developer · Laravel · React.js · Inertia.js
          </div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          {[150, 110, 80].map((s, i) => (
            <div
              key={i}
              style={{
                width: s / 2,
                height: s / 2,
                borderRadius: 999,
                border: "2px solid rgba(255,255,255,0.25)",
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), rgba(6,182,212,0.25) 45%, rgba(10,16,30,0.6) 75%)",
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
