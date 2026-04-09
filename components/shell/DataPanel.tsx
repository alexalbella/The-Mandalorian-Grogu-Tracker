'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { CheckCircle2, Clock, Flame, PlayCircle, Download, Upload, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import { Era } from '@/data/starwars-list';

function AnimatedCounter({ value, format, suffix = '' }: { value: number, format?: (v: number) => string, suffix?: string }) {
  const spring = useSpring(value, { bounce: 0, duration: 800 });
  
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const display = useTransform(spring, (current) => {
    const rounded = Math.round(current);
    return (format ? format(rounded) : rounded.toString()) + suffix;
  });

  return <motion.span>{display}</motion.span>;
}

function StatCard({ title, value, subtitle, icon, progress }: { title: string, value: React.ReactNode, subtitle: React.ReactNode, icon: React.ReactNode, progress?: number }) {
  return (
    <div className="bg-surface-2/30 border border-surface-4/40 rounded-sm p-5 relative overflow-hidden">
      {progress !== undefined && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-glow-success/50 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-text-body font-medium text-sm">{title}</h3>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-display font-semibold text-text-heading">{value}</p>
        <div className="text-xs text-text-muted">{subtitle}</div>
      </div>
    </div>
  );
}

export function StatsPanel({ eras }: { eras: Era[] }) {
  const { totalItems, watchedCount, completedCount, progressPercent, totalMinutes, watchedMinutes, remainingMinutes } = useDashboardStats(eras);
  const { streak, isCompleted } = useProgressStore();
  const selectedRoute = useUIStore(state => state.selectedRoute);
  const focusMode = useUIStore(state => state.focusMode);
  const [eraBreakdownOpen, setEraBreakdownOpen] = useState(false);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    if (hours === 0) return `${minutes}m`;
    return `${hours}h ${minutes}m`;
  };

  const routeName = selectedRoute ? selectedRoute.replace('-', ' ') : 'Plan';

  const eraStats = eras.map(era => {
    let eraTotalMins = 0;
    let eraWatchedMins = 0;
    era.items.forEach(item => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach(sub => {
          eraTotalMins += sub.duration;
          if (isCompleted(sub.id)) eraWatchedMins += sub.duration;
        });
      } else {
        eraTotalMins += item.duration;
        if (isCompleted(item.id)) eraWatchedMins += item.duration;
      }
    });
    const pct = eraTotalMins > 0 ? Math.round((eraWatchedMins / eraTotalMins) * 100) : 0;
    return { label: era.eraLabel, eraTotalMins, eraWatchedMins, pct };
  });

  return (
    <section className={`space-y-3 transition-all duration-500 ${focusMode && selectedRoute ? 'ring-1 ring-glow-success/20 rounded-sm p-1' : ''}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title={`Progreso: ${routeName}`}
          value={<AnimatedCounter value={progressPercent} suffix="%" />}
          subtitle={
            <div className="flex flex-col gap-1">
              <span><AnimatedCounter value={completedCount} /> de {totalItems} completados</span>
              <span className="text-glow-success/80"><AnimatedCounter value={watchedCount} /> vistos de verdad</span>
            </div>
          }
          icon={<CheckCircle2 className="w-5 h-5 text-glow-success" />}
          progress={progressPercent}
        />
        <StatCard
          title="Racha Actual"
          value={<AnimatedCounter value={streak} suffix={streak === 1 ? ' día' : ' días'} />}
          subtitle="Viendo Star Wars"
          icon={<Flame className="w-5 h-5 text-glow-warning" />}
        />
        <StatCard
          title="Tiempo Invertido"
          value={<AnimatedCounter value={watchedMinutes} format={formatTime} />}
          subtitle="Horas de visionado"
          icon={<PlayCircle className="w-5 h-5 text-glow-info" />}
        />
        <StatCard
          title="Tiempo Restante"
          value={<AnimatedCounter value={remainingMinutes} format={formatTime} />}
          subtitle={`De un total de ${formatTime(totalMinutes)}`}
          icon={<Clock className="w-5 h-5 text-glow-warning" />}
        />
      </div>

      {/* Era time breakdown */}
      <div className="bg-surface-2/20 border border-surface-4/30 rounded-sm overflow-hidden">
        <button
          onClick={() => setEraBreakdownOpen(v => !v)}
          className="w-full px-5 py-3 flex items-center justify-between hover:bg-surface-2/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-3.5 h-3.5 text-text-muted group-hover:text-glow-success transition-colors" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-text-muted group-hover:text-text-body transition-colors">
              Tiempo por Era
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-text-muted">
              {formatTime(watchedMinutes)} / {formatTime(totalMinutes)}
            </span>
            {eraBreakdownOpen
              ? <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
              : <ChevronDown className="w-3.5 h-3.5 text-text-muted" />}
          </div>
        </button>

        {eraBreakdownOpen && (
          <div className="border-t border-surface-4/30 divide-y divide-surface-4/20">
            {eraStats.map(({ label, eraTotalMins, eraWatchedMins, pct }) => (
              <div key={label} className="px-5 py-2.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-body truncate">{label}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-24 h-px bg-surface-4/40 relative hidden sm:block">
                    <div
                      className="absolute inset-y-0 left-0 bg-glow-success/70 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-glow-success w-8 text-right">{pct}%</span>
                  <span className="text-[10px] font-mono text-text-muted w-28 text-right">
                    {formatTime(eraWatchedMins)} / {formatTime(eraTotalMins)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function DataManagementPanel() {
  return (
    <section className="pt-12 pb-8 border-t border-surface-4 flex flex-col items-center gap-4">
      <h3 className="text-text-muted text-xs font-medium uppercase tracking-widest">Gestión de Datos (Local-First)</h3>
      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => {
            const progress = localStorage.getItem('mando-grogu-progress');
            const achievements = localStorage.getItem('mando-grogu-achievements');
            const ui = localStorage.getItem('mando-grogu-ui');
            const backup = { progress, achievements, ui };
            const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `starwars-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}
          className="px-4 py-2 text-xs font-mono rounded-sm border border-surface-4/50 text-text-body hover:bg-surface-3/40 transition-colors flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar Progreso
        </button>
        <label className="px-4 py-2 text-xs font-medium rounded-lg border border-surface-4 text-text-body hover:bg-surface-3 transition-colors flex items-center gap-2 cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          Importar
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const MAX_SIZE = 1024 * 1024; // 1 MB
              if (file.size > MAX_SIZE) {
                alert('El archivo es demasiado grande. El máximo es 1 MB.');
                return;
              }

              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const content = ev.target?.result as string;
                  const backup = JSON.parse(content);

                  if (typeof backup !== 'object' || backup === null || Array.isArray(backup)) {
                    throw new Error('Formato inválido');
                  }

                  const validKeys = ['progress', 'achievements', 'ui'];
                  const hasValidKey = validKeys.some(key => key in backup);
                  if (!hasValidKey) {
                    throw new Error('El archivo no contiene datos de backup válidos');
                  }

                  const hasUnknownKeys = Object.keys(backup).some(key => !validKeys.includes(key));
                  if (hasUnknownKeys) {
                    throw new Error('El archivo contiene claves no reconocidas');
                  }

                  for (const key of validKeys) {
                    if (key in backup && typeof backup[key] !== 'string') {
                      throw new Error(`El campo "${key}" no tiene un formato válido`);
                    }
                  }

                  if (backup.progress) localStorage.setItem('mando-grogu-progress', backup.progress);
                  if (backup.achievements) localStorage.setItem('mando-grogu-achievements', backup.achievements);
                  if (backup.ui) localStorage.setItem('mando-grogu-ui', backup.ui);
                  window.location.reload();
                } catch (err) {
                  alert(err instanceof Error && err.message !== 'Formato inválido'
                    ? err.message
                    : 'Error al importar el archivo. Asegúrate de que es un backup válido.');
                }
              };
              reader.readAsText(file);
            }} 
          />
        </label>
        <button 
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
              useProgressStore.getState().resetProgress();
              window.location.reload();
            }
          }}
          className="px-4 py-2 text-xs font-mono rounded-sm border border-glow-danger/30 text-glow-danger hover:bg-glow-danger/10 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Resetear Todo
        </button>
      </div>
    </section>
  );
}
