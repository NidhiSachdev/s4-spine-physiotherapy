"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-border">&gt;</span>}
            {i === 0 ? (
              item.href ? (
                <Link href={item.href} className="flex items-center gap-1.5 hover:text-orange transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 text-charcoal font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {item.label}
                </span>
              )
            ) : i === items.length - 1 ? (
              <span className="text-charcoal font-medium">{item.label}</span>
            ) : item.href ? (
              <Link href={item.href} className="hover:text-orange transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-charcoal font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
