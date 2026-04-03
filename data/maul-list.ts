import { Era } from './starwars-list';

export const maulEras: Era[] = [
  {
    id: "maul-era1",
    eraNumber: 1,
    eraLabel: "El Origen y la Caída",
    description: "La presentación original de Maul al mundo y el evento que desató su sed de venganza.",
    items: [
      {
        id: "ep1-maul",
        title: "Episodio I: La Amenaza Fantasma (1999)",
        type: "movie",
        duration: 136,
        reason: "Es la presentación original de Maul al mundo. Aquí verás su faceta como peón silencioso de Darth Sidious, su icónico sable de luz de doble hoja y el legendario 'Duel of the Fates', donde asesina a Qui-Gon Jinn y Obi-Wan lo corta por la mitad, desatando la sed de venganza que lo definirá el resto de su vida.",
        essential: true,
        tags: ['sith']
      }
    ]
  },
  {
    id: "maul-era2",
    eraNumber: 2,
    eraLabel: "El Regreso y la Magia de Dathomir",
    description: "El renacimiento de Maul a través de la magia de las Hermanas de la Noche y su liberación del control de Palpatine.",
    items: [
      {
        id: "tcw-t3-12-14",
        title: "The Clone Wars - Arco 'Brujas y Monstruos' (T3: Eps 12 al 14)",
        type: "series",
        duration: 66,
        reason: "Introduce un tipo de 'Lado Oscuro' diferente al de los Sith: la brujería (magia pura) de las Hermanas de la Noche. Conocerás a la Madre Talzin, al hermano de Maul (Savage Opress) y se revelará el gran secreto: Maul sobrevivió.",
        essential: true,
        tags: ['dathomir'],
        subItems: [
          { id: "tcw-t3-12", title: "Episodio 12: Las Hermanas de la Noche", duration: 22 },
          { id: "tcw-t3-13", title: "Episodio 13: Monstruo", duration: 22 },
          { id: "tcw-t3-14", title: "Episodio 14: Las Brujas de la Bruma", duration: 22 }
        ]
      },
      {
        id: "tote-1-3",
        title: "Tales of the Empire - Episodios 1 al 3",
        type: "series",
        duration: 45,
        reason: "Te muestra el ataque y la masacre de Dathomir desde la perspectiva de Morgan Elsbeth. Conocer el trauma de las brujas y la crueldad del Imperio y los Separatistas te dará mucho contexto sobre por qué Maul recluta a quienes recluta más adelante.",
        essential: true,
        tags: ['dathomir'],
        subItems: [
          { id: "tote-e1", title: "El Camino del Miedo", duration: 15 },
          { id: "tote-e2", title: "El Camino de la Ira", duration: 15 },
          { id: "tote-e3", title: "El Camino del Odio", duration: 15 }
        ]
      },
      {
        id: "tcw-t4-19-22",
        title: "The Clone Wars - Arco 'El Retorno de Darth Maul' (T4: Eps 19 al 22)",
        type: "series",
        duration: 88,
        reason: "Muestra a un Maul convertido en una monstruosidad mitad araña cibernética, consumido por la locura en un planeta vertedero. Verás cómo la Madre Talzin restaura su mente y sus piernas, dándole al personaje agencia propia por primera vez para cazar a Kenobi.",
        essential: true,
        tags: ['dathomir', 'sith'],
        subItems: [
          { id: "tcw-t4-19", title: "Episodio 19: Masacre", duration: 22 },
          { id: "tcw-t4-20", title: "Episodio 20: Recompensa", duration: 22 },
          { id: "tcw-t4-21", title: "Episodio 21: Hermanos", duration: 22 },
          { id: "tcw-t4-22", title: "Episodio 22: Venganza", duration: 22 }
        ]
      }
    ]
  },
  {
    id: "maul-era3",
    eraNumber: 3,
    eraLabel: "El Señor del Crimen y Mandalore",
    description: "La consolidación de Maul como líder supremo del inframundo criminal y conquistador de Mandalore.",
    items: [
      {
        id: "tcw-t5-1-14-16",
        title: "The Clone Wars - Arco 'Sombra Colectiva' (T5: Eps 1, 14, 15 y 16)",
        type: "series",
        duration: 88,
        reason: "Vital para la nueva serie. Maul pasa de asesino solitario a caudillo militar. Somete al Sol Negro, al Sindicato Pyke y a los Hutt para crear la Sombra Colectiva. Vence a Pre Vizsla, roba el Darksaber y conquista Mandalore, atrayendo a Darth Sidious.",
        essential: true,
        tags: ['mandalore', 'crimson-dawn'],
        subItems: [
          { id: "tcw-t5-1", title: "Episodio 1: Resurgimiento", duration: 22 },
          { id: "tcw-t5-14", title: "Episodio 14: Eminencia", duration: 22 },
          { id: "tcw-t5-15", title: "Episodio 15: Sombras de la Razón", duration: 22 },
          { id: "tcw-t5-16", title: "Episodio 16: Los Sin Ley", duration: 22 }
        ]
      },
      {
        id: "comic-son-of-dathomir",
        title: "Cómic: Darth Maul: Son of Dathomir (4 números)",
        type: "series",
        duration: 60,
        reason: "Rellena un hueco importantísimo: cuenta cómo Maul escapa de las torturas de Sidious, entra en guerra abierta contra Dooku y Grievous, e introduce a Rook Kast (que regresará en Maul-Shadow Lord). ¡Ojo a este huevo de pascua!",
        essential: true,
        tags: ['dathomir', 'mandalore']
      }
    ]
  },
  {
    id: "maul-era4",
    eraNumber: 4,
    eraLabel: "El Fin de la República",
    description: "Los últimos días de la República y la caída del imperio criminal de Maul en Mandalore.",
    items: [
      {
        id: "tcw-t7-7-8",
        title: "The Clone Wars - Arco 'El Viaje de Ahsoka' (T7: Eps 7 y 8)",
        type: "series",
        duration: 44,
        reason: "Explora desde dentro cómo opera el Sindicato Pyke (que obedece a Maul) y cómo los bajos fondos sobreviven a las sombras de los Jedi. Aquí Ahsoka y los mandalorianos descubren que Maul sigue operando.",
        essential: true,
        tags: ['crimson-dawn'],
        subItems: [
          { id: "tcw-t7-7", title: "Episodio 7: Una Deuda Peligrosa", duration: 22 },
          { id: "tcw-t7-8", title: "Episodio 8: Juntos de Nuevo", duration: 22 }
        ]
      },
      {
        id: "tcw-t7-9-12-maul",
        title: "The Clone Wars - Arco 'El Asedio de Mandalore' (T7: Eps 9 al 12)",
        type: "series",
        duration: 88,
        reason: "Una obra maestra. Muestra el duelo definitivo entre Ahsoka y Maul. Maul predice la Orden 66 y la caída de la República. El final ocurre en el 19 ABY, y Maul-Shadow Lord empezará exactamente un año después (17 ABY).",
        essential: true,
        tags: ['mandalore'],
        subItems: [
          { id: "tcw-t7-9", title: "Episodio 9: Viejos Amigos no Olvidados", duration: 22 },
          { id: "tcw-t7-10", title: "Episodio 10: El Aprendiz Fantasma", duration: 22 },
          { id: "tcw-t7-11", title: "Episodio 11: Destrozados", duration: 22 },
          { id: "tcw-t7-12", title: "Episodio 12: Victoria y Muerte", duration: 22 }
        ]
      }
    ]
  },
  {
    id: "maul-era5",
    eraNumber: 5,
    eraLabel: "Huevos de Pascua y El Final",
    description: "El futuro de Maul, sus conexiones con el Alba Carmesí y su último encuentro con Obi-Wan Kenobi.",
    items: [
      {
        id: "solo-movie",
        title: "Han Solo: Una Historia de Star Wars (2018)",
        type: "movie",
        duration: 135,
        reason: "Ocurre en el 13 ABY. Revela que Maul es el jefe supremo de Crimson Dawn. Ver a personajes como Qi'ra o Dryden Vos te permitirá captar cualquier referencia o prototipo de este sindicato que seguro aparecerá en Maul-Shadow Lord.",
        essential: true,
        tags: ['crimson-dawn']
      },
      {
        id: "ahsoka-t1-maul",
        title: "Ahsoka - Temporada 1",
        type: "series",
        duration: 360,
        reason: "Introduce a Marrok, el misterioso ex-inquisidor mercenario recubierto de magia oscura. Ver sus orígenes bajo el ala de Maul en Shadow Lord será fascinante tras conocer su destino en Ahsoka.",
        essential: true,
        tags: ['dathomir']
      },
      {
        id: "rebels-maul",
        title: "Star Wars Rebels - Eps Seleccionados (T2 y T3)",
        type: "series",
        duration: 88,
        reason: "Cierra definitivamente la historia de Maul. Lo vemos como el 'Viejo Maestro', descubrimos qué pasó con el Darksaber, y presenciamos su encuentro final, poético y perfecto, con Obi-Wan Kenobi en Tatooine.",
        essential: true,
        tags: ['sith', 'mandalore'],
        subItems: [
          { id: "rebels-t2-21-22", title: "T2 Final: El Crepúsculo del Aprendiz", duration: 44 },
          { id: "rebels-t3-3", title: "T3 Ep 3: Los Holocrones del Destino", duration: 22 },
          { id: "rebels-t3-11", title: "T3 Ep 11: Visiones y Voces", duration: 22 },
          { id: "rebels-t3-20", title: "T3 Ep 20: Soles Gemelos", duration: 22 }
        ]
      }
    ]
  }
];
