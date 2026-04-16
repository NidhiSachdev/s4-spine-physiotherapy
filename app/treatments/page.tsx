"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Treatment } from "@/lib/types";
import treatmentsData from "@/data/treatments.json";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SearchBar from "@/components/treatments/SearchBar";

const treatments = treatmentsData as Treatment[];

const categories = [
  {
    name: "Musculoskeletal",
    slug: "musculoskeletal",
    description: "Back pain, joint rehab, arthritis, frozen shoulder, sciatica",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    hoverBorder: "hover:border-blue-400",
  },
  {
    name: "Neurological",
    slug: "neurological",
    description: "Stroke recovery, Parkinson's, spinal cord injury, Bell's palsy",
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    hoverBorder: "hover:border-purple-400",
  },
  {
    name: "Sports Rehabilitation",
    slug: "sports-rehabilitation",
    description: "ACL recovery, tennis elbow, runner's knee, ankle sprain",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "bg-cream text-orange border-orange/20",
    hoverBorder: "hover:border-orange",
  },
  {
    name: "Geriatric",
    slug: "geriatric",
    description: "Balance training, fall prevention, osteoporosis, mobility",
    icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    hoverBorder: "hover:border-amber-400",
  },
  {
    name: "Post-Surgical",
    slug: "post-surgical",
    description: "Hip & knee replacement rehab, spinal surgery recovery",
    icon: "M11.42 15.17l-5.648-3.01A1 1 0 015 11.264V7.132a1 1 0 01.544-.89L11.42 3.23a2 2 0 011.958 0l5.876 3.013a1 1 0 01.544.89v4.132a1 1 0 01-.772.896l-5.648 3.01a2 2 0 01-1.958 0z",
    color: "bg-teal/10 text-teal border-teal/20",
    hoverBorder: "hover:border-teal",
  },
];

export default function TreatmentsPage() {
  const router = useRouter();
  const [searchQuery] = useState("");

  const handleSearchSelect = (treatment: Treatment) => {
    router.push(`/treatments/${treatment.category}/${treatment.slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Treatments" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal mb-4">
            Treatment <span className="text-orange">Library</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
            Browse our comprehensive range of {treatments.length}+ specialized
            physiotherapy treatments across {categories.length} categories.
          </p>

          <div className="max-w-xl mx-auto">
            <SearchBar
              treatments={treatments}
              onSelect={handleSearchSelect}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-6 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {categories.map((cat, i) => {
              const count = treatments.filter(
                (t) => t.category === cat.slug
              ).length;

              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/treatments/${cat.slug}`}
                    className={`block bg-card rounded-xl p-6 border border-border ${cat.hoverBorder} hover:shadow-lg transition-all duration-300 group`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${cat.color}`}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d={cat.icon}
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-heading font-semibold text-charcoal text-lg group-hover:text-orange transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-xs font-medium text-muted bg-warm-bg px-2 py-0.5 rounded-full">
                            {count} treatments
                          </span>
                        </div>
                        <p className="text-muted text-sm leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-orange text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      View treatments
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-6 text-center">
            Popular Treatments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {treatments
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 8)
              .map((treatment, i) => (
                <motion.div
                  key={treatment.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/treatments/${treatment.category}/${treatment.slug}`}
                    className="block bg-card rounded-xl p-5 border border-border hover:border-orange/50 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted bg-warm-bg px-2 py-0.5 rounded-full">
                        {treatment.categoryName}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-charcoal mb-2 group-hover:text-orange transition-colors">
                      {treatment.name}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-3">
                      {treatment.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {treatment.duration}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-orange/5 via-cream to-orange/5 rounded-2xl p-10 border border-orange/10"
        >
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-3">
            Not sure which treatment is right?
          </h2>
          <p className="text-muted mb-6 max-w-lg mx-auto">
            Take our quick self-assessment quiz and get personalized treatment
            recommendations in under 2 minutes.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-8 py-3.5 bg-orange hover:bg-orange-dark text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-orange/25"
          >
            Take the Quiz
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
