"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

type Doc = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsSection({ projectId, documents }: { projectId: string; documents: Doc[] }) {
  const router = useRouter();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast("File too large (max 10MB)", "error");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);

      const res = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
      toast("Document uploaded");
      router.refresh();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string, fileName: string) {
    if (!confirm(`Delete "${fileName}"?`)) return;
    try {
      const res = await fetch("/api/admin/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      toast("Document deleted");
      router.refresh();
    } catch {
      toast("Failed to delete document", "error");
    }
  }

  return (
    <div className="mt-4 pt-3 border-t border-sage-light">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-sage-dark">Documents ({documents.length})</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-xs bg-sage-light text-sage-dark font-medium px-3 py-1.5 rounded-lg hover:bg-sage-light/70 transition"
        >
          {uploading ? "Uploading..." : "+ Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {documents.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {documents.map((d) => (
            <div key={d.id} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-gray-50 group">
              <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 truncate hover:underline">
                📄 {d.fileName}
              </a>
              <span className="text-gray-400 mx-2">{formatSize(d.fileSize)}</span>
              <button
                onClick={() => handleDelete(d.id, d.fileName)}
                className="text-red-400 underline opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}