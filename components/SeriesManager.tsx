'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AppShell from '@/components/shell/AppShell';
import { eras as mandoEras } from '@/data/starwars-list';
import { maulEras } from '@/data/maul-list';
import { SeriesConfig } from '@/types/series';
import { themeRegistry } from '@/lib/theme-registry';

const seriesConfigs: SeriesConfig[] = [
  {
    id: 'mando',
    title: 'The Mandalorian',
    subtitle: '& Grogu Tracker',
    theme: 'mando',
    eras: mandoEras,
    quote: 'Que la Fuerza te acompañe. Este es el camino.',
    releaseDate: '2026-05-22T00:00:00Z',
    releaseType: 'movie'
  },
  {
    id: 'maul',
    title: 'Maul',
    subtitle: 'Shadow Lord Tracker',
    theme: 'maul',
    eras: maulEras,
    quote: 'Siempre dos hay. Ni más, ni menos. Un maestro y un aprendiz.',
    releaseDate: '2026-04-06T00:00:00Z',
    releaseType: 'series'
  }
];

export default function SeriesManager() {
  const [activeSeriesId, setActiveSeriesId] = useState<string>('mando');
  const activeSeries = seriesConfigs.find(s => s.id === activeSeriesId) || seriesConfigs[0];

  // Sync CSS theme attribute and <meta name="theme-color"> with active series
  useEffect(() => {
    const root = document.documentElement;
    const metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const { metaThemeColor: color } = themeRegistry[activeSeries.theme];
    if (activeSeries.theme === 'maul') {
      root.setAttribute('data-theme', 'maul');
    } else {
      root.removeAttribute('data-theme');
    }
    if (metaThemeColor) metaThemeColor.content = color;
  }, [activeSeries.theme]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Series Tabs */}
      <div className="sticky top-0 z-[60] bg-surface-1/95 border-b border-surface-4/50 px-4 py-2 flex justify-center gap-1.5">
        {seriesConfigs.map((series) => {
          const isActive = activeSeriesId === series.id;
          return (
            <button
              key={series.id}
              onClick={() => setActiveSeriesId(series.id)}
              className={`relative px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-widest transition-colors ${
                isActive ? 'text-surface-1' : 'text-text-muted hover:text-text-body'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSeriesTab"
                  className={`absolute inset-0 rounded-sm -z-10 border ${
                    series.theme === 'maul'
                      ? 'bg-glow-success/80 border-glow-success/60'
                      : 'bg-glow-success border-glow-success/80'
                  }`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              {series.title}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSeriesId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          <AppShell config={activeSeries} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
