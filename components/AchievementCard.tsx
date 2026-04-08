import { motion } from 'motion/react';
import { Crown, Filter, LucideIcon } from 'lucide-react';
import { ACHIEVEMENTS } from '@/data/achievements';
import { Achievement, AchievementCategory } from '@/types/achievements';
import { Preset } from '@/store/ui';

interface AchievementCardProps {
  category: AchievementCategory;
  progress: number;
  highestUnlocked: Achievement | null;
  nextLocked: Achievement | null;
  displayAchievement: Achievement;
  unlockedAchievements: string[];
  isSelected: boolean;
  setSelectedRoute: (route: string | null) => void;
  setPreset: (preset: Preset) => void;
  style: {
    bg: string;
    border: string;
    glow: string;
    progress: string;
  };
  isActive: boolean;
  textColor: string;
  hint: string | null;
  isFullyUnlocked: boolean;
  Icon: LucideIcon;
  index: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
};

export default function AchievementCard({
  category,
  progress,
  highestUnlocked,
  nextLocked,
  displayAchievement,
  unlockedAchievements,
  isSelected,
  setSelectedRoute,
  setPreset,
  style,
  isActive,
  textColor,
  hint,
  isFullyUnlocked,
  Icon,
  index
}: AchievementCardProps) {
  const tileBg     = isActive ? style.bg     : 'bg-surface-2/20';
  const tileBorder = isActive ? style.border : 'border-surface-4/40';

  return (
    <motion.div
      variants={itemVariants}
      onClick={() => setSelectedRoute(isSelected ? null : category)}
      className={`relative p-5 rounded-sm border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:brightness-110 ${tileBg} ${tileBorder} ${isSelected ? 'ring-1 ring-offset-1 ring-offset-surface-1 ring-glow-success/40' : ''}`}
    >
      {/* Header row: circular progress + tier dots */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative w-11 h-11">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-surface-4/50" />
            <motion.circle
              cx="50" cy="50" r="46"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={textColor}
              initial={{ strokeDashoffset: 289 }}
              animate={{ strokeDashoffset: 289 - (289 * progress) / 100 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.08 }}
              style={{ strokeDasharray: 289 }}
            />
          </svg>
          <div className={`absolute inset-0 rounded-sm flex items-center justify-center border ${isActive ? `bg-surface-1/60 ${style.border} ${textColor}` : 'bg-surface-2/60 border-surface-4/50 text-text-muted'}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {isFullyUnlocked ? (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-sm bg-surface-1/50 border ${style.border} ${textColor} text-[9px] font-mono uppercase tracking-wider`}>
              <Crown className="w-3 h-3" />
              Completada
            </div>
          ) : (
            <div className="flex gap-1">
              {['bronze', 'silver', 'gold'].map((tier) => {
                const tierAchievement = ACHIEVEMENTS.find(a => a.category === category && a.tier === tier);
                const isTierUnlocked = tierAchievement && unlockedAchievements.includes(tierAchievement.id);
                return (
                  <div
                    key={tier}
                    className={`w-2 h-2 rounded-full ${isTierUnlocked ? style.progress : 'bg-surface-4/60'}`}
                    title={tierAchievement?.title}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category label */}
      <span className={`text-[9px] font-mono uppercase tracking-widest mb-1 ${textColor} opacity-80`}>
        {category.replace('-', ' ')}
      </span>

      {/* Title */}
      <h4 className={`font-display font-semibold mb-2 text-base leading-tight ${isActive ? 'text-text-heading' : 'text-text-muted'}`}>
        {displayAchievement.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-text-muted mb-4 line-clamp-2 flex-grow leading-relaxed">
        {displayAchievement.description}
      </p>

      {/* Progress bar + hint */}
      <div className="space-y-2.5 mt-auto">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] text-text-muted font-mono uppercase tracking-wider mb-0.5">Progreso</span>
            <span className={`text-base font-display font-semibold leading-none ${textColor}`}>
              {Math.round(progress)}%
            </span>
          </div>
          {!isFullyUnlocked && hint && (
            <span className="text-[9px] text-text-muted font-mono bg-surface-1/50 px-2 py-1 rounded-sm border border-surface-4/40">
              {hint}
            </span>
          )}
        </div>

        <div className="w-full h-1.5 bg-surface-1/60 rounded-sm overflow-hidden border border-surface-4/30">
          <div
            className={`h-full rounded-sm transition-all duration-700 ${isActive ? style.progress : 'bg-surface-4/50'}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {!isFullyUnlocked && nextLocked && nextLocked.unlockRule.type === 'tagProgress' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              let targetPreset: any = 'all';
              if (category === 'mandalore')      targetPreset = 'mandalore';
              if (category === 'thrawn')         targetPreset = 'thrawn';
              if (category === 'new-republic')   targetPreset = 'new-republic';
              if (category === 'hutt')           targetPreset = 'hutt';
              if (category === 'bounty-hunters') targetPreset = 'bounty-hunters';
              if (targetPreset !== 'all') {
                setPreset(targetPreset);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`w-full mt-1 py-1.5 px-3 bg-surface-1/40 hover:bg-surface-2/60 text-text-muted text-[10px] font-mono rounded-sm transition-all flex items-center justify-center gap-1.5 border border-surface-4/40`}
          >
            <Filter className="w-3 h-3" />
            Explorar ruta
          </button>
        )}
      </div>
    </motion.div>
  );
}
