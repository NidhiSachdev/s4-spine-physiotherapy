"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const BODY_PATH_FRONT =
  "M 104.79 19.06 C 101.89 21.96, 101.77 22.37, 102.52 27.31 L 103.5 42.47 97 44.75 C 86.02 48.61, 85 50.42, 85 66.08 C 85 73.54, 84.54 80, 83.92 81.16 C 83.32 82.27, 81.81 87.3, 80.56 92.34 C 79.13 98.11, 77.16 103.17, 75.21 106 C 72.89 109.4, 72.48 110.58, 73.57 110.82 C 74.58 111.05, 75 112.62, 75 116.14 C 75 120.96, 75.09 121.12, 77.66 120.82 C 80.98 120.42, 84.06 114.91, 84.72 108.19 C 84.98 105.61, 86.72 99.85, 88.59 95.39 C 90.47 90.94, 92.29 85.19, 92.64 82.62 C 92.99 80.05, 93.65 77.71, 94.11 77.43 C 95.82 76.38, 96.11 82.06, 94.91 93.11 C 93.36 107.46, 93.56 120.84, 95.49 131.89 C 96.32 136.63, 97 145.23, 97.01 151 C 97.02 156.85, 97.65 163.86, 98.44 166.83 C 99.22 169.77, 100.17 176.07, 100.53 180.83 C 101.15 188.84, 101.03 189.72, 98.97 192.32 C 95.7 196.46, 97.41 197.44, 108.62 197.85 C 124.42 198.43, 127.82 196.97, 122.39 191.92 C 119.89 189.6, 119.81 189.18, 120.4 181.93 C 120.74 177.76, 121.77 171.69, 122.68 168.43 C 123.81 164.39, 124.3 159.15, 124.19 152 C 124.11 146.19, 124.75 137.48, 125.62 132.5 C 127.61 121.16, 127.78 107.7, 126.11 93.18 C 124.86 82.21, 125.15 76.36, 126.91 77.45 C 127.38 77.74, 128.06 79.89, 128.41 82.24 C 128.77 84.58, 130.65 90.33, 132.59 95 C 134.53 99.68, 136.26 105.55, 136.44 108.06 C 137.22 119.04, 146 126.83, 146 116.55 C 146 113.61, 146.52 111.81, 147.52 111.25 C 148.79 110.54, 148.49 109.63, 145.63 105.61 C 143.48 102.58, 141.8 98.66, 141.07 94.94 C 140.43 91.7, 139.03 86.49, 137.95 83.37 C 136.43 78.94, 136 74.99, 136 65.42 C 136 50.89, 134.62 48.15, 126 45.59 C 115.98 42.62, 116.18 43.09, 118.57 28.27 C 120.24 17.97, 111.63 12.21, 104.79 19.06 M 109.59 122.04 C 107.18 139.93, 106.72 191.12, 108.94 193.34 C 110.66 195.06, 112.71 193.2, 113.34 189.34 C 114.36 183.19, 114.1 148.61, 112.92 133.97 C 111.73 119.12, 110.55 114.88, 109.59 122.04";

interface BodyMapSVGProps {
  view: "front" | "back";
  selectedRegion: string | null;
  onRegionClick: (regionId: string) => void;
  onRegionHover: (regionId: string | null) => void;
}

const FRONT_REGIONS: { id: string; path: string }[] = [
  { id: "neck", path: "M 98 22 L 124 22 L 122 42 L 100 42 Z" },
  { id: "left-shoulder", path: "M 85 44 L 98 48 L 96 68 L 84 62 Z" },
  { id: "right-shoulder", path: "M 124 48 L 137 44 L 139 62 L 127 68 Z" },
  { id: "chest", path: "M 96 50 L 126 50 L 124 88 L 98 88 Z" },
  { id: "left-elbow", path: "M 76 92 L 88 90 L 90 108 L 78 110 Z" },
  { id: "right-elbow", path: "M 134 90 L 146 92 L 144 110 L 132 108 Z" },
  { id: "core", path: "M 98 88 L 124 88 L 122 132 L 100 132 Z" },
  { id: "left-wrist", path: "M 72 108 L 84 106 L 86 124 L 74 126 Z" },
  { id: "right-wrist", path: "M 138 106 L 150 108 L 148 126 L 136 124 Z" },
  { id: "left-hip", path: "M 96 128 L 110 126 L 112 150 L 98 152 Z" },
  { id: "right-hip", path: "M 112 126 L 126 128 L 124 152 L 110 150 Z" },
  { id: "left-knee", path: "M 97 156 L 110 154 L 112 180 L 99 182 Z" },
  { id: "right-knee", path: "M 112 154 L 125 156 L 123 182 L 110 180 Z" },
  { id: "left-ankle", path: "M 96 184 L 108 182 L 110 204 L 98 206 Z" },
  { id: "right-ankle", path: "M 114 182 L 126 184 L 124 206 L 112 204 Z" },
];

const BACK_REGIONS: { id: string; path: string }[] = [
  { id: "back-neck", path: "M 99 22 L 123 22 L 121 42 L 101 42 Z" },
  { id: "upper-back", path: "M 96 44 L 126 44 L 124 78 L 98 78 Z" },
  { id: "lower-back", path: "M 98 78 L 124 78 L 122 132 L 100 132 Z" },
  { id: "back-left-shoulder", path: "M 85 44 L 98 48 L 96 68 L 84 62 Z" },
  { id: "back-right-shoulder", path: "M 124 48 L 137 44 L 139 62 L 127 68 Z" },
  { id: "back-left-hip", path: "M 96 126 L 110 124 L 112 150 L 98 152 Z" },
  { id: "back-right-hip", path: "M 112 124 L 126 126 L 124 152 L 110 150 Z" },
  { id: "back-left-knee", path: "M 97 154 L 110 152 L 112 180 L 99 182 Z" },
  { id: "back-right-knee", path: "M 112 152 L 125 154 L 123 182 L 110 180 Z" },
];

export default function BodyMapSVG({
  view,
  selectedRegion,
  onRegionClick,
  onRegionHover,
}: BodyMapSVGProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const regions = view === "front" ? FRONT_REGIONS : BACK_REGIONS;
  const bodyPath = BODY_PATH_FRONT;

  const handleMouseEnter = (id: string) => {
    setHoveredRegion(id);
    onRegionHover(id);
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    onRegionHover(null);
  };

  return (
    <div className="w-full h-full min-h-[400px] max-w-lg mx-auto">
      <svg
        viewBox="0 0 221 228"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="region-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.91 0 0 0 0 0.47 0 0 0 0 0.16 0 0 0 0.6 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="body-clip">
            <path d={bodyPath} />
          </clipPath>
        </defs>

        <g clipPath="url(#body-clip)">
          <path
            d={bodyPath}
            fill="#FAFAFA"
            stroke="#374151"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {regions.map(({ id, path }) => {
          const isSelected = selectedRegion === id;
          const isHovered = hoveredRegion === id && !isSelected;

          return (
            <g
              key={id}
              data-region={id}
              className="cursor-pointer"
              onClick={() => onRegionClick(id)}
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={handleMouseLeave}
            >
              <motion.path
                d={path}
                fill="transparent"
                stroke="none"
                initial={false}
                animate={{
                  fill: isSelected
                    ? "rgba(232, 120, 42, 0.4)"
                    : isHovered
                      ? "rgba(13, 148, 136, 0.3)"
                      : "transparent",
                }}
                transition={{ duration: 0.2 }}
              />
              {isSelected && (
                <path
                  d={path}
                  fill="none"
                  stroke="#E8782A"
                  strokeWidth="2"
                  filter="url(#region-glow)"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
