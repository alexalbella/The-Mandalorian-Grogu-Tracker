export type AchievementTier = 'bronze' | 'silver' | 'gold';

export type AchievementCategory =
  | 'mandalore' | 'hutt' | 'bounty-hunters' | 'empire' | 'new-republic' | 'thrawn' | 'meta'
  | 'sith' | 'dathomir' | 'crimson-dawn' | 'maul-meta';

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
  seriesId?: string; // if set, only evaluated/shown for this series
};
