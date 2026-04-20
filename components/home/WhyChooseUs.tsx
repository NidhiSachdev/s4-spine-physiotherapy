"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    number: "01",
    title: "Personalized Treatment Plans",
    description:
      "Every patient is unique. We craft individualized recovery programs based on your condition, goals, and lifestyle — not one-size-fits-all routines.",
    icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z",
  },
  {
    number: "02",
    title: "Advanced Techniques & Equipment",
    description:
      "From manual therapy to modern rehabilitation tools, we use evidence-based methods and the latest physiotherapy technology for faster, lasting results.",
    icon: "M11.42 15.17l-5.648-3.01A1 1 0 015 11.264V7.132a1 1 0 01.544-.89L11.42 3.23a2 2 0 011.958 0l5.876 3.013a1 1 0 01.544.89v4.132a1 1 0 01-.772.896l-5.648 3.01a2 2 0 01-1.958 0z",
  },
  {
    number: "03",
    title: "Experienced Specialist",
    description:
      "Our therapist brings years of hands-on experience across musculoskeletal, neurological, sports, and post-surgical rehabilitation — treating every patient with expert care.",
    icon: "M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342",
  },
  {
    number: "04",
    title: "Patient-First Approach",
    description:
      "We take the time to listen, understand your pain, and explain every step of your treatment. You're not just a case — you're a person on a recovery journey.",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  },
];

function ReasonCard({ reason, i }: { reason: typeof reasons[number]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)" }}
      whileTap={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.08)" }}
      className="group active:group relative overflow-hidden bg-white rounded-xl border border-border p-6 transition-all duration-300 h-full"
    >
      <div className="absolute -top-3 -right-2 text-7xl font-heading font-bold text-orange/[0.05] select-none transition-all duration-300 group-hover:text-orange/[0.12] group-hover:scale-110 group-active:text-orange/[0.12] group-active:scale-110">
        {reason.number}
      </div>
      <div className="absolute top-0 left-0 w-1 h-0 bg-orange rounded-r transition-all duration-500 group-hover:h-full group-active:h-full" />
      <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-orange transition-all duration-500 group-hover:w-full group-active:w-full" />
      <div className="relative">
        <div className="w-12 h-12 bg-orange/10 text-orange rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange group-hover:text-white group-hover:shadow-lg group-hover:shadow-orange/20 group-active:scale-110 group-active:bg-orange group-active:text-white group-active:shadow-lg group-active:shadow-orange/20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={reason.icon} />
          </svg>
        </div>
        <h3 className="font-heading font-semibold text-charcoal text-base mb-2 transition-colors duration-300 group-hover:text-orange group-active:text-orange">
          {reason.title}
        </h3>
        <p className="text-muted text-sm leading-relaxed">
          {reason.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Why Choose <span className="text-orange">S4 Spine</span>?
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            We go beyond treatment — we empower you to live your healthiest,
            most active life with expert care and a personal touch.
          </p>
        </motion.div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <ReasonCard key={i} reason={reason} i={i} />
          ))}
        </div>

        {/* Mobile: horizontal carousel */}
        <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
          {reasons.map((reason, i) => (
            <div key={i} className="snap-center shrink-0 w-[80vw]">
              <ReasonCard reason={reason} i={i} />
            </div>
          ))}
        </div>
        <div className="sm:hidden flex justify-center gap-1.5 mt-3">
          {reasons.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-orange/30" />
          ))}
        </div>
      </div>
    </section>
  );
}
