'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { SeriesConfig } from '@/types/series';
import { useUIStore } from '@/store/ui';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const generateStars = (count: number, seed: string): Star[] => {
  const stars: Star[] = [];
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
      y: random() * 120 - 10,
      size: random() * 2.5 + 0.5,
      opacity: random() * 0.6 + 0.3,
    });
  }
  return stars;
};

// Radial hyperspace streak lines that burst from center
function HyperspaceStreaks() {
  const streaks = useMemo(() =>
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      angle: (i / 48) * 360,
      length: 20 + ((i * 37) % 40),
      delay: ((i * 13) % 30) / 100,
      duration: 0.35 + ((i * 7) % 20) / 100,
    })),
    []
  );

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {streaks.map((streak) => (
        <motion.div
          key={streak.id}
          className="absolute"
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent, rgba(255,255,255,0.85), transparent)',
            width: `${streak.length}vw`,
            rotate: `${streak.angle}deg`,
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: streak.duration,
            delay: streak.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export default function HeroParallax({ config }: { config: SeriesConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((state) => state.reducedMotion);
  // Skip hyperspace entirely if user prefers reduced motion
  const [showHyperspace, setShowHyperspace] = useState(!reducedMotion);

  const isMaul = config.theme === 'maul';
  const accentColor = isMaul ? 'rgba(239,68,68,' : 'rgba(52,211,153,';

  // Remove hyperspace overlay after animation completes
  useEffect(() => {
    if (!showHyperspace) return;
    const timer = setTimeout(() => setShowHyperspace(false), 1600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll progress for parallax (tracks hero element leaving viewport)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax Y offsets per layer (px)
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, -260]);

  // Title floats up faster than background (feels weightless)
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const titleScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.88]);

  // Scroll indicator fades out early
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Bottom overlay grows as hero exits
  const bottomOverlayOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);

  const layer1Stars = useMemo(() => generateStars(80, 'hero-l1'), []);
  const layer2Stars = useMemo(() => generateStars(50, 'hero-l2'), []);
  const layer3Stars = useMemo(() => generateStars(28, 'hero-l3'), []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden select-none"
      aria-label="Hero cinematográfico"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-surface-1" />

      {/* Ambient radial glow (theme-aware) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 40%, ${accentColor}0.07) 0%, transparent 65%)`,
        }}
      />

      {/* ── Starfield Layer 1 – distant/slowest ── */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 2.8, filter: 'blur(5px) brightness(4)' }}
        animate={{ scale: 1, filter: 'blur(0px) brightness(1)' }}
        transition={{ duration: 1.3, ease: 'easeOut', delay: 0.1 }}
        className="absolute inset-0"
      >
        <motion.div style={{ y: layer1Y }} className="absolute inset-0">
          {layer1Stars.map((star) => (
            <motion.div
              key={`hl1-${star.id}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * 0.55}px`,
                height: `${star.size * 0.55}px`,
                opacity: star.opacity * 0.45,
              }}
              animate={{
                opacity: [star.opacity * 0.15, star.opacity * 0.45, star.opacity * 0.15],
              }}
              transition={{
                duration: 3 + (star.id % 5),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Starfield Layer 2 – medium ── */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 2.8, filter: 'blur(3px) brightness(3)' }}
        animate={{ scale: 1, filter: 'blur(0px) brightness(1)' }}
        transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
        className="absolute inset-0"
      >
        <motion.div style={{ y: layer2Y }} className="absolute inset-0">
          {layer2Stars.map((star) => (
            <motion.div
              key={`hl2-${star.id}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity * 0.65,
                boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.25)`,
              }}
              animate={{
                opacity: [star.opacity * 0.25, star.opacity * 0.65, star.opacity * 0.25],
              }}
              transition={{
                duration: 2 + (star.id % 4) * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Starfield Layer 3 – close/fastest ── */}
      <motion.div
        initial={reducedMotion ? {} : { scale: 2.8, filter: 'blur(1px) brightness(4)' }}
        animate={{ scale: 1, filter: 'blur(0px) brightness(1)' }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.05 }}
        className="absolute inset-0"
      >
        <motion.div style={{ y: layer3Y }} className="absolute inset-0">
          {layer3Stars.map((star) => (
            <motion.div
              key={`hl3-${star.id}`}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * 1.4}px`,
                height: `${star.size * 1.4}px`,
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 3.5}px rgba(255,255,255,0.45)`,
              }}
              animate={{
                opacity: [star.opacity * 0.45, star.opacity, star.opacity * 0.45],
              }}
              transition={{
                duration: 1.5 + (star.id % 3) * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* ── Hyperspace entry animation (AnimatePresence) ── */}
      <AnimatePresence>
        {showHyperspace && !reducedMotion && (
          <motion.div
            key="hyperspace-overlay"
            className="absolute inset-0 z-30 pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* White flash on entry */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            />

            {/* Radial burst glow */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <div
                className="w-0 h-0 rounded-full"
                style={{
                  boxShadow: `0 0 0 ${isMaul ? '280px rgba(239,68,68,0.25)' : '280px rgba(52,211,153,0.18)'}, 0 0 0 120px rgba(255,255,255,0.12)`,
                }}
              />
            </motion.div>

            {/* Streak lines */}
            <HyperspaceStreaks />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Title – floating with scroll parallax ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center"
        style={{ y: titleY, opacity: titleOpacity, scale: titleScale }}
        initial={reducedMotion ? {} : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.85, ease: 'easeOut' }}
      >
        {/* Eyebrow */}
        <motion.p
          className="text-[10px] uppercase tracking-[0.45em] text-text-muted font-bold mb-8 font-mono"
          initial={reducedMotion ? {} : { opacity: 0, letterSpacing: '0.7em' }}
          animate={{ opacity: 1, letterSpacing: '0.45em' }}
          transition={{ duration: 1.4, delay: 1.1 }}
        >
          Star Wars · Rastreador de Saga
        </motion.p>

        {/* Main title */}
        <h1
          className="font-black tracking-tighter leading-[0.9] mb-0"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <motion.span
            className="block text-text-heading text-5xl sm:text-7xl md:text-8xl lg:text-[7rem]"
            initial={reducedMotion ? {} : { opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.9, ease: 'easeOut' }}
          >
            {config.title}
          </motion.span>
          <motion.span
            className="block text-glow-success text-5xl sm:text-7xl md:text-8xl lg:text-[7rem]"
            style={{
              textShadow: `0 0 80px ${accentColor}0.6), 0 0 160px ${accentColor}0.25)`,
            }}
            initial={reducedMotion ? {} : { opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 1.1, ease: 'easeOut' }}
          >
            {config.subtitle}
          </motion.span>
        </h1>

        {/* Quote */}
        <motion.p
          className="mt-10 text-text-muted text-sm sm:text-base max-w-sm font-mono italic leading-relaxed"
          initial={reducedMotion ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
        >
          &ldquo;{config.quote}&rdquo;
        </motion.p>

        {/* Decorative separator */}
        <motion.div
          className="mt-10 flex items-center gap-3"
          initial={reducedMotion ? {} : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 1.5, ease: 'easeOut' }}
        >
          <div
            className="h-px w-20 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${accentColor}0.6))`,
            }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-glow-success"
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="h-px w-20 rounded-full"
            style={{
              background: `linear-gradient(to left, transparent, ${accentColor}0.6))`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={{ opacity: scrollHintOpacity }}
        initial={reducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-text-muted font-mono">
          Scroll
        </span>
        <motion.div
          className="w-px h-7 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${accentColor}0.8), transparent)`,
            originY: 0,
          }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
      </motion.div>

      {/* ── Scroll-driven bottom overlay (fades in as hero exits) ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ opacity: bottomOverlayOpacity }}
      >
        <div className="h-full bg-gradient-to-t from-surface-1 to-transparent" />
      </motion.div>

      {/* Always-on bottom gradient for smooth blend */}
      <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none bg-gradient-to-t from-surface-1 via-surface-1/20 to-transparent" />
    </div>
  );
}
