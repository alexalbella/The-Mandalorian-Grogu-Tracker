import { Era, MediaItem } from '@/data/starwars-list';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-2xl border ${isSkippedEssential ? 'bg-amber-950/30 border-amber-900/50' : 'bg-zinc-900 border-zinc-800'} mb-8`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {isSkippedEssential ? '¡Atención! Te saltaste algo importante' : 'Continuar donde lo dejaste'}
          </h2>
          <p className="text-sm text-zinc-400">
            {nextItem.subItem ? nextItem.subItem.title : nextItem.item.title}
          </p>
        </div>
        <div className="flex gap-2">
          {isSkippedEssential && (
            <button 
              onClick={() => handleSkipItem(nextItem.subItem ? nextItem.subItem.id : nextItem.item.id)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors text-sm"
            >
              Ignorar aviso
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
            className={`px-4 py-2 ${isSkippedEssential ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-medium rounded-lg transition-colors text-sm`}
          >
            {isSkippedEssential ? 'Ver ahora' : 'Continuar'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
