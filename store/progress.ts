import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  watchedItems: string[];
  skippedItems: string[];
  streak: number;
  lastWatchedDate: string | null;
  toggleItem: (id: string) => void;
  skipItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
  resetProgress: () => void;
  isCompleted: (id: string) => boolean;
  getCompletedItems: () => string[];
}

const updateStreak = (state: ProgressState) => {
  const today = new Date().toISOString().split('T')[0];
  if (state.lastWatchedDate === today) {
    return { streak: state.streak, lastWatchedDate: state.lastWatchedDate };
  }
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (state.lastWatchedDate === yesterday) {
    return { streak: state.streak + 1, lastWatchedDate: today };
  }
  
  return { streak: 1, lastWatchedDate: today };
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      watchedItems: [],
      skippedItems: [],
      streak: 0,
      lastWatchedDate: null,
      toggleItem: (id) => set((state) => {
        const isAdding = !state.watchedItems.includes(id);
        const newItems = isAdding
          ? [...state.watchedItems, id]
          : state.watchedItems.filter(i => i !== id);
          
        return {
          watchedItems: newItems,
          skippedItems: state.skippedItems.filter(i => i !== id), // Remove from skipped if watched
          ...(isAdding ? updateStreak(state) : {})
        };
      }),
      skipItem: (id) => set((state) => {
        const isAdding = !state.skippedItems.includes(id);
        const newSkipped = isAdding
          ? [...state.skippedItems, id]
          : state.skippedItems.filter(i => i !== id);
          
        return {
          skippedItems: newSkipped,
          watchedItems: state.watchedItems.filter(i => i !== id), // Remove from watched if skipped
        };
      }),
      markMultiple: (ids) => set((state) => {
        const newItems = new Set([...state.watchedItems, ...ids]);
        return { 
          watchedItems: Array.from(newItems),
          skippedItems: state.skippedItems.filter(i => !ids.includes(i)),
          ...updateStreak(state)
        };
      }),
      unmarkMultiple: (ids) => set((state) => ({
        watchedItems: state.watchedItems.filter(i => !ids.includes(i)),
        skippedItems: state.skippedItems.filter(i => !ids.includes(i))
      })),
      resetProgress: () => set({ watchedItems: [], skippedItems: [], streak: 0, lastWatchedDate: null }),
      isCompleted: (id) => get().watchedItems.includes(id) || get().skippedItems.includes(id),
      getCompletedItems: () => [...get().watchedItems, ...get().skippedItems],
    }),
    {
      name: 'mando-grogu-progress',
    }
  )
);
