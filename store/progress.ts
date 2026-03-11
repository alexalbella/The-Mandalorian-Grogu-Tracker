import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  watchedItems: string[];
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      watchedItems: [],
      toggleItem: (id) => set((state) => ({
        watchedItems: state.watchedItems.includes(id)
          ? state.watchedItems.filter(i => i !== id)
          : [...state.watchedItems, id]
      })),
      markMultiple: (ids) => set((state) => {
        const newItems = new Set([...state.watchedItems, ...ids]);
        return { watchedItems: Array.from(newItems) };
      }),
      unmarkMultiple: (ids) => set((state) => ({
        watchedItems: state.watchedItems.filter(i => !ids.includes(i))
      })),
      resetProgress: () => set({ watchedItems: [] }),
    }),
    {
      name: 'mando-grogu-progress',
    }
  )
);
