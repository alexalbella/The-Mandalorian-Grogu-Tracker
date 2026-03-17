import { motion, AnimatePresence } from 'motion/react';
import { Era, MediaItem } from '@/data/starwars-list';
import { CheckSquare, Square, ChevronDown, ChevronUp, CheckCircle2, Target, PlayCircle } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import Image from 'next/image';
import { useState } from 'react';

export function MediaItemCard({ 
  item, 
  isCompleted, 
  toggleItem,
  markMultiple,
  unmarkMultiple
}: { 
  item: MediaItem; 
  isCompleted: (id: string) => boolean; 
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
}) {
  const isWatched = item.subItems 
    ? item.subItems.every(sub => isCompleted(sub.id)) && item.subItems.length > 0
    : isCompleted(item.id);

  const isPartiallyWatched = item.subItems
    ? item.subItems.some(sub => isCompleted(sub.id)) && !isWatched
    : false;

  const handleToggle = () => {
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
  
  // Use a deterministic seed for the placeholder image based on the item ID
  const getImageUrl = (id: string) => {
    const map: Record<string, string> = {
      'ep1': 'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
      'tcw-movie': 'https://image.tmdb.org/t/p/w500/iJQfixW818LUdSXlCDL3JZm0S0g.jpg',
      'tcw-t2-12-14': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t3-4': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
    };
    return map[id] || `https://picsum.photos/seed/${id}/500/281`;
  };

  const getFallbackImage = (title: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="#09090b" />
      <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#10b981" text-anchor="middle" dominant-baseline="middle">
        ${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const [imgSrc, setImgSrc] = useState(getImageUrl(item.id));

  return (
    <div 
      id={item.id}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden block focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-[#09090b] ${
        isWatched 
          ? 'bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-800/50' 
          : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
      onClick={handleToggle}
    >
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={isWatched}
        onChange={handleToggle}
        aria-label={`Marcar ${item.title} como visto`}
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="flex flex-row gap-4">
        {/* Thumbnail */}
        <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/5 bg-zinc-900">
          <Image 
            src={imgSrc} 
            alt={`Poster for ${item.title}`}
            fill
            className={`${item.subItems && item.subItems.length > 0 ? 'object-contain' : 'object-cover'} transition-all duration-500 ${isWatched ? 'opacity-50 grayscale' : 'group-hover:scale-105'}`}
            sizes="(max-width: 640px) 96px, 128px"
            referrerPolicy="no-referrer"
            onError={() => {
              setImgSrc(getFallbackImage(item.title));
            }}
            unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com')}
          />
          {isWatched && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 drop-shadow-lg" />
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1 hidden sm:block">
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isWatched ? [1, 1.2, 1] : 1,
                    rotate: isWatched ? [0, 10, 0] : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isWatched ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isPartiallyWatched ? (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    </div>
                  ) : (
                    <Square className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  )}
                </motion.div>
              </div>
              <h4 className={`font-medium text-lg transition-colors ${isWatched ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-100'}`}>
                {item.title}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EraSection({ 
  era, 
  index, 
  isCompleted, 
  toggleItem,
  markMultiple,
  unmarkMultiple
}: { 
  era: Era, 
  index: number, 
  isCompleted: (id: string) => boolean, 
  toggleItem: (id: string) => void,
  markMultiple: (ids: string[]) => void,
  unmarkMultiple: (ids: string[]) => void
}) {
  const { expandedEras, toggleEraExpanded } = useUIStore();
  
  // Default to true if not set
  const isExpanded = expandedEras[era.id] !== false;
  
  const eraItemIds = era.items.flatMap(i => i.subItems ? i.subItems.map(s => s.id) : [i.id]);
  const eraTotalCount = eraItemIds.length;
  const eraWatchedCount = eraItemIds.filter(id => isCompleted(id)).length;
  const isEraCompleted = eraWatchedCount === eraTotalCount && eraTotalCount > 0;
  const isPartiallyCompleted = eraWatchedCount > 0 && !isEraCompleted;

  const handleToggleAll = () => {
    if (isEraCompleted) {
      unmarkMultiple(eraItemIds);
    } else {
      markMultiple(eraItemIds);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pt-12 md:pt-16"
    >
      {index > 0 && (
        <div className="absolute top-0 left-0 w-full flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="absolute w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-sm" />
        </div>
      )}

      {/* Timeline connector */}
      <div className="absolute left-4 top-28 bottom-[-4rem] w-px bg-zinc-800 hidden md:block" />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Era Header */}
        <div className="md:w-1/3 shrink-0 relative z-10">
          <div className="sticky top-8 space-y-4 bg-[#09090b] py-2">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors shadow-lg ${isEraCompleted ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>
                {era.eraNumber}
              </div>
              <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isEraCompleted ? 'text-emerald-50' : 'text-zinc-100'}`} style={{ fontFamily: 'var(--font-display)' }}>
                ERA {era.eraNumber}
              </h2>
            </div>
            <div className="pl-11">
              <h3 className="text-lg font-medium text-zinc-300 mb-2">{era.eraLabel}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{era.description}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
                  <span className={isCompleted(era.id) ? "text-emerald-400 font-bold" : "text-zinc-300"}>
                    {eraWatchedCount} / {eraTotalCount}
                  </span>
                  <span className="text-zinc-500">vistos</span>
                </div>
                
                <button 
                  onClick={handleToggleAll}
                  className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                  title={isEraCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                  aria-label={isEraCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                >
                  {isEraCompleted ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : isPartiallyCompleted ? <Square className="w-4 h-4 text-emerald-500/50" fill="currentColor" /> : <Square className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => toggleEraExpanded(era.id)}
                  className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors md:hidden"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Colapsar era" : "Expandir era"}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:w-2/3 space-y-3 md:pl-8 overflow-hidden"
            >
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
