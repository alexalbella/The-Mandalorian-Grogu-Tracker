import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore } from '@/store/ui';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Shield, ShieldHalf, ShieldAlert, CircleDollarSign, Coins, Crown, Crosshair, Target, Star, Eye, FileSearch, Database, Badge, Plane, Rocket, BookOpen, BrainCircuit, Swords, Sparkles, X } from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  Shield, ShieldHalf, ShieldAlert,
  CircleDollarSign, Coins, Crown,
  Crosshair, Target, Star,
  Eye, FileSearch, Database,
  Badge, Plane, Rocket,
  BookOpen, BrainCircuit, Swords,
  Sparkles
};

export default function AchievementToasts() {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const achievement = ACHIEVEMENTS.find(a => a.id === toast.achievementId);
          if (!achievement) return null;

          const Icon = iconMap[achievement.icon] || Star;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="pointer-events-auto relative overflow-hidden bg-surface-1 border border-surface-4/80 rounded-2xl shadow-2xl p-4 w-80 flex items-start gap-4"
            >
              <div className="relative shrink-0">
                <motion.div 
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 rounded-xl bg-glow-warning/20 border border-glow-warning/50 flex items-center justify-center text-glow-warning shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-[10px] uppercase tracking-wider font-bold text-glow-warning mb-1">Logro Desbloqueado</p>
                <h4 className="font-bold text-text-heading text-sm leading-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>{achievement.title}</h4>
                <p className="text-xs text-text-muted line-clamp-2">{achievement.description}</p>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="absolute top-2 right-2 p-1 text-text-muted hover:text-text-body rounded-md hover:bg-surface-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* Countdown bar */}
              <motion.div 
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                onAnimationComplete={() => removeToast(toast.id)}
                className="absolute bottom-0 left-0 right-0 h-1 bg-glow-warning origin-left"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
