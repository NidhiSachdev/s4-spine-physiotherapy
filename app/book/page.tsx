"use client";

import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Confetti from "@/components/ui/Confetti";
import treatmentsData from "@/data/treatments.json";
import { formatDate } from "@/lib/utils";

interface Treatment {
  name: string;
  slug: string;
  category: string;
  categoryName: string;
}

const treatments = treatmentsData as Treatment[];

const STEP_LABELS = ["Treatment", "Date", "Time", "Details", "Review"];

const TIME_SLOTS = [
  { id: "morning", label: "Morning", range: "8:00 AM - 12:00 PM", icon: "sun" },
  { id: "afternoon", label: "Afternoon", range: "12:00 PM - 4:00 PM", icon: "sun" },
  { id: "evening", label: "Evening", range: "4:00 PM - 8:00 PM", icon: "moon" },
];

interface SlotAvailability {
  total: number;
  booked: number;
  available: number;
  nextTime: string | null;
  full: boolean;
}

const groupedTreatments = treatments.reduce<Record<string, Treatment[]>>((acc, t) => {
  const cat = t.categoryName || "Other";
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(t);
  return acc;
}, {});

const categoryOrder = [...new Set(treatments.map((t) => t.categoryName))];

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = (first.getDay() + 6) % 7;
  const days = last.getDate();
  return { startPad, days };
}

function isPastDate(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

function isSunday(year: number, month: number, day: number): boolean {
  return new Date(year, month, day).getDay() === 0;
}

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const treatmentSlug = searchParams.get("treatment");

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [date, setDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [assignedTime, setAssignedTime] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slotAvailability, setSlotAvailability] = useState<Record<string, SlotAvailability> | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [treatmentOpen, setTreatmentOpen] = useState(false);
  const treatmentDropdownRef = useRef<HTMLDivElement>(null);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    if (treatmentSlug && treatments.length) {
      const t = treatments.find((x) => x.slug === treatmentSlug);
      if (t) setTreatment(t);
    }
  }, [treatmentSlug]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (treatmentDropdownRef.current && !treatmentDropdownRef.current.contains(e.target as Node)) {
        setTreatmentOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTreatments = useMemo(() => {
    if (!searchQuery.trim()) return groupedTreatments;
    const q = searchQuery.toLowerCase();
    const filtered: Record<string, Treatment[]> = {};
    for (const cat of categoryOrder) {
      const items = (groupedTreatments[cat] || []).filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q)
      );
      if (items.length) filtered[cat] = items;
    }
    return filtered;
  }, [searchQuery]);

  const fetchAvailability = async (d: { year: number; month: number; day: number }) => {
    setAvailabilityLoading(true);
    try {
      const dateStr = `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
      const res = await fetch(`/api/bookings/availability?date=${dateStr}`);
      const data = await res.json();
      if (res.ok) {
        setSlotAvailability(data.availability);
      }
    } catch {
      setSlotAvailability(null);
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const canProceedStep1 = !!treatment;
  const canProceedStep2 = !!date;
  const canProceedStep3 = !!timeSlot && !(slotAvailability?.[TIME_SLOTS.find((s) => s.id === timeSlot)?.label || ""]?.full);
  const canProceedStep4 = (() => {
    if (!name.trim()) return false;
    if (!phone.trim()) return false;
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) return false;
    return true;
  })();

  const validateStep4 = () => {
    let ok = true;
    if (!name.trim()) {
      setNameError("Name is required");
      ok = false;
    } else setNameError("");
    const digits = phone.replace(/\D/g, "");
    if (!phone.trim()) {
      setPhoneError("Phone is required");
      ok = false;
    } else if (digits.length !== 10) {
      setPhoneError("Enter a valid 10-digit phone number");
      ok = false;
    } else setPhoneError("");
    return ok;
  };

  const handleSubmit = async () => {
    if (!treatment || !date || !timeSlot || !name.trim() || !phone.trim()) return;
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) return;

    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const dateStr = `${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
      const slotLabel = TIME_SLOTS.find((s) => s.id === timeSlot)?.label || timeSlot;
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatment: treatment.slug,
          date: dateStr,
          timeSlot: slotLabel,
          name: name.trim(),
          phone: digits,
          age: age ? Number(age) : undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setBookingId(data.bookingId);
      setAssignedTime(data.assignedTime || null);
      setStep(6);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  const goToStep = (s: number) => {
    if (s >= 1 && s <= 6 && (s < 6 || step === 6)) {
      setDirection(s > step ? 1 : -1);
      setStep(s);
    }
  };

  const goNext = (next: number) => {
    setDirection(1);
    setStep(next);
  };

  const goBack = (prev: number) => {
    setDirection(-1);
    setStep(prev);
  };

  const resetForm = () => {
    setStep(1);
    setTreatment(null);
    setDate(null);
    setTimeSlot(null);
    setName("");
    setPhone("");
    setAge("");
    setNotes("");
    setBookingId(null);
    setAssignedTime(null);
    setSlotAvailability(null);
    setSubmitError(null);
    router.push("/book");
  };

  const slideVariants = {
    enter: () => ({ x: direction > 0 ? 24 : -24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: () => ({ x: direction < 0 ? 24 : -24, opacity: 0 }),
  };

  const { startPad, days } = getDaysInMonth(calendarMonth.year, calendarMonth.month);
  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Book Appointment" },
          ]}
        />

        <h1 className="text-2xl sm:text-3xl font-semibold text-charcoal mt-2 mb-8">
          Book Appointment
        </h1>

        {step < 6 && (
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {STEP_LABELS.map((label, i) => {
                const idx = i + 1;
                const completed = step > idx;
                const current = step === idx;
                return (
                  <div key={idx} className="flex items-center flex-1">
                    <button
                      type="button"
                      onClick={() => completed && goToStep(idx)}
                      className="flex flex-col items-center gap-1 min-w-0"
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                          completed
                            ? "bg-orange text-white"
                            : current
                              ? "bg-orange text-white ring-2 ring-orange ring-offset-2"
                              : "bg-border text-muted"
                        }`}
                      >
                        {completed ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          idx
                        )}
                      </div>
                      <span className={`text-xs hidden sm:block truncate max-w-full ${current ? "text-charcoal font-medium" : "text-muted"}`}>
                        {STEP_LABELS[i]}
                      </span>
                    </button>
                    {i < 4 && (
                      <div className="flex-1 h-0.5 mx-1 min-w-[8px] bg-border rounded">
                        <div
                          className={`h-full rounded transition-all ${completed ? "bg-orange" : "bg-border"}`}
                          style={{ width: completed ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="relative" ref={treatmentDropdownRef}>
                <label className="block text-sm font-medium text-charcoal mb-2">Select Treatment</label>
                <input
                  type="text"
                  placeholder="Search treatments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setTreatmentOpen(true)}
                  className="w-full rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition"
                />
                {treatmentOpen && (
                  <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-64 overflow-y-auto">
                    {Object.entries(filteredTreatments).map(([cat, items]) => (
                      <div key={cat}>
                        <div className="px-4 py-2 text-xs font-semibold text-muted uppercase bg-warm-bg sticky top-0">
                          {cat}
                        </div>
                        {items.map((t) => (
                          <button
                            key={t.slug}
                            type="button"
                            onClick={() => {
                              setTreatment(t);
                              setTreatmentOpen(false);
                              setSearchQuery("");
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-cream transition ${
                              treatment?.slug === t.slug ? "bg-cream text-orange font-medium" : ""
                            }`}
                          >
                            <span className="text-body">{t.name}</span>
                            <span className="text-muted text-sm ml-2">— {t.categoryName}</span>
                          </button>
                        ))}
                      </div>
                    ))}
                    {Object.keys(filteredTreatments).length === 0 && (
                      <div className="px-4 py-6 text-muted text-center">No treatments found</div>
                    )}
                  </div>
                )}
              </div>
              {treatment && (
                <div className="rounded-lg border border-orange bg-cream px-4 py-3">
                  <span className="font-medium text-charcoal">{treatment.name}</span>
                  <span className="text-muted text-sm ml-2">{treatment.categoryName}</span>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => goNext(2)}
                  disabled={!canProceedStep1}
                  className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-dark transition"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-charcoal">Select Date</h2>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth((m) =>
                        m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 }
                      )
                    }
                    className="p-2 rounded-lg border border-border hover:bg-cream transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="px-4 py-2 font-medium text-charcoal min-w-[140px] text-center">
                    {monthLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth((m) =>
                        m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 }
                      )
                    }
                    className="p-2 rounded-lg border border-border hover:bg-cream transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-muted py-2">
                    {d}
                  </div>
                ))}
                {Array.from({ length: startPad }, (_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {Array.from({ length: days }, (_, i) => {
                  const d = i + 1;
                  const past = isPastDate(calendarMonth.year, calendarMonth.month, d);
                  const sun = isSunday(calendarMonth.year, calendarMonth.month, d);
                  const disabled = past;
                  const selected =
                    date?.year === calendarMonth.year &&
                    date?.month === calendarMonth.month &&
                    date?.day === d;
                  const today =
                    new Date().getFullYear() === calendarMonth.year &&
                    new Date().getMonth() === calendarMonth.month &&
                    new Date().getDate() === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        !disabled &&
                        setDate({
                          year: calendarMonth.year,
                          month: calendarMonth.month,
                          day: d,
                        })
                      }
                      className={`aspect-square rounded-lg border flex items-center justify-center text-sm font-medium transition ${
                        disabled
                          ? "text-muted cursor-not-allowed bg-warm-bg border-border/50"
                          : selected
                            ? "bg-orange text-white border-orange shadow-md shadow-orange/20"
                            : today
                              ? "border-orange text-orange bg-orange/5 font-bold"
                              : "border-border bg-card hover:bg-cream hover:border-orange/40 text-charcoal font-semibold"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => goBack(1)}
                  className="px-4 py-2.5 rounded-lg border border-border text-body hover:bg-cream transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (date) {
                      setTimeSlot(null);
                      fetchAvailability(date);
                    }
                    goNext(3);
                  }}
                  disabled={!canProceedStep2}
                  className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-dark transition"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-charcoal">Select Time Slot</h2>
              {availabilityLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin w-6 h-6 text-orange mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-muted">Checking availability...</span>
                </div>
              ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {TIME_SLOTS.map((slot) => {
                  const avail = slotAvailability?.[slot.label];
                  const isFull = avail?.full ?? false;
                  const spotsLeft = avail ? avail.available : null;
                  const nextTime = avail?.nextTime ?? null;

                  return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => !isFull && setTimeSlot(slot.id)}
                    disabled={isFull}
                    className={`p-6 rounded-xl border-2 text-left transition ${
                      isFull
                        ? "border-border bg-warm-bg opacity-60 cursor-not-allowed"
                        : timeSlot === slot.id
                          ? "border-orange bg-cream"
                          : "border-border hover:border-orange/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {slot.icon === "sun" ? (
                        <svg className={`w-8 h-8 ${isFull ? "text-muted" : "text-orange"}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                      ) : (
                        <svg className={`w-8 h-8 ${isFull ? "text-muted" : "text-teal"}`} fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.477-.69.75.75 0 01.81.162 9 9 0 0010.5 10.5.75.75 0 01.162.81 8.97 8.97 0 01-3.477.69 9 9 0 01-9-9 8.97 8.97 0 01.69-3.477.75.75 0 01-.162-.81A9 9 0 0110.5 1.5a.75.75 0 01.81-.162 8.97 8.97 0 013.477.69z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`font-semibold ${isFull ? "text-muted" : "text-charcoal"}`}>{slot.label}</span>
                    </div>
                    <p className={`text-sm ${isFull ? "text-muted" : "text-muted"}`}>{slot.range}</p>
                    {spotsLeft !== null && (
                      <div className="mt-3 flex items-center justify-between">
                        {isFull ? (
                          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">Fully Booked</span>
                        ) : (
                          <>
                            <span className="text-xs font-medium text-teal bg-teal/10 px-2 py-1 rounded">
                              {spotsLeft} slot{spotsLeft !== 1 ? "s" : ""} left
                            </span>
                            {nextTime && (
                              <span className="text-xs text-charcoal font-medium">
                                Next: {nextTime}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </button>
                  );
                })}
              </div>
              )}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => goBack(2)}
                  className="px-4 py-2.5 rounded-lg border border-border text-body hover:bg-cream transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => goNext(4)}
                  disabled={!canProceedStep3}
                  className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-dark transition"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-charcoal">Patient Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => !name.trim() && setNameError("Name is required")}
                    placeholder="Your full name"
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition ${
                      nameError ? "border-red-500" : "border-border"
                    }`}
                  />
                  {nameError && <p className="mt-1 text-sm text-red-500">{nameError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onBlur={() => {
                      const d = phone.replace(/\D/g, "");
                      if (!phone.trim()) setPhoneError("Phone is required");
                      else if (d.length !== 10) setPhoneError("Enter a valid 10-digit phone number");
                      else setPhoneError("");
                    }}
                    placeholder="10-digit mobile number"
                    className={`w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition ${
                      phoneError ? "border-red-500" : "border-border"
                    }`}
                  />
                  {phoneError && <p className="mt-1 text-sm text-red-500">{phoneError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Age (optional)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    className="w-full rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Condition Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Brief description of your condition"
                    rows={3}
                    className="w-full rounded-lg border border-border px-4 py-3 focus:ring-2 focus:ring-orange focus:border-orange outline-none transition resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => goBack(3)}
                  className="px-4 py-2.5 rounded-lg border border-border text-body hover:bg-cream transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep4() && canProceedStep4) goNext(5);
                  }}
                  disabled={!canProceedStep4}
                  className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-dark transition"
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-charcoal">Review & Confirm</h2>
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase">Treatment</p>
                    <p className="font-medium text-charcoal">{treatment?.name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="text-sm text-orange hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase">Date</p>
                    <p className="font-medium text-charcoal">
                      {date && formatDate(`${date.year}-${String(date.month + 1).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="text-sm text-orange hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase">Time Slot</p>
                    <p className="font-medium text-charcoal">
                      {TIME_SLOTS.find((s) => s.id === timeSlot)?.label} ({TIME_SLOTS.find((s) => s.id === timeSlot)?.range})
                    </p>
                    {slotAvailability?.[TIME_SLOTS.find((s) => s.id === timeSlot)?.label || ""]?.nextTime && (
                      <p className="text-sm text-teal font-medium mt-1">
                        Your appointment time: {slotAvailability[TIME_SLOTS.find((s) => s.id === timeSlot)?.label || ""]?.nextTime}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (date) fetchAvailability(date);
                      goToStep(3);
                    }}
                    className="text-sm text-orange hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase">Name</p>
                    <p className="font-medium text-charcoal">{name}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    className="text-sm text-orange hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase">Phone</p>
                    <p className="font-medium text-charcoal">{phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    className="text-sm text-orange hover:underline"
                  >
                    Edit
                  </button>
                </div>
                {age && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted uppercase">Age</p>
                      <p className="font-medium text-charcoal">{age}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="text-sm text-orange hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
                {notes && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted uppercase">Condition Notes</p>
                      <p className="font-medium text-charcoal">{notes}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      className="text-sm text-orange hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
              {submitError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                  {submitError}
                </div>
              )}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => goBack(4)}
                  className="px-4 py-2.5 rounded-lg border border-border text-body hover:bg-cream transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-lg bg-orange text-white font-medium disabled:opacity-50 hover:bg-orange-dark transition flex items-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Booking"
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-8"
            >
              <Confetti />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal text-white mb-6"
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-semibold text-charcoal mb-2">Booking Submitted!</h2>
              <p className="text-muted mb-4">Your booking reference</p>
              <p className="text-2xl font-bold text-orange mb-2">{bookingId}</p>
              {assignedTime && (
                <p className="text-lg font-semibold text-teal mb-4">
                  Appointment Time: {assignedTime}
                </p>
              )}
              <p className="text-body max-w-md mx-auto mb-8">
                Your booking request has been submitted! The clinic will contact you to confirm your appointment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg bg-orange text-white font-medium hover:bg-orange-dark transition"
                >
                  Book Another
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-lg border border-border text-body font-medium hover:bg-cream transition text-center"
                >
                  Go Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-bg flex items-center justify-center"><div className="animate-pulse text-muted">Loading...</div></div>}>
      <BookPageContent />
    </Suspense>
  );
}
