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

export type MissionMode = 'auto' | 'manual' | 'thematic';
export type MissionLength = 'short' | 'medium' | 'long' | 'marathon';

export type Mission = {
  id: string;
  generatedAt: string;
  mode: MissionMode;
  preferredLength: MissionLength;
  targetMinutes: number;
  targetItems: string[]; // ids of subItems or items
  title: string;
  description: string;
  rewardText: string;
  completed: boolean;
};
