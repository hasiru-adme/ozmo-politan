"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Props = {
  frameCount: number;
  src?: (index: number) => string;
  overlayClassName?: string;
  // 0.05 = very smooth / laggy, 0.2 = snappy
  smoothness?: number;
  // how long the section stays pinned, in screens (vh). 250 = 1.5 screens of scrolling
  scrollLength?: number;
  // content shown on top of the frames while pinned (heading, text ...)
  children?: React.ReactNode;
  contentClassName?: string;
  // scroll patan gannakota content eka fade out wenna one nam
  fadeOutOnScroll?: boolean;
  // fade out iwara wenna scroll progress eka (0.08 = pinned scroll eke 8%)
  fadeOutEnd?: number;
};

const defaultSrc = (i: number) =>
  `/frames/frame_${String(i).padStart(4, "0")}.webp`;

export default function ScrollFrames({
  frameCount,
  src = defaultSrc,
  overlayClassName = "bg-black/40",
  smoothness = 0.08,
  scrollLength = 250,
  children,
  contentClassName = "",
  fadeOutOnScroll = false,
  fadeOutEnd = 0.08,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastIndexRef = useRef(-1);
  const [ready, setReady] = useState(false);

  // progress 0 -> 1 only while the section is pinned
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // content fade out when frames start moving
const [hideContent, setHideContent] = useState(false);

  const drawImage = (img: HTMLImageElement | undefined) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return false;
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;

    ctx.globalAlpha = 1;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    return true;
  };

  const render = (progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const p = Math.min(Math.max(progress, 0), 1);
    const index = Math.round(p * (frameCount - 1));
    const imgs = imagesRef.current;

    // same frame as last time: nothing to redraw
    if (index === lastIndexRef.current) return;

    // draw the exact frame, or the nearest loaded one if it's not ready yet
    for (let offset = 0; offset < frameCount; offset++) {
      const a = imgs[index - offset];
      const b = imgs[index + offset];
      if (drawImage(a) || drawImage(b)) {
        lastIndexRef.current = index;
        return;
      }
    }
  };

  const tick = () => {
    const diff = targetRef.current - currentRef.current;

    if (Math.abs(diff) < 0.0002) {
      currentRef.current = targetRef.current;
      render(currentRef.current);
      rafRef.current = null;
      return;
    }

    currentRef.current += diff * smoothness;
    render(currentRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  // preload frames
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = src(i);
      img.onload = () => {
        loaded++;
        if (i === 1 || loaded === 1) render(currentRef.current);
        if (loaded === frameCount) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  // canvas size = pinned box size
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const box = stickyRef.current;
      if (!canvas || !box) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = box.clientWidth * dpr;
      canvas.height = box.clientHeight * dpr;
      lastIndexRef.current = -1; // force redraw after resize
      render(currentRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // scroll updates the target, the loop eases toward it
useEffect(() => {
  targetRef.current = scrollYProgress.get();
  currentRef.current = targetRef.current;

  // page eka refresh karapu scroll position ekath check karanawa
  setHideContent(scrollYProgress.get() > 0.003);

  const unsub = scrollYProgress.on("change", (p) => {
    targetRef.current = p;
    start();

    // scroll patan gaththama hide, top ekata aawama (p = 0) aye penawa
    setHideContent(p > 0.003);
  });
  return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [scrollYProgress]);

  return (
    // tall wrapper = the scroll distance while pinned
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: `${scrollLength}vh` }}
    >
      {/* sticky = stays on screen while the wrapper scrolls past */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          aria-hidden
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-70"
          }`}
        />
        <div className={`absolute inset-0 ${overlayClassName}`} />

<motion.div
  initial={false}
  animate={{
    opacity: fadeOutOnScroll && hideContent ? 0 : 1,
    y: fadeOutOnScroll && hideContent ? -20 : 0,
  }}
  transition={{ duration: 0.25, ease: "easeOut" }}
  className={`relative z-10 pointer-events-none flex h-full flex-col items-center justify-start text-center ${contentClassName}`}
>
  {children}
</motion.div>
      </div>
    </div>
  );
}