
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  MapPin,
  Users,
  FileText,
  ShieldCheck,
  Headset,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const facts = [
  {
    title: "Based in Melbourne",
    text: "Local contact, Australian business hours, 3/80 Lloyd Street, Heidelberg Heights VIC.",
    Icon: MapPin,
  },
  {
    title: "One team for everything",
    text: "Website, automation, AI and hosting handled by the same people. No hand-offs between providers.",
    Icon: Users,
  },
  {
    title: "Priced in AUD, in writing",
    text: "You get a written quote with scope, deliverables and timeline before any work starts.",
    Icon: FileText,
  },
  {
    title: "You own your work",
    text: "You keep your domain, content and accounts.",
    Icon: ShieldCheck,
  },
  {
    title: "Support after launch",
    text: "3 months of support included, then an optional monthly managed service.",
    Icon: Headset,
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
  const inView = useInView(ref, {
    once: true,
    amount: 0.15,
    margin: "0px 0px -40px 0px",
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function WhySection() {
  return (
    <section
      id="why"
      className="relative isolate overflow-hidden bg-[#F7F5EF] px-5 py-20 sm:px-8 sm:py-24 lg:px-[6vw] lg:py-32"
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/case/why-ozmo-bg.jpg')",
        }}
      />

      {/* Soft overlay keeps content readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#F7F5EF]/90 md:bg-[#F7F5EF]/45"
      />

      {/* Brand accent shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 -z-10 h-64 w-64 rounded-full bg-[#FBAD1C]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 -z-10 h-80 w-80 rounded-full bg-[#FBAD1C]/15 blur-3xl"
      />

      <div className="mx-auto max-w-[1120px]">
        {/* Centered heading */}
        <Reveal className="mx-auto mb-14 max-w-[760px] text-center md:mb-20">
         

          <h2 className="text-[clamp(2.5rem,6vw,5.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-[#172536]">
            A local team
            <br />
            <span className="text-[#D88900]">
              you can talk to.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-[600px] text-base leading-7 text-[#596575] sm:text-lg sm:leading-8">
            Instead of juggling a web designer, an automation
            freelancer and a hosting company, you deal with one
            team from the first call to long after launch.
          </p>
        </Reveal>

        {/* Main content */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Left: visual panel */}
          <Reveal delay={0.1} className="relative">
            <div className="relative min-h-[280px] overflow-hidden rounded-[28px] border border-white/70 bg-white/55 p-7 shadow-[0_20px_70px_rgba(23,37,54,0.07)] backdrop-blur-md sm:min-h-[330px] sm:p-10">
              <div
                aria-hidden="true"
                className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#FBAD1C]/15"
              />

              <div className="relative flex h-full min-h-[230px] flex-col justify-between sm:min-h-[250px]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#B87500]">
                    Better business, less hassle
                  </span>

                  <h3 className="mt-5 max-w-[360px] text-3xl font-medium leading-tight tracking-[-0.04em] text-[#172536] sm:text-4xl">
                    Your business.
                    <br />
                    Your goals.
                    <br />
                    <span className="text-[#D88900]">
                      One connected team.
                    </span>
                  </h3>
                </div>

                <a
                  href="#start"
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#FBAD1C] px-6 py-4 text-sm font-bold text-[#172536] shadow-[0_8px_24px_rgba(251,173,28,0.22)] transition duration-300 hover:-translate-y-1 hover:bg-[#F5A20A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#172536]"
                >
                  Book a Free Call
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>
          </Reveal>

          {/* Right: benefits list */}
          <div className="rounded-[24px] border border-white/80 bg-white/75 px-5 shadow-[0_20px_70px_rgba(23,37,54,0.06)] backdrop-blur-xl sm:px-8">
            {facts.map((fact, index) => {
              const Icon = fact.Icon;

              return (
                <Reveal key={fact.title} delay={index * 0.07}>
                  <div className="group grid gap-4 border-b border-[#172536]/10 py-6 last:border-b-0 sm:grid-cols-[54px_1fr] sm:items-center sm:gap-5 sm:py-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBAD1C]/15 text-[#C98200] transition duration-300 group-hover:bg-[#FBAD1C] group-hover:text-[#172536] sm:h-[54px] sm:w-[54px]">
                      <Icon size={23} strokeWidth={1.8} />
                    </div>

                    <div>
                      <h3 className="text-base font-semibold tracking-[-0.02em] text-[#172536] sm:text-lg">
                        {fact.title}
                      </h3>

                      <p className="mt-1.5 text-sm leading-6 text-[#596575] sm:text-[15px]">
                        {fact.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
