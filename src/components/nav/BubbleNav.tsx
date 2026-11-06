"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, m } from "framer-motion";
import { navItems } from "@/lib/data";
import { useIntroDone } from "@/lib/intro";
import { useGameActive } from "@/lib/game";
import { prefersReducedMotion, scrollToHash } from "@/lib/scroll";

/* ------------------------------------------------------------------ */
/* Types & geometry                                                    */
/* ------------------------------------------------------------------ */

type Mode = "hero" | "dock";

type Body = { x: number; y: number; vx: number; vy: number; s: number; vs: number };

type Dock = {
  base: number; // bubble diameter in the dock
  slot: number; // distance between bubble centers
  pad: number;
  height: number;
  bottom: number;
  width: number;
  cx0: number; // x of the first slot center
  cy: number; // y of slot centers
};

type Geo = { vw: number; vh: number; desktop: boolean; diam: number[]; dock: Dock };

type Drag = {
  i: number;
  id: number;
  sx: number;
  sy: number;
  offX: number;
  offY: number;
  moved: boolean;
  vx: number;
  vy: number;
  lx: number;
  ly: number;
  lt: number;
};

const N = navItems.length;

function computeGeo(): Geo {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;

  const small = vw < 380;
  const base = small ? 40 : 44;
  const slot = small ? 50 : 56;
  const pad = 10;
  const height = base + 18;
  const bottom = 16;
  const width = slot * N + pad * 2;

  const md = Math.round(Math.min(150, Math.max(108, vw * 0.085)));
  const lg = Math.round(md * 1.2);

  return {
    vw,
    vh,
    desktop,
    diam: navItems.map((it) => (desktop ? (it.size === "lg" ? lg : md) : base)),
    dock: {
      base,
      slot,
      pad,
      height,
      bottom,
      width,
      cx0: vw / 2 - width / 2 + pad + slot / 2,
      cy: vh - bottom - height / 2,
    },
  };
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/* ---------------- external stores: viewport geometry + scroll mode ---------------- */

let geoCache: Geo | null = null;
let modeCache: Mode | null = null;

function nextMode(g: Geo, current: Mode | null): Mode {
  if (!g.desktop) return "dock";
  const y = window.scrollY;
  if (y > g.vh * 0.5) return "dock";
  if (y < g.vh * 0.35) return "hero";
  return current ?? "dock"; // hysteresis band
}

function getGeo() {
  if (!geoCache) geoCache = computeGeo();
  return geoCache;
}

function subscribeGeo(onChange: () => void) {
  const handler = () => {
    geoCache = computeGeo();
    onChange();
  };
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}

function getMode(): Mode {
  if (!modeCache) modeCache = nextMode(getGeo(), null);
  return modeCache;
}

function subscribeMode(onChange: () => void) {
  const handler = () => {
    const m = nextMode(getGeo(), modeCache);
    if (m !== modeCache) {
      modeCache = m;
      onChange();
    }
  };
  window.addEventListener("scroll", handler, { passive: true });
  window.addEventListener("resize", handler);
  return () => {
    window.removeEventListener("scroll", handler);
    window.removeEventListener("resize", handler);
  };
}

/** Pop particles around a bubble (plain DOM + WAAPI, no React state). */
function spawnBurst(layer: HTMLElement, x: number, y: number, r: number) {
  for (let k = 0; k < 12; k++) {
    const dot = document.createElement("span");
    dot.className = "burst-dot";
    layer.appendChild(dot);
    const ang = (k / 12) * Math.PI * 2 + Math.random() * 0.4;
    const dist = r + 16 + Math.random() * 28;
    const size = 0.6 + Math.random() * 0.9;
    const anim = dot.animate(
      [
        {
          transform: `translate(${x + Math.cos(ang) * r * 0.8}px, ${y + Math.sin(ang) * r * 0.8}px) scale(${size})`,
          opacity: 1,
        },
        {
          transform: `translate(${x + Math.cos(ang) * dist}px, ${y + Math.sin(ang) * dist}px) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 550 + Math.random() * 250, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    anim.onfinish = () => dot.remove();
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function BubbleNav() {
  const introDone = useIntroDone();
  const gameActive = useGameActive();
  const geo = useSyncExternalStore(subscribeGeo, getGeo, () => null);
  const mode = useSyncExternalStore(subscribeMode, getMode, () => "dock" as Mode);
  const [active, setActive] = useState("home");
  const [tip, setTip] = useState<number | null>(null);

  const els = useRef<(HTMLAnchorElement | null)[]>([]);
  const burstLayer = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const geoRef = useRef<Geo | null>(null);
  const modeRef = useRef<Mode>("dock");
  const introRef = useRef(false);
  const gameRef = useRef(false);
  const reducedRef = useRef(false);
  const pointer = useRef({ x: -9999, y: -9999 });
  const drag = useRef<Drag | null>(null);
  const hoverIdx = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const wake = useRef<() => void>(() => {});

  /* ---------------- physics loop + global listeners ---------------- */
  useEffect(() => {
    reducedRef.current = prefersReducedMotion();
    const g0 = getGeo();
    geoRef.current = g0;
    modeRef.current = getMode();

    // Spawn: desktop bubbles start clustered mid-right, mobile ones below the screen.
    bodies.current = navItems.map((_, i) => ({
      x: g0.desktop ? g0.vw * 0.78 : g0.dock.cx0 + i * g0.dock.slot,
      y: g0.desktop ? g0.vh * 0.52 : g0.vh + 60,
      vx: 0,
      vy: 0,
      s: 0,
      vs: 0,
    }));

    let raf = 0;
    let running = false;
    let last = 0;
    let t = 0;
    let readyMarked = false;

    const step = (now: number) => {
      const g = geoRef.current;
      if (!g) {
        running = false;
        return;
      }
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      t += dt;

      const B = bodies.current;
      const mode = modeRef.current;
      const shown = introRef.current;
      const reduce = reducedRef.current;
      const p = pointer.current;
      const dragI = drag.current?.moved ? drag.current.i : -1;
      const k = g.dock;

      const nearDock =
        mode === "dock" &&
        g.desktop &&
        p.y > k.cy - k.height * 1.4 &&
        Math.abs(p.x - g.vw / 2) < k.width / 2 + 30;

      let settled = true;

      for (let i = 0; i < N; i++) {
        const b = B[i];
        const D = g.diam[i];
        let tx: number;
        let ty: number;
        let ts: number;

        if (mode === "hero") {
          const a = navItems[i].anchor;
          const ph = i * 1.7;
          tx = a.x * g.vw + (reduce ? 0 : Math.sin(t * 0.55 + ph) * 9);
          ty = a.y * g.vh - window.scrollY + (reduce ? 0 : Math.cos(t * 0.45 + ph) * 12);
          // Lean gently toward the cursor.
          if (!reduce && p.x > -999) {
            const dx = p.x - tx;
            const dy = p.y - ty;
            const d = Math.hypot(dx, dy);
            if (d < 260) {
              const f = (1 - d / 260) * 0.22;
              tx += dx * f;
              ty += dy * f;
            }
          }
          ts = hoverIdx.current === i ? 1.07 : 1;
        } else {
          // Dock with macOS-style magnification near the cursor.
          let mag = 1;
          if (nearDock) {
            const dx = p.x - (k.cx0 + i * k.slot);
            mag = 1 + 0.3 * Math.exp(-(dx * dx) / (2 * (k.slot * 0.85) ** 2));
          }
          tx = k.cx0 + i * k.slot;
          ty = k.cy - (mag - 1) * k.base * 0.5;
          ts = (k.base / D) * mag;
        }
        if (!shown || gameRef.current) ts = 0;

        if (i === dragI) {
          // position is driven by the pointer
        } else if (reduce) {
          b.x = tx;
          b.y = ty;
          b.vx = b.vy = 0;
        } else {
          const stiff = mode === "hero" ? 14 : 150;
          const damp = mode === "hero" ? 4.5 : 20;
          b.vx += ((tx - b.x) * stiff - b.vx * damp) * dt;
          b.vy += ((ty - b.y) * stiff - b.vy * damp) * dt;
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        }

        if (reduce) {
          b.s = ts;
          b.vs = 0;
        } else {
          b.vs += ((ts - b.s) * 260 - b.vs * 22) * dt;
          b.s += b.vs * dt;
        }

        if (
          Math.abs(tx - b.x) > 0.3 ||
          Math.abs(ty - b.y) > 0.3 ||
          Math.abs(b.vx) + Math.abs(b.vy) > 2 ||
          Math.abs(ts - b.s) > 0.002 ||
          Math.abs(b.vs) > 0.02
        ) {
          settled = false;
        }
      }

      if (mode === "hero" && !reduce) {
        // Bubble â†” bubble collisions (a dragged bubble acts as infinitely heavy).
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const a = B[i];
            const c = B[j];
            const ra = (g.diam[i] * Math.max(a.s, 0)) / 2;
            const rc = (g.diam[j] * Math.max(c.s, 0)) / 2;
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.01;
            const min = ra + rc + 10;
            if (dist >= min) continue;
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = min - dist;
            const wa = i === dragI ? 0 : j === dragI ? 1 : 0.5;
            const wc = j === dragI ? 0 : i === dragI ? 1 : 0.5;
            a.x -= nx * overlap * wa;
            a.y -= ny * overlap * wa;
            c.x += nx * overlap * wc;
            c.y += ny * overlap * wc;
            const rel = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
            if (rel < 0) {
              const imp = -1.7 * rel;
              a.vx -= nx * imp * wa;
              a.vy -= ny * imp * wa;
              c.vx += nx * imp * wc;
              c.vy += ny * imp * wc;
            }
          }
        }
        // Walls: screen edges, with the top edge moving with the hero.
        const top = -window.scrollY;
        for (let i = 0; i < N; i++) {
          const b = B[i];
          const r = (g.diam[i] * Math.max(b.s, 0)) / 2;
          if (b.x < r) { b.x = r; if (b.vx < 0) b.vx *= -0.6; }
          if (b.x > g.vw - r) { b.x = g.vw - r; if (b.vx > 0) b.vx *= -0.6; }
          if (b.y < top + r) { b.y = top + r; if (b.vy < 0) b.vy *= -0.6; }
          if (b.y > g.vh - r) { b.y = g.vh - r; if (b.vy > 0) b.vy *= -0.6; }
        }
      }

      for (let i = 0; i < N; i++) {
        const el = els.current[i];
        if (!el) continue;
        const b = B[i];
        const D = g.diam[i];
        el.style.transform = `translate3d(${b.x - D / 2}px, ${b.y - D / 2}px, 0) scale(${Math.max(0, b.s)})`;
        if (!readyMarked) el.setAttribute("data-ready", "");
      }
      readyMarked = true;

      const idle = mode === "dock" || reduce;
      if (settled && idle && !drag.current) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(step);
    };

    wake.current = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    wake.current();

    // Hero bubbles follow the page while scrolling.
    const onScroll = () => wake.current();

    const onPointerMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      if (modeRef.current === "dock") {
        const g = geoRef.current;
        if (g && e.clientY > g.dock.cy - g.dock.height * 2) wake.current();
      }
    };
    const onPointerLeave = () => {
      pointer.current.x = -9999;
      pointer.current.y = -9999;
      wake.current();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  /* ---------------- keep the loop in sync with resize / mode changes ---------------- */
  useEffect(() => {
    if (geo) geoRef.current = geo;
    modeRef.current = mode;
    hoverIdx.current = null;
    wake.current();
  }, [geo, mode]);

  /* ---------------- mini-game: nav bubbles pop out, then float back after ---------------- */
  useEffect(() => {
    gameRef.current = gameActive;
    const g = geoRef.current;
    const layer = burstLayer.current;
    if (gameActive && g && layer && !reducedRef.current) {
      bodies.current.forEach((b, i) => {
        if (b.s > 0.2) spawnBurst(layer, b.x, b.y, (g.diam[i] * b.s) / 2);
      });
    }
    wake.current();
  }, [gameActive]);

  /* ---------------- intro gate: bubbles burst in afterwards ---------------- */
  useEffect(() => {
    introRef.current = introDone;
    wake.current();
  }, [introDone]);

  /* ---------------- active section ---------------- */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(en.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const it of navItems) {
      const el = document.getElementById(it.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  /* ---------------- interactions ---------------- */

  const pop = (i: number) => {
    const b = bodies.current[i];
    const g = geoRef.current;
    if (!b || !g) return;
    b.vs -= b.s * 4; // squash, then spring back
    wake.current();

    const layer = burstLayer.current;
    if (reducedRef.current || !layer) return;
    spawnBurst(layer, b.x, b.y, (g.diam[i] * b.s) / 2);
  };

  const onClick = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    if (suppressClick.current) return;
    pop(i);
    scrollToHash(`#${navItems[i].id}`);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLAnchorElement>, i: number) => {
    if (modeRef.current !== "hero" || e.button !== 0 || e.pointerType !== "mouse") return;
    const b = bodies.current[i];
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      i,
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      offX: e.clientX - b.x,
      offY: e.clientY - b.y,
      moved: false,
      vx: 0,
      vy: 0,
      lx: e.clientX,
      ly: e.clientY,
      lt: e.timeStamp,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    if (!d.moved) {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) return;
      d.moved = true;
      els.current[d.i]?.setAttribute("data-dragging", "");
    }
    const now = e.timeStamp;
    const dt = Math.max(1, now - d.lt) / 1000;
    d.vx = d.vx * 0.6 + ((e.clientX - d.lx) / dt) * 0.4;
    d.vy = d.vy * 0.6 + ((e.clientY - d.ly) / dt) * 0.4;
    d.lx = e.clientX;
    d.ly = e.clientY;
    d.lt = now;
    const b = bodies.current[d.i];
    b.x = e.clientX - d.offX;
    b.y = e.clientY - d.offY;
    b.vx = b.vy = 0;
    wake.current();
  };

  const endDrag = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    if (d.moved) {
      const b = bodies.current[d.i];
      const stillAtRelease = e.timeStamp - d.lt > 80;
      b.vx = stillAtRelease ? 0 : clamp(d.vx, -2600, 2600);
      b.vy = stillAtRelease ? 0 : clamp(d.vy, -2600, 2600);
      els.current[d.i]?.removeAttribute("data-dragging");
      // Swallow the click that follows a drag.
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 0);
    }
    drag.current = null;
    wake.current();
  };

  const onEnter = (i: number) => {
    hoverIdx.current = i;
    if (modeRef.current === "dock") setTip(i);
    wake.current();
  };
  const onLeave = () => {
    hoverIdx.current = null;
    setTip(null);
    wake.current();
  };

  /* ---------------- render ---------------- */

  const activeIdx = Math.max(0, navItems.findIndex((it) => it.id === active));
  const dock = geo?.dock;
  const blob = dock ? dock.base + 12 : 56;
  const blobX = dock ? dock.pad + activeIdx * dock.slot + dock.slot / 2 - blob / 2 : 0;
  const showDock = mode === "dock" && introDone && !gameActive;

  return (
    <nav aria-label="Primary" data-mode={mode} inert={gameActive}>
      {/* Gooey filter for the dock's liquid active blob */}
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Dock pill */}
      {dock && (
        <m.div
          aria-hidden
          className="glass pointer-events-none fixed z-40 rounded-full"
          style={{ left: "50%", bottom: dock.bottom, width: dock.width, height: dock.height, x: "-50%" }}
          initial={false}
          animate={showDock ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <div className="absolute inset-0 opacity-50" style={{ filter: "url(#goo)" }}>
            <m.span
              className="absolute top-1/2 left-0 rounded-full bg-gradient-to-br from-accent to-accent-2"
              style={{ width: blob, height: blob, marginTop: -blob / 2 }}
              initial={false}
              animate={{ x: blobX }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
            <m.span
              className="absolute top-1/2 left-0 rounded-full bg-gradient-to-br from-accent to-accent-2"
              style={{ width: blob * 0.7, height: blob * 0.7, marginTop: (-blob * 0.7) / 2, marginLeft: blob * 0.15 }}
              initial={false}
              animate={{ x: blobX }}
              transition={{ type: "spring", stiffness: 110, damping: 16 }}
            />
          </div>
        </m.div>
      )}

      {/* Bubbles */}
      {navItems.map((item, i) => {
        const D = geo?.diam[i] ?? 44;
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            ref={(el) => {
              els.current[i] = el;
            }}
            href={`#${item.id}`}
            className="bubble z-50"
            style={{ width: D, height: D }}
            aria-current={active === item.id ? "location" : undefined}
            data-active={mode === "dock" && active === item.id ? "" : undefined}
            draggable={false}
            onClick={(e) => onClick(e, i)}
            onPointerDown={(e) => onPointerDown(e, i)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerEnter={() => onEnter(i)}
            onPointerLeave={onLeave}
            onFocus={() => onEnter(i)}
            onBlur={onLeave}
          >
            <span className="bubble__glow" />
            <span className="bubble__rim" />
            <span className="bubble__label" style={{ fontSize: Math.round(D * (item.size === "lg" ? 0.15 : 0.16)) }}>
              {item.label}
            </span>
            <Icon className="bubble__icon" size={Math.round(D * 0.42)} strokeWidth={2.3} aria-hidden />
          </a>
        );
      })}

      {/* Dock tooltip */}
      <AnimatePresence>
        {dock && mode === "dock" && tip !== null && (
          <m.div
            key={tip}
            role="presentation"
            className="glass pointer-events-none fixed z-50 rounded-full px-3 py-1 font-mono text-[11px] tracking-wide text-fg"
            style={{ left: dock.cx0 + tip * dock.slot, top: dock.cy - dock.base * 1.25 - 30, x: "-50%" }}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {navItems[tip].label}
          </m.div>
        )}
      </AnimatePresence>

      <div ref={burstLayer} aria-hidden />
    </nav>
  );
}
