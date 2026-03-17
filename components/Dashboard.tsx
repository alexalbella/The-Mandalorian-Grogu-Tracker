'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Film, Tv, Info, PlayCircle, Star, Filter, EyeOff, Eye, Search, ChevronDown, ChevronUp, RotateCcw, CheckSquare, Square, Volume2, VolumeX, Download, Upload, Target, Flame } from 'lucide-react';
import { Era, MediaItem } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import Image from 'next/image';

const CountdownWidget = dynamic(() => import('./CountdownWidget'), { ssr: false });

type Preset = 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt' | 'essential-background' | 'movie-background';

// ... (sin import)
import ResumeFlow from './ResumeFlow';
import AchievementsPanel from './AchievementsPanel';
import EraSection from './EraSection';
import FiltersBar from './FiltersBar';
import { useAchievementsEngine } from '@/hooks/useAchievementsEngine';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export default function Dashboard({ eras }: { eras: Era[] }) {
  const { watchedItems, skippedItems, streak, toggleItem, skipItem, markMultiple, unmarkMultiple, resetProgress, isCompleted } = useProgressStore();
  const { 
    filterType, setFilterType, 
    preset, setPreset, 
    hideCompleted, setHideCompleted, 
    searchQuery, setSearchQuery, 
    isMuted, setIsMuted,
    lastViewedId, setLastViewedId,
    expandedEras, toggleEraExpanded
  } = useUIStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Initialize Achievements Engine
  const { calculateProgress } = useAchievementsEngine(eras);

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
          element.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950', 'transition-all', 'duration-500', 'rounded-xl');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950');
          }, 2000);
        }
      }, 500); // Wait a bit for rendering
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playSound = useCallback(() => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [isMuted]);

  const handleToggleItem = useCallback((id: string) => {
    const isCurrentlyCompleted = isCompleted(id);
    toggleItem(id);
    setLastViewedId(id);
    
    if (!isCurrentlyCompleted) {
      playSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [toggleItem, playSound, setLastViewedId, isCompleted]);

  const handleSkipItem = useCallback((id: string) => {
    const isCurrentlyCompleted = isCompleted(id);
    skipItem(id);
    setLastViewedId(id);
    
    if (!isCurrentlyCompleted) {
      playSound();
    }
  }, [skipItem, playSound, setLastViewedId, isCompleted]);

  // Stats are now handled by useDashboardStats hook
  const stats = useDashboardStats(eras);
  const { totalItems, watchedCount, progressPercent, totalMinutes, watchedMinutes, remainingMinutes } = stats;
  
  // Next item logic
  const nextItem = useMemo(() => {
    // Find next item
    let nextItem = null;
    
    // 1. Check for skipped essential items first
    for (const era of eras) {
      for (const item of era.items) {
        if (item.subItems) {
          const skippedEssentialSub = item.subItems.find(sub => skippedItems.includes(sub.id) && item.essential);
          if (skippedEssentialSub) {
            nextItem = { item, subItem: skippedEssentialSub, eraId: era.id, isSkippedEssential: true };
            break;
          }
        } else {
          if (skippedItems.includes(item.id) && item.essential) {
            nextItem = { item, eraId: era.id, isSkippedEssential: true };
            break;
          }
        }
      }
      if (nextItem) break;
    }

    // 2. If no skipped essential items, find the next chronological unwatched item
    if (!nextItem) {
      for (const era of eras) {
        for (const item of era.items) {
          if (item.subItems) {
            const incompleteSub = item.subItems.find(sub => !isCompleted(sub.id));
            if (incompleteSub) {
              nextItem = { item, subItem: incompleteSub, eraId: era.id, isSkippedEssential: false };
              break;
            }
          } else {
            if (!isCompleted(item.id)) {
              nextItem = { item, eraId: era.id, isSkippedEssential: false };
              break;
            }
          }
        }
        if (nextItem) break;
      }
    }
    
    return nextItem;
  }, [eras, isCompleted, skippedItems]);

  // Confetti effect when reaching 100%
  useEffect(() => {
    if (isMounted && progressPercent === 100 && totalItems > 0) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#3b82f6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#3b82f6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [progressPercent, isMounted, totalItems]);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 animate-pulse">
        <div className="flex-1 space-y-12 min-w-0">
          <div className="h-32 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
          <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
          <div className="h-96 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
        </div>
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
          <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
        </aside>
      </div>
    );
  }

  const filteredEras = eras.map(era => {
    const filteredItems = era.items.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;
      // Completed filter
      if (hideCompleted) {
        if (item.subItems) {
          if (item.subItems.every(sub => watchedItems.includes(sub.id) || skippedItems.includes(sub.id)) && item.subItems.length > 0) return false;
        } else {
          if (watchedItems.includes(item.id) || skippedItems.includes(item.id)) return false;
        }
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesReason = item.reason.toLowerCase().includes(query);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesSubItems = item.subItems?.some(sub => sub.title.toLowerCase().includes(query)) || false;
        
        if (!matchesTitle && !matchesReason && !matchesTags && !matchesSubItems) {
          return false;
        }
      }
      
      // Presets
      if (preset === 'essential' && !item.essential) return false;
      if (preset === 'fast' && item.type === 'series' && !item.essential) return false; // Fast mode: All movies + essential series
      if (preset === 'mandalore' && !item.tags.includes('mandalore')) return false;
      if (preset === 'thrawn' && !item.tags.includes('thrawn') && !item.tags.includes('new-republic')) return false;
      if (preset === 'hutt' && !item.tags.includes('hutt') && !item.tags.includes('bounty-hunters')) return false;
      if (preset === 'essential-background' && !item.essential) return false;
      if (preset === 'movie-background' && item.type !== 'movie') return false;

      return true;
    });
    return { ...era, items: filteredItems };
  }).filter(era => era.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-12 min-w-0">
        {/* Header Section - Sticky */}
        <header className={`sticky top-0 lg:top-4 z-50 border-b lg:border border-zinc-800 bg-[#050505]/90 backdrop-blur-xl shadow-2xl shadow-black/50 -mx-4 px-4 lg:mx-0 lg:px-6 lg:rounded-2xl transition-all duration-300 ${isScrolled ? 'pt-3 pb-3' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full" />
          </div>
          
          <div className={`flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between`}>
            <div className={`space-y-1 ${isScrolled ? '' : 'md:space-y-4'}`}>
              <div className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 m-0' : 'max-h-20 opacity-100'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  <Star className="w-3 h-3 text-emerald-400" />
                  Watch Planner
                </div>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <h1 className={`font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500 transition-all duration-300 ${isScrolled ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`} style={{ fontFamily: 'var(--font-display)' }}>
                  The Mandalorian {isScrolled ? '' : <br className="hidden md:block" />}
                  <span className="text-emerald-400">& Grogu</span> {isScrolled ? '' : 'Tracker'}
                </h1>
                {isScrolled && (
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div className={`flex flex-col items-start md:items-end gap-3 w-full md:w-auto`}>
              <div className={`transition-all duration-300 origin-right`}>
                <CountdownWidget remainingMinutes={remainingMinutes} isScrolled={isScrolled} />
              </div>
              {/* Darksaber Progress Bar in Header (Mobile only) */}
              <div className={`w-full lg:hidden transition-all duration-300 ${isScrolled ? 'mt-0' : 'mt-2'}`}>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span className={isScrolled ? 'hidden md:inline' : 'inline'}>Progreso</span>
                  <span className="text-emerald-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  <div 
                    className="absolute top-0 left-0 h-full bg-zinc-100 transition-all duration-1000 ease-out shadow-[0_0_10px_#fff,0_0_20px_#fff]"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-400 to-white opacity-50 mix-blend-overlay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Resume Flow */}
        <ResumeFlow 
          nextItem={nextItem} 
          handleSkipItem={handleSkipItem} 
          toggleEraExpanded={toggleEraExpanded} 
          expandedEras={expandedEras} 
        />

      {/* Stats Dashboard */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Progreso Total" 
          value={`${progressPercent}%`} 
          subtitle={`${watchedCount} de ${totalItems} completados`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          progress={progressPercent}
        />
        <StatCard 
          title="Racha Actual" 
          value={`${streak} ${streak === 1 ? 'día' : 'días'}`} 
          subtitle="Viendo Star Wars"
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
        <StatCard 
          title="Tiempo Invertido" 
          value={formatTime(watchedMinutes)} 
          subtitle="Horas de visionado"
          icon={<PlayCircle className="w-5 h-5 text-blue-400" />}
        />
        <StatCard 
          title="Tiempo Restante" 
          value={formatTime(remainingMinutes)} 
          subtitle={`De un total de ${formatTime(totalMinutes)}`}
          icon={<Clock className="w-5 h-5 text-orange-400" />}
        />
      </section>
      
      <AchievementsPanel eras={eras} calculateProgress={calculateProgress} />

      {/* Filters & Presets */}
      <FiltersBar />

      {/* Eras List */}
      <section className="space-y-16">
        <AnimatePresence mode="popLayout">
          {filteredEras.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 text-zinc-500"
            >
              No hay elementos que coincidan con los filtros actuales.
            </motion.div>
          ) : (
            filteredEras.map((era, index) => (
              <EraSection 
                key={era.id} 
                era={era} 
                index={index} 
                isCompleted={isCompleted} 
                toggleItem={handleToggleItem}
                markMultiple={markMultiple}
                unmarkMultiple={unmarkMultiple}
              />
            ))
          )}
        </AnimatePresence>
      </section>
      
      {/* Teaser Mode */}
      <AnimatePresence>
        {progressPercent === 100 && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 pb-8 border-t border-zinc-800"
          >
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>
                  ¡Estás listo para el estreno!
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                  Has completado todo el material esencial. Ahora solo queda esperar a que The Mandalorian & Grogu llegue a los cines.
                </p>
              </div>

              <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative z-10">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/IHWlvwu8t1w" 
                  title="The Mandalorian & Grogu Trailer" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Data Management */}
      <section className="pt-12 pb-8 border-t border-zinc-800 flex flex-col items-center gap-4">
        <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Gestión de Datos (Local-First)</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const progress = localStorage.getItem('mando-grogu-progress') || localStorage.getItem('mando-tracker-progress');
              const achievements = localStorage.getItem('mando-grogu-achievements') || localStorage.getItem('mando-gamification-storage');
              const ui = localStorage.getItem('mando-grogu-ui') || localStorage.getItem('mando-ui-storage');
              const backup = { progress, achievements, ui };
              const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `mando-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Progreso
          </button>
          <label className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Importar
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const content = ev.target?.result as string;
                      const backup = JSON.parse(content);
                      if (backup.progress) localStorage.setItem('mando-grogu-progress', backup.progress);
                      if (backup.achievements || backup.gamification) localStorage.setItem('mando-grogu-achievements', backup.achievements || backup.gamification);
                      if (backup.ui) localStorage.setItem('mando-grogu-ui', backup.ui);
                      window.location.reload();
                    } catch (err) {
                      alert('Error al importar el archivo. Asegúrate de que es un backup válido.');
                    }
                  };
                  reader.readAsText(file);
                }
              }} 
            />
          </label>
        </div>
      </section>

      <footer className="pt-8 pb-24 text-center border-t border-zinc-800 text-zinc-500 text-sm">
        <p>Que la Fuerza te acompañe. Este es el camino.</p>
      </footer>
      </div>

      {/* Sidebar - Vertical Progress */}
      <aside className="hidden lg:flex flex-col items-center w-24 shrink-0 pt-8">
        <div className="sticky top-24 flex flex-col items-center gap-6 h-[calc(100vh-8rem)]">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Progreso</div>
            <div className="text-2xl font-bold text-emerald-400">{progressPercent}%</div>
          </div>
          
          {/* Vertical Darksaber */}
          <div className="flex-1 w-4 flex flex-col justify-end items-center relative">
            {/* Blade container */}
            <div className="w-full flex-1 bg-zinc-900 rounded-t-full overflow-hidden border border-zinc-800 border-b-0 relative shadow-[0_0_15px_rgba(0,0,0,0.8)] flex flex-col justify-end">
              <div 
                className="w-full bg-zinc-100 transition-all duration-1000 ease-out shadow-[0_0_15px_#fff,0_0_30px_#fff]"
                style={{ height: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-800 via-zinc-400 to-white opacity-50 mix-blend-overlay" />
              </div>
            </div>
            
            {/* Darksaber Hilt (bottom) */}
            <div className="w-6 h-20 bg-gradient-to-b from-zinc-700 to-zinc-950 border border-zinc-600 rounded-b-md rounded-t-sm flex flex-col items-center justify-evenly py-2 shadow-xl z-10 shrink-0">
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
            </div>
          </div>
          
          <div className="text-xs font-mono text-zinc-500">
            {watchedCount}/{totalItems}
          </div>
        </div>
      </aside>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, progress }: { title: string, value: string, subtitle: string, icon: React.ReactNode, progress?: number }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden">
      {progress !== undefined && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-emerald-500/50 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold font-mono tracking-tight">{value}</p>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
    </div>
  );
}
