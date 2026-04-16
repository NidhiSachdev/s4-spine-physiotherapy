"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function QuizCTA() {
  return (
    <section className="py-16 lg:py-20 bg-warm-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-orange rounded-2xl p-8 sm:p-12 lg:p-16"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-white/15 text-white text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
                2-Minute Quiz
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                Not Sure Which Treatment Is Right for You?
              </h2>
              <p className="text-white/85 leading-relaxed mb-6">
                Take our quick self-assessment quiz. Answer 10 simple questions
                and get personalized treatment recommendations matched to your
                condition, goals, and lifestyle.
              </p>
              <Link
                href="/quiz"
                className="inline-flex items-center px-7 py-3.5 bg-white hover:bg-cream text-orange font-bold rounded-lg transition-all duration-200 shadow-lg"
              >
                Take the Quiz
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                {["Where does it hurt?", "How long?", "Pain type?", "Your goal?"].map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="bg-white/10 border border-white/15 rounded-xl p-4 text-center"
                  >
                    <div className="text-2xl font-heading font-bold text-amber-200 mb-1">
                      Q{i + 1}
                    </div>
                    <p className="text-white/70 text-xs">{q}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
