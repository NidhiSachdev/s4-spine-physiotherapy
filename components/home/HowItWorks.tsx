"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choose Your Treatment",
    description: "Browse our treatment library, use the interactive body map, or take our self-assessment quiz to find the right treatment for you.",
    icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  },
  {
    number: "02",
    title: "Book an Appointment",
    description: "Pick your preferred date and time slot, fill in your details, and submit your booking request. No payment needed — it's that simple.",
    icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
  },
  {
    number: "03",
    title: "Start Your Recovery",
    description: "Our clinic confirms your appointment by phone. Visit us and begin your personalized recovery journey with expert therapists.",
    icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            How It <span className="text-orange">Works</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Getting started is easy. Three simple steps to begin your recovery journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-orange/20 via-orange/40 to-orange/20" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange text-white rounded-2xl mb-6 shadow-lg shadow-orange/20 relative z-10">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                </svg>
              </div>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-6xl font-heading font-bold text-orange/5 select-none">
                {step.number}
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-3">
                {step.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
