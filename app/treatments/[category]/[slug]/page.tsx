"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import treatmentsData from "@/data/treatments.json";
import type { Treatment } from "@/lib/types";
import Breadcrumb from "@/components/layout/Breadcrumb";
import TreatmentCard from "@/components/treatments/TreatmentCard";

const treatments = treatmentsData as Treatment[];

const categoryInfo: Record<string, { name: string }> = {
  musculoskeletal: { name: "Musculoskeletal" },
  neurological: { name: "Neurological" },
  "sports-rehabilitation": { name: "Sports Rehabilitation" },
  geriatric: { name: "Geriatric" },
  "post-surgical": { name: "Post-Surgical" },
};


const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

export default function TreatmentDetailPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const slug = params.slug as string;

  const treatment = useMemo(
    () => treatments.find((t) => t.category === categorySlug && t.slug === slug),
    [categorySlug, slug]
  );

  const relatedTreatments = useMemo(() => {
    if (!treatment || treatment.relatedSlugs.length === 0) return [];
    const related = treatment.relatedSlugs
      .map((s) => treatments.find((t) => t.slug === s))
      .filter((t): t is Treatment => t != null)
      .slice(0, 3);
    return related;
  }, [treatment]);

  const categoryName = categoryInfo[categorySlug]?.name ?? treatment?.categoryName ?? categorySlug;

  if (!treatment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="font-heading font-bold text-2xl text-charcoal mb-4">
          Treatment not found
        </h1>
        <p className="text-body mb-6">
          The treatment you are looking for does not exist.
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Treatments", href: "/treatments" },
            { label: categoryName, href: `/treatments/${categorySlug}` },
            { label: treatment.name },
          ]}
        />

        <motion.header
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link
              href={`/treatments/${categorySlug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-charcoal/5 text-muted hover:bg-orange/10 hover:text-orange transition-colors"
            >
              {categoryName}
            </Link>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-charcoal">
            {treatment.name}
          </h1>
        </motion.header>

        <motion.section
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="p-6 rounded-xl bg-card border border-border">
            <h2 className="font-heading font-semibold text-lg text-charcoal mb-3">
              Overview
            </h2>
            <p className="text-body leading-relaxed">{treatment.overview}</p>
          </div>
        </motion.section>

        <motion.section
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <h2 className="font-heading font-semibold text-xl text-charcoal mb-6">
            Treatment Process
          </h2>
          <div className="relative">
            {treatment.steps.map((step, i) => (
              <div key={i} className="flex gap-4 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-orange text-white font-heading font-semibold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  {i < treatment.steps.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[16px] bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="font-heading font-semibold text-charcoal mb-1">
                    {step.title}
                  </h3>
                  <p className="text-body text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-orange"
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
              </div>
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wide mb-0.5">
                  Duration
                </p>
                <p className="font-medium text-charcoal">{treatment.duration}</p>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-orange"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wide mb-0.5">
                  Sessions
                </p>
                <p className="font-medium text-charcoal">{treatment.sessions}</p>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-orange"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wide mb-0.5">
                  Recovery Time
                </p>
                <p className="font-medium text-charcoal">{treatment.recoveryTime}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {treatment.conditions.length > 0 && (
          <motion.section
            custom={4}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <h2 className="font-heading font-semibold text-xl text-charcoal mb-4">
              Related Conditions
            </h2>
            <div className="flex flex-wrap gap-2">
              {treatment.conditions.map((condition) => (
                <span
                  key={condition}
                  className="px-4 py-2 rounded-lg bg-card border border-border text-body text-sm hover:border-orange/50 hover:bg-orange/5 transition-colors cursor-default"
                >
                  {condition}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {relatedTreatments.length > 0 && (
          <motion.section
            custom={5}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <h2 className="font-heading font-semibold text-xl text-charcoal mb-6">
              Related Treatments
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTreatments.map((t) => (
                <TreatmentCard key={`${t.category}-${t.slug}`} treatment={t} />
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          custom={6}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Link
            href="/book"
            className="block w-full sm:w-auto sm:inline-block text-center py-4 px-8 rounded-xl bg-orange text-white font-heading font-semibold hover:bg-orange-dark transition-colors"
          >
            Book This Treatment
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
