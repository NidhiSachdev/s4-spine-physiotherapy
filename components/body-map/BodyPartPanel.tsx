"use client";

import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Treatment } from "@/lib/types";

interface Region {
  id: string;
  label: string;
  description: string;
  commonConditions: string[];
  stat: string;
}

interface BodyPartPanelProps {
  region: Region | null;
  treatments: Treatment[];
  onClose: () => void;
  isOpen: boolean;
}

export default function BodyPartPanel({
  region,
  treatments,
  onClose,
  isOpen,
}: BodyPartPanelProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && region && (
        <Fragment key={region.id}>
          <motion.div
            key={`${region.id}-overlay`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/30 z-40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            key={`${region.id}-panel`}
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed z-50 w-full md:w-96 flex flex-col bg-card shadow-xl border-border md:rounded-l-xl md:border-l md:border-t-0 border-t bottom-0 left-0 right-0 md:top-0 md:bottom-auto md:left-auto md:right-0 md:h-full max-h-[70vh] md:max-h-none"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-semibold text-charcoal">{region.label}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-warm-bg transition-colors text-muted hover:text-charcoal"
                aria-label="Close panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <p className="text-body text-sm leading-relaxed">{region.description}</p>

              <div>
                <h3 className="text-sm font-semibold text-charcoal mb-2">Common Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {region.commonConditions.map((condition) => (
                    <span
                      key={condition}
                      className="px-3 py-1 text-xs font-medium bg-cream text-charcoal rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm italic text-muted">{region.stat}</p>

              <div>
                <h3 className="text-sm font-semibold text-charcoal mb-3">Recommended Treatments</h3>
                {treatments.length > 0 ? (
                  <ul className="space-y-2">
                    {treatments.map((treatment) => (
                      <li key={treatment.slug}>
                        <Link
                          href={`/treatments/${treatment.category}/${treatment.slug}`}
                          className="block p-3 rounded-lg border border-border hover:border-orange hover:bg-cream/50 transition-colors"
                        >
                          <span className="font-medium text-charcoal">{treatment.name}</span>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-teal/10 text-teal-dark rounded">
                              {treatment.categoryName}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-muted/20 text-muted rounded">
                              {treatment.intensity}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">No specific treatments found for this region.</p>
                )}
              </div>

              <Link
                href="/book"
                className="block w-full py-3 px-4 text-center font-semibold text-white bg-orange hover:bg-orange-dark rounded-lg transition-colors"
              >
                Book Treatment
              </Link>
            </div>
          </motion.aside>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
