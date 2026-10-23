"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type PointerEvent } from "react";

const capabilities = [
  {
    title: "Product Design",
    description: "Turn an idea into something that can actually be built.",
  },
  {
    title: "Electronics & PCB",
    description: "Design the electronics around the problem you're solving.",
  },
  {
    title: "Embedded & Firmware",
    description: "Build the intelligence that makes the hardware work.",
  },
  {
    title: "Connected Systems",
    description:
      "Connect physical products with software, data and cloud systems.",
  },
];

/* PCB traces drawn on a 100x100 board. Each one draws in at its own point of the scroll. */
const traces = [
  { d: "M10 22 H38 V40", range: [0.12, 0.34] },
  { d: "M90 30 H66 V42", range: [0.18, 0.4] },
  { d: "M20 82 H40 V62", range: [0.24, 0.46] },
  { d: "M82 80 H62 V62", range: [0.3, 0.52] },
  { d: "M10 52 H34", range: [0.2, 0.38] },
  { d: "M90 56 H68", range: [0.26, 0.44] },
];

const pads = [
  [10, 22], [90, 30], [20, 82], [82, 80], [10, 52], [90, 56],
];

export default function AdmeTechSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Smooth the raw scroll so everything glides instead of snapping */
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  /* Device movement */
  const deviceY = useTransform(p, [0, 0.35, 0.65, 1], [120, 0, -20, -100]);
  const deviceScale = useTransform(p, [0, 0.35, 0.65, 1], [0.75, 1, 1.04, 0.9]);
  const scrollTiltX = useTransform(p, [0, 0.5, 1], [-14, 0, 8]);
  const scrollTiltY = useTransform(p, [0, 0.5, 1], [12, 0, -8]);

  /* Pointer tilt (on top of the scroll tilt) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });

  const rotateX = useTransform(
    [scrollTiltX, sy] as MotionValue<number>[],
    ([a, b]: number[]) => a + b * -12
  );
  const rotateY = useTransform(
    [scrollTiltY, sx] as MotionValue<number>[],
    ([a, b]: number[]) => a + b * 14
  );

  /* Parallax between board layers */
  const boardX = useTransform(sx, [-0.5, 0.5], [-5, 5]);
  const boardY = useTransform(sy, [-0.5, 0.5], [-5, 5]);
  const chipX = useTransform(sx, [-0.5, 0.5], [7, -7]);
  const chipY = useTransform(sy, [-0.5, 0.5], [7, -7]);

  /* Glow + connection lines */
  const glowScale = useTransform(p, [0, 0.5, 1], [0.5, 1.25, 0.8]);
  const glowOpacity = useTransform(p, [0, 0.4, 0.7, 1], [0, 0.9, 0.55, 0]);
  const lineScale = useTransform(p, [0.15, 0.45, 0.75], [0, 1, 1]);

  /* Ambient colour behind the glass cards */
  const orbAY = useTransform(p, [0, 1], [80, -120]);
  const orbBY = useTransform(p, [0, 1], [-60, 100]);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#080808] text-white"
    >
      <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40 lg:px-16">
        {/* HEADER */}
        <div className="mx-auto max-w-4xl text-center">
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-6"
          >
            <span className="text-[14px] font-medium uppercase tracking-[0.3em] text-[#fbad1c]">
              Beyond Digital
            </span>
          </motion.div> */}

          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance text-4xl font-medium leading-[1.03] tracking-[-0.045em] md:text-6xl lg:text-7xl"
          >
            When the solution needs
            <span className="block text-[#d88900]">a physical world.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/45 md:text-lg"
          >
            Some business problems need more than software. We can take an
            idea from electronics and embedded technology through to connected
            digital systems — creating solutions that work together from the
            inside out.
          </motion.p>
        </div>

        {/* =========================
            ANIMATED TECHNOLOGY VISUAL
        ========================== */}
        <div
          className="relative mx-auto mt-20 max-w-6xl md:mt-28"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div className="relative flex min-h-[520px] items-center justify-center">
            {/* Glow behind the device */}
            <motion.div
              style={{ scale: glowScale, opacity: glowOpacity }}
              className="pointer-events-none absolute h-[420px] w-[420px] rounded-full bg-[#fbad1c]/20 blur-[110px]"
            />

            {/* Orbit rings */}
            <Ring size={400} duration={40} reduce={!!reduce} />
            <Ring size={520} duration={60} reverse reduce={!!reduce} />

            {/* Horizontal connection + pulses */}
            <motion.div
              style={{ scaleX: lineScale }}
              className="absolute left-[8%] right-[8%] top-1/2 hidden h-px origin-center bg-gradient-to-r from-transparent via-[#fbad1c]/40 to-transparent md:block"
            />
            <Pulse axis="x" from="8%" to="50%" delay={0} reduce={!!reduce} />
            <Pulse axis="x" from="92%" to="50%" delay={1.1} reduce={!!reduce} />

            {/* Vertical connection + pulses */}
            <motion.div
              style={{ scaleY: lineScale }}
              className="absolute bottom-[8%] left-1/2 top-[8%] hidden w-px origin-center bg-gradient-to-b from-transparent via-[#fbad1c]/30 to-transparent md:block"
            />
            <Pulse axis="y" from="8%" to="50%" delay={0.6} reduce={!!reduce} />
            <Pulse axis="y" from="92%" to="50%" delay={1.7} reduce={!!reduce} />

            {/* Device */}
            <motion.div
              style={{
                y: deviceY,
                scale: deviceScale,
                rotateX,
                rotateY,
                transformPerspective: 1000,
              }}
              className="relative z-10"
            >
              <div className="absolute left-1/2 top-[80%] h-20 w-52 -translate-x-1/2 rounded-full bg-black/80 blur-3xl" />

              <div className="relative h-[240px] w-[240px] rounded-[30px] border border-white/15 bg-[#101010] p-4 shadow-[0_30px_100px_rgba(0,0,0,.8)] md:h-[290px] md:w-[290px]">
                {/* Glass edge highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />

                <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-white/10 bg-[#0b0b0b]">
                  {/* PCB traces draw in with the scroll */}
                  <motion.svg
                    viewBox="0 0 100 100"
                    style={{ x: boardX, y: boardY }}
                    className="absolute inset-0 h-full w-full"
                    fill="none"
                  >
                    {traces.map((t) => (
                      <Trace key={t.d} d={t.d} range={t.range} progress={p} />
                    ))}
                    {pads.map(([cx, cy], i) => (
                      <motion.circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={1.6}
                        fill="#fbad1c"
                        animate={
                          reduce ? undefined : { opacity: [0.3, 1, 0.3] }
                        }
                        transition={{
                          duration: 2.2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.svg>

                  {/* Chip */}
                  <motion.div
                    style={{ x: chipX, y: chipY }}
                    className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2"
                  >
                    <motion.div
                      animate={
                        reduce
                          ? undefined
                          : {
                              boxShadow: [
                                "0 0 20px rgba(251,173,28,.04)",
                                "0 0 70px rgba(251,173,28,.22)",
                                "0 0 20px rgba(251,173,28,.04)",
                              ],
                            }
                      }
                      transition={{ duration: 3, repeat: Infinity }}
                      className="relative flex h-full w-full items-center justify-center rounded-xl border border-[#fbad1c]/25 bg-[#121212]"
                    >
                      {/* Chip pins */}
                      {[0, 1, 2, 3].map((i) => (
                        <span key={`t${i}`} className="absolute -top-1.5 h-1.5 w-px bg-[#fbad1c]/50" style={{ left: `${20 + i * 20}%` }} />
                      ))}
                      {[0, 1, 2, 3].map((i) => (
                        <span key={`b${i}`} className="absolute -bottom-1.5 h-1.5 w-px bg-[#fbad1c]/50" style={{ left: `${20 + i * 20}%` }} />
                      ))}
                      {[0, 1, 2, 3].map((i) => (
                        <span key={`l${i}`} className="absolute -left-1.5 h-px w-1.5 bg-[#fbad1c]/50" style={{ top: `${20 + i * 20}%` }} />
                      ))}
                      {[0, 1, 2, 3].map((i) => (
                        <span key={`r${i}`} className="absolute -right-1.5 h-px w-1.5 bg-[#fbad1c]/50" style={{ top: `${20 + i * 20}%` }} />
                      ))}

                      <div className="h-16 w-16 rounded-lg border border-[#fbad1c]/20" />
                      <motion.div
                        animate={
                          reduce
                            ? undefined
                            : { opacity: [1, 0.25, 1], scale: [1, 1.5, 1] }
                        }
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="absolute h-2 w-2 rounded-full bg-[#fbad1c] shadow-[0_0_15px_#fbad1c]"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Scanning line */}
                  {!reduce && (
                    <motion.div
                      animate={{ y: ["-120%", "120%"] }}
                      transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#fbad1c]/50 to-transparent"
                    />
                  )}
                </div>

                {/* Screws */}
                <span className="absolute left-3 top-3 h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-white/20" />
                <span className="absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-white/20" />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                  ADME.TECH
                </p>
                <p className="mt-1 text-sm text-white/55">Connected technology</p>
              </motion.div>
            </motion.div>

            {/* Desktop labels */}
            <TechLabel label="HARDWARE" className="absolute left-0 top-1/2 hidden -translate-y-1/2 md:block" />
            <TechLabel label="SOFTWARE" className="absolute right-0 top-1/2 hidden -translate-y-1/2 md:block" />
            <TechLabel label="FIRMWARE" className="absolute left-1/2 top-0 hidden -translate-x-1/2 md:block" />
            <TechLabel label="CONNECTED" className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 md:block" />
          </div>
        </div>

        {/* =========================
            CAPABILITIES (glass)
        ========================== */}
        <div className="relative mt-20 pt-10 md:mt-28">
          {/* Colour behind the glass so the blur has something to show */}
          <motion.div
            style={{ y: orbAY }}
            className="pointer-events-none absolute -left-10 top-10 h-72 w-72 rounded-full bg-[#fbad1c]/25 blur-[90px]"
          />
          <motion.div
            style={{ y: orbBY }}
            className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-[#ff6a3d]/20 blur-[100px]"
          />

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-10"
          >
            <p className="text-[14px] uppercase tracking-[0.28em] text-white/30">
              What sits behind it
            </p>
            <h3 className="mt-3 text-2xl tracking-tight md:text-3xl">
              Built from the inside out.
            </h3>
          </motion.div>

          <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => (
              <GlassCard key={item.title} index={index}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "35px" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12 + 0.35, duration: 0.6 }}
                  className="h-px bg-[#fbad1c]"
                />
                <h4 className="mt-8 text-lg font-medium">{item.title}</h4>
                <p className="mt-3 max-w-xs text-sm leading-6 text-white/50">
                  {item.description}
                </p>
                <div className="mt-8 h-px w-full overflow-hidden bg-white/10">
                  <div className="h-full -translate-x-full bg-[#fbad1c] transition-transform duration-500 group-hover:translate-x-0" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* =========================
            CTA (glass)
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative mt-6 flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.04] p-7 shadow-[0_8px_32px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-9"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <div className="relative">
            <p className="text-lg font-medium">
              Building something beyond the screen?
            </p>
            <p className="mt-1 text-sm text-white/45">
              Explore the technology behind connected products.
            </p>
          </div>

          <a
            href="https://adme.group/teams/adme-tech"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-fit items-center gap-3 rounded-full bg-[#fbad1c] px-6 py-3 text-sm font-medium text-black transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fbad1c]"
          >
            Explore ADME.Tech
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================
   COMPONENTS
========================================= */

/** Frosted glass card with a cursor-following amber light */
function GlassCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      onPointerMove={onMove}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.12] bg-white/[0.04] p-7 shadow-[0_8px_32px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl transition-colors duration-500 hover:border-white/20 hover:bg-white/[0.07] md:p-8"
    >
      {/* Diagonal glass sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.09] via-transparent to-transparent" />
      {/* Top specular edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      {/* Cursor light */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(251,173,28,.18), transparent 60%)",
        }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

/** One PCB trace that draws itself during its slice of the scroll */
function Trace({
  d,
  range,
  progress,
}: {
  d: string;
  range: number[];
  progress: MotionValue<number>;
}) {
  const pathLength = useTransform(progress, range, [0, 1], { clamp: true });
  return (
    <motion.path
      d={d}
      stroke="#fbad1c"
      strokeOpacity={0.65}
      strokeWidth={0.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength }}
    />
  );
}

/** A bright signal that travels along a connection line toward the device */
function Pulse({
  axis,
  from,
  to,
  delay,
  reduce,
}: {
  axis: "x" | "y";
  from: string;
  to: string;
  delay: number;
  reduce: boolean;
}) {
  if (reduce) return null;
  const isX = axis === "x";
  return (
    <motion.span
      className={`absolute z-20 hidden rounded-full bg-[#fbad1c] shadow-[0_0_14px_3px_rgba(251,173,28,.7)] md:block ${
        isX ? "top-1/2 h-1.5 w-1.5 -translate-y-1/2" : "left-1/2 h-1.5 w-1.5 -translate-x-1/2"
      }`}
      initial={isX ? { left: from, opacity: 0 } : { top: from, opacity: 0 }}
      animate={
        isX
          ? { left: [from, to], opacity: [0, 1, 1, 0] }
          : { top: [from, to], opacity: [0, 1, 1, 0] }
      }
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        repeatDelay: 0.6,
        ease: "easeInOut",
        times: [0, 0.15, 0.85, 1],
      }}
    />
  );
}

/** Slow rotating dashed ring around the device */
function Ring({
  size,
  duration,
  reverse = false,
  reduce,
}: {
  size: number;
  duration: number;
  reverse?: boolean;
  reduce: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      animate={reduce ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size }}
      className="pointer-events-none absolute hidden rounded-full border border-dashed border-[#fbad1c]/15 md:block"
    >
      <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#fbad1c]/70 shadow-[0_0_12px_#fbad1c]" />
    </motion.div>
  );
}

function TechLabel({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-md ${className}`}
    >
      <span className="text-[10px] tracking-[0.25em] text-white/50">
        {label}
      </span>
    </motion.div>
  );
}