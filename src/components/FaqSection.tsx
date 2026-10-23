"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    q: "How much does it cost?",
    a: "Packages start from A$[X] (AUD, GST [inclusive/exclusive]). The final quote depends on scope, and we confirm it in writing before any work starts. Third-party software, hosting and usage fees are [included / charged separately].",
  },
  {
    q: "How long does a project take?",
    a: "A typical website or single workflow takes around [X–Y weeks]. We give you a timeline during the free call, once we understand what you need.",
  },
  {
    q: "Do I own my website and systems?",
    a: "[Yes, you own your content, domain and accounts. / Describe your ownership terms here.] This is something to state clearly, because it is one of the first things business owners ask.",
  },
  {
    q: "What happens after launch?",
    a: "You get [3 months] of support after launch. After that you can choose a monthly managed service covering hosting, maintenance, security, backups and technical support.",
  },
  {
    q: "Do I need to understand the technology?",
    a: "No. Tell us what is slowing your business down, in plain language. We recommend the simplest solution and explain it without jargon.",
  },
  {
    q: "Can you connect the tools I already use?",
    a: "Often, yes. It depends on whether your tools support integrations. We check this on the free call and tell you honestly if something is not a good fit.",
  },
  {
    q: "Is there a lock-in contract?",
    a: "[State your real terms: minimum term for payment plans, notice period for managed services, and anything else that applies.]",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-surface px-[5vw] py-[90px] md:px-[6vw] md:py-[130px]"
    >
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-[7vw]">
        <div>
          <h2 className="text-[clamp(34px,4.5vw,62px)] font-normal leading-[1.02] tracking-[-0.04em] text-ink">
            Questions we
            <span className="block text-accent-deep">hear a lot.</span>
          </h2>
          <p className="mt-6 max-w-[360px] text-base leading-[1.7] text-muted md:text-lg">
            Cost, timing, ownership and support. Can&apos;t find your answer?
            Ask us on a free call.
          </p>
          <a
            href="#start"
            className="mt-8 inline-flex items-center rounded-full bg-accent px-6 py-4 text-sm font-bold text-ink shadow-[0_10px_25px_rgba(243,181,27,0.25)] transition hover:-translate-y-0.5"
          >
            Book a Free Call
          </a>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-medium tracking-[-0.01em] text-ink md:text-xl">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-bg text-ink"
                    >
                      <Plus size={16} />
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[640px] pb-6 text-base leading-[1.7] text-muted">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}