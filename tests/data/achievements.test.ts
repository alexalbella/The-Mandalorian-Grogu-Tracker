import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS } from '@/data/achievements';

describe('Achievements data', () => {
  it('should have unique ids', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have valid tiers', () => {
    const validTiers = ['bronze', 'silver', 'gold'];
    ACHIEVEMENTS.forEach(a => {
      expect(validTiers).toContain(a.tier);
    });
  });

  it('should have thresholds between 1 and 100', () => {
    ACHIEVEMENTS.forEach(a => {
      expect(a.unlockRule.threshold).toBeGreaterThanOrEqual(1);
      expect(a.unlockRule.threshold).toBeLessThanOrEqual(100);
    });
  });

  it('should have valid unlock rule types', () => {
    const validTypes = ['tagProgress', 'globalProgress'];
    ACHIEVEMENTS.forEach(a => {
      expect(validTypes).toContain(a.unlockRule.type);
    });
  });

  it('tagProgress achievements should have a tag defined', () => {
    ACHIEVEMENTS
      .filter(a => a.unlockRule.type === 'tagProgress')
      .forEach(a => {
        expect(a.unlockRule.tag).toBeDefined();
        expect(a.unlockRule.tag!.length).toBeGreaterThan(0);
      });
  });

  it('should have a meta-gold achievement for 100% completion', () => {
    const meta = ACHIEVEMENTS.find(a => a.id === 'meta-gold');
    expect(meta).toBeDefined();
    expect(meta!.unlockRule.type).toBe('globalProgress');
    expect(meta!.unlockRule.threshold).toBe(100);
  });

  it('each category should have bronze, silver and gold tiers', () => {
    const categories = [...new Set(ACHIEVEMENTS.map(a => a.category))].filter(c => c !== 'meta');
    categories.forEach(cat => {
      const tiers = ACHIEVEMENTS.filter(a => a.category === cat).map(a => a.tier);
      expect(tiers).toContain('bronze');
      expect(tiers).toContain('silver');
      expect(tiers).toContain('gold');
    });
  });
});
