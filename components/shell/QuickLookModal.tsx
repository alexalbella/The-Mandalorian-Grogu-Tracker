'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Film, Tv, CheckCircle2, Circle } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useProgressStore } from '@/store/progress';
import { Era } from '@/data/starwars-list';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function QuickLookModal({ eras }: { eras: Era[] }) {
  const { quickLookOpen, setQuickLookOpen, selectedCard, setSelectedCard, reducedMotion } = useUIStore();
  const { isCompleted, toggleItem, markMultiple, unmarkMultiple } = useProgressStore();
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const item = eras.flatMap(e => e.items).find(i => i.id === selectedCard);

  useEffect(() => {
    if (item) {
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
        
        const getFallbackImage = (title: string) => {
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
            <rect width="400" height="600" fill="#09090b" />
            <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#10b981" text-anchor="middle" dominant-baseline="middle">
              ${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </text>
          </svg>`;
          return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
        };

        return map[id] || getFallbackImage(item.title);
      };

      setImgSrc(getImageUrl(item.id));
    }
  }, [item]);

  if (!item) return null;

  const isWatched = item.subItems 
    ? item.subItems.every(sub => isCompleted(sub.id)) && item.subItems.length > 0
    : isCompleted(item.id);

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

  return (
    <AnimatePresence>
      {quickLookOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setQuickLookOpen(false);
              setSelectedCard(null);
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            layoutId={reducedMotion ? undefined : item.id}
            initial={reducedMotion ? { opacity: 0, scale: 0.95 } : {}}
            animate={reducedMotion ? { opacity: 1, scale: 1 } : {}}
            exit={reducedMotion ? { opacity: 0, scale: 0.95 } : {}}
            className="relative w-full max-w-2xl bg-surface-2 border border-surface-4 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col sm:flex-row"
          >
            <button
              onClick={() => {
                setQuickLookOpen(false);
                setSelectedCard(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="relative w-full sm:w-1/3 aspect-[2/3] sm:aspect-auto shrink-0 bg-surface-3">
              {imgSrc && (
                <Image
                  src={imgSrc}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                  unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com')}
                />
              )}
              {isWatched && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <CheckCircle2 className="w-12 h-12 text-glow-success drop-shadow-lg" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-body bg-surface-3 px-2 py-1 rounded-md border border-surface-4">
                  {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                  {item.duration}m
                </span>
                {item.essential && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-glow-warning/10 text-glow-warning text-[10px] font-bold uppercase tracking-wider border border-glow-warning/20">
                    Esencial
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-text-heading mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {item.title}
              </h2>

              <div className="text-sm text-text-body leading-relaxed mb-6 flex-1">
                <p className="font-medium text-text-muted mb-2">Contexto:</p>
                <p>{item.reason}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-surface-3 rounded-md text-xs text-text-muted border border-surface-4">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={handleToggle}
                className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  isWatched 
                    ? 'bg-surface-3 text-text-body hover:bg-surface-4' 
                    : 'bg-glow-success text-surface-1 hover:bg-glow-success/90'
                }`}
              >
                {isWatched ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Marcar como no visto
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5" />
                    Marcar como visto
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
