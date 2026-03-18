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
      className={`relative p-6 rounded-2xl border ${isSkippedEssential ? 'bg-glow-warning/10 border-glow-warning/30' : 'bg-surface-2/80 border-surface-4/80'} mb-8 backdrop-blur-sm overflow-hidden`}
    >
      {!isSkippedEssential && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-glow-success/0 via-glow-success/10 to-glow-success/0" />
        </div>
      )}
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`mt-1 p-2 rounded-full ${isSkippedEssential ? 'bg-glow-warning/10 text-glow-warning' : 'bg-glow-success/10 text-glow-success'}`}>
            {isSkippedEssential ? <AlertTriangle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-heading mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {isSkippedEssential ? 'Aviso de ruta principal' : 'Siguiente paso en tu plan'}
            </h2>
            <div className="text-sm text-text-muted flex flex-col gap-1">
              {isSkippedEssential ? (
                <p>Te saltaste algo importante para entender el contexto global.</p>
              ) : (
                <p>Te quedaste en <span className="text-text-body font-medium">{currentEra?.eraLabel}</span>.</p>
              )}
              <p className="text-text-body font-medium mt-1 flex items-center gap-2">
                <ArrowRight className="w-3 h-3 text-text-muted" />
                {nextItem.item.title} {nextItem.subItem ? `- ${nextItem.subItem.title}` : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:justify-end">
          {isSkippedEssential && (
            <button 
              onClick={() => handleSkipItem(nextItem.subItem ? nextItem.subItem.id : nextItem.item.id)}
              className="px-4 py-2 bg-surface-3/50 hover:bg-surface-3 text-text-body font-medium rounded-lg transition-colors text-sm border border-surface-4/50"
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
                  element.classList.add('ring-2', isSkippedEssential ? 'ring-glow-warning' : 'ring-glow-success', 'ring-offset-4', 'ring-offset-surface-1', 'transition-all', 'duration-500', 'rounded-xl');
                  setTimeout(() => {
                    element.classList.remove('ring-2', isSkippedEssential ? 'ring-glow-warning' : 'ring-glow-success', 'ring-offset-4', 'ring-offset-surface-1');
                  }, 2000);
                }
              }, 150);
            }}
            className={`px-5 py-2 ${isSkippedEssential ? 'bg-glow-warning hover:bg-glow-warning/80 text-surface-1' : 'bg-glow-success hover:bg-glow-success/80 text-surface-1'} font-medium rounded-lg transition-colors text-sm shadow-lg shadow-black/20`}
          >
            {isSkippedEssential ? 'Ir al episodio' : 'Continuar viendo'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
