'use client';

import { useState, useEffect } from 'react';
import { Calendar, Flame, PlayCircle } from 'lucide-react';

export default function CountdownWidget({ remainingMinutes }: { remainingMinutes: number }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    // Release date: May 22, 2026
    const releaseDate = new Date('2026-05-22T00:00:00Z').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = releaseDate - now;
      
      if (distance <= 0) {
        setIsReleased(true);
      } else {
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

  if (!isMounted) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-6 shrink-0 min-w-[280px] min-h-[90px] animate-pulse" />
    );
  }

  if (isReleased) {
    return (
      <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-2xl p-5 flex flex-col gap-4 shrink-0">
        <div className="flex items-center gap-6">
          <div className="bg-emerald-900/50 p-3 rounded-xl border border-emerald-800/50">
            <PlayCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-emerald-500 uppercase tracking-wider font-semibold mb-1">¡El momento ha llegado!</p>
            <div className="text-xl font-bold text-emerald-50">Ya en cines</div>
          </div>
        </div>
        <a 
          href="https://www.youtube.com/results?search_query=the+mandalorian+and+grogu+trailer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors text-center"
        >
          Ver Tráiler Oficial
        </a>
      </div>
    );
  }

  const pace = timeLeft.days > 0 ? Math.ceil(remainingMinutes / timeLeft.days) : remainingMinutes;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 shrink-0">
      <div className="flex items-center gap-6">
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
      
      {remainingMinutes > 0 && (
        <div className="pt-3 border-t border-zinc-800/50 flex items-start gap-3">
          <Flame className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed max-w-[220px]">
            Pace Tracker: Necesitas ver <strong className="text-zinc-200">{pace} min/día</strong> para llegar al día del estreno.
          </p>
        </div>
      )}
    </div>
  );
}
