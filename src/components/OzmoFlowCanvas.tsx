"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroStage } from "@/lib/flowStages";

gsap.registerPlugin(ScrollTrigger);

const ACCENT = "#f3b51b";
const DARK = "#1a1a1a";

export default function OzmoFlowCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Record<string, SVGCircleElement | null>>({});
  const lineRefs = useRef<Record<string, SVGLineElement | null>>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ---------- DESKTOP: continuous, scroll-scrubbed morph only ----------
      mm.add("(min-width: 768px)", () => {
        // starting state: everything collapsed into the core point
        heroStage.nodes.forEach((n) => {
          if (n.id === "core") return;
          const el = nodeRefs.current[n.id];
          if (!el) return;
          gsap.set(el, { attr: { cx: 50, cy: 50, r: 0 } });
        });
        heroStage.connections.forEach((c) => {
          const el = lineRefs.current[`${c.from}-${c.to}`];
          if (el) gsap.set(el, { attr: { x2: 50, y2: 50 }, opacity: 0 });
        });

        // one single scrubbed timeline — no independent loops, no yoyo/repeat.
        // motion exists ONLY as a function of scroll position.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 40%",
            scrub: 1.1, // lag/smoothing — this is what gives the Lenis-like inertia feel
          },
        });

        heroStage.nodes.forEach((n) => {
          if (n.id === "core") return;
          const el = nodeRefs.current[n.id];
          if (!el) return;
          tl.to(el, { attr: { cx: n.x, cy: n.y, r: n.r }, ease: "none" }, 0);
        });

        heroStage.connections.forEach((c) => {
          const el = lineRefs.current[`${c.from}-${c.to}`];
          const to = heroStage.nodes.find((n) => n.id === c.to)!;
          if (!el) return;
          tl.to(el, { attr: { x2: to.x, y2: to.y }, opacity: 0.28, ease: "none" }, 0);
        });

        // subtle continued drift for the rest of the hero scroll —
        // keeps the system feeling "alive" as you keep scrolling,
        // instead of settling and stopping dead.
        const driftTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "bottom 40%",
            end: "bottom top",
            scrub: 1.4,
          },
        });
        driftTl.to(svgRef.current, { y: -18, ease: "none" }, 0);
      });

      // ---------- MOBILE: same continuous principle, shorter travel ----------
      mm.add("(max-width: 767px)", () => {
        heroStage.nodes.forEach((n) => {
          if (n.id === "core") return;
          const el = nodeRefs.current[n.id];
          if (!el) return;
          gsap.set(el, { attr: { cx: 50, cy: 50, r: 0 } });
        });
        heroStage.connections.forEach((c) => {
          const el = lineRefs.current[`${c.from}-${c.to}`];
          if (el) gsap.set(el, { attr: { x2: 50, y2: 50 }, opacity: 0 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "top 45%",
            scrub: 0.8,
          },
        });

        heroStage.nodes.forEach((n) => {
          if (n.id === "core") return;
          const el = nodeRefs.current[n.id];
          if (!el) return;
          tl.to(el, { attr: { cx: n.x, cy: n.y, r: n.r }, ease: "none" }, 0);
        });
        heroStage.connections.forEach((c) => {
          const el = lineRefs.current[`${c.from}-${c.to}`];
          const to = heroStage.nodes.find((n) => n.id === c.to)!;
          if (!el) return;
          tl.to(el, { attr: { x2: to.x, y2: to.y }, opacity: 0.22, ease: "none" }, 0);
        });
      });

      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full rounded-[20px] md:rounded-[28px] bg-[#f1f1ed] overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {heroStage.connections.map((c) => {
          const from = heroStage.nodes.find((n) => n.id === c.from)!;
          return (
            <line
              key={`${c.from}-${c.to}`}
              ref={(el) => { lineRefs.current[`${c.from}-${c.to}`] = el; }}
              x1={from.x}
              y1={from.y}
              x2={from.x}
              y2={from.y}
              stroke={DARK}
              strokeWidth={0.3}
            />
          );
        })}

        {heroStage.nodes.map((n) => (
          <circle
            key={n.id}
            ref={(el) => { nodeRefs.current[n.id] = el; }}
            cx={n.id === "core" ? n.x : 50}
            cy={n.id === "core" ? n.y : 50}
            r={n.id === "core" ? n.r : 0}
            fill={n.id === "core" ? DARK : ACCENT}
          />
        ))}
      </svg>
    </div>
  );
}