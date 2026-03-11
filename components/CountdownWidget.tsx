'use client';

import { useState, useEffect } from 'react';
import { Calendar, Flame, PlayCircle } from 'lucide-react';

export default function CountdownWidget({ remainingMinutes, isScrolled = false }: { remainingMinutes: number, isScrolled?: boolean }) {
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
      <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-6 shrink-0 animate-pulse transition-all duration-300 ${isScrolled ? 'p-3 min-w-[200px] min-h-[60px]' : 'p-5 min-w-[280px] min-h-[90px]'}`} />
    );
  }

  if (isReleased) {
    return (
      <div className={`bg-emerald-950/30 border border-emerald-900/50 rounded-2xl flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'p-3 gap-2' : 'p-5 gap-4'}`}>
        <div className={`flex items-center ${isScrolled ? 'gap-4' : 'gap-6'}`}>
          <div className={`bg-emerald-900/50 rounded-xl border border-emerald-800/50 flex items-center justify-center ${isScrolled ? 'p-2' : 'p-3'}`}>
            <PlayCircle className={`${isScrolled ? 'w-4 h-4' : 'w-6 h-6'} text-emerald-400`} />
          </div>
          <div>
            <p className={`text-emerald-500 uppercase tracking-wider font-semibold mb-1 ${isScrolled ? 'text-[10px]' : 'text-xs'}`}>¡El momento ha llegado!</p>
            <div className={`${isScrolled ? 'text-lg' : 'text-xl'} font-bold text-emerald-50`}>Ya en cines</div>
          </div>
        </div>
        {!isScrolled && (
          <a 
            href="https://www.youtube.com/results?search_query=the+mandalorian+and+grogu+trailer" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors text-center"
          >
            Ver Tráiler Oficial
          </a>
        )}
      </div>
    );
  }

  const pace = timeLeft.days > 0 ? Math.ceil(remainingMinutes / timeLeft.days) : remainingMinutes;

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'p-3 gap-2' : 'p-5 gap-4'}`}>
      <div className={`flex items-center ${isScrolled ? 'gap-4' : 'gap-6'}`}>
        <div className={`bg-zinc-950 rounded-xl border border-zinc-800/50 flex items-center justify-center ${isScrolled ? 'p-2' : 'p-3'}`}>
          <Calendar className={`${isScrolled ? 'w-4 h-4' : 'w-6 h-6'} text-zinc-400`} />
        </div>
        <div>
          <p className={`text-zinc-500 uppercase tracking-wider font-semibold mb-1 ${isScrolled ? 'text-[10px]' : 'text-xs'}`}>Estreno en Cines</p>
          <div className="flex items-baseline gap-2">
            <span className={`${isScrolled ? 'text-lg' : 'text-2xl'} font-bold font-mono text-emerald-400`}>{timeLeft.days}</span>
            <span className={`${isScrolled ? 'text-xs' : 'text-sm'} text-zinc-400`}>días</span>
            <span className={`${isScrolled ? 'text-lg' : 'text-2xl'} font-bold font-mono text-zinc-300 ml-2`}>{timeLeft.hours}</span>
            <span className={`${isScrolled ? 'text-xs' : 'text-sm'} text-zinc-400`}>hrs</span>
          </div>
        </div>
      </div>
      
      {!isScrolled && remainingMinutes > 0 && (
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
