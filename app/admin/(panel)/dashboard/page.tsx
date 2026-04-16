"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Booking {
  ID: string;
  Name: string;
  Treatment: string;
  "Preferred Date": string;
  Status: string;
  "Submitted At"?: string;
}

interface Contact {
  Status: string;
}

interface Testimonial {
  id: string;
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
  Pending: "bg-warning/10 text-warning",
  Confirmed: "bg-info/10 text-info",
  Completed: "bg-success/10 text-success",
  Cancelled: "bg-error/10 text-error",
};

function getStatusBadgeClass(status: string): string {
  return STATUS_BADGE_CLASSES[status] ?? "bg-muted/10 text-muted";
}

function isToday(dateStr: string): boolean {
  try {
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [bookingsRes, contactsRes, testimonialsRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/contacts"),
          fetch("/api/testimonials"),
        ]);

        const [bookingsData, contactsData, testimonialsData] = await Promise.all([
          bookingsRes.json(),
          contactsRes.json(),
          testimonialsRes.json(),
        ]);

        setBookings(bookingsData.bookings ?? []);
        setContacts(contactsData.contacts ?? []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
      } catch {
        setBookings([]);
        setContacts([]);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalBookings = bookings.length;
  const todaysBookings = bookings.filter((b) => isToday(b["Preferred Date"])).length;
  const pendingBookings = bookings.filter((b) => b.Status === "Pending").length;
  const totalTestimonials = testimonials.length;
  const unreadContacts = contacts.filter((c) => c.Status === "Unread").length;

  const recentBookings = [...bookings]
    .sort((a, b) => {
      const aTime = new Date(a["Submitted At"] ?? 0).getTime();
      const bTime = new Date(b["Submitted At"] ?? 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      accent: "bg-info/10 text-info",
    },
    {
      label: "Today's Bookings",
      value: todaysBookings,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "bg-orange/10 text-orange",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "bg-warning/10 text-warning",
    },
    {
      label: "Total Testimonials",
      value: totalTestimonials,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      accent: "bg-success/10 text-success",
    },
    {
      label: "Unread Contacts",
      value: unreadContacts,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      accent: "bg-error/10 text-error",
    },
  ];

  const quickActions = [
    { label: "Manage Bookings", href: "/admin/bookings", icon: "calendar" },
    { label: "Manage Testimonials", href: "/admin/testimonials", icon: "star" },
    { label: "View Contacts", href: "/admin/contacts", icon: "mail" },
    { label: "Export Data", href: "/admin/export", icon: "download" },
  ];

  const iconSvg = (icon: string) => {
    switch (icon) {
      case "calendar":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "star":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case "mail":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "download":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-heading font-bold text-2xl text-charcoal">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${card.accent} mb-3`}>
              {card.icon}
            </div>
            {loading ? (
              <div className="h-8 w-16 bg-warm-bg rounded animate-pulse" />
            ) : (
              <div className="text-3xl font-bold text-charcoal">{card.value}</div>
            )}
            <div className="text-sm text-muted">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="bg-card rounded-xl border border-border p-5 hover:border-orange/50 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="text-muted group-hover:text-orange transition">
                {iconSvg(action.icon)}
              </span>
              <span className="font-medium text-charcoal">{action.label}</span>
            </div>
            <svg
              className="h-5 w-5 text-muted group-hover:text-orange group-hover:translate-x-1 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg text-charcoal">Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            className="text-sm font-medium text-orange hover:text-orange-dark transition"
          >
            View All →
          </Link>
        </div>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-warm-bg rounded animate-pulse" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No bookings yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-warm-bg">
                    <th className="text-left text-sm font-medium text-charcoal px-4 py-3">ID</th>
                    <th className="text-left text-sm font-medium text-charcoal px-4 py-3">Name</th>
                    <th className="text-left text-sm font-medium text-charcoal px-4 py-3">Treatment</th>
                    <th className="text-left text-sm font-medium text-charcoal px-4 py-3">Date</th>
                    <th className="text-left text-sm font-medium text-charcoal px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.ID} className="border-t border-border">
                      <td className="px-4 py-3 text-sm text-body">{booking.ID}</td>
                      <td className="px-4 py-3 text-sm text-body">{booking.Name}</td>
                      <td className="px-4 py-3 text-sm text-body">{booking.Treatment}</td>
                      <td className="px-4 py-3 text-sm text-body">{formatDate(booking["Preferred Date"])}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(booking.Status)}`}
                        >
                          {booking.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
