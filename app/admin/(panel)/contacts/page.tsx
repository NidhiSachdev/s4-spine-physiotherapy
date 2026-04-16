"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatDateTime } from "@/lib/utils";

interface Contact {
  ID: string;
  Name: string;
  Email?: string;
  Phone: string;
  Subject?: string;
  Message: string;
  Status: string;
  "Submitted At": string;
}

type FilterStatus = "all" | "Unread" | "Read";

const PER_PAGE = 10;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.contacts || []);
      })
      .catch(() => setContacts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = contacts;
    if (filter === "Unread") {
      list = list.filter((c) => String(c.Status).toLowerCase() === "unread");
    } else if (filter === "Read") {
      list = list.filter((c) => String(c.Status).toLowerCase() === "read");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          String(c.Name).toLowerCase().includes(q) ||
          String(c.Subject || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [contacts, filter, search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const unreadCount = contacts.filter(
    (c) => String(c.Status).toLowerCase() === "unread"
  ).length;

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus.toLowerCase() === "read" ? "Unread" : "Read";
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      setContacts((prev) =>
        prev.map((c) =>
          c.ID === id ? { ...c, Status: newStatus } : c
        )
      );
    } catch {
      // silent
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-charcoal">
              Contact Submissions
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {(["all", "Unread", "Read"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? "bg-orange text-white"
                    : "bg-card border border-border text-body hover:bg-cream"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs flex-1 rounded-lg border border-border px-4 py-2 focus:ring-2 focus:ring-orange focus:border-orange outline-none"
          />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-4 bg-border rounded w-12" />
                    <div className="h-4 bg-border rounded flex-1" />
                    <div className="h-4 bg-border rounded w-24" />
                    <div className="h-4 bg-border rounded w-16" />
                  </div>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted">
              No contact submissions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-border bg-warm-bg">
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                      ID
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                      Name
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                      Phone
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                      Subject
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c) => (
                    <React.Fragment key={c.ID}>
                      <tr
                        key={c.ID}
                        onClick={() =>
                          setExpandedId((prev) => (prev === c.ID ? null : c.ID))
                        }
                        className="border-b border-border hover:bg-cream/50 cursor-pointer transition"
                      >
                        <td className="px-4 py-3 text-sm text-body">{c.ID}</td>
                        <td className="px-4 py-3 text-sm font-medium text-charcoal">
                          {c.Name}
                        </td>
                        <td className="px-4 py-3 text-sm text-body">{c.Phone}</td>
                        <td className="px-4 py-3 text-sm text-body hidden md:table-cell">
                          {c.Email || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-body">
                          {c.Subject || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-body">
                          {formatDateTime(c["Submitted At"])}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-sm ${
                              String(c.Status).toLowerCase() === "unread"
                                ? "font-bold text-charcoal"
                                : "text-muted"
                            }`}
                          >
                            {String(c.Status).toLowerCase() === "unread" && (
                              <span className="w-2 h-2 rounded-full bg-orange" />
                            )}
                            {c.Status}
                          </span>
                        </td>
                      </tr>
                      {expandedId === c.ID && (
                        <tr key={`${c.ID}-expanded`} className="bg-cream/30">
                          <td
                            colSpan={7}
                            className="px-4 py-4 border-b border-border"
                          >
                            <div className="space-y-3">
                              <p className="text-sm text-body whitespace-pre-wrap">
                                {c.Message}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStatus(c.ID, c.Status);
                                  }}
                                  className="px-3 py-1.5 text-sm rounded-lg bg-orange text-white font-medium hover:bg-orange-dark transition"
                                >
                                  {String(c.Status).toLowerCase() === "read"
                                    ? "Mark as Unread"
                                    : "Mark as Read"}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filtered.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-sm text-muted">
                Showing {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 rounded-lg border border-border text-body hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg border border-border text-body hover:bg-cream disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
