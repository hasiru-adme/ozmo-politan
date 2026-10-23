"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";


const caseSteps = [
  { text: "A customer visits your website.", img: "/images/case/website.jpg", tint: "#dfeaf5", tintInk: "#46627b" },
  { text: "They request a quote.", img: "/images/case/quote.jpg", tint: "#f5e7d7", tintInk: "#9b673b" },
  { text: "The request is automatically captured.", img: "/images/case/captured.jpg", tint: "#f2dfdf", tintInk: "#985959" },
  { text: "AI helps qualify the enquiry.", img: "/images/case/ai.jpg", tint: "#e8e2f1", tintInk: "#6d5b82" },
  { text: "Your team gets notified.", img: "/images/case/notified.jpg", tint: "#dfeadf", tintInk: "#557255" },
  { text: "Customer books a time.", img: "/images/case/booking.jpg", tint: "#dceaea", tintInk: "#4f7070" },
  { text: "Reminder is sent automatically.", img: "/images/case/reminder.jpg", tint: "#dfeaf5", tintInk: "#46627b" },
  { text: "Invoice is created.", img: "/images/case/invoice.jpg", tint: "#f5e7d7", tintInk: "#9b673b" },
  { text: "Payment is received.", img: "/images/case/payment.jpg", tint: "#f2dfdf", tintInk: "#985959" },
  { text: "Customer gets a review request.", img: "/images/case/review.jpg", tint: "#dfeadf", tintInk: "#557255" },
];
const ease = [0.22, 1, 0.36, 1] as const;

export default function CaseSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="case"
      className="relative overflow-hidden bg-[#11110f] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-[7vw] lg:py-36"
    >
      {/* Subtle background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%]
        h-[450px] w-[450px] rounded-full bg-[#d88900]/[0.07] blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1440px]">

        {/* HEADER */}
        <div className="mb-16 grid gap-8 lg:mb-24 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease }}
              className="max-w-[850px] text-[clamp(42px,6.5vw,88px)]
              font-medium leading-[0.99] tracking-[-0.065em]"
            >
              Imagine you run
              <br />
              a{" "}
              <span className="relative inline-block text-[#d88900]">
                cleaning business.
                
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="max-w-[370px] lg:justify-self-end lg:pb-2"
          >
            <p className="text-base leading-7 text-white/55 sm:text-lg">
              From the first enquiry to the final review, every part of
              your business works together. Less manual work. A smoother
              customer experience.
            </p>
          </motion.div>
        </div>

        {/* WORKFLOW */}
        <div className="relative">

          {/* Connecting line behind the illustrations */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-[104px]
            hidden h-px bg-gradient-to-r from-transparent
            via-[#d88900]/35 to-transparent lg:block"
          />

          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2
          lg:grid-cols-5 lg:gap-y-16">

            {caseSteps.map((step, index) => (
              <motion.article
                key={step.text}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 28 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: reduceMotion ? 0.2 : 0.65,
                  delay: reduceMotion ? 0 : (index % 5) * 0.07,
                  ease,
                }}
                className="group relative min-w-0"
              >
                {/* Illustration */}
                <div
                  className="relative mb-6 flex h-[190px] items-center
                  justify-center overflow-hidden rounded-[5px] sm:h-[200px]"
                  style={{ backgroundColor: step.tint }}
                >
                  {/* Soft decorative glow */}
                  <div
                    aria-hidden="true"
                    className="absolute h-32 w-32 rounded-full
                    bg-white/35 blur-3xl"
                  />

                  <img
                    src={step.img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="relative z-10 h-[76%] w-[76%]
                    object-contain transition-transform duration-700
                    ease-out group-hover:scale-110"
                  />

                  {/* Subtle yellow accent on hover */}
                  <div
                    className="absolute bottom-0 left-0 h-[3px] w-full
                    origin-left scale-x-0 bg-[#d88900]
                    transition-transform duration-500
                    group-hover:scale-x-100"
                  />
                </div>

                {/* Text — no numbers or number badges */}
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-1.5 w-1.5 shrink-0
                    rounded-full bg-[#d88900]"
                  />

                  <h3 className="text-[16px] font-medium leading-6
                  tracking-[-0.02em] text-white/90 transition-colors
                  duration-300 group-hover:text-[#d88900]">
                    {step.text}
                  </h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* OUTCOME */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
          className="mt-24 border-t border-white/10 pt-10
          sm:mt-32 sm:pt-14"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-4 text-sm text-white/45">
                That's not just a website.
              </p>

              <h3 className="max-w-[900px] text-[clamp(34px,5.5vw,72px)]
              font-medium leading-[1.04] tracking-[-0.055em]">
                That's a{" "}
                <span className="text-[#d88900]">
                  digital business system.
                </span>
              </h3>
            </div>

            <a
              href="#contact"
              className="group inline-flex w-fit items-center gap-3
              border-b border-[#d88900]/50 pb-3 text-sm
              font-medium text-white transition-colors
              hover:border-[#d88900] hover:text-[#d88900]"
            >
              Let's make it work for you
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300
                group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}