"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const audiences = [
  {
    title: "Cleaning businesses",
    text: "Quote requests, bookings, reminders, invoices and review requests, handled in one flow.",
    cta: "See the cleaning workflow",
    href: "#action",
  },
  {
    title: "Tradies and home services",
    text: "Capture job enquiries, follow up quotes and keep customers updated without chasing.",
  },
  {
    title: "Retail and local services",
    text: "A website that brings in enquiries, connected to the tools you already use.",
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2, once: false });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay: inView ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function WhoWeHelpSection() {
  return (
    <section
      id="who"
      className="bg-sand px-[5vw] py-[90px] md:px-[6vw] md:py-[130px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <h2 className="max-w-[800px] text-[clamp(36px,5vw,68px)] font-normal leading-[1] tracking-[-0.04em] text-ink">
            Built for Australian
            <span className="block text-accent-deep">small businesses.</span>
          </h2>
          <p className="mt-6 max-w-[520px] text-base leading-[1.75] text-muted md:text-lg">
            We start with businesses that live on enquiries, quotes and bookings.
          </p>
        </Reveal>

        <ul className="mt-14 divide-y divide-line border-y border-line">
          {audiences.map((a, i) => (
            <li key={a.title}>
              <Reveal
                delay={i * 0.06}
                className="grid items-start gap-3 py-8 md:grid-cols-[0.8fr_1.2fr_auto] md:gap-10"
              >
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-ink">
                  {a.title}
                </h3>
                <p className="max-w-[520px] text-base leading-[1.7] text-muted">
                  {a.text}
                </p>
                {a.href ? (
                  <a
                    href={a.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-ink transition hover:text-accent-deep"
                  >
                    {a.cta} <ArrowRight size={15} />
                  </a>
                ) : (
                  <span />
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}