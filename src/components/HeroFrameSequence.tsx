"use client";

import { motion, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* --------------------------------------------------
   Frame settings
-------------------------------------------------- */
const FRAME_COUNT = 300;
const FRAME_PREFIX = "/images/ozmo-frames/ezgif-frame-";
const FRAME_EXT = ".jpg";
const PAD = 3;

const BATCH = 12; // frames loaded per round
const END_HOLD = 0.92; // last frame stays put for the final 8% of the scroll

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const urlFor = (i: number) =>
    `${FRAME_PREFIX}${String(i + 1).padStart(PAD, "0")}${FRAME_EXT}`;

type Props = {
    /** 0 -> 1 scroll progress of the hero track (from framer-motion's useScroll). */
    progress?: MotionValue<number>;
    /** "cover" fills the box (crops edges). "contain" shows the whole frame. */
    fit?: "cover" | "contain";
};

/**
 * Scroll-driven image sequence inside the rounded hero box.
 * Frame number = scroll progress, so scrolling down plays the animation
 * forward and scrolling back up plays it in reverse.
 */
export default function HeroFrameSequence({ progress, fit = "cover" }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (!progress) {
            console.warn(
                "[HeroFrameSequence] Missing `progress` prop. Use <HeroFrameSequence progress={scrollYProgress} /> and wrap the hero in the scroll track (see HeroSection.tsx)."
            );
        }

        // Phones: use every 2nd frame to save memory + bandwidth
        const stride = window.innerWidth < 700 ? 2 : 1;
        const total = Math.ceil(FRAME_COUNT / stride);

        const frames: (HTMLImageElement | null)[] = Array(total).fill(null);
        let cancelled = false;
        let dirty = true;
        let lastDrawn = -1;
        let shown = false;
        let current = 0; // smoothed frame position
        let last = performance.now();
        let raf = 0;

        /* ---------- canvas sizing ---------- */
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.max(1, Math.floor(wrap.clientWidth * dpr));
            canvas.height = Math.max(1, Math.floor(wrap.clientHeight * dpr));
            dirty = true;
        };
        const ro = new ResizeObserver(resize);
        ro.observe(wrap);
        resize();

        /* ---------- drawing ---------- */
        const draw = (i: number) => {
            const img = frames[i];
            if (!img) return;
            const cw = canvas.width;
            const ch = canvas.height;
            const s =
                fit === "cover"
                    ? Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
                    : Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
            const dw = img.naturalWidth * s;
            const dh = img.naturalHeight * s;
            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
            lastDrawn = i;
            dirty = false;
            if (!shown) {
                shown = true;
                setReady(true);
            }
        };

        // closest frame that is already loaded (so fast scrolling never shows a blank box)
        const nearest = (i: number) => {
            if (frames[i]) return i;
            for (let d = 1; d < total; d++) {
                if (i - d >= 0 && frames[i - d]) return i - d;
                if (i + d < total && frames[i + d]) return i + d;
            }
            return -1;
        };

        /* ---------- loading (in order) ---------- */
        const loadOne = (i: number) =>
            new Promise<void>((resolve) => {
                const img = new Image();
                img.decoding = "async";
                img.onload = async () => {
                    try {
                        await img.decode();
                    } catch {}
                    if (!cancelled) frames[i] = img;
                    resolve();
                };
                img.onerror = () => resolve();
                img.src = urlFor(i * stride);
            });

        const load = async () => {
            for (let start = 0; start < total; start += BATCH) {
                const n = Math.min(BATCH, total - start);
                await Promise.all(
                    Array.from({ length: n }, (_, j) => loadOne(start + j))
                );
                if (cancelled) return;

                if (start === 0 && !frames[0]) {
                    console.warn(
                        `[HeroFrameSequence] Could not load ${urlFor(0)} - check FRAME_PREFIX / file names in /public`
                    );
                }
            }
        };
        load();

        /* ---------- scroll -> frame ---------- */
        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);

            const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
            last = now;

            const p = clamp01((progress ? progress.get() : 0) / END_HOLD);
            const target = p * (total - 1);

            // frame-rate independent smoothing: softer than mapping scroll 1:1
            const k = 1 - Math.exp(-dt * 12);
            current += (target - current) * k;
            if (Math.abs(target - current) < 0.01) current = target;

            const idx = nearest(Math.round(current));
            if (idx >= 0 && (idx !== lastDrawn || dirty)) draw(idx);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [progress, fit]);

    return (
        <div
            ref={wrapRef}
            className="
                relative h-full w-full
                overflow-hidden
                rounded-[20px]
                bg-[#f1f1ed]
                md:rounded-[28px]
            "
        >
            <motion.canvas
                ref={canvasRef}
                role="img"
                aria-label="Ozmo digital experience animation"
                className="absolute inset-0 h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* soft bottom shade, same idea as the old slider */}
            <div
                className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/15
                    via-transparent
                    to-transparent
                "
            />
        </div>
    );
}