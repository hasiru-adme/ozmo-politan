"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MessageSquare, CalendarCheck, CreditCard, Bell } from "lucide-react";

const chips = [
  { Icon: MessageSquare, label: "New enquiry", top: "14%", left: "8%", depth: 0.02 },
  { Icon: Bell, label: "Follow-up sent", top: "68%", left: "12%", depth: 0.035 },
  { Icon: CalendarCheck, label: "Booking confirmed", top: "20%", left: "78%", depth: 0.03 },
  { Icon: CreditCard, label: "Payment received", top: "74%", left: "80%", depth: 0.025 },
];

export default function HeroBackgroundScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const quickSetters = layerRefs.current.map((el, i) => {
        if (!el) return null;
        const depth = chips[i]?.depth ?? 0.02;
        return {
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
          depth,
        };
      });

      const blobSetters = blobRefs.current.map((el) => {
        if (!el) return null;
        return {
          x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
        };
      });

      function handleMove(e: MouseEvent) {
        const rect = sceneRef.current?.getBoundingClientRect();
        if (!rect) return;
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);

        quickSetters.forEach((s) => {
          if (!s) return;
          s.x(relX * s.depth);
          s.y(relY * s.depth);
        });
        blobSetters.forEach((s) => {
          if (!s) return;
          s.x(relX * 0.012);
          s.y(relY * 0.012);
        });
      }

      const node = sceneRef.current;
      node?.addEventListener("mousemove", handleMove);

      // gentle idle float so the scene feels alive even without mouse movement
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: "+=8",
          duration: 3 + i * 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      return () => node?.removeEventListener("mousemove", handleMove);
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={sceneRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* soft depth blobs */}
      <div
        ref={(el) => { blobRefs.current[0] = el; }}
        className="absolute -top-20 -left-16 w-[260px] h-[260px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.16),transparent_70%)] blur-2xl"
      />
      <div
        ref={(el) => { blobRefs.current[1] = el; }}
        className="absolute -bottom-24 -right-10 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(26,26,26,0.06),transparent_70%)] blur-2xl"
      />

      {/* faint dot grid for texture */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(rgba(26,26,26,0.14) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* floating notification chips */}
      {chips.map(({ Icon, label, top, left }, i) => (
        <div
          key={label}
          ref={(el) => { layerRefs.current[i] = el; }}
          className="hidden md:flex absolute items-center gap-2 bg-white/90 backdrop-blur-sm border border-line rounded-full pl-2 pr-3.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
          style={{ top, left }}
        >
          <span className="w-6 h-6 rounded-full bg-[#f3f3ee] grid place-items-center text-gray-700 shrink-0">
            <Icon size={12} strokeWidth={2} />
          </span>
          <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">{label}</span>
        </div>
      ))}
    </div>
  );
}