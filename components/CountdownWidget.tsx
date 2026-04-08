'use client';

import { useState, useEffect } from 'react';
import { Calendar, Flame, PlayCircle } from 'lucide-react';
import { SeriesConfig } from '@/types/series';

export default function CountdownWidget({ config, remainingMinutes, isScrolled = false }: { config: SeriesConfig, remainingMinutes: number, isScrolled?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const releaseDate = new Date(config.releaseDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = releaseDate - now;

      if (distance <= 0) {
        setIsReleased(true);
      } else {
        setIsReleased(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [config.releaseDate]);

  if (!isMounted) {
    return (
      <div className={`bg-surface-2/40 border border-surface-4/50 rounded-sm animate-pulse transition-all duration-300 ${isScrolled ? 'p-3 min-w-[200px] min-h-[60px]' : 'p-5 min-w-[260px] min-h-[90px]'}`} />
    );
  }

  if (isReleased) {
    return (
      <div className={`bg-glow-success/[0.07] border border-glow-success/25 rounded-sm flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'p-3 gap-2' : 'p-5 gap-4'}`}>
        <div className={`flex items-center ${isScrolled ? 'gap-4' : 'gap-5'}`}>
          <div className={`bg-surface-3/50 rounded-sm border border-surface-4/50 flex items-center justify-center ${isScrolled ? 'p-2' : 'p-3'}`}>
            <PlayCircle className={`${isScrolled ? 'w-4 h-4' : 'w-5 h-5'} text-glow-success`} />
          </div>
          <div>
            <p className={`text-text-muted font-mono uppercase tracking-wider mb-1 ${isScrolled ? 'text-[9px]' : 'text-[10px]'}`}>¡Disponible ahora!</p>
            <div className={`${isScrolled ? 'text-base' : 'text-lg'} font-display font-semibold text-glow-success`}>
              Ya en {config.releaseType === 'movie' ? 'cines' : 'Disney+'}
            </div>
          </div>
        </div>
        {!isScrolled && config.theme === 'mando' && (
          <a
            href="https://www.youtube.com/results?search_query=the+mandalorian+and+grogu+trailer"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-glow-success/10 hover:bg-glow-success/20 border border-glow-success/30 text-glow-success text-xs font-mono rounded-sm transition-colors text-center"
          >
            Ver tráiler oficial
          </a>
        )}
      </div>
    );
  }

  const pace = timeLeft.days > 0 ? Math.ceil(remainingMinutes / timeLeft.days) : remainingMinutes;

  return (
    <div className={`bg-surface-2/40 border border-surface-4/50 rounded-sm flex flex-col shrink-0 transition-all duration-300 ${isScrolled ? 'p-3 gap-2' : 'p-5 gap-4'}`}>
      <div className={`flex items-center ${isScrolled ? 'gap-4' : 'gap-5'}`}>
        <div className={`bg-surface-3/50 rounded-sm border border-surface-4/50 flex items-center justify-center ${isScrolled ? 'p-2' : 'p-3'}`}>
          <Calendar className={`${isScrolled ? 'w-4 h-4' : 'w-5 h-5'} text-text-muted`} />
        </div>
        <div>
          <p className={`text-text-muted font-mono uppercase tracking-wider mb-1 ${isScrolled ? 'text-[9px]' : 'text-[10px]'}`}>
            Estreno en {config.releaseType === 'movie' ? 'cines' : 'Disney+'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`${isScrolled ? 'text-lg' : 'text-2xl'} font-display font-semibold text-glow-success tabular-nums`}>{timeLeft.days}</span>
            <span className={`${isScrolled ? 'text-xs' : 'text-sm'} text-text-muted font-mono`}>días</span>
            <span className={`${isScrolled ? 'text-lg' : 'text-2xl'} font-display font-semibold text-text-body tabular-nums ml-1`}>{timeLeft.hours}</span>
            <span className={`${isScrolled ? 'text-xs' : 'text-sm'} text-text-muted font-mono`}>hrs</span>
          </div>
        </div>
      </div>

      {!isScrolled && remainingMinutes > 0 && (
        <div className="pt-3 border-t border-surface-4/40 flex items-start gap-2.5">
          <Flame className="w-3.5 h-3.5 text-glow-warning shrink-0 mt-0.5" />
          <p className="text-[11px] text-text-muted leading-relaxed max-w-[220px] font-mono">
            Ritmo diario: <span className="text-text-body">{pace} min/día</span> para llegar al estreno.
          </p>
        </div>
      )}
    </div>
  );
}
