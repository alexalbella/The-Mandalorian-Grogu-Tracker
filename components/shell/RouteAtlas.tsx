'use client';

import AchievementsPanel from '../AchievementsPanel';
import FiltersBar from '../FiltersBar';
import { useAchievementsEngine } from '@/hooks/useAchievementsEngine';
import { Era } from '@/data/starwars-list';

export default function RouteAtlas({ eras }: { eras: Era[] }) {
  const { calculateProgress } = useAchievementsEngine(eras);

  return (
    <>
      <AchievementsPanel eras={eras} calculateProgress={calculateProgress} />
      <FiltersBar />
    </>
  );
}
