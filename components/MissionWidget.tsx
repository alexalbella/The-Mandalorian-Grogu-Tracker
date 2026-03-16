import { useState, useRef, useEffect } from 'react';
import { useGamificationStore } from '@/store/gamification';
import { Era } from '@/data/starwars-list';
import { motion, AnimatePresence } from 'motion/react';
import { Target, RefreshCw, CheckCircle2, Settings2 } from 'lucide-react';
import { MissionLength } from '@/types/gamification';

export default function MissionWidget({ 
  eras, 
  generateMission, 
  handleCompleteMission 
}: { 
  eras: Era[], 
  generateMission: (lengthPref?: MissionLength, forceRegenerate?: boolean) => void,
  handleCompleteMission: () => void
}) {
  const { currentMission, missionPreferences, setMissionPreferences } = useGamificationStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentMission) return null;

  const isCompleted = currentMission.completed;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden mb-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Modo Misión</span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-100" style={{ fontFamily: 'var(--font-display)' }}>
            {isCompleted ? 'Misión de hoy completada' : currentMission.title}
          </h3>
          <p className="text-zinc-400 max-w-xl">
            {isCompleted ? 'Has avanzado en tu camino. ¿Quieres otra misión?' : currentMission.description}
          </p>
          {!isCompleted && currentMission.rewardText && (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {currentMission.rewardText}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {isCompleted ? (
            <button
              onClick={() => generateMission(missionPreferences.length, true)}
              className="w-full sm:w-auto px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generar misión extra
            </button>
          ) : (
            <>
              <button
                onClick={handleCompleteMission}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
              >
                <CheckCircle2 className="w-5 h-5" />
                Completar misión
              </button>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => generateMission(missionPreferences.length, true)}
                  className="flex-1 sm:flex-none p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl transition-colors flex items-center justify-center"
                  title="Regenerar misión"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                
                <div className="relative flex-1 sm:flex-none" ref={settingsRef}>
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`w-full p-3 rounded-xl transition-colors flex items-center justify-center ${isSettingsOpen ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200'}`}
                    title="Configuración de misión"
                  >
                    <Settings2 className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {isSettingsOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-2 z-50 origin-top-right"
                      >
                        <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-2 py-1 mb-1">Duración</div>
                        {(['short', 'medium', 'long', 'marathon'] as MissionLength[]).map(len => (
                          <button
                            key={len}
                            onClick={() => {
                              setMissionPreferences({ length: len });
                              generateMission(len, true);
                              setIsSettingsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${missionPreferences.length === len ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
                          >
                            {len === 'short' ? 'Corta (15-30m)' : len === 'medium' ? 'Media (30-60m)' : len === 'long' ? 'Larga (60-120m)' : 'Maratón (180m+)'}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
