'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const generateStars = (count: number, seed: string): Star[] => {
  const stars: Star[] = [];
  // Simple pseudo-random generator based on seed
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s << 5) - s + seed.charCodeAt(i);
    s |= 0;
  }

  const random = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: random() * 100,
      y: random() * 100,
      size: random() * 2 + 0.5,
      opacity: random() * 0.7 + 0.3,
    });
  }
  return stars;
};

export default function StarfieldParallax() {
  const { scrollY } = useScroll();
  
  // Three layers with different speeds
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -600]);

  const layer1Stars = useMemo(() => generateStars(50, 'layer1'), []);
  const layer2Stars = useMemo(() => generateStars(30, 'layer2'), []);
  const layer3Stars = useMemo(() => generateStars(20, 'layer3'), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* Layer 1 - Slowest (Distant) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {layer1Stars.map((star) => (
          <motion.div
            key={`l1-${star.id}`}
            animate={{ opacity: [star.opacity * 0.2, star.opacity * 0.4, star.opacity * 0.2] }}
            transition={{ duration: 3 + (star.id % 5) * 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 0.5}px`,
              height: `${star.size * 0.5}px`,
              boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.2)`,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2 - Medium */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {layer2Stars.map((star) => (
          <motion.div
            key={`l2-${star.id}`}
            animate={{ opacity: [star.opacity * 0.3, star.opacity * 0.6, star.opacity * 0.3] }}
            transition={{ duration: 2 + (star.id % 4) * 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.3)`,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3 - Fastest (Closest) */}
      <motion.div style={{ y: y3 }} className="absolute inset-0">
        {layer3Stars.map((star) => (
          <motion.div
            key={`l3-${star.id}`}
            animate={{ opacity: [star.opacity * 0.5, star.opacity * 1, star.opacity * 0.5] }}
            transition={{ duration: 1.5 + (star.id % 3) * 0.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size * 1.5}px`,
              height: `${star.size * 1.5}px`,
              boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.4)`,
            }}
          />
        ))}
      </motion.div>

      {/* Subtle Gradient Overlay to fade out stars at the bottom of the header */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-1/80" />
    </div>
  );
}
