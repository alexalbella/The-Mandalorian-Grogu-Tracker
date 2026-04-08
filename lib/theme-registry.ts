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
    glow: '#34d399',
    glowRgb: '52, 211, 153',
    metaThemeColor: '#10b981',
    confetti: {
      colors: ['#34d399', '#10b981', '#6ee7b7', '#ffffff'],
      particleCount: 80,
      spread: 60,
    },
    confettiLoop: {
      colors: ['#4ade80', '#22c55e', '#ffffff'],
      particleCount: 5,
      spread: 55,
    },
  },
  maul: {
    glow: '#ef4444',
    glowRgb: '239, 68, 68',
    metaThemeColor: '#b91c1c',
    confetti: {
      colors: ['#ef4444', '#b91c1c', '#fca5a5', '#ffffff'],
      particleCount: 80,
      spread: 60,
    },
    confettiLoop: {
      colors: ['#ef4444', '#b91c1c', '#ffffff'],
      particleCount: 5,
      spread: 55,
    },
  },
};

/** Reads the active series theme from the data-theme DOM attribute. Safe to call in useEffect / event handlers. */
export function getActiveTheme(): SeriesTheme {
  if (typeof document === 'undefined') return 'mando';
  return document.documentElement.getAttribute('data-theme') === 'maul' ? 'maul' : 'mando';
}
