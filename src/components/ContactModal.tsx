"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { X, Send } from "lucide-react";

/* ------------------------------------------------------------------ */
/* ANIMATION VARIANTS                                                  */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/* FLOATING LABEL FIELD                                                */
/* ------------------------------------------------------------------ */

const fieldBase =
  "peer w-full rounded-xl border border-line bg-neutral-50/80 px-3.5 pb-1.5 pt-5 text-sm " +
  "shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] outline-none transition-all duration-300 " +
  "placeholder-transparent focus:-translate-y-0.5 focus:border-accent focus:bg-white " +
  "focus:shadow-[0_10px_24px_-10px_rgba(243,181,27,0.55),inset_0_0_0_1px_rgba(243,181,27,0.4)]";

const labelBase =
  "pointer-events-none absolute left-3.5 top-1.5 text-[10px] uppercase tracking-[0.08em] text-gray-400 " +
  "transition-all duration-200 " +
  "peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal " +
  "peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.08em] peer-focus:text-neutral-700";

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
  textarea,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <motion.div variants={item} className="relative">
      {textarea ? (
        <textarea
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={maxLength}
          rows={rows}
          className={`${fieldBase} resize-none`}
        />
      ) : (
        <input
          type={type}
          placeholder=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          maxLength={maxLength}
          className={fieldBase}
        />
      )}
      <label className={labelBase}>{label}</label>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* MODAL                                                               */
/* ------------------------------------------------------------------ */

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hpField, setHpField] = useState(""); // honeypot — stays empty for real users
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const reduceMotion = useReducedMotion();

  /* ---------- 3D tilt (follows the mouse) ---------- */
  const mx = useMotionValue(0); // -0.5 .. 0.5
  const my = useMotionValue(0);
  const gx = useMotionValue(50); // glare position in %
  const gy = useMotionValue(30);

  const sx = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.6 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);

  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(243,181,27,0.16), transparent 60%)`;

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px - 0.5);
    my.set(py - 0.5);
    gx.set(px * 100);
    gy.set(py * 100);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
    gx.set(50);
    gy.set(30);
  }

  /* ---------- body scroll lock + Escape to close ---------- */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  /* ---------- reset state after the close animation ---------- */
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

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
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-modal"
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
        >
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-md" />

          {/* FLOATING GLOW ORBS (depth behind the card) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-[12%] top-[18%] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(243,181,27,0.45),transparent_70%)] blur-2xl"
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute bottom-[10%] right-[12%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.25),transparent_70%)] blur-2xl"
            animate={{ y: [0, 25, 0], x: [0, -25, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ENTRY ANIMATION WRAPPER */}
          <motion.div
            className="relative w-full max-w-md"
            style={{ transformPerspective: 1100 }}
            initial={{ opacity: 0, y: 50, rotateX: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, rotateX: 12, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 24, mass: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* TILT LAYER */}
            <motion.div
              onPointerMove={handleMove}
              onPointerLeave={handleLeave}
              style={{
                rotateX: reduceMotion ? 0 : rotateX,
                rotateY: reduceMotion ? 0 : rotateY,
                transformStyle: "preserve-3d",
                transformPerspective: 1100,
              }}
              className="relative rounded-3xl border border-white/70 bg-gradient-to-b from-white to-neutral-50 p-7 shadow-[0_2px_0_rgba(255,255,255,0.9)_inset,0_30px_60px_-15px_rgba(0,0,0,0.45),0_12px_24px_-12px_rgba(0,0,0,0.25)]"
            >
              {/* GLARE */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{ background: glare }}
              />

              {/* CLOSE */}
              <motion.button
                onClick={onClose}
                aria-label="Close"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                style={{ transform: "translateZ(30px)" }}
                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-gray-400 transition-colors hover:bg-neutral-100 hover:text-gray-700"
              >
                <X size={18} />
              </motion.button>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  /* ---------------- SUCCESS ---------------- */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="relative py-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                      style={{ transform: "translateZ(50px)" }}
                      className="relative mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-sage-light text-sage-dark shadow-[0_14px_28px_-8px_rgba(0,0,0,0.25)]"
                    >
                      {/* pulse ring */}
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-sage-dark/40"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <svg viewBox="0 0 52 52" className="h-12 w-12">
                        <motion.circle
                          cx="26"
                          cy="26"
                          r="24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                        <motion.path
                          d="M15 27 l8 8 l14 -16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
                        />
                      </svg>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
                      className="mb-2 text-xl font-semibold"
                    >
                      Message sent
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
                      className="text-sm text-gray-500"
                    >
                      We&apos;ll get back to you within one business day.
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5, ease: EASE }}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 2, scale: 0.97 }}
                      onClick={onClose}
                      className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white shadow-[0_6px_0_#2a2a2a,0_12px_20px_rgba(0,0,0,0.25)]"
                    >
                      Close
                    </motion.button>
                  </motion.div>
                ) : (
                  /* ---------------- FORM ---------------- */
                  <motion.div
                    key="form"
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      style={{ transform: "translateZ(45px)" }}
                      className="mb-4 w-fit"
                    >
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                        className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-neutral-900 shadow-[0_6px_0_#c28f0c,0_16px_24px_-6px_rgba(243,181,27,0.55)]"
                      >
                        <Send size={20} strokeWidth={2} />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
                      style={{ transform: "translateZ(25px)" }}
                    >
                      <h3 className="mb-1 text-xl font-semibold">
                        Let&apos;s talk about your business
                      </h3>
                      <p className="mb-6 text-sm text-gray-500">
                        Tell us what&apos;s slowing you down — no pressure, no tech jargon.
                      </p>
                    </motion.div>

                    <motion.form
                      onSubmit={handleSubmit}
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-3"
                    >
                      {/* Honeypot — hidden from real users, not a common autofill-triggering name */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "-9999px",
                          top: "-9999px",
                          height: 0,
                          overflow: "hidden",
                        }}
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

                      <Field label="Your name" value={name} onChange={setName} required maxLength={100} />
                      <Field label="Email" type="email" value={email} onChange={setEmail} required maxLength={150} />
                      <Field label="Phone (optional)" type="tel" value={phone} onChange={setPhone} maxLength={30} />
                      <Field
                        label="What's slowing your business down?"
                        value={message}
                        onChange={setMessage}
                        required
                        maxLength={2000}
                        textarea
                        rows={4}
                      />

                      {/* ERROR (shakes when it appears) */}
                      <AnimatePresence>
                        {status === "error" && (
                          <motion.p
                            key={errorMsg}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto", x: [0, -8, 8, -6, 6, 0] }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.45 }}
                            className="text-sm text-red-500"
                          >
                            {errorMsg}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* SUBMIT (3D press button) */}
                      <motion.button
                        variants={item}
                        type="submit"
                        disabled={status === "loading"}
                        whileHover={
                          status === "loading"
                            ? undefined
                            : {
                                y: -2,
                                boxShadow:
                                  "0 8px 0 #c28f0c, 0 18px 28px -6px rgba(243,181,27,0.6)",
                              }
                        }
                        whileTap={
                          status === "loading"
                            ? undefined
                            : { y: 4, boxShadow: "0 2px 0 #c28f0c, 0 6px 12px -4px rgba(243,181,27,0.5)" }
                        }
                        style={{ boxShadow: "0 6px 0 #c28f0c, 0 12px 22px -6px rgba(243,181,27,0.5)" }}
                        className="relative mt-2 overflow-hidden rounded-full bg-accent py-3 text-sm font-bold text-neutral-900 disabled:opacity-70"
                      >
                        {/* shimmer while loading */}
                        {status === "loading" && (
                          <motion.span
                            aria-hidden
                            className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{ x: ["0%", "300%"] }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <span className="relative">
                          {status === "loading" ? "Sending..." : "Send message"}
                        </span>
                      </motion.button>
                    </motion.form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}