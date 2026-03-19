'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Volume2, VolumeX, Settings, LayoutGrid, LayoutList, Zap, ZapOff, Eye, EyeOff } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Era } from '@/data/starwars-list';
import dynamic from 'next/dynamic';
import DarksaberProgress from './DarksaberProgress';
import { AnimatePresence, motion, useSpring, useTransform } from 'motion/react';

const CountdownWidget = dynamic(() => import('../CountdownWidget'), { ssr: false });

export default function HeaderHUD({ eras }: { eras: Era[] }) {
  const { isMuted, setIsMuted, compactMode, setCompactMode, reducedMotion, setReducedMotion, focusMode, setFocusMode } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { progressPercent, remainingMinutes } = useDashboardStats(eras);
  const settingsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-3 border border-surface-4 text-xs font-mono text-text-body uppercase tracking-wider">
                    <Star className="w-3 h-3 text-glow-success" />
                    Watch Planner
                  </div>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full bg-surface-3 border border-surface-4 text-text-body hover:text-text-heading transition-colors"
                    title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="relative" ref={settingsRef}>
                    <button 
                      onClick={() => setShowSettings(!showSettings)}
                      className={`p-1.5 rounded-full border transition-colors ${showSettings ? 'bg-surface-4 border-surface-4 text-text-heading' : 'bg-surface-3 border-surface-4 text-text-body hover:text-text-heading'}`}
                      title="Ajustes de interfaz"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 left-0 w-48 bg-surface-2 border border-surface-4 rounded-xl shadow-xl overflow-hidden z-50"
                        >
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => setCompactMode(!compactMode)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-3 transition-colors text-sm text-text-heading"
                            >
                              <span className="flex items-center gap-2">
                                {compactMode ? <LayoutList className="w-4 h-4 text-glow-success" /> : <LayoutGrid className="w-4 h-4 text-text-muted" />}
                                Modo compacto
                              </span>
                            </button>
                            <button
                              onClick={() => setReducedMotion(!reducedMotion)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-3 transition-colors text-sm text-text-heading"
                            >
                              <span className="flex items-center gap-2">
                                {reducedMotion ? <ZapOff className="w-4 h-4 text-glow-success" /> : <Zap className="w-4 h-4 text-text-muted" />}
                                Reducir animaciones
                              </span>
                            </button>
                            <button
                              onClick={() => setFocusMode(!focusMode)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface-3 transition-colors text-sm text-text-heading"
                            >
                              <span className="flex items-center gap-2">
                                {focusMode ? <Eye className="w-4 h-4 text-glow-success" /> : <EyeOff className="w-4 h-4 text-text-muted" />}
                                Modo enfoque
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-surface-3 border border-surface-4 text-text-body hover:text-text-heading transition-colors"
                  title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <div className="relative" ref={settingsRef}>
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-1.5 rounded-full border transition-colors ${showSettings ? 'bg-surface-4 border-surface-4 text-text-heading' : 'bg-surface-3 border-surface-4 text-text-body hover:text-text-heading'}`}
                    title="Ajustes de interfaz"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
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
