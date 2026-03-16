import { useEffect, useCallback } from 'react';
import { useProgressStore } from '@/store/progress';
import { useGamificationStore } from '@/store/gamification';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Era, MediaItem } from '@/data/starwars-list';
import { Mission, MissionLength } from '@/types/gamification';
import confetti from 'canvas-confetti';

export function useGamificationEngine(eras: Era[]) {
  const { watchedItems, skippedItems, markMultiple } = useProgressStore();
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
  }, [watchedItems, skippedItems, unlockedAchievements, calculateProgress, unlockAchievement]);

  // Mission Generation Logic
  const generateMission = useCallback((lengthPref: MissionLength = missionPreferences.length, forceRegenerate = false, specificTag?: string) => {
    if (currentMission && !currentMission.completed && !forceRegenerate) {
      return; // Already have an active mission
    }

    // Find next unwatched items
    let unwatchedUnits: { id: string, title: string, duration: number, parentId?: string, tags: string[], essential: boolean }[] = [];
    
    for (const item of allItems) {
      if (item.subItems && item.subItems.length > 0) {
        for (const sub of item.subItems) {
          if (!watchedItems.includes(sub.id) && !skippedItems.includes(sub.id)) {
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
        if (!watchedItems.includes(item.id) && !skippedItems.includes(item.id)) {
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

    if (specificTag) {
      unwatchedUnits = unwatchedUnits.filter(u => u.tags.includes(specificTag));
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
    } else if (lengthPref === 'marathon') {
      minMinutes = 180;
      maxMinutes = 300;
    }

    // Calculate urgency
    const releaseDate = new Date('2026-05-22T00:00:00Z');
    const daysLeft = Math.max(1, Math.ceil((releaseDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const totalUnwatchedMinutes = unwatchedUnits.reduce((acc, u) => acc + u.duration, 0);
    const minutesPerDayNeeded = totalUnwatchedMinutes / daysLeft;
    const isUrgent = minutesPerDayNeeded > 60;

    // 1. Score all unwatched units to find the BEST starting point (seed)
    const scoredUnits = unwatchedUnits.map((unit, index) => {
      let score = 0;
      
      // Base chronological preference (slight, to keep order naturally)
      score += (unwatchedUnits.length - index) * 0.1;
      
      // Narrative value
      if (unit.essential) score += 20;
      if (unit.essential && isUrgent) score += 30;
      
      // Thematic / Route preference
      if (specificTag && unit.tags.includes(specificTag)) score += 100;
      
      // Achievement proximity
      unit.tags.forEach(tag => {
        const relatedAchievement = ACHIEVEMENTS.find(a => a.unlockRule.tag === tag && !unlockedAchievements.includes(a.id));
        if (relatedAchievement) {
          const progress = calculateProgress(relatedAchievement.unlockRule);
          const closeness = progress / relatedAchievement.unlockRule.threshold; // 0 to 1
          score += closeness * 25;
        }
      });
      
      return { ...unit, score, originalIndex: index };
    });

    // Sort to find the best seed
    scoredUnits.sort((a, b) => b.score - a.score);
    const seedUnit = scoredUnits[0];

    // 2. Build the mission around the seed
    const selectedUnits: typeof unwatchedUnits = [];
    let currentDuration = 0;
    
    // Look at unwatchedUnits starting from the seed's original index
    for (let i = seedUnit.originalIndex; i < unwatchedUnits.length; i++) {
      const unit = unwatchedUnits[i];
      
      // In thematic mode, strictly enforce tag matching if possible
      if (missionPreferences.mode === 'thematic' || specificTag) {
        const targetTag = specificTag || seedUnit.tags[0];
        if (!unit.tags.includes(targetTag)) continue;
      }
      
      if (currentDuration === 0) {
        selectedUnits.push(unit);
        currentDuration += unit.duration;
      } else {
        if (currentDuration + unit.duration <= maxMinutes + 15) {
          selectedUnits.push(unit);
          currentDuration += unit.duration;
        } else if (currentDuration < minMinutes && unit.duration <= 45) {
          selectedUnits.push(unit);
          currentDuration += unit.duration;
        } else {
          break;
        }
      }
    }

    // Fallback: If we couldn't fill minMinutes, fill with chronological items
    if (currentDuration < minMinutes && !specificTag && missionPreferences.mode !== 'thematic') {
       for (const unit of unwatchedUnits) {
         if (!selectedUnits.find(u => u.id === unit.id)) {
            if (currentDuration + unit.duration <= maxMinutes + 15) {
              selectedUnits.push(unit);
              currentDuration += unit.duration;
            } else if (currentDuration < minMinutes && unit.duration <= 45) {
              selectedUnits.push(unit);
              currentDuration += unit.duration;
            } else {
              if (currentDuration >= minMinutes) break;
            }
         }
       }
    }

    if (selectedUnits.length === 0) return;

    // Generate smart copy
    let title = '';
    let description = '';
    let rewardText = '';

    const hasEssential = selectedUnits.some(u => u.essential);
    const allSameTag = selectedUnits.length > 1 && selectedUnits.every(u => u.tags[0] === selectedUnits[0].tags[0]);
    
    if (specificTag || missionPreferences.mode === 'thematic') {
      const targetTag = specificTag || seedUnit.tags[0];
      const relatedAchievement = ACHIEVEMENTS.find(a => a.unlockRule.tag === targetTag);
      title = `Misión Temática: ${relatedAchievement ? relatedAchievement.title : 'Ruta Específica'}`;
      description = `Concéntrate en esta ruta narrativa. Tienes ${selectedUnits.length} episodios relacionados para ver hoy.`;
    } else if (isUrgent && currentDuration < 60) {
      title = `¡Vas con retraso! (${currentDuration} min)`;
      description = `Necesitas ver ~${Math.round(minutesPerDayNeeded)} min/día para llegar al estreno. Hoy toca avanzar con ${selectedUnits.length > 1 ? selectedUnits.length + ' episodios' : selectedUnits[0].title}.`;
    } else if (hasEssential && seedUnit.essential) {
      title = `Bloque Esencial: ${currentDuration} min`;
      description = `Hoy toca contenido clave para entender la película. Concéntrate en ${selectedUnits.length > 1 ? 'estos episodios' : selectedUnits[0].title}.`;
    } else if (allSameTag) {
      title = `Cerrando trama: ${currentDuration} min`;
      description = `Te conviene cerrar esta ruta narrativa antes de seguir. Tienes ${selectedUnits.length} episodios relacionados.`;
    } else {
      title = `Tu misión de hoy: ${currentDuration} min`;
      description = selectedUnits.length === 1 
        ? `Mira ${selectedUnits[0].title} y sigue avanzando sin perder el ritmo.`
        : `Completa ${selectedUnits[0].title} y ${selectedUnits.length - 1} más para cerrar este bloque.`;
    }

    // Find a relevant achievement to mention in reward
    const primaryTag = specificTag || seedUnit.tags[0];
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
      // Auto-chain next mission after a short delay
      setTimeout(() => {
        generateMission(missionPreferences.length, true);
      }, 2500);
    }
  }, [currentMission, markMultiple, completeMission, generateMission, missionPreferences.length]);

  return {
    calculateProgress,
    generateMission,
    handleCompleteMission
  };
}
