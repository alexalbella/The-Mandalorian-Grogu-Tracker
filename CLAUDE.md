# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js dev server
npm run build        # Production build (lint + type errors block build)
npm run lint         # ESLint (flat config, eslint-config-next)
npm test             # Vitest once
npm run test:watch   # Vitest watch
npm run clean        # rm -rf .next

# Run a single test file
npx vitest run tests/store/progress.test.ts
```

Tests use `globals: true` so `describe`/`it`/`expect` need no imports. Environment is `jsdom` with localStorage mocked in `tests/setup.ts`.

## Architecture

### Entry point & series switching

`app/page.tsx` → `SeriesManager` → `AppShell` → shell components.

`SeriesManager` owns the active series selection. It holds two hardcoded `SeriesConfig` objects (`mando`, `maul`), renders a sticky tab bar, and passes the active config down to `AppShell`. On series change it also sets `document.documentElement.setAttribute('data-theme', 'maul')` and updates `<meta name="theme-color">` — both of which drive theming across the whole app.

### SeriesConfig

```ts
{ id, title, subtitle, theme: 'mando'|'maul', eras: Era[], quote, releaseDate, releaseType }
```

`eras` is the only series-specific data that flows into components. Most shell components only need `eras: Era[]`; a few (HeaderHUD, QuickLookDrawer, HeroParallax) also need the full `config`.

### AppShell layout

`AppShell` checks `isMounted` to avoid hydration mismatches, then renders:

1. `HeroParallax` — full-viewport hero with scroll parallax and hyperspace entry animation
2. `HeaderHUD` — sticky header with progress stats and view controls
3. `QuickLookDrawer` — 100% completion banner + confetti
4. `StatsPanel` / `RouteAtlas` (contains `FiltersBar` + `AchievementsPanel`) / `Timeline` / `DataManagementPanel`
5. Floating overlays outside the main flex: `ProgressRail`, `UndoRedoWidget`, `AchievementToasts`, `QuickLookModal`

### State — three Zustand stores (all persisted)

| Store | Persistence key | Owns |
|---|---|---|
| `useUIStore` | `mando-grogu-ui` | filters, presets, view modes (compact/focus), reducedMotion, isMuted, expandedEras, lastViewedId, recentlyTouched, toasts (not persisted) |
| `useProgressStore` | `mando-grogu-progress` | watchedItems, skippedItems, streak, undo/redo history (max 20) |
| `useAchievementsStore` | `mando-grogu-achievements` | unlockedAchievements[] |

Imperative access pattern (inside effects/handlers): `useUIStore.getState().method()`.

### Theme system

- CSS tokens defined in `app/globals.css` with Tailwind v4's `@theme` directive
- `lib/theme-registry.ts` exports `themeRegistry` — per-theme glow colors, confetti burst/loop configs, and `metaThemeColor`
- `getActiveTheme()` reads `data-theme` from the DOM — use this inside effects/event handlers when you need the active theme without prop-drilling
- All confetti calls (in `DarksaberProgress`, `useAchievementsEngine`, `QuickLookDrawer`) derive colors from the registry

### Framer Motion

Always import from `motion/react`, not `framer-motion`:
```ts
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
```
`transpilePackages: ['motion']` is set in `next.config.ts`. All animated components respect `reducedMotion` from `useUIStore`.

### Achievement engine

`hooks/useAchievementsEngine.ts` is a hook (not a component). It watches `watchedItems`/`skippedItems`, evaluates `ACHIEVEMENTS` unlock rules, calls `unlockAchievement()` + `addToast()`, and fires confetti for `meta-gold`. It is currently mounted inside `RouteAtlas`.

### Adding a new series

1. Add an entry to the `seriesConfigs` array in `SeriesManager.tsx`
2. Add a matching entry to `themeRegistry` in `lib/theme-registry.ts`
3. Add `:root[data-theme="<theme>"]` overrides in `app/globals.css`
