'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SeriesConfig } from '@/types/series';
import { useUIStore } from '@/store/ui';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export default function HeroParallax({ config }: { config: SeriesConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useUIStore((state) => state.reducedMotion);
  const { progressPercent, remainingMinutes } = useDashboardStats(config.eras);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const titleY       = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const titleScale   = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const bottomOverlayOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);

  const isMaul = config.theme === 'maul';
  const accentRgb = isMaul ? '196, 75, 63' : '201, 168, 76';
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins  = remainingMinutes % 60;

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden select-none"
      aria-label="Hero de portada de expediente"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-surface-1" />

      {/* Ambient glow — dim, warm */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 35%, rgba(${accentRgb}, 0.06) 0%, transparent 65%)`,
        }}
      />

      {/* ── Dossier cover centred content ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6 text-center"
        style={reducedMotion ? {} : { y: titleY, opacity: titleOpacity, scale: titleScale }}
        initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
      >
        {/* Classification eyebrow */}
        <motion.p
          className="text-[9px] uppercase tracking-[0.5em] text-text-muted font-mono mb-6"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          ARCHIVO CLASIFICADO · SAGA GALÁCTICA
        </motion.p>

        {/* Thin top rule */}
        <motion.div
          className="w-16 h-px mb-8"
          style={{ background: `rgba(${accentRgb}, 0.5)` }}
          initial={reducedMotion ? {} : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />

        {/* Title — large serif */}
        <h1 className="font-display leading-none mb-2">
          <motion.span
            className="block text-text-heading font-semibold"
            style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
          >
            {config.title}
          </motion.span>
          <motion.span
            className="block font-normal italic"
            style={{
              fontSize: 'clamp(1.8rem, 6vw, 5rem)',
              color: `rgba(${accentRgb}, 0.9)`,
            }}
            initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
          >
            {config.subtitle}
          </motion.span>
        </h1>

        {/* Quote */}
        <motion.p
          className="mt-8 text-text-muted text-sm max-w-xs font-mono italic leading-relaxed opacity-70"
          initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
        >
          &ldquo;{config.quote}&rdquo;
        </motion.p>

        {/* Progress stats readout */}
        <motion.div
          className="mt-10 flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-text-muted"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <span style={{ color: `rgba(${accentRgb}, 0.8)` }}>
            {Math.round(progressPercent)}% completado
          </span>
          <span className="w-px h-3 bg-surface-4" />
          <span>
            {remainingHours > 0 ? `${remainingHours}h ${remainingMins}m` : `${remainingMins}m`} restante
          </span>
        </motion.div>

        {/* Bottom rule */}
        <motion.div
          className="w-16 h-px mt-8"
          style={{ background: `rgba(${accentRgb}, 0.5)` }}
          initial={reducedMotion ? {} : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        style={reducedMotion ? {} : { opacity: scrollHintOpacity }}
        initial={reducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-text-muted font-mono">
          Scroll
        </span>
        <motion.div
          className="w-px h-6 rounded-full"
          style={{
            background: `linear-gradient(to bottom, rgba(${accentRgb}, 0.7), transparent)`,
            originY: 0,
          }}
          animate={reducedMotion ? {} : { scaleY: [0, 1, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
      </motion.div>

      {/* Scroll-driven bottom overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={reducedMotion ? {} : { opacity: bottomOverlayOpacity }}
      >
        <div className="h-full bg-gradient-to-t from-surface-1 to-transparent" />
      </motion.div>

      {/* Always-on bottom blend */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none bg-gradient-to-t from-surface-1 via-surface-1/30 to-transparent" />
    </div>
  );
}
