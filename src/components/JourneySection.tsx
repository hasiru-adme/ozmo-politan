"use client";

import {
  motion,
  useInView,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Globe2,
  Workflow,
  Bot,
  Link2,
  BarChart3,
  Rocket,
  ArrowRight,
  MessageCircle,
  Package,
} from "lucide-react";
import Loop from "./Loop";

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const TOTAL_FRAMES = 100;

// Real frame index (0-based) where each scene starts.
const CARD_START_FRAMES = [0, 17, 34, 50, 67, 84];

// Dissolve / transition frames to skip (inclusive index ranges).
const SKIP_RANGES: [number, number][] = [
  [14, 16],
  [31, 33],
  [47, 49],
  [64, 66],
  [81, 83],
];

// Frames that are actually shown while scrolling
const FRAME_MAP = Array.from({ length: TOTAL_FRAMES }, (_, i) => i).filter(
  (i) => !SKIP_RANGES.some(([a, b]) => i >= a && i <= b)
);

const FIRST_BATCH = 8; // loader එක බලාගෙන ඉන්න frames ගාණ
const CONCURRENCY = 4; // එකවර download වෙන frames ගාණ

const END_THRESHOLD = 0.94;
const DEBUG = false;
const SHOW_OVERLAY = false;

const framePath = (i: number, mobile: boolean) =>
  `/journey-frames/${mobile ? "mobile/" : ""}frame_${String(i + 1).padStart(3, "0")}.webp`;

const journey = [
  { n: "01", title: "Build", text: "We create the website, app or platform your business needs.", Icon: Globe2 },
  { n: "02", title: "Automate", text: "Repetitive tasks become automated workflows.", Icon: Workflow },
  { n: "03", title: "AI", text: "AI helps your team respond, understand and work faster.", Icon: Bot },
  { n: "04", title: "Integrate", text: "Your tools work together instead of working separately.", Icon: Link2 },
  { n: "05", title: "Understand", text: "Turn your business data into simple, useful dashboards.", Icon: BarChart3 },
  { n: "06", title: "Grow", text: "Improve your digital presence and turn more visitors into customers.", Icon: Rocket },
];

/* ------------------------------------------------------------------ */
/* SMALL HELPERS                                                       */
/* ------------------------------------------------------------------ */

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
    once: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex flex-wrap gap-x-[0.22em]">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
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

/* ------------------------------------------------------------------ */
/* SCROLL FRAME STAGE                                                  */
/* ------------------------------------------------------------------ */

function FrameStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const mobileRef = useRef(false);
  const genRef = useRef(0); // effect restart වුණාම (Strict Mode) පරණ loaders නවත්තන්න

  const posRef = useRef(0); // දැනට පෙන්නන real frame
  const lastDrawnRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [loadPercent, setLoadPercent] = useState(0);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const [active, setActive] = useState(0);
  const [frameIdx, setFrameIdx] = useState(0);
  const [done, setDone] = useState(false);

  /* ---------- draw (object-fit: cover) ---------- */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ok = (im?: HTMLImageElement) =>
      !!im && im.complete && im.naturalWidth > 0;

    // 1) ඉල්ලපු frame එක, නැත්නම් ළඟම load වෙච්ච පස්සට frame එක
    let idx = posRef.current;
    let img = imagesRef.current.get(idx);
    while (!ok(img) && idx > 0) {
      idx--;
      img = imagesRef.current.get(idx);
    }
    // 2) තාම නැත්නම් ඉස්සරහට හොයනවා
    if (!ok(img)) {
      idx = posRef.current;
      while (!ok(img) && idx < TOTAL_FRAMES - 1) {
        idx++;
        img = imagesRef.current.get(idx);
      }
    }
    if (!img || !ok(img)) return;

    if (lastDrawnRef.current === idx) return;
    lastDrawnRef.current = idx;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }, []);

  const scheduleDraw = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      draw();
    });
  }, [draw]);

  /* ---------- canvas resize (DPR cap 1.5) ---------- */
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastDrawnRef.current = null;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  /* ---------- load: frame එකක් එක පාරයි, අනුපිළිවෙලට ---------- */
  useEffect(() => {
    const gen = ++genRef.current;
    const images = imagesRef.current;
    mobileRef.current = window.innerWidth < 768;
    readyRef.current = false;
    setReady(false);
    setLoadPercent(0);

    let next = 0;

    const loadOne = () => {
      if (gen !== genRef.current || next >= TOTAL_FRAMES) return;
      const i = next++;
      const img = new Image();
      img.decoding = "async";

      img.onload = () => {
        if (gen !== genRef.current) return;
        images.set(i, img);

        if (!readyRef.current) {
          let have = 0;
          for (let k = 0; k < FIRST_BATCH; k++) {
            if (images.has(k)) have++;
          }
          setLoadPercent(Math.round((have / FIRST_BATCH) * 100));
          if (have >= FIRST_BATCH) {
            readyRef.current = true;
            setReady(true);
          }
        }

        // තාම කිසිවක් draw කරලා නැත්නම්, නැත්නම් දැන් පෙන්නන්න ඕන frame එක නම්
        if (lastDrawnRef.current === null || i === posRef.current) {
          lastDrawnRef.current = null;
          scheduleDraw();
        }
        loadOne(); // ඊළඟ frame එක
      };

      img.onerror = () => {
        if (gen !== genRef.current) return;
        // frame එක නැත්නම් අතහැරලා ඊළඟ එකට යනවා. ready වෙන්න බලාගෙන ඉන්න එපා
        if (!readyRef.current && i < FIRST_BATCH) {
          readyRef.current = true;
          setReady(true);
        }
        loadOne();
      };

      img.src = framePath(i, mobileRef.current);
    };

    for (let c = 0; c < CONCURRENCY; c++) loadOne();

    return () => {
      genRef.current++; // පරණ loaders ඔක්කොම invalid
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      images.clear();
      lastDrawnRef.current = null;
    };
  }, [scheduleDraw]);

  /* ---------- scroll -> frame (Lenis දැනටමත් smooth කරනවා) ---------- */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const apply = useCallback(
    (p: number) => {
      const clamped = Math.min(Math.max(p, 0), 1);
      const mapPos = clamped * (FRAME_MAP.length - 1);
      const actual = FRAME_MAP[Math.round(mapPos)];
      posRef.current = actual;
      scheduleDraw();

      if (DEBUG) setFrameIdx((prev) => (prev === actual ? prev : actual));

      let a = 0;
      for (let i = 0; i < CARD_START_FRAMES.length; i++) {
        if (actual >= CARD_START_FRAMES[i]) a = i;
      }
      setActive((prev) => (prev === a ? prev : a));

      const finished = clamped >= END_THRESHOLD;
      setDone((prev) => (prev === finished ? prev : finished));
    },
    [scheduleDraw]
  );

  useMotionValueEvent(scrollYProgress, "change", apply);

  useEffect(() => {
    apply(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = journey[active];
  const Icon = current.Icon;

  return (
    <div
      id="solutions"
      ref={trackRef}
      className="relative mt-16 h-[280vh] md:h-[400vh]"
    >
      {/* STICKY STAGE (full screen) */}
      <div className="sticky top-0 h-screen w-full">
        <div className="relative h-full w-full overflow-hidden bg-bg">
          {/* CANVAS */}
          <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 h-full w-full"
          />

          {/* DEBUG */}
          {DEBUG && (
            <div className="absolute left-1/2 top-4 z-40 -translate-x-1/2 rounded bg-black px-3 py-1 text-xs text-white">
              frame index: {frameIdx} (file: frame_
              {String(frameIdx + 1).padStart(3, "0")}) · loaded:{" "}
              {imagesRef.current.size}
            </div>
          )}

          {/* LOADER */}
          <AnimatePresence>
            {!ready && (
              <motion.div
                key="loader"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-30 grid place-items-center bg-bg"
              >
                <div className="w-[180px]">
                  <div className="h-[2px] w-full overflow-hidden rounded bg-black/10">
                    <div
                      className="h-full bg-accent transition-[width] duration-200"
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-center text-[10px] uppercase tracking-[0.13em] text-neutral-500">
                    Loading {loadPercent}%
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OVERLAY (SHOW_OVERLAY = true නම් පමණයි) */}
          {SHOW_OVERLAY && (
            <>
              <div className="absolute left-[5vw] right-[5vw] top-6 z-10 flex items-start justify-between md:left-[6vw] md:right-[6vw] md:top-8">
                <span className="text-[10px] tracking-[0.12em] text-neutral-600">
                  {current.n} / 06
                </span>
                <span className="text-[9px] uppercase tracking-[0.12em] text-neutral-500">
                  {active === 0
                    ? "Start"
                    : active === journey.length - 1
                    ? "Result"
                    : "Next"}
                </span>
              </div>

              <div className="absolute bottom-8 left-[5vw] right-[5vw] z-10 flex items-end justify-between gap-6 md:bottom-10 md:left-[6vw] md:right-[6vw]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="text-[40px] leading-none tracking-[-0.04em] text-neutral-900 sm:text-[56px] md:text-[72px]">
                      {current.title}
                    </h3>
                    <p className="mt-3 max-w-[340px] text-[13px] leading-[1.6] text-neutral-700 md:text-[15px]">
                      {current.text}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`icon-${current.title}`}
                    initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.4 }}
                    className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-[18px] border border-black/10 bg-white/50 text-neutral-900 md:h-[84px] md:w-[84px]"
                  >
                    <Icon size={32} strokeWidth={1.5} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}

          {/* END BUTTON: LEFT (Packages) */}
          <motion.a
            href="#packages"
            initial={false}
            animate={done ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={done ? { y: -3 } : undefined}
            whileTap={done ? { scale: 0.97 } : undefined}
            style={{ pointerEvents: done ? "auto" : "none" }}
            tabIndex={done ? 0 : -1}
            aria-hidden={!done}
            className="absolute bottom-8 left-[5vw] z-20 inline-flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 text-[14px] font-bold text-black shadow-[0_12px_30px_rgba(243,181,27,0.3)] md:bottom-10 md:left-[6vw] md:px-6 md:py-4 md:text-xs"
          >
            {done && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.35], opacity: [0.8, 0] }}
                transition={{
                  duration: 1.8,
                  delay: 0.9,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
            <Package size={15} />
            Packages
            <motion.span
              className="inline-flex"
              animate={done ? { x: [0, 5, 0] } : { x: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.9,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeInOut",
              }}
            >
              <ArrowRight size={14} />
            </motion.span>
          </motion.a>

          {/* END BUTTON: RIGHT (Let's Talk) */}
          <motion.a
            href="#start"
            initial={false}
            animate={done ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{
              duration: 0.6,
              delay: done ? 0.08 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={done ? { y: -3 } : undefined}
            whileTap={done ? { scale: 0.97 } : undefined}
            style={{ pointerEvents: done ? "auto" : "none" }}
            tabIndex={done ? 0 : -1}
            aria-hidden={!done}
            className="absolute bottom-8 right-[5vw] z-20 inline-flex items-center gap-2.5 rounded-full bg-black px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] md:bottom-10 md:right-[6vw] md:px-6 md:py-4 md:text-xs"
          >
            {done && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-black/60"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
                transition={{
                  duration: 1.8,
                  delay: 1.1,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
            <motion.span
              className="inline-flex"
              animate={done ? { rotate: [0, -14, 14, -10, 10, 0] } : { rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.1,
                repeat: Infinity,
                repeatDelay: 1.6,
                ease: "easeInOut",
              }}
            >
              <MessageCircle size={15} />
            </motion.span>
            Let&apos;s Talk
          </motion.a>

          {/* PROGRESS DOTS */}
          <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3 md:right-[2.5vw]">
            {journey.map((j, i) => (
              <div key={j.n} className="flex items-center justify-end gap-2">
                <span
                  className={`hidden text-[9px] uppercase tracking-[0.12em] transition-opacity duration-300 md:block ${
                    i === active ? "text-neutral-900 opacity-100" : "opacity-0"
                  }`}
                >
                  {j.title}
                </span>
                <span
                  className="block rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 10 : 6,
                    height: i === active ? 10 : 6,
                    background: i === active ? "#F3B51B" : "rgba(0,0,0,0.25)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* PROGRESS BAR (bottom) */}
          <motion.div
            className="absolute bottom-0 left-0 z-20 h-[2px] w-full origin-left bg-accent"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SECTION                                                             */
/* ------------------------------------------------------------------ */

export default function JourneySection() {
  return (
    // overflow-x-clip (NOT overflow-hidden): overflow-hidden breaks position: sticky
    <section className="relative overflow-x-clip bg-bg pb-[100px] pt-[100px] md:pb-[145px] md:pt-[145px]">
      {/* Background glow: screen එකේ ඉන්නකොට විතරක් loop වෙනවා */}
      <Loop
        className="pointer-events-none absolute right-[-250px] top-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.08),transparent_68%)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        rest={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        {/* HEADER (padded) */}
        <div className="px-[5vw] md:px-[6vw]">
          <h2 className="max-w-[950px] text-[clamp(40px,5vw,72px)] font-normal leading-[0.98] tracking-[-0.04em]">
            <AnimatedWords text="We build your digital system." delay={0.05} />
            <br />
            <span className="text-[#d88900]">
              <AnimatedWords text="Step by step." delay={0.3} />
            </span>
          </h2>

          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[540px] text-[15px] leading-[1.7] text-gray-500 sm:text-[18px]">
              You don&apos;t need to change everything at once. We build the
              right pieces, connect them together, and improve them as your
              business grows.
            </p>
          </Reveal>
        </div>

        {/* SCROLL-SCRUBBED FRAME STAGE */}
        <FrameStage />

        {/* BOTTOM STATEMENT (padded) */}
        <div className="px-[5vw] md:px-[6vw]">
          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-col justify-between gap-6 border-t border-black/10 pt-7 md:mt-24 md:flex-row md:items-center">
              <p className="max-w-[430px] text-[13px] leading-[1.6] text-gray-500">
                One connected system. Built around how your business actually
                works.
              </p>

              <motion.a
                href="#solutions"
                whileHover={{ y: -3 }}
                className="inline-flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.12em]"
              >
                Find your solution
                <ArrowRight size={14} />
              </motion.a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}