"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, FileText } from "lucide-react";
import { generatePlanPdf, type PlanAnswer } from "@/lib/generatePlanPdf";

const ease = [0.22, 1, 0.36, 1] as const;

export default function PlanDownload({ answers }: { answers: PlanAnswer[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/plan-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers, hpField: hp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      await generatePlanPdf(answers, name);
      setStatus("done");
    } catch {
      setError("Could not create the PDF. Please try again.");
      setStatus("error");
    }
  }

  const inputCls =
    "w-full rounded-xl border border-black/10 bg-white/80 px-3.5 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

  return (
    <div className="mt-6 w-full">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.button
            key="cta"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            whileHover={{ y: -2 }}
            className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-accent/60 bg-accent/15 px-5 py-3 text-xs font-bold text-gray-900"
          >
            <FileText size={15} />
            Get your growth plan (PDF)
          </motion.button>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mx-auto flex max-w-[380px] flex-col gap-2.5 text-left"
          >
            {/* honeypot */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
              <input
                type="text"
                name="hp_plan_x7"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <input
              className={inputCls}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
            <input
              className={inputCls}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={150}
            />

            {status === "error" && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold text-white disabled:opacity-60"
            >
              <Download size={15} />
              {status === "loading"
                ? "Creating your PDF..."
                : status === "done"
                ? "Download again"
                : "Download PDF"}
            </button>

            <p className="text-center text-[10px] leading-[1.5] text-gray-400">
              We will save your details so our team can follow up. No spam.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}