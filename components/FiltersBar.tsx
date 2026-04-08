import { Search, EyeOff, Eye } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useProgressStore } from '@/store/progress';

type Preset = 'all' | 'essential' | 'fast' | 'essential-background' | 'movie-background';

export default function FiltersBar() {
  const {
    filterType, setFilterType,
    preset, setPreset,
    hideCompleted, setHideCompleted,
    searchQuery, setSearchQuery,
    selectedRoute
  } = useUIStore();

  const { resetProgress } = useProgressStore();

  return (
    <section className="space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between bg-surface-2/30 p-3 rounded-sm border border-surface-4/40">

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar episodio o película..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-1/80 border border-surface-4/50 rounded-sm pl-9 pr-4 py-2 text-sm text-text-body placeholder:text-text-muted/60 focus:outline-none focus:border-glow-success/40 focus:ring-1 focus:ring-glow-success/20 transition-all"
            />
          </div>

          <div className="flex bg-surface-1/60 rounded-sm p-0.5 border border-surface-4/50">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${filterType === 'all' ? 'bg-surface-3 text-text-heading' : 'text-text-muted hover:text-text-body'}`}
            >
              Todo
            </button>
            <button
              onClick={() => setFilterType('movie')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${filterType === 'movie' ? 'bg-surface-3 text-text-heading' : 'text-text-muted hover:text-text-body'}`}
            >
              Películas
            </button>
            <button
              onClick={() => setFilterType('series')}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm transition-colors ${filterType === 'series' ? 'bg-surface-3 text-text-heading' : 'text-text-muted hover:text-text-body'}`}
            >
              Series
            </button>
          </div>

          <button
            onClick={() => setHideCompleted(!hideCompleted)}
            className={`px-3 py-2 text-xs font-mono rounded-sm border transition-colors flex items-center gap-2 ${hideCompleted ? 'bg-glow-success/10 border-glow-success/30 text-glow-success' : 'bg-surface-1/60 border-surface-4/50 text-text-muted hover:text-text-body hover:border-surface-4'}`}
          >
            {hideCompleted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Ocultar completados</span>
          </button>
        </div>
      </div>

      {/* Presets */}
      {!selectedRoute && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider mr-1">Filtros:</span>
          {[
            { id: 'all',                label: 'Lista completa' },
            { id: 'essential',          label: 'Imprescindible' },
            { id: 'fast',               label: 'Modo rápido' },
            { id: 'essential-background', label: 'Fondo esencial' },
            { id: 'movie-background',   label: 'Solo películas' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id as Preset)}
              className={`px-3 py-1.5 text-[11px] font-mono rounded-sm border transition-all ${
                preset === p.id
                  ? 'bg-glow-success/10 border-glow-success/40 text-glow-success'
                  : 'bg-surface-2/30 border-surface-4/40 text-text-muted hover:border-surface-4 hover:text-text-body'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
