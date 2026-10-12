"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(MotionPathPlugin, Draggable);

const stops = [
  { id: "customer", x: 10, y: 15, label: "CUSTOMER" },
  { id: "website", x: 30, y: 28, label: "WEBSITE" },
  { id: "ozmo", x: 52, y: 45, label: "OZMO", core: true },
  { id: "ai", x: 72, y: 30, label: "AI" },
  { id: "team", x: 58, y: 65, label: "TEAM" },
  { id: "growth", x: 82, y: 80, label: "GROWTH" },
];

const PATH_D = stops.map((s, i) => `${i === 0 ? "M" : "L"}${s.x},${s.y}`).join(" ");

const ACCENT = "#f3b51b";
const DARK = "#1a1a1a";

export default function HeroJourneyFlow() {
  const pathRef = useRef<SVGPathElement>(null);
  const particleRef = useRef<SVGCircleElement>(null);
  const nodeRefs = useRef<Record<string, SVGGElement | null>>({});
  const rotateGroupRef = useRef<SVGGElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!pathRef.current || !particleRef.current) return;

    const pathLength = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    gsap.set(particleRef.current, { opacity: 0 });
    stops.forEach((s) =>
      gsap.set(nodeRefs.current[s.id], { opacity: 0, scale: 0.6, transformOrigin: "center" })
    );

    const DURATION = 3.2;
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to(particleRef.current, { opacity: 1, duration: 0.2 })
      .to(pathRef.current, { strokeDashoffset: 0, duration: DURATION, ease: "power1.inOut" }, 0)
      .to(
        particleRef.current,
        {
          duration: DURATION,
          ease: "power1.inOut",
          motionPath: { path: pathRef.current, align: pathRef.current, alignOrigin: [0.5, 0.5] },
        },
        0
      );

    stops.forEach((s, i) => {
      const t = (i / (stops.length - 1)) * DURATION;
      tl.to(nodeRefs.current[s.id], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
    });

    tl.to(particleRef.current, { opacity: 0, duration: 0.4 }, DURATION);
    tl.to(
      nodeRefs.current["ozmo"],
      { scale: 1.15, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 },
      DURATION + 0.2
    );

    // ---- enable drag-to-rotate only after the journey settles, desktop only ----
    tl.call(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        if (!rotateGroupRef.current) return;

        Draggable.create(rotateGroupRef.current, {
          type: "rotation",
          inertia: true,
          onPress() {
            gsap.to(rotateGroupRef.current, { scale: 1.02, duration: 0.3, ease: "power2.out" });
          },
          onRelease() {
            gsap.to(rotateGroupRef.current, { scale: 1, duration: 0.4, ease: "power2.out" });
          },
        });

        setShowHint(true);
        gsap.delayedCall(3.5, () => setShowHint(false));
      });
    }, [], DURATION + 0.6);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    // Before:

<div className="relative w-full h-full overflow-hidden">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <g ref={rotateGroupRef} style={{ transformOrigin: "52% 45%", touchAction: "none", cursor: "grab" }}>
          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke={DARK}
            strokeWidth={0.4}
            strokeOpacity={0.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {stops.map((s) => (
            <g key={s.id} ref={(el) => { nodeRefs.current[s.id] = el; }}>
              <circle cx={s.x} cy={s.y} r={s.core ? 4.5 : 2.6} fill={s.core ? DARK : ACCENT} />
              <text
                x={s.x}
                y={s.y - (s.core ? 7 : 5)}
                textAnchor="middle"
                fontSize={3.2}
                fontWeight={700}
                letterSpacing={0.3}
                fill={DARK}
                opacity={0.55}
              >
                {s.label}
              </text>
            </g>
          ))}

          <circle ref={particleRef} r={1.4} fill={ACCENT} />
        </g>
      </svg>

      {/* ADME-style drag hint — desktop only, fades after journey settles */}
      <div
        className={`hidden md:flex absolute bottom-4 right-5 items-center gap-1.5 text-[10px] font-semibold tracking-[0.1em] text-gray-500/70 uppercase transition-opacity duration-700 pointer-events-none ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
      >
        Drag to rotate
      </div>
    </div>
  );
}