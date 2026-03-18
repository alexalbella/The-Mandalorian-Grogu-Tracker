'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Volume2, VolumeX, Settings, LayoutGrid, LayoutList, Zap, ZapOff, Eye, EyeOff } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Era } from '@/data/starwars-list';
import dynamic from 'next/dynamic';
import DarksaberProgress from './DarksaberProgress';
import { AnimatePresence, motion } from 'motion/react';

const CountdownWidget = dynamic(() => import('../CountdownWidget'), { ssr: false });

export default function HeaderHUD({ eras }: { eras: Era[] }) {
  const { isMuted, setIsMuted, compactMode, setCompactMode, reducedMotion, setReducedMotion, focusMode, setFocusMode } = useUIStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { progressPercent, remainingMinutes } = useDashboardStats(eras);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Dynamic glow based on progress
  const glowOpacity = Math.max(0.1, Math.min(0.4, progressPercent / 100));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    <header className={`sticky top-0 lg:top-4 z-50 border-b lg:border border-surface-4 bg-surface-1/90 starfield backdrop-blur-xl shadow-2xl shadow-black/50 -mx-4 px-4 lg:mx-0 lg:px-6 lg:rounded-2xl transition-all duration-300 ${isScrolled ? 'pt-3 pb-3' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none transition-opacity duration-1000" style={{ opacity: glowOpacity }}>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-glow-success blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-glow-success blur-[120px] rounded-full" />
      </div>
      
      <div className={`flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between`}>
        <div className={`space-y-1 ${isScrolled ? '' : 'md:space-y-4'}`}>
          <div className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 m-0' : 'max-h-20 opacity-100'}`}>
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
                          {focusMode ? <EyeOff className="w-4 h-4 text-glow-success" /> : <Eye className="w-4 h-4 text-text-muted" />}
                          Modo enfoque
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <h1 className={`font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-text-heading to-text-muted transition-all duration-300 ${isScrolled ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`} style={{ fontFamily: 'var(--font-display)' }}>
              The Mandalorian {isScrolled ? '' : <br className="hidden md:block" />}
              <span className="text-glow-success">& Grogu</span> {isScrolled ? '' : 'Tracker'}
            </h1>
            {isScrolled && (
              <>
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
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`flex flex-col items-start md:items-end gap-3 w-full md:w-auto`}>
          <div className={`transition-all duration-300 origin-right`}>
            <CountdownWidget remainingMinutes={remainingMinutes} isScrolled={isScrolled} />
          </div>
          {/* Darksaber Progress Bar in Header (Mobile only) */}
          <div className={`w-full lg:hidden transition-all duration-300 ${isScrolled ? 'mt-0' : 'mt-2'}`}>
            <div className="flex justify-between text-xs font-mono text-text-body mb-1">
              <span className={isScrolled ? 'hidden md:inline' : 'inline'}>Progreso</span>
              <span className="text-glow-success font-bold">{progressPercent}%</span>
            </div>
            <DarksaberProgress progress={progressPercent} orientation="horizontal" />
          </div>
        </div>
      </div>
    </header>
  );
}
