'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/ui';

export default function ShellBoot() {
  useEffect(() => {
    const savedLastViewedId = useUIStore.getState().lastViewedId;
    if (!savedLastViewedId) return;

    const timer = window.setTimeout(() => {
      const element = document.getElementById(savedLastViewedId);
      if (!element) return;

      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add(
        'ring-2',
        'ring-glow-success',
        'ring-offset-4',
        'ring-offset-surface-1',
        'transition-all',
        'duration-500',
        'rounded-xl'
      );

      window.setTimeout(() => {
        element.classList.remove('ring-2', 'ring-glow-success', 'ring-offset-4', 'ring-offset-surface-1');
      }, 2000);
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
