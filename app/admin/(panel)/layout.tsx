"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useState } from "react";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-warm-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-border bg-card">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-warm-bg"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6 text-charcoal"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="font-heading font-semibold text-charcoal">
            S4 Spine Admin
          </span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
