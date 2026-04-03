<div align="center">
  <h1>🌌 The Mandalorian & Grogu Tracker</h1>
  <p><strong>El planificador de visionado definitivo para prepararte para el estreno en cines.</strong></p>

  [![CI](https://github.com/alexalbella/The-Mandalorian-Grogu-Tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/alexalbella/The-Mandalorian-Grogu-Tracker/actions/workflows/ci.yml)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/State-Zustand-brown?style=flat-square)](https://zustand-demo.pmnd.rs/)
  [![Tested with Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
</div>

<br />

> Una aplicación web progresiva (PWA) para fans de Star Wars que quieren organizar y trackear su progreso de visionado antes del estreno de **The Mandalorian & Grogu**. No es solo una lista — es una experiencia gamificada con logros, rutas temáticas y cuenta atrás.

---

## ✨ Funcionalidades

| Funcionalidad | Descripcion |
|---|---|
| **Planificador cronologico** | Lista curada de peliculas y series ordenada por eras narrativas |
| **Filtros y presets** | Filtra por tipo (peliculas/series), busca en tiempo real, usa presets como "Imprescindible", "Solo Mandalore" o "Trama Hutt" |
| **Sistema de logros** | Medallas bronce/plata/oro en 6 categorias (Mandalore, Hutt, Cazarrecompensas, Imperio, Nueva Republica, Thrawn) + logro meta |
| **Progreso persistente** | Marca episodios como vistos o saltados. Progreso guardado en localStorage via Zustand |
| **Undo / Redo** | Historial de hasta 20 estados para deshacer y rehacer acciones |
| **Acciones por era** | Marca o desmarca toda una era con un solo clic |
| **Cuenta atras** | Tiempo exacto hasta el estreno + calculo de ritmo diario necesario |
| **Reanudacion inteligente** | Retoma donde lo dejaste, priorizando contenido esencial saltado |
| **Export / Import** | Exporta e importa tu progreso como JSON (con validacion de esquema) |
| **Confeti** | Efecto visual al alcanzar el 100% o desbloquear logros especiales |
| **PWA** | Instalable en movil y escritorio para experiencia nativa |
| **Accesibilidad** | Navegacion por teclado y soporte para lectores de pantalla |

## 🚀 Stack tecnologico

| Categoria | Tecnologia |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Lenguaje | [TypeScript 5.9](https://www.typescriptlang.org/) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Estado | [Zustand 5](https://zustand-demo.pmnd.rs/) con persistencia en localStorage |
| Animaciones | [Framer Motion](https://www.framer.com/motion/) (`motion/react`) |
| Iconos | [Lucide React](https://lucide.dev/) |
| Efectos | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| Testing | [Vitest](https://vitest.dev/) + Testing Library |
| CI/CD | GitHub Actions (lint + test + build) |
| Deploy | [Vercel](https://vercel.com/) |

## 🛠️ Desarrollo local

**Requisitos:** Node.js 20+ y npm.

```bash
# 1. Clona el repositorio
git clone https://github.com/alexalbella/The-Mandalorian-Grogu-Tracker.git
cd The-Mandalorian-Grogu-Tracker

# 2. Instala dependencias
npm install

# 3. Inicia el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Scripts disponibles

| Script | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de produccion |
| `npm start` | Sirve el build de produccion |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta los tests con Vitest |
| `npm run test:watch` | Tests en modo watch |
| `npm run clean` | Limpia la cache de Next.js |

## 📦 Estructura del proyecto

```text
├── app/                    # Rutas, layouts y error boundaries (App Router)
│   ├── layout.tsx          # Layout raiz (fuentes, metadata, PWA)
│   ├── page.tsx            # Pagina principal
│   ├── error.tsx           # Error boundary de pagina
│   └── global-error.tsx    # Error boundary global
├── components/             # Componentes UI
│   ├── SeriesManager.tsx   # Selector de serie (Mando / Maul)
│   ├── MediaItemCard.tsx   # Tarjeta de pelicula/episodio
│   ├── EraSection.tsx      # Seccion por era con acciones en lote
│   ├── AchievementsPanel.tsx # Panel de logros con filtros
│   ├── CountdownWidget.tsx # Cuenta atras al estreno
│   ├── FiltersBar.tsx      # Barra de filtros y presets
│   └── shell/              # Layout shell (header, sidebar, modals)
├── data/                   # Datos estaticos
│   ├── starwars-list.ts    # Lista principal (eras, items, subItems)
│   ├── maul-list.ts        # Lista alternativa (arco de Maul)
│   └── achievements.ts     # Definicion de logros (6 categorias)
├── hooks/                  # Custom hooks
│   ├── useAchievementsEngine.ts  # Motor de desbloqueo de logros
│   ├── useDashboardStats.ts      # Estadisticas del dashboard
│   └── use-mobile.ts             # Deteccion de dispositivo movil
├── store/                  # Stores de Zustand
│   ├── progress.ts         # Progreso (watched/skipped + undo/redo)
│   ├── achievements.ts     # Logros desbloqueados
│   └── ui.ts               # Estado de UI (filtros, presets, toasts)
├── tests/                  # Suite de tests (51 tests)
├── types/                  # Definiciones de tipos TypeScript
├── lib/                    # Utilidades (cn, imageMap)
├── public/                 # Assets estaticos y manifest PWA
└── .github/workflows/      # CI pipeline (lint + test + build)
```

## 🧪 Tests

El proyecto usa **Vitest** con entorno jsdom. Actualmente cuenta con **51 tests** que cubren:

- **Stores de Zustand:** progress (toggle, skip, mark/unmark, undo/redo, history), achievements (unlock, dedup), UI (filtros, presets, toasts)
- **Utilidades:** funcion `cn()` para merge de clases Tailwind
- **Datos:** validacion de esquema de logros (IDs unicos, tiers, thresholds)

```bash
npm test
```

## 🚀 Despliegue

La app esta desplegada en [Vercel](https://vercel.com/) con deploy automatico desde `main`:

1. Cada push a `main` dispara el **CI** (lint + test + build) en GitHub Actions.
2. Si el CI pasa, **Vercel** despliega automaticamente a produccion.

Para desplegar tu propia instancia:

1. Haz un fork del repositorio.
2. Conecta el fork en [vercel.com/new](https://vercel.com/new).
3. Vercel detecta Next.js automaticamente. Haz clic en **Deploy**.

## 📄 Licencia

Este proyecto esta bajo la [licencia MIT](LICENSE).

---

<div align="center">
  <i>Que la Fuerza te acompane. Este es el camino.</i>
  <br /><br />
  Hecho por <a href="https://github.com/alexalbella">Alex Albella</a>
</div>
