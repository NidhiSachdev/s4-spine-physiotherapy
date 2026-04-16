"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BodyMapSVG from "@/components/body-map/BodyMapSVG";
import BodyPartPanel from "@/components/body-map/BodyPartPanel";
import treatmentsData from "@/data/treatments.json";
import bodyMapRegionsData from "@/data/body-map-regions.json";
import type { Treatment } from "@/lib/types";

const treatments = treatmentsData as Treatment[];

interface BodyMapRegion {
  id: string;
  label: string;
  description: string;
  commonConditions: string[];
  bodyPartKeys: string[];
  stat: string;
  view: string;
}

const bodyMapRegions = bodyMapRegionsData as BodyMapRegion[];

function filterTreatmentsForRegion(
  regionBodyPartKeys: string[],
  allTreatments: Treatment[]
): Treatment[] {
  return allTreatments.filter((treatment) =>
    treatment.bodyParts.some((bp) => regionBodyPartKeys.includes(bp))
  );
}

export default function BodyMapPage() {
  const [view, setView] = useState<"front" | "back">("front");
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const selectedRegion = useMemo(() => {
    if (!selectedRegionId) return null;
    const region = bodyMapRegions.find((r) => r.id === selectedRegionId);
    if (!region) return null;
    return {
      id: region.id,
      label: region.label,
      description: region.description,
      commonConditions: region.commonConditions,
      stat: region.stat,
    };
  }, [selectedRegionId]);

  const filteredTreatments = useMemo(() => {
    if (!selectedRegionId) return [];
    const region = bodyMapRegions.find((r) => r.id === selectedRegionId);
    if (!region) return [];
    return filterTreatmentsForRegion(region.bodyPartKeys, treatments);
  }, [selectedRegionId]);

  const isPanelOpen = !!selectedRegion;

  return (
    <div className="min-h-screen bg-warm-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Body Map" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mt-4">
            Interactive Body Map
          </h1>
          <p className="text-muted mt-2 text-lg">
            Explore body regions and discover treatments for your condition
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-sm text-muted mt-4"
        >
          Click on any body part to explore treatments
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex gap-2 mt-6"
        >
          <button
            onClick={() => setView("front")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              view === "front"
                ? "bg-orange text-white shadow-md"
                : "bg-card text-muted hover:bg-border/50 border border-border"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setView("back")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              view === "back"
                ? "bg-orange text-white shadow-md"
                : "bg-card text-muted hover:bg-border/50 border border-border"
            }`}
          >
            Back
          </button>
        </motion.div>

        <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex-1 min-w-0"
          >
            <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
              <BodyMapSVG
                view={view}
                selectedRegion={selectedRegionId}
                onRegionClick={setSelectedRegionId}
                onRegionHover={() => {}}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <BodyPartPanel
        region={selectedRegion}
        treatments={filteredTreatments}
        onClose={() => setSelectedRegionId(null)}
        isOpen={isPanelOpen}
      />
    </div>
  );
}
