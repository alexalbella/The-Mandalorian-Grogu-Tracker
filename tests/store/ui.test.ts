import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/store/ui';

const resetStore = () => {
  useUIStore.setState({
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
  });
};

describe('UI Store', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('filters', () => {
    it('should set filter type', () => {
      useUIStore.getState().setFilterType('movie');
      expect(useUIStore.getState().filterType).toBe('movie');
    });

    it('should set preset', () => {
      useUIStore.getState().setPreset('essential');
      expect(useUIStore.getState().preset).toBe('essential');
    });

    it('should toggle hideCompleted', () => {
      useUIStore.getState().setHideCompleted(true);
      expect(useUIStore.getState().hideCompleted).toBe(true);
    });

    it('should set search query', () => {
      useUIStore.getState().setSearchQuery('mandalorian');
      expect(useUIStore.getState().searchQuery).toBe('mandalorian');
    });
  });

  describe('era expansion', () => {
    it('should toggle era expanded state', () => {
      useUIStore.getState().toggleEraExpanded('era1');
      expect(useUIStore.getState().expandedEras['era1']).toBe(true);

      useUIStore.getState().toggleEraExpanded('era1');
      expect(useUIStore.getState().expandedEras['era1']).toBe(false);
    });

    it('should set era expanded explicitly', () => {
      useUIStore.getState().setEraExpanded('era2', true);
      expect(useUIStore.getState().expandedEras['era2']).toBe(true);

      useUIStore.getState().setEraExpanded('era2', false);
      expect(useUIStore.getState().expandedEras['era2']).toBe(false);
    });
  });

  describe('recentlyTouched', () => {
    it('should add item to front of recentlyTouched', () => {
      useUIStore.getState().addRecentlyTouched('ep1');
      useUIStore.getState().addRecentlyTouched('ep2');
      expect(useUIStore.getState().recentlyTouched[0]).toBe('ep2');
      expect(useUIStore.getState().recentlyTouched[1]).toBe('ep1');
    });

    it('should not duplicate items in recentlyTouched', () => {
      useUIStore.getState().addRecentlyTouched('ep1');
      useUIStore.getState().addRecentlyTouched('ep2');
      useUIStore.getState().addRecentlyTouched('ep1');
      const touched = useUIStore.getState().recentlyTouched;
      expect(touched.filter(i => i === 'ep1')).toHaveLength(1);
      expect(touched[0]).toBe('ep1');
    });

    it('should limit recentlyTouched to 10 items', () => {
      for (let i = 0; i < 15; i++) {
        useUIStore.getState().addRecentlyTouched(`item-${i}`);
      }
      expect(useUIStore.getState().recentlyTouched).toHaveLength(10);
    });
  });

  describe('toasts', () => {
    it('should add a toast', () => {
      useUIStore.getState().addToast('mandalore-bronze');
      expect(useUIStore.getState().toasts).toHaveLength(1);
      expect(useUIStore.getState().toasts[0].achievementId).toBe('mandalore-bronze');
    });

    it('should remove a toast by id', () => {
      useUIStore.getState().addToast('mandalore-bronze');
      const toastId = useUIStore.getState().toasts[0].id;
      useUIStore.getState().removeToast(toastId);
      expect(useUIStore.getState().toasts).toHaveLength(0);
    });
  });

  describe('view modes', () => {
    it('should toggle reducedMotion', () => {
      useUIStore.getState().setReducedMotion(true);
      expect(useUIStore.getState().reducedMotion).toBe(true);
    });

    it('should toggle compactMode', () => {
      useUIStore.getState().setCompactMode(true);
      expect(useUIStore.getState().compactMode).toBe(true);
    });

    it('should toggle focusMode', () => {
      useUIStore.getState().setFocusMode(true);
      expect(useUIStore.getState().focusMode).toBe(true);
    });
  });
});
