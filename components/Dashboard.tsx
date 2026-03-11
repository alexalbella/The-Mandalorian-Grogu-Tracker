'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Film, Tv, Info, PlayCircle, Star, Filter, EyeOff, Eye, Search, ChevronDown, ChevronUp, RotateCcw, CheckSquare, Square, Volume2, VolumeX } from 'lucide-react';
import { Era, MediaItem } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import Image from 'next/image';

const CountdownWidget = dynamic(() => import('./CountdownWidget'), { ssr: false });

type Preset = 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt';

export default function Dashboard({ eras }: { eras: Era[] }) {
  const { watchedItems, toggleItem, markMultiple, unmarkMultiple, resetProgress } = useProgressStore();
  const [isMounted, setIsMounted] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');
  const [preset, setPreset] = useState<Preset>('all');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
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
    const isCurrentlyWatched = watchedItems.includes(id);
    toggleItem(id);
    
    if (!isCurrentlyWatched) {
      playSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [watchedItems, toggleItem, playSound]);

  // Memoized stats calculation
  const { totalItems, watchedCount, progressPercent, totalMinutes, watchedMinutes, remainingMinutes } = useMemo(() => {
    const allItems = eras.flatMap(e => e.items);
    const total = allItems.reduce((acc, item) => acc + (item.subItems ? item.subItems.length : 1), 0);
    const watched = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => watchedItems.includes(sub.id)).length;
      }
      return acc + (watchedItems.includes(item.id) ? 1 : 0);
    }, 0);
    const percent = total === 0 ? 0 : Math.round((watched / total) * 100);
    
    const tMins = allItems.reduce((acc, item) => acc + item.duration, 0);
    const wMins = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => watchedItems.includes(sub.id)).reduce((sum, sub) => sum + sub.duration, 0);
      }
      return acc + (watchedItems.includes(item.id) ? item.duration : 0);
    }, 0);
    
    return {
      totalItems: total,
      watchedCount: watched,
      progressPercent: percent,
      totalMinutes: tMins,
      watchedMinutes: wMins,
      remainingMinutes: tMins - wMins
    };
  }, [eras, watchedItems]);

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

  if (!isMounted) return null; // Prevent hydration mismatch

  const filteredEras = eras.map(era => {
    const filteredItems = era.items.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;
      // Completed filter
      if (hideCompleted) {
        if (item.subItems) {
          if (item.subItems.every(sub => watchedItems.includes(sub.id)) && item.subItems.length > 0) return false;
        } else {
          if (watchedItems.includes(item.id)) return false;
        }
      }
      // Search filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Presets
      if (preset === 'essential' && !item.essential) return false;
      if (preset === 'fast' && item.type === 'series' && !item.essential) return false; // Fast mode: All movies + essential series
      if (preset === 'mandalore' && !item.tags.includes('mandalore')) return false;
      if (preset === 'thrawn' && !item.tags.includes('thrawn') && !item.tags.includes('new-republic')) return false;
      if (preset === 'hutt' && !item.tags.includes('hutt') && !item.tags.includes('bounty-hunters')) return false;

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

      {/* Stats Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Progreso Total" 
          value={`${progressPercent}%`} 
          subtitle={`${watchedCount} de ${totalItems} completados`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          progress={progressPercent}
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

      {/* Filters & Presets */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Buscar episodio o película..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Todo
              </button>
              <button 
                onClick={() => setFilterType('movie')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'movie' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Películas
              </button>
              <button 
                onClick={() => setFilterType('series')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'series' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Series
              </button>
            </div>
            
            <button 
              onClick={() => setHideCompleted(!hideCompleted)}
              className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-2 ${hideCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'}`}
            >
              {hideCompleted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Ocultar Completados</span>
            </button>
          </div>

          <button 
            onClick={resetProgress}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-red-900/30 text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-2 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Resetear
          </button>
        </div>

        {/* Presets Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mr-2">Presets:</span>
          {[
            { id: 'all', label: 'Lista Completa' },
            { id: 'essential', label: 'Imprescindible' },
            { id: 'fast', label: 'Modo Rápido' },
            { id: 'mandalore', label: 'Solo Mandalore' },
            { id: 'thrawn', label: 'Nueva República / Thrawn' },
            { id: 'hutt', label: 'Trama Hutt' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id as Preset)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                preset === p.id 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

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
                watchedItems={watchedItems} 
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

      <footer className="pt-12 pb-24 text-center border-t border-zinc-800 text-zinc-500 text-sm">
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

function EraSection({ 
  era, 
  index, 
  watchedItems, 
  toggleItem,
  markMultiple,
  unmarkMultiple
}: { 
  era: Era, 
  index: number, 
  watchedItems: string[], 
  toggleItem: (id: string) => void,
  markMultiple: (ids: string[]) => void,
  unmarkMultiple: (ids: string[]) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const eraItemIds = era.items.flatMap(i => i.subItems ? i.subItems.map(s => s.id) : [i.id]);
  const eraTotalCount = eraItemIds.length;
  const eraWatchedCount = eraItemIds.filter(id => watchedItems.includes(id)).length;
  const isCompleted = eraWatchedCount === eraTotalCount && eraTotalCount > 0;
  const isPartiallyCompleted = eraWatchedCount > 0 && !isCompleted;

  const handleToggleAll = () => {
    if (isCompleted) {
      unmarkMultiple(eraItemIds);
    } else {
      markMultiple(eraItemIds);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pt-12 md:pt-16"
    >
      {index > 0 && (
        <div className="absolute top-0 left-0 w-full flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="absolute w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-sm" />
        </div>
      )}

      {/* Timeline connector */}
      <div className="absolute left-4 top-28 bottom-[-4rem] w-px bg-zinc-800 hidden md:block" />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Era Header */}
        <div className="md:w-1/3 shrink-0 relative z-10">
          <div className="sticky top-8 space-y-4 bg-[#09090b] py-2">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors shadow-lg ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>
                {era.eraNumber}
              </div>
              <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isCompleted ? 'text-emerald-50' : 'text-zinc-100'}`} style={{ fontFamily: 'var(--font-display)' }}>
                ERA {era.eraNumber}
              </h2>
            </div>
            <div className="pl-11">
              <h3 className="text-lg font-medium text-zinc-300 mb-2">{era.eraLabel}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{era.description}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
                  <span className={isCompleted ? "text-emerald-400 font-bold" : "text-zinc-300"}>
                    {eraWatchedCount} / {era.items.length}
                  </span>
                  <span className="text-zinc-500">vistos</span>
                </div>
                
                <button 
                  onClick={handleToggleAll}
                  className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                  title={isCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                  aria-label={isCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                >
                  {isCompleted ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : isPartiallyCompleted ? <Square className="w-4 h-4 text-emerald-500/50" fill="currentColor" /> : <Square className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors md:hidden"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Colapsar era" : "Expandir era"}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:w-2/3 space-y-3 md:pl-8 overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                {era.items.map(item => (
                  <MediaItemCard 
                    key={item.id} 
                    item={item} 
                    watchedItems={watchedItems}
                    toggleItem={toggleItem}
                    markMultiple={markMultiple}
                    unmarkMultiple={unmarkMultiple}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MediaItemCard({ 
  item, 
  watchedItems, 
  toggleItem,
  markMultiple,
  unmarkMultiple
}: { 
  item: MediaItem; 
  watchedItems: string[]; 
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
}) {
  const isWatched = item.subItems 
    ? item.subItems.every(sub => watchedItems.includes(sub.id)) && item.subItems.length > 0
    : watchedItems.includes(item.id);

  const isPartiallyWatched = item.subItems
    ? item.subItems.some(sub => watchedItems.includes(sub.id)) && !isWatched
    : false;

  const handleToggle = () => {
    if (item.subItems) {
      if (isWatched) {
        unmarkMultiple(item.subItems.map(s => s.id));
      } else {
        markMultiple(item.subItems.map(s => s.id));
      }
    } else {
      toggleItem(item.id);
    }
  };
  // Use a deterministic seed for the placeholder image based on the item ID
  const getImageUrl = (id: string) => {
    const map: Record<string, string> = {
      'ep1': 'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
      'tcw-movie': 'https://image.tmdb.org/t/p/w500/iJQfixW818LUdSXlCDL3JZm0S0g.jpg',
      'tcw-t2-12-14': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t3-4': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t4-15-18': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t4-20-22': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t5-1': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t6-5': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t7-9-12': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'bb-t1-15-16': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
      'bb-t3-1-3-14-15': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
      'rebels-t1-1-2': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t3-15': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t3-t4': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'ep4': 'https://image.tmdb.org/t/p/w500/fbrXPbObN3zenLpCq8Mj9eCHjQ5.jpg',
      'ep5': 'https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
      'ep6': 'https://image.tmdb.org/t/p/w500/jQYlydvHm3kUix1f8prMucrplhm.jpg',
      'mando-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'mando-t2': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'bobafett-1-4': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
      'bobafett-5-7': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
      'mando-t3': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'ahsoka-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/473/1184972.jpg',
      'skeleton-crew-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/546/1365559.jpg'
    };
    
    return map[id] || `https://placehold.co/400x600/09090b/10b981?text=${encodeURIComponent(item.title)}`;
  };

  const [imgSrc, setImgSrc] = useState(getImageUrl(item.id));

  return (
    <div 
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden block focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-[#09090b] ${
        isWatched 
          ? 'bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-800/50' 
          : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
      onClick={handleToggle}
    >
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={isWatched}
        onChange={handleToggle}
        aria-label={`Marcar ${item.title} como visto`}
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="flex flex-row gap-4">
        {/* Thumbnail */}
        <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/5 bg-zinc-900">
          <Image 
            src={imgSrc} 
            alt={`Poster for ${item.title}`}
            fill
            className={`object-cover transition-all duration-500 ${isWatched ? 'opacity-50 grayscale' : 'group-hover:scale-105'}`}
            sizes="(max-width: 640px) 96px, 128px"
            referrerPolicy="no-referrer"
            onError={() => {
              // If image fails, fallback to placehold.co
              setImgSrc(`https://placehold.co/400x600/09090b/10b981?text=${encodeURIComponent(item.title)}`);
            }}
            unoptimized={imgSrc.includes('placehold.co') || imgSrc.includes('tvmaze.com')}
          />
          {isWatched && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 drop-shadow-lg" />
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1 hidden sm:block">
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isWatched ? [1, 1.2, 1] : 1,
                    rotate: isWatched ? [0, 10, 0] : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isWatched ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isPartiallyWatched ? (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  )}
                </motion.div>
              </div>
              <h4 className={`font-medium text-lg transition-colors ${isWatched ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-100'}`}>
                {item.title}
              </h4>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.essential && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">
                  Esencial
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {item.duration}m
              </span>
            </div>
          </div>
          
          <div className="text-sm">
            <div className={`leading-relaxed transition-colors ${isWatched ? 'text-zinc-600' : 'text-zinc-400'}`}>
              <span className="inline-flex items-center gap-1 font-medium text-zinc-500 mr-2">
                <Info className="w-3.5 h-3.5" /> Contexto:
              </span>
              {item.reason}
            </div>
          </div>

          {item.subItems && item.subItems.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-white/5 pt-4" onClick={(e) => e.stopPropagation()}>
              {item.subItems.map(sub => {
                const isSubWatched = watchedItems.includes(sub.id);
                return (
                  <div 
                    key={sub.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSubWatched ? 'bg-emerald-950/20 hover:bg-emerald-950/40' : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(sub.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isSubWatched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-500" />
                      )}
                      <span className={`text-sm ${isSubWatched ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{sub.duration}m</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
