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
      'tcw-t5-1': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
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
              // If image fails, fallback to local SVG
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
                    <Circle className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  )}
                </motion.div>
              </div>
              <h4 className={`font-medium text-lg transition-colors ${isWatched ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-100'}`}>
                {item.title}
              </h4>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.essential && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">
                  Esencial
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {item.duration}m
              </span>
            </div>
          </div>
          
          <div className="text-sm">
            <div className={`leading-relaxed transition-colors ${isWatched ? 'text-zinc-600' : 'text-zinc-400'}`}>
              <span className="inline-flex items-center gap-1 font-medium text-zinc-500 mr-2">
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
                      isSubWatched ? 'bg-emerald-950/20 hover:bg-emerald-950/40' : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(sub.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isSubWatched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-500" />
                      )}
                      <span className={`text-sm ${isSubWatched ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{sub.duration}m</span>
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
