import { SeriesTheme } from '@/types/series';

export interface ConfettiLoopConfig {
  colors: string[];
  particleCount: number;
  spread: number;
}

export interface SeriesThemeConfig {
  /** Primary accent color (hex). Maps to --color-glow-success for the active series. */
  glow: string;
  /** `"r, g, b"` string for use in rgba() constructions. */
  glowRgb: string;
  /** Value for <meta name="theme-color"> — updates dynamically on series switch. */
  metaThemeColor: string;
  /** Single-burst confetti (milestones, achievements). */
  confetti: {
    colors: string[];
    particleCount: number;
    spread: number;
  };
  /** Per-frame confetti used in looping 100% celebration. */
  confettiLoop: ConfettiLoopConfig;
}

export const themeRegistry: Record<SeriesTheme, SeriesThemeConfig> = {
  mando: {
    glow: '#c9a84c',
    glowRgb: '201, 168, 76',
    metaThemeColor: '#c9a84c',
    confetti: {
      colors: ['#c9a84c', '#e8d9a0', '#8b7632', '#ffffff'],
      particleCount: 80,
      spread: 60,
    },
    confettiLoop: {
      colors: ['#c9a84c', '#e8d9a0', '#ffffff'],
      particleCount: 4,
      spread: 55,
    },
  },
  maul: {
    glow: '#c44b3f',
    glowRgb: '196, 75, 63',
    metaThemeColor: '#8b2020',
    confetti: {
      colors: ['#c44b3f', '#8b2020', '#e8a0a0', '#ffffff'],
      particleCount: 80,
      spread: 60,
    },
    confettiLoop: {
      colors: ['#c44b3f', '#8b2020', '#ffffff'],
      particleCount: 4,
      spread: 55,
    },
  },
};

/** Reads the active series theme from the data-theme DOM attribute. Safe to call in useEffect / event handlers. */
export function getActiveTheme(): SeriesTheme {
  if (typeof document === 'undefined') return 'mando';
  return document.documentElement.getAttribute('data-theme') === 'maul' ? 'maul' : 'mando';
}
