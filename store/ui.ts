import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Preset = 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt' | 'bounty-hunters' | 'new-republic' | 'essential-background' | 'movie-background';

interface UIState {
  filterType: 'all' | 'movie' | 'series';
  preset: Preset;
  hideCompleted: boolean;
  searchQuery: string;
  isMuted: boolean;
  expandedEras: Record<string, boolean>;
  lastViewedId: string | null;
  
  // Interaction memory
  selectedRoute: string | null;
  selectedCard: string | null;
  quickLookOpen: boolean;
  reducedMotion: boolean;
  compactMode: boolean;
  focusMode: boolean;
  recentlyTouched: string[];
  toasts: { id: string; achievementId: string }[];
  
  setFilterType: (type: 'all' | 'movie' | 'series') => void;
  setPreset: (preset: Preset) => void;
  setHideCompleted: (hide: boolean) => void;
  setSearchQuery: (query: string) => void;
  setIsMuted: (muted: boolean) => void;
  toggleEraExpanded: (eraId: string) => void;
  setEraExpanded: (eraId: string, expanded: boolean) => void;
  setLastViewedId: (id: string | null) => void;
  
  setSelectedRoute: (route: string | null) => void;
  setSelectedCard: (id: string | null) => void;
  setQuickLookOpen: (open: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  setFocusMode: (focus: boolean) => void;
  addRecentlyTouched: (id: string) => void;
  addToast: (achievementId: string) => void;
  removeToast: (id: string) => void;
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
      
      selectedRoute: null,
      selectedCard: null,
      quickLookOpen: false,
      reducedMotion: false,
      compactMode: false,
      focusMode: false,
      recentlyTouched: [],
      toasts: [],
      
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
      
      setSelectedRoute: (route) => set({ selectedRoute: route }),
      setSelectedCard: (id) => set({ selectedCard: id }),
      setQuickLookOpen: (open) => set({ quickLookOpen: open }),
      setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
      setCompactMode: (compact) => set({ compactMode: compact }),
      setFocusMode: (focus) => set({ focusMode: focus }),
      addRecentlyTouched: (id) => set((state) => {
        const newTouched = [id, ...state.recentlyTouched.filter(i => i !== id)].slice(0, 10);
        return { recentlyTouched: newTouched };
      }),
      addToast: (achievementId) => set((state) => ({
        toasts: [...state.toasts, { id: Math.random().toString(36).substring(7), achievementId }]
      })),
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      })),
    }),
    {
      name: 'mando-grogu-ui',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['toasts'].includes(key))
      ),
    }
  )
);
