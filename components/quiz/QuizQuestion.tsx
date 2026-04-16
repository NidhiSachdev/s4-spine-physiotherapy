"use client";

import { motion } from "framer-motion";
import { useState, useCallback, useEffect } from "react";

interface QuizOption {
  value: string;
  label: string;
}

interface QuizQuestionData {
  id: number;
  type: string;
  question: string;
  options?: QuizOption[];
  min?: number;
  max?: number;
  labels?: Record<string, string>;
  placeholder?: string;
}

interface QuizQuestionProps {
  question: QuizQuestionData;
  answer: string | number | null;
  onAnswer: (value: string | number) => void;
}

export default function QuizQuestion({
  question,
  answer,
  onAnswer,
}: QuizQuestionProps) {
  const [sliderValue, setSliderValue] = useState<number>(
    typeof answer === "number" ? answer : question.min ?? 5
  );
  const [textareaValue, setTextareaValue] = useState(
    typeof answer === "string" ? answer : ""
  );

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setSliderValue(val);
      onAnswer(val);
    },
    [onAnswer]
  );

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setTextareaValue(val);
      onAnswer(val);
    },
    [onAnswer]
  );

  useEffect(() => {
    if (question.type === "slider" && answer === null) {
      const defaultVal = question.min ?? 5;
      onAnswer(defaultVal);
    }
  }, [question.type, question.min, answer, onAnswer]);

  if (question.type === "body-map" && question.options) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-xl font-heading font-semibold text-charcoal mb-6">
          {question.question}
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
          {question.options.map((opt) => {
            const isSelected = answer === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onAnswer(opt.value)}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? "border-orange bg-orange/10 text-orange"
                    : "border-border text-body hover:border-orange/50 hover:bg-orange/5"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  if (question.type === "single" && question.options) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-xl font-heading font-semibold text-charcoal mb-6">
          {question.question}
        </h2>
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => {
            const isSelected = answer === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onAnswer(opt.value)}
                className={`py-3.5 px-4 rounded-lg border text-left font-medium transition-all ${
                  isSelected
                    ? "border-orange bg-cream text-charcoal"
                    : "border-border text-body hover:border-orange/50 hover:bg-cream/50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  if (question.type === "slider") {
    const min = question.min ?? 1;
    const max = question.max ?? 10;
    const val = typeof answer === "number" ? answer : sliderValue;
    const percent = ((val - min) / (max - min)) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-xl font-heading font-semibold text-charcoal mb-6">
          {question.question}
        </h2>
        <div className="relative pt-12 pb-4">
          <div
            className="absolute top-0 w-12 h-12 rounded-full bg-orange text-white font-heading font-bold text-lg flex items-center justify-center shadow-lg z-10 -translate-x-1/2"
            style={{ left: `${percent}%` }}
          >
            {val}
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={val}
            onChange={handleSliderChange}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange"
            style={{
              background: `linear-gradient(to right, #22c55e 0%, #eab308 ${(max - min) / 2}%, #ef4444 100%)`,
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-muted">
            <span>{question.labels?.[String(min)] ?? String(min)}</span>
            {question.labels?.["5"] && <span>{question.labels["5"]}</span>}
            <span>{question.labels?.[String(max)] ?? String(max)}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (question.type === "textarea") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-xl font-heading font-semibold text-charcoal mb-6">
          {question.question}
        </h2>
        <div className="relative">
          <textarea
            value={textareaValue}
            onChange={handleTextareaChange}
            placeholder={question.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent resize-none"
          />
          <span className="absolute bottom-2 right-3 text-xs text-muted">
            {textareaValue.length} characters
          </span>
        </div>
      </motion.div>
    );
  }

  return null;
}
