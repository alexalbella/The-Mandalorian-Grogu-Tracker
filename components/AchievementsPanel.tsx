import { useState } from 'react';
import { useGamificationStore } from '@/store/gamification';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Era } from '@/data/starwars-list';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronDown, ChevronUp, Lock, CheckCircle2, Shield, ShieldHalf, ShieldAlert, CircleDollarSign, Coins, Crown, Crosshair, Target, Star, Eye, FileSearch, Database, Badge, Plane, Rocket, BookOpen, BrainCircuit, Swords, Sparkles } from 'lucide-react';

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
  calculateProgress 
}: { 
  eras: Era[], 
  calculateProgress: (rule: { type: 'tagProgress' | 'globalProgress', tag?: string }) => number 
}) {
  const { unlockedAchievements } = useGamificationStore();
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

                return (
                  <div key={category} className={`p-4 rounded-xl border transition-all ${isUnlocked ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-950 border-zinc-900'}`}>
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
                    <p className="text-xs text-zinc-500 mb-4 line-clamp-2 h-8">
                      {displayAchievement.description}
                    </p>
                    
                    <div className="space-y-1.5">
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
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
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
