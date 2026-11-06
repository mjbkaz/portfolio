"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { projects, site, type Project } from "@/lib/data";

/* Generated cover for projects without a screenshot. */
function Cover({ project, large = false }: { project: Project; large?: boolean }) {
  const h = project.hue;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, hsl(${h} 70% 45% / 0.55), transparent 55%),
          radial-gradient(90% 80% at 100% 100%, hsl(${(h + 50) % 360} 80% 50% / 0.45), transparent 60%),
          #0b1220`,
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / .08) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-x-6 bottom-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">{project.company}</p>
        <p className={`mt-2 font-heading font-semibold leading-tight text-white ${large ? "text-2xl" : "text-xl"}`}>
          {project.title}
        </p>
      </div>
    </div>
  );
}

function Media({ project, sizes, eager = false }: { project: Project; sizes: string; eager?: boolean }) {
  return project.image ? (
    <Image
      src={project.image}
      alt={`${project.title} screenshot`}
      fill
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className="object-cover"
    />
  ) : (
    <Cover project={project} large />
  );
}

/* Floating preview that follows the cursor on desktop. */
function FloatingPreview({ index }: { index: number | null }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  useEffect(() => {
    const W = 380;
    const H = 260;
    const onMove = (e: PointerEvent) => {
      const px = e.clientX + 28;
      const py = e.clientY - H / 2;
      x.set(Math.min(px, window.innerWidth - W - 16));
      y.set(Math.max(16, Math.min(py, window.innerHeight - H - 100)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  const visible = index !== null;

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-30 hidden h-[260px] w-[380px] overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] lg:block"
      style={{ x: sx, y: sy }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85, rotate: visible ? -2 : -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      {/* Stack of previews; slide to the hovered one */}
      <m.div
        className="h-full w-full"
        initial={false}
        animate={{ y: `${-(index ?? 0) * 100}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
      >
        {projects.map((p) => (
          <div key={p.title} className="relative h-full w-full">
            <Media project={p} sizes="380px" eager />
          </div>
        ))}
      </m.div>
    </m.div>
  );
}

export default function Projects() {
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const nearList = useInView(listRef, { once: true, margin: "400px" });

  return (
    <section id="projects" tabIndex={-1} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="04"
          eyebrow="Projects"
          title="Selected"
          accent="work."
          description="Real-world applications I've built and contributed to. Hover to preview, tap to expand."
        />

        <ul ref={listRef} className="border-t border-line" onPointerLeave={() => setHover(null)}>
          {projects.map((p, i) => {
            const isOpen = open === i;
            return (
              <Reveal as="li" key={p.title} delay={i * 0.04} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`project-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
                  className="group grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-4 py-6 text-left md:gap-8 md:py-8"
                >
                  <span className="font-mono text-xs text-fg-subtle transition-colors group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-2xl font-semibold tracking-tight text-fg transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-4xl lg:text-5xl">
                      <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text transition-colors duration-500 group-hover:text-transparent">
                        {p.title}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm text-fg-muted">{p.company}</span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="hidden max-w-[260px] flex-wrap justify-end gap-1.5 xl:flex">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-fg-muted">
                          {t}
                        </span>
                      ))}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-line text-fg-muted transition-[transform,color,border-color] duration-300 group-hover:border-accent/60 group-hover:text-accent">
                      <Plus size={18} aria-hidden className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                    </span>
                  </span>
                </button>

                {/* Expandable details (works on every device + keyboard) */}
                <div
                  id={`project-${i}`}
                  role="region"
                  aria-label={`${p.title} details`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <div className="grid gap-6 pb-8 md:grid-cols-[1fr_1.1fr] md:pl-12">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line lg:hidden">
                        {isOpen && <Media project={p} sizes="(min-width: 768px) 45vw, 100vw" />}
                      </div>
                      <div>
                        <p className="max-w-xl leading-relaxed text-fg-muted">{p.description}</p>
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech used">
                          {p.tags.map((t) => (
                            <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted">
                              {t}
                            </li>
                          ))}
                        </ul>
                        {p.href && (
                          <a
                            href={p.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                          >
                            Visit project <ArrowUpRight size={16} aria-hidden />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-12 flex justify-center md:justify-end">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="glass inline-flex h-12 items-center gap-2.5 rounded-full px-6 font-medium text-fg transition-colors hover:border-accent/50 hover:text-accent"
          >
            <GithubIcon size={18} />
            More on GitHub
            <ArrowUpRight size={16} aria-hidden />
          </a>
        </Reveal>
      </div>

      <AnimatePresence>{nearList && <FloatingPreview index={hover} />}</AnimatePresence>
    </section>
  );
}
