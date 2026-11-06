import { ArrowUpRight, Hand, Mail } from "lucide-react";
import PlayButton from "@/components/game/PlayButton";
import Magnetic from "@/components/ui/Magnetic";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { site } from "@/lib/data";

/* Gradient stops for the per-letter coloring of the surname. */
const STOPS = [
  [34, 197, 94],
  [6, 182, 212],
  [129, 140, 248],
];

function mix(t: number) {
  const seg = t * (STOPS.length - 1);
  const i = Math.min(Math.floor(seg), STOPS.length - 2);
  const f = seg - i;
  const [a, b] = [STOPS[i], STOPS[i + 1]];
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(" ")})`;
}

function SplitWords({ text, start, gradient }: { text: string; start: number; gradient?: boolean }) {
  const total = text.replace(/ /g, "").length;
  let n = 0;
  return (
    <span className="block" aria-hidden>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-top last:mr-0">
          {word.split("").map((ch) => {
            const idx = n++;
            return (
              <span
                key={idx}
                className="letter"
                style={
                  {
                    "--i": start + idx,
                    color: gradient ? mix(total > 1 ? idx / (total - 1) : 0) : undefined,
                  } as React.CSSProperties
                }
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Hero() {
  return (
    <section
      id="home"
      tabIndex={-1}
      className="relative flex min-h-dvh items-center overflow-hidden pt-24 pb-36 lg:pb-24"
    >
      {/* Decorative bubbles for small screens (the nav lives in the dock there) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden">
        <span className="deco-bubble left-[5%] top-[7%] h-14 w-14" style={{ animationDelay: "-2s" }} />
        <span className="deco-bubble right-[6%] top-[11%] h-20 w-20" />
        <span className="deco-bubble bottom-[20%] left-[10%] h-10 w-10" style={{ animationDelay: "-4s" }} />
        <span className="deco-bubble bottom-[26%] right-[12%] h-12 w-12" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-[52vw] lg:text-left">
          <p
            className="reveal-up inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
            style={d(0)}
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
            Available for opportunities
          </p>

          <h1
            aria-label={site.name}
            className="mt-7 font-heading text-[clamp(3.1rem,7vw,7.25rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-fg"
          >
            <SplitWords text="Mike Julius" start={0} />
            <SplitWords text="Coloma" start={10} gradient />
          </h1>

          <p
            className="reveal-up mx-auto mt-7 max-w-xl text-lg leading-relaxed text-fg-muted md:text-xl lg:mx-0"
            style={d(420)}
          >
            Web developer building fast, interactive products with{" "}
            <span className="sr-only">Laravel, React.js, Inertia.js and Tailwind CSS.</span>
            <span className="rotator font-medium text-fg" aria-hidden>
              <span>Laravel.</span>
              <span>React.js.</span>
              <span>Inertia.js.</span>
              <span>Tailwind CSS.</span>
              <span>Laravel.</span>
            </span>
          </p>

          <div
            className="reveal-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            style={d(540)}
          >
            <Magnetic>
              <a
                href="#projects"
                className="group inline-flex h-13 items-center gap-2 rounded-full bg-fg px-7 font-semibold text-bg shadow-[0_10px_40px_-10px_rgb(34_197_94/0.6)] transition-[box-shadow,transform] duration-300 hover:shadow-[0_14px_50px_-8px_rgb(34_197_94/0.8)] active:scale-[0.97]"
              >
                View my work
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 ease-out-expo group-hover:rotate-45"
                />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="glass inline-flex h-13 items-center rounded-full px-7 font-semibold text-fg transition-colors duration-300 hover:border-accent/50 hover:text-accent active:scale-[0.97]"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>

          <ul
            className="reveal-up mt-10 flex items-center justify-center gap-2 lg:justify-start"
            style={d(640)}
          >
            {[
              { href: site.github, label: "GitHub", icon: <GithubIcon size={20} /> },
              { href: site.linkedin, label: "LinkedIn", icon: <LinkedinIcon size={20} /> },
              { href: `mailto:${site.email}`, label: "Email", icon: <Mail size={20} aria-hidden /> },
            ].map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full text-fg-muted transition-colors duration-200 hover:bg-white/5 hover:text-accent"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>

          <div className="reveal-up mt-8 flex justify-center lg:justify-start" style={d(760)}>
            <PlayButton />
          </div>
        </div>
      </div>

      {/* Desktop-only: invite people to play with the bubbles */}
      <p
        className="reveal-up pointer-events-none absolute right-12 bottom-10 hidden items-center gap-2 font-mono text-xs text-fg-subtle lg:flex"
        style={d(1400)}
      >
        <Hand size={14} aria-hidden />
        psst — the bubbles are draggable. Throw one.
      </p>

      <a
        href="#about"
        aria-label="Scroll to About"
        className="reveal-up absolute bottom-10 left-12 hidden items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle transition-colors hover:text-accent lg:flex"
        style={d(1000)}
      >
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <span
            className="absolute inset-0 bg-accent"
            style={{ animation: "scroll-line 2.2s cubic-bezier(0.65,0,0.35,1) infinite" }}
          />
        </span>
        Scroll
      </a>
    </section>
  );
}
