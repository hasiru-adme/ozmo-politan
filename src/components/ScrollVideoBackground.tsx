"use client";

import { useCallback, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const FRAME_COUNT = 80;
const CONCURRENCY = 4;

const SEGMENTS = [
  { id: "top", from: 0, to: 26 },        // HeroSection (26 frames)
  { id: "question", from: 26, to: 53 },  // QuestionSection (27 frames)
  { id: "final-cta", from: 53, to: 80 }, // FinalCtaSection (27 frames)
];

const frameSrc = (i: number, mobile: boolean) =>
  `/hero-scroll/${mobile ? "mobile/" : ""}scene_${String(i + 1).padStart(4, "0")}.webp`;

/* ------------------------------------------------------------------ */

export default function ScrollVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const indexRef = useRef(0);
  const lastDrawnRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const genRef = useRef(0);
  const visibleRef = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ok = (im?: HTMLImageElement) =>
      !!im && im.complete && im.naturalWidth > 0;

    let idx = indexRef.current;
    let img = imagesRef.current.get(idx);
    while (!ok(img) && idx > 0) {
      idx--;
      img = imagesRef.current.get(idx);
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

  /* ---------- canvas size + frames load ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gen = ++genRef.current;
    const mobile = window.innerWidth < 768;
    const images = imagesRef.current;

    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth);
      canvas.height = Math.round(canvas.clientHeight);
      lastDrawnRef.current = null;
      draw();
    };
    resize();
    window.addEventListener("resize", resize);

    let next = 0;
    const loadOne = () => {
      if (gen !== genRef.current || next >= FRAME_COUNT) return;
      const i = next++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (gen !== genRef.current) return;
        images.set(i, img);
        if (lastDrawnRef.current === null || i === indexRef.current) {
          lastDrawnRef.current = null;
          scheduleDraw();
        }
        loadOne();
      };
      img.onerror = () => loadOne();
      img.src = frameSrc(i, mobile);
    };
    for (let c = 0; c < CONCURRENCY; c++) loadOne();

    return () => {
      genRef.current++;
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      images.clear();
      lastDrawnRef.current = null;
    };
  }, [draw, scheduleDraw]);

  /* ---------- scroll: section 3ට විතරක් frame එක තීරණය කරනවා ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const update = () => {
      const vh = window.innerHeight;
      let activeSeg: (typeof SEGMENTS)[number] | null = null;
      let progress = 0;

      for (const seg of SEGMENTS) {
        const el = document.getElementById(seg.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        // section එක screen එකේ තියෙනවද?
        if (r.bottom > 0 && r.top < vh) {
          // 0 = section එක screen එකට එනකොට, 1 = ඉවත් වෙලා ඉවර වෙනකොට
          const total = r.height + vh;
          progress = Math.min(1, Math.max(0, (vh - r.top) / total));
          activeSeg = seg;
          break;
        }
      }

      // visible / hidden
      const show = !!activeSeg;
      if (show !== visibleRef.current) {
        visibleRef.current = show;
        canvas.style.opacity = show ? "1" : "0";
        if (show) {
          lastDrawnRef.current = null;
        }
      }
      if (!activeSeg) return;

      const span = activeSeg.to - activeSeg.from;
      const idx = Math.min(
        activeSeg.to - 1,
        activeSeg.from + Math.floor(progress * span)
      );
      if (idx !== indexRef.current) {
        indexRef.current = idx;
      }
      scheduleDraw();
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scheduleDraw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ opacity: 0, transition: "opacity 0.4s ease" }}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}