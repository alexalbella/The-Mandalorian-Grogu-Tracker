'use client';

import { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Era } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import EraSection from '../EraSection';
import MediaItemCard from '../MediaItemCard';
import { Shield, CircleDollarSign, Target, Eye, Plane, BrainCircuit, X } from 'lucide-react';

const routeNarratives: Record<string, { title: string, description: string, icon: any, colorClass: string, bgClass: string, borderClass: string }> = {
  'mandalore': {
    title: 'El Camino de Mandalore',
    description: 'Sigue la historia de la cultura Mandaloriana, desde sus conflictos internos en las Guerras Clon hasta la purga imperial y su resurgimiento. Esta ruta es esencial para entender el credo de Din Djarin y el peso del Sable Oscuro.',
    icon: Shield,
    colorClass: 'text-route-mandalore',
    bgClass: 'bg-route-mandalore/10',
    borderClass: 'border-route-mandalore/30'
  },
  'hutt': {
    title: 'El Imperio Hutt',
    description: 'Explora el inframundo criminal de Tatooine y el vacío de poder dejado por Jabba. Esta ruta te prepara para el inminente conflicto de sucesión entre los herederos Hutt y Boba Fett.',
    icon: CircleDollarSign,
    colorClass: 'text-route-hutt',
    bgClass: 'bg-route-hutt/10',
    borderClass: 'border-route-hutt/30'
  },
  'bounty-hunters': {
    title: 'Gremio de Cazarrecompensas',
    description: 'Conoce a los mercenarios más letales de la galaxia. Desde las hazañas de Embo en las Guerras Clon hasta los colegas de profesión de Din Djarin, esta ruta revela cómo opera el submundo.',
    icon: Target,
    colorClass: 'text-route-bounty',
    bgClass: 'bg-route-bounty/10',
    borderClass: 'border-route-bounty/30'
  },
  'empire': {
    title: 'El Remanente Imperial',
    description: 'Descubre los oscuros secretos del Proyecto Nigromante y los experimentos de clonación. Esta ruta explica por qué el Imperio estaba tan obsesionado con capturar a Grogu.',
    icon: Eye,
    colorClass: 'text-route-empire',
    bgClass: 'bg-route-empire/10',
    borderClass: 'border-route-empire/30'
  },
  'new-republic': {
    title: 'La Nueva República',
    description: 'Acompaña a los Rangers de Adelphi y a los líderes republicanos en su intento por mantener la paz en una galaxia fracturada. Conoce a los aliados clave que ayudarán a Mando.',
    icon: Plane,
    colorClass: 'text-route-republic',
    bgClass: 'bg-route-republic/10',
    borderClass: 'border-route-republic/30'
  },
  'thrawn': {
    title: 'La Amenaza de Thrawn',
    description: 'Rastrea los movimientos del Gran Almirante Thrawn, la mente táctica más brillante del Imperio. Esta ruta establece a la gran amenaza militar que acecha en las sombras.',
    icon: BrainCircuit,
    colorClass: 'text-route-thrawn',
    bgClass: 'bg-route-thrawn/10',
    borderClass: 'border-route-thrawn/30'
  }
};

export default function Timeline({ eras }: { eras: Era[] }) {
  const { watchedItems, skippedItems, toggleItem, markMultiple, unmarkMultiple, isCompleted } = useProgressStore();
  const { filterType, preset, hideCompleted, searchQuery, setLastViewedId, isMuted, reducedMotion, selectedRoute, recentlyTouched } = useUIStore();

  const playSound = useCallback(() => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [isMuted]);

  const handleToggleItem = useCallback((id: string) => {
    const isCurrentlyCompleted = isCompleted(id);
    toggleItem(id);
    setLastViewedId(id);
    
    if (!isCurrentlyCompleted) {
      playSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [toggleItem, playSound, setLastViewedId, isCompleted]);

  const filteredEras = useMemo(() => {
    return eras.map(era => {
      const filteredItems = era.items.filter(item => {
        // Type filter
        if (filterType !== 'all' && item.type !== filterType) return false;
        // Completed filter
        if (hideCompleted) {
          if (item.subItems) {
            if (item.subItems.every(sub => watchedItems.includes(sub.id) || skippedItems.includes(sub.id)) && item.subItems.length > 0) return false;
          } else {
            if (watchedItems.includes(item.id) || skippedItems.includes(item.id)) return false;
          }
        }
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesReason = item.reason.toLowerCase().includes(query);
          const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(query));
          const matchesSubItems = item.subItems?.some(sub => sub.title.toLowerCase().includes(query)) || false;
          
          if (!matchesTitle && !matchesReason && !matchesTags && !matchesSubItems) {
            return false;
          }
        }
        
        // Selected Route
        if (selectedRoute && !item.tags.includes(selectedRoute)) return false;

        // Presets
        if (preset === 'essential' && !item.essential) return false;
        if (preset === 'fast' && item.type === 'series' && !item.essential) return false;
        if (preset === 'essential-background' && !item.essential) return false;
        if (preset === 'movie-background' && item.type !== 'movie') return false;

        return true;
      });
      return { ...era, items: filteredItems };
    }).filter(era => era.items.length > 0);
  }, [eras, filterType, hideCompleted, watchedItems, skippedItems, searchQuery, preset, selectedRoute]);

  return (
    <section id="timeline-section" className="space-y-16">
      <AnimatePresence mode="popLayout">
        {selectedRoute && routeNarratives[selectedRoute] && (
          <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`relative p-6 md:p-8 rounded-3xl border ${routeNarratives[selectedRoute].bgClass} ${routeNarratives[selectedRoute].borderClass} mb-12`}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className={`w-16 h-16 shrink-0 rounded-2xl bg-surface-1 border ${routeNarratives[selectedRoute].borderClass} flex items-center justify-center ${routeNarratives[selectedRoute].colorClass} shadow-inner`}>
                {(() => {
                  const Icon = routeNarratives[selectedRoute].icon;
                  return <Icon className="w-8 h-8" />;
                })()}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold uppercase tracking-widest ${routeNarratives[selectedRoute].colorClass}`}>
                    Navegación Narrativa
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-text-heading mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {routeNarratives[selectedRoute].title}
                </h2>
                <p className="text-text-body text-lg leading-relaxed max-w-3xl">
                  {routeNarratives[selectedRoute].description}
                </p>
              </div>
              <button
                onClick={() => {
                  useUIStore.getState().setSelectedRoute(null);
                  useUIStore.getState().setFocusMode(false);
                }}
                className="absolute top-6 right-6 p-2 rounded-full bg-surface-1/50 hover:bg-surface-2 border border-surface-4/50 text-text-muted hover:text-text-heading transition-colors"
                title="Cerrar ruta"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
        
        {filteredEras.length === 0 ? (
          <motion.div 
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            className="text-center py-20 text-text-muted"
          >
            No hay elementos que coincidan con los filtros actuales.
          </motion.div>
        ) : (
          filteredEras.map((era, index) => (
            <EraSection 
              key={era.id} 
              era={era} 
              index={index} 
              isCompleted={isCompleted} 
              toggleItem={handleToggleItem}
              markMultiple={markMultiple}
              unmarkMultiple={unmarkMultiple}
            />
          ))
        )}
      </AnimatePresence>
    </section>
  );
}
