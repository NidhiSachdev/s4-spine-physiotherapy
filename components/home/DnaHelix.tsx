"use client";

export default function DnaHelix() {
  const pairs = 10;
  const colors = [
    { left: "#F97316", right: "#0D9488" },
    { left: "#0D9488", right: "#F59E0B" },
    { left: "#EC4899", right: "#F97316" },
    { left: "#3B82F6", right: "#0D9488" },
    { left: "#F97316", right: "#8B5CF6" },
    { left: "#0D9488", right: "#F97316" },
    { left: "#F59E0B", right: "#3B82F6" },
    { left: "#8B5CF6", right: "#0D9488" },
    { left: "#F97316", right: "#EC4899" },
    { left: "#0D9488", right: "#F59E0B" },
  ];

  return (
    <div className="w-48 h-64 relative">
      <svg viewBox="0 0 120 200" className="w-full h-full">
        <defs>
          <style>{`
            @keyframes dna-rotate {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(360deg); }
            }
            .dna-group {
              animation: dna-wave 3s ease-in-out infinite;
            }
            @keyframes dna-wave {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.85; }
            }
            @keyframes pulse-left {
              0%, 100% { r: 5; }
              50% { r: 6.5; }
            }
            @keyframes pulse-right {
              0%, 100% { r: 5; }
              50% { r: 6.5; }
            }
          `}</style>
        </defs>
        {Array.from({ length: pairs }).map((_, i) => {
          const y = 15 + i * 18;
          const phase = (i / pairs) * Math.PI * 2;
          const xLeft = 30 + Math.sin(phase) * 18;
          const xRight = 90 - Math.sin(phase) * 18;
          const delay = `${i * 0.15}s`;

          return (
            <g key={i} className="dna-group" style={{ animationDelay: delay }}>
              <line
                x1={xLeft}
                y1={y}
                x2={xRight}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx={xLeft} cy={y} r="5" fill={colors[i].left}>
                <animate
                  attributeName="cx"
                  values={`${xLeft};${30 + Math.sin(phase + Math.PI) * 18};${xLeft}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="5;6.5;5"
                  dur="2s"
                  begin={delay}
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={xRight} cy={y} r="5" fill={colors[i].right}>
                <animate
                  attributeName="cx"
                  values={`${xRight};${90 - Math.sin(phase + Math.PI) * 18};${xRight}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="5;6.5;5"
                  dur="2s"
                  begin={delay}
                  repeatCount="indefinite"
                />
              </circle>
              <line
                x1={xLeft}
                y1={y}
                x2={xRight}
                y2={y}
                stroke="#D1D5DB"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              >
                <animate
                  attributeName="x1"
                  values={`${xLeft};${30 + Math.sin(phase + Math.PI) * 18};${xLeft}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  values={`${xRight};${90 - Math.sin(phase + Math.PI) * 18};${xRight}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </line>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
