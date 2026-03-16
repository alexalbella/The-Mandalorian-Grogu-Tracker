import { useState } from 'react';
import { useGamificationStore } from '@/store/gamification';
import { useProgressStore } from '@/store/progress';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Era } from '@/data/starwars-list';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronDown, ChevronUp, Lock, CheckCircle2, Shield, ShieldHalf, ShieldAlert, CircleDollarSign, Coins, Crown, Crosshair, Target, Star, Eye, FileSearch, Database, Badge, Plane, Rocket, BookOpen, BrainCircuit, Swords, Sparkles, Info } from 'lucide-react';

const iconMap: Record<string, React.FC<any>> = {
  Shield, ShieldHalf, ShieldAlert,
  CircleDollarSign, Coins, Crown,
  Crosshair, Target, Star,
  Eye, FileSearch, Database,
  Badge, Plane, Rocket,
  BookOpen, BrainCircuit, Swords,
  Sparkles
};

export default function AchievementsPanel({ 
  eras, 
  calculateProgress,
  generateMission
}: { 
  eras: Era[], 
  calculateProgress: (rule: { type: 'tagProgress' | 'globalProgress', tag?: string }) => number,
  generateMission: (lengthPref?: any, forceRegenerate?: boolean, specificTag?: string) => void
}) {
  const { unlockedAchievements } = useGamificationStore();
  const { isCompleted } = useProgressStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Group achievements by category
  const categories = ['mandalore', 'hutt', 'bounty-hunters', 'empire', 'new-republic', 'thrawn', 'meta'];
  
  const getCategoryProgress = (category: string) => {
    const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category);
    if (categoryAchievements.length === 0) return 0;
    
    // Use the unlock rule of the first achievement to calculate progress
    const rule = categoryAchievements[0].unlockRule;
    return calculateProgress(rule);
  };

  const getHighestUnlockedTier = (category: string) => {
    const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category);
    const unlocked = categoryAchievements.filter(a => unlockedAchievements.includes(a.id));
    if (unlocked.length === 0) return null;
    return unlocked[unlocked.length - 1]; // Assuming they are ordered bronze -> silver -> gold
  };

  const getNextLockedAchievement = (category: string) => {
    const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category);
    return categoryAchievements.find(a => !unlockedAchievements.includes(a.id));
  };

  const getActionableHint = (category: string, nextLocked: typeof ACHIEVEMENTS[0] | undefined) => {
    if (!nextLocked) return "Ruta completada";
    
    const rule = nextLocked.unlockRule;
    if (rule.type === 'tagProgress' && rule.tag) {
      let totalItemsWithTag = 0;
      let watchedItemsWithTag = 0;
      
      eras.forEach(era => {
        era.items.forEach(item => {
          if (item.subItems) {
            item.subItems.forEach(sub => {
              if (item.tags.includes(rule.tag!)) {
                totalItemsWithTag++;
                if (isCompleted(sub.id)) watchedItemsWithTag++;
              }
            });
          } else {
            if (item.tags.includes(rule.tag!)) {
              totalItemsWithTag++;
              if (isCompleted(item.id)) watchedItemsWithTag++;
            }
          }
        });
      });
      
      const targetCount = Math.ceil(totalItemsWithTag * (rule.threshold / 100));
      const remaining = targetCount - watchedItemsWithTag;
      
      if (remaining > 0) {
        const tierName = nextLocked.tier === 'silver' ? 'la plata' : nextLocked.tier === 'gold' ? 'el oro' : 'el bronce';
        return `Faltan ${remaining} ep. para ${tierName}`;
      }
      return `Desbloquea ${nextLocked.tier}`;
    } else if (rule.type === 'globalProgress') {
      let totalItems = 0;
      let watched = 0;
      eras.forEach(era => {
        era.items.forEach(item => {
          if (item.subItems) {
            totalItems += item.subItems.length;
            item.subItems.forEach(sub => {
              if (isCompleted(sub.id)) watched++;
            });
          } else {
            totalItems++;
            if (isCompleted(item.id)) watched++;
          }
        });
      });
      const targetCount = Math.ceil(totalItems * (rule.threshold / 100));
      const remaining = targetCount - watched;
      if (remaining > 0) {
        return `Faltan ${remaining} ep. para terminar`;
      }
    }
    return "";
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-8 transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>Logros</h3>
            <p className="text-sm text-zinc-500">{unlockedAchievements.length} / {ACHIEVEMENTS.length} desbloqueados</p>
          </div>
        </div>
        <div className="text-zinc-500">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-zinc-800"
          >
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map(category => {
                const progress = getCategoryProgress(category);
                const highestUnlocked = getHighestUnlockedTier(category);
                const nextLocked = getNextLockedAchievement(category);
                
                // Determine which achievement to show for the category
                const displayAchievement = highestUnlocked || nextLocked || ACHIEVEMENTS.find(a => a.category === category);
                if (!displayAchievement) return null;

                const Icon = iconMap[displayAchievement.icon] || Award;
                const isUnlocked = unlockedAchievements.includes(displayAchievement.id);
                const hint = getActionableHint(category, nextLocked);

                return (
                  <div key={category} className={`p-4 rounded-xl border transition-all flex flex-col ${isUnlocked ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-950 border-zinc-900'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isUnlocked ? displayAchievement.accentClass : 'text-zinc-600 bg-zinc-900'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      {isUnlocked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-zinc-700" />
                      )}
                    </div>
                    
                    <h4 className={`font-medium mb-1 ${isUnlocked ? 'text-zinc-200' : 'text-zinc-500'}`}>
                      {displayAchievement.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mb-4 line-clamp-2 h-8 flex-grow">
                      {displayAchievement.description}
                    </p>
                    
                    {!isUnlocked && hint && (
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-500/80 bg-amber-500/10 px-2 py-1 rounded-md mb-3 w-fit">
                        <Info className="w-3 h-3" />
                        {hint}
                      </div>
                    )}
                    {isUnlocked && !nextLocked && (
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-500/80 bg-emerald-500/10 px-2 py-1 rounded-md mb-3 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        Ruta completada
                      </div>
                    )}
                    
                    <div className="space-y-1.5 mt-auto">
                      <div className="flex justify-between text-xs font-mono">
                        <span className={isUnlocked ? 'text-emerald-400' : 'text-zinc-600'}>
                          {Math.round(progress)}%
                        </span>
                        {nextLocked && !isUnlocked && (
                          <span className="text-zinc-600">
                            Meta: {nextLocked.unlockRule.threshold}%
                          </span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      {!isUnlocked && nextLocked && nextLocked.unlockRule.type === 'tagProgress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            generateMission(undefined, true, nextLocked.unlockRule.tag);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full mt-2 py-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Target className="w-3.5 h-3.5" />
                          Misión para este logro
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
