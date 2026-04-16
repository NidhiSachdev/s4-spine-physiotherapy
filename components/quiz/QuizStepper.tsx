"use client";

import { motion } from "framer-motion";

interface QuizStepperProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canGoNext: boolean;
  isLastStep: boolean;
  onSubmit: () => void;
}

export default function QuizStepper({
  children,
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canGoNext,
  isLastStep,
  onSubmit,
}: QuizStepperProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted">
            Question {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-orange">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-orange rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="min-h-[280px]">{children}</div>

      <div className="flex justify-between items-center gap-4 mt-8 pt-6 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg border border-border text-body font-medium hover:bg-charcoal/[0.02] hover:border-orange/50 transition-colors"
        >
          Back
        </button>
        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canGoNext}
            className="px-8 py-2.5 rounded-lg bg-orange text-white font-semibold hover:bg-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Get Results
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="px-8 py-2.5 rounded-lg bg-orange text-white font-semibold hover:bg-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
