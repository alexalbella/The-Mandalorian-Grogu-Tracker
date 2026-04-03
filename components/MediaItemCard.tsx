import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { CheckCircle2, Circle, Film, Tv, Info } from 'lucide-react';
import { MediaItem } from '@/data/starwars-list';
import Image from 'next/image';
import { useUIStore } from '@/store/ui';
import { getImageUrl, getFallbackImage } from '@/lib/imageMap';

const routeNames: Record<string, string> = {
  'mandalore': 'Mandalore',
  'thrawn': 'Thrawn',
  'new-republic': 'Nueva República',
  'hutt': 'Hutt',
  'bounty-hunters': 'Cazarrecompensas',
  'empire': 'Imperio'
};

export default function MediaItemCard({ 
  item, 
  isCompleted, 
  toggleItem,
  markMultiple,
  unmarkMultiple,
  disableLayoutId = false
}: { 
  item: MediaItem; 
  isCompleted: (id: string) => boolean; 
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
  disableLayoutId?: boolean;
}) {
  const selectedCard = useUIStore(state => state.selectedCard);
  const selectedRoute = useUIStore(state => state.selectedRoute);
  const addRecentlyTouched = useUIStore(state => state.addRecentlyTouched);
  const compactMode = useUIStore(state => state.compactMode);
  const reducedMotion = useUIStore(state => state.reducedMotion);
  const focusMode = useUIStore(state => state.focusMode);
  
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
      if (isWatched) {
        unmarkMultiple(item.subItems.map(s => s.id));
      } else {
        markMultiple(item.subItems.map(s => s.id));
      }
    } else {
      toggleItem(item.id);
    }
  };

  const [imgSrc, setImgSrc] = useState(getImageUrl(item.id, item.title));

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const background = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.1) 0%, transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      id={item.id}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      layoutId={reducedMotion || disableLayoutId ? undefined : item.id}
      layout={!reducedMotion}
      animate={reducedMotion ? {} : {
        scale: isSelected ? 1.02 : 1,
        boxShadow: isSelected ? '0 0 0 2px var(--color-glow-success), 0 0 20px var(--color-glow-success)' : '0 0 0 0px transparent',
      }}
      style={reducedMotion ? {} : {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ duration: 0.3 }}
      className={`group relative ${compactMode ? 'p-2' : 'p-4'} rounded-xl border transition-colors cursor-pointer overflow-hidden block focus-within:ring-2 focus-within:ring-glow-success focus-within:ring-offset-2 focus-within:ring-offset-surface-1 ${
        isWatched 
          ? 'bg-glow-success/10 border-glow-success/30 hover:border-glow-success/50' 
          : 'bg-surface-2/50 backdrop-blur-md border-surface-4 hover:bg-surface-3 hover:border-surface-4/80'
      } ${isRouteSelected ? 'ring-2 ring-offset-2 ring-offset-surface-1 ring-white/30' : ''} ${isDimmed ? 'opacity-30 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}
      onClick={handleToggle}
    >
      {!reducedMotion && (
        <motion.div
          style={{ background }}
          className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay"
        />
      )}
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={isWatched}
        onChange={handleToggle}
        aria-label={`Marcar ${item.title} como visto`}
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className={`flex flex-row ${compactMode ? 'gap-2 items-center' : 'gap-4'}`} style={reducedMotion ? {} : { transform: 'translateZ(20px)' }}>
        {/* Thumbnail */}
        {!compactMode && (
          <motion.div 
            layoutId={reducedMotion || disableLayoutId ? undefined : `poster-${item.id}`}
            className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/5 bg-surface-3"
          >
            <Image 
              src={imgSrc} 
              alt={`Poster for ${item.title}`}
              fill
              className={`${item.subItems && item.subItems.length > 0 ? 'object-contain' : 'object-cover'} transition-all duration-500 ${isWatched ? 'opacity-50 grayscale' : 'group-hover:scale-105'}`}
              sizes="(max-width: 640px) 96px, 128px"
              referrerPolicy="no-referrer"
              onError={() => {
                // If image fails, fallback to local SVG
                setImgSrc(getFallbackImage(item.title));
              }}
              unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com') || imgSrc.includes('tmdb.org')}
            />
            {isWatched && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <CheckCircle2 className="w-10 h-10 text-glow-success drop-shadow-lg" />
              </div>
            )}
          </motion.div>
        )}

        <div className={`space-y-3 flex-1 flex flex-col ${compactMode ? 'justify-center' : 'justify-center'}`}>
          <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-2 ${compactMode ? 'items-center' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`shrink-0 ${compactMode ? 'mt-0.5' : 'mt-1'} hidden sm:block`}>
                <motion.div
                  initial={false}
                  animate={reducedMotion ? {} : { 
                    scale: isWatched ? [1, 1.2, 1] : 1,
                    rotate: isWatched ? [0, 10, 0] : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isWatched ? (
                    <CheckCircle2 className="w-5 h-5 text-glow-success" />
                  ) : isPartiallyWatched ? (
                    <div className="w-5 h-5 rounded-full border-2 border-glow-success flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-glow-success rounded-full" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-text-muted group-hover:text-text-body transition-colors" />
                  )}
                </motion.div>
              </div>
              <motion.h4 
                layoutId={reducedMotion || disableLayoutId ? undefined : `title-${item.id}`}
                className={`font-medium ${compactMode ? 'text-base' : 'text-lg'} transition-colors ${isWatched ? 'text-text-muted line-through decoration-surface-4' : 'text-text-heading'}`}
              >
                {item.title}
              </motion.h4>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  useUIStore.getState().setSelectedCard(item.id);
                  useUIStore.getState().setQuickLookOpen(true);
                }}
                className="p-1.5 rounded-md hover:bg-surface-3 text-text-muted hover:text-text-body transition-colors"
                title="Ver detalles"
              >
                <Info className="w-4 h-4" />
              </button>
              {item.essential && (
                <motion.span 
                  layoutId={reducedMotion || disableLayoutId ? undefined : `essential-${item.id}`}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-glow-warning/10 text-glow-warning text-[10px] font-bold uppercase tracking-wider border border-glow-warning/20"
                >
                  Esencial
                </motion.span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-body bg-black/40 px-2 py-1 rounded-md border border-white/5">
                {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {item.duration}m
              </span>
            </div>
          </div>
          
          {!compactMode && (
            <div className="text-sm">
              <div className={`leading-relaxed transition-colors ${isWatched ? 'text-surface-4' : 'text-text-body'}`}>
                <span className="inline-flex items-center gap-1 font-medium text-text-muted mr-2">
                  <Info className="w-3.5 h-3.5" /> Contexto:
                </span>
                {item.reason}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map(tag => (
                    <motion.span 
                      key={tag}
                      layoutId={reducedMotion || disableLayoutId ? undefined : `tag-${item.id}-${tag}`}
                      className="px-2 py-1 bg-surface-3 rounded-md text-xs text-text-muted border border-surface-4 flex items-center gap-1.5"
                    >
                      <div className="w-1 h-1 rounded-full bg-glow-success" />
                      {routeNames[tag] || tag}
                    </motion.span>
                  ))}
                </div>
              )}
            </div>
          )}

          {item.subItems && item.subItems.length > 0 && (
            <div className={`mt-4 space-y-2 border-t border-white/5 ${compactMode ? 'pt-2' : 'pt-4'}`} onClick={(e) => e.stopPropagation()}>
              {item.subItems.map(sub => {
                const isSubWatched = isCompleted(sub.id);
                return (
                  <div 
                    key={sub.id}
                    id={sub.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSubWatched ? 'bg-glow-success/20 hover:bg-glow-success/40' : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(sub.id);
                      addRecentlyTouched(sub.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isSubWatched ? (
                        <CheckCircle2 className="w-4 h-4 text-glow-success" />
                      ) : (
                        <Circle className="w-4 h-4 text-text-muted" />
                      )}
                      <span className={`text-sm ${isSubWatched ? 'text-text-muted line-through' : 'text-text-body'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-text-muted">{sub.duration}m</span>
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
