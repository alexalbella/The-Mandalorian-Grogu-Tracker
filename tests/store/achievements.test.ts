import { describe, it, expect, beforeEach } from 'vitest';
import { useAchievementsStore } from '@/store/achievements';

const resetStore = () => {
  useAchievementsStore.setState({ unlockedAchievements: [] });
};

describe('Achievements Store', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should start with no unlocked achievements', () => {
    expect(useAchievementsStore.getState().unlockedAchievements).toEqual([]);
  });

  it('should unlock an achievement', () => {
    useAchievementsStore.getState().unlockAchievement('mandalore-bronze');
    expect(useAchievementsStore.getState().unlockedAchievements).toContain('mandalore-bronze');
  });

  it('should not duplicate an already unlocked achievement', () => {
    useAchievementsStore.getState().unlockAchievement('mandalore-bronze');
    useAchievementsStore.getState().unlockAchievement('mandalore-bronze');
    const unlocked = useAchievementsStore.getState().unlockedAchievements;
    expect(unlocked.filter(a => a === 'mandalore-bronze')).toHaveLength(1);
  });

  it('should unlock multiple different achievements', () => {
    useAchievementsStore.getState().unlockAchievement('mandalore-bronze');
    useAchievementsStore.getState().unlockAchievement('hutt-bronze');
    useAchievementsStore.getState().unlockAchievement('empire-silver');

    const unlocked = useAchievementsStore.getState().unlockedAchievements;
    expect(unlocked).toHaveLength(3);
    expect(unlocked).toEqual(expect.arrayContaining([
      'mandalore-bronze', 'hutt-bronze', 'empire-silver'
    ]));
  });
});
