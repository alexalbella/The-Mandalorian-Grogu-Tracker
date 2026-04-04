'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SeriesConfig } from '@/types/series';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import confetti from 'canvas-confetti';
import { themeRegistry } from '@/lib/theme-registry';

export default function QuickLookDrawer({ config }: { config: SeriesConfig }) {
  const eras = config.eras;
  const { progressPercent, totalItems } = useDashboardStats(eras);

  useEffect(() => {
    if (progressPercent === 100 && totalItems > 0) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;
      const theme = themeRegistry[config.theme];

      const frame = () => {
        confetti({ particleCount: theme.confettiLoop.particleCount, angle: 60, spread: theme.confettiLoop.spread, origin: { x: 0 }, colors: theme.confettiLoop.colors });
        confetti({ particleCount: theme.confettiLoop.particleCount, angle: 120, spread: theme.confettiLoop.spread, origin: { x: 1 }, colors: theme.confettiLoop.colors });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [progressPercent, totalItems, config.theme]);

  return (
    <>
      <AnimatePresence>
        {progressPercent === 100 && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 pb-8 border-t border-surface-4"
          >
            <div className="bg-surface-2/50 backdrop-blur-xl border border-glow-success/30 rounded-3xl p-8 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-glow-success/5 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-glow-success/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-glow-success" style={{ fontFamily: 'var(--font-display)' }}>
                  ¡Estás listo para el estreno!
                </h2>
                <p className="text-text-muted max-w-2xl mx-auto text-lg">
                  Has completado todo el material esencial. Ahora solo queda esperar a que {config.title} llegue a las pantallas.
                </p>
              </div>

              {config.theme === 'mando' && (
                <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-surface-4 shadow-2xl relative z-10">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/IHWlvwu8t1w" 
                    title="The Mandalorian & Grogu Trailer" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
