import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AchievementsState {
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set) => ({
      unlockedAchievements: [],
      unlockAchievement: (id) => set((state) => ({
        unlockedAchievements: state.unlockedAchievements.includes(id) 
          ? state.unlockedAchievements 
          : [...state.unlockedAchievements, id]
      })),
    }),
    {
      name: 'mando-grogu-achievements',
    }
  )
);
