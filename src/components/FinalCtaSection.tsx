"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import ContactModal from "./ContactModal";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------
   WORD BY WORD ANIMATION
---------------------------------- */

function AnimatedWords({
  text,
  delay = 0,
  className = "",
  duration = 0.5,
  stagger = 0.055,
}: {
  text: string;
  delay?: number;
  className?: string;
  duration?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    amount: 0.3,
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
            y: 20,
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
                y: 20,
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
   FINAL CTA
---------------------------------- */

export default function FinalCtaSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section
     id="final-cta"
      className="
        relative
        flex
        min-h-[70vh]
        flex-col
        items-center
        justify-center
        overflow-hidden
        px-[5vw]
        py-[100px]
        text-center
        md:min-h-[80vh]
        md:px-[6vw]
        md:py-[150px]
      "
    >
      {/* =================================
          AMBIENT BACKGROUND
      ================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main glow */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          whileInView={{
            opacity: 0.35,
            scale: 1,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 1.4,
            ease,
          }}
          className="
            absolute
            -right-[120px]
            -top-[120px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-accent
            blur-[110px]
          "
        />

        {/* Secondary glow */}
        <div
          className="
            absolute
            -bottom-[140px]
            left-[8%]
            h-[380px]
            w-[380px]
            rounded-full
            bg-accent/25
            blur-[110px]
          "
        />

        {/* Extra orb (glass eka behind blur wenna) */}
        <div
          className="
            absolute
            left-[30%]
            top-[10%]
            h-[260px]
            w-[260px]
            rounded-full
            bg-accent/20
            blur-[90px]
          "
        />

        {/* Very subtle circle */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-black/[0.025]
          "
        />
      </div>

      {/* =================================
          CONTENT (GLASS CARD)
      ================================= */}

      <div
        className="
          relative
          z-10
          flex
          w-full
          max-w-[1050px]
          flex-col
          items-center
          rounded-[36px]
          border
          border-white/50
          bg-white/[0.18]
          px-6
          py-14
          shadow-[0_8px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)]
          backdrop-blur-2xl
          backdrop-saturate-150
          md:rounded-[48px]
          md:px-16
          md:py-20
        "
      >
        {/* Glass shine */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            -z-10
            rounded-[inherit]
            bg-gradient-to-br
            from-white/50
            via-white/5
            to-transparent
          "
        />

        {/* =================================
            LABEL
        ================================= */}

        {/* <motion.div
          initial={{
            opacity: 0,
            y: 12,
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
            ease,
          }}
          className="
            mb-6
            flex
            items-center
            gap-2.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-gray-500
          "
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

          <span>Start with the problem</span>

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
              delay: 0.15,
              ease,
            }}
            className="block h-[2px] bg-accent"
          />
        </motion.div> */}

        {/* =================================
            MAIN HEADING
        ================================= */}

        <AnimatedWords
          text="Your business is ready"
          delay={0.05}
          stagger={0.07}
          duration={0.6}
          className="
            text-[clamp(46px,7vw,100px)]
            font-normal
            leading-[0.95]
            tracking-[-0.05em]
          "
        />

        <AnimatedWords
          text="for its next step."
          delay={0.2}
          stagger={0.07}
          duration={0.6}
          className="
            text-[clamp(46px,7vw,100px)]
            font-normal
            leading-[0.95]
            tracking-[-0.05em]
            text-[#d88900]
          "
        />

        {/* =================================
            DESCRIPTION
        ================================= */}

        <AnimatedWords
          text="Tell us what's slowing your business down. We'll help you find the digital solution."
          delay={0.22}
          stagger={0.028}
          duration={0.45}
          className="
            mt-7
            max-w-[580px]
            text-[14px]
            leading-[1.75]
            text-gray-600
            md:text-[18px]
          "
        />

        {/* =================================
            CTA
        ================================= */}

        <motion.button
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.7,
            delay: 0.45,
            ease,
          }}
          whileHover={{
            y: -4,
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() => setModalOpen(true)}
          className="
            group
            relative
            mt-9
            inline-flex
            items-center
            gap-3
            overflow-hidden
            rounded-full
            bg-black
            px-6
            py-4
            text-xs
            font-bold
            text-white
            shadow-[0_12px_30px_rgba(0,0,0,0.10)]
            transition-all
            duration-300
            hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)]
          "
        >
          {/* Hover glow */}

          <span
            className="
              absolute
              inset-0
              -translate-x-full
              bg-white/[0.08]
              transition-transform
              duration-500
              group-hover:translate-x-0
            "
          />

          <span className="relative">Let's Talk About Youddr Business</span>

          <span
            className="
              relative
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-white/10
              transition-all
              duration-300
              group-hover:bg-accent
            "
          >
            <ArrowRight
              size={16}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </span>
        </motion.button>

        {/* =================================
            TRUST LINE
        ================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 8,
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
            delay: 0.6,
            ease,
          }}
          className="
            mt-5
            flex
            items-center
            gap-2
            text-[10px]
            text-gray-400
          "
        >
          <span className="h-1 w-1 rounded-full bg-accent" />

        </motion.div>

        {/* Bottom accent */}

        <motion.div
          initial={{
            width: 0,
            opacity: 0,
          }}
          whileInView={{
            width: 70,
            opacity: 1,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.8,
            delay: 0.75,
            ease,
          }}
          className="mt-10 h-[2px] bg-accent"
        />
      </div>

      {/* =================================
          CONTACT MODAL
      ================================= */}

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}