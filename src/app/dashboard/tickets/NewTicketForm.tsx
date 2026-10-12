"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function NewTicketForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, subject, message, priority }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to create ticket");
      const { ticket } = await res.json();
      toast("Ticket created");
      router.push(`/dashboard/tickets/${ticket.id}`);
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-gold-dark hover:bg-gold-dark/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
      >
        + New Ticket
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-sage-light rounded-xl p-5 flex flex-col gap-3">
      <input
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        className="border border-sage-light rounded-lg px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Describe your issue..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={4}
        className="border border-sage-light rounded-lg px-3 py-2 text-sm resize-none"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="border border-sage-light rounded-lg px-3 py-2 text-sm bg-white w-fit"
      >
        <option value="LOW">Low priority</option>
        <option value="MEDIUM">Medium priority</option>
        <option value="HIGH">High priority</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-sage-dark hover:bg-sage-dark/90 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-sage-dark px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}