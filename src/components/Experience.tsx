import { MapPin } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import SpotlightGroup from "@/components/ui/SpotlightGroup";
import TimelineProgress from "@/components/ui/TimelineProgress";
import { experiences } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" tabIndex={-1} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title="Where I've been"
          accent="shipping."
          description="Professional experience building web applications and solving real-world problems."
        />

        <TimelineProgress>
          <SpotlightGroup>
            <ol className="space-y-12 md:space-y-20">
              {experiences.map((exp) => (
                <li key={exp.company} className="relative grid gap-5 pl-12 md:grid-cols-[230px_1fr] md:gap-12">
                  {/* Rail node */}
                  <span
                    aria-hidden
                    className="absolute top-2 left-[4px] grid h-[15px] w-[15px] place-items-center rounded-full border border-accent/60 bg-bg"
                  >
                    <span className={`h-[7px] w-[7px] rounded-full bg-accent ${exp.current ? "pulse-dot" : ""}`} />
                  </span>

                  {/* Meta (sticky on desktop) */}
                  <Reveal className="md:sticky md:top-28 md:self-start">
                    <p className="font-mono text-sm text-accent">{exp.period}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-fg-muted">
                      <MapPin size={14} aria-hidden /> {exp.location}
                    </p>
                    {exp.current && (
                      <span className="mt-3 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-accent">
                        Current
                      </span>
                    )}
                  </Reveal>

                  {/* Card */}
                  <Reveal delay={0.08} className="spotlight rounded-3xl p-6 md:p-9">
                    <h3 className="font-heading text-2xl font-semibold text-fg md:text-3xl">{exp.role}</h3>
                    <p className="mt-1 font-medium text-gradient">{exp.company}</p>

                    <ul className="mt-6 space-y-3.5">
                      {exp.points.map((point) => (
                        <li key={point} className="flex gap-3 text-[15px] leading-relaxed text-fg-muted">
                          <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/80" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-7 flex flex-wrap gap-2" aria-label="Tech stack">
                      {exp.stack.map((s) => (
                        <li key={s} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-fg-muted">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ol>
          </SpotlightGroup>
        </TimelineProgress>
      </div>
    </section>
  );
}
