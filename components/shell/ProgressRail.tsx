'use client';

import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Era } from '@/data/starwars-list';
import DarksaberProgress from './DarksaberProgress';
import { motion, useScroll, useSpring } from 'motion/react';

export default function ProgressRail({ eras }: { eras: Era[] }) {
  const { progressPercent, watchedCount, totalItems } = useDashboardStats(eras);
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <aside className="hidden lg:flex flex-col items-center w-24 shrink-0 pt-8 relative">
      {/* Scroll position indicator */}
      <div className="absolute left-0 top-8 bottom-0 w-[2px] bg-surface-4/20 rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-glow-success/40 origin-top"
          style={{ scaleY, height: '100%' }}
        />
      </div>

      <div className="sticky top-24 flex flex-col items-center gap-5 h-[calc(100vh-8rem)] bg-surface-2/20 border border-surface-4/30 rounded-sm p-4 ml-4 relative overflow-hidden">
        <div className="text-center space-y-0.5 relative z-10">
          <div className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Progreso</div>
          <div className="text-xl font-display font-semibold text-glow-success">{progressPercent}%</div>
        </div>

        {/* Vertical progress bar */}
        <DarksaberProgress progress={progressPercent} orientation="vertical" className="flex-1" />

        <div className="text-[9px] font-mono text-text-muted relative z-10 tabular-nums">
          {watchedCount}/{totalItems}
        </div>
      </div>
    </aside>
  );
}
