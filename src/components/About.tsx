import { Briefcase, Gamepad2, GraduationCap, MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ScrollRevealText from "@/components/ui/ScrollRevealText";
import SectionHeading from "@/components/ui/SectionHeading";
import SpotlightGroup from "@/components/ui/SpotlightGroup";
import { aboutStatement, quickFacts, site } from "@/lib/data";

const factIcons = [MapPin, GraduationCap, Briefcase, Gamepad2];

export default function About() {
  return (
    <section id="about" tabIndex={-1} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading index="01" eyebrow="About" title="Developer by trade," accent="gamer at heart." />

        <ScrollRevealText
          text={aboutStatement}
          className="max-w-5xl font-heading text-[1.65rem] leading-[1.3] font-medium tracking-tight text-fg sm:text-3xl md:text-4xl lg:text-[2.6rem]"
        />

        <SpotlightGroup className="mt-16 grid gap-4 md:mt-24 lg:grid-cols-12">
          {/* Quick facts + quote */}
          <div className="grid gap-4 lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {quickFacts.map((fact, i) => {
                const Icon = factIcons[i];
                return (
                  <Reveal key={fact.label} delay={i * 0.06} className="spotlight rounded-3xl p-5 md:p-6">
                    <Icon size={20} className="text-accent" aria-hidden />
                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">{fact.label}</p>
                    <p className="mt-1 font-heading text-lg font-semibold text-fg md:text-xl">{fact.value}</p>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.2} className="spotlight rounded-3xl p-6 md:p-8">
              <blockquote>
                <p className="font-heading text-xl leading-snug text-fg md:text-2xl">
                  &ldquo;In coding, as in gaming — every challenge is just a boss battle waiting to be defeated.&rdquo;
                </p>
                <footer className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">— MJC</footer>
              </blockquote>
            </Reveal>
          </div>

          {/* Terminal */}
          <Reveal delay={0.1} className="spotlight overflow-hidden rounded-3xl lg:col-span-7">
            <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-fg-subtle">~/about-mike.json</span>
            </div>
            <div className="overflow-x-auto p-6 font-mono text-[13px] leading-7 md:p-8 md:text-sm">
              <p>
                <span className="text-accent">❯</span> <span className="text-fg">cat about-mike.json</span>
              </p>
              <div className="mt-2 text-fg-muted">
                <p>{"{"}</p>
                {[
                  ["name", `"${site.name}"`],
                  ["role", `"${site.role}"`],
                  ["location", `"Baguio, Benguet"`],
                  ["email", `"${site.email}"`],
                ].map(([k, v]) => (
                  <p key={k} className="pl-5">
                    <span className="text-accent-2">&quot;{k}&quot;</span>: <span className="text-fg">{v}</span>,
                  </p>
                ))}
                <p className="pl-5">
                  <span className="text-accent-2">&quot;passion&quot;</span>: [
                  <span className="text-[#facc15]">&quot;Web Dev&quot;</span>,{" "}
                  <span className="text-[#f87171]">&quot;Gaming&quot;</span>,{" "}
                  <span className="text-accent-3">&quot;Tech&quot;</span>],
                </p>
                <p className="pl-5">
                  <span className="text-accent-2">&quot;motto&quot;</span>:{" "}
                  <span className="text-accent">&quot;Clean code, clean kills.&quot;</span>
                </p>
                <p>{"}"}</p>
              </div>
              <p className="mt-4">
                <span className="text-accent">❯</span> <span className="text-fg">npm run build --portfolio</span>
              </p>
              <p className="text-fg-muted">
                Building amazing things
                <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-accent" style={{ animation: "blink 1s steps(1) infinite" }} />
              </p>
            </div>
          </Reveal>
        </SpotlightGroup>
      </div>
    </section>
  );
}
