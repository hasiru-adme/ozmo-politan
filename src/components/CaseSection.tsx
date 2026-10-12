"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

// background video eka mehema damma: public/videos/case-bg.mp4
const BG_VIDEO = "/videos/case-bg.mp4";

const caseSteps = [
  { text: "A customer visits your website.", img: "/images/case/website.jpg", tint: "#dfeaf5", tintInk: "#46627b" },
  { text: "They request a quote.", img: "/images/case/quote.jpg", tint: "#f5e7d7", tintInk: "#9b673b" },
  { text: "The request is automatically captured.", img: "/images/case/captured.jpg", tint: "#f2dfdf", tintInk: "#985959" },
  { text: "AI helps qualify the enquiry.", img: "/images/case/ai.jpg", tint: "#e8e2f1", tintInk: "#6d5b82" },
  { text: "Your team gets notified.", img: "/images/case/notified.jpg", tint: "#dfeadf", tintInk: "#557255" },
  { text: "Customer books a time.", img: "/images/case/booking.jpg", tint: "#dceaea", tintInk: "#4f7070" },
  { text: "Reminder is sent automatically.", img: "/images/case/reminder.jpg", tint: "#dfeaf5", tintInk: "#46627b" },
  { text: "Invoice is created.", img: "/images/case/invoice.jpg", tint: "#f5e7d7", tintInk: "#9b673b" },
  { text: "Payment is received.", img: "/images/case/payment.jpg", tint: "#f2dfdf", tintInk: "#985959" },
  { text: "Customer gets a review request.", img: "/images/case/review.jpg", tint: "#dfeadf", tintInk: "#557255" },
];

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------
   WORD BY WORD ANIMATION
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
  const inView = useInView(ref, { amount: 0.25, once: false });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 16, filter: "blur(4px)" }
          }
          transition={{ duration, delay: inView ? delay + index * stagger : 0, ease }}
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
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, delay: inView ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------
   3D GLASS TILT CARD
   mouse eka yana thanata card eka tilt wenawa,
   glare ekak follow karanawa, athule items z-axis eke udata enawa
---------------------------------- */

function TiltCard({
  children,
  img,
  tintInk,
  className = "",
}: {
  children: React.ReactNode;
  img: string;
  tintInk: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 220, damping: 22 });
  const sy = useSpring(my, { stiffness: 220, damping: 22 });

  const rotateY = useTransform(sx, [0, 1], [-12, 12]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const glare = useTransform(
    [sx, sy],
    (v: number[]) =>
      `radial-gradient(circle at ${v[0] * 100}% ${v[1] * 100}%, rgba(255,255,255,0.35), transparent 55%)`
  );

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div className={`h-full [perspective:1000px] ${className}`}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, ease }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full min-h-[270px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-shadow duration-500 hover:shadow-[0_35px_70px_rgba(0,0,0,0.5)]"
      >
        {/* glass layer (overflow-hidden meka athule thiyenna ona, 3D walata awul nathi wenna) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl">
          {/* card image eka glass eka pitipasse, podi opacity ekakin */}
          <div
            className="absolute inset-0 scale-[1.06] bg-cover bg-center opacity-30 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-60"
            style={{ backgroundImage: `url(${img})` }}
          />
          {/* glass sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent" />
          {/* cursor eka follow karana glare */}
          <motion.div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glare }}
          />
          {/* bottom accent */}
          <span
            className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
            style={{ backgroundColor: tintInk }}
          />
        </div>

        {children}
      </motion.div>
    </div>
  );
}

/* ---------------------------------
   CASE SECTION
---------------------------------- */

export default function CaseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionInView = useInView(sectionRef, { amount: 0.05 });

  // section eka screen eke nathi welawata video eka pause karanawa (performance)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (sectionInView) v.play().catch(() => {});
    else v.pause();
  }, [sectionInView]);

  return (
    <section
      ref={sectionRef}
      id="case"
      className="relative overflow-hidden bg-black px-5 py-16 sm:px-[5vw] sm:py-[90px] md:px-[6vw] md:py-[125px]"
    >
      {/* =================================
          BACKGROUND VIDEO
      ================================= */}
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* text/cards read karanna dark overlay ekak */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70" />
      <div className="pointer-events-none absolute left-1/2 top-[12%] h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <div className="relative mx-auto max-w-[1450px]">
        {/* =================================
            HEADER
        ================================= */}
        <div className="max-w-[850px]">
          {/* <Reveal>
            <div className="mb-5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 20 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, ease }}
                className="block h-[2px] bg-accent"
              />
              <span>Real-life example</span>
            </div>
          </Reveal> */}

          <AnimatedWords
            text="Imagine you run"
            delay={0.05}
            stagger={0.07}
            duration={0.6}
            className="text-[clamp(38px,5vw,72px)] font-normal leading-[0.98] tracking-[-0.045em] text-white"
          />
          <AnimatedWords
            text="a cleaning business."
            delay={0.18}
            stagger={0.07}
            duration={0.6}
            className="text-[clamp(38px,5vw,72px)] font-normal leading-[0.98] tracking-[-0.045em] text-[#a57950]"
          />
          <AnimatedWords
            text="Here's what happens when the right digital systems work together."
            delay={0.18}
            stagger={0.03}
            duration={0.45}
            className="mt-6 max-w-[560px] text-[15px] leading-[1.7] text-white/70 md:text-[17px]"
          />
        </div>

        {/* =================================
            3D GLASS CARDS
        ================================= */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 md:grid-cols-3 md:mt-20 lg:grid-cols-5">
          {caseSteps.map(({ text, img, tintInk }, i) => (
            <Reveal key={text} delay={i * 0.055} className="h-full">
              <TiltCard img={img} tintInk={tintInk}>
                <div
                  className="relative flex min-h-[270px] flex-col justify-end p-5 sm:p-6"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* glass text panel */}
                  <div
                    className="rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur-md transition-colors duration-500 group-hover:bg-white/20"
                    style={{ transform: "translateZ(28px)" }}
                  >
                    <AnimatedWords
                      text={text}
                      delay={0.08}
                      stagger={0.025}
                      duration={0.42}
                      className="text-[13px] font-semibold leading-[1.45] text-white"
                    />

                    <div className="mt-3 flex -translate-x-2 items-center gap-1.5 overflow-hidden text-[10px] font-bold uppercase tracking-[0.12em] text-white/70 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                      <span>See how it works</span>
                      <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* =================================
            RESULT
        ================================= */}
        <Reveal delay={0.2}>
          <div className="mt-16 border-t border-white/15 pt-12 text-center sm:mt-[90px]">
            <AnimatedWords
              text="That's not just a website."
              delay={0.05}
              stagger={0.05}
              duration={0.5}
              className="text-[15px] text-white/70 md:text-[17px]"
            />
            <AnimatedWords
              text="That's a digital business system."
              delay={0.16}
              stagger={0.06}
              duration={0.55}
              className="mt-2 text-[clamp(32px,5vw,66px)] leading-[1.05] tracking-[-0.04em] text-white"
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 80, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
              className="mx-auto mt-6 h-[2px] bg-accent"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}