'use client';

import { useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SeriesConfig } from '@/types/series';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import ResumeFlow from '../ResumeFlow';
import confetti from 'canvas-confetti';

export default function QuickLookDrawer({ config }: { config: SeriesConfig }) {
  const eras = config.eras;
  const { isCompleted, skippedItems, skipItem } = useProgressStore();
  const { expandedEras, toggleEraExpanded, setLastViewedId, isMuted, selectedRoute } = useUIStore();
  const { progressPercent, totalItems } = useDashboardStats(eras);

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

  const handleSkipItem = useCallback((id: string) => {
    const isCurrentlyCompleted = isCompleted(id);
    skipItem(id);
    setLastViewedId(id);
    
    if (!isCurrentlyCompleted) {
      playSound();
    }
  }, [skipItem, playSound, setLastViewedId, isCompleted]);

  const nextItem = useMemo(() => {
    let nextItem = null;
    
    for (const era of eras) {
      for (const item of era.items) {
        if (selectedRoute && !item.tags?.includes(selectedRoute as any)) continue;

        if (item.subItems) {
          const skippedEssentialSub = item.subItems.find(sub => 
            skippedItems.includes(sub.id) && 
            item.essential
          );
          if (skippedEssentialSub) {
            nextItem = { item, subItem: skippedEssentialSub, eraId: era.id, isSkippedEssential: true };
            break;
          }
        } else {
          if (skippedItems.includes(item.id) && item.essential) {
            nextItem = { item, eraId: era.id, isSkippedEssential: true };
            break;
          }
        }
      }
      if (nextItem) break;
    }

    if (!nextItem) {
      for (const era of eras) {
        for (const item of era.items) {
          if (selectedRoute && !item.tags?.includes(selectedRoute as any)) continue;

          if (item.subItems) {
            const incompleteSub = item.subItems.find(sub => !isCompleted(sub.id));
            if (incompleteSub) {
              nextItem = { item, subItem: incompleteSub, eraId: era.id, isSkippedEssential: false };
              break;
            }
          } else {
            if (!isCompleted(item.id)) {
              nextItem = { item, eraId: era.id, isSkippedEssential: false };
              break;
            }
          }
        }
        if (nextItem) break;
      }
    }
    
    return nextItem;
  }, [eras, isCompleted, skippedItems, selectedRoute]);

  useEffect(() => {
    if (progressPercent === 100 && totalItems > 0) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#3b82f6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#3b82f6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [progressPercent, totalItems]);

  return (
    <>
      <AnimatePresence mode="popLayout">
        {nextItem && (
          <ResumeFlow 
            nextItem={nextItem} 
            handleSkipItem={handleSkipItem} 
            toggleEraExpanded={toggleEraExpanded} 
            expandedEras={expandedEras} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {progressPercent === 100 && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 pb-8 border-t border-surface-4"
          >
            <div className="bg-surface-2/50 backdrop-blur-xl border border-glow-success/30 rounded-3xl p-8 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-glow-success/5 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-glow-success/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-glow-success" style={{ fontFamily: 'var(--font-display)' }}>
                  ¡Estás listo para el estreno!
                </h2>
                <p className="text-text-muted max-w-2xl mx-auto text-lg">
                  Has completado todo el material esencial. Ahora solo queda esperar a que {config.title} llegue a las pantallas.
                </p>
              </div>

              {config.theme === 'mando' && (
                <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-surface-4 shadow-2xl relative z-10">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/IHWlvwu8t1w" 
                    title="The Mandalorian & Grogu Trailer" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
