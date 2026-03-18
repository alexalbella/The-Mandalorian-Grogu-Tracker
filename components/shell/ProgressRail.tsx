'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Era } from '@/data/starwars-list';
import DarksaberProgress from './DarksaberProgress';

export default function ProgressRail({ eras }: { eras: Era[] }) {
  const { progressPercent, watchedCount, totalItems } = useDashboardStats(eras);

  // Dynamic glow based on progress
  const glowOpacity = Math.max(0.05, Math.min(0.2, progressPercent / 100));

  return (
    <aside className="hidden lg:flex flex-col items-center w-24 shrink-0 pt-8">
      <div className="sticky top-24 flex flex-col items-center gap-6 h-[calc(100vh-8rem)] starfield rounded-2xl p-4 border border-surface-4/30 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000" style={{ opacity: glowOpacity }}>
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-glow-success blur-[50px]" />
        </div>
        
        <div className="text-center space-y-1 relative z-10">
          <div className="text-xs font-mono text-text-muted uppercase tracking-widest">Progreso</div>
          <div className="text-2xl font-bold text-glow-success">{progressPercent}%</div>
        </div>
        
        {/* Vertical Darksaber */}
        <DarksaberProgress progress={progressPercent} orientation="vertical" className="flex-1" />
        
        <div className="text-xs font-mono text-text-muted">
          {watchedCount}/{totalItems}
        </div>
      </div>
    </aside>
  );
}
