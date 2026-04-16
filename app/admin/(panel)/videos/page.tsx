"use client";

import { useEffect, useState, useCallback } from "react";
import { cn, truncate } from "@/lib/utils";
import treatmentsData from "@/data/treatments.json";

interface Video {
  id: string;
  title: string;
  description: string;
  treatment: string;
  category: string;
  difficulty: string;
  url: string;
  createdAt: string;
}

const CATEGORIES = ["Musculoskeletal", "Neurological", "Sports", "Geriatric", "Post-Surgical"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const treatments = treatmentsData as { name: string; slug: string }[];

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    file: null as File | null,
    title: "",
    description: "",
    treatment: "",
    category: "",
    difficulty: "",
  });

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      setVideos(data.videos ?? []);
      setError(null);
    } catch {
      setVideos([]);
      setError("Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.title.trim()) {
      alert("Please select a file and enter a title.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", form.file);
      fd.append("title", form.title.trim());
      fd.append("description", form.description);
      fd.append("treatment", form.treatment);
      fd.append("category", form.category);
      fd.append("difficulty", form.difficulty);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }
      setForm({ file: null, title: "", description: "", treatment: "", category: "", difficulty: "" });
      fetchVideos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/upload/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && [".mp4", ".webm"].some((ext) => file.name.toLowerCase().endsWith(ext))) {
      setForm((f) => ({ ...f, file }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="font-heading text-3xl font-bold text-charcoal mb-8">
        Video Manager
      </h1>

      {/* Upload form */}
      <section className="bg-card rounded-xl border border-border p-6 mb-8">
        <form onSubmit={handleUpload} className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              dragActive ? "border-orange bg-cream/50" : "border-border bg-warm-bg/50",
              form.file && "border-orange/50 bg-cream/30"
            )}
          >
            <input
              type="file"
              accept=".mp4,.webm"
              onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] ?? null }))}
              className="hidden"
              id="video-file"
            />
            <label htmlFor="video-file" className="cursor-pointer block">
              <UploadIcon className="w-12 h-12 mx-auto text-muted mb-2" />
              <p className="text-body font-medium">
                {form.file ? form.file.name : "Drag and drop .mp4 or .webm, or click to browse"}
              </p>
            </label>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-charcoal mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Video title"
              required
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/50"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief description"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-charcoal mb-1">
                Treatment
              </label>
              <select
                id="treatment"
                value={form.treatment}
                onChange={(e) => setForm((f) => ({ ...f, treatment: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50"
              >
                <option value="">Select treatment</option>
                {treatments.map((t) => (
                  <option key={t.slug} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-charcoal mb-1">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-charcoal mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={form.difficulty}
                onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/50"
              >
                <option value="">Select difficulty</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}

          <button
            type="submit"
            disabled={uploading || !form.file || !form.title.trim()}
            className="px-6 py-2.5 bg-orange hover:bg-orange-dark text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </section>

      {/* Video list */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-charcoal mb-4">
          Videos
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
                <div className="aspect-video bg-border rounded-lg mb-4" />
                <div className="h-4 w-3/4 bg-border rounded mb-2" />
                <div className="h-3 w-full bg-border rounded" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-16 text-center text-muted">
            <PlayIcon className="w-16 h-16 mx-auto mb-4 opacity-0.5" />
            <p className="text-lg mb-2">No videos yet</p>
            <p className="text-sm">Upload your first video above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <div
                key={v.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-charcoal/10 flex items-center justify-center relative group">
                  <div className="w-16 h-16 rounded-full bg-orange/90 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <PlayIcon className="w-8 h-8 ml-1" />
                  </div>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                    aria-label={`Play ${v.title}`}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-charcoal mb-1">
                    {v.title}
                  </h3>
                  {v.description && (
                    <p className="text-sm text-muted mb-2 line-clamp-2">
                      {truncate(v.description, 80)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {v.category && (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-info/10 text-info">
                        {v.category}
                      </span>
                    )}
                    {v.difficulty && (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning">
                        {v.difficulty}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(v.id)}
                    disabled={deletingId === v.id}
                    className="flex items-center gap-1.5 text-sm text-error hover:text-error/80 disabled:opacity-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    {deletingId === v.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
