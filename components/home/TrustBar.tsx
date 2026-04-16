"use client";

import { motion } from "framer-motion";

const certifications = [
  "Indian Association of Physiotherapists",
  "ISO 9001 Certified",
  "NABH Accredited",
  "Sports Authority of India",
  "Rehabilitation Council",
  "WHO Guidelines Compliant",
];

export default function TrustBar() {
  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted uppercase tracking-widest mb-6 font-medium">
          Trusted & Accredited By
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4"
        >
          {certifications.map((cert, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-muted/60"
            >
              <svg className="w-5 h-5 text-orange/50" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium whitespace-nowrap">{cert}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
