"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, ArrowDown } from "lucide-react";

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
      ref={ref}
      className="relative overflow-hidden min-h-[70vh] flex items-center justify-center py-[110px] md:py-[170px] px-[5vw] md:px-[6vw] text-center bg-[radial-gradient(circle_at_50%_15%,rgba(243,181,27,0.12),transparent_35%),#f0f0eb]"
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute left-1/2 top-[10%] -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[100px] pointer-events-none"
        animate={
          inView
            ? {
                scale: [0.85, 1.1, 0.85],
                opacity: [0.35, 0.65, 0.35],
              }
            : {
                opacity: 0,
              }
        }
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1050px] mx-auto">
        {/* ICON */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.5,
            rotate: -20,
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                }
              : {
                  opacity: 0,
                  scale: 0.5,
                  rotate: -20,
                }
          }
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative w-[58px] h-[58px] rounded-full bg-accent grid place-items-center mx-auto mb-8 shadow-[0_15px_35px_rgba(243,181,27,0.22)]"
        >
          <motion.div
            animate={
              inView
                ? {
                    rotate: [0, 12, -12, 0],
                  }
                : {}
            }
            transition={{
              duration: 2.5,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={23} />
          </motion.div>

          {/* small pulse */}
          <motion.span
            className="absolute inset-0 rounded-full border border-accent"
            animate={
              inView
                ? {
                    scale: [1, 1.5],
                    opacity: [0.45, 0],
                  }
                : {}
            }
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>

        {/* MAIN QUESTION */}
        <h2 className="text-[clamp(38px,5.5vw,76px)] leading-[1.02] tracking-[-0.045em] font-normal text-gray-900">
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{
                opacity: 0,
                y: 35,
                filter: "blur(10px)",
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
                      filter: "blur(10px)",
                    }
              }
              transition={{
                delay: 0.3 + index * 0.055,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`inline-block mr-[0.2em] ${
                index >= 7 ? "text-[#d97706] font-medium" : "text-gray-800"
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        {/* ANSWER */}
        <motion.div
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
            delay: 1.15,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-7"
        >
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            We can help.
          </p>

          <motion.div
            initial={{
              width: 0,
            }}
            animate={
              inView
                ? {
                    width: 45,
                  }
                : {
                    width: 0,
                  }
            }
            transition={{
              delay: 1.35,
              duration: 0.5,
            }}
            className="h-[2px] bg-accent mx-auto mt-4"
          />
        </motion.div>

        {/* NEXT SECTION INDICATOR */}
        <motion.div
          initial={{
            opacity: 0,
          }}
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
            delay: 1.6,
          }}
          className="mt-14 flex justify-center"
        >
          <motion.div
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-9 h-9 rounded-full border border-gray-300 bg-white/60 shadow-sm flex items-center justify-center"
          >
            <ArrowDown size={14} className="text-gray-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}