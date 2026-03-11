'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Film, Tv, Info, PlayCircle, Star, Filter, EyeOff, Eye, Search, ChevronDown, ChevronUp, RotateCcw, CheckSquare, Square } from 'lucide-react';
import { Era, MediaItem } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';

const CountdownWidget = dynamic(() => import('./CountdownWidget'), { ssr: false });

type Preset = 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt';

export default function Dashboard({ eras }: { eras: Era[] }) {
  const { watchedItems, toggleItem, markMultiple, unmarkMultiple, resetProgress } = useProgressStore();
  const [isMounted, setIsMounted] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all');
  const [preset, setPreset] = useState<Preset>('all');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Memoized stats calculation
  const { totalItems, watchedCount, progressPercent, totalMinutes, watchedMinutes, remainingMinutes } = useMemo(() => {
    const allItems = eras.flatMap(e => e.items);
    const total = allItems.length;
    const watched = watchedItems.length;
    const percent = total === 0 ? 0 : Math.round((watched / total) * 100);
    
    const tMins = allItems.reduce((acc, item) => acc + item.duration, 0);
    const wMins = allItems
      .filter(item => watchedItems.includes(item.id))
      .reduce((acc, item) => acc + item.duration, 0);
    
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
      if (hideCompleted && watchedItems.includes(item.id)) return false;
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-12">
      {/* Header Section */}
      <header className="relative pt-12 pb-8 border-b border-zinc-800">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              <Star className="w-3 h-3 text-emerald-400" />
              Watch Planner
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500" style={{ fontFamily: 'var(--font-display)' }}>
              The Mandalorian <br />
              <span className="text-emerald-400">& Grogu</span> Tracker
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg">
              La guía cronológica definitiva para prepararte antes del estreno en cines.
            </p>
          </div>

          <CountdownWidget remainingMinutes={remainingMinutes} />
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
                toggleItem={toggleItem}
                markMultiple={markMultiple}
                unmarkMultiple={unmarkMultiple}
              />
            ))
          )}
        </AnimatePresence>
      </section>
      
      <footer className="pt-12 pb-24 text-center border-t border-zinc-800 text-zinc-500 text-sm">
        <p>Que la Fuerza te acompañe. Este es el camino.</p>
      </footer>
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
  
  const eraItemIds = era.items.map(i => i.id);
  const eraWatchedCount = era.items.filter(item => watchedItems.includes(item.id)).length;
  const isCompleted = eraWatchedCount === era.items.length && era.items.length > 0;
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
                    isWatched={watchedItems.includes(item.id)} 
                    onToggle={() => toggleItem(item.id)} 
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

function MediaItemCard({ item, isWatched, onToggle }: { item: MediaItem, isWatched: boolean, onToggle: () => void }) {
  return (
    <motion.label 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden block focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-[#09090b] ${
        isWatched 
          ? 'bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-800/50' 
          : 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700'
      }`}
    >
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={isWatched}
        onChange={onToggle}
        aria-label={`Marcar ${item.title} como visto`}
      />
      
      <div className="flex gap-4">
        <div className="shrink-0 mt-1">
          <motion.div
            initial={false}
            animate={{ 
              scale: isWatched ? [1, 1.2, 1] : 1,
              rotate: isWatched ? [0, 10, 0] : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {isWatched ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <Circle className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            )}
          </motion.div>
        </div>
        
        <div className="space-y-3 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <h4 className={`font-medium text-base transition-colors ${isWatched ? 'text-zinc-300' : 'text-zinc-100'}`}>
              {item.title}
            </h4>
            <div className="flex items-center gap-3 shrink-0">
              {item.essential && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">
                  Esencial
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800/50">
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
        </div>
      </div>
    </motion.label>
  );
}
