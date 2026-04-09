'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, LayoutGrid, LayoutList, Zap, ZapOff, Eye, Clock } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Era } from '@/data/starwars-list';
import dynamic from 'next/dynamic';
import DarksaberProgress from './DarksaberProgress';
import { AnimatePresence, motion } from 'motion/react';
import { SeriesConfig } from '@/types/series';

const CountdownWidget = dynamic(() => import('../CountdownWidget'), { ssr: false });

function ViewModeSelector({ idPrefix = '' }: { idPrefix?: string }) {
  const { compactMode, setCompactMode, focusMode, setFocusMode, chronologicalMode, setChronologicalMode } = useUIStore();

  const currentMode = chronologicalMode ? 'chrono' : focusMode ? 'focus' : compactMode ? 'compact' : 'normal';

  const setMode = (mode: 'normal' | 'compact' | 'focus' | 'chrono') => {
    setChronologicalMode(mode === 'chrono');
    setFocusMode(mode === 'focus');
    setCompactMode(mode === 'compact');
  };

  const modes = [
    { id: 'normal',   label: 'Normal',    icon: LayoutGrid },
    { id: 'compact',  label: 'Compacto',  icon: LayoutList },
    { id: 'focus',    label: 'Focus',     icon: Eye },
    { id: 'chrono',   label: 'Cronología', icon: Clock },
  ];

  return (
    <div className="flex bg-surface-3/60 border border-surface-4/60 rounded-sm p-0.5 relative">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => setMode(mode.id as 'normal' | 'compact' | 'focus' | 'chrono')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-colors z-10 ${isActive ? 'text-surface-1 font-bold' : 'text-text-muted hover:text-text-body'}`}
          >
            {isActive && (
              <motion.div
                layoutId={`activeMode-${idPrefix}`}
                className="absolute inset-0 bg-glow-success rounded-sm -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-3 h-3" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function HeaderHUD({ config }: { config: SeriesConfig }) {
  const { isMuted, setIsMuted, reducedMotion, setReducedMotion } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { progressPercent, remainingMinutes } = useDashboardStats(config.eras);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 lg:top-4 z-50 border-b lg:border border-surface-4/60 bg-surface-1/95 -mx-4 px-4 lg:mx-0 lg:px-6 lg:rounded-sm transition-all duration-300 ${isScrolled ? 'pt-2 pb-2' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between relative">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {!isScrolled ? (
              <motion.div
                key="full-header"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-text-muted font-mono">Vista</span>
                    <ViewModeSelector idPrefix="full" />
                  </div>

                  <div className="w-px h-5 bg-surface-4/60 hidden sm:block" />

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setReducedMotion(!reducedMotion)}
                      className={`p-1.5 rounded-sm border transition-colors ${reducedMotion ? 'bg-glow-success/10 border-glow-success/40 text-glow-success' : 'bg-surface-3/50 border-surface-4/60 text-text-muted hover:text-text-body'}`}
                      title={reducedMotion ? 'Animaciones reducidas' : 'Animaciones completas'}
                    >
                      {reducedMotion ? <ZapOff className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-sm bg-surface-3/50 border border-surface-4/60 text-text-muted hover:text-text-body transition-colors"
                      title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <motion.h1
                  layoutId="header-title"
                  className="font-display font-semibold leading-none text-text-heading"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                >
                  {config.title} <span className="italic text-glow-success">{config.subtitle}</span>
                </motion.h1>
              </motion.div>
            ) : (
              <motion.div
                key="scrolled-header"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-4"
              >
                <motion.h1
                  layoutId="header-title"
                  className="font-display font-semibold leading-none text-text-heading text-xl"
                >
                  {config.title} <span className="italic text-glow-success">{config.subtitle}</span>
                </motion.h1>
                <div className="h-4 w-px bg-surface-4/60" />
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-glow-success" />
                  <span className="text-xs font-mono text-text-muted">{progressPercent}% completado</span>
                </div>

                <div className="hidden md:flex items-center gap-3 ml-4">
                  <ViewModeSelector idPrefix="scrolled" />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setReducedMotion(!reducedMotion)}
                      className={`p-1.5 rounded-sm border transition-colors ${reducedMotion ? 'bg-glow-success/10 border-glow-success/40 text-glow-success' : 'bg-surface-3/50 border-surface-4/60 text-text-muted hover:text-text-body'}`}
                      title={reducedMotion ? 'Animaciones reducidas' : 'Animaciones completas'}
                    >
                      {reducedMotion ? <ZapOff className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-sm bg-surface-3/50 border border-surface-4/60 text-text-muted hover:text-text-body transition-colors"
                      title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
                    >
                      {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-8 ${isScrolled ? 'hidden md:flex' : ''}`}>
          <motion.div layoutId="header-stats" className="flex items-center gap-6">
            <div className="text-left">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-mono mb-1">Progreso</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-glow-success tabular-nums font-display">{progressPercent}</span>
                <span className="text-xs text-text-muted">%</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-[9px] uppercase tracking-widest text-text-muted font-mono mb-1">Restante</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black text-text-heading tabular-nums font-display">{Math.floor(remainingMinutes / 60)}</span>
                <span className="text-xs text-text-muted">h</span>
                <span className="text-2xl font-black text-text-heading tabular-nums font-display">{remainingMinutes % 60}</span>
                <span className="text-xs text-text-muted">m</span>
              </div>
            </div>
          </motion.div>

          <div className="w-full md:w-48">
            <DarksaberProgress progress={progressPercent} orientation="horizontal" className="h-8" />
          </div>
        </div>

        {!isScrolled && (
          <div className="hidden lg:block">
            <CountdownWidget config={config} remainingMinutes={remainingMinutes} isScrolled={isScrolled} />
          </div>
        )}
      </div>
    </header>
  );
}
