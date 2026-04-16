"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-charcoal font-heading font-bold">Menu</span>
              <button
                onClick={onClose}
                className="p-2 text-charcoal hover:bg-cream rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-1" aria-label="Mobile navigation">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="text-body hover:text-orange hover:bg-cream px-4 py-3 rounded-lg text-base font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <Link
                  href="/book"
                  onClick={onClose}
                  className="flex items-center justify-center px-4 py-3 bg-orange hover:bg-orange-dark text-white font-semibold rounded-lg transition-colors"
                >
                  Book Now
                </Link>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
