'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Film, Tv, CheckCircle2, Circle, Play, RotateCcw, CheckCircle, Info } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useProgressStore } from '@/store/progress';
import { Era } from '@/data/starwars-list';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/imageMap';

const routeNames: Record<string, string> = {
  'mandalore': 'Mandalore',
  'thrawn': 'Thrawn',
  'new-republic': 'Nueva República',
  'hutt': 'Hutt',
  'bounty-hunters': 'Cazarrecompensas',
  'empire': 'Imperio'
};

const getEditorialSummary = (id: string, title: string) => {
  const summaries: Record<string, string> = {
    'ep1': 'El inicio de la saga Skywalker. Descubre los orígenes de Anakin Skywalker y el resurgimiento de los Sith en una galaxia al borde de la crisis.',
    'ep2': 'La galaxia se divide. El inicio de las Guerras Clon marca un punto de no retorno para la República y la Orden Jedi.',
    'ep3': 'La caída de los Jedi y el nacimiento del Imperio Galáctico. El destino de Anakin Skywalker se sella en fuego y traición.',
    'ep4': 'Una nueva esperanza surge. Un joven granjero, una princesa rebelde y un contrabandista se unen para desafiar al Imperio.',
    'ep5': 'El Imperio contraataca. La Rebelión sufre un duro golpe mientras oscuros secretos del pasado salen a la luz.',
    'ep6': 'El retorno del Jedi. La batalla final por la libertad de la galaxia y la redención de Anakin Skywalker.',
    'mando-t1': 'Un cazarrecompensas solitario encuentra un propósito inesperado al proteger a un misterioso niño buscado por los remanentes del Imperio.',
    'mando-t2': 'La búsqueda de un Jedi. El Mandaloriano y Grogu viajan por la galaxia enfrentando viejos enemigos y forjando nuevas alianzas.',
    'mando-t3': 'La redención de Mandalore. Din Djarin busca expiar sus pecados mientras su pueblo lucha por recuperar su mundo natal.',
    'ahsoka-t1': 'Una antigua Jedi busca a un amigo perdido y a un enemigo formidable, mientras una nueva amenaza se cierne sobre la frágil Nueva República.',
    'bobafett-1-4': 'El legendario cazarrecompensas reclama el trono de Jabba el Hutt, enfrentando los desafíos de gobernar el inframundo de Tatooine.',
    'andor-t1': 'El despertar de una rebelión. Sigue el viaje de Cassian Andor desde un cínico ladrón hasta un héroe de la causa rebelde.',
    'obi-wan': 'Años después de la caída de la República, un exiliado Obi-Wan Kenobi debe enfrentar sus mayores fracasos para proteger una nueva esperanza.',
  };
  return summaries[id] || `Una entrega fundamental en la saga de Star Wars. ${title} expande el universo y profundiza en las historias de los personajes que dan forma a la galaxia.`;
};

export default function QuickLookModal({ eras }: { eras: Era[] }) {
  const { quickLookOpen, setQuickLookOpen, selectedCard, setSelectedCard, reducedMotion } = useUIStore();
  const { isCompleted, toggleItem, markMultiple, unmarkMultiple } = useProgressStore();

  const item = eras.flatMap(e => e.items).find(i => i.id === selectedCard);

  const imgSrc = item ? getImageUrl(item.id, item.title) : null;

  if (!item) return null;

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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            layoutId={reducedMotion ? undefined : item.id}
            initial={reducedMotion ? { opacity: 0, scale: 0.95 } : {}}
            animate={reducedMotion ? { opacity: 1, scale: 1 } : {}}
            exit={reducedMotion ? { opacity: 0, scale: 0.95 } : {}}
            className="relative w-full max-w-4xl max-h-[90vh] bg-surface-1 border border-surface-4 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
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
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col md:flex-row overflow-y-auto z-10">
              {/* Hero Poster */}
              <div className="relative w-full md:w-2/5 p-6 md:p-8 flex flex-col items-center justify-start shrink-0">
                <motion.div 
                  layoutId={reducedMotion ? undefined : `poster-${item.id}`}
                  className="relative w-full max-w-[240px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10"
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <CheckCircle2 className="w-16 h-16 text-glow-success drop-shadow-lg" />
                    </div>
                  )}
                </motion.div>

                <button
                  onClick={handleToggle}
                  className={`w-full max-w-[240px] mt-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg ${cta.style}`}
                >
                  <CtaIcon className="w-5 h-5" />
                  {cta.text}
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 md:pl-0 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-text-body bg-surface-3/80 backdrop-blur-md px-2 py-1 rounded-md border border-surface-4">
                    {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                    {item.duration}m
                  </span>
                  {item.essential && (
                    <motion.span 
                      layoutId={reducedMotion ? undefined : `essential-${item.id}`}
                      className="inline-flex items-center px-2 py-1 rounded-md bg-glow-warning/10 text-glow-warning text-[10px] font-bold uppercase tracking-wider border border-glow-warning/20"
                    >
                      Esencial
                    </motion.span>
                  )}
                </div>

                <motion.h2 
                  layoutId={reducedMotion ? undefined : `title-${item.id}`}
                  className="text-3xl sm:text-4xl font-bold text-text-heading mb-6 leading-tight" 
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {item.title}
                </motion.h2>

                <div className="space-y-6">
                  {/* Editorial Summary */}
                  <div>
                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-2">Sinopsis</h3>
                    <p className="text-text-body leading-relaxed text-sm sm:text-base">
                      {getEditorialSummary(item.id, item.title)}
                    </p>
                  </div>

                  {/* Why it matters */}
                  <div className="bg-surface-2/50 border border-surface-4 rounded-xl p-4">
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
                            className="px-3 py-1.5 bg-surface-3/50 backdrop-blur-sm rounded-lg text-xs font-medium text-text-heading border border-surface-4 flex items-center gap-2"
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
                              className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${
                                isSubWatched 
                                  ? 'bg-glow-success/10 border-glow-success/20 hover:bg-glow-success/20' 
                                  : 'bg-surface-2/50 border-surface-4 hover:bg-surface-3'
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
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
