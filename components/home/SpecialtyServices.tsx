"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MobileCarousel from "@/components/ui/MobileCarousel";

const specialties = [
  {
    name: "Dry Needling",
    slug: "dry-needling",
    price: "₹1,500",
    priceLabel: "per session",
    description:
      "Precision trigger point needling releases stubborn muscle knots, eases referred pain, and restores normal muscle function fast.",
    benefits: ["Trigger Point Release", "Chronic Pain Relief", "Faster Healing"],
    sessions: "8 / 10 / 30 sessions",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <line x1="36" y1="6" x2="12" y2="42" />
        <line x1="12" y1="42" x2="10" y2="38" />
        <line x1="12" y1="42" x2="16" y2="40" />
        <circle cx="30" cy="14" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Cupping (IASTM)",
    slug: "cupping-therapy",
    price: "₹1,500",
    priceLabel: "per session",
    description:
      "Therapeutic suction cups relieve deep muscle tension, boost blood flow, and accelerate healing for chronic pain and sports soreness.",
    benefits: ["Pain Relief", "Muscle Recovery", "Improved Circulation"],
    sessions: "8 / 10 / 30 sessions",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 30 C10 18, 16 14, 16 14 L22 14 C22 14, 28 18, 28 30 Z" />
        <line x1="16" y1="14" x2="16" y2="10" />
        <line x1="22" y1="14" x2="22" y2="10" />
        <line x1="14" y1="10" x2="24" y2="10" />
        <path d="M26 32 C26 22, 31 19, 31 19 L36 19 C36 19, 41 22, 41 32 Z" />
        <line x1="31" y1="19" x2="31" y2="16" />
        <line x1="36" y1="19" x2="36" y2="16" />
        <line x1="29" y1="16" x2="38" y2="16" />
      </svg>
    ),
  },
  {
    name: "Kinesiology Taping",
    slug: "kinesiology-taping",
    price: "₹500",
    priceLabel: "per session",
    description:
      "Elastic therapeutic tape supports muscles and joints, reduces swelling, and improves movement — without restricting your range of motion.",
    benefits: ["Joint Support", "Swelling Reduction", "Full Mobility"],
    sessions: "8 / 10 / 30 sessions",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="24" r="10" />
        <circle cx="20" cy="24" r="5" />
        <path d="M30 24 C30 24, 36 22, 42 24" />
        <path d="M30 21 C30 21, 36 19, 42 21" />
        <path d="M30 27 C30 27, 36 25, 42 27" />
      </svg>
    ),
  },
];

function SpecialtyCard({ specialty, i }: { specialty: typeof specialties[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.15, duration: 0.5 }}
      className="group relative bg-white rounded-2xl border border-border overflow-hidden h-full flex flex-col"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange to-orange-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-5">
          <div className="w-14 h-14 bg-orange/10 text-orange rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:bg-orange group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange/20">
            {specialty.icon}
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-orange">{specialty.price}</span>
            <p className="text-xs text-muted">{specialty.priceLabel}</p>
          </div>
        </div>
        <h3 className="font-heading font-bold text-xl text-charcoal mb-3 group-hover:text-orange transition-colors">
          {specialty.name}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-5 flex-1">
          {specialty.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {specialty.benefits.map((b) => (
            <span
              key={b}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cream text-charcoal"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm text-muted font-medium">{specialty.sessions}</span>
          <Link
            href={`/book?treatment=${specialty.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange hover:text-orange-dark transition-colors"
          >
            Book Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function SpecialtyServices() {
  return (
    <section className="py-16 lg:py-20 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-orange/10 text-orange px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
            </svg>
            Doctor&apos;s Specialties
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Specialized <span className="text-orange">Therapy</span> Techniques
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Advanced hands-on modalities performed by our specialist to target pain at its source and accelerate your recovery.
          </p>
        </motion.div>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((s, i) => (
            <SpecialtyCard key={s.slug} specialty={s} i={i} />
          ))}
        </div>

        <MobileCarousel
          items={specialties.map((s, i) => (
            <SpecialtyCard key={s.slug} specialty={s} i={i} />
          ))}
          itemWidth="85vw"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            href="/treatments/musculoskeletal"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange text-orange font-semibold rounded-lg hover:bg-orange hover:text-white transition-all duration-200"
          >
            View All Treatments
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
