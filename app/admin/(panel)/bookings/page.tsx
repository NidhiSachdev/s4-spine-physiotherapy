"use client";

import React, { useEffect, useState, useMemo } from "react";
import { cn, formatDate, formatDateTime } from "@/lib/utils";

interface Booking {
  ID: string;
  Name: string;
  Phone: string;
  Age?: number;
  Treatment: string;
  "Preferred Date": string;
  "Preferred Time": string;
  "Condition Notes"?: string;
  Status: string;
  "Submitted At": string;
}

const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"] as const;

const STATUS_BADGE_CLASSES: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Confirmed: "bg-info/10 text-info",
  Completed: "bg-success/10 text-success",
  Cancelled: "bg-error/10 text-error",
};

const ROWS_PER_PAGE = 10;

export default function BookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, string>>({});
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data.bookings ?? []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (statusFilter !== "All") {
      result = result.filter(
        (b) => String(b.Status).toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          String(b.Name).toLowerCase().includes(q) ||
          String(b.Phone).toLowerCase().includes(q)
      );
    }

    return result;
  }, [bookings, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filteredBookings.length / ROWS_PER_PAGE) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredBookings.slice(start, start + ROWS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const handleRowClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    if (!selectedStatus[id]) {
      const b = bookings.find((x) => x.ID === id);
      if (b) setSelectedStatus((s) => ({ ...s, [id]: b.Status }));
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setSelectedStatus((s) => ({ ...s, [id]: status }));
  };

  const handleUpdate = async (id: string) => {
    const status = selectedStatus[id];
    if (!status) return;

    setUpdatingId(id);
    setUpdateSuccess(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.ID === id ? { ...b, Status: status } : b))
        );
        setUpdateSuccess(id);
        setTimeout(() => setUpdateSuccess(null), 3000);
      } else {
        alert(data.error ?? "Update failed");
      }
    } catch {
      alert("Failed to update booking");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="font-heading text-3xl font-bold text-charcoal flex items-center gap-3">
          Booking Manager
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-warm-bg text-charcoal">
            {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
          </span>
        </h1>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {["All", ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                statusFilter === status
                  ? "bg-orange text-white"
                  : "bg-warm-bg text-charcoal hover:bg-border"
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-border bg-card text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange/50"
        />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="h-4 w-12 bg-border rounded" />
                  <div className="h-4 flex-1 bg-border rounded" />
                  <div className="h-4 w-24 bg-border rounded" />
                  <div className="h-4 w-20 bg-border rounded" />
                  <div className="h-4 w-16 bg-border rounded" />
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-16 text-center text-muted">
              <p className="text-lg mb-2">No bookings found.</p>
              <p className="text-sm">
                {statusFilter !== "All" || searchQuery
                  ? "Try adjusting your filters."
                  : "Bookings will appear here when submitted."}
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-warm-bg font-medium text-charcoal text-sm">
                  <th className="w-8 px-4 py-3" />
                  <th className="text-left px-6 py-3">ID</th>
                  <th className="text-left px-6 py-3">Name</th>
                  <th className="text-left px-6 py-3">Phone</th>
                  <th className="text-left px-6 py-3">Treatment</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Time</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBookings.map((b) => {
                  const isExpanded = expandedId === b.ID;
                  return (
                    <React.Fragment key={b.ID}>
                      <tr
                        onClick={() => handleRowClick(b.ID)}
                        className={cn(
                          "border-b border-border hover:bg-warm-bg/50 cursor-pointer transition-colors",
                          isExpanded && "bg-warm-bg/50"
                        )}
                      >
                        <td className="px-4 py-3">
                          {isExpanded ? (
                            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </td>
                        <td className="px-6 py-4 text-body">{b.ID}</td>
                        <td className="px-6 py-4 text-body">{b.Name}</td>
                        <td className="px-6 py-4 text-body">{b.Phone}</td>
                        <td className="px-6 py-4 text-body">{b.Treatment}</td>
                        <td className="px-6 py-4 text-body">
                          {formatDate(b["Preferred Date"])}
                        </td>
                        <td className="px-6 py-4 text-body">
                          {b["Preferred Time"] || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "inline-flex px-2.5 py-1 rounded-full text-xs font-medium",
                              STATUS_BADGE_CLASSES[b.Status] ??
                                "bg-muted/10 text-muted"
                            )}
                          >
                            {b.Status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-body text-sm">
                          {formatDateTime(b["Submitted At"])}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-cream/30">
                          <td colSpan={9} className="px-6 py-4">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-medium text-muted uppercase mb-1">
                                    Condition Notes
                                  </p>
                                  <p className="text-body">
                                    {b["Condition Notes"] || "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-muted uppercase mb-1">
                                    Age
                                  </p>
                                  <p className="text-body">
                                    {b.Age != null ? b.Age : "—"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
                                <select
                                  value={selectedStatus[b.ID] ?? b.Status}
                                  onChange={(e) =>
                                    handleStatusChange(b.ID, e.target.value)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-3 py-2 rounded-lg border border-border bg-card text-body text-sm focus:outline-none focus:ring-2 focus:ring-orange/50"
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdate(b.ID);
                                  }}
                                  disabled={updatingId === b.ID}
                                  className="px-4 py-2 rounded-lg bg-orange text-white font-medium text-sm hover:bg-orange-dark disabled:opacity-50 transition-colors"
                                >
                                  {updatingId === b.ID ? "Updating..." : "Update"}
                                </button>
                                {updateSuccess === b.ID && (
                                  <span className="text-sm text-success font-medium">
                                    Updated successfully
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredBookings.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-warm-bg/50">
            <p className="text-sm text-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-lg border border-border bg-card text-body text-sm font-medium hover:bg-warm-bg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
                className="px-4 py-2 rounded-lg border border-border bg-card text-body text-sm font-medium hover:bg-warm-bg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
