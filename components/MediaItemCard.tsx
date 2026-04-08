'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Tv, Info } from 'lucide-react';
import { MediaItem } from '@/data/starwars-list';
import Image from 'next/image';
import { useUIStore } from '@/store/ui';
import { getImageUrl, getFallbackImage } from '@/lib/imageMap';

const routeNames: Record<string, string> = {
  'mandalore':      'Mandalore',
  'thrawn':         'Thrawn',
  'new-republic':   'Nueva Rep.',
  'hutt':           'Hutt',
  'bounty-hunters': 'Cazarrecomp.',
  'empire':         'Imperio',
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
  const selectedCard       = useUIStore(state => state.selectedCard);
  const selectedRoute      = useUIStore(state => state.selectedRoute);
  const addRecentlyTouched = useUIStore(state => state.addRecentlyTouched);
  const compactMode        = useUIStore(state => state.compactMode);
  const reducedMotion      = useUIStore(state => state.reducedMotion);
  const focusMode          = useUIStore(state => state.focusMode);

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

  // Left accent bar color
  const accentClass = isWatched
    ? 'bg-glow-success'
    : item.essential
    ? 'bg-glow-warning/70'
    : isPartiallyWatched
    ? 'bg-glow-success/40'
    : 'bg-surface-4/60 group-hover:bg-surface-4';

  return (
    <motion.div
      id={item.id}
      layoutId={reducedMotion || disableLayoutId ? undefined : item.id}
      layout={!reducedMotion}
      animate={reducedMotion ? {} : {
        scale: isSelected ? 1.01 : 1,
        boxShadow: isSelected
          ? '0 0 0 1px var(--color-glow-success), 0 0 16px color-mix(in srgb, var(--color-glow-success) 20%, transparent)'
          : '0 0 0 0px transparent',
      }}
      transition={{ duration: 0.25 }}
      className={[
        'group relative cursor-pointer overflow-hidden block',
        'rounded-sm border transition-colors',
        'focus-within:ring-1 focus-within:ring-glow-success focus-within:ring-offset-1 focus-within:ring-offset-surface-1',
        compactMode ? 'p-2 pl-4' : 'p-4 pl-5',
        isWatched
          ? 'bg-surface-2/60 border-surface-4/40'
          : 'bg-surface-2/30 border-surface-4/40 hover:bg-surface-2/60 hover:border-surface-4/70',
        isRouteSelected ? 'ring-1 ring-glow-success/30 ring-offset-1 ring-offset-surface-1' : '',
        isDimmed ? 'opacity-25 grayscale hover:opacity-100 hover:grayscale-0' : '',
      ].join(' ')}
      onClick={handleToggle}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300 ${accentClass}`} />

      <input
        type="checkbox"
        className="sr-only"
        checked={isWatched}
        onChange={handleToggle}
        aria-label={`Marcar ${item.title} como visto`}
        onClick={e => e.stopPropagation()}
      />

      <div className={`flex ${compactMode ? 'gap-2 items-center' : 'gap-4'}`}>
        {/* Poster */}
        {!compactMode && (
          <motion.div
            layoutId={reducedMotion || disableLayoutId ? undefined : `poster-${item.id}`}
            className="relative w-[4.5rem] sm:w-24 aspect-[2/3] rounded-sm overflow-hidden shrink-0 border border-surface-4/30 bg-surface-3"
          >
            <Image
              src={imgSrc}
              alt={`Poster de ${item.title}`}
              fill
              className={[
                item.subItems && item.subItems.length > 0 ? 'object-contain' : 'object-cover',
                'transition-all duration-500',
                isWatched ? 'opacity-30 grayscale' : 'group-hover:scale-105',
              ].join(' ')}
              sizes="(max-width: 640px) 72px, 96px"
              referrerPolicy="no-referrer"
              onError={() => setImgSrc(getFallbackImage(item.title))}
              unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com') || imgSrc.includes('tmdb.org')}
            />
            {/* "VISTO" seal stamp */}
            {isWatched && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface-1/50">
                <div className="-rotate-[15deg] border-2 border-glow-success/60 rounded-sm px-1.5 py-0.5">
                  <span className="font-mono text-[8px] font-bold tracking-[0.3em] text-glow-success">VISTO</span>
                </div>
              </div>
            )}
            {/* Partial progress bar */}
            {isPartiallyWatched && item.subItems && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-surface-4/60">
                <div
                  className="h-full bg-glow-success/70 transition-all duration-500"
                  style={{ width: `${(item.subItems.filter(s => isCompleted(s.id)).length / item.subItems.length) * 100}%` }}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className={`flex items-start justify-between gap-2 ${compactMode ? 'items-center' : ''}`}>
            <div className="flex items-start gap-2.5 min-w-0">
              {/* Type label */}
              <span className={[
                'shrink-0 font-mono text-[8px] tracking-[0.2em] uppercase text-text-muted hidden sm:inline',
                compactMode ? 'mt-0.5' : 'mt-1.5',
              ].join(' ')}>
                {item.type === 'movie'
                  ? <><Film className="inline w-2.5 h-2.5 mr-0.5 -mt-px" />Film</>
                  : <><Tv className="inline w-2.5 h-2.5 mr-0.5 -mt-px" />Serie</>
                }
              </span>

              {/* Title */}
              <motion.h4
                layoutId={reducedMotion || disableLayoutId ? undefined : `title-${item.id}`}
                className={[
                  'font-display font-semibold leading-tight transition-colors',
                  compactMode ? 'text-base' : 'text-lg sm:text-xl',
                  isWatched ? 'text-text-muted line-through decoration-surface-4/60' : 'text-text-heading',
                ].join(' ')}
              >
                {item.title}
              </motion.h4>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={e => {
                  e.stopPropagation();
                  useUIStore.getState().setSelectedCard(item.id);
                  useUIStore.getState().setQuickLookOpen(true);
                }}
                className="p-1 rounded-sm text-text-muted hover:text-text-body transition-colors"
                title="Ver detalles"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-[9px] text-text-muted tabular-nums">
                {item.duration}m
              </span>

              {item.essential && (
                <motion.span
                  layoutId={reducedMotion || disableLayoutId ? undefined : `essential-${item.id}`}
                  className="hidden sm:inline font-mono text-[8px] tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm border border-glow-warning/30 bg-glow-warning/[0.06] text-glow-warning"
                >
                  Esencial
                </motion.span>
              )}

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

          {/* Context */}
          {!compactMode && (
            <p className={`text-sm leading-relaxed transition-colors ${isWatched ? 'text-text-muted/50' : 'text-text-body'}`}>
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
                  className="font-mono text-[8px] tracking-[0.1em] text-text-muted border border-surface-4/50 px-1.5 py-0.5 rounded-sm"
                >
                  {routeNames[tag] ?? tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Sub-items */}
          {item.subItems && item.subItems.length > 0 && (
            <div
              className={`border-t border-surface-4/30 mt-2 ${compactMode ? 'pt-1.5 space-y-1' : 'pt-3 space-y-1'}`}
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
                        ? 'bg-glow-success/[0.06]'
                        : 'hover:bg-surface-3/40',
                    ].join(' ')}
                    onClick={e => {
                      e.stopPropagation();
                      toggleItem(sub.id);
                      addRecentlyTouched(sub.id);
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={[
                        'font-mono text-[8px] tracking-wider shrink-0 w-8 text-right',
                        isSubWatched ? 'text-glow-success/50' : 'text-surface-4',
                      ].join(' ')}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-xs truncate ${isSubWatched ? 'text-text-muted line-through' : 'text-text-body'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] text-text-muted tabular-nums shrink-0 ml-2">{sub.duration}m</span>
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
