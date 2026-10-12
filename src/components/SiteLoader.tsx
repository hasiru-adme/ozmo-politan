"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const BRAND = "Ozmo";
const MIN_TIME = 1400; // ms: loader always shows at least this long
const MAX_TIME = 6000; // ms: never wait longer than this (slow network safety)
const SESSION_KEY = "site-loader-seen"; // only show the full loader on first visit

// Only assets needed for the FIRST screen. Edit these paths.
const IMAGES: string[] = [
  "/hero.webp", // <-- change to your Hero image(s)
  ...Array.from(
    { length: 10 },
    (_, i) => `/journey-frames/frame_${String(i + 1).padStart(3, "0")}.webp`
  ),
];

const VIDEOS: string[] = [
  "/background.mp4", // <-- change to your ScrollVideoBackground video
];

const EASE = [0.76, 0, 0.24, 1] as const;

/* ------------------------------------------------------------------ */
/* LOADERS (always resolve, even on error, so we never hang)           */
/* ------------------------------------------------------------------ */

const loadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

const loadVideo = (src: string) =>
  new Promise<void>((resolve) => {
    const v = document.createElement("video");
    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    const done = () => resolve();
    v.addEventListener("loadeddata", done, { once: true });
    v.addEventListener("canplaythrough", done, { once: true });
    v.addEventListener("error", done, { once: true });
    v.src = src;
    v.load();
  });

/* ------------------------------------------------------------------ */
/* COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export default function SiteLoader() {
  // starts TRUE so server HTML and first client render match (no hydration mismatch)
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(0);
  const reduce = useReducedMotion();

  const progress = useMotionValue(0);
  useMotionValueEvent(progress, "change", (v) => setDisplay(Math.round(v)));

  /* ---------- lock scroll while visible ---------- */
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  /* ---------- preload everything ---------- */
  useEffect(() => {
    // returning visitor in the same session -> skip loader
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        finish();
        return;
      }
    } catch {}

    let cancelled = false;
    const total = IMAGES.length + VIDEOS.length + 1; // +1 for fonts
    let done = 0;

    const tick = () => {
      done++;
      if (cancelled) return;
      animate(progress, (done / total) * 100, { duration: 0.4, ease: "easeOut" });
    };

    const track = (p: Promise<unknown>) => p.then(tick, tick);

    const assets = Promise.all([
      ...IMAGES.map((s) => track(loadImage(s))),
      ...VIDEOS.map((s) => track(loadVideo(s))),
      track(document.fonts ? document.fonts.ready : Promise.resolve()),
    ]);

    const minTime = new Promise((r) => setTimeout(r, reduce ? 300 : MIN_TIME));
    const maxTime = new Promise((r) => setTimeout(r, MAX_TIME));

    Promise.all([Promise.race([assets, maxTime]), minTime]).then(() => {
      if (cancelled) return;
      animate(progress, 100, { duration: 0.25 }).then(() => {
        if (!cancelled) finish();
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}
    setVisible(false);
    // let the rest of the site know it can start its entrance animations
    document.documentElement.dataset.loaded = "true";
    window.dispatchEvent(new Event("site:loaded"));
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-loader"
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
          initial={{ y: 0 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.4 } }
              : { y: "-100%", transition: { duration: 0.9, ease: EASE } }
          }
        >
          {/* LOGO: letter by letter */}
          <div className="flex overflow-hidden">
            {BRAND.split("").map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-[clamp(56px,10vw,120px)] font-medium leading-none tracking-[-0.05em] text-neutral-900"
              >
                {ch}
              </motion.span>
            ))}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 + BRAND.length * 0.08, type: "spring", stiffness: 300, damping: 14 }}
              className="mb-[0.18em] ml-1 mt-auto h-[clamp(8px,1.2vw,14px)] w-[clamp(8px,1.2vw,14px)] rounded-full bg-[#F3B51B]"
            />
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-10 h-[2px] w-[min(240px,60vw)] overflow-hidden rounded bg-black/10">
            <motion.div
              className="h-full origin-left bg-[#F3B51B]"
              style={{ scaleX: display / 100 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* COUNTER */}
          <p className="mt-4 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            {String(display).padStart(3, "0")} / 100
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}