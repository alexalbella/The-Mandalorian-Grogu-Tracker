import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '@/store/progress';

const resetStore = () => {
  useProgressStore.setState({
    watchedItems: [],
    skippedItems: [],
    streak: 0,
    lastWatchedDate: null,
    history: [{ watchedItems: [], skippedItems: [] }],
    historyIndex: 0,
  });
};

describe('Progress Store', () => {
  beforeEach(() => {
    resetStore();
  });

  describe('toggleItem', () => {
    it('should add an item to watchedItems', () => {
      useProgressStore.getState().toggleItem('ep1');
      expect(useProgressStore.getState().watchedItems).toContain('ep1');
    });

    it('should remove an item from watchedItems when toggled again', () => {
      useProgressStore.getState().toggleItem('ep1');
      useProgressStore.getState().toggleItem('ep1');
      expect(useProgressStore.getState().watchedItems).not.toContain('ep1');
    });

    it('should remove item from skippedItems when watching it', () => {
      useProgressStore.getState().skipItem('ep1');
      expect(useProgressStore.getState().skippedItems).toContain('ep1');

      useProgressStore.getState().toggleItem('ep1');
      expect(useProgressStore.getState().skippedItems).not.toContain('ep1');
      expect(useProgressStore.getState().watchedItems).toContain('ep1');
    });
  });

  describe('skipItem', () => {
    it('should add an item to skippedItems', () => {
      useProgressStore.getState().skipItem('ep1');
      expect(useProgressStore.getState().skippedItems).toContain('ep1');
    });

    it('should remove an item from skippedItems when toggled again', () => {
      useProgressStore.getState().skipItem('ep1');
      useProgressStore.getState().skipItem('ep1');
      expect(useProgressStore.getState().skippedItems).not.toContain('ep1');
    });

    it('should remove item from watchedItems when skipping it', () => {
      useProgressStore.getState().toggleItem('ep1');
      expect(useProgressStore.getState().watchedItems).toContain('ep1');

      useProgressStore.getState().skipItem('ep1');
      expect(useProgressStore.getState().watchedItems).not.toContain('ep1');
      expect(useProgressStore.getState().skippedItems).toContain('ep1');
    });
  });

  describe('markMultiple / unmarkMultiple', () => {
    it('should mark multiple items as watched', () => {
      useProgressStore.getState().markMultiple(['ep1', 'ep2', 'ep3']);
      const { watchedItems } = useProgressStore.getState();
      expect(watchedItems).toEqual(expect.arrayContaining(['ep1', 'ep2', 'ep3']));
    });

    it('should not duplicate items when marking already watched', () => {
      useProgressStore.getState().toggleItem('ep1');
      useProgressStore.getState().markMultiple(['ep1', 'ep2']);
      const { watchedItems } = useProgressStore.getState();
      expect(watchedItems.filter(i => i === 'ep1')).toHaveLength(1);
    });

    it('should remove items from skippedItems when marking as watched', () => {
      useProgressStore.getState().skipItem('ep1');
      useProgressStore.getState().markMultiple(['ep1', 'ep2']);
      expect(useProgressStore.getState().skippedItems).not.toContain('ep1');
      expect(useProgressStore.getState().watchedItems).toContain('ep1');
    });

    it('should unmark multiple items from both watched and skipped', () => {
      useProgressStore.getState().markMultiple(['ep1', 'ep2']);
      useProgressStore.getState().skipItem('ep3');
      useProgressStore.getState().unmarkMultiple(['ep1', 'ep3']);

      const state = useProgressStore.getState();
      expect(state.watchedItems).not.toContain('ep1');
      expect(state.watchedItems).toContain('ep2');
      expect(state.skippedItems).not.toContain('ep3');
    });
  });

  describe('isCompleted / isWatched', () => {
    it('should return true for watched items', () => {
      useProgressStore.getState().toggleItem('ep1');
      expect(useProgressStore.getState().isCompleted('ep1')).toBe(true);
      expect(useProgressStore.getState().isWatched('ep1')).toBe(true);
    });

    it('should return isCompleted=true but isWatched=false for skipped items', () => {
      useProgressStore.getState().skipItem('ep1');
      expect(useProgressStore.getState().isCompleted('ep1')).toBe(true);
      expect(useProgressStore.getState().isWatched('ep1')).toBe(false);
    });

    it('should return false for items not interacted with', () => {
      expect(useProgressStore.getState().isCompleted('ep1')).toBe(false);
      expect(useProgressStore.getState().isWatched('ep1')).toBe(false);
    });
  });

  describe('getCompletedItems', () => {
    it('should return both watched and skipped items', () => {
      useProgressStore.getState().toggleItem('ep1');
      useProgressStore.getState().skipItem('ep2');
      const completed = useProgressStore.getState().getCompletedItems();
      expect(completed).toEqual(expect.arrayContaining(['ep1', 'ep2']));
    });
  });

  describe('resetProgress', () => {
    it('should clear all progress and streak', () => {
      useProgressStore.getState().toggleItem('ep1');
      useProgressStore.getState().skipItem('ep2');
      useProgressStore.getState().resetProgress();

      const state = useProgressStore.getState();
      expect(state.watchedItems).toEqual([]);
      expect(state.skippedItems).toEqual([]);
      expect(state.streak).toBe(0);
      expect(state.lastWatchedDate).toBeNull();
    });
  });

  describe('undo / redo', () => {
    it('should undo the last action', () => {
      useProgressStore.getState().toggleItem('ep1');
      expect(useProgressStore.getState().watchedItems).toContain('ep1');

      useProgressStore.getState().undo();
      expect(useProgressStore.getState().watchedItems).not.toContain('ep1');
    });

    it('should redo an undone action', () => {
      useProgressStore.getState().toggleItem('ep1');
      useProgressStore.getState().undo();
      useProgressStore.getState().redo();
      expect(useProgressStore.getState().watchedItems).toContain('ep1');
    });

    it('should not undo past the initial state', () => {
      useProgressStore.getState().undo();
      expect(useProgressStore.getState().watchedItems).toEqual([]);
    });

    it('should not redo when at latest state', () => {
      useProgressStore.getState().toggleItem('ep1');
      useProgressStore.getState().redo();
      expect(useProgressStore.getState().watchedItems).toEqual(['ep1']);
    });

    it('should discard redo history after a new action post-undo', () => {
      useProgressStore.getState().toggleItem('ep1');
      useProgressStore.getState().toggleItem('ep2');
      useProgressStore.getState().undo(); // undo ep2

      useProgressStore.getState().toggleItem('ep3'); // new action
      useProgressStore.getState().redo(); // should have nothing to redo
      expect(useProgressStore.getState().watchedItems).not.toContain('ep2');
      expect(useProgressStore.getState().watchedItems).toContain('ep3');
    });

    it('should limit history to 20 entries', () => {
      for (let i = 0; i < 25; i++) {
        useProgressStore.getState().toggleItem(`item-${i}`);
      }
      expect(useProgressStore.getState().history.length).toBeLessThanOrEqual(20);
    });
  });
});
