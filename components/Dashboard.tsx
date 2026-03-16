'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Clock, Film, Tv, Info, PlayCircle, Star, Filter, EyeOff, Eye, Search, ChevronDown, ChevronUp, RotateCcw, CheckSquare, Square, Volume2, VolumeX, Download, Upload, Target, Flame } from 'lucide-react';
import { Era, MediaItem } from '@/data/starwars-list';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';
import { useGamificationStore } from '@/store/gamification';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import Image from 'next/image';

const CountdownWidget = dynamic(() => import('./CountdownWidget'), { ssr: false });

type Preset = 'all' | 'essential' | 'fast' | 'mandalore' | 'thrawn' | 'hutt' | 'essential-background' | 'movie-background';

import MissionWidget from './MissionWidget';
import AchievementsPanel from './AchievementsPanel';
import { useGamificationEngine } from '@/hooks/useGamificationEngine';

export default function Dashboard({ eras }: { eras: Era[] }) {
  const { watchedItems, skippedItems, streak, toggleItem, skipItem, markMultiple, unmarkMultiple, resetProgress } = useProgressStore();
  const { 
    filterType, setFilterType, 
    preset, setPreset, 
    hideCompleted, setHideCompleted, 
    searchQuery, setSearchQuery, 
    isMuted, setIsMuted,
    lastViewedId, setLastViewedId,
    expandedEras, toggleEraExpanded
  } = useUIStore();
  
  const { currentMission } = useGamificationStore();
  
  const completedItems = useMemo(() => [...watchedItems, ...skippedItems], [watchedItems, skippedItems]);

  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Initialize Gamification Engine
  const { generateMission, handleCompleteMission, calculateProgress } = useGamificationEngine(eras);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    // Scroll to last viewed item on mount
    const savedLastViewedId = useUIStore.getState().lastViewedId;
    if (savedLastViewedId) {
      setTimeout(() => {
        const element = document.getElementById(savedLastViewedId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950', 'transition-all', 'duration-500', 'rounded-xl');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950');
          }, 2000);
        }
      }, 500); // Wait a bit for rendering
    }
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playSound = useCallback(() => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [isMuted]);

  const handleToggleItem = useCallback((id: string) => {
    const isCurrentlyWatched = watchedItems.includes(id) || skippedItems.includes(id);
    toggleItem(id);
    setLastViewedId(id);
    
    if (!isCurrentlyWatched) {
      playSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [watchedItems, skippedItems, toggleItem, playSound, setLastViewedId]);

  const handleSkipItem = useCallback((id: string) => {
    const isCurrentlySkipped = skippedItems.includes(id);
    skipItem(id);
    setLastViewedId(id);
    
    if (!isCurrentlySkipped) {
      playSound();
    }
  }, [skippedItems, skipItem, playSound, setLastViewedId]);

  // Memoized stats calculation
  const { totalItems, watchedCount, progressPercent, totalMinutes, watchedMinutes, remainingMinutes, nextItem } = useMemo(() => {
    const allItems = eras.flatMap(e => e.items);
    
    // Find next item
    let nextItem = null;
    
    // 1. Check for skipped essential items first
    for (const era of eras) {
      for (const item of era.items) {
        if (item.subItems) {
          const skippedEssentialSub = item.subItems.find(sub => skippedItems.includes(sub.id) && item.essential);
          if (skippedEssentialSub) {
            nextItem = { item, subItem: skippedEssentialSub, eraId: era.id, isSkippedEssential: true };
            break;
          }
        } else {
          if (skippedItems.includes(item.id) && item.essential) {
            nextItem = { item, eraId: era.id, isSkippedEssential: true };
            break;
          }
        }
      }
      if (nextItem) break;
    }

    // 2. If no skipped essential items, find the next chronological unwatched item
    if (!nextItem) {
      for (const era of eras) {
        for (const item of era.items) {
          if (item.subItems) {
            const incompleteSub = item.subItems.find(sub => !watchedItems.includes(sub.id) && !skippedItems.includes(sub.id));
            if (incompleteSub) {
              nextItem = { item, subItem: incompleteSub, eraId: era.id, isSkippedEssential: false };
              break;
            }
          } else {
            if (!watchedItems.includes(item.id) && !skippedItems.includes(item.id)) {
              nextItem = { item, eraId: era.id, isSkippedEssential: false };
              break;
            }
          }
        }
        if (nextItem) break;
      }
    }

    const total = allItems.reduce((acc, item) => acc + (item.subItems ? item.subItems.length : 1), 0);
    const watched = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => watchedItems.includes(sub.id) || skippedItems.includes(sub.id)).length;
      }
      return acc + (watchedItems.includes(item.id) || skippedItems.includes(item.id) ? 1 : 0);
    }, 0);
    const percent = total === 0 ? 0 : Math.round((watched / total) * 100);
    
    const tMins = allItems.reduce((acc, item) => acc + item.duration, 0);
    const wMins = allItems.reduce((acc, item) => {
      if (item.subItems) {
        return acc + item.subItems.filter(sub => completedItems.includes(sub.id)).reduce((sum, sub) => sum + sub.duration, 0);
      }
      return acc + (completedItems.includes(item.id) ? item.duration : 0);
    }, 0);
    
    return {
      totalItems: total,
      watchedCount: watched,
      progressPercent: percent,
      totalMinutes: tMins,
      watchedMinutes: wMins,
      remainingMinutes: tMins - wMins,
      nextItem
    };
  }, [eras, completedItems]);

  // Confetti effect when reaching 100%
  useEffect(() => {
    if (isMounted && progressPercent === 100 && totalItems > 0) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#3b82f6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#3b82f6']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [progressPercent, isMounted, totalItems]);

  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return `${hours}h ${minutes}m`;
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 animate-pulse">
        <div className="flex-1 space-y-12 min-w-0">
          <div className="h-32 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
          <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
          <div className="h-96 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
        </div>
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
          <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800/50"></div>
        </aside>
      </div>
    );
  }

  const filteredEras = eras.map(era => {
    const filteredItems = era.items.filter(item => {
      // Type filter
      if (filterType !== 'all' && item.type !== filterType) return false;
      // Completed filter
      if (hideCompleted) {
        if (item.subItems) {
          if (item.subItems.every(sub => watchedItems.includes(sub.id) || skippedItems.includes(sub.id)) && item.subItems.length > 0) return false;
        } else {
          if (watchedItems.includes(item.id) || skippedItems.includes(item.id)) return false;
        }
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesReason = item.reason.toLowerCase().includes(query);
        const matchesTags = item.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesSubItems = item.subItems?.some(sub => sub.title.toLowerCase().includes(query)) || false;
        
        if (!matchesTitle && !matchesReason && !matchesTags && !matchesSubItems) {
          return false;
        }
      }
      
      // Presets
      if (preset === 'essential' && !item.essential) return false;
      if (preset === 'fast' && item.type === 'series' && !item.essential) return false; // Fast mode: All movies + essential series
      if (preset === 'mandalore' && !item.tags.includes('mandalore')) return false;
      if (preset === 'thrawn' && !item.tags.includes('thrawn') && !item.tags.includes('new-republic')) return false;
      if (preset === 'hutt' && !item.tags.includes('hutt') && !item.tags.includes('bounty-hunters')) return false;
      if (preset === 'essential-background' && !item.essential) return false;
      if (preset === 'movie-background' && item.type !== 'movie') return false;

      return true;
    });
    return { ...era, items: filteredItems };
  }).filter(era => era.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-12 min-w-0">
        {/* Header Section - Sticky */}
        <header className={`sticky top-0 lg:top-4 z-50 border-b lg:border border-zinc-800 bg-[#050505]/90 backdrop-blur-xl shadow-2xl shadow-black/50 -mx-4 px-4 lg:mx-0 lg:px-6 lg:rounded-2xl transition-all duration-300 ${isScrolled ? 'pt-3 pb-3' : 'pt-4 pb-4 md:pt-6 md:pb-6'}`}>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[120px] rounded-full" />
          </div>
          
          <div className={`flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between`}>
            <div className={`space-y-1 ${isScrolled ? '' : 'md:space-y-4'}`}>
              <div className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0 m-0' : 'max-h-20 opacity-100'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  <Star className="w-3 h-3 text-emerald-400" />
                  Watch Planner
                </div>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <h1 className={`font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-500 transition-all duration-300 ${isScrolled ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`} style={{ fontFamily: 'var(--font-display)' }}>
                  The Mandalorian {isScrolled ? '' : <br className="hidden md:block" />}
                  <span className="text-emerald-400">& Grogu</span> {isScrolled ? '' : 'Tracker'}
                </h1>
                {isScrolled && (
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title={isMuted ? "Activar sonido" : "Silenciar sonido"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div className={`flex flex-col items-start md:items-end gap-3 w-full md:w-auto`}>
              <div className={`transition-all duration-300 origin-right`}>
                <CountdownWidget remainingMinutes={remainingMinutes} isScrolled={isScrolled} />
              </div>
              {/* Darksaber Progress Bar in Header (Mobile only) */}
              <div className={`w-full lg:hidden transition-all duration-300 ${isScrolled ? 'mt-0' : 'mt-2'}`}>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span className={isScrolled ? 'hidden md:inline' : 'inline'}>Progreso</span>
                  <span className="text-emerald-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                  <div 
                    className="absolute top-0 left-0 h-full bg-zinc-100 transition-all duration-1000 ease-out shadow-[0_0_10px_#fff,0_0_20px_#fff]"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-400 to-white opacity-50 mix-blend-overlay" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CTA "Continue Where You Left Off" / "Next Action" */}
        {(() => {
          // 1. Check if there's an active mission
          if (currentMission) {
            const firstUnwatchedMissionUnitId = currentMission.targetItems.find(id => !completedItems.includes(id));
            if (firstUnwatchedMissionUnitId) {
              // Find the item details for this unit
              let missionNextItem = null;
              for (const era of eras) {
                for (const item of era.items) {
                  if (item.id === firstUnwatchedMissionUnitId) {
                    missionNextItem = { eraId: era.id, item };
                    break;
                  }
                  if (item.subItems) {
                    const sub = item.subItems.find(s => s.id === firstUnwatchedMissionUnitId);
                    if (sub) {
                      missionNextItem = { eraId: era.id, item, subItem: sub };
                      break;
                    }
                  }
                }
                if (missionNextItem) break;
              }

              if (missionNextItem) {
                return (
                  <div className="bg-zinc-900 border border-blue-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-blue-400 font-semibold mb-1">Misión Activa: {currentMission.title}</p>
                      <h3 className="text-xl font-bold text-zinc-100">
                        Siguiente objetivo: {missionNextItem.subItem ? missionNextItem.subItem.title : missionNextItem.item.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">{currentMission.description}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => {
                          if (!expandedEras[missionNextItem.eraId]) {
                            toggleEraExpanded(missionNextItem.eraId);
                          }
                          setTimeout(() => {
                            const elementId = missionNextItem.subItem ? missionNextItem.subItem.id : missionNextItem.item.id;
                            const element = document.getElementById(elementId);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-4', 'ring-offset-zinc-950', 'transition-all', 'duration-500', 'rounded-xl');
                              setTimeout(() => {
                                element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-4', 'ring-offset-zinc-950');
                              }, 2000);
                            }
                          }, 150);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors text-sm"
                      >
                        Ir al objetivo
                      </button>
                    </div>
                  </div>
                );
              }
            }
          }

          // 2. Default to next unwatched item
          if (nextItem) {
            const isSkippedEssential = (nextItem as any).isSkippedEssential;
            return (
              <div className={`bg-zinc-900 border ${isSkippedEssential ? 'border-amber-500/30' : 'border-emerald-500/30'} rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                <div>
                  <p className={`text-sm ${isSkippedEssential ? 'text-amber-400' : 'text-emerald-400'} font-semibold mb-1`}>
                    {isSkippedEssential ? 'Te saltaste algo importante' : 'Tu siguiente paso'}
                  </p>
                  <h3 className="text-xl font-bold text-zinc-100">
                    {nextItem.subItem ? nextItem.subItem.title : nextItem.item.title}
                  </h3>
                  {!nextItem.item.essential && !isSkippedEssential && (
                    <p className="text-xs text-zinc-500 mt-1">Este episodio no es esencial para la trama principal.</p>
                  )}
                  {isSkippedEssential && (
                    <p className="text-xs text-zinc-500 mt-1">Este episodio es esencial para la trama, te recomendamos verlo.</p>
                  )}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {!nextItem.item.essential && !isSkippedEssential && (
                    <button
                      onClick={() => {
                        if (window.confirm('¿Quieres saltarte este episodio de relleno y marcarlo como visto sin sumar tiempo?')) {
                          handleSkipItem(nextItem.subItem ? nextItem.subItem.id : nextItem.item.id);
                        }
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors text-sm"
                    >
                      Saltar relleno
                    </button>
                  )}
                  {isSkippedEssential && (
                    <button
                      onClick={() => {
                        // Un-skip it
                        handleSkipItem(nextItem.subItem ? nextItem.subItem.id : nextItem.item.id);
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors text-sm"
                    >
                      Ignorar aviso
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (!expandedEras[nextItem.eraId]) {
                        toggleEraExpanded(nextItem.eraId);
                      }
                      setTimeout(() => {
                        const elementId = nextItem.subItem ? nextItem.subItem.id : nextItem.item.id;
                        const element = document.getElementById(elementId);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          element.classList.add('ring-2', isSkippedEssential ? 'ring-amber-500' : 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950', 'transition-all', 'duration-500', 'rounded-xl');
                          setTimeout(() => {
                            element.classList.remove('ring-2', isSkippedEssential ? 'ring-amber-500' : 'ring-emerald-500', 'ring-offset-4', 'ring-offset-zinc-950');
                          }, 2000);
                        }
                      }, 150);
                    }}
                    className={`flex-1 sm:flex-none px-4 py-2 ${isSkippedEssential ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-medium rounded-lg transition-colors text-sm`}
                  >
                    {isSkippedEssential ? 'Ver ahora' : 'Continuar'}
                  </button>
                </div>
              </div>
            );
          }

          return null;
        })()}

      {/* Stats Dashboard */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Progreso Total" 
          value={`${progressPercent}%`} 
          subtitle={`${watchedCount} de ${totalItems} completados`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          progress={progressPercent}
        />
        <StatCard 
          title="Racha Actual" 
          value={`${streak} ${streak === 1 ? 'día' : 'días'}`} 
          subtitle="Viendo Star Wars"
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
        <StatCard 
          title="Tiempo Invertido" 
          value={formatTime(watchedMinutes)} 
          subtitle="Horas de visionado"
          icon={<PlayCircle className="w-5 h-5 text-blue-400" />}
        />
        <StatCard 
          title="Tiempo Restante" 
          value={formatTime(remainingMinutes)} 
          subtitle={`De un total de ${formatTime(totalMinutes)}`}
          icon={<Clock className="w-5 h-5 text-orange-400" />}
        />
      </section>

      <MissionWidget eras={eras} generateMission={generateMission} handleCompleteMission={handleCompleteMission} />
      <AchievementsPanel eras={eras} calculateProgress={calculateProgress} generateMission={generateMission} />

      {/* Filters & Presets */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Buscar episodio o película..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Todo
              </button>
              <button 
                onClick={() => setFilterType('movie')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'movie' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Películas
              </button>
              <button 
                onClick={() => setFilterType('series')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === 'series' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                Series
              </button>
            </div>
            
            <button 
              onClick={() => setHideCompleted(!hideCompleted)}
              className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center gap-2 ${hideCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900'}`}
            >
              {hideCompleted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Ocultar Completados</span>
            </button>
          </div>

          <button 
            onClick={resetProgress}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-red-900/30 text-red-400 hover:bg-red-950/30 transition-colors flex items-center gap-2 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Resetear
          </button>
        </div>

        {/* Presets Row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mr-2">Presets:</span>
          {[
            { id: 'all', label: 'Lista Completa' },
            { id: 'essential', label: 'Imprescindible' },
            { id: 'fast', label: 'Modo Rápido' },
            { id: 'mandalore', label: 'Solo Mandalore' },
            { id: 'thrawn', label: 'Nueva República / Thrawn' },
            { id: 'hutt', label: 'Trama Hutt' },
            { id: 'essential-background', label: 'Entendido (no completista)' },
            { id: 'movie-background', label: 'Solo trasfondo peli' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id as Preset)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                preset === p.id 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Eras List */}
      <section className="space-y-16">
        <AnimatePresence mode="popLayout">
          {filteredEras.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 text-zinc-500"
            >
              No hay elementos que coincidan con los filtros actuales.
            </motion.div>
          ) : (
            filteredEras.map((era, index) => (
              <EraSection 
                key={era.id} 
                era={era} 
                index={index} 
                completedItems={completedItems} 
                toggleItem={handleToggleItem}
                markMultiple={markMultiple}
                unmarkMultiple={unmarkMultiple}
              />
            ))
          )}
        </AnimatePresence>
      </section>
      
      {/* Teaser Mode */}
      <AnimatePresence>
        {progressPercent === 100 && (
          <motion.section 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 pb-8 border-t border-zinc-800"
          >
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>
                  ¡Estás listo para el estreno!
                </h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                  Has completado todo el material esencial. Ahora solo queda esperar a que The Mandalorian & Grogu llegue a los cines.
                </p>
              </div>

              <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative z-10">
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
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Data Management */}
      <section className="pt-12 pb-8 border-t border-zinc-800 flex flex-col items-center gap-4">
        <h3 className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Gestión de Datos (Local-First)</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              const progress = localStorage.getItem('mando-tracker-progress');
              const gamification = localStorage.getItem('mando-gamification-storage');
              const ui = localStorage.getItem('mando-ui-storage');
              const backup = { progress, gamification, ui };
              const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `mando-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Exportar Progreso
          </button>
          <label className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-900 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Importar
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const content = ev.target?.result as string;
                      const backup = JSON.parse(content);
                      if (backup.progress) localStorage.setItem('mando-tracker-progress', backup.progress);
                      if (backup.gamification) localStorage.setItem('mando-gamification-storage', backup.gamification);
                      if (backup.ui) localStorage.setItem('mando-ui-storage', backup.ui);
                      window.location.reload();
                    } catch (err) {
                      alert('Error al importar el archivo. Asegúrate de que es un backup válido.');
                    }
                  };
                  reader.readAsText(file);
                }
              }} 
            />
          </label>
        </div>
      </section>

      <footer className="pt-8 pb-24 text-center border-t border-zinc-800 text-zinc-500 text-sm">
        <p>Que la Fuerza te acompañe. Este es el camino.</p>
      </footer>
      </div>

      {/* Sidebar - Vertical Progress */}
      <aside className="hidden lg:flex flex-col items-center w-24 shrink-0 pt-8">
        <div className="sticky top-24 flex flex-col items-center gap-6 h-[calc(100vh-8rem)]">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Progreso</div>
            <div className="text-2xl font-bold text-emerald-400">{progressPercent}%</div>
          </div>
          
          {/* Vertical Darksaber */}
          <div className="flex-1 w-4 flex flex-col justify-end items-center relative">
            {/* Blade container */}
            <div className="w-full flex-1 bg-zinc-900 rounded-t-full overflow-hidden border border-zinc-800 border-b-0 relative shadow-[0_0_15px_rgba(0,0,0,0.8)] flex flex-col justify-end">
              <div 
                className="w-full bg-zinc-100 transition-all duration-1000 ease-out shadow-[0_0_15px_#fff,0_0_30px_#fff]"
                style={{ height: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-800 via-zinc-400 to-white opacity-50 mix-blend-overlay" />
              </div>
            </div>
            
            {/* Darksaber Hilt (bottom) */}
            <div className="w-6 h-20 bg-gradient-to-b from-zinc-700 to-zinc-950 border border-zinc-600 rounded-b-md rounded-t-sm flex flex-col items-center justify-evenly py-2 shadow-xl z-10 shrink-0">
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
              <div className="w-full h-px bg-zinc-900/80" />
            </div>
          </div>
          
          <div className="text-xs font-mono text-zinc-500">
            {watchedCount}/{totalItems}
          </div>
        </div>
      </aside>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, progress }: { title: string, value: string, subtitle: string, icon: React.ReactNode, progress?: number }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-6 relative overflow-hidden">
      {progress !== undefined && (
        <div 
          className="absolute bottom-0 left-0 h-1 bg-emerald-500/50 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold font-mono tracking-tight">{value}</p>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
    </div>
  );
}

function EraSection({ 
  era, 
  index, 
  completedItems, 
  toggleItem,
  markMultiple,
  unmarkMultiple
}: { 
  era: Era, 
  index: number, 
  completedItems: string[], 
  toggleItem: (id: string) => void,
  markMultiple: (ids: string[]) => void,
  unmarkMultiple: (ids: string[]) => void
}) {
  const { expandedEras, toggleEraExpanded } = useUIStore();
  
  // Default to true if not set
  const isExpanded = expandedEras[era.id] !== false;
  
  const eraItemIds = era.items.flatMap(i => i.subItems ? i.subItems.map(s => s.id) : [i.id]);
  const eraTotalCount = eraItemIds.length;
  const eraWatchedCount = eraItemIds.filter(id => completedItems.includes(id)).length;
  const isCompleted = eraWatchedCount === eraTotalCount && eraTotalCount > 0;
  const isPartiallyCompleted = eraWatchedCount > 0 && !isCompleted;

  const handleToggleAll = () => {
    if (isCompleted) {
      unmarkMultiple(eraItemIds);
    } else {
      markMultiple(eraItemIds);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative pt-12 md:pt-16"
    >
      {index > 0 && (
        <div className="absolute top-0 left-0 w-full flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          <div className="absolute w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent blur-sm" />
        </div>
      )}

      {/* Timeline connector */}
      <div className="absolute left-4 top-28 bottom-[-4rem] w-px bg-zinc-800 hidden md:block" />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Era Header */}
        <div className="md:w-1/3 shrink-0 relative z-10">
          <div className="sticky top-8 space-y-4 bg-[#09090b] py-2">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-colors shadow-lg ${isCompleted ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}>
                {era.eraNumber}
              </div>
              <h2 className={`text-2xl font-bold tracking-tight transition-colors ${isCompleted ? 'text-emerald-50' : 'text-zinc-100'}`} style={{ fontFamily: 'var(--font-display)' }}>
                ERA {era.eraNumber}
              </h2>
            </div>
            <div className="pl-11">
              <h3 className="text-lg font-medium text-zinc-300 mb-2">{era.eraLabel}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{era.description}</p>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
                  <span className={isCompleted ? "text-emerald-400 font-bold" : "text-zinc-300"}>
                    {eraWatchedCount} / {eraTotalCount}
                  </span>
                  <span className="text-zinc-500">vistos</span>
                </div>
                
                <button 
                  onClick={handleToggleAll}
                  className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
                  title={isCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                  aria-label={isCompleted ? "Desmarcar toda la era" : "Marcar toda la era"}
                >
                  {isCompleted ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : isPartiallyCompleted ? <Square className="w-4 h-4 text-emerald-500/50" fill="currentColor" /> : <Square className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => toggleEraExpanded(era.id)}
                  className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors md:hidden"
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Colapsar era" : "Expandir era"}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:w-2/3 space-y-3 md:pl-8 overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                {era.items.map(item => (
                  <MediaItemCard 
                    key={item.id} 
                    item={item} 
                    completedItems={completedItems}
                    toggleItem={toggleItem}
                    markMultiple={markMultiple}
                    unmarkMultiple={unmarkMultiple}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MediaItemCard({ 
  item, 
  completedItems, 
  toggleItem,
  markMultiple,
  unmarkMultiple
}: { 
  item: MediaItem; 
  completedItems: string[]; 
  toggleItem: (id: string) => void;
  markMultiple: (ids: string[]) => void;
  unmarkMultiple: (ids: string[]) => void;
}) {
  const isWatched = item.subItems 
    ? item.subItems.every(sub => completedItems.includes(sub.id)) && item.subItems.length > 0
    : completedItems.includes(item.id);

  const isPartiallyWatched = item.subItems
    ? item.subItems.some(sub => completedItems.includes(sub.id)) && !isWatched
    : false;

  const handleToggle = () => {
    if (item.subItems) {
      if (isWatched) {
        unmarkMultiple(item.subItems.map(s => s.id));
      } else {
        markMultiple(item.subItems.map(s => s.id));
      }
    } else {
      toggleItem(item.id);
    }
  };
  // Use a deterministic seed for the placeholder image based on the item ID
  const getImageUrl = (id: string) => {
    const map: Record<string, string> = {
      'ep1': 'https://image.tmdb.org/t/p/w500/6wkfovpn7Eq8dYNKaG5PY3q2oq6.jpg',
      'tcw-movie': 'https://image.tmdb.org/t/p/w500/iJQfixW818LUdSXlCDL3JZm0S0g.jpg',
      'tcw-t2-12-14': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t3-4': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t4-15-18': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t4-20-22': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t5-1': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t6-5': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'tcw-t7-9-12': 'https://static.tvmaze.com/uploads/images/original_untouched/237/593387.jpg',
      'bb-t1-15-16': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
      'bb-t3-1-3-14-15': 'https://static.tvmaze.com/uploads/images/original_untouched/505/1264860.jpg',
      'rebels-t1-1-2': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t2-17': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t3-15': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'rebels-t3-t4': 'https://static.tvmaze.com/uploads/images/original_untouched/353/884619.jpg',
      'ep4': 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
      'ep5': 'https://image.tmdb.org/t/p/w500/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
      'ep6': 'https://image.tmdb.org/t/p/w500/jQYlydvHm3kUix1f8prMucrplhm.jpg',
      'mando-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'mando-t2': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'bobafett-1-4': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
      'bobafett-5-7': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253027.jpg',
      'mando-t3': 'https://static.tvmaze.com/uploads/images/original_untouched/501/1253498.jpg',
      'ahsoka-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/473/1184972.jpg',
      'skeleton-crew-t1': 'https://static.tvmaze.com/uploads/images/original_untouched/546/1365559.jpg'
    };
    
    return map[id] || getFallbackImage(item.title);
  };

  const getFallbackImage = (title: string) => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <rect width="400" height="600" fill="#09090b" />
      <text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#10b981" text-anchor="middle" dominant-baseline="middle">
        ${title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const [imgSrc, setImgSrc] = useState(getImageUrl(item.id));

  return (
    <div 
      id={item.id}
      className={`group relative p-4 rounded-xl border transition-all cursor-pointer overflow-hidden block focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 focus-within:ring-offset-[#09090b] ${
        isWatched 
          ? 'bg-emerald-950/10 border-emerald-900/30 hover:border-emerald-800/50' 
          : 'bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
      onClick={handleToggle}
    >
      <input 
        type="checkbox" 
        className="sr-only" 
        checked={isWatched}
        onChange={handleToggle}
        aria-label={`Marcar ${item.title} como visto`}
        onClick={(e) => e.stopPropagation()}
      />
      
      <div className="flex flex-row gap-4">
        {/* Thumbnail */}
        <div className="relative w-24 sm:w-32 aspect-[2/3] rounded-lg overflow-hidden shrink-0 border border-white/5 bg-zinc-900">
          <Image 
            src={imgSrc} 
            alt={`Poster for ${item.title}`}
            fill
            className={`${item.subItems && item.subItems.length > 0 ? 'object-contain' : 'object-cover'} transition-all duration-500 ${isWatched ? 'opacity-50 grayscale' : 'group-hover:scale-105'}`}
            sizes="(max-width: 640px) 96px, 128px"
            referrerPolicy="no-referrer"
            onError={() => {
              // If image fails, fallback to local SVG
              setImgSrc(getFallbackImage(item.title));
            }}
            unoptimized={imgSrc.startsWith('data:') || imgSrc.includes('tvmaze.com')}
          />
          {isWatched && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 drop-shadow-lg" />
            </div>
          )}
        </div>

        <div className="space-y-3 flex-1 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-1 hidden sm:block">
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isWatched ? [1, 1.2, 1] : 1,
                    rotate: isWatched ? [0, 10, 0] : 0 
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isWatched ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isPartiallyWatched ? (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                  )}
                </motion.div>
              </div>
              <h4 className={`font-medium text-lg transition-colors ${isWatched ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-100'}`}>
                {item.title}
              </h4>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {item.essential && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20">
                  Esencial
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                {item.duration}m
              </span>
            </div>
          </div>
          
          <div className="text-sm">
            <div className={`leading-relaxed transition-colors ${isWatched ? 'text-zinc-600' : 'text-zinc-400'}`}>
              <span className="inline-flex items-center gap-1 font-medium text-zinc-500 mr-2">
                <Info className="w-3.5 h-3.5" /> Contexto:
              </span>
              {item.reason}
            </div>
          </div>

          {item.subItems && item.subItems.length > 0 && (
            <div className="mt-4 space-y-2 border-t border-white/5 pt-4" onClick={(e) => e.stopPropagation()}>
              {item.subItems.map(sub => {
                const isSubWatched = completedItems.includes(sub.id);
                return (
                  <div 
                    key={sub.id}
                    id={sub.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSubWatched ? 'bg-emerald-950/20 hover:bg-emerald-950/40' : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(sub.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isSubWatched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-500" />
                      )}
                      <span className={`text-sm ${isSubWatched ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                        {sub.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">{sub.duration}m</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
