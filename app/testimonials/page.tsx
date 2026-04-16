"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface Testimonial {
  id: string;
  patientName: string;
  rating: number;
  story: string;
  category: string;
  videoPath?: string | null;
  active: boolean;
}

const CATEGORIES = [
  "All",
  "Musculoskeletal",
  "Neurological",
  "Sports",
  "Geriatric",
  "Post-Surgical",
];

const SUBMIT_CATEGORIES = CATEGORIES.filter((c) => c !== "All");

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="inline-block">
          {star <= rating ? (
            <svg
              className="w-5 h-5 text-orange"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-orange/30"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

const STORY_TRUNCATE_LENGTH = 120;

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const formRef = useRef<HTMLDivElement>(null);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [formStory, setFormStory] = useState("");
  const [formCategory, setFormCategory] = useState("Musculoskeletal");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/testimonials?active=true")
      .then((res) => res.json())
      .then((data: Testimonial[] | { error: string }) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    categoryFilter === "All"
      ? testimonials
      : testimonials.filter((t) => t.category === categoryFilter);

  const featured = [...filtered].sort((a, b) => b.rating - a.rating)[0];
  const gridTestimonials = filtered.filter((t) => t.id !== featured?.id);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formStory.trim()) return;
    setFormSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: formName.trim(),
          rating: formRating,
          story: formStory.trim(),
          category: formCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setFormSuccess(true);
      setFormName("");
      setFormRating(5);
      setFormStory("");
      setFormCategory("Musculoskeletal");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Testimonials" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-8 mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal mb-4">
            What Our <span className="text-orange">Patients</span> Say
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Real stories from real people. Discover how S4 Spine has helped our patients
            recover, regain mobility, and return to the activities they love.
          </p>
        </motion.div>

        {featured && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <div className="bg-cream rounded-2xl p-8 sm:p-10 border border-border relative overflow-hidden">
              <div className="absolute top-6 right-6 text-cream-dark/40 text-8xl font-serif select-none">
                &ldquo;
              </div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <StarRating rating={featured.rating} />
                  <span className="text-sm font-medium text-muted bg-warm-bg px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                </div>
                <blockquote className="text-body text-lg sm:text-xl leading-relaxed mb-6">
                  {featured.story}
                </blockquote>
                <footer className="font-heading font-semibold text-charcoal">
                  — {featured.patientName}
                </footer>
              </div>
            </div>
          </motion.section>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-lg font-heading font-semibold text-charcoal mb-4">
            Filter by treatment category
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  categoryFilter === cat
                    ? "bg-orange text-white shadow-md shadow-orange/20"
                    : "bg-card border border-border text-body hover:border-orange/50 hover:text-orange"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.06,
                delayChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {gridTestimonials.map((t) => {
              const isExpanded = expandedIds.has(t.id);
              const displayStory =
                isExpanded || t.story.length <= STORY_TRUNCATE_LENGTH
                  ? t.story
                  : t.story.slice(0, STORY_TRUNCATE_LENGTH).trimEnd() + "...";

              return (
                <motion.article
                  key={t.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-card rounded-xl border border-border overflow-hidden group hover:shadow-lg hover:border-orange/30 transition-shadow duration-300"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="bg-cream/60 rounded-lg p-4 mb-4 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <StarRating rating={t.rating} />
                        <span className="text-xs font-medium text-muted bg-warm-bg px-2 py-1 rounded-full">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-body text-sm leading-relaxed">
                        {displayStory}
                        {t.story.length > STORY_TRUNCATE_LENGTH && (
                          <button
                            onClick={() => toggleExpand(t.id)}
                            className="ml-1 text-orange font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-orange/30 rounded"
                          >
                            {isExpanded ? "Show less" : "Read More"}
                          </button>
                        )}
                      </p>
                    </div>
                    <footer className="font-heading font-semibold text-charcoal text-sm pt-2 border-t border-border">
                      {t.patientName}
                    </footer>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                <div className="h-4 bg-warm-bg rounded w-24 mb-3" />
                <div className="h-3 bg-warm-bg rounded w-full mb-2" />
                <div className="h-3 bg-warm-bg rounded w-3/4 mb-4" />
                <div className="h-3 bg-warm-bg rounded w-20" />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted py-12"
          >
            No testimonials in this category yet.
          </motion.p>
        )}

        {/* Share Your Experience Form */}
        <motion.section
          ref={formRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 mb-8"
          id="share"
        >
          <div className="bg-cream rounded-2xl border border-border p-8 sm:p-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-charcoal mb-2 text-center">
              Share Your <span className="text-orange">Experience</span>
            </h2>
            <p className="text-muted text-center mb-8">
              We&apos;d love to hear about your recovery journey. Your testimonial will appear on this page once approved by our team.
            </p>

            {formSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal/10 text-teal mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Thank You!</h3>
                <p className="text-muted mb-6">
                  Your testimonial has been submitted and is pending approval. It will appear on this page once our team reviews it.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSuccess(false)}
                  className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium hover:bg-orange-dark transition"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label htmlFor="testimonial-name" className="block text-sm font-medium text-charcoal mb-1.5">
                    Your Name <span className="text-orange">*</span>
                  </label>
                  <input
                    id="testimonial-name"
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-body focus:ring-2 focus:ring-orange/30 focus:border-orange outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Your Rating <span className="text-orange">*</span>
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className="p-0.5 focus:outline-none focus:ring-2 focus:ring-orange/30 rounded"
                        aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      >
                        <svg
                          className={`w-8 h-8 transition-colors ${star <= formRating ? "text-orange" : "text-orange/25"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="testimonial-category" className="block text-sm font-medium text-charcoal mb-1.5">
                    Treatment Category <span className="text-orange">*</span>
                  </label>
                  <select
                    id="testimonial-category"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-body focus:ring-2 focus:ring-orange/30 focus:border-orange outline-none transition"
                  >
                    {SUBMIT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="testimonial-story" className="block text-sm font-medium text-charcoal mb-1.5">
                    Your Experience <span className="text-orange">*</span>
                  </label>
                  <textarea
                    id="testimonial-story"
                    value={formStory}
                    onChange={(e) => setFormStory(e.target.value)}
                    required
                    rows={5}
                    placeholder="Tell us about your recovery journey, the treatment you received, and how it helped you..."
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-body focus:ring-2 focus:ring-orange/30 focus:border-orange outline-none transition resize-none"
                  />
                </div>

                {formError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                    {formError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formSubmitting || !formName.trim() || !formStory.trim()}
                  className="w-full py-3 rounded-lg bg-orange text-white font-semibold hover:bg-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {formSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Testimonial"
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
