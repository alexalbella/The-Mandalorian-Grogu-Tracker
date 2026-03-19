'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, LayoutGrid, LayoutList, Zap, ZapOff, Eye } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Era } from '@/data/starwars-list';
import dynamic from 'next/dynamic';
import DarksaberProgress from './DarksaberProgress';
import { AnimatePresence, motion, useSpring, useTransform } from 'motion/react';

const CountdownWidget = dynamic(() => import('../CountdownWidget'), { ssr: false });

function ViewModeSelector({ idPrefix = '' }: { idPrefix?: string }) {
  const { compactMode, setCompactMode, focusMode, setFocusMode } = useUIStore();
  
  const currentMode = focusMode ? 'focus' : compactMode ? 'compact' : 'normal';

  const setMode = (mode: 'normal' | 'compact' | 'focus') => {
    if (mode === 'normal') {
      setCompactMode(false);
      setFocusMode(false);
    } else if (mode === 'compact') {
      setCompactMode(true);
      setFocusMode(false);
    } else if (mode === 'focus') {
      setCompactMode(false);
      setFocusMode(true);
    }
  };

  const modes = [
    { id: 'normal', label: 'Normal', icon: LayoutGrid },
    { id: 'compact', label: 'Compacto', icon: LayoutList },
    { id: 'focus', label: 'Focus', icon: Eye },
  ];

  return (
    <div className="flex bg-surface-3/80 backdrop-blur-md border border-surface-4 rounded-full p-1 relative shadow-inner">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;
        const Icon = mode.icon;
        return (
          <button
            key={mode.id}
            onClick={() => setMode(mode.id as any)}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors z-10 ${isActive ? 'text-black font-bold' : 'text-text-muted hover:text-text-body'}`}
          >
            {isActive && (
              <motion.div
                layoutId={`activeMode-${idPrefix}`}
                className="absolute inset-0 bg-glow-success rounded-full -z-10 shadow-[0_0_10px_var(--color-glow-success)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function HeaderHUD({ eras }: { eras: Era[] }) {
  const { isMuted, setIsMuted, reducedMotion, setReducedMotion } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const { progressPercent, remainingMinutes } = useDashboardStats(eras);

  const springProgress = useSpring(progressPercent, {
    stiffness: 50,
    damping: 15,
    mass: 1
  });

  // Dynamic glow based on progress
  const glowOpacity = useTransform(springProgress, (v) => Math.max(0.1, Math.min(0.4, v / 100)));
  const glowScale = useTransform(springProgress, (v) => 0.8 + (v / 100) * 0.4);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 lg:top-4 z-50 border-b lg:border border-surface-4 bg-surface-1/90 backdrop-blur-xl shadow-2xl shadow-black/50 -mx-4 px-4 lg:mx-0 lg:px-6 lg:rounded-2xl transition-all duration-300 ${isScrolled ? 'pt-2 pb-2' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
      {/* Parallax Starfield */}
      <div 
        className="absolute inset-0 starfield opacity-20 pointer-events-none" 
        style={{ 
          backgroundPosition: `0 ${scrollY * 0.2}px`,
          maskImage: 'linear-gradient(to bottom, black, transparent)'
        }} 
      />

      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none" 
        style={{ opacity: glowOpacity, scale: glowScale }}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-glow-success blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-glow-success blur-[120px] rounded-full" />
      </motion.div>
      
      <div className={`flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between relative z-10`}>
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
                    <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">HUD Mode</span>
                    <ViewModeSelector idPrefix="full" />
                  </div>
                  
                  <div className="w-px h-6 bg-surface-4 hidden sm:block" />
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setReducedMotion(!reducedMotion)}
                      className={`p-1.5 rounded-full border transition-colors ${reducedMotion ? 'bg-glow-success/20 border-glow-success text-glow-success' : 'bg-surface-3 border-surface-4 text-text-body hover:text-text-heading'}`}
                      title={reducedMotion ? "Animaciones reducidas" : "Animaciones completas"}
                    >
                      {reducedMotion ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-full bg-surface-3 border border-surface-4 text-text-body hover:text-text-heading transition-colors"
                      title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <motion.h1 
                  layoutId="header-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-text-heading" 
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  The Mandalorian <span className="text-glow-success">& Grogu</span> Tracker
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
                  className="text-xl font-black tracking-tighter text-text-heading" 
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  The Mandalorian <span className="text-glow-success">& Grogu</span>
                </motion.h1>
                <div className="h-4 w-px bg-surface-4" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-glow-success animate-pulse" />
                  <span className="text-xs font-mono text-text-body">{progressPercent}% completado</span>
                </div>
                
                <div className="hidden md:flex items-center gap-3 ml-4">
                  <ViewModeSelector idPrefix="scrolled" />
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setReducedMotion(!reducedMotion)}
                      className={`p-1.5 rounded-full border transition-colors ${reducedMotion ? 'bg-glow-success/20 border-glow-success text-glow-success' : 'bg-surface-3 border-surface-4 text-text-body hover:text-text-heading'}`}
                      title={reducedMotion ? "Animaciones reducidas" : "Animaciones completas"}
                    >
                      {reducedMotion ? <ZapOff className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-full bg-surface-3 border border-surface-4 text-text-body hover:text-text-heading transition-colors"
                      title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
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
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">Progreso</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-glow-success tabular-nums">{progressPercent}</span>
                <span className="text-xs text-text-muted font-bold">%</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-1">Restante</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-text-heading tabular-nums">{Math.floor(remainingMinutes / 60)}</span>
                <span className="text-xs text-text-muted font-bold">h</span>
                <span className="text-2xl font-black text-text-heading tabular-nums">{remainingMinutes % 60}</span>
                <span className="text-xs text-text-muted font-bold">m</span>
              </div>
            </div>
          </motion.div>
          
          <div className="w-full md:w-48">
            <DarksaberProgress progress={progressPercent} orientation="horizontal" className="h-8" />
          </div>
        </div>

        {!isScrolled && (
          <div className="hidden lg:block">
            <CountdownWidget remainingMinutes={remainingMinutes} isScrolled={isScrolled} />
          </div>
        )}
      </div>
    </header>
  );
}
