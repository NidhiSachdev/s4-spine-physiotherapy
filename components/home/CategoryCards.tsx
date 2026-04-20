"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Musculoskeletal",
    slug: "musculoskeletal",
    description: "Back pain, joint rehab, arthritis, frozen shoulder, sciatica",
    treatments: ["Back Pain Relief", "Frozen Shoulder", "Arthritis Care", "Sciatica Treatment", "Joint Rehabilitation"],
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    color: "bg-blue-50 text-blue-600",
    backGradient: "from-blue-500 to-blue-700",
  },
  {
    name: "Neurological",
    slug: "neurological",
    description: "Stroke recovery, Parkinson's, spinal cord injury, Bell's palsy",
    treatments: ["Stroke Recovery", "Parkinson's Therapy", "Spinal Cord Rehab", "Bell's Palsy", "Neuropathy Care"],
    icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
    color: "bg-purple-50 text-purple-600",
    backGradient: "from-purple-500 to-purple-700",
  },
  {
    name: "Sports Rehab",
    slug: "sports-rehabilitation",
    description: "ACL recovery, tennis elbow, runner's knee, ankle sprain",
    treatments: ["ACL Recovery", "Tennis Elbow", "Runner's Knee", "Ankle Sprain", "Rotator Cuff"],
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "bg-cream text-orange",
    backGradient: "from-orange to-orange-dark",
  },
  {
    name: "Geriatric",
    slug: "geriatric",
    description: "Balance training, fall prevention, osteoporosis, mobility",
    treatments: ["Balance Training", "Fall Prevention", "Osteoporosis Care", "Mobility Rehab", "Strength Building"],
    icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342",
    color: "bg-amber-50 text-amber-600",
    backGradient: "from-amber-500 to-amber-700",
  },
  {
    name: "Post-Surgical",
    slug: "post-surgical",
    description: "Hip & knee replacement rehab, spinal surgery recovery",
    treatments: ["Knee Replacement", "Hip Replacement", "Spinal Surgery", "Shoulder Surgery", "Ligament Repair"],
    icon: "M11.42 15.17l-5.648-3.01A1 1 0 015 11.264V7.132a1 1 0 01.544-.89L11.42 3.23a2 2 0 011.958 0l5.876 3.013a1 1 0 01.544.89v4.132a1 1 0 01-.772.896l-5.648 3.01a2 2 0 01-1.958 0z",
    color: "bg-teal/10 text-teal",
    backGradient: "from-teal to-teal-dark",
  },
];

function FlipCard({ cat, i }: { cat: typeof categories[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      key={cat.slug}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.05, duration: 0.4 }}
      className="group [perspective:1000px] h-56 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-card rounded-xl p-6 border border-border flex flex-col items-center justify-center text-center shadow-sm"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${cat.color}`}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
            </svg>
          </div>
          <h3 className="font-heading font-semibold text-charcoal text-lg">
            {cat.name}
          </h3>
          <p className="text-muted text-sm mt-2 leading-relaxed">
            {cat.description}
          </p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${cat.backGradient} rounded-xl p-5 flex flex-col justify-between text-white shadow-lg`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <h3 className="font-heading font-bold text-base mb-3">
              {cat.name}
            </h3>
            <ul className="space-y-1.5">
              {cat.treatments.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-white/90">
                  <svg className="w-3.5 h-3.5 shrink-0 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href={`/treatments/${cat.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-2 w-full mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-lg transition-colors backdrop-blur-sm"
          >
            View Treatments
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function CategoryCards() {
  return (
    <section className="py-16 lg:py-20 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Treatment <span className="text-orange">Categories</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Browse our comprehensive range of physiotherapy specialties.
            Tap or hover over a card to see the treatments we offer.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {categories.map((cat, i) => (
            <FlipCard key={cat.slug} cat={cat} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
