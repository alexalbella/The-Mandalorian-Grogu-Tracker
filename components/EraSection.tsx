'use client';

import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { Era } from '@/data/starwars-list';
import { useUIStore } from '@/store/ui';
import MediaItemCard from './MediaItemCard';

export default function EraSection({
  era,
  index,
  isCompleted,
  toggleItem,
  markMultiple,
  unmarkMultiple,
}: {
  era: Era;
  index: number;
  isCompleted: (id: string) => boolean;
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
}) {
  const { expandedEras, toggleEraExpanded, reducedMotion, focusMode } = useUIStore();

  const isExpanded = expandedEras[era.id] !== false;

  const eraItemIds     = era.items.flatMap(i => i.subItems ? i.subItems.map(s => s.id) : [i.id]);
  const eraTotalCount  = eraItemIds.length;
  const eraWatchedCount = eraItemIds.filter(id => isCompleted(id)).length;
  const isEraCompleted  = eraWatchedCount === eraTotalCount && eraTotalCount > 0;
  const isPartiallyCompleted = eraWatchedCount > 0 && !isEraCompleted;
  const progressPct    = eraTotalCount > 0 ? Math.round((eraWatchedCount / eraTotalCount) * 100) : 0;

  const isDimmed = focusMode && isEraCompleted;

  const handleToggleAll = () => {
    if (isEraCompleted) unmarkMultiple(eraItemIds);
    else markMultiple(eraItemIds);
  };

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4 }}
      className={`relative pt-14 md:pt-16 transition-all duration-500 ${isDimmed ? 'opacity-25 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}
    >
      {/* Section divider */}
      {index > 0 && (
        <div className="absolute top-0 left-0 w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-surface-4/60 to-transparent" />
          <div className="h-px mt-px bg-gradient-to-r from-transparent via-glow-success/10 to-transparent blur-sm" />
        </div>
      )}

      {/* Vertical timeline rail */}
      <div className="absolute left-5 top-32 bottom-[-4rem] w-px bg-gradient-to-b from-surface-4/60 via-surface-4/30 to-transparent hidden md:block" />

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">

        {/* ── Era Header (left column) ── */}
        <div className="md:w-[28%] shrink-0 relative z-10">
          <div className="sticky top-6 space-y-5 py-2">

            {/* Large ghost era number (editorial outline treatment) */}
            <div className="relative select-none pointer-events-none h-16">
              <span
                className="absolute -top-2 left-0 font-display font-bold leading-none"
                style={{
                  fontSize: 'clamp(4rem, 8vw, 6rem)',
                  WebkitTextStroke: `1px color-mix(in srgb, var(--color-glow-success) ${isEraCompleted ? 35 : 18}%, transparent)`,
                  color: 'transparent',
                  transition: 'all 0.4s',
                }}
              >
                {String(era.eraNumber).padStart(2, '0')}
              </span>
            </div>

            {/* Classification label */}
            <div className="space-y-1 pl-1">
              <span className="block font-mono text-[9px] tracking-[0.3em] text-text-muted uppercase">
                {`// ERA-${String(era.eraNumber).padStart(2, '0')}`}
              </span>
              <h2
                className={`font-display font-semibold uppercase tracking-wider leading-tight transition-colors ${
                  isEraCompleted ? 'text-glow-success' : 'text-text-heading'
                }`}
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}
              >
                {era.eraLabel}
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm text-text-muted leading-relaxed pl-1">
              {era.description}
            </p>

            {/* Progress bar + counters */}
            <div className="pl-1 space-y-2">
              {/* Thin progress bar */}
              <div className="h-[2px] bg-surface-4/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-glow-success/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-text-muted">
                    <span className={`${isEraCompleted ? 'text-glow-success' : 'text-text-body'} font-bold`}>
                      {eraWatchedCount}
                    </span>
                    /{eraTotalCount}
                    <span className="ml-1 text-text-muted">vistos</span>
                  </span>
                  <span className="font-mono text-[9px] text-text-muted tabular-nums">
                    ({progressPct}%)
                  </span>
                </div>

                {/* Era action buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleToggleAll}
                    className="p-1.5 rounded border border-surface-4/60 text-text-muted hover:text-text-body hover:bg-surface-3/60 hover:border-surface-4 transition-colors"
                    title={isEraCompleted ? 'Desmarcar toda la era' : 'Marcar toda la era'}
                    aria-label={isEraCompleted ? 'Desmarcar toda la era' : 'Marcar toda la era'}
                  >
                    {isEraCompleted
                      ? <CheckSquare className="w-3.5 h-3.5 text-glow-success" />
                      : isPartiallyCompleted
                      ? <Square className="w-3.5 h-3.5 text-glow-success/50" fill="currentColor" />
                      : <Square className="w-3.5 h-3.5" />
                    }
                  </button>

                  <button
                    onClick={() => toggleEraExpanded(era.id)}
                    className="p-1.5 rounded border border-surface-4/60 text-text-muted hover:text-text-body hover:bg-surface-3/60 hover:border-surface-4 transition-colors md:hidden"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Colapsar era' : 'Expandir era'}
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Items list (right column) ── */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={reducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ staggerChildren: reducedMotion ? 0 : 0.05, delayChildren: 0.05 }}
              className="flex-1 space-y-2.5 md:pl-6 overflow-hidden"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-[5.5rem] w-3 h-3 rounded-full border-2 border-glow-success/40 bg-surface-1 hidden md:block"
                style={{ boxShadow: isEraCompleted ? '0 0 8px var(--color-glow-success)' : 'none' }}
              />

              <AnimatePresence mode="popLayout">
                {era.items.map(item => (
                  <MediaItemCard
                    key={item.id}
                    item={item}
                    isCompleted={isCompleted}
                    toggleItem={toggleItem}
                    markMultiple={markMultiple}
                    unmarkMultiple={unmarkMultiple}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
