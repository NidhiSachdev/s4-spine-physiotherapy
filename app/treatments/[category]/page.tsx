"use client";

import { useParams } from "next/navigation";
import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import treatmentsData from "@/data/treatments.json";
import type { Treatment } from "@/lib/types";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TreatmentCard from "@/components/treatments/TreatmentCard";
import FilterSidebar, { type FilterState } from "@/components/treatments/FilterSidebar";
import SearchBar from "@/components/treatments/SearchBar";

const treatments = treatmentsData as Treatment[];

const categoryInfo: Record<string, { name: string; description: string; longDescription: string }> = {
  musculoskeletal: {
    name: "Musculoskeletal",
    description: "Back pain, joint rehab, arthritis, frozen shoulder, sciatica",
    longDescription:
      "Our musculoskeletal physiotherapy treatments address conditions affecting bones, joints, muscles, and connective tissues. From chronic back pain to post-injury rehabilitation, our specialists use evidence-based techniques to restore function and reduce pain.",
  },
  neurological: {
    name: "Neurological",
    description: "Stroke recovery, Parkinson's, spinal cord injury, Bell's palsy",
    longDescription:
      "Neurological physiotherapy focuses on restoring movement and function in patients with conditions affecting the nervous system. Our specialized therapists work with stroke survivors, Parkinson's patients, and those with spinal cord injuries.",
  },
  "sports-rehabilitation": {
    name: "Sports Rehabilitation",
    description: "ACL recovery, tennis elbow, runner's knee, ankle sprain",
    longDescription:
      "Our sports rehabilitation programs are designed for athletes and active individuals recovering from sports-related injuries. We combine manual therapy, targeted exercises, and progressive training to get you back to peak performance.",
  },
  geriatric: {
    name: "Geriatric",
    description: "Balance training, fall prevention, osteoporosis, mobility",
    longDescription:
      "Geriatric physiotherapy addresses the unique needs of older adults, focusing on maintaining independence, preventing falls, managing chronic conditions, and improving overall quality of life through safe, effective exercise programs.",
  },
  "post-surgical": {
    name: "Post-Surgical",
    description: "Hip & knee replacement rehab, spinal surgery recovery",
    longDescription:
      "Post-surgical rehabilitation is crucial for optimal recovery after orthopedic procedures. Our structured programs guide patients through each recovery phase, from initial healing to full functional restoration.",
  },
};

function getFiltersFromTreatments(items: Treatment[]) {
  const ageGroup = [...new Set(items.flatMap((t) => t.ageGroup))];
  const treatmentType = [...new Set(items.flatMap((t) => t.treatmentType))];
  return { ageGroup, treatmentType };
}

function filterTreatments(items: Treatment[], active: FilterState): Treatment[] {
  return items.filter((t) => {
    const matchAgeGroup =
      active.ageGroup.length === 0 ||
      t.ageGroup.some((ag) => active.ageGroup.includes(ag));
    const matchTreatmentType =
      active.treatmentType.length === 0 ||
      t.treatmentType.some((tt) => active.treatmentType.includes(tt));
    return matchAgeGroup && matchTreatmentType;
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    ageGroup: [],
    treatmentType: [],
  });
  const [filterOpen, setFilterOpen] = useState(false);

  const categoryTreatments = useMemo(
    () => treatments.filter((t) => t.category === categorySlug),
    [categorySlug]
  );

  const filters = useMemo(
    () => getFiltersFromTreatments(categoryTreatments),
    [categoryTreatments]
  );

  const filteredTreatments = useMemo(
    () => filterTreatments(categoryTreatments, activeFilters),
    [categoryTreatments, activeFilters]
  );

  const info = categoryInfo[categorySlug];
  const hasActiveFilters =
    activeFilters.ageGroup.length > 0 ||
    activeFilters.treatmentType.length > 0;

  const handleFilterChange = useCallback((f: FilterState) => {
    setActiveFilters(f);
  }, []);

  const removeFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      const current = activeFilters[key];
      setActiveFilters({
        ...activeFilters,
        [key]: current.filter((v) => v !== value),
      });
    },
    [activeFilters]
  );

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      ageGroup: [],
      treatmentType: [],
    });
  }, []);

  const activeFilterChips = useMemo(() => {
    const chips: { key: keyof FilterState; value: string }[] = [];
    activeFilters.ageGroup.forEach((v) => chips.push({ key: "ageGroup", value: v }));
    activeFilters.treatmentType.forEach((v) =>
      chips.push({ key: "treatmentType", value: v })
    );
    return chips;
  }, [activeFilters]);

  if (!info || categoryTreatments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-heading font-bold text-2xl text-charcoal mb-4">
          Category not found
        </h1>
        <p className="text-body mb-6">
          The category you are looking for does not exist or has no treatments.
        </p>
        <Link
          href="/treatments"
          className="inline-flex items-center gap-2 text-orange font-medium hover:text-orange-dark transition-colors"
        >
          View all treatments
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Treatments", href: "/treatments" },
            { label: info.name },
          ]}
        />

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-charcoal mb-2">
            {info.name}
          </h1>
          <p className="text-body text-lg max-w-3xl">{info.longDescription}</p>
          <div className="mt-6 max-w-xl">
            <SearchBar
              treatments={categoryTreatments}
              onSelect={() => {}}
            />
          </div>
        </motion.section>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 w-full py-3 px-4 rounded-xl border border-border bg-card font-medium text-charcoal hover:bg-charcoal/[0.02] transition-colors"
            >
              <svg
                className="w-5 h-5 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters {hasActiveFilters && `(${activeFilterChips.length})`}
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={handleFilterChange}
                      activeFilters={activeFilters}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-body text-sm">
                Showing {filteredTreatments.length} of {categoryTreatments.length}{" "}
                treatments
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-sm font-medium text-orange hover:text-orange-dark transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {activeFilterChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {activeFilterChips.map(({ key, value }) => (
                  <span
                    key={`${key}-${value}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange/10 text-orange text-sm"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => removeFilter(key, value)}
                      className="hover:text-orange-dark transition-colors"
                      aria-label={`Remove ${value} filter`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredTreatments.map((treatment) => (
                  <motion.div key={`${treatment.category}-${treatment.slug}`} variants={itemVariants}>
                    <TreatmentCard treatment={treatment} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredTreatments.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted text-center py-12"
              >
                No treatments match your filters. Try adjusting your selection.
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
