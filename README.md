# 🌌 The Mandalorian & Grogu Tracker

Una aplicación web progresiva (PWA) diseñada para ayudar a los fans de Star Wars a prepararse para el estreno en cines de "The Mandalorian & Grogu". Funciona como un planificador de visionado (Watch Planner) interactivo y accesible.

## ✨ Características Principales

*   **Planificador de Visionado (Watch Planner):** Más que una simple lista, permite organizar qué ver antes del estreno.
*   **Filtros Avanzados y Presets:**
    *   Filtra por tipo (Películas, Series).
    *   Oculta lo que ya has visto.
    *   Buscador integrado.
    *   Presets temáticos: "Imprescindible", "Modo Rápido", "Solo Mandalore", "Nueva República / Thrawn", "Trama Hutt".
*   **Gestión de Progreso:**
    *   Marca episodios o películas individuales.
    *   Acciones rápidas por Era: Marca o desmarca toda una era con un clic.
    *   Resetea todo tu progreso fácilmente.
    *   El progreso se guarda automáticamente en tu navegador (localStorage).
*   **Cuenta Atrás Dinámica:**
    *   Muestra el tiempo exacto hasta el estreno.
    *   "Pace Tracker": Calcula cuántos minutos necesitas ver al día para llegar al día del estreno.
    *   Cambia automáticamente a un estado de "Ya en cines" con enlaces relevantes una vez pasada la fecha.
*   **Experiencia de Usuario (UX) y Gamificación:**
    *   Animaciones fluidas con Framer Motion en interacciones y transiciones.
    *   Efecto de confeti al alcanzar el 100% de progreso.
    *   Diseño oscuro, moderno y temático (Star Wars).
*   **Accesibilidad (a11y):**
    *   Navegación completa por teclado.
    *   Elementos semánticos correctos (checkboxes ocultos accesibles).
    *   Foco visible y atributos ARIA para lectores de pantalla.
*   **PWA (Progressive Web App):** Instalable en dispositivos móviles y de escritorio para una experiencia nativa.

## 🚀 Stack Tecnológico

*   **Framework:** Next.js 15 (App Router)
*   **Librería UI:** React 19
*   **Estilos:** Tailwind CSS v4
*   **Gestión de Estado:** Zustand (con middleware de persistencia)
*   **Animaciones:** Framer Motion (`motion/react`)
*   **Iconos:** Lucide React
*   **Efectos:** `canvas-confetti`
*   **Lenguaje:** TypeScript

## 🛠️ Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/mando-grogu-tracker.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Despliegue en Vercel

La forma más sencilla de desplegar esta aplicación es usando [Vercel](https://vercel.com/):

1. Sube tu código a un repositorio de GitHub.
2. Inicia sesión en Vercel y haz clic en **Add New... > Project**.
3. Importa tu repositorio de GitHub.
4. Vercel detectará automáticamente que es un proyecto de Next.js. Haz clic en **Deploy**.
5. ¡Listo! Tendrás tu tracker público con una URL personalizada.

---
*Que la Fuerza te acompañe. Este es el camino.*
