'use client';

import { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Era } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import EraSection from '../EraSection';

export default function Timeline({ eras }: { eras: Era[] }) {
  const { watchedItems, skippedItems, toggleItem, markMultiple, unmarkMultiple, isCompleted } = useProgressStore();
  const { filterType, preset, hideCompleted, searchQuery, setLastViewedId, isMuted, reducedMotion } = useUIStore();

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
        
        // Presets
        if (preset === 'essential' && !item.essential) return false;
        if (preset === 'fast' && item.type === 'series' && !item.essential) return false;
        if (preset === 'mandalore' && !item.tags.includes('mandalore')) return false;
        if (preset === 'thrawn' && !item.tags.includes('thrawn')) return false;
        if (preset === 'new-republic' && !item.tags.includes('new-republic')) return false;
        if (preset === 'hutt' && !item.tags.includes('hutt')) return false;
        if (preset === 'bounty-hunters' && !item.tags.includes('bounty-hunters')) return false;
        if (preset === 'essential-background' && !item.essential) return false;
        if (preset === 'movie-background' && item.type !== 'movie') return false;

        return true;
      });
      return { ...era, items: filteredItems };
    }).filter(era => era.items.length > 0);
  }, [eras, filterType, hideCompleted, watchedItems, skippedItems, searchQuery, preset]);

  return (
    <section className="space-y-16">
      <AnimatePresence mode="popLayout">
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
