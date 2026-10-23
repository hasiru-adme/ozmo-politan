"use client";

import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

const ABN = ""; // e.g. "12 345 678 901" — oyage sathya ABN eka

const contact = [
  {
    Icon: MapPin,
    text: "3/80 Lloyd Street, Heidelberg Heights, VIC 3081",
    href: "https://maps.google.com/?q=3/80+Lloyd+Street,+Heidelberg+Heights,+VIC+3081",
  },
  { Icon: Phone, text: "+61 40 60 79 247", href: "tel:+61406079247" },
  { Icon: Mail, text: "roshan@adme.group", href: "mailto:roshan@adme.group" },
];

const links = [
  { label: "Our Solutions", href: "/#solutions" },
  { label: "How It Works", href: "/#how" },
  { label: "Who We Help", href: "/#who" },
  { label: "Why OZMO", href: "/#why" },
  { label: "FAQs", href: "/#faq" },
  { label: "IoT & Electronics", href: "/iot" },
];

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white/70">
      <div className="px-5 pb-10 pt-16 sm:px-[5vw] sm:pt-20 md:px-[6vw] md:pb-14 md:pt-[110px]">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.1fr_0.9fr] md:gap-[8vw] md:pb-16">
          <div>
            <a
              href="#top"
              className="mb-6 inline-flex items-center gap-2.5 text-white"
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_0_5px_rgba(243,181,27,0.14)]" />
              <b className="text-base tracking-[0.02em]">OZMO</b>
            </a>

            <h3 className="max-w-[440px] text-[clamp(28px,3.2vw,44px)] font-normal leading-[1.08] tracking-[-0.03em] text-white">
              We simplify the way your business works.
            </h3>

            <a
              href="#start"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-4 text-sm font-bold text-ink shadow-[0_10px_25px_rgba(243,181,27,0.18)] transition hover:-translate-y-0.5 hover:brightness-95"
            >
              Book a Free Call <ArrowRight size={17} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-8">
            <div>
              <div className="mb-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.13em] text-white/60">
                <span className="block h-0.5 w-4 shrink-0 bg-accent" />
                Get in touch
              </div>
              <ul className="flex flex-col gap-4">
                {contact.map(({ Icon, text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="group flex items-start gap-3 text-sm leading-[1.5] text-white/70 transition-colors hover:text-white"
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                        className="mt-0.5 shrink-0 text-white/50 transition-colors group-hover:text-accent"
                      />
                      <span>{text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-5 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.13em] text-white/60">
                <span className="block h-0.5 w-4 shrink-0 bg-accent" />
                Explore
              </div>
              <ul className="flex flex-col gap-4">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <span>© 2026 Ozmo. All rights reserved.</span>
            {ABN && <span>ABN {ABN}</span>}
          </div>

          <nav aria-label="Legal" className="flex gap-5">
            {legal.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}