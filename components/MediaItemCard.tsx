import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Film, Tv, Info } from 'lucide-react';
import { MediaItem } from '@/data/starwars-list';
import Image from 'next/image';

export default function MediaItemCard({ 
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
      'tcw-t4-15-18': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t4-20-22': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t5-14': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t6-5': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t7-9-12': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'bb-t1-15-16': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
      'bb-t3-1-3-14-15': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
      'rebels-t1-1-2': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t3-15': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t3-t4': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'ep4': 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
      'ep5': 'https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
      'ep6': 'https://image.tmdb.org/t/p/w500/jQYlydvHm3kUix1f8prMucrplhm.jpg',
      'mando-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'mando-t2': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'bobafett-1-4': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
      'bobafett-5-7': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
      'mando-t3': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'ahsoka-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/473/1184972.jpg',
      'skeleton-crew-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/546/1365559.jpg'
    };
    
    return map[id] || getFallbackImage(item.title);
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
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden block focus-within:ring-2 focus-within:ring-glow-success focus-within:ring-offset-2 focus-within:ring-offset-surface-1 ${
        isWatched 
          ? 'bg-glow-success/10 border-glow-success/30 hover:border-glow-success/50' 
          : 'bg-surface-2/50 backdrop-blur-md border-surface-4 hover:bg-surface-3 hover:border-surface-4/80'
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
        <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/5 bg-surface-3">
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
            unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com')}
          />
          {isWatched && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <CheckCircle2 className="w-10 h-10 text-glow-success drop-shadow-lg" />
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
              <h4 className={`font-medium text-lg transition-colors ${isWatched ? 'text-text-muted line-through decoration-surface-4' : 'text-text-heading'}`}>
                {item.title}
              </h4>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.essential && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-glow-warning/10 text-glow-warning text-[10px] font-bold uppercase tracking-wider border border-glow-warning/20">
                  Esencial
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-body bg-black/40 px-2 py-1 rounded-md border border-white/5">
                {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {item.duration}m
              </span>
            </div>
          </div>
          
          <div className="text-sm">
            <div className={`leading-relaxed transition-colors ${isWatched ? 'text-surface-4' : 'text-text-body'}`}>
              <span className="inline-flex items-center gap-1 font-medium text-text-muted mr-2">
                <Info className="w-3.5 h-3.5" /> Contexto:
              </span>
              {item.reason}
            </div>
          </div>

          {item.subItems && item.subItems.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-white/5 pt-4" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
}
