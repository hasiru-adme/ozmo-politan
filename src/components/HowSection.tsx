"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  MessageSquare,
  Users,
  Sparkles,
  Code2,
  Settings2,
  Rocket,
  ArrowRight,
  Check,
  Lock,
  RotateCcw,
} from "lucide-react";
import PlanDownload from "./PlanDownload";

/* ---------------------------------
   STEPS (hama step ekakatama podi "challenge" ekak)
---------------------------------- */

const steps = [
  {
    number: "01",
    title: "Tell us",
    text: "You tell us what's slowing your business down.",
    Icon: MessageSquare,
    question: "What's slowing you down most?",
    options: ["Slow replies", "Too much manual work", "Not enough customers"],
  },
  {
    number: "02",
    title: "Understand",
    text: "We learn how your business actually works.",
    Icon: Users,
    question: "How should we learn about it?",
    options: ["A quick call", "Share our workflow", "Visit and observe"],
  },
  {
    number: "03",
    title: "Plan",
    text: "We design a solution around your real needs.",
    Icon: Sparkles,
    question: "What should the plan focus on?",
    options: ["Website", "Automation", "AI + data"],
  },
  {
    number: "04",
    title: "Build",
    text: "We turn the plan into a working digital system.",
    Icon: Code2,
    question: "How do you want it built?",
    options: ["Fast launch", "Step by step", "Full system"],
  },
  {
    number: "05",
    title: "Manage",
    text: "We keep everything running, secure and up to date.",
    Icon: Settings2,
    question: "What matters most to keep running?",
    options: ["Security", "Updates", "Ongoing support"],
  },
  {
    number: "06",
    title: "Grow",
    text: "We help your digital system grow with your business.",
    Icon: Rocket,
    question: "Where do you want to grow?",
    options: ["More leads", "Save time", "Scale up"],
  },
];

const XP_PER_STEP = 20;
const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------
   WORD BY WORD TEXT ANIMATION
---------------------------------- */

function AnimatedWords({
  text,
  delay = 0,
  className = "",
  duration = 0.5,
  stagger = 0.045,
}: {
  text: string;
  delay?: number;
  className?: string;
  duration?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: false });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 18, filter: "blur(5px)" }
          }
          transition={{ duration, delay: inView ? delay + index * stagger : 0, ease }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

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
      initial={{ opacity: 0, y: 25 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
      transition={{ duration: 0.7, delay: inView ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------
   HOW SECTION (interactive journey)
---------------------------------- */

export default function HowSection() {
  const [current, setCurrent] = useState(0);
  const [choices, setChoices] = useState<(string | null)[]>(Array(steps.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [burst, setBurst] = useState(0); // "+20 XP" animation eka trigger karanna

  const completed = choices.filter(Boolean).length;
  const firstOpen = choices.findIndex((c) => !c);
  const unlocked = firstOpen === -1 ? steps.length - 1 : firstOpen; // dan select karanna puluwan wadima step eka
  const xp = completed * XP_PER_STEP;
  const maxXp = steps.length * XP_PER_STEP;
  const step = steps[current];

  function pick(option: string) {
    const isNew = !choices[current];
    setChoices((prev) => prev.map((c, i) => (i === current ? option : c)));
    if (isNew) {
      setBurst((b) => b + 1);
    }
  }

  function next() {
    if (current < steps.length - 1) setCurrent(current + 1);
    else setShowResult(true);
  }

  function reset() {
    setChoices(Array(steps.length).fill(null));
    setCurrent(0);
    setShowResult(false);
  }

  return (
    <section
      id="how"
      className="relative overflow-hidden bg-bg px-[5vw] py-[90px] md:px-[6vw] md:py-[130px]"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[12%] h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-accent/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto flex max-w-[900px] flex-col items-center text-center">
        {/* =========================
            HEADER (center)
        ========================== */}
        {/* <Reveal>
          <div className="mb-6 flex items-center justify-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 20 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, ease }}
              className="block h-[2px] bg-accent"
            />
            <span>How we work</span>
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 20 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="block h-[2px] bg-accent"
            />
          </div>
        </Reveal> */}

        <AnimatedWords
          text="From problem to progress."
          delay={0.05}
          stagger={0.07}
          duration={0.6}
          className="text-[clamp(42px,6vw,82px)] font-normal leading-[0.95] tracking-[-0.045em]"
        />

        <AnimatedWords
          text="Play through our process. Pick an answer at each step and watch your digital system take shape."
          delay={0.15}
          stagger={0.025}
          duration={0.45}
          className="mt-7 max-w-[620px] text-[15px] leading-[1.7] text-gray-500 md:text-[17px]"
        />

        {/* =========================
            GAME BOARD
        ========================== */}
        <Reveal delay={0.1} className="mt-14 w-full md:mt-16">
          {/* XP bar */}
          <div className="mx-auto mb-14 w-full max-w-[420px]">
            <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.13em] text-gray-500">
              <span>
                Step {Math.min(current + 1, steps.length)} of {steps.length}
              </span>
              <span className="relative">
                {xp} / {maxXp} XP
                <AnimatePresence>
                  {burst > 0 && (
                    <motion.span
                      key={burst}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: [0, 1, 0], y: -22 }}
                      transition={{ duration: 1 }}
                      className="absolute -top-1 right-0 text-accent"
                    >
                      +{XP_PER_STEP} XP
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${(xp / maxXp) * 100}%` }}
                transition={{ duration: 0.6, ease }}
              />
            </div>
          </div>

          {/* Path */}
          <div className="relative mx-auto w-full max-w-[820px]">
            {/* player token (node eken node ekata spring ekakin yanawa) */}
            <div className="pointer-events-none absolute inset-x-0 -top-10 h-8">
              <motion.div
                className="absolute top-0 -translate-x-1/2"
                animate={{ left: `${((current + 0.5) / steps.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 140, damping: 16 }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="grid h-8 w-8 place-items-center rounded-full bg-accent shadow-[0_8px_20px_rgba(243,181,27,0.4)]"
                >
                  <Rocket size={15} />
                </motion.div>
              </motion.div>
            </div>

            {/* lines */}
            <div className="pointer-events-none absolute left-[8.333%] right-[8.333%] top-[22px] h-px bg-[#d8d8d2] md:top-[28px]" />
            <motion.div
              className="pointer-events-none absolute left-[8.333%] right-[8.333%] top-[22px] h-[2px] origin-left bg-accent md:top-[28px]"
              animate={{ scaleX: Math.min(completed, steps.length - 1) / (steps.length - 1) }}
              transition={{ duration: 0.7, ease }}
            />

            <div className="relative grid grid-cols-6">
              {steps.map(({ number, title, Icon }, i) => {
                const done = !!choices[i];
                const isCurrent = i === current;
                const locked = i > unlocked;

                return (
                  <button
                    key={number}
                    type="button"
                    disabled={locked}
                    onClick={() => {
                      setCurrent(i);
                      setShowResult(false);
                    }}
                    aria-label={`${title} step`}
                    className="group flex flex-col items-center gap-2.5 disabled:cursor-not-allowed"
                  >
                    <motion.span
                      whileHover={locked ? undefined : { scale: 1.1, rotate: 4 }}
                      whileTap={locked ? undefined : { scale: 0.95 }}
                      animate={isCurrent ? { scale: 1.12 } : { scale: 1 }}
                      className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border transition-colors duration-300 md:h-14 md:w-14 ${done
                          ? "border-accent bg-accent"
                          : isCurrent
                            ? "border-[#ead89e] bg-[#fff9e7] shadow-[0_8px_30px_rgba(243,181,27,0.25)]"
                            : locked
                              ? "border-[#e2e2dd] bg-white/60 text-gray-300"
                              : "border-[#d7d7d2] bg-white"
                        }`}
                    >
                      {isCurrent && !done && (
                        <motion.span
                          className="absolute inset-0 rounded-full border border-accent"
                          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                        />
                      )}
                      {done ? (
                        <Check size={20} strokeWidth={2.2} />
                      ) : locked ? (
                        <Lock size={16} />
                      ) : (
                        <Icon size={20} strokeWidth={1.7} />
                      )}
                    </motion.span>
                    <span
                      className={`text-[10px] font-semibold md:text-xs ${locked ? "text-gray-300" : isCurrent ? "text-gray-900" : "text-gray-500"
                        }`}
                    >
                      {title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* =========================
            STEP PANEL / RESULT
        ========================== */}
        <div className="mt-12 w-full max-w-[560px]">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={`step-${current}`}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.45, ease }}
                className="rounded-3xl border border-white/70 bg-white/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-8"
              >
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                  Step {step.number}
                </div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-[360px] text-[13px] leading-[1.6] text-gray-500">{step.text}</p>

                <div className="mt-6 text-xs font-semibold text-gray-800">{step.question}</div>

                <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                  {step.options.map((opt) => {
                    const selected = choices[current] === opt;
                    return (
                      <motion.button
                        key={opt}
                        type="button"
                        onClick={() => pick(opt)}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors duration-300 ${selected
                            ? "border-accent bg-accent text-black shadow-[0_8px_20px_rgba(243,181,27,0.25)]"
                            : "border-black/10 bg-white/70 text-gray-700 hover:border-accent/60"
                          }`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {choices[current] && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                      onClick={next}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      className="group mx-auto mt-7 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-xs font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
                    >
                      {current < steps.length - 1 ? "Next step" : "See your system"}
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
                className="relative rounded-3xl border border-white/70 bg-white/60 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-9"
              >
                {/* confetti burst */}
                <div className="pointer-events-none absolute left-1/2 top-12">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const angle = (i / 14) * Math.PI * 2;
                    return (
                      <motion.span
                        key={i}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: Math.cos(angle) * (90 + (i % 3) * 25),
                          y: Math.sin(angle) * (90 + (i % 3) * 25),
                          opacity: 0,
                          scale: 0.4,
                        }}
                        transition={{ duration: 1.1, ease }}
                        className="absolute h-2 w-2 rounded-full bg-accent"
                      />
                    );
                  })}
                </div>

                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent"
                >
                  <Check size={26} />
                </motion.span>

                <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">The result</div>
                <h3 className="mt-2 text-[clamp(24px,3vw,34px)] font-semibold leading-[1.1] tracking-[-0.03em]">
                  One connected system, built around your business.
                </h3>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {steps.map((s, i) => (
                    <motion.span
                      key={s.number}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.4, ease }}
                      className="rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-[14px] font-semibold text-gray-700"
                    >
                      <span className="text-accent">{s.title}:</span> {choices[i]}
                    </motion.span>
                  ))}
                </div>
                <PlanDownload
                  answers={steps.map((s, i) => ({
                    step: s.title,
                    question: s.question,
                    choice: choices[i] ?? "",
                  }))}
                />
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-xs font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5"
                  >
                    Let&apos;s build it
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-3.5 text-xs font-semibold text-gray-700 transition hover:-translate-y-0.5"
                  >
                    <RotateCcw size={14} />
                    Play again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}