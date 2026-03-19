import { useMemo } from 'react';
import { Era } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';

export const useDashboardStats = (eras: Era[]) => {
  const { isCompleted, watchedItems } = useProgressStore();
  const selectedRoute = useUIStore(state => state.selectedRoute);

  return useMemo(() => {
    let allItems = eras.flatMap(era => era.items);
    
    if (selectedRoute) {
      allItems = allItems.filter(item => item.tags.includes(selectedRoute));
    }

    const totalItems = allItems.reduce((acc, item) => acc + (item.subItems ? item.subItems.length : 1), 0);
    
    const completedCount = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => isCompleted(sub.id)).length;
      }
      return acc + (isCompleted(item.id) ? 1 : 0);
    }, 0);
    
    const watchedCount = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => watchedItems.includes(sub.id)).length;
      }
      return acc + (watchedItems.includes(item.id) ? 1 : 0);
    }, 0);
    
    const percent = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);
    
    const totalMinutes = allItems.reduce((acc, item) => acc + item.duration, 0);
    
    const watchedMinutes = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => watchedItems.includes(sub.id)).reduce((sum, sub) => sum + sub.duration, 0);
      }
      return acc + (watchedItems.includes(item.id) ? item.duration : 0);
    }, 0);
    
    const completedMinutes = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => isCompleted(sub.id)).reduce((sum, sub) => sum + sub.duration, 0);
      }
      return acc + (isCompleted(item.id) ? item.duration : 0);
    }, 0);
    
    return {
      totalItems,
      completedCount,
      watchedCount,
      progressPercent: percent,
      totalMinutes,
      watchedMinutes,
      completedMinutes,
      remainingMinutes: totalMinutes - completedMinutes
    };
  }, [eras, isCompleted, watchedItems, selectedRoute]);
};
