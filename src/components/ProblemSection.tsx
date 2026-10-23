"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import ScrollFrames from "./ScrollFrames"; // path eka oyage folder ekata anuwa wenas karanna
import Loop from "./Loop";

/*
 * පරණ `problems` array එක සහ `Reveal` component එක අයින් කළා.
 * ඒවා කොහේවත් පාවිච්චි වුණේ නෑ (PROBLEM CARDS section එක හිස්).
 * ආයෙත් cards පෙන්නන්න ඕන නම් ඒවා පරණ file එකෙන් ගන්න.
 */

function AnimatedWords({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span className="inline-flex flex-wrap gap-x-[0.22em]">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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

export default function ProblemSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const frameSrc = (i: number) =>
    isMobile
      ? `/frames-problem/mobile/frame_${String(i).padStart(3, "0")}.webp`
      : `/frames-problem/frame_${String(i).padStart(4, "0")}.webp`;

  return (
    // overflow-clip (not overflow-hidden) so the sticky pin inside works
    <section className="relative overflow-clip bg-white">
      {/* ───────────── PINNED PART: frames play while this stays on screen ───────────── */}
      {isMobile !== null && (
        <ScrollFrames
          key={isMobile ? "mobile" : "desktop"}
          frameCount={100}
          src={frameSrc}
          fadeOutOnScroll
          fadeOutEnd={0.015}
          overlayClassName="bg-transparent"
          scrollLength={250}
          smoothness={0.08}
          contentClassName="px-5 pt-24 sm:px-[5vw] sm:pt-28 md:px-[6vw] md:pt-32"
        >
          {/* HEADLINE */}
          <h2 className="mx-auto max-w-[900px] text-center text-[clamp(30px,8.5vw,72px)] font-normal leading-[1.08] tracking-[-0.035em] sm:text-[clamp(34px,5vw,72px)]">
            <AnimatedWords text="Running a business" delay={0.05} />

            <br />

            <span className="inline-flex flex-wrap justify-center gap-x-[0.22em] text-[#d88900]">
              <AnimatedWords text="is already complicated." delay={0.25} />
            </span>
          </h2>
        </ScrollFrames>
      )}

      {/* ───────────── NORMAL PART: scrolls after the frames finish ───────────── */}
      <div className="relative bg-white px-5 py-16 sm:px-[5vw] sm:py-[100px] md:px-[6vw] md:py-[140px]">
        {/* subtle background glow (screen එකේ ඉන්නකොට විතරක් loop වෙනවා) */}
        <Loop
          className="pointer-events-none absolute -left-[250px] top-[20%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.08),transparent_68%)]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          rest={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10">
          {/* TRANSITION TO SOLUTION */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 flex flex-col items-center justify-center sm:mt-28"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              But it doesn&apos;t have to be
            </span>

            {/* bouncing arrow (screen එකේ ඉන්නකොට විතරක් loop වෙනවා) */}
            <Loop
              className="mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200"
              animate={{ y: [0, 6, 0] }}
              rest={{ y: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={15} className="text-gray-500" />
            </Loop>
          </motion.div>
        </div>
      </div>
    </section>
  );
}