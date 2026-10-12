"use client";

import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";

const contact = [
  { Icon: MapPin, text: "3/80 Lloyd Street, Heidelberg Heights, VIC 3081", href: "https://maps.google.com/?q=3/80+Lloyd+Street,+Heidelberg+Heights,+VIC+3081" },
  { Icon: Phone, text: "+61 40 60 79 247", href: "tel:+61406079247" },
  { Icon: Mail, text: "roshan@adme.group", href: "mailto:roshan@adme.group" },
];

const links = [
  { label: "Solutions", href: "#solutions" },
  { label: "How It Works", href: "#how" },
  { label: "For Business", href: "#needs" },
  { label: "About", href: "#why" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-[#111] text-gray-400">
      <div className="px-5 sm:px-[5vw] md:px-[6vw] pt-16 sm:pt-20 md:pt-[110px] pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-[8vw] pb-12 md:pb-16 border-b border-white/10">
          {/* Brand + tagline + CTA */}
          <div>
            <a href="#top" className="inline-flex items-center gap-2.5 text-white mb-6">
              <span className="w-2.5 h-2.5 bg-accent rounded-full block shadow-[0_0_0_5px_rgba(243,181,27,0.14)]" />
              <b className="text-sm tracking-[0.02em]">OZMO</b>
            </a>

            <h3 className="text-[clamp(28px,3.2vw,44px)] leading-[1.08] tracking-[-0.03em] font-normal text-white max-w-[440px]">
              We simplify the way your business works.
            </h3>

            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full text-xs font-bold px-5 py-4 mt-8 bg-accent text-[#111] shadow-[0_10px_25px_rgba(243,181,27,0.18)] hover:bg-[#e9aa0e] hover:-translate-y-0.5 transition"
            >
              Let&apos;s Talk <ArrowRight size={17} />
            </a>
          </div>

          {/* Contact + nav */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-8">
            <div>
              <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.13em] font-bold text-gray-500 mb-5">
                <span className="w-4.5 h-0.5 bg-accent block shrink-0" />
                Get in touch
              </div>
              <ul className="flex flex-col gap-4">
                {contact.map(({ Icon, text, href }) => (
                  <li key={text}>
                    <a
                      href={href}
                      className="group flex items-start gap-3 text-[13px] leading-[1.5] text-gray-400 hover:text-white transition-colors"
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.8}
                        className="mt-0.5 shrink-0 text-gray-500 group-hover:text-accent transition-colors"
                      />
                      <span>{text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.13em] font-bold text-gray-500 mb-5">
                <span className="w-4.5 h-0.5 bg-accent block shrink-0" />
                Explore
              </div>
              <ul className="flex flex-col gap-4">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[13px] text-gray-400 hover:text-white transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-8 text-[10px] text-gray-500">
          <span>© 2026 Ozmo. All rights reserved.</span>
          <span className="text-gray-600">Digital Solutions</span>
        </div>
      </div>
    </footer>
  );
}