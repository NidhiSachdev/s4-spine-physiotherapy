"use client";

import { useEffect, useState } from "react";

export default function Confetti() {
  const [particles, setParticles] = useState<Array<{id: number; x: number; color: string; delay: number; duration: number}>>([]);

  useEffect(() => {
    const colors = ["#E8782A", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
