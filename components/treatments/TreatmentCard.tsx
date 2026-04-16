"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Treatment } from "@/lib/types";

interface TreatmentCardProps {
  treatment: Treatment;
}

export default function TreatmentCard({ treatment }: TreatmentCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/treatments/${treatment.category}/${treatment.slug}`}
        className="block p-6 rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-orange/50"
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-charcoal/5 text-muted">
            {treatment.categoryName}
          </span>
        </div>
        <h3 className="font-heading font-semibold text-charcoal text-lg mb-2">
          {treatment.name}
        </h3>
        <p className="text-body text-sm mb-4 line-clamp-2">
          {treatment.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted mb-3">
          <span>{treatment.duration}</span>
        </div>
        {treatment.bodyParts.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {treatment.bodyParts.slice(0, 4).map((part) => (
              <span
                key={part}
                className="text-xs px-2 py-0.5 rounded bg-warm-bg text-muted"
              >
                {part}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
