"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Users,
  Mail,
  X,
  Settings2,
  BarChart3,
  ArrowUpRight,
  ArrowDown,
} from "lucide-react";
import ScrollFrames from "./ScrollFrames"; // path eka oyage folder ekata anuwa wenas karanna

const problems = [
  {
    label: "Too many enquiries",
    Icon: Users,
    img: "/images/problems/enquiries.jpg",
    bg: "bg-blue",
    ink: "text-blue-ink",
  },
  {
    label: "Manual follow-ups",
    Icon: Mail,
    img: "/images/problems/followups.jpg",
    bg: "bg-orange",
    ink: "text-orange-ink",
  },
  {
    label: "Missed customers",
    Icon: X,
    img: "/images/problems/missed.jpg",
    bg: "bg-red",
    ink: "text-red-ink",
  },
  {
    label: "Too much admin",
    Icon: Settings2,
    img: "/images/problems/admin.jpg",
    bg: "bg-purple",
    ink: "text-purple-ink",
  },
  {
    label: "No clear data",
    Icon: BarChart3,
    img: "/images/problems/data.jpg",
    bg: "bg-green",
    ink: "text-green-ink",
  },
  {
    label: "Slow growth",
    Icon: ArrowUpRight,
    img: "/images/problems/growth.jpg",
    bg: "bg-teal",
    ink: "text-teal-ink",
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
              y: 35,
              filter: "blur(7px)",
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
  const words = text.split(" ");

  return (
    <span className="inline-flex flex-wrap gap-x-[0.22em]">
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
    <section id="problem" className="relative overflow-clip bg-white">
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
          <h2 className="text-[clamp(30px,8.5vw,72px)] sm:text-[clamp(34px,5vw,72px)] leading-[1.08] tracking-[-0.035em] font-normal max-w-[900px] mx-auto text-center">
            <AnimatedWords text="Running a business" delay={0.05} />

            <br />

            <span className="inline-flex flex-wrap justify-center gap-x-[0.22em] text-[#a57950]">
              <AnimatedWords text="is already complicated." delay={0.25} />
            </span>
          </h2>
        </ScrollFrames>
      )}

      {/* ───────────── NORMAL PART: scrolls after the frames finish ───────────── */}
      <div className="relative py-16 sm:py-[100px] md:py-[140px] px-5 sm:px-[5vw] md:px-[6vw] bg-white">
        {/* subtle background glow */}
        <motion.div
          className="pointer-events-none absolute -left-[250px] top-[20%] w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.08),transparent_68%)]"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          {/* PROBLEM CARDS */}
       

          {/* TRANSITION TO SOLUTION */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.5,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="flex flex-col items-center justify-center mt-20 sm:mt-28"
          >
            <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-gray-400">
              But it doesn't have to be
            </span>

            <motion.div
              animate={{
                y: [0, 6, 0],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-4 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
            >
              <ArrowDown size={15} className="text-gray-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}