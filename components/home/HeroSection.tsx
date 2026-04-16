"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BodyMap from "./BodyMap";

const slideshowImages = [
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1400&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=80",
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1400&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&q=80",
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[640px] flex items-center overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {slideshowImages.map((src, i) => (
          <div
            key={i}
            className="hero-slide absolute inset-0"
            style={{ animationDelay: `${i * 4}s` }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, rgba(31,41,55,.94) 0%, rgba(31,41,55,.88) 45%, rgba(31,41,55,.78) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 bg-orange/20 text-orange-100 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-orange/30">
            <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
            Expert Physiotherapy Care
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[46px] leading-[1.1] mb-5 text-white font-heading font-bold">
            Your Journey to{" "}
            <span className="text-orange">Pain-Free</span>{" "}
            Living Starts Here
          </h1>

          <p className="text-base text-white/70 leading-relaxed mb-8 max-w-lg">
            Explore 40+ specialized treatments across 8 categories. Hover on the
            body map to discover treatments for your specific pain area.
          </p>

          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/treatments"
              className="inline-flex items-center px-8 py-3.5 bg-orange hover:bg-orange-dark text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-orange/40"
            >
              Explore Treatments
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-3.5 border-2 border-white/30 text-white hover:bg-white/8 hover:border-white font-semibold rounded-lg transition-all duration-200"
            >
              Book Appointment
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:flex justify-center"
        >
          <BodyMap />
        </motion.div>
      </div>
    </section>
  );
}
