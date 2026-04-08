'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { Film, Tv, Info } from 'lucide-react';
import { MediaItem } from '@/data/starwars-list';
import Image from 'next/image';
import { useUIStore } from '@/store/ui';
import { getImageUrl, getFallbackImage } from '@/lib/imageMap';

/** Short route codes for the tactical tag display */
const routeCodes: Record<string, string> = {
  'mandalore':       'MND',
  'thrawn':          'THR',
  'new-republic':    'NRP',
  'hutt':            'HTT',
  'bounty-hunters':  'BHG',
  'empire':          'IMP',
};

export default function MediaItemCard({
  item,
  isCompleted,
  toggleItem,
  markMultiple,
  unmarkMultiple,
  disableLayoutId = false,
}: {
  item: MediaItem;
  isCompleted: (id: string) => boolean;
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
  disableLayoutId?: boolean;
}) {
  const selectedCard     = useUIStore(state => state.selectedCard);
  const selectedRoute    = useUIStore(state => state.selectedRoute);
  const addRecentlyTouched = useUIStore(state => state.addRecentlyTouched);
  const compactMode      = useUIStore(state => state.compactMode);
  const reducedMotion    = useUIStore(state => state.reducedMotion);
  const focusMode        = useUIStore(state => state.focusMode);

  const isSelected = selectedCard === item.id;
  const isRouteSelected = selectedRoute ? item.tags.includes(selectedRoute) : false;

  const isWatched = item.subItems
    ? item.subItems.every(sub => isCompleted(sub.id)) && item.subItems.length > 0
    : isCompleted(item.id);

  const isPartiallyWatched = item.subItems
    ? item.subItems.some(sub => isCompleted(sub.id)) && !isWatched
    : false;

  const isDimmed = focusMode && isWatched;

  const handleToggle = () => {
    addRecentlyTouched(item.id);
    if (item.subItems) {
      if (isWatched) unmarkMultiple(item.subItems.map(s => s.id));
      else markMultiple(item.subItems.map(s => s.id));
    } else {
      toggleItem(item.id);
    }
  };

  const [imgSrc, setImgSrc] = useState(getImageUrl(item.id, item.title));

  // 3-D tilt / glare
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['4deg', '-4deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-4deg', '4deg']);
  const glareX  = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY  = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const background = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.07) 0%, transparent 55%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect   = ref.current.getBoundingClientRect();
    const xPct   = (e.clientX - rect.left)  / rect.width  - 0.5;
    const yPct   = (e.clientY - rect.top)   / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  // Accent bar color
  const accentClass = isWatched
    ? 'bg-glow-success'
    : item.essential
    ? 'bg-glow-warning/70'
    : isPartiallyWatched
    ? 'bg-glow-success/40'
    : 'bg-surface-4 group-hover:bg-surface-4/60';

  // Corner bracket color
  const bracketColor = isWatched
    ? 'rgba(52,211,153,0.35)'
    : isSelected
    ? 'rgba(52,211,153,0.6)'
    : 'rgba(255,255,255,0.1)';

  return (
    <motion.div
      id={item.id}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      layoutId={reducedMotion || disableLayoutId ? undefined : item.id}
      layout={!reducedMotion}
      animate={reducedMotion ? {} : {
        scale: isSelected ? 1.015 : 1,
        boxShadow: isSelected
          ? '0 0 0 1px var(--color-glow-success), 0 0 24px color-mix(in srgb, var(--color-glow-success) 30%, transparent)'
          : '0 0 0 0px transparent',
      }}
      style={reducedMotion ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      transition={{ duration: 0.25 }}
      className={[
        'group relative cursor-pointer overflow-hidden block',
        'rounded border transition-colors',
        'focus-within:ring-1 focus-within:ring-glow-success focus-within:ring-offset-1 focus-within:ring-offset-surface-1',
        compactMode ? 'p-2 pl-4' : 'p-4 pl-5',
        isWatched
          ? 'bg-glow-success/[0.04] border-glow-success/20 hover:border-glow-success/35'
          : 'bg-surface-2/40 border-surface-4/50 hover:bg-surface-2/70 hover:border-surface-4',
        isRouteSelected ? 'ring-1 ring-white/20 ring-offset-1 ring-offset-surface-1' : '',
        isDimmed ? 'opacity-25 grayscale hover:opacity-100 hover:grayscale-0' : '',
      ].join(' ')}
      onClick={handleToggle}
    >
      {/* ── Left classification bar ── */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${accentClass}`} />

      {/* ── Corner brackets ── */}
      <div className="corner-tl" style={{ borderColor: bracketColor }} />
      <div className="corner-tr" style={{ borderColor: bracketColor }} />
      <div className="corner-bl" style={{ borderColor: bracketColor }} />
      <div className="corner-br" style={{ borderColor: bracketColor }} />

      {/* ── Glare overlay (3-D tilt) ── */}
      {!reducedMotion && (
        <motion.div style={{ background }} className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay" />
      )}

      {/* ── Scanline sweep on hover ── */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
          <div className="card-scanline" />
        </div>
      )}

      <input
        type="checkbox"
        className="sr-only"
        checked={isWatched}
        onChange={handleToggle}
        aria-label={`Marcar ${item.title} como visto`}
        onClick={e => e.stopPropagation()}
      />

      {/* ── Card body ── */}
      <div
        className={`flex ${compactMode ? 'gap-2 items-center' : 'gap-4'}`}
        style={reducedMotion ? {} : { transform: 'translateZ(16px)' }}
      >
        {/* Poster */}
        {!compactMode && (
          <motion.div
            layoutId={reducedMotion || disableLayoutId ? undefined : `poster-${item.id}`}
            className="relative w-[4.5rem] sm:w-24 aspect-[2/3] rounded-sm overflow-hidden shrink-0 border border-white/[0.06] bg-surface-3"
          >
            <Image
              src={imgSrc}
              alt={`Poster de ${item.title}`}
              fill
              className={[
                item.subItems && item.subItems.length > 0 ? 'object-contain' : 'object-cover',
                'transition-all duration-500',
                isWatched ? 'opacity-35 grayscale' : 'group-hover:scale-105',
              ].join(' ')}
              sizes="(max-width: 640px) 72px, 96px"
              referrerPolicy="no-referrer"
              onError={() => setImgSrc(getFallbackImage(item.title))}
              unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com') || imgSrc.includes('tmdb.org')}
            />
            {/* "VISTO" stamp */}
            {isWatched && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                <div className="-rotate-[18deg] border border-glow-success/60 px-1.5 py-0.5">
                  <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-glow-success">VISTO</span>
                </div>
              </div>
            )}
            {/* Partial progress bar */}
            {isPartiallyWatched && item.subItems && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-surface-4/60">
                <div
                  className="h-full bg-glow-success/70 transition-all duration-500"
                  style={{ width: `${(item.subItems.filter(s => isCompleted(s.id)).length / item.subItems.length) * 100}%` }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Content */}
        <div className={`flex-1 min-w-0 space-y-2 ${compactMode ? '' : ''}`}>

          {/* Header row */}
          <div className={`flex items-start justify-between gap-2 ${compactMode ? 'items-center' : ''}`}>
            <div className="flex items-start gap-2.5 min-w-0">
              {/* Type classification code */}
              <span className={[
                'shrink-0 font-mono text-[9px] tracking-[0.12em] border border-surface-4/70 px-1 py-0.5 rounded-sm hidden sm:inline transition-colors',
                compactMode ? 'mt-0' : 'mt-1',
                isWatched ? 'text-text-muted border-surface-4/40' : 'text-text-muted group-hover:text-text-body group-hover:border-surface-4',
              ].join(' ')}>
                {item.type === 'movie'
                  ? <><Film className="inline w-2.5 h-2.5 mr-0.5 -mt-px" />FILM</>
                  : <><Tv className="inline w-2.5 h-2.5 mr-0.5 -mt-px" />SERIE</>
                }
              </span>

              {/* Title */}
              <motion.h4
                layoutId={reducedMotion || disableLayoutId ? undefined : `title-${item.id}`}
                className={[
                  'font-display font-semibold tracking-wide leading-tight transition-colors',
                  compactMode ? 'text-[15px]' : 'text-[17px] sm:text-[18px]',
                  isWatched ? 'text-text-muted line-through decoration-surface-4' : 'text-text-heading',
                ].join(' ')}
              >
                {item.title}
              </motion.h4>
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={e => {
                  e.stopPropagation();
                  useUIStore.getState().setSelectedCard(item.id);
                  useUIStore.getState().setQuickLookOpen(true);
                }}
                className="p-1 rounded text-text-muted hover:text-text-body hover:bg-surface-3/60 transition-colors"
                title="Ver detalles"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {/* Duration */}
              <span className="font-mono text-[10px] text-text-muted bg-black/30 px-1.5 py-0.5 rounded-sm border border-white/[0.05] tabular-nums">
                {item.duration}m
              </span>

              {/* Essential badge */}
              {item.essential && (
                <motion.span
                  layoutId={reducedMotion || disableLayoutId ? undefined : `essential-${item.id}`}
                  className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm border border-glow-warning/30 bg-glow-warning/[0.07] text-glow-warning"
                >
                  ★ ESENCIAL
                </motion.span>
              )}

              {/* Compact mode check indicator */}
              {compactMode && (
                <div className={[
                  'w-4 h-4 rounded-sm border flex items-center justify-center transition-colors shrink-0',
                  isWatched ? 'bg-glow-success/20 border-glow-success/50' : 'border-surface-4',
                ].join(' ')}>
                  {isWatched && <div className="w-2 h-2 rounded-sm bg-glow-success" />}
                  {isPartiallyWatched && <div className="w-2 h-2 rounded-sm bg-glow-success/40" />}
                </div>
              )}
            </div>
          </div>

          {/* Context text */}
          {!compactMode && (
            <p className={`text-sm leading-relaxed transition-colors ${isWatched ? 'text-surface-4' : 'text-text-body'}`}>
              <span className="font-mono text-[9px] text-text-muted tracking-widest mr-2 align-middle">{'// CONTEXTO'}</span>
              {item.reason}
            </p>
          )}

          {/* Route tags */}
          {!compactMode && item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {item.tags.map(tag => (
                <motion.span
                  key={tag}
                  layoutId={reducedMotion || disableLayoutId ? undefined : `tag-${item.id}-${tag}`}
                  className="font-mono text-[9px] tracking-[0.15em] text-text-muted border border-surface-4/60 px-1.5 py-0.5 rounded-sm hover:border-surface-4 hover:text-text-body transition-colors"
                >
                  ·{routeCodes[tag] ?? tag.toUpperCase().slice(0, 3)}
                </motion.span>
              ))}
            </div>
          )}

          {/* Sub-items (episodes) */}
          {item.subItems && item.subItems.length > 0 && (
            <div
              className={`border-t border-white/[0.05] mt-2 ${compactMode ? 'pt-1.5 space-y-1' : 'pt-3 space-y-1.5'}`}
              onClick={e => e.stopPropagation()}
            >
              {item.subItems.map((sub, idx) => {
                const isSubWatched = isCompleted(sub.id);
                return (
                  <div
                    key={sub.id}
                    id={sub.id}
                    className={[
                      'flex items-center justify-between rounded-sm px-2 py-1.5 cursor-pointer transition-colors',
                      isSubWatched
                        ? 'bg-glow-success/10 hover:bg-glow-success/20'
                        : 'bg-white/[0.03] hover:bg-white/[0.06]',
                    ].join(' ')}
                    onClick={e => {
                      e.stopPropagation();
                      toggleItem(sub.id);
                      addRecentlyTouched(sub.id);
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={[
                        'font-mono text-[9px] tracking-wider shrink-0 w-10 text-right',
                        isSubWatched ? 'text-glow-success/60' : 'text-surface-4',
                      ].join(' ')}>
                        EP{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-xs truncate ${isSubWatched ? 'text-text-muted line-through' : 'text-text-body'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-text-muted tabular-nums shrink-0 ml-2">{sub.duration}m</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
