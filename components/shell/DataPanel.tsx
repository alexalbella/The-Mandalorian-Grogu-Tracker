'use client';

import { CheckCircle2, Clock, Flame, PlayCircle, Download, Upload, RotateCcw } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import { Era } from '@/data/starwars-list';

function StatCard({ title, value, subtitle, icon, progress }: { title: string, value: string, subtitle: React.ReactNode, icon: React.ReactNode, progress?: number }) {
  return (
    <div className="bg-surface-2/50 border border-surface-4/50 rounded-2xl p-6 relative overflow-hidden">
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
        <p className="text-3xl font-bold font-mono tracking-tight text-text-heading">{value}</p>
        <div className="text-xs text-text-muted">{subtitle}</div>
      </div>
    </div>
  );
}

export function StatsPanel({ eras }: { eras: Era[] }) {
  const { totalItems, watchedCount, completedCount, progressPercent, totalMinutes, watchedMinutes, remainingMinutes } = useDashboardStats(eras);
  const { streak } = useProgressStore();
  const selectedRoute = useUIStore(state => state.selectedRoute);
  const focusMode = useUIStore(state => state.focusMode);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  const routeName = selectedRoute ? selectedRoute.replace('-', ' ') : 'Plan';

  return (
    <section className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-500 ${focusMode && selectedRoute ? 'ring-2 ring-glow-success/30 rounded-2xl shadow-[0_0_30px_rgba(20,255,140,0.1)]' : ''}`}>
      <StatCard 
        title={`Progreso: ${routeName}`}
        value={`${progressPercent}%`} 
        subtitle={
          <div className="flex flex-col gap-1">
            <span>{completedCount} de {totalItems} completados</span>
            <span className="text-glow-success/80">{watchedCount} vistos de verdad</span>
          </div>
        }
        icon={<CheckCircle2 className="w-5 h-5 text-glow-success" />}
        progress={progressPercent}
      />
      <StatCard 
        title="Racha Actual" 
        value={`${streak} ${streak === 1 ? 'día' : 'días'}`} 
        subtitle="Viendo Star Wars"
        icon={<Flame className="w-5 h-5 text-glow-warning" />}
      />
      <StatCard 
        title="Tiempo Invertido" 
        value={formatTime(watchedMinutes)} 
        subtitle="Horas de visionado"
        icon={<PlayCircle className="w-5 h-5 text-glow-info" />}
      />
      <StatCard 
        title="Tiempo Restante" 
        value={formatTime(remainingMinutes)} 
        subtitle={`De un total de ${formatTime(totalMinutes)}`}
        icon={<Clock className="w-5 h-5 text-glow-warning" />}
      />
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
          className="px-4 py-2 text-xs font-medium rounded-lg border border-surface-4 text-text-body hover:bg-surface-3 transition-colors flex items-center gap-2"
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
        <button 
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer.')) {
              useProgressStore.getState().resetProgress();
              window.location.reload();
            }
          }}
          className="px-4 py-2 text-xs font-medium rounded-lg border border-glow-danger/30 text-glow-danger hover:bg-glow-danger/10 transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Resetear Todo
        </button>
      </div>
    </section>
  );
}
