import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  watchedItems: string[];
  skippedItems: string[];
  streak: number;
  lastWatchedDate: string | null;
  
  // History for undo/redo
  history: { watchedItems: string[], skippedItems: string[] }[];
  historyIndex: number;
  
  toggleItem: (id: string) => void;
  skipItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
  resetProgress: () => void;
  isCompleted: (id: string) => boolean;
  isWatched: (id: string) => boolean;
  getCompletedItems: () => string[];
  
  undo: () => void;
  redo: () => void;
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

const saveHistory = (state: ProgressState, newWatched: string[], newSkipped: string[]) => {
  const newHistoryEntry = { watchedItems: newWatched, skippedItems: newSkipped };
  const newHistory = [
    ...state.history.slice(0, state.historyIndex + 1),
    newHistoryEntry
  ].slice(-20); // Keep last 20 states
  
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1
  };
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      watchedItems: [],
      skippedItems: [],
      streak: 0,
      lastWatchedDate: null,
      history: [{ watchedItems: [], skippedItems: [] }],
      historyIndex: 0,
      
      toggleItem: (id) => set((state) => {
        const isAdding = !state.watchedItems.includes(id);
        const newItems = isAdding
          ? [...state.watchedItems, id]
          : state.watchedItems.filter(i => i !== id);
          
        const newSkipped = state.skippedItems.filter(i => i !== id);
          
        return {
          watchedItems: newItems,
          skippedItems: newSkipped,
          ...updateStreak(state),
          ...saveHistory(state, newItems, newSkipped)
        };
      }),
      skipItem: (id) => set((state) => {
        const isAdding = !state.skippedItems.includes(id);
        const newSkipped = isAdding
          ? [...state.skippedItems, id]
          : state.skippedItems.filter(i => i !== id);
          
        const newWatched = state.watchedItems.filter(i => i !== id);
          
        return {
          skippedItems: newSkipped,
          watchedItems: newWatched,
          ...saveHistory(state, newWatched, newSkipped)
        };
      }),
      markMultiple: (ids) => set((state) => {
        const newItems = Array.from(new Set([...state.watchedItems, ...ids]));
        const newSkipped = state.skippedItems.filter(i => !ids.includes(i));
        
        return { 
          watchedItems: newItems,
          skippedItems: newSkipped,
          ...updateStreak(state),
          ...saveHistory(state, newItems, newSkipped)
        };
      }),
      unmarkMultiple: (ids) => set((state) => {
        const newWatched = state.watchedItems.filter(i => !ids.includes(i));
        const newSkipped = state.skippedItems.filter(i => !ids.includes(i));
        
        return {
          watchedItems: newWatched,
          skippedItems: newSkipped,
          ...saveHistory(state, newWatched, newSkipped)
        };
      }),
      resetProgress: () => set((state) => ({ 
        watchedItems: [], 
        skippedItems: [], 
        streak: 0, 
        lastWatchedDate: null,
        ...saveHistory(state, [], [])
      })),
      isCompleted: (id) => get().watchedItems.includes(id) || get().skippedItems.includes(id),
      isWatched: (id) => get().watchedItems.includes(id),
      getCompletedItems: () => [...get().watchedItems, ...get().skippedItems],
      
      undo: () => set((state) => {
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          const previousState = state.history[newIndex];
          return {
            watchedItems: previousState.watchedItems,
            skippedItems: previousState.skippedItems,
            historyIndex: newIndex
          };
        }
        return state;
      }),
      redo: () => set((state) => {
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          const nextState = state.history[newIndex];
          return {
            watchedItems: nextState.watchedItems,
            skippedItems: nextState.skippedItems,
            historyIndex: newIndex
          };
        }
        return state;
      }),
    }),
    {
      name: 'mando-grogu-progress',
    }
  )
);
