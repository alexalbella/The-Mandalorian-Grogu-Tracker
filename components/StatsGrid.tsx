import { Clock, Film, Tv } from 'lucide-react';

export default function StatsGrid({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Film className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Progreso</span>
        </div>
        <div className="text-2xl font-bold text-zinc-100">{stats.progressPercent}%</div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Tv className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Visto</span>
        </div>
        <div className="text-2xl font-bold text-zinc-100">{stats.watchedCount}</div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Horas</span>
        </div>
        <div className="text-2xl font-bold text-zinc-100">{Math.round(stats.watchedMinutes / 60)}h</div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-zinc-500 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs uppercase tracking-wider">Restante</span>
        </div>
        <div className="text-2xl font-bold text-zinc-100">{Math.round(stats.remainingMinutes / 60)}h</div>
      </div>
    </div>
  );
}
