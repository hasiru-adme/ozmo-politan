"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Settings2,
  Sparkles,
  Rocket,
  ArrowUpRight,
} from "lucide-react";

const why = [
  {
    number: "01",
    t: "Build",
    d: "We create your digital foundation.",
    Icon: Code2,
  },
  {
    number: "02",
    t: "Manage",
    d: "We keep everything running.",
    Icon: Settings2,
  },
  {
    number: "03",
    t: "Improve",
    d: "We continuously improve your system.",
    Icon: Sparkles,
  },
  {
    number: "04",
    t: "Grow",
    d: "We help your digital presence generate more value.",
    Icon: Rocket,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------
   WORD BY WORD
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
          className="mr-[0.25em] inline-block"
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
   REVEAL
---------------------------------- */

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
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
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              y: 0,
            }
          : {
              opacity: 0,
              y: 30,
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
   WHY SECTION
---------------------------------- */

export default function WhySection() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-bg px-[5vw] py-[100px] md:px-[6vw] md:py-[130px]"
    >
      {/* =================================
          AMBIENT BACKGROUND
      ================================= */}

      <div className="pointer-events-none absolute right-[-180px] top-[10%] h-[420px] w-[420px] rounded-full border border-black/[0.04]" />

      <div className="pointer-events-none absolute right-[-120px] top-[18%] h-[300px] w-[300px] rounded-full border border-black/[0.035]" />

      <div className="pointer-events-none absolute left-[20%] top-[35%] h-[300px] w-[300px] rounded-full bg-accent/[0.025] blur-[120px]" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[8vw]">

          {/* =================================
              LEFT
          ================================= */}

          <Reveal>
            <div className="lg:sticky lg:top-28">

              {/* Label */}

              {/* <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
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
                  ease,
                }}
                className="mb-6 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.13em] text-gray-500"
              >
                <motion.span
                  initial={{
                    width: 0,
                  }}
                  whileInView={{
                    width: 20,
                  }}
                  viewport={{
                    once: false,
                  }}
                  transition={{
                    duration: 0.5,
                    ease,
                  }}
                  className="block h-[2px] bg-accent"
                />

                <span>Why businesses choose us</span>
              </motion.div> */}

              {/* Main heading */}

              <AnimatedWords
                text="One team."
                delay={0.05}
                stagger={0.07}
                duration={0.6}
                className="text-[clamp(44px,5.5vw,82px)] font-normal leading-[0.94] tracking-[-0.045em]"
              />

              <AnimatedWords
                text="One relationship."
                delay={0.18}
                stagger={0.07}
                duration={0.6}
                className="text-[clamp(44px,5.5vw,82px)] font-normal leading-[0.94] tracking-[-0.045em] text-[#a57950]"
              />

              {/* Description */}

              <AnimatedWords
                text="Instead of managing multiple providers, you get one experienced team that can build, manage, improve and grow your digital presence."
                delay={0.2}
                stagger={0.025}
                duration={0.42}
                className="mt-8 max-w-[430px] text-sm leading-7 text-gray-500  md:text-[18px]"
              />

              {/* Bottom statement */}

              <Reveal delay={0.3}>
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: false,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.2,
                    ease,
                  }}
                  className="mt-10 flex items-center gap-3 text-xs font-semibold"
                >
                  <motion.span
                    whileHover={{
                      y: 3,
                    }}
                    transition={{
                      duration: 0.25,
                      ease,
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line"
                  >
                    ↓
                  </motion.span>

                  <AnimatedWords
                    text="One partner from start to scale"
                    delay={0.1}
                    stagger={0.025}
                    duration={0.4}
                    className="text-gray-500"
                  />
                </motion.div>
              </Reveal>
            </div>
          </Reveal>

          {/* =================================
              RIGHT — 2x2 GRID
          ================================= */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {why.map(({ number, t, d, Icon }, i) => (
              <Reveal key={t} delay={i * 0.08}>
                <motion.div
                  whileHover={{
                    y: -6,
                  }}
                  transition={{
                    duration: 0.35,
                    ease,
                  }}
                  className="
                    group
                    relative
                    flex
                    min-h-[240px]
                    flex-col
                    justify-between
                    overflow-hidden
                    rounded-[24px]
                    border
                    border-line
                    bg-white
                    p-7
                    transition-all
                    duration-500
                    hover:border-accent
                    hover:shadow-[0_18px_50px_rgba(0,0,0,0.06)]
                    md:p-8
                  "
                >

                  {/* =================================
                      DECORATIVE CIRCLE
                  ================================= */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-20
                      -top-20
                      -z-0
                      h-40
                      w-40
                      rounded-full
                      bg-[#f7f7f2]
                      transition-transform
                      duration-700
                      group-hover:scale-125
                    "
                  />

                  {/* =================================
                      TOP
                  ================================= */}

                  <div className="relative z-10 flex items-start justify-between">

                    {/* Icon */}

                    <motion.div
                      whileHover={{
                        scale: 1.08,
                        rotate: -3,
                      }}
                      transition={{
                        duration: 0.3,
                        ease,
                      }}
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[#f3f3ee]
                        text-gray-700
                        transition-colors
                        duration-500
                        group-hover:bg-accent/[0.08]
                        group-hover:text-accent
                      "
                    >
                      <Icon
                        size={23}
                        strokeWidth={1.8}
                      />
                    </motion.div>

                    {/* Number */}

                    {/* <span className="text-[14px] font-medium tracking-[0.15em] text-gray-300 transition-colors duration-300 group-hover:text-gray-400">
                      {number}
                    </span> */}
                  </div>

                  {/* =================================
                      CONTENT
                  ================================= */}

                  <div className="relative z-10">

                    {/* Accent line */}

                    <motion.div
                      initial={{
                        width: 32,
                      }}
                      whileInView={{
                        width: 32,
                      }}
                      viewport={{
                        once: false,
                      }}
                      className="
                        mb-3
                        h-px
                        bg-gray-200
                        transition-all
                        duration-500
                        group-hover:w-14
                        group-hover:bg-accent
                      "
                    />

                    {/* Title */}

                    <AnimatedWords
                      text={t}
                      delay={0.08}
                      stagger={0.05}
                      duration={0.45}
                      className="text-2xl tracking-tight"
                    />

                    {/* Description */}

                    <AnimatedWords
                      text={d}
                      delay={0.15}
                      stagger={0.025}
                      duration={0.4}
                      className="mt-2 max-w-[260px] text-xs leading-6 text-gray-500"
                    />
                  </div>

                  {/* =================================
                      HOVER ARROW
                  ================================= */}

                  <div
                    className="
                      absolute
                      bottom-7
                      right-7
                      z-20
                      flex
                      h-9
                      w-9
                      translate-y-2
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-line
                      bg-white
                      opacity-0
                      transition-all
                      duration-300
                      group-hover:translate-y-0
                      group-hover:opacity-100
                      group-hover:border-accent
                    "
                  >
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                    />
                  </div>

                  {/* =================================
                      BOTTOM ACCENT
                  ================================= */}

                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-[2px]
                      w-0
                      bg-accent
                      transition-all
                      duration-500
                      group-hover:w-full
                    "
                  />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}