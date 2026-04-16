"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/treatments", label: "Treatments" },
  { href: "/videos", label: "Videos" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

type TextSize = "normal" | "lg" | "xl";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>("normal");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("s4-text-size") as TextSize | null;
    if (saved && ["normal", "lg", "xl"].includes(saved)) {
      setTextSize(saved);
      const html = document.documentElement;
      html.classList.remove("text-lg-mode", "text-xl-mode");
      if (saved === "lg") html.classList.add("text-lg-mode");
      if (saved === "xl") html.classList.add("text-xl-mode");
    }
  }, []);

  const applyTextSize = (size: TextSize) => {
    setTextSize(size);
    const html = document.documentElement;
    html.classList.remove("text-lg-mode", "text-xl-mode");
    if (size === "lg") html.classList.add("text-lg-mode");
    if (size === "xl") html.classList.add("text-xl-mode");
    localStorage.setItem("s4-text-size", size);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-[3px] border-orange shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 lg:h-22">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/logo.png"
              alt="S4 Spine Physiotherapy Clinic"
              width={64}
              height={64}
              className="h-14 w-auto lg:h-16"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body hover:text-orange px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-cream"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-1" role="group" aria-label="Text size">
            <button
              type="button"
              onClick={() => applyTextSize("normal")}
              className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                textSize === "normal" ? "bg-orange text-white" : "bg-warm-bg text-body hover:bg-cream"
              }`}
              aria-label="Normal text size"
              aria-pressed={textSize === "normal"}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => applyTextSize("lg")}
              className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                textSize === "lg" ? "bg-orange text-white" : "bg-warm-bg text-body hover:bg-cream"
              }`}
              aria-label="Medium text size"
              aria-pressed={textSize === "lg"}
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => applyTextSize("xl")}
              className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                textSize === "xl" ? "bg-orange text-white" : "bg-warm-bg text-body hover:bg-cream"
              }`}
              aria-label="Large text size"
              aria-pressed={textSize === "xl"}
            >
              A++
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-orange hover:bg-orange-dark text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-charcoal hover:bg-cream rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </header>
  );
}
