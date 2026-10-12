"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export default function StatusSelect({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setStatus(newStatus);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast("Status updated");
      router.refresh();
    } catch {
      toast("Failed to update status", "error");
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-sage-light rounded-lg px-3 py-1.5 text-sm bg-white"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
    </select>
  );
}