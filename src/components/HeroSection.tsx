"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import HeroForm from "./HeroForm";

export default function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="h-[78px] px-[6vw] flex items-center justify-between fixed top-0 left-0 right-0 z-50 bg-bg/82 backdrop-blur-2xl border-b border-black/5">
        <a href="#top" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <span className="w-2.5 h-2.5 bg-accent rounded-full block shadow-[0_0_0_5px_rgba(243,181,27,0.1)]" />
        </a>

        <nav className={`gap-8 text-xs md:text-xl text-gray-800 md:flex ${mobileOpen ? "flex absolute left-0 right-0 top-[78px] bg-white p-5 border-b border-line flex-col gap-4.5" : "hidden"}`}>
          <a href="#solutions" className="relative hover:opacity-60 transition" onClick={() => setMobileOpen(false)}>Solutions</a>
          <a href="#how" className="relative hover:opacity-60 transition" onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#needs" className="relative hover:opacity-60 transition" onClick={() => setMobileOpen(false)}>For Business</a>
          <a href="#why" className="relative hover:opacity-60 transition" onClick={() => setMobileOpen(false)}>About</a>
        </nav>

        <a href="#contact" className="hidden md:inline-flex items-center gap-2.5 rounded-full text-xs font-bold px-4.5 py-3 bg-black text-white hover:-translate-y-0.5 transition">
          Let&apos;s Talk <ArrowRight size={15} />
        </a>

        <button className="md:hidden border-0 bg-transparent cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section id="top" className="relative overflow-x-clip min-h-[100svh] pt-[150px] px-[6vw] pb-[70px] grid grid-cols-1 md:grid-cols-2 gap-[5vw] items-center">
        {/* text read karanna amaru nam meka adu/wadi karanna */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

        <div className="relative z-2">
          {/* <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.13em] font-bold text-gray-500 mb-5">
            <span className="w-4.5 h-0.5 bg-accent block" />
            Digital solutions built around your business
          </div> */}

       <h1 className="text-[clamp(32px,4.2vw,80px)] leading-[0.97] tracking-[-0.04em] max-w-[900px] font-normal">
  <span className="md:whitespace-nowrap">Your business works hard.</span>
  <br />
  <span className="font-semibold tracking-[0.01rem] leading-[0.87]">
    Your digital systems should work harder.
  </span>
</h1>

          <p className=" text-xl leading-[1.65] text-gray-600 max-w-[470px] my-7">
            Websites, automation, AI, data and digital growth — all managed by one team.
          </p>

          <div className="flex gap-2.5">
            <a href="#journey" className="inline-flex items-center gap-2.5 rounded-full text-xs font-bold px-5 py-4 bg-accent shadow-[0_10px_25px_rgba(243,181,27,0.18)] hover:bg-[#e9aa0e] hover:shadow-[0_14px_30px_rgba(243,181,27,0.24)] hover:-translate-y-0.5 transition">
              See How It Works <ArrowRight size={17} />
            </a>
            <a href="#contact" className="inline-flex items-center gap-2.5 rounded-full text-xs font-bold px-5 py-4 border border-gray-300 bg-white hover:-translate-y-0.5 transition">
              Talk to Us
            </a>
          </div>
        </div>

        {/* RIGHT SIDE: glass form */}
        <div className="relative z-2 flex items-center">
          <HeroForm />

          {/* "New enquiries" card eka form eka pita pettiyata float wenawa (desktop witharai) */}
          <motion.div
            className="hidden md:block absolute -left-[38px] -bottom-6 bg-white rounded-2xl p-5 w-[150px] shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden z-5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
          >
            <div className="absolute w-[70px] h-[70px] -right-[35px] -top-[35px] rounded-full bg-accent/15" />
            <small className="block text-gray-500 text-[9px] relative">New enquiries</small>
            <strong className="text-[29px] block my-1.5 relative">156</strong>
            <span className="text-[9px] text-green-600 relative">↗ 20%</span>
            <div className="flex items-end gap-1 h-[34px] mt-2.5 relative">
              {[10, 25, 18, 46, 37, 70, 92].map((h, i) => (
                <i key={i} className="block w-3 bg-accent rounded-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </motion.div>
        </div>

        <a href="#problem" className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 flex gap-1.5 items-center">
          Scroll to explore <ArrowDown size={15} />
        </a>
      </section>
    </>
  );
}