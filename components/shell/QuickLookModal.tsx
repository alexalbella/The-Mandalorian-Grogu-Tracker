'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Film, Tv, CheckCircle2, Circle, Play, RotateCcw, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useProgressStore } from '@/store/progress';
import { Era } from '@/data/starwars-list';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageMap';

const routeNames: Record<string, string> = {
  'mandalore': 'Mandalore',
  'thrawn': 'Thrawn',
  'new-republic': 'Nueva República',
  'hutt': 'Hutt',
  'bounty-hunters': 'Cazarrecompensas',
  'empire': 'Imperio',
  // Maul saga
  'sith': 'Señores Sith',
  'dathomir': 'Hermanas de la Noche',
  'crimson-dawn': 'Amanecer Carmesí',
};

const getFallbackSummary = (title: string) =>
  `Una entrega fundamental en la saga. ${title} expande el universo y profundiza en los personajes clave.`;

const formatYear = (year: number): string => {
  if (year < 0) return `${Math.abs(year)} a.BY`;
  if (year === 0) return 'Batalla de Yavin';
  return `${year} d.BY`;
};

export default function QuickLookModal({ eras }: { eras: Era[] }) {
  const { quickLookOpen, setQuickLookOpen, selectedCard, setSelectedCard, reducedMotion } = useUIStore();
  const { isCompleted, toggleItem, markMultiple, unmarkMultiple } = useProgressStore();

  const allItems = eras.flatMap(e => e.items);
  const item = allItems.find(i => i.id === selectedCard);

  const imgSrc = item ? getImageUrl(item.id, item.title) : null;

  if (!item) return null;

  const completedSubCount = item.subItems
    ? item.subItems.filter(sub => isCompleted(sub.id)).length
    : 0;

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

  const getCtaContent = () => {
    if (isWatched) return { icon: RotateCcw, text: 'Recuperar (Marcar no visto)', style: 'bg-surface-3 text-text-body hover:bg-surface-4' };
    if (isPartiallyWatched) return { icon: Play, text: 'Continuar bloque', style: 'bg-glow-warning text-surface-1 hover:bg-glow-warning/90' };
    if (item.subItems) return { icon: CheckCircle, text: 'Completar bloque', style: 'bg-glow-success text-surface-1 hover:bg-glow-success/90' };
    return { icon: Play, text: 'Empezar', style: 'bg-glow-success text-surface-1 hover:bg-glow-success/90' };
  };

  const cta = getCtaContent();
  const CtaIcon = cta.icon;

  const relatedItems = item.tags.length > 0
    ? allItems
        .filter(i => i.id !== item.id && i.tags.some(t => item.tags.includes(t)))
        .slice(0, 3)
    : [];

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
            className="absolute inset-0 bg-surface-1/85"
          />

          <motion.div
            layoutId={reducedMotion ? undefined : item.id}
            initial={reducedMotion ? { opacity: 0, scale: 0.95 } : {}}
            animate={reducedMotion ? { opacity: 1, scale: 1 } : {}}
            exit={reducedMotion ? { opacity: 0, scale: 0.95 } : {}}
            className="relative w-full max-w-4xl max-h-[90vh] bg-surface-1 border border-surface-4/60 rounded-sm shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Blurred Backdrop */}
            {imgSrc && (
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <Image
                  src={imgSrc}
                  alt="Backdrop"
                  fill
                  className="object-cover blur-3xl scale-110"
                  unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com') || imgSrc.includes('tmdb.org')}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/80 to-transparent" />
              </div>
            )}

            <button
              onClick={() => {
                setQuickLookOpen(false);
                setSelectedCard(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-sm bg-surface-3/80 text-text-muted hover:text-text-body hover:bg-surface-3 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row overflow-y-auto z-10">
              {/* Hero Poster */}
              <div className="relative w-full md:w-2/5 p-6 md:p-8 flex flex-col items-center justify-start shrink-0">
                <motion.div
                  layoutId={reducedMotion ? undefined : `poster-${item.id}`}
                  className="relative w-full max-w-[240px] aspect-[2/3] rounded-sm overflow-hidden shadow-xl border border-surface-4/30"
                >
                  {imgSrc && (
                    <Image
                      src={imgSrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                      unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com') || imgSrc.includes('tmdb.org')}
                    />
                  )}
                  {isWatched && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <CheckCircle2 className="w-16 h-16 text-glow-success drop-shadow-lg" />
                    </div>
                  )}
                </motion.div>

                <button
                  onClick={handleToggle}
                  className={`w-full max-w-[240px] mt-6 py-3 rounded-sm font-mono text-sm transition-colors flex items-center justify-center gap-2 ${cta.style}`}
                >
                  <CtaIcon className="w-5 h-5" />
                  {cta.text}
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 md:pl-0 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-body bg-surface-3/60 px-2 py-1 rounded-sm border border-surface-4/50">
                    {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                    {item.duration}m
                  </span>
                  {item.inUniverseYear !== undefined && (
                    <span className="text-[9px] font-mono text-text-muted bg-surface-3/60 px-2 py-1 rounded-sm border border-surface-4/50 uppercase tracking-widest">
                      {formatYear(item.inUniverseYear)}
                    </span>
                  )}
                  {item.subItems && (
                    <span className="text-[9px] font-mono text-text-muted">
                      {completedSubCount} / {item.subItems.length} episodios
                    </span>
                  )}
                  {item.essential && (
                    <motion.span
                      layoutId={reducedMotion ? undefined : `essential-${item.id}`}
                      className="inline-flex items-center px-2 py-1 rounded-sm bg-glow-warning/10 text-glow-warning text-[10px] font-bold uppercase tracking-wider border border-glow-warning/20"
                    >
                      Esencial
                    </motion.span>
                  )}
                </div>

                <motion.h2
                  layoutId={reducedMotion ? undefined : `title-${item.id}`}
                  className="font-display font-semibold text-text-heading mb-6 leading-tight text-3xl sm:text-4xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title}
                </motion.h2>

                <div className="space-y-6">
                  {/* Editorial Summary */}
                  <div>
                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Sinopsis</h3>
                    <p className="text-text-body leading-relaxed text-sm sm:text-base">
                      {item.synopsis || getFallbackSummary(item.title)}
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div className="bg-surface-2/40 border border-surface-4/40 rounded-sm p-4">
                    <h3 className="text-sm font-bold text-text-heading flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-glow-success" />
                      Por qué importa
                    </h3>
                    <p className="text-sm text-text-body leading-relaxed">
                      {item.reason}
                    </p>
                  </div>

                  {/* Affected Routes */}
                  {item.tags && item.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Rutas Afectadas</h3>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <motion.span
                            key={tag}
                            layoutId={reducedMotion ? undefined : `tag-${item.id}-${tag}`}
                            className="px-3 py-1.5 bg-surface-3/50 rounded-sm text-xs font-medium text-text-heading border border-surface-4 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-glow-success" />
                            {routeNames[tag] || tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-episodes Timeline */}
                  {item.subItems && item.subItems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Episodios</h3>
                      <div className="space-y-2">
                        {item.subItems.map((sub, index) => {
                          const isSubWatched = isCompleted(sub.id);
                          return (
                            <div
                              key={sub.id}
                              className={`flex items-center justify-between p-3 rounded-sm border transition-colors cursor-pointer ${
                                isSubWatched
                                  ? 'bg-glow-success/[0.06] border-glow-success/20'
                                  : 'bg-surface-2/30 border-surface-4/40 hover:bg-surface-2/60'
                              }`}
                              onClick={() => toggleItem(sub.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-xs font-mono text-text-muted w-4">{index + 1}</div>
                                {isSubWatched ? (
                                  <CheckCircle2 className="w-5 h-5 text-glow-success shrink-0" />
                                ) : (
                                  <Circle className="w-5 h-5 text-text-muted shrink-0" />
                                )}
                                <span className={`text-sm font-medium ${isSubWatched ? 'text-text-muted line-through' : 'text-text-body'}`}>
                                  {sub.title}
                                </span>
                              </div>
                              <span className="text-xs font-mono text-text-muted">{sub.duration}m</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Ver también */}
                  {relatedItems.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Ver también</h3>
                      <div className="space-y-2">
                        {relatedItems.map(related => {
                          const relatedImg = getImageUrl(related.id, related.title);
                          return (
                            <button
                              key={related.id}
                              onClick={() => setSelectedCard(related.id)}
                              className="w-full flex items-center gap-3 p-3 rounded-sm border border-surface-4/40 bg-surface-2/30 hover:bg-surface-2/60 transition-colors text-left"
                            >
                              <div className="relative w-10 h-14 rounded-sm overflow-hidden shrink-0 border border-surface-4/30">
                                {relatedImg && (
                                  <Image
                                    src={relatedImg}
                                    alt={related.title}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                    unoptimized={relatedImg.startsWith('data:') || relatedImg.includes('tvmaze.com') || relatedImg.includes('tmdb.org')}
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text-body truncate">{related.title}</p>
                                <p className="text-[10px] font-mono text-text-muted mt-0.5">{related.duration}m</p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
