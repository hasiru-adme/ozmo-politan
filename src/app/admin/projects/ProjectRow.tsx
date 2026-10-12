"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import PaymentPlanForm from "./PaymentPlanForm";
import DocumentsSection from "./DocumentsSection";



type Milestone = { id: string; title: string; completed: boolean };
type Project = {
  id: string;
  name: string;
  status: string;
  totalValue: any;
  paymentPlan?: { id: string } | null;
  client: { name: string | null; email: string };
  milestones: Milestone[];
  documents: Document[];
};

type Document = { id: string; fileName: string; fileUrl: string; fileSize: number; mimeType: string; createdAt: string };



const STATUSES = ["DISCOVERY", "DESIGN", "DEVELOPMENT", "TESTING", "LAUNCHED", "COMPLETED"];

export default function ProjectRow({ project }: { project: Project }) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [status, setStatus] = useState(project.status);
  const [totalValue, setTotalValue] = useState(project.totalValue.toString());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [newMilestone, setNewMilestone] = useState("");
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingMilestoneTitle, setEditingMilestoneTitle] = useState("");

  const doneCount = project.milestones.filter((m) => m.completed).length;

  async function toggleMilestone(m: Milestone) {
    try {
      const res = await fetch(`/api/admin/milestones/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !m.completed }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast("Failed to update milestone", "error");
    }
  }

  async function addMilestone() {
    if (!newMilestone.trim()) return;
    try {
      const res = await fetch("/api/admin/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, title: newMilestone }),
      });
      if (!res.ok) throw new Error();
      setNewMilestone("");
      toast("Milestone added");
      router.refresh();
    } catch {
      toast("Failed to add milestone", "error");
    }
  }

  async function saveMilestoneTitle(id: string) {
    if (!editingMilestoneTitle.trim()) return;
    try {
      const res = await fetch(`/api/admin/milestones/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingMilestoneTitle }),
      });
      if (!res.ok) throw new Error();
      setEditingMilestoneId(null);
      toast("Milestone renamed");
      router.refresh();
    } catch {
      toast("Failed to rename milestone", "error");
    }
  }

  async function deleteMilestone(id: string) {
    if (!confirm("Delete this milestone?")) return;
    try {
      const res = await fetch(`/api/admin/milestones/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Milestone deleted");
      router.refresh();
    } catch {
      toast("Failed to delete milestone", "error");
    }
  }

  async function saveEdit() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status, totalValue: parseFloat(totalValue) }),
      });
      if (!res.ok) throw new Error();
      setEditing(false);
      toast("Project updated");
      router.refresh();
    } catch {
      toast("Failed to update project", "error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject() {
    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Project deleted");
      router.refresh();
    } catch {
      toast("Failed to delete project", "error");
      setDeleting(false);
    }
  }

  return (
    <div className={`border border-sage-dark/30 rounded-xl p-5 bg-white transition-opacity ${deleting ? "opacity-40 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-sage-dark">{project.client.name || project.client.email}</p>
          {editing ? (
            <input className="border rounded px-2 py-1 mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          ) : (
            <h4 className="font-medium text-lg">{project.name}</h4>
          )}
        </div>

        <div className="flex items-center gap-3">
          {editing ? (
            <select className="border rounded px-2 py-1 bg-white" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-gold-light text-gold-dark font-medium">{project.status}</span>
          )}

          {editing ? (
            <>
              <input type="number" className="border rounded px-2 py-1 w-24" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} />
              <button onClick={saveEdit} disabled={loading} className="bg-sage-dark text-white px-3 py-1 rounded">{loading ? "..." : "Save"}</button>
              <button onClick={() => setEditing(false)} className="text-sage-dark">Cancel</button>
            </>
          ) : (
            <>
              <span className="text-sm">${project.totalValue.toString()}</span>
              <button onClick={() => setEditing(true)} className="text-gold-dark text-sm underline">Edit</button>
              <button onClick={deleteProject} className="text-red-500 text-sm underline">Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-sage-light">
        <p className="text-xs text-sage-dark mb-2">Milestones ({doneCount}/{project.milestones.length})</p>

        <div className="flex flex-col gap-1.5 mb-3">
          {project.milestones.map((m) => (
            <div key={m.id} className="flex items-center gap-2 group">
              <button
                onClick={() => toggleMilestone(m)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  m.completed ? "bg-sage text-white border-sage" : "bg-white text-sage-dark border-sage-dark/40"
                }`}
              >
                {m.completed ? "✓" : "○"}
              </button>

              {editingMilestoneId === m.id ? (
                <>
                  <input
                    autoFocus
                    value={editingMilestoneTitle}
                    onChange={(e) => setEditingMilestoneTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveMilestoneTitle(m.id)}
                    className="border border-sage-light rounded px-2 py-1 text-xs flex-1"
                  />
                  <button onClick={() => saveMilestoneTitle(m.id)} className="text-xs text-sage-dark font-medium">Save</button>
                  <button onClick={() => setEditingMilestoneId(null)} className="text-xs text-gray-400">Cancel</button>
                </>
              ) : (
                <>
                  <span className="text-sm flex-1">{m.title}</span>
                  <button
                    onClick={() => { setEditingMilestoneId(m.id); setEditingMilestoneTitle(m.title); }}
                    className="text-xs text-gold-dark underline opacity-0 group-hover:opacity-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMilestone(m.id)}
                    className="text-xs text-red-400 underline opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            placeholder="New milestone name"
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMilestone()}
            className="border border-sage-light rounded-lg px-3 py-1.5 text-xs flex-1"
          />
          <button onClick={addMilestone} className="text-xs bg-sage-light text-sage-dark font-medium px-3 py-1.5 rounded-lg hover:bg-sage-light/70 transition">
            + Add
          </button>
        </div>
      </div>
      <DocumentsSection projectId={project.id} documents={project.documents} />

      {!project.paymentPlan && (
        <PaymentPlanForm projectId={project.id} totalValue={project.totalValue.toString()} />
      )}
    </div>
  );
}