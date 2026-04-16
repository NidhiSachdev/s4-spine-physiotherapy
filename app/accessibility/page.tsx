"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Breadcrumb from "@/components/layout/Breadcrumb";

const getFadeInUp = (prefersReducedMotion: boolean) => ({
  initial: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: prefersReducedMotion ? 0 : 0.5 },
});

const ACCESSIBILITY_FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Keyboard Navigation",
    description: "Full tab navigation throughout the site, visible focus indicators, and a skip-to-content link for quick access to main content.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
    title: "Screen Reader Support",
    description: "Semantic HTML structure and ARIA labels ensure content is properly announced and navigable with assistive technologies.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    title: "Text Resizing",
    description: "Responsive design that works correctly at 200% zoom without loss of content or functionality.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Color Contrast",
    description: "Text and interactive elements meet WCAG AA contrast ratios for readability.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Motion Sensitivity",
    description: "We respect the prefers-reduced-motion media query to minimize animations for users who need it.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Form Accessibility",
    description: "All form inputs have proper labels, and error messages are clearly associated and announced.",
  },
];

const KEYBOARD_SHORTCUTS = [
  { key: "Tab", action: "Move forward through interactive elements" },
  { key: "Shift + Tab", action: "Move backward through interactive elements" },
  { key: "Enter", action: "Activate links and buttons" },
  { key: "Escape", action: "Close modals and cancel actions" },
  { key: "Space", action: "Activate buttons and checkboxes" },
  { key: "Arrow keys", action: "Navigate within menus and lists" },
];

const SUPPORTED_BROWSERS = [
  "Chrome (latest)",
  "Firefox (latest)",
  "Safari (latest)",
  "Edge (latest)",
  "Opera (latest)",
];

export default function AccessibilityPage() {
  const prefersReducedMotion = useReducedMotion();
  const fadeInUp = getFadeInUp(!!prefersReducedMotion);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Accessibility" },
          ]}
        />

        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          className="mt-8 mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-charcoal mb-4">
            Accessibility <span className="text-orange">Statement</span>
          </h1>
          <p className="text-body text-lg leading-relaxed">
            At S4 Spine, we believe everyone deserves equal access to healthcare information and services. 
            We are committed to making our website accessible to all users, including those with disabilities. 
            This page outlines our approach to digital accessibility and the features we provide.
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Our Commitment */}
          <motion.div
            {...fadeInUp}
            className="bg-card rounded-xl border border-border p-6 sm:p-8"
          >
            <h2 className="font-heading font-semibold text-charcoal text-xl mb-4">
              Our Commitment
            </h2>
            <p className="text-body mb-4">
              We strive to ensure our website is accessible to all users, regardless of ability or the 
              technology they use to access the web. Our goal is to provide an inclusive experience 
              for everyone who visits S4 Spine online.
            </p>
            <p className="text-body">
              We follow the <strong className="text-charcoal">Web Content Accessibility Guidelines (WCAG) 2.1</strong> at Level AA. 
              These internationally recognized guidelines help us create content that is perceivable, 
              operable, understandable, and robust for all users.
            </p>
          </motion.div>

          {/* Accessibility Features */}
          <motion.div
            {...fadeInUp}
            className="bg-card rounded-xl border border-border p-6 sm:p-8"
          >
            <h2 className="font-heading font-semibold text-charcoal text-xl mb-6">
              Accessibility Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {ACCESSIBILITY_FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-lg bg-warm-bg/50 border border-border"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cream text-orange shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-charcoal mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-body text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How to Use Our Accessibility Features */}
          <motion.div
            {...fadeInUp}
            className="bg-card rounded-xl border border-border p-6 sm:p-8"
          >
            <h2 className="font-heading font-semibold text-charcoal text-xl mb-4">
              How to Use Our Accessibility Features
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-charcoal mb-2">Keyboard Shortcuts</h3>
                <ul className="space-y-2">
                  {KEYBOARD_SHORTCUTS.map((item, i) => (
                    <li key={i} className="flex flex-wrap items-center gap-2 text-body">
                      <kbd className="px-2 py-1 text-sm font-mono bg-warm-bg border border-border rounded">
                        {item.key}
                      </kbd>
                      <span>{item.action}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-charcoal mb-2">Screen Reader Navigation</h3>
                <p className="text-body">
                  Our site uses semantic HTML (headings, landmarks, lists) and ARIA attributes where needed. 
                  Use your screen reader&apos;s heading navigation (e.g., H key in NVDA/JAWS) to jump between sections. 
                  The skip-to-content link at the top lets you bypass repetitive navigation and go straight to the main content.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-charcoal mb-2">Resizing Text</h3>
                <p className="text-body">
                  You can resize text in your browser: <strong>Ctrl + Plus</strong> (Windows/Linux) or 
                  <strong> Cmd + Plus</strong> (Mac) to zoom in, and <strong>Ctrl + Minus</strong> or 
                  <strong> Cmd + Minus</strong> to zoom out. Our layout adapts to support text scaling up to 200%.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Browser & Device Compatibility */}
          <motion.div
            {...fadeInUp}
            className="bg-card rounded-xl border border-border p-6 sm:p-8"
          >
            <h2 className="font-heading font-semibold text-charcoal text-xl mb-4">
              Browser & Device Compatibility
            </h2>
            <p className="text-body mb-4">
              Our website is designed to work across a wide range of browsers and devices:
            </p>
            <ul className="list-disc list-inside text-body space-y-1 mb-4">
              {SUPPORTED_BROWSERS.map((browser, i) => (
                <li key={i}>{browser}</li>
              ))}
            </ul>
            <p className="text-body">
              The site is fully responsive and works on desktop computers, tablets, and mobile phones. 
              We recommend using the latest version of your browser for the best experience.
            </p>
          </motion.div>

          {/* Contact Us for Accessibility Feedback */}
          <motion.div
            {...fadeInUp}
            className="bg-card rounded-xl border border-border p-6 sm:p-8"
          >
            <h2 className="font-heading font-semibold text-charcoal text-xl mb-4">
              Contact Us for Accessibility Feedback
            </h2>
            <p className="text-body mb-6">
              We welcome your feedback. If you encounter any accessibility barriers on our website or 
              have suggestions for improvement, please let us know. Your input helps us serve you better.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cream text-orange shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted">Phone</p>
                  <a href="tel:+917900177857" className="text-orange font-medium hover:text-orange-dark transition-colors">
                    +91 79001 77857
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-cream text-orange shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted">Email</p>
                  <a href="mailto:s4spineclinic@gmail.com" className="text-orange font-medium hover:text-orange-dark transition-colors">
                    s4spineclinic@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-orange font-semibold hover:text-orange-dark transition-colors"
              >
                Visit our Contact page
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
