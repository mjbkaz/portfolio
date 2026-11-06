"use client";

import { useState } from "react";
import { Check, Copy, LoaderCircle, MapPin, Phone, Send } from "lucide-react";
import Magnetic from "@/components/ui/Magnetic";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { site } from "@/lib/data";

const inputCls =
  "peer h-12 w-full rounded-xl border border-line bg-white/[0.03] px-4 text-fg placeholder:text-fg-subtle/70 transition-colors duration-200 hover:border-line-strong focus:border-accent focus:bg-white/[0.05] focus:outline-none";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    // FormSubmit redirects here after sending (set at submit time; needs window).
    const next = e.currentTarget.elements.namedItem("_next") as HTMLInputElement | null;
    if (next) next.value = `${window.location.origin}/thank-you`;
    setSending(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="contact" tabIndex={-1} className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="05"
          eyebrow="Contact"
          title="Let's build something"
          accent="great together."
          description="Have a project in mind or just want to chat? Drop me a message!"
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Info */}
          <Reveal className="space-y-6 lg:col-span-5">
            <div className="glass rounded-3xl p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">Email</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="font-heading text-xl font-semibold break-all text-fg transition-colors hover:text-accent sm:text-2xl"
                >
                  {site.email}
                </a>
                <Magnetic strength={0.2}>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </Magnetic>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Email address copied to clipboard" : ""}
                </span>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">Phone</p>
                  <a href={site.phone.href} className="mt-2 inline-flex items-center gap-2 text-fg hover:text-accent">
                    <Phone size={16} aria-hidden className="text-accent" /> {site.phone.display}
                  </a>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">Location</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-fg">
                    <MapPin size={16} aria-hidden className="text-accent" /> {site.location}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-2 border-t border-line pt-6">
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <GithubIcon size={18} />
                </a>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-fg-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  <LinkedinIcon size={18} />
                </a>
              </div>
            </div>

            <div className="glass flex items-start gap-3 rounded-3xl p-6">
              <span className="pulse-dot mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
              <div>
                <p className="font-medium text-accent">Available for opportunities</p>
                <p className="mt-1 text-sm text-fg-muted">
                  Open to freelance projects, full-time positions and collaborations.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              action={site.formAction}
              method="POST"
              onSubmit={onSubmit}
              className="glass space-y-5 rounded-3xl p-6 md:p-8"
            >
              {/* FormSubmit config */}
              <input type="hidden" name="_subject" value="New Portfolio Contact!" />
              <input type="hidden" name="_captcha" value="true" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" defaultValue="" />
              <input
                type="hidden"
                name="_autoresponse"
                value={`Thank you for reaching out! I'll get back to you as soon as possible. - ${site.name}`}
              />
              {/* Honeypot */}
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-fg-muted">
                    Name <span className="text-accent">*</span>
                  </label>
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputCls} />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-fg-muted">
                    Email <span className="text-accent">*</span>
                  </label>
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" className={inputCls} />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-fg-muted">
                  Subject <span className="text-accent">*</span>
                </label>
                <input id="subject" name="subject" type="text" required placeholder="What's this about?" className={inputCls} />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-fg-muted">
                  Message <span className="text-accent">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Tell me a bit about your project…"
                  className={`${inputCls} h-auto resize-none py-3`}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="group inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-7 font-semibold text-bg shadow-[0_10px_40px_-12px_rgb(34_197_94/0.7)] transition-[box-shadow,transform,opacity] duration-300 hover:shadow-[0_14px_50px_-8px_rgb(34_197_94/0.8)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
              >
                {sending ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" aria-hidden /> Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <Send
                      size={17}
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                    />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
