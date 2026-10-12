"use client";

import { useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import styles from "./Hero.module.css";

/*
 * The single Lenis instance is created in SmoothScroll.tsx and exposed
 * as window.__lenis. Hero only READS from it (type-only import above,
 * so no second Lenis is ever created here).
 */
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/* =========================================================
   OZMO HERO CONFIG
   ========================================================= */

export type HeroConfig = {
  folder: string;
  prefix: string;
  pad: number;
  ext: string;

  startFrame: number;
  frameCount: number;
  frameStep: number;

  maxWidth: number;

  reassemble: boolean;

  explodeStart: number;
  explodeEnd: number;
  reassembleStart: number;

  zoom: number;

  featherX: number;
  featherY: number;

  /* NEW: pointer parallax. Set maxShiftX/Y to 0 to disable entirely. */
  parallaxMaxShiftX: number;
  parallaxMaxShiftY: number;
};

const DEFAULT_CONFIG: HeroConfig = {
  folder: "/images/ozmo-frames/",
  prefix: "ezgif-frame-",
  pad: 3,
  ext: ".jpg",

  startFrame: 1,

  /* Source: 001 → 300 */
  frameCount: 300,

  /*
   * Load every 2nd frame (150 frames). Neighbouring-frame blending
   * keeps it smooth, and memory use is halved.
   * Try 3 if it is still heavy on phones.
   */
  frameStep: 2,

  /* Maximum decoded width. */
  maxWidth: 960,

  /* Reassemble near the end. */
  reassemble: true,

  /* Animation timing. */
  explodeStart: 0.05,
  explodeEnd: 0.68,
  reassembleStart: 0.86,

  zoom: 1,

  featherX: 6,
  featherY: 8,

  /* Subtle mouse-driven depth. Desktop + fine pointer only. */
  parallaxMaxShiftX: 16,
  parallaxMaxShiftY: 10,
};

type Props = {
  config?: Partial<HeroConfig>;
  ctaHref?: string;
  specsHref?: string;
};

type Frame = ImageBitmap | HTMLImageElement;

type BeatDef = {
  a: number;
  b: number;
  inF: number;
  outF: number;
  type: "center-up" | "left" | "right";
  hold?: boolean;
};

/* =========================================================
   STORY BEATS
   ========================================================= */

const BEATS: BeatDef[] = [
  { a: 0.0, b: 0.14, inF: 0, outF: 0.04, type: "center-up" },
  { a: 0.17, b: 0.38, inF: 0.05, outF: 0.04, type: "left" },
  { a: 0.42, b: 0.63, inF: 0.05, outF: 0.04, type: "right" },
  { a: 0.67, b: 0.83, inF: 0.05, outF: 0.03, type: "left" },
  { a: 0.88, b: 1.01, inF: 0.05, outF: 0, type: "center-up", hold: true },
];

/* =========================================================
   NAVIGATION
   ========================================================= */

const NAV_LINKS = [
  { label: "Overview", go: 0 },
  { label: "Solutions", go: 0.22 },
  { label: "Automation", go: 0.5 },
  { label: "Growth", go: 0.75 },
  { label: "Explore", go: 0.98 },
];

/* =========================================================
   HELPERS
   ========================================================= */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const smooth = (t: number) => t * t * (3 - 2 * t);

const fw = (im: Frame) => ("naturalWidth" in im ? im.naturalWidth : im.width);

const fh = (im: Frame) =>
  "naturalHeight" in im ? im.naturalHeight : im.height;

/* =========================================================
   COMPONENT
   ========================================================= */

export default function Hero({
  config,
  ctaHref = "#",
  specsHref = "#",
}: Props) {
  /* Freeze config on first render. */
  const cfgRef = useRef<HeroConfig>({ ...DEFAULT_CONFIG, ...config });

  /* ---------- refs ---------- */
  const navRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const seqRef = useRef<HTMLCanvasElement | null>(null);
  const bgRef = useRef<HTMLCanvasElement | null>(null);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const progRef = useRef<HTMLElement | null>(null);
  const goToRef = useRef<(p: number) => void>(() => {});

  /* ---------- state ---------- */
  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [failedUrl, setFailedUrl] = useState("");
  /* NEW: tiny upscaled preview of the first frame, shown behind the loader
     so the loading state feels like a "blur-up" rather than a blank screen. */
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* =======================================================
     MAIN EFFECT
     ======================================================= */

  useEffect(() => {
    const cfg = cfgRef.current;
    const canvas = seqRef.current;
    const bgCanvas = bgRef.current;
    const story = storyRef.current;

    if (!canvas || !bgCanvas || !story) return;

    /* ---------- canvas contexts ---------- */
    const ctx = canvas.getContext("2d", { alpha: true });
    const bgCtx = bgCanvas.getContext("2d", { alpha: true });

    if (!ctx || !bgCtx) return;

    let cancelled = false;
    let raf = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    /* ---------- frame storage ---------- */
    const frames: Frame[] = [];
    let lastIndex = 0;
    let previewCaptured = false;

    /* ---------- canvas size ---------- */
    let cssW = 0;
    let cssH = 0;

    /* ---------- frame position ---------- */
    let current = 0;
    let target = 0;

    /* ---------- scroll ---------- */
    let storyTop = 0;
    let scrollRange = 1;
    let ready = false;
    let lastY = -1;
    let lastT = 0;

    /* ---------- draw state ---------- */
    let lastDrawn = -999;

    /* ---------- tab visibility ---------- */
    let tabHidden = document.hidden;

    /* ---------- feather ---------- */
    let feather: {
      fx: number;
      fy: number;
      left: CanvasGradient;
      right: CanvasGradient;
      top: CanvasGradient;
      bottom: CanvasGradient;
    } | null = null;

    /* ---------- reduced motion ---------- */
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ---------- pointer parallax ---------- */
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const parallaxEnabled =
      !reduce &&
      !coarsePointer &&
      (cfg.parallaxMaxShiftX > 0 || cfg.parallaxMaxShiftY > 0);

    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    /*
     * Scroll position. Uses the shared Lenis instance (smoothed value)
     * when present, otherwise the native scroll position.
     */
    const getY = () => window.__lenis?.scroll ?? window.scrollY;

    /* =====================================================
       LOAD IMAGE
       ===================================================== */

    const loadImg = (url: string): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => resolve(im);
        im.onerror = () => resolve(null);
        im.src = url;
      });

    /* =====================================================
       LOAD FRAME
       ===================================================== */

    const loadFrame = async (url: string): Promise<Frame | null> => {
      const im = await loadImg(url);
      if (!im) return null;

      /* Use ImageBitmap where supported. */
      if (typeof createImageBitmap !== "function") return im;

      try {
        const iw = im.naturalWidth;
        const ih = im.naturalHeight;

        if (!iw || !ih) return im;

        const scale = Math.min(1, cfg.maxWidth / iw);

        if (scale < 1) {
          return await createImageBitmap(im, {
            resizeWidth: Math.round(iw * scale),
            resizeHeight: Math.round(ih * scale),
            resizeQuality: "high",
          });
        }

        return await createImageBitmap(im);
      } catch {
        return im;
      }
    };

    /* =====================================================
       FRAME URL
       ===================================================== */

    const makeUrl = (n: number) =>
      cfg.folder + cfg.prefix + String(n).padStart(cfg.pad, "0") + cfg.ext;

    /* =====================================================
       MEASURE
       ===================================================== */

    const measure = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;

      storyTop = story.getBoundingClientRect().top + window.scrollY;

      scrollRange = Math.max(1, story.offsetHeight - cssH);
    };

    /* =====================================================
       SIZE CANVAS
       ===================================================== */

    const sizeCanvas = () => {
      measure();

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      /* Small blurred background. */
      bgCanvas.width = 64;
      bgCanvas.height = Math.max(
        16,
        Math.round((64 * cssH) / Math.max(cssW, 1))
      );

      const im = frames[0];
      if (!im) return;

      const iw = fw(im);
      const ih = fh(im);

      /* Cover viewport. */
      const scale = Math.max(cssW / iw, cssH / ih) * cfg.zoom;

      const w = iw * scale;
      const h = ih * scale;

      /* CSS dimensions. */
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.left = `${(cssW - w) / 2}px`;
      canvas.style.top = `${(cssH - h) / 2}px`;

      /*
       * NEW: baseline transform. A small permanent scale gives the
       * parallax pan below some headroom so it never reveals an edge.
       * translate3d keeps this on its own compositor layer.
       */
      const baseScale = parallaxEnabled ? 1.035 : 1;
      canvas.style.transform = `translate3d(0,0,0) scale(${baseScale})`;
      bgCanvas.style.transform = parallaxEnabled
        ? "translate3d(0,0,0) scale(1.06)"
        : "translate3d(0,0,0)";

      /* Actual canvas resolution. */
      canvas.width = Math.max(1, Math.min(Math.round(w * dpr), iw));
      canvas.height = Math.max(1, Math.min(Math.round(h * dpr), ih));

      /* ---------- feather ---------- */
      const cw = canvas.width;
      const ch = canvas.height;

      const fx = (cw * cfg.featherX) / 100;
      const fy = (ch * cfg.featherY) / 100;

      const makeGradient = (
        x0: number,
        y0: number,
        x1: number,
        y1: number
      ) => {
        const g = ctx.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        return g;
      };

      feather = {
        fx,
        fy,
        left: makeGradient(0, 0, fx, 0),
        right: makeGradient(cw, 0, cw - fx, 0),
        top: makeGradient(0, 0, 0, fy),
        bottom: makeGradient(0, ch, 0, ch - fy),
      };

      lastDrawn = -999;
    };

    /* =====================================================
       FRAME PROGRESS
       ===================================================== */

    const frameProgress = (p: number) => {
      const { explodeStart, explodeEnd, reassembleStart, reassemble } = cfg;

      /* Before animation. */
      if (p <= explodeStart) return 0;

      /* Main animation. */
      if (p < explodeEnd) {
        const t = clamp((p - explodeStart) / (explodeEnd - explodeStart));
        return t * 0.45 + smooth(t) * 0.55;
      }

      /* Hold exploded state. */
      if (p < reassembleStart || !reassemble) return 1;

      /* Reassemble. */
      const t = clamp((p - reassembleStart) / (1 - reassembleStart));
      const eased = t * 0.45 + smooth(t) * 0.55;

      return 1 - eased;
    };

    /* =====================================================
       TEXT BEATS
       ===================================================== */

    const updateBeats = (p: number) => {
      let activeIndex = 0;

      BEATS.forEach((beat, index) => {
        /* Track which beat has most recently started — used for the dots. */
        if (p >= beat.a - 0.01) activeIndex = index;

        const el = beatRefs.current[index];
        if (!el) return;

        /* Fade in. */
        const inT = beat.inF
          ? smooth(clamp((p - beat.a) / beat.inF))
          : p >= beat.a
          ? 1
          : 0;

        /* Fade out. */
        const outT =
          beat.hold || !beat.outF
            ? 1
            : smooth(clamp((beat.b - p) / beat.outF));

        const opacity = inT * outT;

        /* Position. */
        let x = 0;
        let y = 0;

        if (beat.type === "left") {
          x = -(1 - inT) * 56 - (1 - outT) * 28;
        }

        if (beat.type === "right") {
          x = (1 - inT) * 56 + (1 - outT) * 28;
        }

        if (beat.type === "center-up") {
          y = (1 - inT) * 28 - (1 - outT) * 24;
        }

        /* Apply. */
        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(
          1
        )}px, 0)`;

        el.classList.toggle(styles.on, opacity > 0.6);
      });

      /* NEW: highlight the active section dot. Direct DOM writes to
         match the rest of this loop — no React state, no extra renders. */
      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const active = i === activeIndex;
        dot.style.background = active
          ? "rgba(255,255,255,0.95)"
          : "rgba(255,255,255,0.25)";
        dot.style.transform = active ? "scale(1.4)" : "scale(1)";
      });
    };

    /* =====================================================
       UPDATE FROM SCROLL
       ===================================================== */

    const updateFromScroll = (y: number) => {
      /* Scroll position → 0..1 story progress. */
      const p = clamp((y - storyTop) / scrollRange);

      /* Progress → frame position. */
      target = frameProgress(p) * lastIndex;

      /* Text. */
      updateBeats(p);

      /* Progress bar. */
      if (progRef.current) {
        progRef.current.style.height = `${p * 100}%`;
      }

      /* Scroll hint. */
      if (hintRef.current) {
        hintRef.current.style.opacity = p < 0.03 ? "1" : "0";
      }

      /* Navigation state. */
      navRef.current?.classList.toggle(styles.scrolled, y > 40);
    };

    /* =====================================================
       RENDER FRAME
       ===================================================== */

    const render = (pos: number) => {
      if (!frames.length) return;

      const safePos = clamp(pos, 0, lastIndex);
      const i = Math.floor(safePos);
      const f = safePos - i;

      const a = frames[i];
      const b = frames[Math.min(i + 1, lastIndex)];

      if (!a) return;

      const cw = canvas.width;
      const ch = canvas.height;

      if (!cw || !ch) return;

      /* Smooth neighbouring-frame blend. */
      const blendAmount = smooth(f);

      /* ---------- main canvas ---------- */
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(a, 0, 0, cw, ch);

      if (b && b !== a && blendAmount > 0.001) {
        ctx.globalAlpha = blendAmount;
        ctx.drawImage(b, 0, 0, cw, ch);
        ctx.globalAlpha = 1;
      }

      /* ---------- feather ---------- */
      if (feather) {
        ctx.globalCompositeOperation = "destination-out";

        ctx.fillStyle = feather.left;
        ctx.fillRect(0, 0, feather.fx, ch);

        ctx.fillStyle = feather.right;
        ctx.fillRect(cw - feather.fx, 0, feather.fx, ch);

        ctx.fillStyle = feather.top;
        ctx.fillRect(0, 0, cw, feather.fy);

        ctx.fillStyle = feather.bottom;
        ctx.fillRect(0, ch - feather.fy, cw, feather.fy);

        ctx.globalCompositeOperation = "source-over";
      }

      /* ---------- background canvas ---------- */
      const bw = bgCanvas.width;
      const bh = bgCanvas.height;

      const sourceW = fw(a);
      const sourceH = fh(a);

      const bgScale = Math.max(bw / sourceW, bh / sourceH);
      const bgW = sourceW * bgScale;
      const bgH = sourceH * bgScale;

      bgCtx.clearRect(0, 0, bw, bh);
      bgCtx.globalAlpha = 1;
      bgCtx.drawImage(a, (bw - bgW) / 2, (bh - bgH) / 2, bgW, bgH);

      if (b && b !== a && blendAmount > 0.001) {
        bgCtx.globalAlpha = blendAmount;
        bgCtx.drawImage(b, (bw - bgW) / 2, (bh - bgH) / 2, bgW, bgH);
        bgCtx.globalAlpha = 1;
      }
    };

    /* =====================================================
       MAIN ANIMATION LOOP
       ===================================================== */

    const tick = (time: number) => {
      const dt = Math.min(64, time - (lastT || time));
      lastT = time;

      /* Only recompute story state when scroll actually changed. */
      const y = getY();
      if (y !== lastY) {
        lastY = y;
        updateFromScroll(y);
      }

      /* NEW: ease the pointer parallax and apply it as a transform.
         Skipped entirely on touch devices / reduced-motion. */
      if (parallaxEnabled && ready) {
        const k = 1 - Math.pow(1 - 0.08, dt / 16.67);
        pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * k;
        pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * k;

        const px = pointerCurrent.x * cfg.parallaxMaxShiftX;
        const py = pointerCurrent.y * cfg.parallaxMaxShiftY;

        canvas.style.transform = `translate3d(${px.toFixed(
          1
        )}px, ${py.toFixed(1)}px, 0) scale(1.035)`;
        bgCanvas.style.transform = `translate3d(${(px * 0.4).toFixed(
          1
        )}px, ${(py * 0.4).toFixed(1)}px, 0) scale(1.06)`;
      }

      /* NEW: skip decode/draw work while the tab isn't visible. */
      if (ready && !tabHidden) {
        if (reduce) {
          current = target;
        } else {
          /*
           * Frame-rate independent, light smoothing.
           * Lenis already smooths the scroll itself, so this
           * only needs to soften the frame steps a little.
           */
          const k = 1 - Math.pow(1 - 0.22, dt / 16.67);
          current += (target - current) * k;

          if (Math.abs(target - current) < 0.002) {
            current = target;
          }
        }

        /* Only redraw when needed. */
        if (Math.abs(current - lastDrawn) > 0.003) {
          render(current);
          lastDrawn = current;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    /* =====================================================
       NAVIGATION
       ===================================================== */

    goToRef.current = (p: number) => {
      /* Refresh dimensions before calculating destination. */
      measure();

      const top = storyTop + scrollRange * clamp(p);

      if (window.__lenis) {
        window.__lenis.scrollTo(top, {
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
          force: true,
        });
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    /* =====================================================
       RESIZE
       ===================================================== */

    /*
     * Mobile address-bar show/hide fires resize events (height only).
     * Reallocating the canvas mid-scroll causes stutter, so only
     * react when the width really changes.
     */
    let lastW = window.innerWidth;

    const onResize = () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;

      sizeCanvas();
      lastY = -1; /* force target recalculation on next tick */

      if (ready) render(current);
    };

    /* =====================================================
       POINTER PARALLAX (NEW)
       ===================================================== */

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    if (parallaxEnabled) {
      window.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
    }

    /* =====================================================
       TAB VISIBILITY (NEW)
       ===================================================== */

    const onVisibility = () => {
      tabHidden = document.hidden;
    };

    document.addEventListener("visibilitychange", onVisibility);

    /* =====================================================
       KEYBOARD NAVIGATION (NEW)
       ===================================================== */

    const onKeyDown = (e: KeyboardEvent) => {
      if (!ready) return;

      const forward = e.key === "ArrowDown" || e.key === "PageDown";
      const backward = e.key === "ArrowUp" || e.key === "PageUp";

      if (!forward && !backward) return;

      e.preventDefault();

      const p = clamp((getY() - storyTop) / scrollRange);

      let idx = 0;
      for (let i = 0; i < BEATS.length; i++) {
        if (p >= BEATS[i].a - 0.01) idx = i;
      }

      idx = forward
        ? Math.min(BEATS.length - 1, idx + 1)
        : Math.max(0, idx - 1);

      goToRef.current(BEATS[idx].a + 0.01);
    };

    window.addEventListener("keydown", onKeyDown);

    /* =====================================================
       LOAD ALL FRAMES
       ===================================================== */

    const loadAll = async () => {
      const step = Math.max(1, cfg.frameStep | 0);
      const first = cfg.startFrame;
      const last = first + cfg.frameCount - 1;

      const expected = Math.max(1, Math.ceil((last - first + 1) / step));

      /* Loading chunks. */
      const CHUNK = 8;

      let n = first;
      let ended = false;

      while (!ended && n <= last) {
        const nums: number[] = [];

        for (let i = 0; i < CHUNK; i++) {
          const k = n + i * step;
          if (k <= last) nums.push(k);
        }

        const imgs = await Promise.all(
          nums.map((k) => loadFrame(makeUrl(k)))
        );

        if (cancelled) {
          imgs.forEach((im) => {
            if (im && "close" in im) im.close();
          });
          return;
        }

        for (const im of imgs) {
          if (!im) {
            ended = true;
            break;
          }
          frames.push(im);

          /* NEW: capture a tiny upscaled preview from the very first
             frame, for the blur-up loader background. */
          if (!previewCaptured) {
            previewCaptured = true;
            try {
              const tw = 28;
              const iw = fw(im);
              const ih = fh(im);
              const th = Math.max(1, Math.round((tw * ih) / Math.max(iw, 1)));

              const tCanvas = document.createElement("canvas");
              tCanvas.width = tw;
              tCanvas.height = th;

              const tCtx = tCanvas.getContext("2d");
              if (tCtx) {
                tCtx.drawImage(im, 0, 0, tw, th);
                setPreviewUrl(tCanvas.toDataURL("image/jpeg", 0.6));
              }
            } catch {
              /* Non-essential — ignore failures (e.g. CORS-tainted canvas). */
            }
          }
        }

        n += CHUNK * step;

        /* Loading percentage. */
        setPct(
          Math.min(99, Math.round((frames.length / expected) * 100))
        );
      }

      /* ---------- no frames ---------- */
      if (!frames.length) {
        setFailedUrl(makeUrl(first));
        setStatus("error");
        return;
      }

      /* ---------- ready ---------- */
      lastIndex = frames.length - 1;

      sizeCanvas();

      setPct(100);
      setStatus("ready");

      canvas.classList.add(styles.ready);

      ready = true;

      /* Initial position. */
      const y = getY();
      lastY = y;
      updateFromScroll(y);

      /* Start immediately at the correct frame. */
      current = target;
      lastDrawn = -999;

      render(current);

      /* Hide loader. */
      hideTimer = setTimeout(() => {
        setLoaderHidden(true);
      }, 250);
    };

    /* =====================================================
       INIT
       ===================================================== */

    measure();

    window.addEventListener("resize", onResize);

    /* Start animation loop. */
    raf = requestAnimationFrame(tick);

    /* Start frame loading. */
    loadAll();

    /* =====================================================
       CLEANUP
       ===================================================== */

    return () => {
      cancelled = true;

      cancelAnimationFrame(raf);

      if (hideTimer) clearTimeout(hideTimer);

      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);

      if (parallaxEnabled) {
        window.removeEventListener("pointermove", onPointerMove);
      }

      /* Release ImageBitmaps. */
      frames.forEach((im) => {
        if ("close" in im) im.close();
      });

      frames.length = 0;
    };
  }, []);

  /* =======================================================
     BEAT REF
     ======================================================= */

  const setBeat = (i: number) => (el: HTMLElement | null) => {
    beatRefs.current[i] = el;
  };

  /* =======================================================
     DOT REF (NEW)
     ======================================================= */

  const setDot = (i: number) => (el: HTMLButtonElement | null) => {
    dotRefs.current[i] = el;
  };

  /* =======================================================
     JSX
     ======================================================= */

  return (
    <div className={styles.root}>
      {/* ================= LOADER ================= */}

      <div
        className={`${styles.loader} ${loaderHidden ? styles.done : ""}`}
        role="status"
        style={
          previewUrl
            ? {
                backgroundImage: `linear-gradient(rgba(8,8,10,0.65), rgba(8,8,10,0.65)), url(${previewUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {status !== "error" && (
          <>
            <div className={styles.loaderBar}>
              <i style={{ width: `${pct}%` }} />
            </div>

            <p className={styles.loaderText}>
              {status === "ready"
                ? "Ready"
                : `Building your experience… ${pct}%`}
            </p>
          </>
        )}

        {status === "error" && (
          <p className={styles.loaderErr}>
            Ozmo experience frames could not be loaded.
            <br />
            <br />
            First file tried:
            <br />
            <code>{failedUrl}</code>
            <br />
            <br />
            Check that the folder and frame names match the Hero
            configuration.
            <br />
            <br />
            Example:
            <br />
            <code>/images/ozmo-frames/ezgif-frame-001.jpg</code>
          </p>
        )}
      </div>

      {/* ================= NAVIGATION ================= */}

      <header className={styles.nav} ref={navRef}>
        <a
          href="#"
          className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            goToRef.current(0);
          }}
        >
          OZMO
        </a>

        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  goToRef.current(link.go);
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.ctaWrap}>
          <a
            href="#"
            className={styles.btnOutline}
            onClick={(e) => {
              e.preventDefault();
              goToRef.current(0.98);
            }}
          >
            Explore Ozmo
          </a>
        </div>
      </header>

      {/* ================= STORY ================= */}

      <main className={styles.story} ref={storyRef}>
        <div className={styles.stage}>
          {/* Background */}
          <canvas className={styles.bg} ref={bgRef} aria-hidden="true" />

          {/* Main frame sequence */}
          <canvas
            className={styles.seq}
            ref={seqRef}
            role="img"
            aria-label="Ozmo digital business systems experience"
          />

          {/* ---------- HERO ---------- */}
          <section
            className={`${styles.beat} ${styles.beatHero}`}
            ref={setBeat(0)}
          >
            <h1>Build a smarter business.</h1>

            <p className={styles.lead}>Your business has enough to manage.</p>

            <p className={styles.sub}>
              Ozmo brings your website, automation, AI, and digital systems
              together — so everything works better, together.
            </p>
          </section>

          {/* ---------- DIGITAL SOLUTIONS ---------- */}
          <section
            className={`${styles.beat} ${styles.beatLeft}`}
            ref={setBeat(1)}
          >
            <h2>Everything your business needs, connected.</h2>

            <p>
              From websites and customer journeys to internal systems and
              integrations, Ozmo builds digital solutions around the way
              your business actually works.
            </p>

            <p>
              Modern websites. Custom systems. Smart integrations. One
              connected digital foundation.
            </p>
          </section>

          {/* ---------- AUTOMATION + AI ---------- */}
          <section
            className={`${styles.beat} ${styles.beatRight}`}
            ref={setBeat(2)}
          >
            <h2>Turn repetitive work into intelligent systems.</h2>

            <ul className={styles.points}>
              <li>Capture enquiries automatically.</li>
              <li>Follow up with customers without the manual work.</li>
              <li>Connect your tools, data, and everyday workflows.</li>
              <li>Add AI where it actually makes a difference.</li>
            </ul>
          </section>

          {/* ---------- DATA + GROWTH ---------- */}
          <section
            className={`${styles.beat} ${styles.beatLeft}`}
            ref={setBeat(3)}
          >
            <h2>Know what&apos;s happening. Know what to do next.</h2>

            <p>
              Your digital systems should do more than run. They should help
              you understand your business.
            </p>

            <p>
              Connect your data, customer activity, and performance into one
              clearer view — built for better decisions.
            </p>
          </section>

          {/* ---------- CTA ---------- */}
          <section
            className={`${styles.beat} ${styles.beatCta}`}
            ref={setBeat(4)}
          >
            <h2>
              Your business.
              <br />
              Better connected.
            </h2>

            <p className={styles.sub}>
              Build the right digital system for the way your business works.
            </p>

            <div className={styles.ctaRow}>
              <a href={ctaHref} className={styles.btnPrimary}>
                Explore Ozmo
              </a>

              <a href={specsHref} className={styles.linkSec}>
                See how it works →
              </a>
            </div>

            <p className={styles.micro}>
              Built for growing businesses. Designed to simplify. Engineered
              to scale.
            </p>
          </section>

          {/* ---------- SCROLL HINT ---------- */}
          <div className={styles.scrollHint} ref={hintRef}>
            <span>Scroll</span>
            <i />
          </div>

          {/* ---------- PROGRESS ---------- */}
          <div className={styles.progress}>
            <i ref={progRef} />
          </div>

          {/* ---------- SECTION DOTS (NEW) ---------- */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              zIndex: 40,
            }}
          >
            {BEATS.map((beat, i) => (
              <button
                key={i}
                ref={setDot(i)}
                type="button"
                onClick={() => goToRef.current(beat.a + 0.01)}
                aria-label={`Go to section ${i + 1}`}
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.55)",
                  background: "rgba(255,255,255,0.25)",
                  padding: 0,
                  cursor: "pointer",
                  transition: "transform 0.25s ease, background 0.25s ease",
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}