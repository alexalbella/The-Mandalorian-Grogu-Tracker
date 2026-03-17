import { Era, MediaItem, eras } from '@/data/starwars-list';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, ArrowRight, PlayCircle } from 'lucide-react';

export default function ResumeFlow({ 
  nextItem, 
  handleSkipItem, 
  toggleEraExpanded, 
  expandedEras 
}: { 
  nextItem: any, 
  handleSkipItem: (id: string) => void, 
  toggleEraExpanded: (eraId: string) => void, 
  expandedEras: Record<string, boolean> 
}) {
  if (!nextItem) return null;

  const isSkippedEssential = nextItem.isSkippedEssential;
  const currentEra = eras.find(e => e.id === nextItem.eraId);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${isSkippedEssential ? 'bg-amber-950/20 border-amber-900/40' : 'bg-zinc-900/80 border-zinc-800/80'} mb-8 backdrop-blur-sm`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`mt-1 p-2 rounded-full ${isSkippedEssential ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isSkippedEssential ? <AlertTriangle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-100 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {isSkippedEssential ? 'Aviso de ruta principal' : 'Siguiente paso en tu plan'}
            </h2>
            <div className="text-sm text-zinc-400 flex flex-col gap-1">
              {isSkippedEssential ? (
                <p>Te saltaste algo importante para entender el contexto global.</p>
              ) : (
                <p>Te quedaste en <span className="text-zinc-300 font-medium">{currentEra?.eraLabel}</span>.</p>
              )}
              <p className="text-zinc-300 font-medium mt-1 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-zinc-500" />
                {nextItem.item.title} {nextItem.subItem ? `- ${nextItem.subItem.title}` : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:justify-end">
          {isSkippedEssential && (
            <button 
              onClick={() => handleSkipItem(nextItem.subItem ? nextItem.subItem.id : nextItem.item.id)}
              className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 font-medium rounded-lg transition-colors text-sm border border-zinc-700/50"
            >
              Ignorar por ahora
            </button>
          )}
          <button 
            onClick={() => {
              if (!expandedEras[nextItem.eraId]) {
                toggleEraExpanded(nextItem.eraId);
              }
              setTimeout(() => {
                const elementId = nextItem.subItem ? nextItem.subItem.id : nextItem.item.id;
                const element = document.getElementById(elementId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('ring-2', isSkippedEssential ? 'ring-amber-500' : 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950', 'transition-all', 'duration-500', 'rounded-xl');
                  setTimeout(() => {
                    element.classList.remove('ring-2', isSkippedEssential ? 'ring-amber-500' : 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950');
                  }, 2000);
                }
              }, 150);
            }}
            className={`px-5 py-2 ${isSkippedEssential ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'} font-medium rounded-lg transition-colors text-sm shadow-lg shadow-black/20`}
          >
            {isSkippedEssential ? 'Ir al episodio' : 'Continuar viendo'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
