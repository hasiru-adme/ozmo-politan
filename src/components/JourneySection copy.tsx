"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Globe2,
  Workflow,
  Bot,
  Link2,
  BarChart3,
  Rocket,
  ArrowRight,
} from "lucide-react";

const journey = [
  {
    n: "01",
    title: "Build",
    text: "We create the website, app or platform your business needs.",
    Icon: Globe2,
    img: "/images/journey/build.jpg",
  },
  {
    n: "02",
    title: "Automate",
    text: "Repetitive tasks become automated workflows.",
    Icon: Workflow,
    img: "/images/journey/automate.jpg",
  },
  {
    n: "03",
    title: "AI",
    text: "AI helps your team respond, understand and work faster.",
    Icon: Bot,
    img: "/images/journey/ai.jpg",
  },
  {
    n: "04",
    title: "Integrate",
    text: "Your tools work together instead of working separately.",
    Icon: Link2,
    img: "/images/journey/integrate.jpg",
  },
  {
    n: "05",
    title: "Understand",
    text: "Turn your business data into simple, useful dashboards.",
    Icon: BarChart3,
    img: "/images/journey/understand.jpg",
  },
  {
    n: "06",
    title: "Grow",
    text: "Improve your digital presence and turn more visitors into customers.",
    Icon: Rocket,
    img: "/images/journey/grow.jpg",
  },
];

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
        y: 35,
        filter: "blur(8px)",
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
              y: 35,
              filter: "blur(8px)",
            }
      }
      transition={{
        duration: 0.7,
        delay: inView ? delay : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedWords({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  return (
    <span className="inline-flex flex-wrap gap-x-[0.22em]">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{
            opacity: 0,
            y: 30,
            filter: "blur(8px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          viewport={{
            once: false,
            amount: 0.5,
          }}
          transition={{
            duration: 0.55,
            delay: delay + index * 0.055,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function JourneySection() {
  return (
    <section
      id="journey"
      className="relative overflow-hidden py-[100px] md:py-[145px] px-[5vw] md:px-[6vw] bg-bg"
    >
      {/* Background glow */}
      <motion.div
        className="pointer-events-none absolute right-[-250px] top-[20%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.08),transparent_68%)]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10">

        {/* HEADER */}
        <Reveal>
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.13em] font-bold text-gray-500 mb-5">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 18 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
              className="h-0.5 bg-accent block shrink-0"
            />

            The solution journey
          </div>
        </Reveal>

        {/* HEADING */}
        <h2 className="text-[clamp(40px,5vw,72px)] leading-[0.98] tracking-[-0.04em] font-normal max-w-[950px]">
          <AnimatedWords
            text="We build your digital system."
            delay={0.05}
          />

          <br />

          <span className="text-gray-400">
            <AnimatedWords
              text="Step by step."
              delay={0.3}
            />
          </span>
        </h2>

        {/* INTRO */}
        <Reveal delay={0.15}>
          <p className="mt-7 text-gray-500 text-[15px] sm:text-base leading-[1.7] max-w-[540px]">
            You don't need to change everything at once.
            We build the right pieces, connect them together,
            and improve them as your business grows.
          </p>
        </Reveal>

        {/* JOURNEY GRID */}
        <div
          id="solutions"
          className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 mt-16"
        >

          {/* CONNECTION LINE */}
          <div className="hidden xl:block absolute left-[16%] right-[16%] top-1/2 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent pointer-events-none" />

          {journey.map(
            ({ n, title, text, Icon, img }, i) => (
              <Reveal
                key={title}
                delay={i * 0.08}
              >
                <motion.article
                  whileHover={{
                    y: -8,
                  }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative isolate overflow-hidden min-h-[330px] rounded-[22px] border border-white/10 bg-[#151515] p-7 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                >

                  {/* IMAGE */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${img})`,
                    }}
                    initial={{
                      scale: 1.05,
                    }}
                    whileHover={{
                      scale: 1.13,
                    }}
                    transition={{
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.38)_0%,rgba(5,5,5,0.58)_42%,rgba(5,5,5,0.94)_100%)]" />

                  {/* GOLD GLOW */}
                  <motion.div
                    className="absolute w-[230px] h-[230px] -right-[100px] -bottom-[100px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.25),transparent_65%)]"
                    whileHover={{
                      scale: 1.35,
                    }}
                    transition={{
                      duration: 0.7,
                    }}
                  />

                  {/* TOP */}
                  <div className="relative z-10 flex items-start justify-between">

                    <motion.span
                      className="text-[10px] text-white/60 tracking-[0.12em]"
                      whileHover={{
                        color: "#F3B51B",
                      }}
                    >
                      {n}
                    </motion.span>

                    <span className="text-[9px] uppercase tracking-[0.12em] text-white/35">
                      {i === 0
                        ? "Start"
                        : i === journey.length - 1
                        ? "Result"
                        : "Next"}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10 mt-[105px]">

                    <h3 className="text-[31px] sm:text-[34px] tracking-[-0.03em] text-white">
                      {title}
                    </h3>

                    <p className="mt-2.5 text-white/70 text-[13px] leading-[1.6] max-w-[270px]">
                      {text}
                    </p>

                  </div>

                  {/* ICON */}
                  <motion.div
                    className="absolute right-6 bottom-6 z-10 w-[68px] h-[68px] rounded-[18px] border border-white/20 grid place-items-center bg-white/10 backdrop-blur-md text-white"
                    whileHover={{
                      rotate: -7,
                      scale: 1.08,
                      backgroundColor: "rgba(243,181,27,0.18)",
                      borderColor: "rgba(243,181,27,0.5)",
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  >
                    <Icon size={29} strokeWidth={1.5} />
                  </motion.div>

                  {/* HOVER ARROW */}
                  <motion.div
                    className="absolute left-7 bottom-7 z-10 w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center"
                    initial={{
                      opacity: 0,
                      scale: 0.5,
                      x: -8,
                    }}
                    whileHover={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                  >
                    <ArrowRight size={14} />
                  </motion.div>

                </motion.article>
              </Reveal>
            )
          )}
        </div>

        {/* BOTTOM STATEMENT */}
        <Reveal delay={0.2}>
          <div className="mt-20 md:mt-28 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-black/10 pt-7">

            <p className="text-[13px] text-gray-500 max-w-[430px] leading-[1.6]">
              One connected system. Built around how your
              business actually works.
            </p>

            <motion.a
              href="#needs"
              whileHover={{
                y: -3,
              }}
              className="inline-flex items-center gap-2 text-[14px] uppercase tracking-[0.12em] font-bold"
            >
              Find your solution
              <ArrowRight size={14} />
            </motion.a>

          </div>
        </Reveal>

      </div>
    </section>
  );
}