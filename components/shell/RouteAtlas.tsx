'use client';

import AchievementsPanel from '../AchievementsPanel';
import FiltersBar from '../FiltersBar';
import { useAchievementsEngine } from '@/hooks/useAchievementsEngine';
import { Era } from '@/data/starwars-list';

export default function RouteAtlas({ eras, seriesId = 'mando' }: { eras: Era[]; seriesId?: string }) {
  const { calculateProgress } = useAchievementsEngine(eras, seriesId);

  return (
    <>
      <AchievementsPanel eras={eras} calculateProgress={calculateProgress} seriesId={seriesId} />
      <FiltersBar />
    </>
  );
}
