"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/layout/Breadcrumb";
import faqsData from "@/data/faqs.json";
import mythsData from "@/data/myths.json";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQTopic {
  topic: string;
  questions: FAQItem[];
}

interface Myth {
  id: number;
  myth: string;
  fact: string;
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState<Record<string, number | null>>({});
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return faqsData as FAQTopic[];

    const query = searchQuery.toLowerCase().trim();
    return (faqsData as FAQTopic[]).map((topic) => ({
      ...topic,
      questions: topic.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      ),
    })).filter((topic) => topic.questions.length > 0);
  }, [searchQuery]);

  const toggleFAQ = (topicKey: string, index: number) => {
    setOpenFAQ((prev) => ({
      ...prev,
      [topicKey]: prev[topicKey] === index ? null : index,
    }));
  };

  const toggleCard = (id: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "FAQs" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal mb-4">
            Frequently Asked <span className="text-orange">Questions</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Find answers to common questions about physiotherapy, our treatments, and how we can help you.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a question..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-colors"
            />
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-12 mb-20"
        >
          {filteredTopics.length === 0 ? (
            <p className="text-center text-muted py-12">
              No questions match your search. Try different keywords.
            </p>
          ) : (
            filteredTopics.map((topic, topicIdx) => (
              <motion.section
                key={topic.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * topicIdx }}
              >
                <h2 className="font-heading font-semibold text-2xl text-charcoal mb-6">
                  {topic.topic}
                </h2>
                <div className="space-y-0 divide-y divide-border rounded-lg border border-border bg-card overflow-hidden">
                  {topic.questions.map((item, idx) => {
                    const topicKey = topic.topic.replace(/\s+/g, "-");
                    const isOpen = openFAQ[topicKey] === idx;
                    return (
                      <div key={idx} className="bg-card">
                        <button
                          type="button"
                          onClick={() => toggleFAQ(topicKey, idx)}
                          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-warm-bg transition-colors"
                        >
                          <span className="font-medium text-charcoal">
                            {item.question}
                          </span>
                          <span
                            className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-cream text-orange transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-4 pt-0">
                                <p className="text-body pl-0">{item.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            ))
          )}
        </motion.div>

        {/* Myth Busters Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <h2 className="font-heading font-bold text-3xl text-charcoal mb-2 text-center">
            Myths vs <span className="text-orange">Facts</span>
          </h2>
          <p className="text-muted text-center mb-8">
            Click a card to reveal the fact
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mythsData as Myth[]).map((item) => {
              const isFlipped = flippedCards.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4 }}
                  className="min-h-[220px] cursor-pointer select-none"
                  style={{ perspective: "1000px" }}
                  onClick={() => toggleCard(item.id)}
                  onTouchEnd={(e) => { e.preventDefault(); toggleCard(item.id); }}
                  role="button"
                  tabIndex={0}
                  aria-label={isFlipped ? `Fact: ${item.fact}` : `Myth: ${item.myth}`}
                >
                  <div
                    className="relative w-full min-h-[220px]"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 0.6s ease",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front - Myth */}
                    <div
                      className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-dark to-orange p-6 flex flex-col justify-between text-white"
                      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                    >
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                          Myth
                        </span>
                        <p className="mt-2 font-medium">{item.myth}</p>
                      </div>
                      <p className="text-sm opacity-90 mt-4">
                        Tap to reveal the fact
                      </p>
                    </div>
                    {/* Back - Fact */}
                    <div
                      className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-teal-dark to-teal p-6 flex flex-col justify-between text-white"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                          Fact
                        </span>
                        <p className="mt-2">{item.fact}</p>
                      </div>
                      <p className="text-sm opacity-90 mt-4">
                        Tap to flip back
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <h3 className="font-heading font-semibold text-xl text-charcoal mb-2">
            Still have questions?
          </h3>
          <p className="text-muted mb-4">
            We&apos;re here to help. Get in touch with our team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange hover:bg-orange-dark text-white font-semibold rounded-lg transition-colors"
          >
            Contact Us
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
