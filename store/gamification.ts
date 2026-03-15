import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Mission, MissionMode, MissionLength } from '@/types/gamification';

interface GamificationState {
  unlockedAchievements: string[];
  unlockAchievement: (id: string) => void;
  
  currentMission: Mission | null;
  setMission: (mission: Mission | null) => void;
  completeMission: () => void;
  
  missionPreferences: {
    mode: MissionMode;
    length: MissionLength;
  };
  setMissionPreferences: (prefs: Partial<{ mode: MissionMode; length: MissionLength }>) => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set) => ({
      unlockedAchievements: [],
      unlockAchievement: (id) => set((state) => ({
        unlockedAchievements: state.unlockedAchievements.includes(id) 
          ? state.unlockedAchievements 
          : [...state.unlockedAchievements, id]
      })),
      
      currentMission: null,
      setMission: (mission) => set({ currentMission: mission }),
      completeMission: () => set((state) => ({
        currentMission: state.currentMission ? { ...state.currentMission, completed: true } : null
      })),
      
      missionPreferences: {
        mode: 'auto',
        length: 'medium'
      },
      setMissionPreferences: (prefs) => set((state) => ({
        missionPreferences: { ...state.missionPreferences, ...prefs }
      }))
    }),
    {
      name: 'mando-grogu-gamification',
    }
  )
);
