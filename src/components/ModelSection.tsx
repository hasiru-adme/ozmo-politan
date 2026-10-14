"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "BUILD",
    text: "We create the right digital solution for your business.",
  },
  {
    number: "02",
    title: "LAUNCH",
    text: "Your solution goes live and starts working for you.",
  },
  {
    number: "03",
    title: "3 MONTHS FREE SUPPORT",
    text: "We help you settle in without an extra maintenance cost.",
    highlight: true,
  },
  {
    number: "04",
    title: "MONTHLY MANAGED SERVICE",
    text: "Hosting, maintenance, updates and technical support.",
  },
  {
    number: "05",
    title: "CONTINUOUS IMPROVEMENT",
    text: "We keep improving your digital system as you grow.",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------
   WORD ANIMATION
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
   MODEL SECTION
---------------------------------- */

export default function ModelSection() {
  return (
    <section
      id="model"
      className="relative overflow-hidden bg-[#f0f0eb] px-5 py-[85px] sm:px-[5vw] md:px-[6vw] md:py-[120px]"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[18%] top-[15%] h-[300px] w-[400px] rounded-full bg-accent/[0.045] blur-[120px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1450px] grid-cols-1 items-center gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-[7vw]">

        {/* =================================
            LEFT CONTENT
        ================================= */}

        <div>

          {/* Label */}
          {/* <Reveal>
            <motion.div
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
              className="mb-5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500"
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

              <span>Our model</span>
            </motion.div>
          </Reveal> */}

          {/* Heading */}
          <AnimatedWords
            text="No big technology bill."
            delay={0.05}
            stagger={0.06}
            duration={0.55}
            className="text-[clamp(34px,4.5vw,62px)] font-normal leading-[1.02] tracking-[-0.045em]"
          />

          <AnimatedWords
            text="One simple monthly relationship."
            delay={0.18}
            stagger={0.055}
            duration={0.55}
            className="mt-1 text-[clamp(34px,4.5vw,62px)] font-normal leading-[1.02] tracking-[-0.045em] text-[#a57950]"
          />

          {/* Description */}
          <AnimatedWords
            text="Instead of paying for everything upfront and being left to manage it yourself, we build, host, maintain and improve your digital solution with you."
            delay={0.15}
            stagger={0.025}
            duration={0.45}
            className="mt-7 max-w-[540px] text-[14px] leading-[1.7] text-gray-600 md:text-[18px]"
          />

          {/* CTA */}
          <Reveal delay={0.3}>
            <motion.a
              href="#contact"
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.25,
                ease,
              }}
              className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-accent px-5 py-4 text-xs font-bold shadow-[0_10px_25px_rgba(243,181,27,0.18)]"
            >
              <span>See Your Monthly Plan</span>

              <motion.span
                whileHover={{
                  x: 4,
                }}
                className="flex"
              >
                <ArrowRight size={17} />
              </motion.span>
            </motion.a>
          </Reveal>
        </div>

        {/* =================================
            RIGHT JOURNEY
        ================================= */}

        <div className="relative">

          {/* Desktop connecting line */}
          <div className="pointer-events-none absolute left-[9%] right-[9%] top-[29px] hidden h-px bg-[#d4d4ce] md:block" />

          {/* Animated line */}
          <motion.div
            initial={{
              scaleX: 0,
            }}
            whileInView={{
              scaleX: 1,
            }}
            viewport={{
              once: false,
              amount: 0.25,
            }}
            transition={{
              duration: 1.4,
              delay: 0.15,
              ease,
            }}
            className="pointer-events-none absolute left-[9%] right-[9%] top-[29px] hidden h-px origin-left bg-accent/50 md:block"
          />

          {/* Mobile vertical line */}
          <div className="pointer-events-none absolute left-[27px] top-[30px] bottom-[35px] w-px bg-[#d4d4ce] md:hidden" />

          <div className="grid grid-cols-1 gap-7 md:grid-cols-5 md:gap-2">

            {steps.map((step, i) => (
              <Reveal
                key={step.number}
                delay={i * 0.1}
              >
                <motion.div
                  whileHover={{
                    y: -7,
                  }}
                  transition={{
                    duration: 0.3,
                    ease,
                  }}
                  className="group relative"
                >

                  {/* Step */}
                  <div className="flex items-start gap-4 md:block md:text-center">

                    {/* Number */}
                    <motion.div
                      whileHover={{
                        scale: 1.08,
                      }}
                      transition={{
                        duration: 0.3,
                        ease,
                      }}
                      className={`relative z-10 grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border bg-white text-[14px] font-extrabold shadow-[0_8px_25px_rgba(0,0,0,0.04)] transition-colors duration-300 md:mx-auto ${
                        step.highlight
                          ? "border-accent bg-[#fffaf0]"
                          : "border-[#deded8] group-hover:border-[#e7d38c]"
                      }`}
                    >
                      {step.highlight ? (
                        <Sparkles
                          size={18}
                          className="text-accent"
                        />
                      ) : (
                        step.number
                      )}

                      {/* Active dot */}
                      {step.highlight && (
                        <motion.span
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.7, 0.25, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent"
                        />
                      )}
                    </motion.div>

                    {/* Content */}
                    <div className="pt-1 md:pt-5">


                      {/* Title */}
                      <AnimatedWords
                        text={step.title}
                        delay={0.1}
                        stagger={0.045}
                        duration={0.45}
                        className={`text-[10px] font-extrabold leading-[1.35] tracking-[0.04em] md:text-center ${
                          step.highlight
                            ? "text-accent"
                            : "text-gray-800"
                        }`}
                      />

                      {/* Description */}
                      <AnimatedWords
                        text={step.text}
                        delay={0.17}
                        stagger={0.022}
                        duration={0.4}
                        className="mt-2 max-w-[170px] text-[14px] leading-[1.5] text-gray-500 md:mx-auto md:text-center"
                      />

                      {/* Check */}
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.7,
                        }}
                        whileInView={{
                          opacity: 1,
                          scale: 1,
                        }}
                        viewport={{
                          once: false,
                        }}
                        transition={{
                          delay: 0.35 + i * 0.08,
                          duration: 0.4,
                          ease,
                        }}
                        className="mt-3 hidden justify-center md:flex"
                      >
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-accent shadow-sm">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      </motion.div>

                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom message */}
      <Reveal delay={0.25}>
        <div className="relative mx-auto mt-16 max-w-[1450px] border-t border-[#d7d7d1] pt-8 md:mt-20 md:flex md:items-center md:justify-between">

          <AnimatedWords
            text="Build once. Keep improving. Pay for what your business needs."
            delay={0.05}
            stagger={0.045}
            duration={0.5}
            className="max-w-[700px] text-[15px] leading-[1.35] tracking-[-0.02em] text-gray-700 md:text-[22px]"
          />

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
              delay: 0.35,
              ease,
            }}
            className="mt-5 flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.12em] text-gray-400 md:mt-0"
          >
            <span>Built for long-term growth</span>

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
              <ArrowRight size={14} />
            </motion.span>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}