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
      <div className="sticky top-0 z-[60] bg-surface-1/90 backdrop-blur-md border-b border-surface-4 px-4 py-2 flex justify-center gap-2">
        {seriesConfigs.map((series) => {
          const isActive = activeSeriesId === series.id;
          return (
            <button
              key={series.id}
              onClick={() => setActiveSeriesId(series.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
                isActive ? 'text-white' : 'text-text-muted hover:text-text-body'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSeriesTab"
                  className={`absolute inset-0 border rounded-full -z-10 ${
                    series.theme === 'maul' 
                      ? 'bg-red-950/50 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                      : 'bg-surface-3 border-surface-4'
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
