import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { Era } from '@/data/starwars-list';
import { useUIStore } from '@/store/ui';
import MediaItemCard from './MediaItemCard';

export default function EraSection({ 
  era, 
  index, 
  isCompleted, 
  toggleItem,
  markMultiple,
  unmarkMultiple
}: { 
  era: Era, 
  index: number, 
  isCompleted: (id: string) => boolean, 
  toggleItem: (id: string) => void,
  markMultiple: (ids: string[]) => void,
  unmarkMultiple: (ids: string[]) => void
}) {
  const { expandedEras, toggleEraExpanded } = useUIStore();
  
  // Default to true if not set
  const isExpanded = expandedEras[era.id] !== false;
  
  const eraItemIds = era.items.flatMap(i => i.subItems ? i.subItems.map(s => s.id) : [i.id]);
  const eraTotalCount = eraItemIds.length;
  const eraWatchedCount = eraItemIds.filter(id => isCompleted(id)).length;
  const isEraCompleted = eraWatchedCount === eraTotalCount && eraTotalCount > 0;
  const isPartiallyCompleted = eraWatchedCount > 0 && !isEraCompleted;

  const handleToggleAll = () => {
    if (isEraCompleted) {
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors shadow-lg ${isEraCompleted ? 'bg-glow-success/20 border-glow-success/50 text-glow-success shadow-glow-success/20' : 'bg-surface-2 border-surface-4 text-text-muted'}`}>
                {era.eraNumber}
              </div>
              <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isEraCompleted ? 'text-glow-success' : 'text-text-heading'}`} style={{ fontFamily: 'var(--font-display)' }}>
                ERA {era.eraNumber}
              </h2>
            </div>
            <div className="pl-11">
              <h3 className="text-lg font-medium text-text-body mb-2">{era.eraLabel}</h3>
              <p className="text-sm text-text-muted leading-relaxed mb-4">{era.description}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-surface-4 text-xs font-mono">
                  <span className={isCompleted(era.id) ? "text-glow-success font-bold" : "text-text-body"}>
                    {eraWatchedCount} / {eraTotalCount}
                  </span>
                  <span className="text-text-muted">vistos</span>
                </div>
                
                <button 
                  onClick={handleToggleAll}
                  className="p-1.5 rounded-lg border border-surface-4 text-text-muted hover:text-text-body hover:bg-surface-2 transition-colors"
                  title={isEraCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                  aria-label={isEraCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                >
                  {isEraCompleted ? <CheckSquare className="w-4 h-4 text-glow-success" /> : isPartiallyCompleted ? <Square className="w-4 h-4 text-glow-success/50" fill="currentColor" /> : <Square className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => toggleEraExpanded(era.id)}
                  className="p-1.5 rounded-lg border border-surface-4 text-text-muted hover:text-text-body hover:bg-surface-2 transition-colors md:hidden"
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
                    isCompleted={isCompleted}
                    toggleItem={toggleItem}
                    markMultiple={markMultiple}
                    unmarkMultiple={unmarkMultiple}
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
