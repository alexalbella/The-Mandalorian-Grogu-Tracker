import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Preset = 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt' | 'essential-background' | 'movie-background';

interface UIState {
  filterType: 'all' | 'movie' | 'series';
  preset: Preset;
  hideCompleted: boolean;
  searchQuery: string;
  isMuted: boolean;
  expandedEras: Record<string, boolean>;
  lastViewedId: string | null;
  setFilterType: (type: 'all' | 'movie' | 'series') => void;
  setPreset: (preset: Preset) => void;
  setHideCompleted: (hide: boolean) => void;
  setSearchQuery: (query: string) => void;
  setIsMuted: (muted: boolean) => void;
  toggleEraExpanded: (eraId: string) => void;
  setEraExpanded: (eraId: string, expanded: boolean) => void;
  setLastViewedId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      filterType: 'all',
      preset: 'all',
      hideCompleted: false,
      searchQuery: '',
      isMuted: false,
      expandedEras: {},
      lastViewedId: null,
      setFilterType: (type) => set({ filterType: type }),
      setPreset: (preset) => set({ preset }),
      setHideCompleted: (hide) => set({ hideCompleted: hide }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setIsMuted: (muted) => set({ isMuted: muted }),
      toggleEraExpanded: (eraId) => set((state) => ({
        expandedEras: { ...state.expandedEras, [eraId]: !state.expandedEras[eraId] }
      })),
      setEraExpanded: (eraId, expanded) => set((state) => ({
        expandedEras: { ...state.expandedEras, [eraId]: expanded }
      })),
      setLastViewedId: (id) => set({ lastViewedId: id }),
    }),
    {
      name: 'mando-grogu-ui',
    }
  )
);
