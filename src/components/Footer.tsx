"use client";

import { ArrowUp } from "lucide-react";
import { navItems, site } from "@/lib/data";
import { scrollToHash, scrollToTop } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 pb-32 md:pb-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-fg-subtle">Navigate</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {navItems.slice(1).map((it) => (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash(`#${it.id}`);
                    }}
                    className="text-fg-muted transition-colors hover:text-accent"
                  >
                    {it.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex h-12 w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-5 text-sm text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
          >
            Back to top
            <ArrowUp size={16} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Giant wordmark */}
        <p
          aria-hidden
          className="mt-16 bg-gradient-to-b from-white/[0.14] to-transparent bg-clip-text text-center font-heading text-[clamp(4rem,17vw,15rem)] leading-[0.85] font-bold tracking-[-0.05em] text-transparent select-none"
        >
          Coloma
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-sm text-fg-subtle md:flex-row">
          <p suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {site.name}
          </p>
          <p>Built with Next.js, Tailwind CSS &amp; Motion</p>
        </div>
      </div>
    </footer>
  );
}
