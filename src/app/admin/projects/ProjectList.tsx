"use client";

import { useState } from "react";
import ProjectRow from "./ProjectRow";

const STATUSES = ["ALL", "DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING", "LAUNCHED", "COMPLETED"];

export default function ProjectList({ projects }: { projects: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.client.name || p.client.email).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex gap-3 mt-10 mb-5">
        <input
          placeholder="Search by client or project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-sage-light rounded-lg px-3 py-2.5 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-sage-light rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 rounded-xl bg-sage-light/30 text-center text-sm text-sage-dark">
          No projects match your filters.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p) => <ProjectRow key={p.id} project={p} />)}
        </div>
      )}
    </div>
  );
}