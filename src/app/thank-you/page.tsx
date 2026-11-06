import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: false },
};

export default function ThankYou() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5">
      <div className="glass w-full max-w-lg rounded-3xl p-10 text-center">
        <div className="reveal-up mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-bg shadow-[0_0_60px_-10px_rgb(34_197_94/0.8)]">
          <Check size={36} strokeWidth={2.5} aria-hidden />
        </div>
        <h1 className="reveal-up mt-8 font-heading text-4xl font-semibold tracking-tight text-fg md:text-5xl" style={{ "--d": "80ms" } as React.CSSProperties}>
          Message <span className="text-gradient">sent.</span>
        </h1>
        <p className="reveal-up mt-4 text-lg text-fg-muted" style={{ "--d": "160ms" } as React.CSSProperties}>
          Thanks for reaching out! I&apos;ll get back to you as soon as possible.
        </p>
        <Link
          href="/"
          className="reveal-up mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-fg px-7 font-semibold text-bg transition-transform active:scale-[0.97]"
          style={{ "--d": "240ms" } as React.CSSProperties}
        >
          <ArrowLeft size={18} aria-hidden /> Back to home
        </Link>
      </div>
    </main>
  );
}
