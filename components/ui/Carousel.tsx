"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({ items, autoPlay = true, interval = 5000 }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {items[current]}
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="flex justify-center gap-2 mt-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === current ? "bg-teal" : "bg-border"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
