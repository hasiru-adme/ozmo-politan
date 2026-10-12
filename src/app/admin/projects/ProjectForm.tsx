"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type Client = { id: string; name: string | null; email: string };

export default function ProjectForm({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const toast = useToast();
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [expectedLaunch, setExpectedLaunch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          name,
          description,
          totalValue: parseFloat(totalValue),
          expectedLaunch: expectedLaunch || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create project");
      }

      setName("");
      setDescription("");
      setTotalValue("");
      setExpectedLaunch("");
      setClientId("");
      toast("Project created");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-sage-light rounded-lg px-3 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition";

  return (
    <div className="bg-white border border-sage-light rounded-xl p-6">
      <h3 className="text-lg font-medium mb-5">New Project</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
          className={`${inputClass} col-span-2`}
        >
          <option value="">Select a client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name || c.email}</option>
          ))}
        </select>

        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`${inputClass} col-span-2`}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`${inputClass} col-span-2 resize-none`}
        />

        <input
          type="number"
          step="0.01"
          placeholder="Total value ($)"
          value={totalValue}
          onChange={(e) => setTotalValue(e.target.value)}
          required
          className={inputClass}
        />

        <input
          type="date"
          value={expectedLaunch}
          onChange={(e) => setExpectedLaunch(e.target.value)}
          className={inputClass}
        />

        {error && <p className="col-span-2 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-sage-dark hover:bg-sage-dark/90 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}