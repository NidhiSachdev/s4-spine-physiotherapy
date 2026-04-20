"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";

interface MobileCarouselProps {
  items: ReactNode[];
  itemWidth?: string;
  interval?: number;
  dotColor?: string;
  dotActiveColor?: string;
}

export default function MobileCarousel({
  items,
  itemWidth = "75vw",
  interval = 3000,
  dotColor = "bg-orange/30",
  dotActiveColor = "bg-orange",
}: MobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const pauseRef = useRef(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container || !container.children[0]) return;
    const child = container.children[index] as HTMLElement;
    if (!child) return;
    const offset = child.offsetLeft - (container.offsetWidth - child.offsetWidth) / 2;
    container.scrollTo({ left: offset, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (pauseRef.current) return;
      setActiveIndex((prev) => {
        const next = (prev + 1) % items.length;
        scrollToIndex(next);
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval, scrollToIndex]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;

    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < container.children.length; i++) {
      const child = container.children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - scrollLeft - containerWidth / 2);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    setActiveIndex(closest);
  };

  const handleTouchStart = () => {
    pauseRef.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handleTouchEnd = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      pauseRef.current = false;
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  return (
    <div className="sm:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
      >
        {items.map((item, i) => (
          <div key={i} className="snap-center shrink-0" style={{ width: itemWidth }}>
            {item}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setActiveIndex(i);
              scrollToIndex(i);
              pauseRef.current = true;
              if (resumeTimer.current) clearTimeout(resumeTimer.current);
              resumeTimer.current = setTimeout(() => {
                pauseRef.current = false;
              }, 5000);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? `${dotActiveColor} w-4` : dotColor
            }`}
          />
        ))}
      </div>
    </div>
  );
}
