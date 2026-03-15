import { useEffect, useCallback } from 'react';
import { useProgressStore } from '@/store/progress';
import { useGamificationStore } from '@/store/gamification';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Era, MediaItem } from '@/data/starwars-list';
import { Mission, MissionLength } from '@/types/gamification';
import confetti from 'canvas-confetti';

export function useGamificationEngine(eras: Era[]) {
  const { watchedItems, markMultiple } = useProgressStore();
  const { 
    unlockedAchievements, 
    unlockAchievement, 
    currentMission, 
    setMission, 
    missionPreferences,
    completeMission
  } = useGamificationStore();

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
        watchedUnits += item.subItems.filter(sub => watchedItems.includes(sub.id)).length;
      } else {
        totalUnits += 1;
        if (watchedItems.includes(item.id)) {
          watchedUnits += 1;
        }
      }
    });

    return totalUnits > 0 ? (watchedUnits / totalUnits) * 100 : 0;
  }, [allItems, watchedItems]);

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
      // If it's the meta achievement, do special confetti
      if (newlyUnlocked.includes('meta-gold')) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6']
        });
      }
    }
  }, [watchedItems, unlockedAchievements, calculateProgress, unlockAchievement]);

  // Mission Generation Logic
  const generateMission = useCallback((lengthPref: MissionLength = missionPreferences.length, forceRegenerate = false) => {
    if (currentMission && !currentMission.completed && !forceRegenerate) {
      return; // Already have an active mission
    }

    // Find next unwatched items
    const unwatchedUnits: { id: string, title: string, duration: number, parentId?: string, tags: string[], essential: boolean }[] = [];
    
    for (const item of allItems) {
      if (item.subItems && item.subItems.length > 0) {
        for (const sub of item.subItems) {
          if (!watchedItems.includes(sub.id)) {
            unwatchedUnits.push({
              id: sub.id,
              title: sub.title,
              duration: sub.duration,
              parentId: item.id,
              tags: item.tags,
              essential: item.essential
            });
          }
        }
      } else {
        if (!watchedItems.includes(item.id)) {
          unwatchedUnits.push({
            id: item.id,
            title: item.title,
            duration: item.duration,
            tags: item.tags,
            essential: item.essential
          });
        }
      }
    }

    if (unwatchedUnits.length === 0) {
      // Tracker completed
      setMission({
        id: 'mission-complete',
        generatedAt: new Date().toISOString(),
        mode: missionPreferences.mode,
        preferredLength: lengthPref,
        targetMinutes: 0,
        targetItems: [],
        title: 'Misión cumplida',
        description: 'Ya has terminado el tracker. Solo queda esperar el estreno.',
        rewardText: 'This Is the Way',
        completed: false
      });
      return;
    }

    // Determine target duration
    let minMinutes = 15;
    let maxMinutes = 30;
    if (lengthPref === 'medium') {
      minMinutes = 30;
      maxMinutes = 60;
    } else if (lengthPref === 'long') {
      minMinutes = 60;
      maxMinutes = 120;
    }

    const selectedUnits: typeof unwatchedUnits = [];
    let currentDuration = 0;

    // Try to fill the mission with sequential items
    for (const unit of unwatchedUnits) {
      if (currentDuration === 0) {
        selectedUnits.push(unit);
        currentDuration += unit.duration;
      } else {
        if (currentDuration + unit.duration <= maxMinutes + 15) { // Allow slight overflow
          selectedUnits.push(unit);
          currentDuration += unit.duration;
        } else {
          break; // Stop adding if it exceeds too much
        }
      }
    }

    if (selectedUnits.length === 0) return;

    // Generate copy
    let title = '';
    let description = '';
    let rewardText = '';

    if (selectedUnits.length === 1) {
      title = `Tu misión de hoy: ${currentDuration} min`;
      description = `Mira ${selectedUnits[0].title} y sigue avanzando sin perder el ritmo.`;
    } else if (selectedUnits.length === 2) {
      title = `Tu misión de hoy: ${currentDuration} min`;
      description = `Completa ${selectedUnits[0].title} + ${selectedUnits[1].title} para cerrar un bloque narrativo.`;
    } else {
      title = `Misión extendida: ${currentDuration} min`;
      description = `Hoy toca una sesión importante con ${selectedUnits.length} episodios.`;
    }

    // Find a relevant achievement to mention in reward
    const primaryTag = selectedUnits[0].tags[0];
    if (primaryTag) {
      const relatedAchievement = ACHIEVEMENTS.find(a => a.unlockRule.tag === primaryTag && !unlockedAchievements.includes(a.id));
      if (relatedAchievement) {
        rewardText = `Acercándote a "${relatedAchievement.title}"`;
      } else {
        rewardText = `Progreso extra en tu ruta`;
      }
    } else {
      rewardText = `Gran salto en tu progreso global`;
    }

    const newMission: Mission = {
      id: `mission-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      mode: missionPreferences.mode,
      preferredLength: lengthPref,
      targetMinutes: currentDuration,
      targetItems: selectedUnits.map(u => u.id),
      title,
      description,
      rewardText,
      completed: false
    };

    setMission(newMission);
  }, [allItems, watchedItems, currentMission, missionPreferences, setMission, unlockedAchievements]);

  // Auto-generate mission if none exists and mode is auto
  useEffect(() => {
    if (!currentMission && missionPreferences.mode === 'auto') {
      generateMission();
    }
  }, [currentMission, missionPreferences.mode, generateMission]);

  const handleCompleteMission = useCallback(() => {
    if (currentMission && !currentMission.completed) {
      markMultiple(currentMission.targetItems);
      completeMission();
    }
  }, [currentMission, markMultiple, completeMission]);

  return {
    calculateProgress,
    generateMission,
    handleCompleteMission
  };
}
