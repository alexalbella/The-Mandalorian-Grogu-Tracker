'use client';

import { useState, useEffect } from 'react';
import { Era } from '@/data/starwars-list';
import { useUIStore } from '@/store/ui';
import HeaderHUD from './HeaderHUD';
import QuickLookDrawer from './QuickLookDrawer';
import { StatsPanel, DataManagementPanel } from './DataPanel';
import RouteAtlas from './RouteAtlas';
import Timeline from './Timeline';
import ProgressRail from './ProgressRail';

export default function AppShell({ eras }: { eras: Era[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Scroll to last viewed item on mount
    const savedLastViewedId = useUIStore.getState().lastViewedId;
    if (savedLastViewedId) {
      setTimeout(() => {
        const element = document.getElementById(savedLastViewedId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-glow-success', 'ring-offset-4', 'ring-offset-surface-1', 'transition-all', 'duration-500', 'rounded-xl');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-glow-success', 'ring-offset-4', 'ring-offset-surface-1');
          }, 2000);
        }
      }, 500);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 animate-pulse">
        <div className="flex-1 space-y-12 min-w-0">
          <div className="h-32 bg-surface-2/50 rounded-2xl border border-surface-4/50"></div>
          <div className="h-64 bg-surface-2/50 rounded-2xl border border-surface-4/50"></div>
          <div className="h-96 bg-surface-2/50 rounded-2xl border border-surface-4/50"></div>
        </div>
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="h-64 bg-surface-2/50 rounded-2xl border border-surface-4/50"></div>
          <div className="h-64 bg-surface-2/50 rounded-2xl border border-surface-4/50"></div>
        </aside>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-12 min-w-0">
        <HeaderHUD eras={eras} />
        
        <QuickLookDrawer eras={eras} />
        
        <StatsPanel eras={eras} />
        
        <RouteAtlas eras={eras} />
        
        <Timeline eras={eras} />
        
        <DataManagementPanel />
        
        <footer className="pt-8 pb-24 text-center border-t border-surface-4 text-text-muted text-sm">
          <p>Que la Fuerza te acompañe. Este es el camino.</p>
        </footer>
      </div>

      <ProgressRail eras={eras} />
    </div>
  );
}
