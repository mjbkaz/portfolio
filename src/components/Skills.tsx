import { Award, Gamepad2 } from "lucide-react";
import Marquee from "@/components/ui/Marquee";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillsCloud from "@/components/ui/SkillsCloud";
import SpotlightGroup from "@/components/ui/SpotlightGroup";
import { certifications, gamerProfile, marqueeTech, skillGroups } from "@/lib/data";

type Group = (typeof skillGroups)[number];

function SkillCard({
  group,
  className = "",
  delay = 0,
  footer,
}: {
  group: Group;
  className?: string;
  delay?: number;
  footer?: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} className={`spotlight flex flex-col rounded-3xl p-6 md:p-7 ${className}`}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: group.color, boxShadow: `0 0 14px ${group.color}` }}
        />
        <h3 className="font-heading text-xl font-semibold text-fg">{group.title}</h3>
      </div>
      <p className="mt-2 text-sm text-fg-muted">{group.blurb}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <li
            key={skill}
            className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-sm text-fg transition-colors duration-200 hover:border-line-strong"
          >
            {skill}
          </li>
        ))}
      </ul>
      {footer}
    </Reveal>
  );
}

export default function Skills() {
  const [frontend, backend, data, workspace] = skillGroups;

  return (
    <section id="skills" tabIndex={-1} className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="03"
          eyebrow="Skills"
          title="A toolkit built for"
          accent="shipping."
          description="Leveled up through real-world projects and continuous learning."
        />

        <SpotlightGroup className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <SkillCard
            group={frontend}
            className="lg:col-span-4 lg:row-span-2"
            footer={
              <div className="mt-8 border-t border-line pt-6 lg:mt-auto">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">Core stack</p>
                <p className="mt-3 font-heading text-2xl leading-tight font-semibold md:text-3xl">
                  <span className="text-gradient">Laravel</span>
                  <span className="text-fg-subtle"> × </span>
                  <span className="text-gradient">React</span>
                  <span className="text-fg-subtle"> × </span>
                  <span className="text-gradient">Inertia</span>
                </p>
              </div>
            }
          />

          {/* Centerpiece: interactive 3D tech cloud */}
          <Reveal
            delay={0.06}
            className="spotlight flex flex-col items-center justify-center rounded-3xl p-6 lg:col-span-4 lg:row-span-2"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">tech stack · drag to spin</p>
            <SkillsCloud />
          </Reveal>

          <SkillCard group={backend} className="lg:col-span-4" delay={0.12} />
          <SkillCard group={data} className="lg:col-span-4" delay={0.16} />
          <SkillCard group={workspace} className="lg:col-span-4" delay={0.04} />

          <Reveal delay={0.08} className="spotlight rounded-3xl p-6 md:p-7 lg:col-span-4">
            <div className="flex items-center gap-3">
              <Award size={20} className="text-[#facc15]" aria-hidden />
              <h3 className="font-heading text-xl font-semibold text-fg">Certifications</h3>
            </div>
            <ul className="mt-6 space-y-3">
              {certifications.map((cert) => (
                <li key={cert} className="flex items-start gap-3 rounded-2xl border border-line bg-white/[0.02] p-3.5 text-sm text-fg">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#facc15]" />
                  {cert}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="spotlight rounded-3xl p-6 md:col-span-2 md:p-7 lg:col-span-4">
            <div className="flex items-center gap-3">
              <Gamepad2 size={20} className="text-accent" aria-hidden />
              <h3 className="font-heading text-xl font-semibold text-fg">Gamer Profile</h3>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              {gamerProfile.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line bg-white/[0.02] p-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle">{stat.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-fg">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </SpotlightGroup>
      </div>

      <div className="mt-20 space-y-2 md:mt-28">
        <Marquee items={marqueeTech} duration={45} />
        <Marquee items={[...marqueeTech].reverse()} reverse duration={55} />
      </div>
    </section>
  );
}
