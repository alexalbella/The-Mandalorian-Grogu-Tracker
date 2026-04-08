import { useState } from 'react';
import { useAchievementsStore } from '@/store/achievements';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Era } from '@/data/starwars-list';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ChevronDown, ChevronUp, Lock, CheckCircle2, Shield, ShieldHalf, ShieldAlert, CircleDollarSign, Coins, Crown, Crosshair, Target, Star, Eye, FileSearch, Database, Badge, Plane, Rocket, BookOpen, BrainCircuit, Swords, Sparkles, Info, Filter, Map, LucideIcon } from 'lucide-react';

import AchievementCard from './AchievementCard';

const iconMap: Record<string, LucideIcon> = {
  Shield, ShieldHalf, ShieldAlert,
  CircleDollarSign, Coins, Crown,
  Crosshair, Target, Star,
  Eye, FileSearch, Database,
  Badge, Plane, Rocket,
  BookOpen, BrainCircuit, Swords,
  Sparkles
};

const routeStyles: Record<string, { bg: string, border: string, glow: string, text: string, progress: string }> = {
  'mandalore':      { bg: 'bg-route-mandalore/8',  border: 'border-route-mandalore/25', glow: '', text: 'text-route-mandalore', progress: 'bg-route-mandalore' },
  'hutt':           { bg: 'bg-route-hutt/8',        border: 'border-route-hutt/25',       glow: '', text: 'text-route-hutt',       progress: 'bg-route-hutt' },
  'bounty-hunters': { bg: 'bg-route-bounty/8',      border: 'border-route-bounty/25',     glow: '', text: 'text-route-bounty',     progress: 'bg-route-bounty' },
  'empire':         { bg: 'bg-route-empire/8',      border: 'border-route-empire/25',     glow: '', text: 'text-route-empire',     progress: 'bg-route-empire' },
  'new-republic':   { bg: 'bg-route-republic/8',    border: 'border-route-republic/25',   glow: '', text: 'text-route-republic',   progress: 'bg-route-republic' },
  'thrawn':         { bg: 'bg-route-thrawn/8',      border: 'border-route-thrawn/25',     glow: '', text: 'text-route-thrawn',     progress: 'bg-route-thrawn' },
  'meta':           { bg: 'bg-route-meta/8',        border: 'border-route-meta/25',       glow: '', text: 'text-route-meta',       progress: 'bg-route-meta' },
};

export default function AchievementsPanel({ 
  eras, 
  calculateProgress
}: { 
  eras: Era[], 
  calculateProgress: (rule: { type: 'tagProgress' | 'globalProgress', tag?: string }) => number
}) {
  const { unlockedAchievements } = useAchievementsStore();
  const { isCompleted } = useProgressStore();
  const { setPreset, selectedRoute, setSelectedRoute } = useUIStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Group achievements by category
  const categories: import('@/types/achievements').AchievementCategory[] = ['mandalore', 'hutt', 'bounty-hunters', 'empire', 'new-republic', 'thrawn', 'meta'];
  
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
    return categoryAchievements.find(a => !unlockedAchievements.includes(a.id)) || null;
  };

  const getActionableHint = (category: string, nextLocked: import('@/types/achievements').Achievement | null) => {
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
        const tierName = nextLocked.tier === 'silver' ? 'plata' : nextLocked.tier === 'gold' ? 'oro' : 'bronce';
        return `Faltan ${remaining} para ${tierName}`;
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
        return `Faltan ${remaining} para terminar`;
      }
    }
    return "";
  };

  return (
    <div className="bg-surface-1 border border-surface-4/50 rounded-sm overflow-hidden mb-8 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-surface-2/20 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm bg-surface-2/60 border border-surface-4/50 flex items-center justify-center text-text-muted group-hover:text-glow-success group-hover:border-glow-success/40 transition-colors">
            <Map className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-lg text-text-heading leading-tight">Atlas de Rutas</h3>
            <p className="text-[11px] text-text-muted font-mono mt-0.5">{categories.length} rutas · {ACHIEVEMENTS.length} hitos narrativos</p>
          </div>
        </div>
        <div className="text-text-muted group-hover:text-text-body transition-colors bg-surface-2/40 p-1.5 rounded-sm border border-surface-4/40">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { height: 0, opacity: 0 },
              visible: { 
                height: 'auto', 
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="border-t border-surface-4/40 bg-surface-1/20"
          >
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category, index) => {
                const progress = getCategoryProgress(category);
                const highestUnlocked = getHighestUnlockedTier(category);
                const nextLocked = getNextLockedAchievement(category);
                
                const displayAchievement = highestUnlocked || nextLocked || ACHIEVEMENTS.find(a => a.category === category);
                if (!displayAchievement) return null;

                const Icon = iconMap[displayAchievement.icon] || Award;
                const isFullyUnlocked = !nextLocked;
                const hint = getActionableHint(category, nextLocked);
                
                const style = routeStyles[category] || routeStyles['mandalore'];
                
                const isActive = progress > 0;
                const isSelected = selectedRoute === category;
                const textColor = isActive ? style.text : 'text-text-muted';

                return (
                  <AchievementCard
                    key={category}
                    category={category}
                    progress={progress}
                    highestUnlocked={highestUnlocked}
                    nextLocked={nextLocked}
                    displayAchievement={displayAchievement}
                    unlockedAchievements={unlockedAchievements}
                    isSelected={isSelected}
                    setSelectedRoute={setSelectedRoute}
                    setPreset={setPreset}
                    style={style}
                    isActive={isActive}
                    textColor={textColor}
                    hint={hint}
                    isFullyUnlocked={isFullyUnlocked}
                    Icon={Icon}
                    index={index}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
