"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "ARCHIVED";
  createdAt: string | Date;
};

const statusStyles: Record<string, string> = {
  NEW: "bg-gold-light text-gold-dark",
  CONTACTED: "bg-sage/20 text-sage-dark",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function ContactList({ submissions }: { submissions: Submission[] }) {
  const router = useRouter();
  const toast = useToast();
  const [filter, setFilter] = useState("ALL");

  const filtered = submissions.filter((s) => filter === "ALL" || s.status === filter);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast("Failed to update status", "error");
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {["ALL", "NEW", "CONTACTED", "ARCHIVED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
              filter === s ? "bg-sage-dark text-white" : "bg-white border border-sage-light text-sage-dark"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 rounded-xl bg-sage-light/30 text-center text-sm text-sage-dark">No submissions.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white border border-sage-light rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-sage-dark">{s.email}{s.phone ? ` · ${s.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[s.status]}`}>
                    {s.status}
                  </span>
                  <select
                    value={s.status}
                    onChange={(e) => updateStatus(s.id, e.target.value)}
                    className="text-xs border border-sage-light rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{s.message}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(s.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}