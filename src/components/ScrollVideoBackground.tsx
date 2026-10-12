"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

const FRAME_COUNT = 150; // ffmpeg eken hadapu frames gana
const frameSrc = (i: number) =>
  `/hero-scroll/scene_${String(i + 1).padStart(4, "0")}.webp`;

export default function ScrollVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);

  // target nathi nisa muluwa page eke scroll progress eka (0 -> 1)
  const { scrollYProgress } = useScroll();

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

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(v * FRAME_COUNT)));
    if (index !== currentRef.current) {
      currentRef.current = index;
      requestAnimationFrame(() => draw(index));
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full pointer-events-none"
    />
  );
}