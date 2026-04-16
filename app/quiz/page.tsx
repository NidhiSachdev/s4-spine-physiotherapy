"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/layout/Breadcrumb";
import QuizStepper from "@/components/quiz/QuizStepper";
import QuizQuestion from "@/components/quiz/QuizQuestion";
import QuizResults from "@/components/quiz/QuizResults";
import quizData from "@/data/quiz.json";
import treatmentsData from "@/data/treatments.json";
import type { Treatment } from "@/lib/types";
import { calculateResults, type QuizAnswers, type QuizResult } from "@/lib/quiz-engine";

const treatments = treatmentsData as Treatment[];
const questions = quizData.questions;

const initialAnswers: Partial<QuizAnswers> = {};

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>(initialAnswers);
  const [results, setResults] = useState<QuizResult[]>([]);

  const currentQuestion = questions.find((q) => q.id === currentStep);
  const currentAnswer = currentQuestion ? answers[currentQuestion.id as keyof QuizAnswers] : null;

  const canGoNext = useCallback(() => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "textarea") return true;
    return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== "";
  }, [currentQuestion, currentAnswer]);

  const handleAnswer = useCallback((value: string | number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentStep < questions.length) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    const fullAnswers = answers as QuizAnswers;
    fullAnswers[5] = fullAnswers[5] ?? 5;
    fullAnswers[10] = fullAnswers[10] ?? "";
    const quizResults = calculateResults(fullAnswers, treatments);
    setResults(quizResults.length > 0 ? quizResults : treatments.slice(0, 3).map((t) => ({
      treatment: t,
      matchScore: 50,
      reasons: ["Recommended based on your profile"],
    })));
    setShowResults(true);
  }, [answers]);

  const handleRetake = useCallback(() => {
    setStarted(false);
    setShowResults(false);
    setCurrentStep(1);
    setAnswers(initialAnswers);
    setResults([]);
  }, []);

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Self-Assessment Quiz" },
          ]}
        />

        <AnimatePresence mode="wait">
          {!started && !showResults && (
            <motion.div
              key="splash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center py-12 sm:py-16"
            >
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-charcoal mb-4">
                Find Your Perfect Treatment
              </h1>
              <p className="text-body text-lg max-w-xl mx-auto mb-6">
                Answer a few quick questions about your condition, goals, and lifestyle.
                We&apos;ll recommend the best treatments tailored to your needs.
              </p>
              <p className="text-muted text-sm mb-8">Takes ~2 minutes</p>
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="inline-flex items-center px-10 py-4 rounded-xl bg-orange text-white font-heading font-semibold hover:bg-orange-dark transition-colors shadow-lg shadow-orange/25"
              >
                Start Quiz
              </button>
            </motion.div>
          )}

          {started && !showResults && currentQuestion && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6 sm:p-10 shadow-sm"
            >
              <QuizStepper
                currentStep={currentStep}
                totalSteps={questions.length}
                onBack={handleBack}
                onNext={handleNext}
                canGoNext={canGoNext()}
                isLastStep={currentStep === questions.length}
                onSubmit={handleSubmit}
              >
                <AnimatePresence mode="wait">
                  <QuizQuestion
                    key={currentQuestion.id}
                    question={currentQuestion}
                    answer={currentAnswer as string | number | null}
                    onAnswer={handleAnswer}
                  />
                </AnimatePresence>
              </QuizStepper>
            </motion.div>
          )}

          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6 sm:p-10 shadow-sm"
            >
              <QuizResults results={results} onRetake={handleRetake} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
