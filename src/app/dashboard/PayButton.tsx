"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function PayButton({ installmentId }: { installmentId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/mock-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ installmentId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Payment failed");
      toast("Payment successful");
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-sage-dark hover:bg-sage-dark/90 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}