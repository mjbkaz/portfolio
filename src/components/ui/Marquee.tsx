/** Infinite CSS marquee. The duplicate track is hidden from screen readers. */
export default function Marquee({
  items,
  reverse = false,
  duration = 40,
}: {
  items: readonly string[];
  reverse?: boolean;
  duration?: number;
}) {
  const track = (hidden: boolean) => (
    <ul className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 whitespace-nowrap font-heading text-2xl font-medium text-fg-muted/80 md:text-4xl"
        >
          <span className="h-2 w-2 rounded-full bg-gradient-to-br from-accent to-accent-2" />
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="marquee py-3"
      data-reverse={reverse || undefined}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
    >
      {track(false)}
      {track(true)}
    </div>
  );
}
