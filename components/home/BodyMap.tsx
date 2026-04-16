"use client";

import { useState, useEffect, useCallback } from "react";

interface PainPoint {
  id: string;
  label: string;
  description: string;
  treatments: string;
  left: string;
  top: string;
  side: "left" | "right";
  delay: string;
}

const painPoints: PainPoint[] = [
  {
    id: "neck",
    label: "Head & Neck",
    description: "Migraines, cervical spondylosis, stiffness",
    treatments: "6 treatments",
    left: "50.2%",
    top: "19.3%",
    side: "right",
    delay: "0s",
  },
  {
    id: "shoulder",
    label: "Shoulder",
    description: "Frozen shoulder, rotator cuff, impingement",
    treatments: "5 treatments",
    left: "38.9%",
    top: "22.8%",
    side: "left",
    delay: "0.4s",
  },
  {
    id: "spine",
    label: "Spine & Back",
    description: "Herniated disc, sciatica, postural correction",
    treatments: "8 treatments",
    left: "50.2%",
    top: "36%",
    side: "right",
    delay: "0.8s",
  },
  {
    id: "elbow",
    label: "Elbow & Wrist",
    description: "Tennis elbow, carpal tunnel, RSI",
    treatments: "4 treatments",
    left: "64.7%",
    top: "45.6%",
    side: "right",
    delay: "1.2s",
  },
  {
    id: "hip",
    label: "Hip & Pelvis",
    description: "Arthritis, bursitis, labral tear",
    treatments: "4 treatments",
    left: "43.4%",
    top: "52.6%",
    side: "left",
    delay: "1.6s",
  },
  {
    id: "knee",
    label: "Knee",
    description: "ACL tear, meniscus, osteoarthritis",
    treatments: "7 treatments",
    left: "54.8%",
    top: "72.4%",
    side: "right",
    delay: "2s",
  },
  {
    id: "ankle",
    label: "Ankle & Foot",
    description: "Sprains, plantar fasciitis, Achilles",
    treatments: "5 treatments",
    left: "45.2%",
    top: "83.3%",
    side: "left",
    delay: "2.4s",
  },
];

const BODY_PATH =
  "M 104.790 19.056 C 101.889 21.957, 101.774 22.374, 102.519 27.306 C 102.951 30.163, 103.348 34.743, 103.402 37.486 L 103.500 42.471 97 44.754 C 86.015 48.613, 85 50.417, 85 66.082 C 85 73.542, 84.536 79.999, 83.916 81.157 C 83.320 82.271, 81.811 87.303, 80.564 92.341 C 79.134 98.112, 77.155 103.165, 75.213 106 C 72.887 109.396, 72.482 110.579, 73.565 110.823 C 74.577 111.051, 75 112.619, 75 116.140 C 75 120.958, 75.093 121.122, 77.659 120.816 C 80.975 120.422, 84.058 114.910, 84.723 108.189 C 84.978 105.610, 86.720 99.852, 88.593 95.394 C 90.466 90.935, 92.287 85.185, 92.639 82.616 C 92.991 80.047, 93.653 77.714, 94.110 77.432 C 95.818 76.376, 96.108 82.059, 94.911 93.108 C 93.356 107.459, 93.555 120.842, 95.488 131.892 C 96.316 136.626, 97 145.225, 97.009 151 C 97.017 156.847, 97.653 163.864, 98.443 166.833 C 99.224 169.766, 100.165 176.066, 100.534 180.833 C 101.153 188.837, 101.034 189.716, 98.974 192.321 C 95.703 196.457, 97.414 197.438, 108.615 197.849 C 124.422 198.428, 127.818 196.967, 122.391 191.924 C 119.893 189.603, 119.808 189.177, 120.399 181.927 C 120.739 177.762, 121.766 171.687, 122.680 168.427 C 123.813 164.389, 124.295 159.153, 124.194 152 C 124.112 146.186, 124.749 137.484, 125.622 132.500 C 127.610 121.155, 127.778 107.696, 126.114 93.183 C 124.857 82.213, 125.154 76.359, 126.914 77.447 C 127.384 77.738, 128.060 79.893, 128.414 82.238 C 128.769 84.582, 130.646 90.325, 132.586 95 C 134.526 99.675, 136.259 105.552, 136.439 108.059 C 137.224 119.037, 146 126.831, 146 116.550 C 146 113.611, 146.515 111.811, 147.517 111.250 C 148.791 110.537, 148.488 109.632, 145.630 105.612 C 143.476 102.583, 141.800 98.660, 141.067 94.936 C 140.430 91.698, 139.029 86.492, 137.954 83.367 C 136.430 78.937, 136 74.987, 136 65.420 C 136 50.894, 134.617 48.152, 126.004 45.594 C 115.977 42.616, 116.178 43.085, 118.574 28.269 C 120.240 17.966, 111.633 12.213, 104.790 19.056 M 109.586 122.040 C 107.184 139.931, 106.721 191.121, 108.942 193.342 C 110.659 195.059, 112.707 193.195, 113.344 189.337 C 114.359 183.191, 114.097 148.606, 112.923 133.974 C 111.732 119.115, 110.548 114.881, 109.586 122.040";

export default function BodyMap() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const activePoint = painPoints[activeIndex]?.id ?? null;

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % painPoints.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [paused]);

  const handleDotEnter = useCallback((idx: number) => {
    setPaused(true);
    setActiveIndex(idx);
  }, []);

  const handleDotLeave = useCallback(() => {
    setPaused(false);
  }, []);

  return (
    <div className="relative w-full max-w-[520px] mx-auto" style={{ aspectRatio: "221/228" }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 221 228"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-body-pulse"
      >
        <defs>
          <filter id="glow" x="-40%" y="-15%" width="180%" height="130%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="0 0 0 0 0.28  0 0 0 0 0.68  0 0 0 0 0.96  0 0 0 0.55 0"
              result="g"
            />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
          <filter id="softer" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <linearGradient id="bf" x1="111" y1="10" x2="111" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5CC4F5" stopOpacity=".22" />
            <stop offset=".4" stopColor="#3A9FD8" stopOpacity=".15" />
            <stop offset=".8" stopColor="#2878B0" stopOpacity=".10" />
            <stop offset="1" stopColor="#1A5A88" stopOpacity=".06" />
          </linearGradient>
          <radialGradient id="innerGlow" cx="50%" cy="35%" r="50%">
            <stop offset="0" stopColor="#60CCFF" stopOpacity=".12" />
            <stop offset="1" stopColor="#2070A0" stopOpacity=".03" />
          </radialGradient>
          <clipPath id="bodyClip">
            <path d={BODY_PATH} />
          </clipPath>
        </defs>

        {/* Deep inner glow */}
        <g clipPath="url(#bodyClip)">
          <rect x="70" y="10" width="80" height="200" fill="url(#innerGlow)" filter="url(#softer)" />
        </g>

        {/* Body outline with glow + fill */}
        <path filter="url(#glow)" fill="url(#bf)" stroke="#4DB8E8" strokeWidth="0.7" d={BODY_PATH} />

        {/* Skeleton + anatomy */}
        <g clipPath="url(#bodyClip)" stroke="#4DB8E8" fill="none" strokeLinecap="round">
          {/* Skull */}
          <ellipse cx="111" cy="26" rx="8" ry="10" strokeWidth=".6" opacity=".2" />
          <path d="M106,30 C108,34 111,36 111,36 C111,36 114,34 116,30" strokeWidth=".4" opacity=".15" />
          <ellipse cx="108" cy="24" rx="2.5" ry="2" strokeWidth=".35" opacity=".12" />
          <ellipse cx="114" cy="24" rx="2.5" ry="2" strokeWidth=".35" opacity=".12" />
          <path d="M104,28 C106,33 111,35 111,35 C111,35 116,33 118,28" strokeWidth=".4" opacity=".12" />

          {/* Spine vertebrae */}
          <g opacity=".22" strokeWidth=".5">
            <line x1="108" y1="40" x2="114" y2="40" />
            <line x1="107.5" y1="42" x2="114.5" y2="42" />
            <line x1="107" y1="44" x2="115" y2="44" />
            <line x1="107" y1="46" x2="115" y2="46" />
            <line x1="107" y1="48" x2="115" y2="48" />
            <line x1="107" y1="52" x2="115" y2="52" />
            <line x1="107" y1="55" x2="115" y2="55" />
            <line x1="107" y1="58" x2="115" y2="58" />
            <line x1="107" y1="61" x2="115" y2="61" />
            <line x1="107" y1="64" x2="115" y2="64" />
            <line x1="107" y1="67" x2="115" y2="67" />
            <line x1="107" y1="70" x2="115" y2="70" />
            <line x1="107" y1="73" x2="115" y2="73" />
            <line x1="107" y1="76" x2="115" y2="76" />
            <line x1="107" y1="79" x2="115" y2="79" />
            <line x1="107" y1="82" x2="115" y2="82" />
            <line x1="107" y1="85" x2="115" y2="85" />
            <line x1="106.5" y1="89" x2="115.5" y2="89" />
            <line x1="106.5" y1="93" x2="115.5" y2="93" />
            <line x1="106.5" y1="97" x2="115.5" y2="97" />
            <line x1="106.5" y1="101" x2="115.5" y2="101" />
            <line x1="106.5" y1="105" x2="115.5" y2="105" />
            <path d="M108,109 L111,118 L114,109" strokeWidth=".5" />
          </g>
          <line x1="111" y1="40" x2="111" y2="118" strokeWidth=".4" opacity=".15" />

          {/* Rib cage */}
          <g opacity=".16" strokeWidth=".45">
            <path d="M107,52 C100,53 95,56 93,60" />
            <path d="M115,52 C122,53 127,56 129,60" />
            <path d="M107,55 C99,57 94,60 92,64" />
            <path d="M115,55 C123,57 128,60 130,64" />
            <path d="M107,58 C98,60 93,64 91,68" />
            <path d="M115,58 C124,60 129,64 131,68" />
            <path d="M107,61 C98,63 93,67 92,71" />
            <path d="M115,61 C124,63 129,67 130,71" />
            <path d="M107,64 C98,66 94,70 93,74" />
            <path d="M115,64 C124,66 128,70 129,74" />
            <path d="M107,67 C99,69 95,73 94,76" />
            <path d="M115,67 C123,69 127,73 128,76" />
            <path d="M107,70 C100,72 96,75 95,78" />
            <path d="M115,70 C122,72 126,75 127,78" />
            <path d="M107,73 C100,75 97,77 96,80" />
            <path d="M115,73 C122,75 125,77 126,80" />
            <path d="M107,76 C101,77 98,79 97,82" />
            <path d="M115,76 C121,77 124,79 125,82" />
            <path d="M108,79 C103,80 100,82 99,84" />
            <path d="M114,79 C119,80 122,82 123,84" />
            <path d="M108,82 C104,83 101,84 100,86" />
            <path d="M114,82 C118,83 121,84 122,86" />
            <path d="M108,85 C105,86 103,87 102,88" />
            <path d="M114,85 C117,86 119,87 120,88" />
          </g>

          {/* Sternum */}
          <line x1="111" y1="50" x2="111" y2="86" strokeWidth=".5" opacity=".15" />

          {/* Clavicles */}
          <path d="M111,50 C105,49 98,50 90,53" strokeWidth=".55" opacity=".2" />
          <path d="M111,50 C117,49 124,50 132,53" strokeWidth=".55" opacity=".2" />

          {/* Scapulae */}
          <path d="M92,55 C90,60 89,68 91,74 C93,72 94,66 93,60 Z" strokeWidth=".35" opacity=".1" fill="#4DB8E8" fillOpacity=".04" />
          <path d="M130,55 C132,60 133,68 131,74 C129,72 128,66 129,60 Z" strokeWidth=".35" opacity=".1" fill="#4DB8E8" fillOpacity=".04" />

          {/* Pelvis */}
          <path d="M100,108 C98,112 96,118 98,124 C100,128 104,130 111,131" strokeWidth=".5" opacity=".18" />
          <path d="M122,108 C124,112 126,118 124,124 C122,128 118,130 111,131" strokeWidth=".5" opacity=".18" />
          <ellipse cx="111" cy="122" rx="12" ry="8" strokeWidth=".4" opacity=".1" />

          {/* Pectoral muscles */}
          <path d="M95,56 C100,62 107,66 111,67" strokeWidth=".4" opacity=".12" />
          <path d="M127,56 C122,62 115,66 111,67" strokeWidth=".4" opacity=".12" />

          {/* Abdominal muscles */}
          <rect x="105" y="87" width="12" height="30" rx="3" strokeWidth=".35" opacity=".1" />
          <line x1="106" y1="92" x2="116" y2="92" strokeWidth=".3" opacity=".1" />
          <line x1="106" y1="97" x2="116" y2="97" strokeWidth=".3" opacity=".1" />
          <line x1="106" y1="102" x2="116" y2="102" strokeWidth=".3" opacity=".1" />
          <line x1="106" y1="107" x2="116" y2="107" strokeWidth=".3" opacity=".1" />
          <line x1="111" y1="87" x2="111" y2="117" strokeWidth=".3" opacity=".1" />
          <path d="M95,85 C98,90 102,95 105,98" strokeWidth=".3" opacity=".08" />
          <path d="M127,85 C124,90 120,95 117,98" strokeWidth=".3" opacity=".08" />

          {/* Navel */}
          <circle cx="111" cy="100" r="1.5" strokeWidth=".4" opacity=".18" />

          {/* Deltoid muscles */}
          <path d="M90,52 C87,58 85,66 87,74" strokeWidth=".4" opacity=".12" />
          <path d="M132,52 C135,58 137,66 135,74" strokeWidth=".4" opacity=".12" />

          {/* Arm muscles */}
          <path d="M89,76 C87,82 84,90 82,96" strokeWidth=".35" opacity=".1" />
          <path d="M92,76 C90,82 88,90 86,96" strokeWidth=".35" opacity=".1" />
          <path d="M133,76 C135,82 138,90 140,96" strokeWidth=".35" opacity=".1" />
          <path d="M130,76 C132,82 134,90 136,96" strokeWidth=".35" opacity=".1" />

          {/* Elbow joints */}
          <ellipse cx="80" cy="100" rx="3" ry="2.5" strokeWidth=".4" opacity=".12" />
          <ellipse cx="142" cy="100" rx="3" ry="2.5" strokeWidth=".4" opacity=".12" />

          {/* Forearm bones */}
          <path d="M79,102 C78,106 77,112 77,116" strokeWidth=".3" opacity=".1" />
          <path d="M82,102 C81,106 80,112 79,116" strokeWidth=".3" opacity=".1" />
          <path d="M143,102 C144,106 145,112 145,116" strokeWidth=".3" opacity=".1" />
          <path d="M140,102 C141,106 142,112 143,116" strokeWidth=".3" opacity=".1" />

          {/* Femur bones */}
          <line x1="105" y1="130" x2="102" y2="165" strokeWidth=".5" opacity=".14" />
          <line x1="117" y1="130" x2="120" y2="165" strokeWidth=".5" opacity=".14" />

          {/* Kneecaps */}
          <ellipse cx="101" cy="167" rx="4" ry="5" strokeWidth=".5" opacity=".18" />
          <ellipse cx="121" cy="167" rx="4" ry="5" strokeWidth=".5" opacity=".18" />

          {/* Shin bones */}
          <line x1="101" y1="172" x2="100" y2="190" strokeWidth=".4" opacity=".12" />
          <line x1="103" y1="172" x2="103" y2="190" strokeWidth=".3" opacity=".08" />
          <line x1="121" y1="172" x2="122" y2="190" strokeWidth=".4" opacity=".12" />
          <line x1="119" y1="172" x2="119" y2="190" strokeWidth=".3" opacity=".08" />

          {/* Quadriceps */}
          <path d="M99,132 C97,142 96,155 98,164" strokeWidth=".3" opacity=".1" />
          <path d="M107,132 C106,142 105,155 104,164" strokeWidth=".3" opacity=".1" />
          <path d="M115,132 C116,142 117,155 118,164" strokeWidth=".3" opacity=".1" />
          <path d="M123,132 C125,142 126,155 124,164" strokeWidth=".3" opacity=".1" />

          {/* Calf muscles */}
          <path d="M98,172 C97,177 97,183 99,188" strokeWidth=".3" opacity=".08" />
          <path d="M104,172 C104,177 104,183 103,188" strokeWidth=".3" opacity=".08" />
          <path d="M118,172 C118,177 118,183 119,188" strokeWidth=".3" opacity=".08" />
          <path d="M124,172 C125,177 125,183 123,188" strokeWidth=".3" opacity=".08" />

          {/* Torso shading */}
          <path d="M95,55 C99,62 106,67 111,68 C106,67 99,72 96,80 Z" fill="#4DB8E8" fillOpacity=".03" stroke="none" />
          <path d="M127,55 C123,62 116,67 111,68 C116,67 123,72 126,80 Z" fill="#4DB8E8" fillOpacity=".03" stroke="none" />

          {/* Hip joints */}
          <circle cx="104" cy="126" r="3" strokeWidth=".4" opacity=".14" />
          <circle cx="118" cy="126" r="3" strokeWidth=".4" opacity=".14" />

          {/* Ankle joints */}
          <ellipse cx="100" cy="191" rx="3" ry="2" strokeWidth=".35" opacity=".12" />
          <ellipse cx="122" cy="191" rx="3" ry="2" strokeWidth=".35" opacity=".12" />
        </g>

        {/* Edge highlights */}
        <g clipPath="url(#bodyClip)" opacity=".08">
          <path
            d="M93,55 C91,65 90,78 92,82 C91,90 93,100 94,108 C94,115 95,125 97,132 C97,140 97,152 98,160 C98,170 99,180 100,188"
            stroke="#80D4FF"
            strokeWidth="1.5"
            fill="none"
            filter="url(#soft)"
          />
          <path
            d="M129,55 C131,65 132,78 130,82 C131,90 129,100 128,108 C128,115 127,125 125,132 C125,140 125,152 124,160 C124,170 123,180 122,188"
            stroke="#80D4FF"
            strokeWidth="1.5"
            fill="none"
            filter="url(#soft)"
          />
        </g>

        {/* Floor reflection */}
        <ellipse cx="111" cy="204" rx="35" ry="5" fill="#4DB8E8" opacity=".05" filter="url(#softer)" />
      </svg>

      {/* Pain dots */}
      {painPoints.map((point, idx) => {
        const isActive = activePoint === point.id;
        return (
        <div
          key={point.id}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: point.left, top: point.top }}
          onMouseEnter={() => handleDotEnter(idx)}
          onMouseLeave={handleDotLeave}
          onTouchStart={() => handleDotEnter(idx)}
        >
          <div
            className={`pain-dot w-5 h-5 rounded-full relative transition-transform duration-300 ${isActive ? "scale-150" : ""}`}
            style={{ animationDelay: point.delay }}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] bg-white/95 rounded-full" />
          </div>

          {/* Tooltip */}
          <div
            className={`absolute top-1/2 bg-white rounded-xl px-3.5 py-2.5 shadow-2xl whitespace-nowrap min-w-[175px] z-20 transition-all duration-300 ${
              isActive
                ? "opacity-100 translate-y-[-50%] translate-x-0 scale-100"
                : "opacity-0 pointer-events-none translate-y-[-50%] scale-95"
            } ${
              point.side === "right"
                ? "left-[calc(100%+16px)]"
                : "right-[calc(100%+16px)]"
            }`}
          >
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent ${
                point.side === "right"
                  ? "-left-[6px] border-r-[6px] border-r-white"
                  : "-right-[6px] border-l-[6px] border-l-white"
              }`}
            />
            <div className="text-[13px] font-bold text-charcoal mb-0.5">{point.label}</div>
            <div className="text-[11px] text-muted mb-1.5">{point.description}</div>
            <span className="inline-block bg-orange text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-xl">
              {point.treatments}
            </span>
          </div>
        </div>
        );
      })}

      {/* CTA */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
        <a href="/treatments" className="text-orange text-xs font-semibold hover:underline">
          Full Body Map &rarr;
        </a>
      </div>
    </div>
  );
}
