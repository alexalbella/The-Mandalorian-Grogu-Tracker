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
import UndoRedoWidget from './UndoRedoWidget';

import { motion } from 'motion/react';

export default function AppShell({ eras }: { eras: Era[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const reducedMotion = useUIStore(state => state.reducedMotion);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    // Scroll to last viewed item on mount
    const savedLastViewedId = useUIStore.getState().lastViewedId;
    if (savedLastViewedId) {
      setTimeout(() => {
        const element = document.getElementById(savedLastViewedId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          useUIStore.getState().setSelectedCard(savedLastViewedId);
          setTimeout(() => {
            useUIStore.getState().setSelectedCard(null);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-12 min-w-0"
      >
        <motion.div variants={itemVariants}>
          <HeaderHUD eras={eras} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <QuickLookDrawer eras={eras} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <StatsPanel eras={eras} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <RouteAtlas eras={eras} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Timeline eras={eras} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DataManagementPanel />
        </motion.div>
        
        <motion.footer variants={itemVariants} className="pt-8 pb-24 text-center border-t border-surface-4 text-text-muted text-sm">
          <p>Que la Fuerza te acompañe. Este es el camino.</p>
        </motion.footer>
      </motion.div>

      <ProgressRail eras={eras} />
      <UndoRedoWidget />
    </div>
  );
}
