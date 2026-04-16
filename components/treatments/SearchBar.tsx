"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Treatment } from "@/lib/types";

interface SearchBarProps {
  treatments: Treatment[];
  onSelect: (treatment: Treatment) => void;
}

export default function SearchBar({ treatments, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 2
    ? treatments
        .filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.categoryName.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (treatment: Treatment) => {
    onSelect(treatment);
    router.push(`/treatments/${treatment.category}/${treatment.slug}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search treatments..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
        />
      </div>
      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 py-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-auto">
          {results.map((treatment) => (
            <li key={`${treatment.category}-${treatment.slug}`}>
              <button
                type="button"
                onClick={() => handleSelect(treatment)}
                className="w-full px-4 py-2.5 text-left hover:bg-warm-bg transition-colors flex flex-col"
              >
                <span className="font-medium text-charcoal">{treatment.name}</span>
                <span className="text-xs text-muted">{treatment.categoryName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
