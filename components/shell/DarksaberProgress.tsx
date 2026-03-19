'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';
import confetti from 'canvas-confetti';

interface DarksaberProgressProps {
  progress: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  showMilestones?: boolean;
}

function MilestoneMarker({ m, springProgress, isVertical }: { m: number, springProgress: any, isVertical: boolean }) {
  const opacity = useTransform(springProgress, (v: number) => v >= m ? 1 : 0.3);
  const scale = useTransform(springProgress, (v: number) => v >= m ? 1 : 0.8);
  const glow = useTransform(springProgress, (v: number) => v >= m ? '0 0 12px var(--color-glow-success)' : 'none');
  const bgColor = useTransform(springProgress, (v: number) => v >= m ? 'var(--color-glow-success)' : 'var(--color-surface-4)');
  
  return (
    <div 
      className={`absolute z-20 flex items-center justify-center ${isVertical ? 'w-full h-[2px] left-0' : 'h-full w-[2px] top-0'}`}
      style={{ 
        [isVertical ? 'bottom' : 'left']: `${m}%`,
      }}
    >
      <motion.div 
        className={`absolute ${isVertical ? 'w-[140%] h-[2px] -left-[20%]' : 'h-[140%] w-[2px] -top-[20%]'}`}
        style={{ 
          backgroundColor: bgColor,
          boxShadow: glow,
          opacity,
          scale
        }}
      />
      {isVertical && (
        <motion.div 
          className="absolute left-full ml-3 text-[10px] font-mono font-bold tracking-wider"
          style={{
            color: bgColor,
            opacity,
            textShadow: glow
          }}
        >
          {m}%
        </motion.div>
      )}
    </div>
  );
}

export default function DarksaberProgress({ 
  progress, 
  orientation = 'horizontal', 
  className = '',
  showMilestones = true
}: DarksaberProgressProps) {
  const [mounted, setMounted] = useState(false);
  const progressValue = useMotionValue(0);
  const springProgress = useSpring(progressValue, {
    stiffness: 50,
    damping: 15,
    mass: 1
  });
  const prevProgressRef = useRef(progress);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    progressValue.set(progress);
    
    if (mounted && progress > prevProgressRef.current) {
      // Trigger flash
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 400);
      
      // Check for milestones
      const milestones = [25, 50, 75, 100];
      const crossedMilestone = milestones.find(m => prevProgressRef.current < m && progress >= m);
      
      if (crossedMilestone) {
        if (crossedMilestone === 100) {
          // Big celebration for 100%
          const duration = 3000;
          const end = Date.now() + duration;
          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#4ade80', '#ffffff', '#22c55e']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#4ade80', '#ffffff', '#22c55e']
            });
            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
        } else {
          // Smaller celebration for other milestones
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#4ade80', '#ffffff']
          });
        }
      }
      
      return () => clearTimeout(timer);
    }
    
    prevProgressRef.current = progress;
  }, [progress, progressValue, mounted]);

  // Transform progress to percentage string
  const width = useTransform(springProgress, (v) => `${Math.max(0, Math.min(100, v))}%`);
  const height = useTransform(springProgress, (v) => `${Math.max(0, Math.min(100, v))}%`);

  // Transform progress to glow intensity
  const boxShadow = useTransform(springProgress, (v) => {
    const opacity = Math.max(0.3, Math.min(1, v / 100));
    const spread = Math.max(5, Math.min(25, (v / 100) * 25));
    return `0 0 ${spread}px color-mix(in srgb, var(--color-glow-success) ${opacity * 100}%, transparent), inset 0 0 8px color-mix(in srgb, var(--color-glow-success) ${opacity * 100}%, transparent)`;
  });
  
  const isVertical = orientation === 'vertical';

  const milestones = [25, 50, 75, 100];

  if (!mounted) {
    return (
      <div className={`relative ${isVertical ? 'w-4 h-full' : 'h-2.5 w-full'} bg-surface-2/50 rounded-full overflow-hidden border border-surface-4 ${className}`} />
    );
  }

  return (
    <div className={`relative flex ${isVertical ? 'flex-col items-center h-full' : 'flex-row items-center w-full'} ${className}`}>
      
      {/* Blade Container */}
      <div className={`relative bg-surface-2/50 overflow-hidden border border-surface-4 shadow-inner flex ${isVertical ? 'w-4 flex-1 rounded-t-full flex-col justify-end border-b-0' : 'h-2.5 w-full rounded-full'}`}>
        
        {/* Milestones Background Markers */}
        {showMilestones && milestones.map((m) => (
          <div 
            key={m}
            className={`absolute bg-surface-4/80 z-0 ${isVertical ? 'w-full h-px left-0' : 'h-full w-px top-0'}`}
            style={{ 
              [isVertical ? 'bottom' : 'left']: `${m}%`,
            }}
          />
        ))}

        {/* The Blade */}
        <motion.div 
          className={`bg-surface-1 border-glow-success relative z-10 flex ${isVertical ? 'w-full border-x border-t rounded-t-full flex-col justify-end' : 'h-full border-y border-r rounded-r-full'}`}
          style={{ 
            [isVertical ? 'height' : 'width']: isVertical ? height : width,
            boxShadow
          }}
        >
          {/* Core white/bright center of the blade */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glow-success/20 to-white/40 mix-blend-overlay" />
          
          {/* Flash Effect */}
          <motion.div 
            className="absolute inset-0 bg-white mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlashing ? 0.9 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          
          {/* Milestone Active Markers */}
          {showMilestones && milestones.map((m) => (
            <MilestoneMarker 
              key={`active-${m}`} 
              m={m} 
              springProgress={springProgress} 
              isVertical={isVertical} 
            />
          ))}
        </motion.div>
      </div>

      {/* Hilt (Only for vertical for now, as it fits the sidebar better) */}
      {isVertical && (
        <div className="w-6 h-20 bg-gradient-to-b from-surface-3 to-surface-1 border border-surface-4 rounded-b-md rounded-t-sm flex flex-col items-center justify-evenly py-2 shadow-xl z-20 shrink-0">
          <div className="w-full h-px bg-surface-2/80" />
          <div className="w-full h-px bg-surface-2/80" />
          <div className="w-full h-px bg-surface-2/80" />
          <div className="w-full h-px bg-surface-2/80" />
          <div className="w-full h-px bg-surface-2/80" />
        </div>
      )}
    </div>
  );
}
