"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

const needs = [
  {
    title: "Get online",
    problem: "Your business needs a stronger digital presence.",
    solution: "Website · E-commerce · Landing page",
  },
  {
    title: "Save time",
    problem: "Too much manual work is slowing your business down.",
    solution: "Automation · Integrations · Workflows",
  },
  {
    title: "Use AI",
    problem: "You know AI can help, but don't know where to start.",
    solution: "AI assistants · Support · Smart tools",
  },
  {
    title: "Grow",
    problem: "You need more leads, visibility and measurable results.",
    solution: "SEO · Analytics · Lead generation",
  },
];

const AUTOPLAY_MS = 3200; // hama card ekakama thiyena welawa
const ease = [0.22, 1, 0.36, 1] as const;

/* --------------------------------
   BLOCK REVEAL
-------------------------------- */

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
    amount: 0.15,
    margin: "0px 0px -80px 0px",
    once: false,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={
        inView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.97 }
      }
      transition={{ duration: 0.8, delay: inView ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------
   WORD BY WORD TEXT
-------------------------------- */

function AnimatedWords({
  children,
  className = "",
  delay = 0,
  stagger = 0.055,
}: {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: false });
  const words = children.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-[0.22em] inline-block"
          initial={{ opacity: 0, y: 22, filter: "blur(7px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 22, filter: "blur(7px)" }
          }
          transition={{
            duration: 0.65,
            delay: inView ? delay + index * stagger : 0,
            ease,
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function CardText({
  children,
  className = "",
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  const words = children.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-[0.2em] inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, delay: inView ? delay + index * 0.025 : 0, ease }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

/* --------------------------------
   NEED CARD
   on = selected nathnam autoplay eken highlight wela inna card eka
-------------------------------- */

function NeedCard({
  title,
  problem,
  solution,
  isSelected,
  isActive,
  hasSelection,
  onToggle,
}: {
  title: string;
  problem: string;
  solution: string;
  isSelected: boolean;
  isActive: boolean;
  hasSelection: boolean;
  onToggle: () => void;
}) {
  const on = isSelected || isActive;

  const mx = useMotionValue(-300);
  const my = useMotionValue(-300);
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mx}px ${my}px, rgba(243,181,27,0.22), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  }

  const chips = solution.split(" · ");

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      onMouseMove={onMove}
      animate={{
        opacity: hasSelection && !isSelected ? 0.42 : 1,
        y: isSelected ? -8 : isActive ? -6 : 0,
        scale: isSelected ? 1.02 : 1,
      }}
      whileHover={{ y: -10 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.5, ease }}
      className={`group relative flex min-h-[390px] w-full flex-col overflow-hidden rounded-[28px] border p-7 text-left outline-none transition-[background,border-color,box-shadow] duration-700 focus-visible:ring-2 focus-visible:ring-accent ${
        on
          ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_30px_80px_rgba(0,0,0,0.2)]"
          : "border-neutral-200 bg-[#fafaf8] hover:border-neutral-900 hover:bg-neutral-900 hover:text-white hover:shadow-[0_30px_70px_rgba(0,0,0,0.16)]"
      }`}
    >
      {/* autoplay: moving yellow aurora, active card athule hemin sanchalanaya wenawa */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent blur-3xl"
        animate={
          on
            ? { opacity: 0.28, x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }
            : { opacity: 0 }
        }
        transition={
          on
            ? { duration: 5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.6 }
        }
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-accent blur-3xl"
        animate={
          on
            ? { opacity: 0.16, x: [0, 40, 0], y: [0, -40, 0] }
            : { opacity: 0 }
        }
        transition={
          on
            ? { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.6 }
        }
      />

      {/* cursor follow spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: spotlight }}
      />

      {/* shimmer sweep: autoplay card eka active wenakota ekak yanawa */}
      {isActive && !isSelected && (
        <motion.span
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ left: "-40%" }}
          animate={{ left: "140%" }}
          transition={{ duration: 1.3, ease: "easeInOut", delay: 0.2 }}
        />
      )}
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-[1100ms] ease-out group-hover:left-[130%] group-hover:opacity-100" />

      {/* selected pulse ring */}
      {isSelected && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-accent"
          animate={{ opacity: [0.7, 0], scale: [1, 1.05] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* top line: selected = full, autoplay = timer ekak widiyata fill wenawa */}
      <div className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden">
        {isSelected ? (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, ease }}
            className="h-full origin-left bg-accent"
          />
        ) : isActive ? (
          <motion.div
            key="timer"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
            className="h-full origin-left bg-accent"
          />
        ) : null}
      </div>

      {/* TITLE */}
      <div className="relative mt-2">
        <CardText
          delay={0.05}
          className={`text-[36px] font-medium leading-none tracking-[-0.04em] transition-colors duration-500 ${
            on ? "text-white" : "text-neutral-900 group-hover:text-white"
          }`}
        >
          {title}
        </CardText>

        <span
          className={`mt-4 block h-[3px] w-14 origin-left rounded-full bg-accent transition-transform duration-500 ease-out ${
            on ? "scale-x-100" : "scale-x-[0.35] group-hover:scale-x-100"
          }`}
        />

        <CardText
          delay={0.18}
          className={`mt-6 max-w-[250px] text-[13px] md:text-[15px] leading-[1.65] transition-colors duration-500 ${
            on ? "text-neutral-400" : "text-neutral-500 group-hover:text-neutral-400"
          }`}
        >
          {problem}
        </CardText>
      </div>

      {/* BOTTOM */}
      <div className="relative mt-auto pt-8">
        <div className="mb-5 flex flex-wrap gap-2">
          {chips.map((chip, j) => (
            <span
              key={chip}
              style={{ transitionDelay: `${j * 70}ms` }}
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] transition-all duration-500 ${
                on
                  ? "-translate-y-1 border-accent/60 bg-accent/10 text-accent"
                  : "border-neutral-200 bg-white text-neutral-500 group-hover:-translate-y-1 group-hover:border-accent/60 group-hover:bg-accent/10 group-hover:text-accent"
              }`}
            >
              {chip}
            </span>
          ))}
        </div>

        <div
          className={`flex items-center justify-between border-t pt-5 transition-colors duration-500 ${
            on ? "border-white/10" : "border-neutral-200 group-hover:border-white/10"
          }`}
        >
          <motion.span
            initial={false}
            animate={{ x: isSelected ? 3 : 0 }}
            className={`text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-500 ${
              on ? "text-white" : "text-neutral-700 group-hover:text-white"
            }`}
          >
            {isSelected ? "Let's solve this" : "Explore solution"}
          </motion.span>

          <motion.span
            animate={{ x: isSelected ? 4 : 0, y: isSelected ? -4 : 0 }}
            transition={{ duration: 0.35, ease }}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 group-hover:rotate-45 ${
              on
                ? "border-accent bg-accent"
                : "border-neutral-200 bg-white group-hover:border-accent group-hover:bg-accent"
            }`}
          >
            {isSelected ? (
              <Check size={15} className="text-neutral-900" />
            ) : (
              <ArrowUpRight
                size={16}
                className={on ? "text-neutral-900" : "text-neutral-700 group-hover:text-neutral-900"}
              />
            )}
          </motion.span>
        </div>
      </div>
    </motion.button>
  );
}

/* --------------------------------
   MAIN
-------------------------------- */

export default function NeedsSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [active, setActive] = useState(0); // autoplay eken highlight wena card eka
  const [paused, setPaused] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { amount: 0.3 });

  // auto play: card 4 eka eka highlight wenawa. hover / select karoth pause wenawa
  const running = gridInView && !paused && selected === null;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % needs.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [running]);

  return (
    <section
      id="needs"
      className="relative overflow-hidden bg-white px-[5vw] py-[100px] md:px-[6vw] md:py-[140px]"
    >
      {/* floating ambient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-24 top-10 h-[360px] w-[360px] rounded-full bg-accent/[0.08] blur-[110px]"
        />
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-24 bottom-10 h-[300px] w-[300px] rounded-full bg-accent/[0.06] blur-[100px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px]">
        {/* ================= HEADER ================= */}
        <Reveal>
          {/* <div className="mb-5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 20 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease }}
              className="block h-[2px] bg-accent"
            />
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
            >
              Start with your problem
            </motion.span>
          </div> */}

          <div className="max-w-[900px]">
            <AnimatedWords
              delay={0.1}
              stagger={0.065}
              className="text-[clamp(40px,5vw,72px)] font-normal leading-[0.98] tracking-[-0.04em] text-neutral-900"
            >
              What does your business
            </AnimatedWords>

            <AnimatedWords
              delay={0.42}
              stagger={0.07}
              className="text-[clamp(40px,5vw,72px)] font-normal leading-[0.98] tracking-[-0.04em] text-[#a57950]"
            >
              need right now?
            </AnimatedWords>

            <AnimatedWords
              delay={0.72}
              stagger={0.025}
              className="mt-7 max-w-[560px] text-[14px] leading-[1.7] text-neutral-500 md:text-[18px]"
            >
              You don't need to understand the technology. Just tell us what is making your business harder. We'll help you find the right solution.
            </AnimatedWords>
          </div>
        </Reveal>

        {/* ================= CARDS ================= */}
        <div
          ref={gridRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {needs.map(({ title, problem, solution }, i) => (
            <Reveal key={title} delay={i * 0.1} className="h-full">
              <NeedCard
                title={title}
                problem={problem}
                solution={solution}
                isSelected={selected === title}
                isActive={running && active === i}
                hasSelection={selected !== null}
                onToggle={() => setSelected(selected === title ? null : title)}
              />
            </Reveal>
          ))}
        </div>

        {/* autoplay dots (indicator) */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {needs.map(({ title }, i) => (
            <button
              key={title}
              type="button"
              aria-label={`Show ${title}`}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                running && active === i ? "w-8 bg-accent" : "w-1.5 bg-neutral-300"
              }`}
            />
          ))}
        </div>

        {/* ================= SELECTED MESSAGE ================= */}
        <motion.div
          initial={false}
          animate={{
            height: selected ? "auto" : 0,
            opacity: selected ? 1 : 0,
            marginTop: selected ? 32 : 0,
          }}
          transition={{ duration: 0.5, ease }}
          className="overflow-hidden"
        >
          <div className="rounded-[20px] border border-neutral-200 bg-[#fafaf8] p-5 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <AnimatedWords
                  delay={0.05}
                  stagger={0.035}
                  className="text-[10px] font-bold uppercase tracking-[0.14em] text-accent"
                >
                  Your starting point
                </AnimatedWords>

                <AnimatedWords
                  delay={0.18}
                  stagger={0.02}
                  className="mt-2 max-w-[650px] text-[14px] leading-[1.6] text-neutral-600"
                >
                  Tell us more about this challenge and we'll map out the right digital solution for your business.
                </AnimatedWords>
              </div>

              <a
                href="#contact"
                className="group inline-flex shrink-0 items-center gap-3 text-[14px] font-bold uppercase tracking-[0.12em] text-neutral-900"
              >
                Continue
                <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowUpRight size={15} />
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}