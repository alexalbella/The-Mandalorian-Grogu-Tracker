import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { Crown, Filter } from 'lucide-react';
import { ACHIEVEMENTS } from '@/data/achievements';

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
}: any) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const background = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const tileBg = isActive ? style.bg : 'bg-surface-2/30';
  const tileBorder = isActive ? style.border : 'border-surface-4/50';
  const tileGlow = isActive ? style.glow : '';

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <motion.div
      variants={itemVariants}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setSelectedRoute(isSelected ? null : category)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative p-5 rounded-2xl border transition-all duration-500 flex flex-col overflow-hidden cursor-pointer hover:scale-[1.02] ${tileBg} ${tileBorder} ${tileGlow} ${isSelected ? 'ring-2 ring-offset-2 ring-offset-surface-1 ring-white/50' : ''}`}
    >
      <motion.div
        style={{ background }}
        className="absolute inset-0 pointer-events-none z-50 mix-blend-overlay"
      />
      {/* Background Map Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px', transform: 'translateZ(-10px)' }} />
      
      <div className="relative z-10 flex items-start justify-between mb-4" style={{ transform: 'translateZ(20px)' }}>
        <div className="relative w-12 h-12">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" fill="none" className="text-surface-4 opacity-50" />
            <motion.circle 
              cx="50" cy="50" r="46" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="none" 
              strokeLinecap="round"
              className={textColor}
              initial={{ strokeDashoffset: 289 }}
              animate={{ strokeDashoffset: 289 - (289 * progress) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
              style={{ strokeDasharray: 289 }}
            />
          </svg>
          <div className={`absolute inset-0 rounded-xl flex items-center justify-center border shadow-inner ${isActive ? `bg-surface-1/50 ${style.border} ${textColor}` : 'bg-surface-2 border-surface-4 text-text-muted'}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {isFullyUnlocked ? (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md bg-surface-1/50 border ${style.border} ${textColor} text-[10px] font-bold uppercase tracking-wider`}>
              <Crown className="w-3 h-3" />
              Completada
            </div>
          ) : (
            <div className="flex gap-1">
              {['bronze', 'silver', 'gold'].map((tier, i) => {
                const tierAchievement = ACHIEVEMENTS.find(a => a.category === category && a.tier === tier);
                const isTierUnlocked = tierAchievement && unlockedAchievements.includes(tierAchievement.id);
                return (
                  <div 
                    key={tier} 
                    className={`w-2 h-2 rounded-full ${isTierUnlocked ? style.progress : 'bg-surface-4'}`}
                    title={tierAchievement?.title}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <div className="relative z-10 mb-1 flex items-center gap-2" style={{ transform: 'translateZ(30px)' }}>
        <span className={`text-xs uppercase tracking-widest font-bold ${textColor}`}>
          {category.replace('-', ' ')}
        </span>
      </div>

      <h4 className={`relative z-10 font-bold mb-2 text-lg leading-tight ${isActive ? 'text-text-heading' : 'text-text-muted'}`} style={{ fontFamily: 'var(--font-display)', transform: 'translateZ(40px)' }}>
        {displayAchievement.title}
      </h4>
      
      <p className="relative z-10 text-xs text-text-muted mb-5 line-clamp-2 flex-grow leading-relaxed" style={{ transform: 'translateZ(20px)' }}>
        {displayAchievement.description}
      </p>
      
      <div className="relative z-10 space-y-3 mt-auto" style={{ transform: 'translateZ(30px)' }}>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono mb-0.5">Progreso</span>
            <span className={`text-lg font-bold font-mono leading-none ${textColor}`}>
              {Math.round(progress)}%
            </span>
          </div>
          {!isFullyUnlocked && hint && (
            <span className="text-[10px] text-text-muted font-medium bg-surface-1/50 px-2 py-1 rounded-md border border-surface-4/50">
              {hint}
            </span>
          )}
        </div>
        
        <div className="w-full h-2 bg-surface-1 rounded-full overflow-hidden border border-surface-4/50 shadow-inner relative">
          <div 
            className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${isActive ? style.progress : 'bg-surface-4'}`}
            style={{ width: `${progress}%` }}
          >
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full" 
            />
          </div>
        </div>
        
        {!isFullyUnlocked && nextLocked && nextLocked.unlockRule.type === 'tagProgress' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              let targetPreset: any = 'all';
              if (category === 'mandalore') targetPreset = 'mandalore';
              if (category === 'thrawn') targetPreset = 'thrawn';
              if (category === 'new-republic') targetPreset = 'new-republic';
              if (category === 'hutt') targetPreset = 'hutt';
              if (category === 'bounty-hunters') targetPreset = 'bounty-hunters';
              
              if (targetPreset !== 'all') {
                setPreset(targetPreset);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`w-full mt-2 py-2 px-3 bg-surface-1/50 hover:bg-surface-2 text-text-muted hover:${textColor} text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-surface-4/50 hover:${style.border} group/btn`}
          >
            <Filter className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
            Explorar ruta
          </button>
        )}
      </div>
    </motion.div>
  );
}
