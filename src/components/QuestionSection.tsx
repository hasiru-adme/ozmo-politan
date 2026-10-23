"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, ArrowDown } from "lucide-react";
import Loop from "./Loop";

const ease = [0.22, 1, 0.36, 1] as const;

const words = [
  "What",
  "if",
  "your",
  "business",
  "could",
  "handle",
  "more",
  "of",
  "it",
  "automatically?",
];

export default function QuestionSection() {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    amount: 0.3,
    margin: "0px 0px -100px 0px",
    once: false,
  });

  return (
    <section
     id="question"
      ref={ref}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_15%,rgba(243,181,27,0.12),transparent_35%),#f0f0eb] px-[5vw] py-[110px] text-center md:px-[6vw] md:py-[170px]"
    >
      {/* Ambient glow: blur-[100px] වෙනුවට radial-gradient (GPU ලාබයි), screen එකේ ඉන්නකොට විතරක් loop වෙනවා */}
      <Loop
        className="pointer-events-none absolute left-1/2 top-[10%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.22),transparent_68%)]"
        animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.35, 0.65, 0.35] }}
        rest={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1050px]">
        {/* ICON */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={
            inView
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0.5, rotate: -20 }
          }
          transition={{ duration: 0.7, ease }}
          className="relative mx-auto mb-8 grid h-[58px] w-[58px] place-items-center rounded-full bg-accent shadow-[0_15px_35px_rgba(243,181,27,0.22)]"
        >
          {/* sparkle wiggle */}
          <Loop
            animate={{ rotate: [0, 12, -12, 0] }}
            rest={{ rotate: 0 }}
            transition={{
              duration: 2.5,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={23} />
          </Loop>

          {/* small pulse ring */}
          <Loop
            className="pointer-events-none absolute inset-0 rounded-full border border-accent"
            animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
            rest={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>

        {/* MAIN QUESTION (filter: blur අයින් කළා, opacity + y විතරයි) */}
        <h2 className="text-[clamp(38px,5.5vw,76px)] font-normal leading-[1.02] tracking-[-0.045em] text-gray-900">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0, y: 35 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{
                delay: inView ? 0.3 + index * 0.055 : 0,
                duration: 0.6,
                ease,
              }}
              className={`mr-[0.2em] inline-block ${
                index >= 7 ? "font-medium text-[#d88900]" : "text-gray-800"
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* ANSWER */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
          transition={{ delay: inView ? 1.15 : 0, duration: 0.7, ease }}
          className="mt-7"
        >
          <p className="text-sm font-medium text-gray-600 sm:text-base">
            We can help.
          </p>

          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 45 } : { width: 0 }}
            transition={{ delay: inView ? 1.35 : 0, duration: 0.5 }}
            className="mx-auto mt-4 h-[2px] bg-accent"
          />
        </motion.div>

        {/* NEXT SECTION INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: inView ? 1.6 : 0 }}
          className="mt-14 flex justify-center"
        >
          {/* bouncing arrow */}
          <Loop
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white/60 shadow-sm"
            animate={{ y: [0, 6, 0] }}
            rest={{ y: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={14} className="text-gray-600" />
          </Loop>
        </motion.div>
      </div>
    </section>
  );
}