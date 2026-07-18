"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MobileCarousel from "@/components/ui/MobileCarousel";

const specialties = [
  {
    name: "Cupping Therapy",
    slug: "cupping-therapy",
    description:
      "Therapeutic suction cups relieve deep muscle tension, boost blood flow, and accelerate healing for chronic pain and sports soreness.",
    benefits: ["Pain Relief", "Muscle Recovery", "Improved Circulation"],
    sessions: "4–8 sessions",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    name: "Dry Needling",
    slug: "dry-needling",
    description:
      "Precision trigger point needling releases stubborn muscle knots, eases referred pain, and restores normal muscle function fast.",
    benefits: ["Trigger Point Release", "Chronic Pain Relief", "Faster Healing"],
    sessions: "4–8 sessions",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    name: "Kinesiology Taping",
    slug: "kinesiology-taping",
    description:
      "Elastic therapeutic tape supports muscles and joints, reduces swelling, and improves movement — without restricting your range of motion.",
    benefits: ["Joint Support", "Swelling Reduction", "Full Mobility"],
    sessions: "4–8 sessions",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
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
        <div className="w-14 h-14 bg-orange/10 text-orange rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-orange group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange/20">
          {specialty.icon}
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
          <span className="text-sm text-muted">{specialty.sessions}</span>
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
