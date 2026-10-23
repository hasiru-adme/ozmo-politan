import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdmeTechSection from "@/components/AdmeTechSection";

export const metadata: Metadata = {
  title: "IoT & Electronics | OZMO",
  description:
    "Electronics, embedded firmware and connected systems from the ADME.Tech team.",
};

export default function IotPage() {
  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-[72px] items-center justify-between bg-charcoal/80 px-[6vw] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-white">
          <span className="block h-2.5 w-2.5 rounded-full bg-accent" />
          OZMO
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
        >
          <ArrowLeft size={15} /> Back to home
        </Link>
      </header>
      <main className="pt-[72px]">
        <AdmeTechSection />
      </main>
    </>
  );
}