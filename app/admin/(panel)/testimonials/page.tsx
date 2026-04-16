"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: string;
  patientName: string;
  rating: number;
  story: string;
  category: string;
  videoPath?: string | null;
  active: boolean;
}

const CATEGORIES = [
  "Musculoskeletal",
  "Neurological",
  "Sports",
  "Geriatric",
  "Post-Surgical",
];

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "add" | "edit">(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState("");
  const [rating, setRating] = useState(5);
  const [story, setStory] = useState("");
  const [category, setCategory] = useState("Musculoskeletal");

  const fetchTestimonials = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(true);
  }, []);

  const refetch = () => fetchTestimonials(false);

  const openAddModal = () => {
    setPatientName("");
    setRating(5);
    setStory("");
    setCategory("Musculoskeletal");
    setEditingTestimonial(null);
    setModal("add");
  };

  const openEditModal = (t: Testimonial) => {
    setPatientName(t.patientName);
    setRating(t.rating);
    setStory(t.story);
    setCategory(t.category);
    setEditingTestimonial(t);
    setModal("edit");
  };

  const closeModal = () => {
    setModal(null);
    setEditingTestimonial(null);
  };

  const handleSave = async () => {
    if (!patientName.trim() || !story.trim()) return;

    try {
      if (modal === "add") {
        const res = await fetch("/api/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: patientName.trim(),
            rating,
            story: story.trim(),
            category,
            source: "admin",
          }),
        });
        const data = await res.json();
        if (data.success) {
          closeModal();
          refetch();
        }
      } else if (modal === "edit" && editingTestimonial) {
        const res = await fetch(`/api/testimonials/${editingTestimonial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: patientName.trim(),
            rating,
            story: story.trim(),
            category,
          }),
        });
        const data = await res.json();
        if (data.success) {
          closeModal();
          refetch();
        }
      }
    } catch {
      // Handle error silently or show toast
    }
  };

  const handleToggleActive = async (t: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !t.active }),
      });
      const data = await res.json();
      if (data.success) {
        refetch();
      }
    } catch {
      // Handle error
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/testimonials/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setDeleteId(null);
        refetch();
      }
    } catch {
      // Handle error
    }
  };

  const truncate = (s: string, len: number) =>
    s.length <= len ? s : s.slice(0, len) + "...";

  const pendingCount = testimonials.filter((t) => !t.active).length;
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "approved">("all");

  const displayTestimonials = testimonials.filter((t) => {
    if (filterTab === "pending") return !t.active;
    if (filterTab === "approved") return t.active;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page title row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-heading font-semibold text-2xl text-charcoal">
          Testimonial Manager
        </h1>
        <button
          type="button"
          onClick={openAddModal}
          className="bg-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-dark transition-colors"
        >
          Add New
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: "all" as const, label: "All", count: testimonials.length },
          { key: "pending" as const, label: "Pending Approval", count: pendingCount },
          { key: "approved" as const, label: "Approved", count: testimonials.length - pendingCount },
        ]).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterTab === tab.key
                ? "bg-orange text-white"
                : "bg-card border border-border text-body hover:border-orange/50"
            }`}
          >
            {tab.label}
            {tab.key === "pending" && tab.count > 0 && (
              <span className="ml-2 bg-white/20 text-inherit px-2 py-0.5 rounded-full text-xs font-bold">
                {tab.count}
              </span>
            )}
            {tab.key !== "pending" && (
              <span className="ml-2 opacity-70 text-xs">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && filterTab !== "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-amber-800">
            <strong>{pendingCount}</strong> testimonial{pendingCount !== 1 ? "s" : ""} pending approval from patients.{" "}
            <button type="button" onClick={() => setFilterTab("pending")} className="text-orange font-medium hover:underline">
              Review now
            </button>
          </p>
        </div>
      )}

      {/* Testimonial grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-warm-bg animate-pulse rounded-xl h-64"
            />
          ))}
        </div>
      ) : displayTestimonials.length === 0 ? (
        <p className="text-center text-body py-12">
          {filterTab === "pending"
            ? "No pending testimonials to review."
            : filterTab === "approved"
            ? "No approved testimonials yet."
            : "No testimonials yet. Add your first one!"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTestimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-card rounded-xl border p-6 flex flex-col gap-4 ${
                !t.active ? "border-amber-300 ring-1 ring-amber-200" : "border-border"
              }`}
            >
              {!t.active && (
                <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full w-fit">
                  Pending Approval
                </span>
              )}
              <div className="font-heading font-semibold text-charcoal">
                {t.patientName}
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={i <= t.rating ? "text-orange" : "text-orange/30"}
                  >
                    <StarIcon />
                  </span>
                ))}
              </div>
              <span className="text-xs bg-cream text-orange px-2.5 py-1 rounded-full w-fit">
                {t.category}
              </span>
              <p className="text-sm text-body">
                {truncate(t.story, 100)}
              </p>
              <div className="flex items-center gap-2 mt-auto pt-2">
                {!t.active ? (
                  <button
                    type="button"
                    onClick={() => handleToggleActive(t)}
                    className="px-4 py-2 rounded-lg bg-teal text-white text-sm font-medium hover:bg-teal/90 transition-colors"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleActive(t)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-success/10 text-success"
                  >
                    Approved
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEditModal(t)}
                  className="text-orange hover:underline font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(t.id)}
                  className="text-error hover:underline font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-card rounded-xl p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading font-semibold text-xl text-charcoal mb-6">
              {modal === "add" ? "Add Testimonial" : "Edit Testimonial"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Patient Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-body"
                  placeholder="Patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Star Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i)}
                      className="cursor-pointer p-0.5"
                      aria-label={`Set rating to ${i}`}
                    >
                      <span
                        className={
                          i <= rating ? "text-orange" : "text-orange/30"
                        }
                      >
                        <StarIcon />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Story *
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={4}
                  className="w-full border border-border rounded-lg px-3 py-2 text-body resize-none"
                  placeholder="Patient story"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-body"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 border border-border rounded-lg px-4 py-2 text-body font-medium hover:bg-warm-bg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-orange text-white rounded-lg px-4 py-2 font-medium hover:bg-orange-dark"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div
            className="bg-card rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-body mb-6">
              Are you sure you want to delete this testimonial?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-border rounded-lg px-4 py-2 text-body font-medium hover:bg-warm-bg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-error text-white rounded-lg px-4 py-2 font-medium hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
