"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function PaymentPlanForm({ projectId, totalValue }: { projectId: string; totalValue: string }) {
  const router = useRouter();
  const toast = useToast();
  const [type, setType] = useState<"FULL" | "INSTALLMENTS">("FULL");
  const [months, setMonths] = useState("6");
  const [loading, setLoading] = useState(false);

  async function createPlan() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          type,
          totalAmount: parseFloat(totalValue),
          numberOfMonths: type === "FULL" ? 1 : parseInt(months),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast("Payment plan created");
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sage-light">
      <select
        value={type}
        onChange={(e) => setType(e.target.value as any)}
        className="border border-sage-light rounded-lg px-2 py-1.5 text-xs bg-white"
      >
        <option value="FULL">Pay in full</option>
        <option value="INSTALLMENTS">Installments</option>
      </select>

      {type === "INSTALLMENTS" && (
        <select
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          className="border border-sage-light rounded-lg px-2 py-1.5 text-xs bg-white"
        >
          {[3, 6, 12, 24].map((m) => <option key={m} value={m}>{m} months</option>)}
        </select>
      )}

      <button
        onClick={createPlan}
        disabled={loading}
        className="bg-gold-dark hover:bg-gold-dark/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
      >
        {loading ? "Creating..." : "Create Payment Plan"}
      </button>
    </div>
  );
}