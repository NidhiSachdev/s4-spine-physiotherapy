"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterState {
  ageGroup: string[];
  treatmentType: string[];
}

interface FilterSidebarProps {
  filters: {
    ageGroup: string[];
    treatmentType: string[];
  };
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}
const AGE_GROUP_OPTIONS = ["Child", "Adult", "Geriatric"];
const TREATMENT_TYPE_OPTIONS = [
  "Manual therapy",
  "Exercise-based",
  "Electrotherapy",
  "Hydrotherapy",
  "Heat/Cold therapy",
];

function FilterSection({
  title,
  options,
  activeValues,
  onToggle,
  isOpen,
  onToggleOpen,
  count,
}: {
  title: string;
  options: string[];
  activeValues: string[];
  onToggle: (value: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  count: number;
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <button
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-charcoal/[0.02] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-charcoal">{title}</span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange/10 text-orange">
              {count}
            </span>
          )}
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 text-muted shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeValues.includes(option)}
                    onChange={() => onToggle(option)}
                    className="w-4 h-4 rounded border-border text-orange focus:ring-orange"
                  />
                  <span className="text-sm text-body group-hover:text-charcoal">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  activeFilters,
}: FilterSidebarProps) {
  const [ageGroupOpen, setAgeGroupOpen] = useState(true);
  const [treatmentTypeOpen, setTreatmentTypeOpen] = useState(true);

  const totalActive =
    activeFilters.ageGroup.length +
    activeFilters.treatmentType.length;

  const toggleFilter = (
    key: keyof FilterState,
    value: string
  ) => {
    const current = activeFilters[key];
    const isActive = current.includes(value);
    const next = isActive
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...activeFilters, [key]: next });
  };

  const clearAll = () => {
    onFilterChange({
      ageGroup: [],
      treatmentType: [],
    });
  };

  return (
    <aside className="space-y-4">
      {totalActive > 0 && (
        <button
          onClick={clearAll}
          className="w-full py-2 px-4 text-sm font-medium text-orange hover:text-orange-dark hover:bg-orange/5 rounded-lg transition-colors border border-orange/30"
        >
          Clear All
        </button>
      )}
      <FilterSection
        title="Age Group"
        options={AGE_GROUP_OPTIONS}
        activeValues={activeFilters.ageGroup}
        onToggle={(v) => toggleFilter("ageGroup", v)}
        isOpen={ageGroupOpen}
        onToggleOpen={() => setAgeGroupOpen(!ageGroupOpen)}
        count={activeFilters.ageGroup.length}
      />
      <FilterSection
        title="Treatment Type"
        options={TREATMENT_TYPE_OPTIONS}
        activeValues={activeFilters.treatmentType}
        onToggle={(v) => toggleFilter("treatmentType", v)}
        isOpen={treatmentTypeOpen}
        onToggleOpen={() => setTreatmentTypeOpen(!treatmentTypeOpen)}
        count={activeFilters.treatmentType.length}
      />
    </aside>
  );
}
