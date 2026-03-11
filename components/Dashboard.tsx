'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Clock, Film, Tv, Calendar, Info, PlayCircle, Star } from 'lucide-react';
import { eras, MediaItem, Era } from '@/data/starwars-list';

export default function Dashboard() {
  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mando-grogu-progress');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWatchedItems(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('mando-grogu-progress', JSON.stringify(Array.from(watchedItems)));
    }
  }, [watchedItems, isLoaded]);

  const toggleItem = (id: string) => {
    setWatchedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Stats calculation
  const totalItems = eras.flatMap(e => e.items).length;
  const watchedCount = watchedItems.size;
  const progressPercent = totalItems === 0 ? 0 : Math.round((watchedCount / totalItems) * 100);

  const totalMinutes = eras.flatMap(e => e.items).reduce((acc, item) => acc + item.duration, 0);
  const watchedMinutes = eras.flatMap(e => e.items)
    .filter(item => watchedItems.has(item.id))
    .reduce((acc, item) => acc + item.duration, 0);
  const remainingMinutes = totalMinutes - watchedMinutes;

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  if (!isLoaded) return null;

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
              Lista Maestra Definitiva
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500" style={{ fontFamily: 'var(--font-display)' }}>
              The Mandalorian <br />
              <span className="text-emerald-400">& Grogu</span> Tracker
            </h1>
            <p className="text-zinc-400 max-w-xl text-lg">
              La guía cronológica definitiva para entender cada rincón, easter egg y cameo antes del estreno en cines.
            </p>
          </div>

          {/* Countdown Widget */}
          <CountdownWidget />
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

      {/* Eras List */}
      <section className="space-y-16">
        {eras.map((era, index) => (
          <EraSection 
            key={era.id} 
            era={era} 
            index={index} 
            watchedItems={watchedItems} 
            toggleItem={toggleItem} 
          />
        ))}
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

function CountdownWidget() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });
  
  useEffect(() => {
    // Release date: May 22, 2026
    const releaseDate = new Date('2026-05-22T00:00:00Z').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = releaseDate - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        });
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-6 shrink-0">
      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
        <Calendar className="w-6 h-6 text-zinc-400" />
      </div>
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Estreno en Cines</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-emerald-400">{timeLeft.days}</span>
          <span className="text-sm text-zinc-400">días</span>
          <span className="text-2xl font-bold font-mono text-zinc-300 ml-2">{timeLeft.hours}</span>
          <span className="text-sm text-zinc-400">hrs</span>
        </div>
      </div>
    </div>
  );
}

function EraSection({ era, index, watchedItems, toggleItem }: { era: Era, index: number, watchedItems: Set<string>, toggleItem: (id: string) => void }) {
  const eraWatchedCount = era.items.filter(item => watchedItems.has(item.id)).length;
  const isCompleted = eraWatchedCount === era.items.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-4 top-16 bottom-[-4rem] w-px bg-zinc-800 hidden md:block" />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Era Header */}
        <div className="md:w-1/3 shrink-0 relative z-10">
          <div className="sticky top-8 space-y-4 bg-[#09090b] py-2">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>
                {index + 1}
              </div>
              <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                {era.title.split(': ')[0]}
              </h2>
            </div>
            <div className="pl-11">
              <h3 className="text-lg font-medium text-zinc-200 mb-2">{era.title.split(': ')[1]}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{era.description}</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
                <span className={isCompleted ? "text-emerald-400" : "text-zinc-300"}>
                  {eraWatchedCount} / {era.items.length}
                </span>
                <span className="text-zinc-500">vistos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="md:w-2/3 space-y-3 md:pl-8">
          {era.items.map(item => (
            <MediaItemCard 
              key={item.id} 
              item={item} 
              isWatched={watchedItems.has(item.id)} 
              onToggle={() => toggleItem(item.id)} 
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MediaItemCard({ item, isWatched, onToggle }: { item: MediaItem, isWatched: boolean, onToggle: () => void }) {
  return (
    <div 
      onClick={onToggle}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden ${
        isWatched 
          ? 'bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-800/50' 
          : 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700'
      }`}
    >
      <div className="flex gap-4">
        <div className="shrink-0 mt-1">
          {isWatched ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          ) : (
            <Circle className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          )}
        </div>
        
        <div className="space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <h4 className={`font-medium text-base transition-colors ${isWatched ? 'text-zinc-300' : 'text-zinc-100'}`}>
              {item.title}
            </h4>
            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800/50">
                {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {item.duration}m
              </span>
            </div>
          </div>
          
          <div className={`text-sm leading-relaxed transition-colors ${isWatched ? 'text-zinc-600' : 'text-zinc-400'}`}>
            <span className="inline-flex items-center gap-1 font-medium text-zinc-500 mr-2">
              <Info className="w-3.5 h-3.5" /> Por qué verlo:
            </span>
            {item.reason}
          </div>
        </div>
      </div>
    </div>
  );
}
