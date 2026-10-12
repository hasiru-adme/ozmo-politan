"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Cloud,
  DatabaseBackup,
  Mail,
  ShieldCheck,
  Server,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/packagesData";

const ease = [0.22, 1, 0.36, 1] as const;

type PaymentPlan = "full" | "6" | "12" | "24";

const paymentPlans = [
  { id: "full" as PaymentPlan, label: "Pay in Full", suffix: "one-time" },
  { id: "6" as PaymentPlan, label: "6 Months", suffix: "interest-free" },
  { id: "12" as PaymentPlan, label: "12 Months", suffix: "interest-free" },
  { id: "24" as PaymentPlan, label: "24 Months", suffix: "interest-free" },
];

const managedServices = [
  { icon: Server, title: "Managed Hosting", description: "Fast, reliable infrastructure managed by our team." },
  { icon: ShieldCheck, title: "Security", description: "SSL, security updates and ongoing protection." },
  { icon: Settings2, title: "Maintenance", description: "Technical updates, fixes and continuous improvements." },
  { icon: Mail, title: "Business Email", description: "Professional email setup and ongoing management." },
  { icon: DatabaseBackup, title: "Backups", description: "Regular backups to help keep your business protected." },
  { icon: Cloud, title: "Technical Support", description: "A team available when your digital system needs help." },
];

function AnimatedWords({
  text,
  delay = 0,
  className = "",
  duration = 0.5,
  stagger = 0.05,
}: {
  text: string;
  delay?: number;
  className?: string;
  duration?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25, once: false });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 18, filter: "blur(5px)" }
          }
          transition={{ duration, delay: inView ? delay + index * stagger : 0, ease }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15, once: false });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay: inView ? delay : 0, ease }}
    >
      {children}
    </motion.div>
  );
}

export default function PackagesSection() {
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>("12");
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

  const activeCategory =
    categories.find((c) => c.id === selectedCategory) ?? categories[0];

  const rowRef = useRef<HTMLDivElement>(null);

  // mouse wheel -> horizontal scroll inside the category row
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // at the edge: let the page scroll normally
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const scrollRow = (dir: 1 | -1) =>
    rowRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  const getMonthlyPrice = (price: number) => {
    if (selectedPlan === "full") return price;
    return Math.ceil(price / Number(selectedPlan));
  };

  return (
    <section
      id="packages"
      className="relative overflow-hidden bg-[#f0f0eb] px-[5vw] py-[100px] md:px-[6vw] md:py-[150px]"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[20%] top-[5%] h-[450px] w-[450px] rounded-full bg-accent/[0.035] blur-[120px]" />
        <div className="absolute bottom-[-180px] right-[5%] h-[400px] w-[400px] rounded-full bg-accent/[0.025] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1250px]">
        {/* HEADER */}
        <div className="mx-auto max-w-[850px] text-center">
          <AnimatedWords
            text="Build it. Pay your way."
            delay={0.05}
            stagger={0.065}
            duration={0.6}
            className="text-[clamp(42px,6vw,82px)] leading-[0.95] tracking-[-0.05em]"
          />

          <AnimatedWords
            text="We'll manage the rest."
            delay={0.2}
            stagger={0.065}
            duration={0.6}
            className="mt-1 text-[clamp(42px,6vw,82px)] leading-[0.95] tracking-[-0.05em] text-[#a57950]"
          />

          <AnimatedWords
            text="Choose the solution your business needs, then choose how you want to pay. We take care of the technology after launch."
            delay={0.3}
            stagger={0.025}
            duration={0.45}
            className="mx-auto mt-7 max-w-[650px] text-[14px] leading-[1.75] text-gray-600 md:text-[16px]"
          />
        </div>

        {/* CATEGORY SELECTOR */}
        <Reveal delay={0.2} className="mx-auto mt-12 max-w-[1000px]">
          <div className="rounded-[24px] border border-black/[0.07] bg-white/70 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="mb-3 px-3 pt-2 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                What do you need?
              </p>
            </div>

            {/* single line, horizontal scroll */}
            <div className="relative">
              <div
                ref={rowRef}
                className="flex gap-1.5 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  const Icon = cat.icon;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      aria-pressed={active}
                      suppressHydrationWarning
                      className={`relative shrink-0 whitespace-nowrap rounded-[18px] px-4 py-3.5 text-left transition-colors duration-300 ${
                        active ? "text-white shadow-lg" : "text-gray-600 hover:bg-black/[0.04]"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="category-active"
                          className="absolute inset-0 rounded-[18px] bg-black"
                          transition={{ duration: 0.3, ease }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            active ? "bg-accent text-black" : "bg-black/[0.05]"
                          }`}
                        >
                          <Icon size={14} />
                        </span>
                        <span className="text-xs font-bold leading-tight">{cat.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* arrows (desktop) */}
              <button
                onClick={() => scrollRow(-1)}
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md md:flex"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollRow(1)}
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md md:flex"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <motion.p
              key={activeCategory.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="px-3 pb-2 pt-3 text-left text-[12px] text-gray-500"
            >
              {activeCategory.tagline}
            </motion.p>
          </div>
        </Reveal>

        {/* PAYMENT SELECTOR */}
        <Reveal delay={0.25} className="mx-auto mt-6 max-w-[760px]">
          <div className="rounded-[24px] border border-black/[0.07] bg-white/70 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            <div className="mb-3 px-3 pt-2 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-gray-400">
                Choose how you want to pay
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4">
              {paymentPlans.map((plan) => {
                const active = selectedPlan === plan.id;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    suppressHydrationWarning
                    className={`group relative rounded-[18px] px-3 py-3.5 text-left transition-all duration-300 ${
                      active ? "bg-black text-white shadow-lg" : "text-gray-600 hover:bg-black/[0.04]"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="payment-active"
                        className="absolute inset-0 rounded-[18px] bg-black"
                        transition={{ duration: 0.3, ease }}
                      />
                    )}

                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{plan.label}</span>
                        {active && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-black">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <span className={`mt-1 block text-[9px] ${active ? "text-white/50" : "text-gray-400"}`}>
                        {plan.suffix}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* PACKAGE CARDS (key = category, so cards re-animate on change) */}
        <div key={activeCategory.id} className="mt-10 grid gap-5 lg:grid-cols-3">
          {activeCategory.packages.map((pkg, index) => {
            const monthly = getMonthlyPrice(pkg.price);

            return (
              <Reveal key={pkg.id} delay={index * 0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -7 }}
                  transition={{ duration: 0.35, ease }}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] border p-7 md:p-8 ${
                    pkg.popular
                      ? "border-black bg-black text-white shadow-[0_25px_70px_rgba(0,0,0,0.13)]"
                      : "border-black/[0.07] bg-white/75 text-black shadow-[0_20px_60px_rgba(0,0,0,0.04)]"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-black">
                      <Sparkles size={11} />
                      Most Popular
                    </div>
                  )}

                  {/* Decorative glow */}
                  <div
                    className={`pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full blur-[80px] transition-opacity duration-500 ${
                      pkg.popular
                        ? "bg-accent/20"
                        : "bg-accent/[0.06] opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  <div className="relative z-10">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-[0.16em] ${
                        pkg.popular ? "text-white/40" : "text-gray-400"
                      }`}
                    >
                      {pkg.eyebrow}
                    </span>

                    <h3 className="mt-3 text-[32px] font-medium tracking-[-0.04em]">{pkg.name}</h3>

                    <p
                      className={`mt-3 min-h-[70px] text-[13px] leading-[1.65] ${
                        pkg.popular ? "text-white/55" : "text-gray-500"
                      }`}
                    >
                      {pkg.description}
                    </p>

                    {/* Price */}
                    <div
                      className={`mt-7 border-y py-5 ${
                        pkg.popular ? "border-white/10" : "border-black/[0.07]"
                      }`}
                    >
                      <span
                        className={`text-[9px] uppercase tracking-[0.12em] ${
                          pkg.popular ? "text-white/35" : "text-gray-400"
                        }`}
                      >
                        From
                      </span>

                      <div className="mt-1 flex items-end gap-2">
                        <motion.span
                          key={`${pkg.id}-${selectedPlan}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease }}
                          className="text-[36px] font-medium tracking-[-0.04em]"
                        >
                          ${selectedPlan === "full" ? pkg.price.toLocaleString() : monthly.toLocaleString()}
                        </motion.span>

                        <span
                          className={`mb-1.5 text-[10px] ${pkg.popular ? "text-white/40" : "text-gray-400"}`}
                        >
                          {selectedPlan === "full" ? "one-time" : "/ month"}
                        </span>
                      </div>

                      {selectedPlan !== "full" && (
                        <p className={`mt-1 text-[9px] ${pkg.popular ? "text-accent" : "text-gray-400"}`}>
                          {selectedPlan} month payment plan
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="mt-6 space-y-3">
                      {pkg.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: false }}
                          transition={{ duration: 0.4, delay: 0.15 + featureIndex * 0.04, ease }}
                          className="flex items-start gap-3"
                        >
                          <span
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                              pkg.popular ? "bg-accent text-black" : "bg-black/[0.06] text-black"
                            }`}
                          >
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span className={`text-[12px] ${pkg.popular ? "text-white/70" : "text-gray-600"}`}>
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={`#contact?category=${activeCategory.id}&package=${pkg.id}`}
                    className={`group/btn relative z-10 mt-auto flex w-full items-center justify-between rounded-full px-5 py-3.5 text-xs font-bold transition-all duration-300 ${
                      pkg.popular
                        ? "bg-white text-black hover:bg-accent"
                        : "bg-black text-white hover:bg-accent hover:text-black"
                    }`}
                  >
                    <span>Choose {pkg.name}</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover/btn:translate-x-1">
                      <ArrowRight size={15} />
                    </span>
                  </a>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        {/* SUPPORT MESSAGE */}
        <Reveal delay={0.25} className="mt-10">
          <div className="relative overflow-hidden rounded-[26px] border border-accent/20 bg-accent/[0.07] px-6 py-7 text-center md:px-10">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[180px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.10] blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-3 flex items-center gap-2 text-accent">
                <Zap size={16} />
                <span className="text-[10px] font-bold uppercase tracking-[0.13em]">After launch</span>
              </div>

              <AnimatedWords
                text="Your first 3 months of support can be free."
                delay={0.1}
                stagger={0.04}
                duration={0.45}
                className="text-[22px] font-medium tracking-[-0.025em] md:text-[28px]"
              />

              <AnimatedWords
                text="Then choose a monthly managed service that covers hosting, maintenance, email, security and technical support."
                delay={0.2}
                stagger={0.025}
                duration={0.4}
                className="mt-3 max-w-[650px] text-[12px] leading-[1.7] text-gray-600 md:text-[13px]"
              />
            </div>
          </div>
        </Reveal>

        {/* MANAGED SERVICES */}
        <div className="mt-24">
          <div className="mx-auto max-w-[700px] text-center">
            <AnimatedWords
              text="You focus on your business."
              delay={0.05}
              stagger={0.045}
              duration={0.5}
              className="text-[clamp(30px,4vw,52px)] leading-[1] tracking-[-0.045em]"
            />

            <AnimatedWords
              text="We manage the digital side."
              delay={0.2}
              stagger={0.045}
              duration={0.5}
              className="mt-1 text-[clamp(30px,4vw,52px)] leading-[1] tracking-[-0.045em] text-[#a57950]"
            />
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {managedServices.map((service, index) => {
              const Icon = service.icon;

              return (
                <Reveal key={service.title} delay={index * 0.06}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3, ease }}
                    className="group rounded-[22px] border border-black/[0.06] bg-white/60 p-6 transition-all duration-300 hover:border-black/[0.12] hover:bg-white hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04] transition-all duration-300 group-hover:scale-105 group-hover:bg-accent">
                      <Icon size={18} />
                    </div>

                    <AnimatedWords
                      text={service.title}
                      delay={0.05}
                      stagger={0.035}
                      duration={0.4}
                      className="mt-5 text-[15px] font-semibold tracking-[-0.01em]"
                    />

                    <AnimatedWords
                      text={service.description}
                      delay={0.1}
                      stagger={0.018}
                      duration={0.35}
                      className="mt-2 text-[14px] leading-[1.65] text-gray-500"
                    />
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* FINAL MESSAGE */}
        <Reveal delay={0.3} className="mt-20 text-center">
          <div className="mx-auto h-px w-12 bg-accent" />

          <AnimatedWords
            text="Build once. Keep improving. Grow with confidence."
            delay={0.1}
            stagger={0.045}
            duration={0.5}
            className="mt-7 text-[clamp(24px,3vw,40px)] leading-[1.05] tracking-[-0.04em]"
          />

          <AnimatedWords
            text="One digital partner from launch to long-term growth."
            delay={0.2}
            stagger={0.035}
            duration={0.4}
            className="mx-auto mt-3 text-[12px] text-gray-500"
          />
        </Reveal>
      </div>
    </section>
  );
}