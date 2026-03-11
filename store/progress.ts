import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  watchedItems: string[];
  filterType: 'all' | 'movie' | 'series';
  preset: 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt' | '2h' | 'essential-background' | 'movie-background';
  hideCompleted: boolean;
  searchQuery: string;
  isMuted: boolean;
  collapsedEraIds: string[];
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
  setFilterType: (filterType: ProgressState['filterType']) => void;
  setPreset: (preset: ProgressState['preset']) => void;
  setHideCompleted: (hideCompleted: boolean) => void;
  setSearchQuery: (searchQuery: string) => void;
  setIsMuted: (isMuted: boolean) => void;
  toggleEraExpanded: (eraId: string) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      watchedItems: [],
      filterType: 'all',
      preset: 'all',
      hideCompleted: false,
      searchQuery: '',
      isMuted: false,
      collapsedEraIds: [],
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
      setFilterType: (filterType) => set({ filterType }),
      setPreset: (preset) => set({ preset }),
      setHideCompleted: (hideCompleted) => set({ hideCompleted }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setIsMuted: (isMuted) => set({ isMuted }),
      toggleEraExpanded: (eraId) => set((state) => ({
        collapsedEraIds: state.collapsedEraIds.includes(eraId)
          ? state.collapsedEraIds.filter((id) => id !== eraId)
          : [...state.collapsedEraIds, eraId]
      })),
      resetProgress: () => set({ watchedItems: [] }),
    }),
    {
      name: 'mando-grogu-progress',
    }
  )
);
