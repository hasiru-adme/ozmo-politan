"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageSquare,
  Users,
  Sparkles,
  Code2,
  Settings2,
  Rocket,
  ArrowRight,
} from "lucide-react";

const flow = [
  {
    number: "01",
    title: "Tell us",
    text: "You tell us what's slowing your business down.",
    Icon: MessageSquare,
  },
  {
    number: "02",
    title: "Understand",
    text: "We learn how your business actually works.",
    Icon: Users,
  },
  {
    number: "03",
    title: "Plan",
    text: "We design a solution around your real needs.",
    Icon: Sparkles,
  },
  {
    number: "04",
    title: "Build",
    text: "We turn the plan into a working digital system.",
    Icon: Code2,
  },
  {
    number: "05",
    title: "Manage",
    text: "We keep everything running, secure and up to date.",
    Icon: Settings2,
  },
  {
    number: "06",
    title: "Grow",
    text: "We help your digital system grow with your business.",
    Icon: Rocket,
  },
];

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

  const inView = useInView(ref, {
    amount: 0.25,
    once: false,
  });

  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block mr-[0.25em]"
          initial={{
            opacity: 0,
            y: 18,
            filter: "blur(5px)",
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                }
              : {
                  opacity: 0,
                  y: 18,
                  filter: "blur(5px)",
                }
          }
          transition={{
            duration,
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

/* ---------------------------------
   SIMPLE REVEAL
---------------------------------- */

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
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0,
              y: 25,
            }
      }
      transition={{
        duration: 0.7,
        delay: inView ? delay : 0,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------
   HOW SECTION
---------------------------------- */

export default function HowSection() {
  return (
    <section
      id="how"
      className="relative overflow-hidden bg-bg px-[5vw] py-[90px] md:px-[6vw] md:py-[130px]"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[12%] h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-accent/[0.035] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">

        {/* =========================
            HEADER
        ========================== */}

        <div className="max-w-[850px]">

          {/* Label */}
          <Reveal>
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: false }}
              transition={{
                duration: 0.6,
                ease,
              }}
              className="mb-6 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500"
            >
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 20 }}
                viewport={{ once: false }}
                transition={{
                  duration: 0.5,
                  ease,
                }}
                className="block h-[2px] bg-accent"
              />

              <span>How we work</span>
            </motion.div>
          </Reveal>

          {/* Main heading - WORD ANIMATION */}
          <AnimatedWords
            text="From problem to progress."
            delay={0.05}
            stagger={0.07}
            duration={0.6}
            className="text-[clamp(42px,6vw,82px)] font-normal leading-[0.95] tracking-[-0.045em]"
          />

          {/* Description - WORD ANIMATION */}
          <AnimatedWords
            text="You don't need to figure out the technology. Tell us what you need, and we'll take care of the journey from idea to implementation and beyond."
            delay={0.15}
            stagger={0.025}
            duration={0.45}
            className="mt-7 max-w-[650px] text-[15px] leading-[1.7] text-gray-500 md:text-[15px]"
          />
        </div>

        {/* =========================
            FLOW
        ========================== */}

        <div className="relative mt-20 md:mt-24">

          {/* Desktop line */}
          <div className="pointer-events-none absolute left-[8%] right-[8%] top-[32px] hidden h-px bg-[#d8d8d2] xl:block" />

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{
              once: false,
              amount: 0.3,
            }}
            transition={{
              duration: 1.3,
              delay: 0.2,
              ease,
            }}
            className="pointer-events-none absolute left-[8%] right-[8%] top-[32px] hidden h-px origin-left bg-accent/40 xl:block"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 xl:gap-3">

            {flow.map(({ number, title, text, Icon }, i) => (
              <Reveal
                key={number}
                delay={i * 0.08}
              >
                <motion.div
                  whileHover={{
                    y: -7,
                  }}
                  transition={{
                    duration: 0.3,
                    ease,
                  }}
                  className="group relative h-full"
                >

                  {/* Mobile connector */}
                  {i !== flow.length - 1 && (
                    <div className="absolute left-[31px] top-[65px] h-[calc(100%+24px)] w-px bg-[#deded8] md:hidden" />
                  )}

                  <div className="relative flex gap-4 md:block">

                    {/* Icon */}
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: 4,
                      }}
                      transition={{
                        duration: 0.3,
                        ease,
                      }}
                      className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-full border border-[#d7d7d2] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition-colors duration-300 group-hover:border-[#ead89e] group-hover:bg-[#fff9e7]"
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.7}
                      />

                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.div>

                    {/* TEXT */}
                    <div className="pt-0 md:pt-6">

                      {/* Number */}
                      <Reveal delay={i * 0.04}>
                        <div className="mb-2 text-[10px] font-bold tracking-[0.15em] text-accent">
                        </div>
                      </Reveal>

                      {/* Title WORD ANIMATION */}
                      <AnimatedWords
                        text={title}
                        delay={0.05}
                        stagger={0.06}
                        duration={0.45}
                        className="text-[17px] font-semibold tracking-[-0.02em] text-gray-900 md:text-[15px]"
                      />

                      {/* Description WORD ANIMATION */}
                      <AnimatedWords
                        text={text}
                        delay={0.12}
                        stagger={0.025}
                        duration={0.4}
                        className="mt-2 max-w-[190px] text-[13px] leading-[1.55] text-gray-500"
                      />

                      {/* Arrow */}
                      <motion.div
                        initial={{
                          opacity: 0,
                          x: -5,
                        }}
                        whileHover={{
                          opacity: 1,
                          x: 0,
                        }}
                        className="mt-4 hidden text-accent md:block"
                      >
                        <ArrowRight size={16} />
                      </motion.div>

                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* =========================
            RESULT
        ========================== */}

        <Reveal delay={0.2}>
          <div className="mt-20 border-t border-[#deded8] pt-10 md:mt-24 md:flex md:items-end md:justify-between">

            <div>

              <AnimatedWords
                text="The result"
                delay={0.05}
                stagger={0.06}
                duration={0.45}
                className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400"
              />

              <AnimatedWords
                text="One connected system, built around your business."
                delay={0.12}
                stagger={0.055}
                duration={0.55}
                className="max-w-[700px] text-[clamp(28px,3.5vw,46px)] leading-[1.05] tracking-[-0.035em]"
              />

            </div>

            <motion.div
              initial={{
                opacity: 0,
                x: -10,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: false,
              }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease,
              }}
              className="mt-7 flex items-center gap-2 text-[12px] font-semibold text-gray-500 md:mt-0"
            >
              <span>Simple from the start</span>

              <motion.span
                animate={{
                  x: [0, 4, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowRight size={15} />
              </motion.span>
            </motion.div>

          </div>
        </Reveal>

      </div>
    </section>
  );
}