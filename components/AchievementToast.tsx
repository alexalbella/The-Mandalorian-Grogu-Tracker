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
              className="pointer-events-auto relative overflow-hidden bg-surface-2 border border-surface-4/60 rounded-sm shadow-lg p-4 w-72 flex items-start gap-3"
            >
              <div className="relative shrink-0">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, type: 'spring', stiffness: 300 }}
                  className="w-10 h-10 rounded-sm bg-glow-warning/10 border border-glow-warning/30 flex items-center justify-center text-glow-warning"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-[9px] uppercase tracking-widest font-mono text-glow-warning mb-1">Logro desbloqueado</p>
                <h4 className="font-display font-semibold text-text-heading text-sm leading-tight mb-1">{achievement.title}</h4>
                <p className="text-[11px] text-text-muted line-clamp-2">{achievement.description}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute top-2 right-2 p-1 text-text-muted hover:text-text-body rounded-sm hover:bg-surface-3 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Countdown bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                onAnimationComplete={() => removeToast(toast.id)}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-glow-warning/60 origin-left"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
