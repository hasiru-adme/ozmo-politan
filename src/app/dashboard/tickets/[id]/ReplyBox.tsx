"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function ReplyBox({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send");
      setBody("");
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a reply..."
        rows={2}
        className="flex-1 border border-sage-light rounded-lg px-3 py-2 text-sm resize-none"
      />
      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-sage-dark hover:bg-sage-dark/90 disabled:opacity-60 text-white text-sm font-medium px-4 rounded-lg transition"
      >
        Send
      </button>
    </div>
  );
}