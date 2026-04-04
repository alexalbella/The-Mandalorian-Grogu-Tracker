import { useEffect, useCallback } from 'react';
import { useProgressStore } from '@/store/progress';
import { useAchievementsStore } from '@/store/achievements';
import { useUIStore } from '@/store/ui';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Era, MediaItem } from '@/data/starwars-list';
import confetti from 'canvas-confetti';
import { themeRegistry, getActiveTheme } from '@/lib/theme-registry';

export function useAchievementsEngine(eras: Era[]) {
  const { watchedItems, skippedItems } = useProgressStore();
  const { 
    unlockedAchievements, 
    unlockAchievement 
  } = useAchievementsStore();

  const allItems = eras.flatMap(e => e.items);
  
  // Helper to calculate progress for a specific tag or global
  const calculateProgress = useCallback((rule: { type: 'tagProgress' | 'globalProgress', tag?: string }) => {
    let targetItems: MediaItem[] = [];
    
    if (rule.type === 'globalProgress') {
      targetItems = allItems;
    } else if (rule.type === 'tagProgress' && rule.tag) {
      targetItems = allItems.filter(item => item.tags.includes(rule.tag!));
    }

    if (targetItems.length === 0) return 0;

    let totalUnits = 0;
    let watchedUnits = 0;

    targetItems.forEach(item => {
      if (item.subItems && item.subItems.length > 0) {
        totalUnits += item.subItems.length;
        watchedUnits += item.subItems.filter(sub => watchedItems.includes(sub.id) || skippedItems.includes(sub.id)).length;
      } else {
        totalUnits += 1;
        if (watchedItems.includes(item.id) || skippedItems.includes(item.id)) {
          watchedUnits += 1;
        }
      }
    });

    return totalUnits > 0 ? (watchedUnits / totalUnits) * 100 : 0;
  }, [allItems, watchedItems, skippedItems]);

  // Check achievements
  useEffect(() => {
    let newlyUnlocked: string[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id)) {
        const progress = calculateProgress(achievement.unlockRule);
        if (progress >= achievement.unlockRule.threshold) {
          unlockAchievement(achievement.id);
          newlyUnlocked.push(achievement.id);
        }
      }
    });

    if (newlyUnlocked.length > 0) {
      // Trigger toast or notification here (we can use a custom toast or just confetti for now)
      newlyUnlocked.forEach(id => {
        useUIStore.getState().addToast(id);
      });
      // If it's the meta achievement, do special confetti
      if (newlyUnlocked.includes('meta-gold')) {
        const theme = themeRegistry[getActiveTheme()];
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: theme.confetti.colors,
        });
      }
    }
  }, [watchedItems, skippedItems, unlockedAchievements, calculateProgress, unlockAchievement]);

  return {
    calculateProgress
  };
}
