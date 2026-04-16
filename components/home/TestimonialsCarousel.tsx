"use client";

import { motion } from "framer-motion";
import Carousel from "@/components/ui/Carousel";
import StarRating from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Rahul Sharma",
    treatment: "ACL Recovery",
    rating: 5,
    quote: "After my ACL surgery, I was worried about getting back to playing football. The team at S4 Spine designed a recovery plan that got me back on the field in just 6 months. Truly grateful!",
  },
  {
    name: "Priya Patel",
    treatment: "Prenatal Physiotherapy",
    rating: 5,
    quote: "The prenatal physiotherapy sessions were a lifesaver during my pregnancy. The exercises helped with my back pain and prepared me for delivery. Highly recommend to all expecting mothers.",
  },
  {
    name: "Ankit Verma",
    treatment: "Sciatica Treatment",
    rating: 5,
    quote: "I had been suffering from sciatica for over a year. Within 3 months of treatment at S4 Spine, the pain reduced dramatically. The therapists are incredibly knowledgeable and caring.",
  },
  {
    name: "Meera Joshi",
    treatment: "Post-Stroke Recovery",
    rating: 5,
    quote: "My father's recovery after his stroke has been remarkable thanks to the neurological rehab program. The team's patience and expertise gave our family hope during a difficult time.",
  },
  {
    name: "Vikram Singh",
    treatment: "Frozen Shoulder",
    rating: 4,
    quote: "I couldn't lift my arm above my shoulder for months. After regular sessions at S4 Spine, I've regained full range of motion. The step-by-step approach really works.",
  },
];

export default function TestimonialsCarousel() {
  const items = testimonials.map((t, i) => (
    <div key={i} className="px-4 py-2">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <StarRating rating={t.rating} size="lg" />
        </div>
        <blockquote className="text-lg sm:text-xl text-charcoal leading-relaxed mb-6 italic">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div>
          <div className="w-12 h-12 bg-cream text-orange rounded-full flex items-center justify-center mx-auto mb-3 font-heading font-bold text-lg border border-cream-dark">
            {t.name.charAt(0)}
          </div>
          <p className="font-heading font-semibold text-charcoal">{t.name}</p>
          <p className="text-muted text-sm">{t.treatment}</p>
        </div>
      </div>
    </div>
  ));

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
            What Our <span className="text-orange">Patients</span> Say
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            Real stories from real patients. See how physiotherapy has
            transformed their lives.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-cream rounded-2xl border border-cream-dark p-8 sm:p-12"
        >
          <Carousel items={items} interval={6000} />
        </motion.div>
      </div>
    </section>
  );
}
