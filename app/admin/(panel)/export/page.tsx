"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

const EXPORT_OPTIONS = [
  {
    file: "bookings",
    label: "Bookings",
    description: "All appointment bookings",
    icon: CalendarIcon,
    iconBg: "bg-info/10",
    iconColor: "text-info",
    btnClass: "bg-info hover:bg-info/90 text-white",
  },
  {
    file: "contacts",
    label: "Contacts",
    description: "Contact form submissions",
    icon: MailIcon,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    btnClass: "bg-success hover:bg-success/90 text-white",
  },
  {
    file: "testimonials",
    label: "Testimonials",
    description: "Patient testimonials and reviews",
    icon: StarIcon,
    iconBg: "bg-orange/10",
    iconColor: "text-orange",
    btnClass: "bg-orange hover:bg-orange-dark text-white",
  },
];

export default function ExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (file: string) => {
    setDownloading(file);
    try {
      const res = await fetch(`/api/export/${file}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Download failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="font-heading text-3xl font-bold text-charcoal mb-2">
        Export Data
      </h1>
      <p className="text-muted mb-8">
        Download your clinic data as Excel spreadsheets. Each export includes all records from the respective data source.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {EXPORT_OPTIONS.map(({ file, description, icon: Icon, iconBg, iconColor, btnClass }) => (
          <div
            key={file}
            className="bg-card rounded-xl border border-border p-6 flex flex-col"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                iconBg,
                iconColor
              )}
            >
              <Icon className={cn("w-6 h-6", iconColor)} />
            </div>
            <p className="font-medium text-charcoal mb-1">{file}.xlsx</p>
            <p className="text-sm text-muted mb-4 flex-1">{description}</p>
            <button
              onClick={() => handleDownload(file)}
              disabled={downloading !== null}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50",
                btnClass
              )}
            >
              <DownloadIcon className="w-4 h-4" />
              {downloading === file ? "Downloading..." : "Download"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
