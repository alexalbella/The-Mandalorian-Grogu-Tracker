<div align="center">
  <h1>🌌 The Mandalorian & Grogu Tracker</h1>
  <p><strong>El planificador de visionado definitivo para prepararte para el estreno en cines.</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Zustand](https://img.shields.io/badge/State-Zustand-brown?style=flat-square)](https://zustand-demo.pmnd.rs/)
  [![Framer Motion](https://img.shields.io/badge/Animation-Framer_Motion-f08?style=flat-square)](https://www.framer.com/motion/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
</div>

<br />

Una aplicación web progresiva (PWA) diseñada meticulosamente para ayudar a los fans de Star Wars a organizar y trackear su progreso antes del estreno de la película "The Mandalorian & Grogu". No es solo una lista, es una experiencia gamificada.

## ✨ Características Principales

*   **Planificador de Visionado Inteligente:** Organiza qué ver antes del estreno con una lista curada cronológicamente.
*   **Filtros y Presets Dinámicos:**
    *   Filtra por tipo (Películas, Series).
    *   Oculta el contenido ya completado.
    *   Buscador en tiempo real.
    *   Presets temáticos: "Imprescindible", "Modo Rápido", "Solo Mandalore", "Nueva República / Thrawn", "Trama Hutt".
*   **Sistema de Logros y Rutas:**
    *   Desbloquea medallas temáticas (Mandalore, Imperio, Cazarrecompensas) a medida que avanzas.
    *   Usa los logros como guía para filtrar y descubrir nuevas rutas de visionado.
*   **Gestión de Progreso Persistente:**
    *   Marca episodios o películas individuales como vistos o saltados.
    *   Acciones rápidas por Era: Marca o desmarca toda una era con un clic.
    *   El progreso se guarda automáticamente y de forma segura en tu navegador (localStorage mediante Zustand).
*   **Flujo de Reanudación Inteligente:**
    *   Retoma tu visionado exactamente donde lo dejaste.
    *   Prioriza el contenido esencial que te hayas saltado antes de avanzar cronológicamente.
*   **Cuenta Atrás y Pace Tracker:**
    *   Muestra el tiempo exacto hasta el estreno.
    *   Calcula cuántos minutos necesitas ver al día para llegar al día del estreno con los deberes hechos.
*   **Experiencia de Usuario (UX) Premium:**
    *   Animaciones fluidas con Framer Motion en interacciones y transiciones.
    *   Efecto de confeti al alcanzar el 100% de progreso o desbloquear logros especiales.
    *   Diseño oscuro, moderno y temático (Star Wars) con Tailwind CSS v4.
*   **Accesibilidad (a11y) y PWA:**
    *   Navegación completa por teclado y soporte para lectores de pantalla.
    *   Instalable en dispositivos móviles y de escritorio para una experiencia nativa.

## 🚀 Stack Tecnológico

Este proyecto está construido con tecnologías web modernas, priorizando el rendimiento y la experiencia de desarrollo:

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Librería UI:** [React 19](https://react.dev/)
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Gestión de Estado:** [Zustand](https://zustand-demo.pmnd.rs/) (con middleware de persistencia)
*   **Animaciones:** [Framer Motion](https://www.framer.com/motion/) (`motion/react`)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Efectos Visuales:** `canvas-confetti`
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Desarrollo Local

Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/alexalbella/The-Mandalorian-Grogu-Tracker.git
   cd The-Mandalorian-Grogu-Tracker
   ```

2. **Instala las dependencias:**
   Asegúrate de tener Node.js instalado (v18 o superior).
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Visualiza la aplicación:**
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Estructura del Proyecto

```text
├── app/                  # Rutas y layouts de Next.js (App Router)
├── components/           # Componentes UI reutilizables (Dashboard, Widgets, etc.)
├── data/                 # Datos estáticos (Lista de Star Wars, Logros)
├── hooks/                # Custom React hooks (Motor de logros y estadísticas)
├── store/                # Stores de Zustand (Progreso, UI, Logros)
├── types/                # Definiciones de tipos TypeScript
└── public/               # Assets estáticos y PWA manifest
```

## 🚀 Despliegue

La forma más sencilla de desplegar esta aplicación es usando [Vercel](https://vercel.com/):

1. Haz un fork o sube tu código a un repositorio de GitHub.
2. Inicia sesión en Vercel y haz clic en **Add New... > Project**.
3. Importa tu repositorio de GitHub.
4. Vercel detectará automáticamente que es un proyecto de Next.js. Haz clic en **Deploy**.
5. ¡Listo! Tendrás tu tracker público con una URL personalizada.

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
<div align="center">
  <i>Que la Fuerza te acompañe. Este es el camino.</i>
</div>
