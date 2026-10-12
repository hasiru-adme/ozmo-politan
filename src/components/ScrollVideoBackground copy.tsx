"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

const FRAME_COUNT = 150; // ffmpeg eken hadapu frames gana
const SCROLL_HEIGHT = "400vh"; // wadi karoth video eka slow, adu karoth fast
const frameSrc = (i: number) =>
  `/hero-scroll/scene_${String(i + 1).padStart(4, "0")}.webp`;

export default function ScrollVideoBackground({ children }: { children?: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // object-cover wage canvas ekata frame eka draw karanawa
  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }, []);

  // frames preload + resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      draw(currentRef.current);
    };

    imagesRef.current = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      img.src = frameSrc(i);
      if (i === 0) img.onload = () => draw(0);
      return img;
    });

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  // scroll progress -> frame index
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(v * FRAME_COUNT)));
    if (index !== currentRef.current) {
      currentRef.current = index;
      requestAnimationFrame(() => draw(index));
    }
  });

  return (
    <div ref={wrapRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 h-full w-full">{children}</div>
      </div>
    </div>
  );
}