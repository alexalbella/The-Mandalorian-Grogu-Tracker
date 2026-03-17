import { Achievement } from '@/types/achievements';

export const ACHIEVEMENTS: Achievement[] = [
  // Mandalore
  {
    id: 'mandalore-bronze',
    category: 'mandalore',
    title: 'Iniciado de Mandalore',
    shortTitle: 'Initiate',
    description: 'Primeros pasos en la historia de Mandalore y su legado.',
    tier: 'bronze',
    icon: 'Shield',
    accentClass: 'text-zinc-400 bg-zinc-500/10',
    unlockRule: { type: 'tagProgress', tag: 'mandalore', threshold: 25 }
  },
  {
    id: 'mandalore-silver',
    category: 'mandalore',
    title: 'Portador del Credo',
    shortTitle: 'Creed',
    description: 'Comprendes las fracturas internas y el peso de la tradición mandaloriana.',
    tier: 'silver',
    icon: 'ShieldHalf',
    accentClass: 'text-zinc-300 bg-zinc-400/10',
    unlockRule: { type: 'tagProgress', tag: 'mandalore', threshold: 50 }
  },
  {
    id: 'mandalore-gold',
    category: 'mandalore',
    title: 'Heredero de Mandalore',
    shortTitle: 'Heir',
    description: 'Dominas la historia, los símbolos y los conflictos del planeta.',
    tier: 'gold',
    icon: 'ShieldAlert',
    accentClass: 'text-yellow-500 bg-yellow-500/10',
    unlockRule: { type: 'tagProgress', tag: 'mandalore', threshold: 100 }
  },

  // Hutt
  {
    id: 'hutt-bronze',
    category: 'hutt',
    title: 'Infiltrado del Inframundo',
    shortTitle: 'Insider',
    description: 'Conoces los primeros movimientos de las familias criminales.',
    tier: 'bronze',
    icon: 'CircleDollarSign',
    accentClass: 'text-amber-700 bg-amber-700/10',
    unlockRule: { type: 'tagProgress', tag: 'hutt', threshold: 25 }
  },
  {
    id: 'hutt-silver',
    category: 'hutt',
    title: 'Negociador del Cártel',
    shortTitle: 'Cartel',
    description: 'Entiendes las alianzas, herencias y tensiones del poder en Tatooine.',
    tier: 'silver',
    icon: 'Coins',
    accentClass: 'text-amber-600 bg-amber-600/10',
    unlockRule: { type: 'tagProgress', tag: 'hutt', threshold: 50 }
  },
  {
    id: 'hutt-gold',
    category: 'hutt',
    title: 'Testigo de la Sucesión Hutt',
    shortTitle: 'Succession',
    description: 'Has seguido la ruta completa del conflicto y sus implicaciones narrativas.',
    tier: 'gold',
    icon: 'Crown',
    accentClass: 'text-amber-500 bg-amber-500/10',
    unlockRule: { type: 'tagProgress', tag: 'hutt', threshold: 100 }
  },

  // Bounty Hunters
  {
    id: 'bounty-hunters-bronze',
    category: 'bounty-hunters',
    title: 'Explorador del Gremio',
    shortTitle: 'Scout',
    description: 'Sigues el código y la jerarquía del submundo de los cazadores.',
    tier: 'bronze',
    icon: 'Crosshair',
    accentClass: 'text-red-800 bg-red-800/10',
    unlockRule: { type: 'tagProgress', tag: 'bounty-hunters', threshold: 25 }
  },
  {
    id: 'bounty-hunters-silver',
    category: 'bounty-hunters',
    title: 'Cazador por Contrato',
    shortTitle: 'Contract',
    description: 'Distingues los nombres, métodos y alianzas de los mejores de la galaxia.',
    tier: 'silver',
    icon: 'Target',
    accentClass: 'text-red-600 bg-red-600/10',
    unlockRule: { type: 'tagProgress', tag: 'bounty-hunters', threshold: 50 }
  },
  {
    id: 'bounty-hunters-gold',
    category: 'bounty-hunters',
    title: 'Leyenda del Gremio',
    shortTitle: 'Legend',
    description: 'Conoces a fondo a los cazarrecompensas que cruzarán sus caminos.',
    tier: 'gold',
    icon: 'Star',
    accentClass: 'text-red-500 bg-red-500/10',
    unlockRule: { type: 'tagProgress', tag: 'bounty-hunters', threshold: 100 }
  },

  // Empire
  {
    id: 'empire-bronze',
    category: 'empire',
    title: 'Observador Imperial',
    shortTitle: 'Observer',
    description: 'Eres testigo de los primeros intentos de reorganización tras Endor.',
    tier: 'bronze',
    icon: 'Eye',
    accentClass: 'text-zinc-600 bg-zinc-600/10',
    unlockRule: { type: 'tagProgress', tag: 'empire', threshold: 25 }
  },
  {
    id: 'empire-silver',
    category: 'empire',
    title: 'Analista del Remanente',
    shortTitle: 'Analyst',
    description: 'Descubres los proyectos secretos y la maquinaria militar oculta.',
    tier: 'silver',
    icon: 'FileSearch',
    accentClass: 'text-zinc-400 bg-zinc-400/10',
    unlockRule: { type: 'tagProgress', tag: 'empire', threshold: 50 }
  },
  {
    id: 'empire-gold',
    category: 'empire',
    title: 'Archivista del Remanente',
    shortTitle: 'Archivist',
    description: 'Comprendes el alcance total de la amenaza imperial que acecha en las sombras.',
    tier: 'gold',
    icon: 'Database',
    accentClass: 'text-zinc-200 bg-zinc-200/10',
    unlockRule: { type: 'tagProgress', tag: 'empire', threshold: 100 }
  },

  // New Republic
  {
    id: 'new-republic-bronze',
    category: 'new-republic',
    title: 'Simpatizante de la República',
    shortTitle: 'Sympathizer',
    description: 'Ves los primeros esfuerzos por restaurar el orden en la galaxia.',
    tier: 'bronze',
    icon: 'Badge',
    accentClass: 'text-blue-800 bg-blue-800/10',
    unlockRule: { type: 'tagProgress', tag: 'new-republic', threshold: 25 }
  },
  {
    id: 'new-republic-silver',
    category: 'new-republic',
    title: 'Oficial de la Nueva República',
    shortTitle: 'Officer',
    description: 'Entiendes la burocracia, los desafíos y las debilidades del nuevo gobierno.',
    tier: 'silver',
    icon: 'Plane',
    accentClass: 'text-blue-600 bg-blue-600/10',
    unlockRule: { type: 'tagProgress', tag: 'new-republic', threshold: 50 }
  },
  {
    id: 'new-republic-gold',
    category: 'new-republic',
    title: 'Defensor de la República',
    shortTitle: 'Defender',
    description: 'Conoces la estructura política y militar que enfrentará la próxima crisis.',
    tier: 'gold',
    icon: 'Rocket',
    accentClass: 'text-blue-400 bg-blue-400/10',
    unlockRule: { type: 'tagProgress', tag: 'new-republic', threshold: 100 }
  },

  // Thrawn
  {
    id: 'thrawn-bronze',
    category: 'thrawn',
    title: 'Rastreador de Rumores',
    shortTitle: 'Rumors',
    description: 'Escuchas los primeros susurros sobre el regreso del Gran Almirante.',
    tier: 'bronze',
    icon: 'BookOpen',
    accentClass: 'text-indigo-800 bg-indigo-800/10',
    unlockRule: { type: 'tagProgress', tag: 'thrawn', threshold: 25 }
  },
  {
    id: 'thrawn-silver',
    category: 'thrawn',
    title: 'Estratega Táctico',
    shortTitle: 'Tactician',
    description: 'Analizas los movimientos y el impacto de Thrawn en el tablero galáctico.',
    tier: 'silver',
    icon: 'BrainCircuit',
    accentClass: 'text-indigo-600 bg-indigo-600/10',
    unlockRule: { type: 'tagProgress', tag: 'thrawn', threshold: 50 }
  },
  {
    id: 'thrawn-gold',
    category: 'thrawn',
    title: 'Heredero del Imperio',
    shortTitle: 'Heir to the Empire',
    description: 'Estás preparado para el regreso de la mayor mente táctica del Imperio.',
    tier: 'gold',
    icon: 'Swords',
    accentClass: 'text-indigo-400 bg-indigo-400/10',
    unlockRule: { type: 'tagProgress', tag: 'thrawn', threshold: 100 }
  },

  // Meta
  {
    id: 'meta-gold',
    category: 'meta',
    title: 'El Camino',
    shortTitle: 'The Way',
    description: 'Has completado el tracker entero. Ya estás preparado para llegar a la película con todo el contexto.',
    tier: 'gold',
    icon: 'Sparkles',
    accentClass: 'text-emerald-400 bg-emerald-400/10',
    unlockRule: { type: 'globalProgress', threshold: 100 }
  }
];
