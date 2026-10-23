"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import HeroForm from "./HeroForm";
import Loop from "./Loop";

const navLinks = [
  { label: "Our Solutions", href: "#solutions" },
  { label: "See It in Action", href: "#action" },
  { label: "How It Works", href: "#how" },
  { label: "Who We Help", href: "#who" },
  { label: "Why OZMO", href: "#why" },
  { label: "FAQs", href: "#faq" },
];

export default function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* backdrop-blur-2xl අයින් කළා: scroll කරන හැම frame එකකම ඒක recompute වෙනවා.
          bg-bg/90 → bg-bg/95 (පෙනුම සමානයි) */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[78px] items-center justify-between border-b border-black/5 bg-bg/95 px-[6vw]">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink"
          onClick={() => setMobileOpen(false)}
          aria-label="OZMO home"
        >
          <span className="block h-3 w-3 rounded-full bg-accent shadow-[0_0_0_5px_rgba(243,181,27,0.2)]" />
          OZMO
        </a>

        <nav
          className={`items-center gap-8 text-sm font-medium text-ink md:flex ${
            mobileOpen
              ? "absolute left-0 right-0 top-[78px] flex flex-col gap-5 border-b border-line bg-surface p-6 text-base shadow-lg"
              : "hidden"
          }`}
        >
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="transition hover:text-accent-deep"
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#start"
          className="hidden items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-ink/90 md:inline-flex"
        >
          <Calendar size={14} />
          Book a Free Call
        </a>

        <button
          className="p-2 text-ink focus:outline-none md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <section
        id="top"
        className="relative grid min-h-[100svh] grid-cols-1 items-center gap-[5vw] overflow-x-clip px-[6vw] pb-[70px] pt-[140px] md:grid-cols-2"
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-bg/90 via-bg/50 to-transparent" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-sand px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-muted">
            <span className="text-base leading-none">🇦🇺</span>
            <span>Melbourne-based digital partner</span>
          </div>

          <h1 className="max-w-[900px] text-[clamp(38px,5vw,76px)] font-normal leading-[1.02] tracking-[-0.035em] text-ink">
            Less admin.
            <br />
            <span className="font-semibold text-accent-deep">
              More time to grow.
            </span>
          </h1>

          <p className="my-6 max-w-[500px] text-base leading-[1.6] text-muted md:text-lg">
            Websites, automation and AI workflows for Australian small
            businesses, built and managed by one team.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-bold text-ink shadow-[0_10px_25px_rgba(243,181,27,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-95 hover:shadow-[0_14px_30px_rgba(243,181,27,0.35)]"
            >
              Book a Free Call <ArrowRight size={16} />
            </a>
            <a
              href="#action"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-surface px-6 py-4 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink/40"
            >
              See how it works
            </a>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted md:text-sm">
            <span className="block h-1.5 w-1.5 rounded-full bg-green-ink" />
            Transparent pricing in AUD · 3 months free support
          </p>
        </div>

        <div className="relative z-10 mt-6 flex items-center md:mt-0">
          <HeroForm />

          {/* backdrop-blur-md අයින් කළා, bg-surface/95 ඇති */}
          <motion.div
            className="absolute -bottom-6 -left-10 z-20 hidden w-[170px] overflow-hidden rounded-2xl border border-line bg-surface/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12)] lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full bg-accent/20" />
            <small className="relative block text-xs font-semibold uppercase tracking-wider text-muted">
              Sample dashboard
            </small>
            <strong className="relative my-1 block text-2xl font-bold text-ink">
              156
            </strong>
            <span className="relative text-xs font-semibold text-green-ink">
              New enquiries ↗
            </span>
            <div className="relative mt-3 flex h-8 items-end gap-1">
              {[15, 30, 22, 55, 40, 75, 95].map((h, i) => (
                <i
                  key={i}
                  className="block w-full rounded-sm bg-accent"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <a
          href="#problems"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-xs font-medium text-muted transition hover:text-ink md:flex"
        >
          Scroll to explore
          <Loop
            animate={{ y: [0, 4, 0] }}
            rest={{ y: 0 }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={14} />
          </Loop>
        </a>
      </section>
    </>
  );
}