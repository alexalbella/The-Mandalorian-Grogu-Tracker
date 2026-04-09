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
        synopsis: "Darth Maul, aprendiz silencioso de Darth Sidious, recibe su primera misión: eliminar a los Jedi que protegen a la Reina Amidala. Tras asesinar al Maestro Qui-Gon Jinn en el legendario Duelo de los Destinos, es partido por la mitad por un joven Obi-Wan Kenobi —dando inicio a la venganza que definirá el resto de su vida.",
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
        synopsis: "En el planeta oscuro de Dathomir, la Madre Talzin forja un guerrero de guerra pura para el Conde Dooku: Savage Opress, hermano de sangre de Maul. Entre rituales de magia oscura y brutalidad descarnada, se revela el gran secreto: Darth Maul sobrevivió, disperso en los confines del espacio.",
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
        synopsis: "Morgan Elsbeth presencia la masacre de Dathomir perpetrada por los Separatistas. El exterminio de las Hermanas de la Noche forja en ella una lealtad ciega al poder imperial, convirtiendo el dolor en pragmatismo implacable. Tres capítulos que explican por qué las huellas de Maul siguen vivas décadas después.",
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
        synopsis: "Savage Opress encuentra a Maul en el planeta vertedero de Lotho Minor: una criatura enloquecida, mitad hombre, mitad arácnido de chatarra. La Madre Talzin interviene con su magia para restaurar su mente y sus piernas, liberando al depredador definitivo sobre una galaxia desprevenida.",
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
        synopsis: "Maul convoca a las mayores organizaciones criminales de la galaxia y las somete una a una: el Sol Negro, los Pykes y los Hutt. Tras derrotar a Pre Vizsla en combate singular y apropiarse del Darksaber, conquista Mandalore —atrayendo inevitablemente la ira de su antiguo maestro, Darth Sidious.",
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
        synopsis: "Adaptación de guiones inéditos de The Clone Wars. Maul escapa de la prisión de Sidious y libra una guerra en dos frentes: contra Dooku y Grievous, y contra el propio Sidious. La Madre Talzin sacrifica todo para salvar a su hijo, y Rook Kast emerge como su leal lugarteniente en las sombras.",
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
        synopsis: "Ahsoka Tano desciende al inframundo de Coruscant siguiendo una pista sobre un niño secuestrado, descubriendo los tentáculos del Sindicato Pyke —leales a Maul— en cada rincón del bajo mundo. La misión confirma que Maul sigue operando como señor del crimen desde las sombras de Mandalore.",
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
        synopsis: "Ahsoka Tano y Bo-Katan Kryze sitían Mandalore mientras la Orden 66 convierte la galaxia al oscurantismo imperial. Maul, profeta de su propia derrota, ofrece a Ahsoka una alianza desesperada para matar a Sidious. El duelo final entre ambos es la última batalla libre antes de la Era Imperial.",
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
        synopsis: "Un joven Han Solo descubre que el inframundo galáctico tiene un amo invisible: Darth Maul, líder supremo del Amanecer Carmesí. La película traza el mapa de los tentáculos criminales del imperio de Maul y establece los activos que heredará en su reinado como Shadow Lord.",
        essential: true,
        tags: ['crimson-dawn']
      },
      {
        id: "ahsoka-t1-maul",
        title: "Ahsoka - Temporada 1",
        type: "series",
        duration: 360,
        reason: "Introduce a Marrok, el misterioso ex-inquisidor mercenario recubierto de magia oscura. Ver sus orígenes bajo el ala de Maul en Shadow Lord será fascinante tras conocer su destino en Ahsoka.",
        synopsis: "Ahsoka Tano investiga una nueva amenaza en una galaxia vulnerable tras la caída del Imperio.",
        essential: true,
        tags: ['dathomir']
      },
      {
        id: "rebels-maul",
        title: "Star Wars Rebels - Eps Seleccionados (T2 y T3)",
        type: "series",
        duration: 88,
        reason: "Cierra definitivamente la historia de Maul. Lo vemos como el 'Viejo Maestro', descubrimos qué pasó con el Darksaber, y presenciamos su encuentro final, poético y perfecto, con Obi-Wan Kenobi en Tatooine.",
        synopsis: "El 'Viejo Maestro' emerge en el Templo Sith de Malachor y recluta a Ezra Bridger como aprendiz. Tres temporadas cierran su arco: Maul pierde el Darksaber, descifra la visión de los Holocrones y en Tatooine encuentra un envejecido Obi-Wan Kenobi. Su muerte, serena y completa, da cierre definitivo al ciclo.",
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
