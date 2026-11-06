import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-accent">
          <span>{index}</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
          <span className="text-fg-muted">{eyebrow}</span>
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-6xl">
          {title} {accent && <span className="text-gradient">{accent}</span>}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">{description}</p>
        </Reveal>
      )}
    </div>
  );
}
