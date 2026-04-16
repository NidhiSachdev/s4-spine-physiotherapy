"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { QuizResult } from "@/lib/quiz-engine";

interface QuizResultsProps {
  results: QuizResult[];
  onRetake: () => void;
}

export default function QuizResults({ results, onRetake }: QuizResultsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-heading font-bold text-charcoal mb-8"
      >
        Your Recommended Treatments
      </motion.h1>

      <div className="space-y-6">
        {results.map((result, index) => (
          <motion.article
            key={result.treatment.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="bg-card rounded-xl border border-border p-6 hover:border-orange/30 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div
                className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-heading font-bold text-lg ${
                  index === 0
                    ? "bg-orange text-white text-xl w-16 h-16"
                    : "bg-orange/10 text-orange"
                }`}
              >
                #{index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/treatments/${result.treatment.category}/${result.treatment.slug}`}
                  className="font-heading font-semibold text-lg text-charcoal hover:text-orange transition-colors block mb-2"
                >
                  {result.treatment.name}
                </Link>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-10 h-10 rounded-full border-2 border-orange flex items-center justify-center text-sm font-semibold text-orange">
                      {result.matchScore}%
                    </span>
                    <span className="text-sm text-muted">match</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-charcoal/5 text-muted text-xs font-medium">
                    {result.treatment.categoryName}
                  </span>
                </div>
                <p className="text-body text-sm mb-4 line-clamp-2">
                  {result.treatment.description}
                </p>
                <ul className="space-y-1.5 mb-4">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-body">
                      <svg
                        className="w-4 h-4 text-orange flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/book?treatment=${result.treatment.slug}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-orange text-white font-semibold text-sm hover:bg-orange-dark transition-colors"
                >
                  Book This Treatment
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-center"
      >
        <button
          type="button"
          onClick={onRetake}
          className="px-8 py-3 rounded-lg border border-border text-body font-medium hover:bg-charcoal/[0.02] hover:border-orange/50 transition-colors"
        >
          Retake Quiz
        </button>
      </motion.div>
    </div>
  );
}
