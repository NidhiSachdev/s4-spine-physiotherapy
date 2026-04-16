"use client";

import { motion } from "framer-motion";
import Accordion from "@/components/ui/Accordion";

const faqs = [
  {
    question: "What conditions does physiotherapy treat?",
    answer: "Physiotherapy treats a wide range of conditions including back pain, sports injuries, post-surgical recovery, neurological conditions like stroke and Parkinson's, arthritis, sciatica, frozen shoulder, and many more. We offer 40+ specialized treatments across 8 categories.",
  },
  {
    question: "Do I need a doctor's referral to visit?",
    answer: "No, you don't need a doctor's referral. You can directly book an appointment with us. However, if you have specific medical reports or prescriptions, please bring them along for a more informed assessment.",
  },
  {
    question: "How many sessions will I need?",
    answer: "The number of sessions varies depending on your condition, its severity, and your recovery goals. During your first visit, our therapist will assess your condition and provide an estimated treatment plan. Most conditions see significant improvement within 8-16 sessions.",
  },
  {
    question: "How do I book an appointment?",
    answer: "Simply click the 'Book Now' button, select your treatment, choose your preferred date and time, and fill in your details. Our clinic will call you to confirm your appointment. No online payment is needed — it's a simple request system.",
  },
  {
    question: "What should I wear to my session?",
    answer: "Wear comfortable, loose-fitting clothing that allows easy movement. Depending on the treatment area, you may need to expose certain body parts for proper assessment. Athletic or sports clothing works well.",
  },
  {
    question: "Is physiotherapy painful?",
    answer: "Physiotherapy is designed to relieve pain, not cause it. While some techniques may involve mild discomfort during the session, especially for manual therapy, your therapist will always communicate with you and adjust the intensity to your comfort level.",
  },
];

export default function HomeFAQ() {
  return (
    <section className="py-16 lg:py-20 bg-warm-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            Frequently Asked <span className="text-orange">Questions</span>
          </h2>
          <p className="text-muted">
            Quick answers to common questions. Need more help?{" "}
            <a href="/faq" className="text-orange hover:text-orange-dark underline">
              View all FAQs
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion items={faqs} />
        </motion.div>
      </div>
    </section>
  );
}
