"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MobileCarousel from "@/components/ui/MobileCarousel";

const tests = [
  {
    title: "Overall Health Screening",
    description: "Routine check-ups including complete blood count, liver & kidney function, and lipid profile.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    title: "Deficiency Detection",
    description: "Identify deficiencies in Vitamin D, Vitamin B12, iron, calcium, and other essential nutrients.",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
  },
  {
    title: "Chronic Condition Monitoring",
    description: "Regular monitoring for diabetes, thyroid disorders, cholesterol levels, and blood pressure markers.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
  {
    title: "Rehabilitation Support",
    description: "Track inflammation markers, recovery indicators, and post-treatment progress through targeted blood work.",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
];

function TestCard({ test, idx }: { test: typeof tests[number]; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-orange/30 transition-all duration-300 group h-full"
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cream text-orange mb-4 group-hover:bg-orange group-hover:text-white transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={test.icon} />
        </svg>
      </div>
      <h3 className="font-heading font-semibold text-charcoal mb-2 group-hover:text-orange transition-colors">
        {test.title}
      </h3>
      <p className="text-muted text-sm leading-relaxed">
        {test.description}
      </p>
    </motion.div>
  );
}

export default function DiagnosticTests() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-teal/10 text-teal text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Diagnostic Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
            Blood Tests & <span className="text-orange">Health Screenings</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Beyond physiotherapy, we offer comprehensive blood tests and diagnostic screenings
            to support your overall health and recovery journey.
          </p>
        </motion.div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tests.map((test, idx) => (
            <TestCard key={test.title} test={test} idx={idx} />
          ))}
        </div>

        <MobileCarousel
          items={tests.map((test, idx) => (
            <TestCard key={test.title} test={test} idx={idx} />
          ))}
          itemWidth="75vw"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-lg hover:bg-orange-dark transition-colors"
          >
            Enquire About Tests
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
