"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// card eka ena animation + athule fields eka eka enna stagger
const card = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease,
      delay: 0.3,
      delayChildren: 0.55,
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const field =
  "w-full rounded-xl border border-black/10 bg-white/40 px-4 py-3 text-xs text-gray-900 md:text-sm " +
  "placeholder:text-gray-500 outline-none backdrop-blur-sm transition " +
  "focus:border-accent focus:bg-white/70 focus:shadow-[0_0_0_4px_rgba(243,181,27,0.15)]";

export default function HeroForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hpField, setHpField] = useState(""); // honeypot — real users walata empty ma thiyenawa
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, hpField }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setErrorMsg("Network error — please try again");
      setStatus("error");
    }
  }

  return (
    <div className="relative w-full max-w-[440px] md:ml-auto">
      {/* form eka pitipassen soft glow ekak, hemin pulse wenawa */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-[260px] w-[260px] rounded-full bg-accent blur-[90px]"
        animate={{ opacity: [0.18, 0.3, 0.18], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={card}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/35 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-xl md:p-7"
      >
        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
              className="flex flex-col gap-3"
            >
              {/* Honeypot — real users ta penne na */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, overflow: "hidden" }}
              >
                <input
                  type="text"
                  name="hp_field_x9"
                  value={hpField}
                  onChange={(e) => setHpField(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <motion.div variants={item}>
                <div className="mb-1.5 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.13em] text-gray-600 md:text-[13px]">
                  <span className="block h-0.5 w-4 bg-accent" />
                  Start with the problem
                </div>
                <h3 className="text-xl font-semibold leading-tight tracking-[-0.02em]">
                  Let&apos;s talk about your business
                </h3>
                <p className="mt-1 text-xs text-gray-600 md:text-[14px]">
                  Tell us what&apos;s slowing you down — no pressure, no tech jargon.
                </p>
              </motion.div>

              <motion.input
                variants={item}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                className={field}
              />
              <motion.input
                variants={item}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={150}
                className={field}
              />
              <motion.input
                variants={item}
                type="tel"
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={30}
                className={field}
              />
              <motion.textarea
                variants={item}
                placeholder="What's slowing your business down?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={2000}
                rows={3}
                className={`${field} resize-none`}
              />

              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-500"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                variants={item}
                type="submit"
                disabled={status === "loading"}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative mt-1 inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-black px-6 py-4 text-xs font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)] disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/[0.08] transition-transform duration-500 group-hover:translate-x-0" />
                <span className="relative">
                  {status === "loading" ? "Sending..." : "Send message"}
                </span>
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-accent">
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent"
              >
                <Check size={26} />
              </motion.span>
              <h3 className="text-xl font-semibold tracking-[-0.02em]">Message sent</h3>
              <p className="max-w-[260px] text-xs leading-relaxed text-gray-600">
                We&apos;ll get back to you within one business day.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-3 rounded-full bg-black px-5 py-2.5 text-xs font-medium text-white transition hover:-translate-y-0.5"
              >
                Send another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}