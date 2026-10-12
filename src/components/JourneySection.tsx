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

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const TOTAL_FRAMES = 100;

// Real frame index (0-based) where each scene starts (after skipping dissolves).
const CARD_START_FRAMES = [0, 17, 34, 50, 67, 84];

// Dissolve / transition frames to skip (inclusive index ranges).
// Turn DEBUG on, scroll, and note where the ghosting starts and ends.
const SKIP_RANGES: [number, number][] = [
  [14, 16],
  [31, 33],
  [47, 49],
  [64, 66],
  [81, 83],
];

// List of real frames that are actually shown while scrolling
const FRAME_MAP = Array.from({ length: TOTAL_FRAMES }, (_, i) => i).filter(
  (i) => !SKIP_RANGES.some(([a, b]) => i >= a && i <= b)
);

const FIRST_BATCH = 10; // frames loaded first (loader waits for these)
const CHUNK_SIZE = 8; // remaining frames loaded in parallel chunks

// 0.05 = very smooth / laggy, 0.2 = snappy
const SMOOTHNESS = 0.1;

// Scroll progress (0..1) after which the end buttons appear
const END_THRESHOLD = 0.94;

// Show the current frame index on screen (use only while calibrating)
const DEBUG = false;

// Blend neighbouring frames. false = no ghosting from the code side
const BLEND = false;

// Overlay text/icon on top of the video. false = video's own text is used
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
    once: false,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 35, filter: "blur(8px)" }
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

function AnimatedWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-flex flex-wrap gap-x-[0.22em]">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
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
  const trackRef = useRef<HTMLDivElement>(null); // tall scroll container
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(TOTAL_FRAMES).fill(null)
  );

  const posRef = useRef(0); // real frame position
  const drawnKeyRef = useRef(-1); // key of last drawn state (skip duplicate draws)
  const targetRef = useRef(0); // scroll progress 0..1
  const currentRef = useRef(0); // eased progress 0..1
  const loopRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [frameIdx, setFrameIdx] = useState(0);
  const [done, setDone] = useState(false); // journey finished -> show end buttons

  /* ---------- draw helper (object-fit: cover) ---------- */
  const drawCover = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    cw: number,
    ch: number,
    alpha: number
  ) => {
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  /* ---------- draw: single frame, or blended with the next one ---------- */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // BLEND off -> snap to the nearest whole frame (no ghosting)
    const pos = BLEND ? posRef.current : Math.round(posRef.current);
    const i0 = Math.floor(pos);
    const i1 = Math.min(i0 + 1, TOTAL_FRAMES - 1);
    let t = pos - i0;

    // base frame: nearest loaded frame going backwards
    let b = i0;
    while (b > 0 && !imagesRef.current[b]) b--;
    const img0 = imagesRef.current[b];
    if (!img0) return;

    // next frame only if blending is on and it's loaded
    const img1 = BLEND && i1 !== i0 ? imagesRef.current[i1] : null;
    if (!img1) t = 0;

    // skip redraw if nothing visibly changed (quantize blend to 1/64 steps)
    const tq = Math.round(t * 64);
    const key = b * 1000 + i1 * 10 + tq * 100000;
    if (drawnKeyRef.current === key) return;
    drawnKeyRef.current = key;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, cw, ch);
    drawCover(ctx, img0, cw, ch, 1);
    if (img1 && t > 0.001) {
      drawCover(ctx, img1, cw, ch, t);
    }
    ctx.globalAlpha = 1;
  }, []);

  /* ---------- canvas resize (DPR aware) ---------- */
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      drawnKeyRef.current = -1; // force redraw after resize
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  /* ---------- preload frames ---------- */
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    let cancelled = false;
    let count = 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve();
          imagesRef.current[i] = img;
          count++;
          setLoaded(count);
          drawnKeyRef.current = -1;
          draw();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = framePath(i, mobile);
      });

    (async () => {
      // 1) first batch
      await Promise.all(Array.from({ length: FIRST_BATCH }, (_, i) => load(i)));
      if (cancelled) return;
      setReady(true);
      draw();

      // 2) the rest, in small chunks so we don't choke the network
      const rest = Array.from(
        { length: TOTAL_FRAMES - FIRST_BATCH },
        (_, i) => i + FIRST_BATCH
      );
      for (let k = 0; k < rest.length; k += CHUNK_SIZE) {
        if (cancelled) return;
        await Promise.all(rest.slice(k, k + CHUNK_SIZE).map(load));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [draw]);

  /* ---------- scroll -> target -> eased loop -> frame ---------- */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const apply = useCallback(
    (p: number) => {
      const clamped = Math.min(Math.max(p, 0), 1);
      // map scroll progress onto the list of frames we actually show
      const mapPos = clamped * (FRAME_MAP.length - 1);
      const actual = FRAME_MAP[Math.round(mapPos)]; // real frame number
      posRef.current = actual;
      draw();

      if (DEBUG) setFrameIdx((prev) => (prev === actual ? prev : actual));

      let a = 0;
      for (let i = 0; i < CARD_START_FRAMES.length; i++) {
        if (actual >= CARD_START_FRAMES[i]) a = i;
      }
      setActive((prev) => (prev === a ? prev : a));

      // journey finished -> show the left/right buttons
      const finished = clamped >= END_THRESHOLD;
      setDone((prev) => (prev === finished ? prev : finished));
    },
    [draw]
  );

  const tick = useCallback(
    (now: number) => {
      // normalize to 60fps so it feels the same on 60Hz / 120Hz screens
      const dt = Math.min((now - lastTimeRef.current) / 16.667, 3);
      lastTimeRef.current = now;

      const diff = targetRef.current - currentRef.current;

      if (Math.abs(diff) < 0.00005) {
        currentRef.current = targetRef.current;
        apply(currentRef.current);
        loopRef.current = null;
        return;
      }

      const factor = 1 - Math.pow(1 - SMOOTHNESS, dt);
      currentRef.current += diff * factor;
      apply(currentRef.current);
      loopRef.current = requestAnimationFrame(tick);
    },
    [apply]
  );

  const startLoop = useCallback(() => {
    if (loopRef.current === null) {
      lastTimeRef.current = performance.now();
      loopRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    targetRef.current = v;
    startLoop();
  });

  useEffect(() => {
    targetRef.current = scrollYProgress.get();
    currentRef.current = targetRef.current;
    apply(currentRef.current);
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = journey[active];
  const Icon = current.Icon;
  const percent = Math.round((loaded / TOTAL_FRAMES) * 100);

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

          {/* DEBUG: frame index */}
          {DEBUG && (
            <div className="absolute left-1/2 top-4 z-40 -translate-x-1/2 rounded bg-black px-3 py-1 text-xs text-white">
              frame index: {frameIdx} (file: frame_
              {String(frameIdx + 1).padStart(3, "0")})
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
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-center text-[10px] uppercase tracking-[0.13em] text-neutral-500">
                    Loading {percent}%
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* OVERLAY: top bar + active card (hidden when video has its own text) */}
          {SHOW_OVERLAY && (
            <>
              {/* TOP BAR: number + label */}
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

              {/* ACTIVE CARD CONTENT */}
              <div className="absolute bottom-8 left-[5vw] right-[5vw] z-10 flex items-end justify-between gap-6 md:bottom-10 md:left-[6vw] md:right-[6vw]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.title}
                    initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="text-[40px] leading-none tracking-[-0.04em] text-neutral-900 sm:text-[56px] md:text-[72px]">
                      {current.title}
                    </h3>
                    <p className="mt-3 max-w-[340px] text-[13px] leading-[1.6] text-neutral-700 md:text-[16px]">
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
                    className="grid h-[68px] w-[68px] shrink-0 place-items-center rounded-[18px] border border-black/10 bg-white/50 text-neutral-900 backdrop-blur-md md:h-[84px] md:w-[84px]"
                  >
                    <Icon size={32} strokeWidth={1.5} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}

          {/* END BUTTON: LEFT (Packages) — slides in, then pulses to get attention */}
          <motion.a
            href="#packages"
            initial={false}
            animate={
              done
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: -50, filter: "blur(6px)" }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={done ? { y: -3 } : undefined}
            whileTap={done ? { scale: 0.97 } : undefined}
            style={{ pointerEvents: done ? "auto" : "none" }}
            tabIndex={done ? 0 : -1}
            aria-hidden={!done}
            className="absolute bottom-8 left-[5vw] z-20 inline-flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 text-[14px] font-bold text-black shadow-[0_12px_30px_rgba(243,181,27,0.3)] md:bottom-10 md:left-[6vw] md:px-6 md:py-4 md:text-xs"
          >
            {/* pulse ring */}
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
            {/* arrow nudges forward */}
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

          {/* END BUTTON: RIGHT (Let's Talk) — slides in, then pulses to get attention */}
          <motion.a
            href="#contact"
            initial={false}
            animate={
              done
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: 50, filter: "blur(6px)" }
            }
            transition={{ duration: 0.6, delay: done ? 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
            whileHover={done ? { y: -3 } : undefined}
            whileTap={done ? { scale: 0.97 } : undefined}
            style={{ pointerEvents: done ? "auto" : "none" }}
            tabIndex={done ? 0 : -1}
            aria-hidden={!done}
            className="absolute bottom-8 right-[5vw] z-20 inline-flex items-center gap-2.5 rounded-full bg-black px-5 py-3.5 text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] md:bottom-10 md:right-[6vw] md:px-6 md:py-4 md:text-xs"
          >
            {/* pulse ring */}
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
            {/* icon wiggles */}
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
    <section
      id="journey"
      className="relative overflow-x-clip bg-bg pb-[100px] pt-[100px] md:pb-[145px] md:pt-[145px]"
    >
      {/* Background glow */}
      <motion.div
        className="pointer-events-none absolute right-[-250px] top-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.08),transparent_68%)]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10">
        {/* HEADER (padded) */}
        <div className="px-[5vw] md:px-[6vw]">
          {/* <Reveal>
            <div className="mb-5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.13em] text-gray-500">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 18 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6 }}
                className="block h-0.5 shrink-0 bg-accent"
              />
              The solution journey
            </div>
          </Reveal> */}

          <h2 className="max-w-[950px] text-[clamp(40px,5vw,72px)] font-normal leading-[0.98] tracking-[-0.04em]">
            <AnimatedWords text="We build your digital system." delay={0.05} />
            <br />
            <span className="text-[#a57950]">
              <AnimatedWords text="Step by step." delay={0.3} />
            </span>
          </h2>

          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[540px] text-[15px] leading-[1.7] text-gray-500 sm:text-base">
              You don&apos;t need to change everything at once. We build the
              right pieces, connect them together, and improve them as your
              business grows.
            </p>
          </Reveal>
        </div>

        {/* SCROLL-SCRUBBED FRAME STAGE (full width, no padding) */}
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
                href="#needs"
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