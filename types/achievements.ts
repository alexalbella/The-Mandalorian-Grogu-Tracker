export type AchievementTier = 'bronze' | 'silver' | 'gold';

export type AchievementCategory = 'mandalore' | 'hutt' | 'bounty-hunters' | 'empire' | 'new-republic' | 'thrawn' | 'meta';

export type Achievement = {
  id: string;
  category: AchievementCategory;
  title: string;
  shortTitle: string;
  description: string;
  tier: AchievementTier;
  icon: string;
  accentClass: string;
  unlockRule: {
    type: 'tagProgress' | 'globalProgress';
    tag?: string;
    threshold: number; // 25, 50, 100
  };
};
