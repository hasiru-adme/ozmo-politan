"use client";

import { motion, useInView, useScroll } from "framer-motion";
import { useRef } from "react";
import { X, Check, ArrowRight, Zap } from "lucide-react";
import { Easing } from "framer-motion";
import ScrollFrameBackground, { FrameSet } from "./ScrollFrameBackground";

/* ------------------------------------------------------------------
   BACKGROUND FRAMES  -> change these 4 values to match your files.
   Example file: /public/images/transformation-frames/ezgif-frame-001.jpg
------------------------------------------------------------------ */
const BG_FRAMES: FrameSet = {
  prefix: "/images/transformation-frames/ezgif-frame-",
  count: 150, // how many frame files you have
  ext: ".jpg",
  pad: 3, // 001 = 3, 0001 = 4
  // start: 1, // number of the first file (ezgif starts at 001)
};

const before = [
  "Website",
  "Phone",
  "Email",
  "Excel",
  "Manual work",
  "Disconnected tools",
  "Guesswork",
];

const after = [
  "Website",
  "AI",
  "Automation",
  "CRM",
  "Data",
  "Growth",
];

const ease: Easing = [0.22, 1, 0.36, 1];

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
        duration: 0.8,
        delay: inView ? delay : 0,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedWords({
  children,
}: {
  children: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  const inView = useInView(ref, {
    amount: 0.4,
    once: false,
  });

  const words = children.split(" ");

  return (
    <h2
      ref={ref}
      className="text-[clamp(40px,5vw,72px)] leading-[0.98] tracking-tight font-normal"
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.22em]"
          initial={{
            opacity: 0,
            y: 25,
            filter: "blur(7px)",
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
                y: 25,
                filter: "blur(7px)",
              }
          }
          transition={{
            duration: 0.65,
            delay: i * 0.055,
            ease,
          }}
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}

function SystemCard({
  type,
  items,
  success,
}: {
  type: "before" | "after";
  items: string[];
  success: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    amount: 0.2,
    once: false,
  });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 45,
        scale: 0.97,
      }}
      animate={
        inView
          ? {
            opacity: 1,
            y: 0,
            scale: 1,
          }
          : {
            opacity: 0,
            y: 45,
            scale: 0.97,
          }
      }
      transition={{
        duration: 0.8,
        ease,
      }}
      /* bg-[#111]/55 + backdrop-blur keep the cards readable on top of the moving frames */
      className={`group relative overflow-hidden rounded-[24px] border bg-[#111]/55 backdrop-blur-md p-6 sm:p-7 md:p-8 ${success
          ? "border-accent/30 bg-[linear-gradient(145deg,rgba(243,181,27,0.08),rgba(255,255,255,0.025))]"
          : "border-[#333] bg-[linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.01))]"
        }`}
    >
      {/* Ambient glow */}
      <div
        className={`absolute -right-24 -top-24 h-52 w-52 rounded-full blur-3xl transition-opacity duration-700 ${success
            ? "bg-accent/10 opacity-60 group-hover:opacity-100"
            : "bg-white/5 opacity-30 group-hover:opacity-60"
          }`}
      />

      {/* Decorative circle */}
      <div
        className={`absolute -right-[90px] -top-[90px] h-[180px] w-[180px] rounded-full border transition-transform duration-700 group-hover:scale-125 ${success ? "border-accent/15" : "border-[#333]"
          }`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <span
            className={`text-[14px] uppercase tracking-[0.16em] font-bold ${success ? "text-accent" : "text-gray-500"
              }`}
          >
            {type === "before" ? "Current state" : "Connected state"}
          </span>

          <motion.div
            whileHover={{ rotate: success ? 12 : -12, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className={`w-9 h-9 rounded-full grid place-items-center border ${success
                ? "border-accent/30 bg-accent/10 text-accent"
                : "border-[#333] bg-white/[0.03] text-gray-500"
              }`}
          >
            {success ? <Check size={16} /> : <X size={16} />}
          </motion.div>
        </div>

        <h3 className="text-[25px] sm:text-[28px] tracking-tight font-medium mb-5">
          {type === "before" ? "Everything is separate." : "Everything works together."}
        </h3>

        <div className="space-y-0">
          {items.map((item, i) => (
            <motion.div
              key={item}
              initial={{
                opacity: 0,
                x: success ? 15 : -15,
              }}
              animate={
                inView
                  ? {
                    opacity: 1,
                    x: 0,
                  }
                  : {
                    opacity: 0,
                    x: success ? 15 : -15,
                  }
              }
              transition={{
                duration: 0.5,
                delay: inView ? 0.2 + i * 0.055 : 0,
                ease,
              }}
              className="flex items-center gap-3 py-3 border-b border-[#252525] last:border-0 text-[13px]"
            >
              <span
                className={`w-6 h-6 shrink-0 rounded-full grid place-items-center ${success
                    ? "bg-accent/10 text-accent"
                    : "bg-white/[0.04] text-gray-600"
                  }`}
              >
                {success ? <Check size={12} /> : <X size={12} />}
              </span>

              <span
                className={
                  success ? "text-white/80" : "text-gray-500"
                }
              >
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Connector() {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    amount: 0.5,
    once: false,
  });

  return (
    <div
      ref={ref}
      className="relative flex md:flex-col items-center justify-center min-h-[120px] md:min-h-0"
    >
      {/* Connecting line */}
      <div className="absolute md:top-0 md:bottom-0 left-1/2 -translate-x-1/2 w-[1px] md:w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent hidden md:block" />

      <div className="relative z-10 flex md:flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={
            inView
              ? {
                scale: 1,
                opacity: 1,
              }
              : {
                scale: 0,
                opacity: 0,
              }
          }
          transition={{
            duration: 0.6,
            ease,
          }}
          className="relative w-[62px] h-[62px] rounded-full bg-accent text-black grid place-items-center shadow-[0_0_50px_rgba(243,181,27,0.2)]"
        >
          <Zap size={23} fill="currentColor" />

          <motion.span
            animate={
              inView
                ? {
                  scale: [1, 1.35, 1],
                  opacity: [0.5, 0, 0.5],
                }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border border-accent"
          />
        </motion.div>

        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={
              inView
                ? {
                  opacity: 1,
                  y: 0,
                }
                : {
                  opacity: 0,
                  y: 8,
                }
            }
            transition={{
              duration: 0.5,
              delay: 0.2,
            }}
            className="block text-[10px] uppercase tracking-[0.16em] text-accent font-bold"
          >
            Ozmo
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={
              inView
                ? {
                  opacity: 1,
                }
                : {
                  opacity: 0,
                }
            }
            transition={{
              duration: 0.5,
              delay: 0.3,
            }}
            className="block text-[12px] font-bold text-white mt-1 whitespace-nowrap"
          >
            ONE DIGITAL SYSTEM
          </motion.span>
        </div>

        <ArrowRight
          size={22}
          className="text-accent md:hidden"
        />
      </div>
    </div>
  );
}

export default function TransformationSection() {
  /*
   * scrollYProgress: 0 when the section's top enters the bottom of the screen,
   * 1 when the section's bottom leaves the top of the screen.
   * That value picks which background frame is shown.
   */
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    /*
     * overflow-clip (NOT overflow-hidden): overflow-hidden would break the
     * sticky background below. clip still cuts off anything sticking out.
     */
    <section
      ref={sectionRef}
      id="transformation"
      className="relative overflow-clip py-[100px] md:py-[140px] px-[5vw] md:px-[6vw] bg-[#1110] text-white"
    >
      {/* ===== Full-background frame animation =====
          This layer is as tall as the section. The inner stage is sticky,
          so it stays pinned to the screen while the content scrolls over it. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          <ScrollFrameBackground
            progress={scrollYProgress}
            frames={BG_FRAMES}
          />

          {/* darkening so the white text stays readable */}
          <div className="absolute inset-0 bg-[#111]/65" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(17,17,17,0.85)_100%)]" />

          {/* soft accent glow */}
          <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[420px] h-[260px] rounded-full bg-accent/[0.035] blur-[120px]" />
        </div>
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto">
        {/* Heading */}
        <Reveal>
          <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.13em] font-bold text-gray-400 mb-5">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 18 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, ease }}
              className="h-0.5 bg-accent block"
            />

            The transformation
          </div>

          <AnimatedWords>
            From disconnected tools
          </AnimatedWords>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: false }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease,
            }}
            className="text-[clamp(40px,5vw,72px)] leading-[0.98] tracking-tight font-normal text-gray-500"
          >
            to one connected business.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: false }}
            transition={{
              duration: 0.6,
              delay: 0.55,
            }}
            className="max-w-[560px] mt-6 text-[14px] md:text-[16px] leading-[1.7] text-gray-400"
          >
            Instead of adding more tools to manage, we connect the right
            systems around the way your business actually works.
          </motion.p>
        </Reveal>

        {/* Transformation */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_1fr] gap-5 md:gap-8 items-center mt-16 md:mt-20">
          <SystemCard
            type="before"
            items={before}
            success={false}
          />

          <Connector />

          <SystemCard
            type="after"
            items={after}
            success
          />
        </div>

        {/* Bottom message */}
        <Reveal delay={0.15}>
          <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-7 border-t border-[#292929] pt-8">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.15em] text-gray-500 font-bold mb-2">
                The result
              </span>

              <p className="text-[22px] md:text-[28px] tracking-tight max-w-[700px]">
                Less manual work.
                <span className="text-gray-400"> More control. More growth.</span>
              </p>
            </div>

            <motion.div
              whileHover={{ x: 6 }}
              transition={{ duration: 0.3, ease }}
              className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.12em] text-accent"
            >
              <span>Your business, connected</span>
              <ArrowRight size={17} />
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}