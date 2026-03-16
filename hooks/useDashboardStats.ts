import { useMemo } from 'react';
import { Era } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';

export const useDashboardStats = (eras: Era[]) => {
  const { isCompleted } = useProgressStore();

  return useMemo(() => {
    const allItems = eras.flatMap(era => era.items);
    const totalItems = allItems.reduce((acc, item) => acc + (item.subItems ? item.subItems.length : 1), 0);
    const watched = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => isCompleted(sub.id)).length;
      }
      return acc + (isCompleted(item.id) ? 1 : 0);
    }, 0);
    const percent = totalItems === 0 ? 0 : Math.round((watched / totalItems) * 100);
    
    const totalMinutes = allItems.reduce((acc, item) => acc + item.duration, 0);
    const watchedMinutes = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => isCompleted(sub.id)).reduce((sum, sub) => sum + sub.duration, 0);
      }
      return acc + (isCompleted(item.id) ? item.duration : 0);
    }, 0);
    
    return {
      totalItems,
      watchedCount: watched,
      progressPercent: percent,
      totalMinutes,
      watchedMinutes,
      remainingMinutes: totalMinutes - watchedMinutes
    };
  }, [eras, isCompleted]);
};
