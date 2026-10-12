"use client";

import { motion, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BATCH = 12; // frames loaded per round

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export type FrameSet = {
    /** URL up to the frame number, e.g. "/images/transformation-frames/ezgif-frame-" */
    prefix: string;
    /** How many frames there are */
    count: number;
    /** File extension, default ".jpg" */
    ext?: string;
    /** Zero padding of the number, default 3 (001, 002 ...) */
    pad?: number;
    /** Number of the first frame, default 1 (ezgif starts at 001) */
    start?: number;
};

type Props = {
    /** 0 -> 1 scroll progress (from framer-motion's useScroll). */
    progress: MotionValue<number>;
    frames: FrameSet;
    /** "cover" fills the whole area (recommended for backgrounds). */
    fit?: "cover" | "contain";
    className?: string;
};

/**
 * Fills its (positioned) parent with a canvas that shows frame N of an image
 * sequence, where N follows `progress`. Scroll down = plays forward,
 * scroll up = plays in reverse.
 * Frames only start downloading when the parent is close to the viewport.
 */
export default function ScrollFrameBackground({
    progress,
    frames: set,
    fit = "cover",
    className = "",
}: Props) {
    const { prefix, count, ext = ".jpg", pad = 3, start = 1 } = set;

    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const wrap = wrapRef.current;
        const canvas = canvasRef.current;
        if (!wrap || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Phones: use every 2nd frame to save memory + bandwidth
        const stride = window.innerWidth < 700 ? 2 : 1;
        const total = Math.ceil(count / stride);
        const urlFor = (i: number) =>
            `${prefix}${String(start + i * stride).padStart(pad, "0")}${ext}`;

        const imgs: (HTMLImageElement | null)[] = Array(total).fill(null);
        let cancelled = false;
        let dirty = true;
        let lastDrawn = -1;
        let shown = false;
        let current = 0;
        let last = performance.now();
        let raf = 0;
        let started = false;

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
            const img = imgs[i];
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

        // closest frame that is already loaded
        const nearest = (i: number) => {
            if (imgs[i]) return i;
            for (let d = 1; d < total; d++) {
                if (i - d >= 0 && imgs[i - d]) return i - d;
                if (i + d < total && imgs[i + d]) return i + d;
            }
            return -1;
        };

        /* ---------- loading (starts when near the viewport) ---------- */
        const loadOne = (i: number) =>
            new Promise<void>((resolve) => {
                const img = new Image();
                img.decoding = "async";
                img.onload = async () => {
                    try {
                        await img.decode();
                    } catch {}
                    if (!cancelled) imgs[i] = img;
                    resolve();
                };
                img.onerror = () => resolve();
                img.src = urlFor(i);
            });

        const load = async () => {
            for (let s = 0; s < total; s += BATCH) {
                const n = Math.min(BATCH, total - s);
                await Promise.all(
                    Array.from({ length: n }, (_, j) => loadOne(s + j))
                );
                if (cancelled) return;

                if (s === 0 && !imgs[0]) {
                    console.warn(
                        `[ScrollFrameBackground] Could not load ${urlFor(0)} - check prefix / start / pad / ext`
                    );
                }
            }
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    started = true;
                    load();
                    io.disconnect();
                }
            },
            { rootMargin: "1200px 0px" }
        );
        io.observe(wrap);

        /* ---------- scroll -> frame ---------- */
        const tick = (now: number) => {
            raf = requestAnimationFrame(tick);

            const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
            last = now;

            const target = clamp01(progress.get()) * (total - 1);

            // frame-rate independent smoothing
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
            io.disconnect();
        };
    }, [progress, fit, prefix, count, ext, pad, start]);

    return (
        <div ref={wrapRef} className={`absolute inset-0 ${className}`}>
            <motion.canvas
                ref={canvasRef}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: ready ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </div>
    );
}