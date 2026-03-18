import { Search, EyeOff, Eye, RotateCcw } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useProgressStore } from '@/store/progress';

type Preset = 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt' | 'bounty-hunters' | 'new-republic' | 'essential-background' | 'movie-background';

export default function FiltersBar() {
  const { 
    filterType, setFilterType, 
    preset, setPreset, 
    hideCompleted, setHideCompleted, 
    searchQuery, setSearchQuery 
  } = useUIStore();
  
  const { resetProgress } = useProgressStore();

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-surface-2/50 p-4 rounded-2xl border border-surface-4/50">
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Buscar episodio o película..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-1 border border-surface-4 rounded-lg pl-9 pr-4 py-2 text-sm text-text-body focus:outline-none focus:border-glow-success/50 focus:ring-1 focus:ring-glow-success/50 transition-all"
            />
          </div>

          <div className="flex bg-surface-1 rounded-lg p-1 border border-surface-4">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'all' ? 'bg-surface-3 text-text-heading' : 'text-text-muted hover:text-text-body'}`}
            >
              Todo
            </button>
            <button 
              onClick={() => setFilterType('movie')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'movie' ? 'bg-surface-3 text-text-heading' : 'text-text-muted hover:text-text-body'}`}
            >
              Películas
            </button>
            <button 
              onClick={() => setFilterType('series')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'series' ? 'bg-surface-3 text-text-heading' : 'text-text-muted hover:text-text-body'}`}
            >
              Series
            </button>
          </div>
          
          <button 
            onClick={() => setHideCompleted(!hideCompleted)}
            className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-2 ${hideCompleted ? 'bg-glow-success/10 border-glow-success/30 text-glow-success' : 'bg-surface-1 border-surface-4 text-text-muted hover:bg-surface-2'}`}
          >
            {hideCompleted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Ocultar Completados</span>
          </button>
        </div>
      </div>

      {/* Presets Row */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider mr-2">Presets:</span>
        {[
          { id: 'all', label: 'Lista Completa' },
          { id: 'essential', label: 'Imprescindible' },
          { id: 'fast', label: 'Modo Rápido' },
          { id: 'mandalore', label: 'Solo Mandalore' },
          { id: 'thrawn', label: 'Solo Thrawn' },
          { id: 'new-republic', label: 'Solo Nueva República' },
          { id: 'hutt', label: 'Trama Hutt' },
          { id: 'bounty-hunters', label: 'Solo Cazarrecompensas' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPreset(p.id as Preset)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              preset === p.id 
                ? 'bg-glow-success/20 border-glow-success/50 text-glow-success' 
                : 'bg-surface-2 border-surface-4 text-text-muted hover:border-surface-3 hover:text-text-body'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </section>
  );
}
