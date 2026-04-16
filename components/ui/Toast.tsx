"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

const typeStyles = {
  success: "bg-success text-white",
  error: "bg-error text-white",
  info: "bg-info text-white",
};

const typeIcons = {
  success: "M5 13l4 4L19 7",
  error: "M6 18L18 6M6 6l12 12",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
};

export default function Toast({ message, type = "success", visible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className={`fixed top-6 left-1/2 z-[100] flex items-center gap-2 px-5 py-3 rounded-lg shadow-lg ${typeStyles[type]}`}
          role="alert"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={typeIcons[type]} />
          </svg>
          <span className="text-sm font-medium">{message}</span>
          <button onClick={onClose} className="ml-2 hover:opacity-80" aria-label="Close notification">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
