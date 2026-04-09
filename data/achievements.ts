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

  // Hutt (Mando saga only)
  {
    id: 'hutt-bronze',
    seriesId: 'mando',
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
    seriesId: 'mando',
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
    seriesId: 'mando',
    category: 'hutt',
    title: 'Testigo de la Sucesión Hutt',
    shortTitle: 'Succession',
    description: 'Has seguido la ruta completa del conflicto y sus implicaciones narrativas.',
    tier: 'gold',
    icon: 'Crown',
    accentClass: 'text-amber-500 bg-amber-500/10',
    unlockRule: { type: 'tagProgress', tag: 'hutt', threshold: 100 }
  },

  // Bounty Hunters (Mando saga only)
  {
    id: 'bounty-hunters-bronze',
    seriesId: 'mando',
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
    seriesId: 'mando',
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
    seriesId: 'mando',
    category: 'bounty-hunters',
    title: 'Leyenda del Gremio',
    shortTitle: 'Legend',
    description: 'Conoces a fondo a los cazarrecompensas que cruzarán sus caminos.',
    tier: 'gold',
    icon: 'Star',
    accentClass: 'text-red-500 bg-red-500/10',
    unlockRule: { type: 'tagProgress', tag: 'bounty-hunters', threshold: 100 }
  },

  // Empire (Mando saga only)
  {
    id: 'empire-bronze',
    seriesId: 'mando',
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
    seriesId: 'mando',
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
    seriesId: 'mando',
    category: 'empire',
    title: 'Archivista del Remanente',
    shortTitle: 'Archivist',
    description: 'Comprendes el alcance total de la amenaza imperial que acecha en las sombras.',
    tier: 'gold',
    icon: 'Database',
    accentClass: 'text-zinc-200 bg-zinc-200/10',
    unlockRule: { type: 'tagProgress', tag: 'empire', threshold: 100 }
  },

  // New Republic (Mando saga only)
  {
    id: 'new-republic-bronze',
    seriesId: 'mando',
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
    seriesId: 'mando',
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
    seriesId: 'mando',
    category: 'new-republic',
    title: 'Defensor de la República',
    shortTitle: 'Defender',
    description: 'Conoces la estructura política y militar que enfrentará la próxima crisis.',
    tier: 'gold',
    icon: 'Rocket',
    accentClass: 'text-blue-400 bg-blue-400/10',
    unlockRule: { type: 'tagProgress', tag: 'new-republic', threshold: 100 }
  },

  // Thrawn (Mando saga only)
  {
    id: 'thrawn-bronze',
    seriesId: 'mando',
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
    seriesId: 'mando',
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
    seriesId: 'mando',
    category: 'thrawn',
    title: 'Heredero del Imperio',
    shortTitle: 'Heir to the Empire',
    description: 'Estás preparado para el regreso de la mayor mente táctica del Imperio.',
    tier: 'gold',
    icon: 'Swords',
    accentClass: 'text-indigo-400 bg-indigo-400/10',
    unlockRule: { type: 'tagProgress', tag: 'thrawn', threshold: 100 }
  },

  // Meta — Mando saga
  {
    id: 'meta-gold',
    seriesId: 'mando',
    category: 'meta',
    title: 'El Camino',
    shortTitle: 'The Way',
    description: 'Has completado el tracker entero. Ya estás preparado para llegar a la película con todo el contexto.',
    tier: 'gold',
    icon: 'Sparkles',
    accentClass: 'text-emerald-400 bg-emerald-400/10',
    unlockRule: { type: 'globalProgress', threshold: 100 }
  },

  // ── Maul saga ─────────────────────────────────────────────────────────────

  // Sith (Maul saga only)
  {
    id: 'sith-bronze',
    seriesId: 'maul',
    category: 'sith',
    title: 'Testigo del Duelo de los Destinos',
    shortTitle: 'Witness',
    description: 'El sable doble de Maul ha dejado su marca. Conoces el origen de la venganza.',
    tier: 'bronze',
    icon: 'Zap',
    accentClass: 'text-red-600 bg-red-600/10',
    unlockRule: { type: 'tagProgress', tag: 'sith', threshold: 25 }
  },
  {
    id: 'sith-silver',
    seriesId: 'maul',
    category: 'sith',
    title: 'Fragmento Superviviente',
    shortTitle: 'Survivor',
    description: 'Entiendes que la muerte no fue el fin. Maul regresó, y con él su hambre de poder.',
    tier: 'silver',
    icon: 'Activity',
    accentClass: 'text-red-500 bg-red-500/10',
    unlockRule: { type: 'tagProgress', tag: 'sith', threshold: 50 }
  },
  {
    id: 'sith-gold',
    seriesId: 'maul',
    category: 'sith',
    title: 'Cronista del Lado Oscuro',
    shortTitle: 'Chronicle',
    description: 'Has presenciado el arco completo de un Sith que rompió todas las reglas y pagó el precio.',
    tier: 'gold',
    icon: 'ScrollText',
    accentClass: 'text-red-400 bg-red-400/10',
    unlockRule: { type: 'tagProgress', tag: 'sith', threshold: 100 }
  },

  // Dathomir (Maul saga only)
  {
    id: 'dathomir-bronze',
    seriesId: 'maul',
    category: 'dathomir',
    title: 'Iniciado en la Brujería',
    shortTitle: 'Initiate',
    description: 'Las Hermanas de la Noche y sus rituales comienzan a revelarse en la oscuridad.',
    tier: 'bronze',
    icon: 'Moon',
    accentClass: 'text-purple-600 bg-purple-600/10',
    unlockRule: { type: 'tagProgress', tag: 'dathomir', threshold: 25 }
  },
  {
    id: 'dathomir-silver',
    seriesId: 'maul',
    category: 'dathomir',
    title: 'Acolito de Dathomir',
    shortTitle: 'Acolyte',
    description: 'Comprendes el poder y el sacrificio de la Madre Talzin. La magia oscura tiene un precio.',
    tier: 'silver',
    icon: 'Hexagon',
    accentClass: 'text-purple-500 bg-purple-500/10',
    unlockRule: { type: 'tagProgress', tag: 'dathomir', threshold: 50 }
  },
  {
    id: 'dathomir-gold',
    seriesId: 'maul',
    category: 'dathomir',
    title: 'Guardián de las Memorias',
    shortTitle: 'Guardian',
    description: 'Has documentado el nacimiento, el apogeo y el exterminio de las Hermanas de la Noche.',
    tier: 'gold',
    icon: 'Gem',
    accentClass: 'text-purple-400 bg-purple-400/10',
    unlockRule: { type: 'tagProgress', tag: 'dathomir', threshold: 100 }
  },

  // Crimson Dawn (Maul saga only)
  {
    id: 'crimson-dawn-bronze',
    seriesId: 'maul',
    category: 'crimson-dawn',
    title: 'Contacto en las Sombras',
    shortTitle: 'Contact',
    description: 'Detectas los primeros hilos de una red criminal invisible que conecta todos los mundos.',
    tier: 'bronze',
    icon: 'Network',
    accentClass: 'text-rose-700 bg-rose-700/10',
    unlockRule: { type: 'tagProgress', tag: 'crimson-dawn', threshold: 25 }
  },
  {
    id: 'crimson-dawn-silver',
    seriesId: 'maul',
    category: 'crimson-dawn',
    title: 'Agente del Amanecer Carmesí',
    shortTitle: 'Agent',
    description: 'Conoces la estructura y los activos del sindicato que Maul lidera desde las sombras.',
    tier: 'silver',
    icon: 'Layers',
    accentClass: 'text-rose-600 bg-rose-600/10',
    unlockRule: { type: 'tagProgress', tag: 'crimson-dawn', threshold: 50 }
  },
  {
    id: 'crimson-dawn-gold',
    seriesId: 'maul',
    category: 'crimson-dawn',
    title: 'Archivista del Imperio Criminal',
    shortTitle: 'Archivist',
    description: 'Has trazado el mapa completo del dominio galáctico de Maul. Nadie escapa a la red.',
    tier: 'gold',
    icon: 'Globe',
    accentClass: 'text-rose-500 bg-rose-500/10',
    unlockRule: { type: 'tagProgress', tag: 'crimson-dawn', threshold: 100 }
  },

  // Meta — Maul saga
  {
    id: 'maul-meta-gold',
    seriesId: 'maul',
    category: 'maul-meta',
    title: 'La Sombra',
    shortTitle: 'Shadow Lord',
    description: 'Has visto el ascenso y la caída del hombre más poderoso que la historia olvidó. El ciclo está completo.',
    tier: 'gold',
    icon: 'Flame',
    accentClass: 'text-red-400 bg-red-400/10',
    unlockRule: { type: 'globalProgress', threshold: 100 }
  }
];
