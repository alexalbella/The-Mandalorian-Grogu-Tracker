import { Achievement } from '@/types/gamification';

export const ACHIEVEMENTS: Achievement[] = [
  // Mandalore
  {
    id: 'mandalore-bronze',
    category: 'mandalore',
    title: 'Mandalore Initiate',
    shortTitle: 'Initiate',
    description: 'Has dado tus primeros pasos en la historia de Mandalore y su legado.',
    tier: 'bronze',
    icon: 'Shield',
    accentClass: 'text-zinc-400',
    unlockRule: { type: 'tagProgress', tag: 'mandalore', threshold: 25 }
  },
  {
    id: 'mandalore-silver',
    category: 'mandalore',
    title: 'Creed Bearer',
    shortTitle: 'Creed',
    description: 'Ya entiendes el credo, las fracturas internas y el peso de la tradición mandaloriana.',
    tier: 'silver',
    icon: 'ShieldHalf',
    accentClass: 'text-zinc-300',
    unlockRule: { type: 'tagProgress', tag: 'mandalore', threshold: 50 }
  },
  {
    id: 'mandalore-gold',
    category: 'mandalore',
    title: 'Heir of Mandalore',
    shortTitle: 'Heir',
    description: 'Has completado la ruta mandaloriana y entiendes su historia, símbolos y conflictos.',
    tier: 'gold',
    icon: 'ShieldAlert',
    accentClass: 'text-yellow-500',
    unlockRule: { type: 'tagProgress', tag: 'mandalore', threshold: 100 }
  },

  // Hutt
  {
    id: 'hutt-bronze',
    category: 'hutt',
    title: 'Underworld Insider',
    shortTitle: 'Insider',
    description: 'Ya conoces los primeros movimientos del inframundo Hutt.',
    tier: 'bronze',
    icon: 'CircleDollarSign',
    accentClass: 'text-amber-700',
    unlockRule: { type: 'tagProgress', tag: 'hutt', threshold: 25 }
  },
  {
    id: 'hutt-silver',
    category: 'hutt',
    title: 'Cartel Negotiator',
    shortTitle: 'Cartel',
    description: 'Empiezas a entender alianzas, herencias y tensiones del poder criminal.',
    tier: 'silver',
    icon: 'Coins',
    accentClass: 'text-amber-600',
    unlockRule: { type: 'tagProgress', tag: 'hutt', threshold: 50 }
  },
  {
    id: 'hutt-gold',
    category: 'hutt',
    title: 'Hutt Succession Witness',
    shortTitle: 'Succession',
    description: 'Has seguido la ruta completa del conflicto Hutt y sus implicaciones narrativas.',
    tier: 'gold',
    icon: 'Crown',
    accentClass: 'text-amber-500',
    unlockRule: { type: 'tagProgress', tag: 'hutt', threshold: 100 }
  },

  // Bounty Hunters
  {
    id: 'bounty-hunters-bronze',
    category: 'bounty-hunters',
    title: 'Guild Scout',
    shortTitle: 'Scout',
    description: 'Has empezado a seguir el código y la jerarquía del submundo de los cazadores.',
    tier: 'bronze',
    icon: 'Crosshair',
    accentClass: 'text-red-800',
    unlockRule: { type: 'tagProgress', tag: 'bounty-hunters', threshold: 25 }
  },
  {
    id: 'bounty-hunters-silver',
    category: 'bounty-hunters',
    title: 'Contract Hunter',
    shortTitle: 'Contract',
    description: 'Ya distingues los nombres, métodos y alianzas de los mejores cazadores.',
    tier: 'silver',
    icon: 'Target',
    accentClass: 'text-red-600',
    unlockRule: { type: 'tagProgress', tag: 'bounty-hunters', threshold: 50 }
  },
  {
    id: 'bounty-hunters-gold',
    category: 'bounty-hunters',
    title: 'Guild Legend',
    shortTitle: 'Legend',
    description: 'Has completado la ruta de cazarrecompensas y dominas ese frente del relato.',
    tier: 'gold',
    icon: 'Star',
    accentClass: 'text-red-500',
    unlockRule: { type: 'tagProgress', tag: 'bounty-hunters', threshold: 100 }
  },

  // Empire
  {
    id: 'empire-bronze',
    category: 'empire',
    title: 'Imperial Observer',
    shortTitle: 'Observer',
    description: 'Has empezado a ver cómo opera el remanente imperial y sus planes.',
    tier: 'bronze',
    icon: 'Eye',
    accentClass: 'text-zinc-500',
    unlockRule: { type: 'tagProgress', tag: 'empire', threshold: 25 }
  },
  {
    id: 'empire-silver',
    category: 'empire',
    title: 'Necromancer Analyst',
    shortTitle: 'Analyst',
    description: 'Ya entiendes mejor el trasfondo de los experimentos y la amenaza oculta.',
    tier: 'silver',
    icon: 'FileSearch',
    accentClass: 'text-zinc-400',
    unlockRule: { type: 'tagProgress', tag: 'empire', threshold: 50 }
  },
  {
    id: 'empire-gold',
    category: 'empire',
    title: 'Shadow Remnant Archivist',
    shortTitle: 'Archivist',
    description: 'Has completado la ruta imperial y entiendes el origen estratégico del conflicto.',
    tier: 'gold',
    icon: 'Database',
    accentClass: 'text-zinc-300',
    unlockRule: { type: 'tagProgress', tag: 'empire', threshold: 100 }
  },

  // New Republic
  {
    id: 'new-republic-bronze',
    category: 'new-republic',
    title: 'Frontier Marshal',
    shortTitle: 'Marshal',
    description: 'Ya conoces las primeras grietas del orden de la Nueva República.',
    tier: 'bronze',
    icon: 'Badge',
    accentClass: 'text-blue-800',
    unlockRule: { type: 'tagProgress', tag: 'new-republic', threshold: 25 }
  },
  {
    id: 'new-republic-silver',
    category: 'new-republic',
    title: 'Adelphi Ranger',
    shortTitle: 'Ranger',
    description: 'Empiezas a entender cómo de sobrepasados están sus defensores en el Borde Exterior.',
    tier: 'silver',
    icon: 'Plane',
    accentClass: 'text-blue-600',
    unlockRule: { type: 'tagProgress', tag: 'new-republic', threshold: 50 }
  },
  {
    id: 'new-republic-gold',
    category: 'new-republic',
    title: 'Republic Vanguard',
    shortTitle: 'Vanguard',
    description: 'Has completado la ruta y entiendes el frente político y militar del nuevo orden.',
    tier: 'gold',
    icon: 'Rocket',
    accentClass: 'text-blue-400',
    unlockRule: { type: 'tagProgress', tag: 'new-republic', threshold: 100 }
  },

  // Thrawn
  {
    id: 'thrawn-bronze',
    category: 'thrawn',
    title: 'Strategic Reader',
    shortTitle: 'Reader',
    description: 'Has comenzado a seguir la lógica táctica de la amenaza Thrawn.',
    tier: 'bronze',
    icon: 'BookOpen',
    accentClass: 'text-indigo-800',
    unlockRule: { type: 'tagProgress', tag: 'thrawn', threshold: 25 }
  },
  {
    id: 'thrawn-silver',
    category: 'thrawn',
    title: 'Chiss Tactician',
    shortTitle: 'Tactician',
    description: 'Ya comprendes mejor su estilo, su paciencia y su forma de anticiparse.',
    tier: 'silver',
    icon: 'BrainCircuit',
    accentClass: 'text-indigo-600',
    unlockRule: { type: 'tagProgress', tag: 'thrawn', threshold: 50 }
  },
  {
    id: 'thrawn-gold',
    category: 'thrawn',
    title: 'Thrawn Hunter',
    shortTitle: 'Hunter',
    description: 'Has completado la ruta Thrawn y dominas ese frente del tablero galáctico.',
    tier: 'gold',
    icon: 'Swords',
    accentClass: 'text-indigo-400',
    unlockRule: { type: 'tagProgress', tag: 'thrawn', threshold: 100 }
  },

  // Meta
  {
    id: 'meta-gold',
    category: 'meta',
    title: 'This Is the Way',
    shortTitle: 'Complete',
    description: 'Has completado el tracker entero. Ya estás preparado para llegar a la película con todo el contexto.',
    tier: 'gold',
    icon: 'Sparkles',
    accentClass: 'text-emerald-400',
    unlockRule: { type: 'globalProgress', threshold: 100 }
  }
];
