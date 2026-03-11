export type MediaItem = {
  id: string;
  title: string;
  type: 'movie' | 'series';
  duration: number; // in minutes
  reason: string;
  essential: boolean;
  tags: string[];
};

export type Era = {
  id: string;
  eraNumber: number;
  eraLabel: string;
  description: string;
  items: MediaItem[];
};

export const eras: Era[] = [
  {
    id: "era1",
    eraNumber: 1,
    eraLabel: "La República y el Inframundo",
    description: "Las raíces de Tatooine. Antes de entrar en guerras, hay que entender el planeta donde ocurrirá el conflicto de sucesión Hutt.",
    items: [
      {
        id: "ep1",
        title: "Episodio I: La Amenaza Fantasma (1999)",
        type: "movie",
        duration: 136,
        reason: "Para refrescar tu memoria sobre las carreras de vainas (Podracing) y los droides de foso (pit droids). Peli Motto tiene su taller lleno de chatarra de esta época y seguro habrá guiños visuales en Tatooine.",
        essential: false,
        tags: ['hutt']
      }
    ]
  },
  {
    id: "era2",
    eraNumber: 2,
    eraLabel: "Las Guerras Clon",
    description: "Orígenes de Mandalore, Rotta y Embo. Aquí conocerás a los personajes secundarios clave de la película y el pasado de la cultura Mandaloriana.",
    items: [
      {
        id: "tcw-movie",
        title: "Star Wars: The Clone Wars (Película animada, 2008)",
        type: "movie",
        duration: 98,
        reason: "Muestra el secuestro y rescate del bebé Rotta el Hutt (hijo de Jabba). Rotta regresa en la película como el legítimo heredero del imperio criminal.",
        essential: true,
        tags: ['hutt']
      },
      {
        id: "tcw-t2-12-14",
        title: "The Clone Wars - T2, Eps 12 al 14",
        type: "series",
        duration: 66,
        reason: "Arco de la Guardia de la Muerte. Conocerás a la secta extremista mandaloriana (Death Watch) que años más tarde rescataría al niño Din Djarin, forjando sus creencias religiosas.",
        essential: true,
        tags: ['mandalore']
      },
      {
        id: "tcw-t2-17",
        title: "The Clone Wars - T2, Ep 17",
        type: "series",
        duration: 22,
        reason: "Bounty Hunters. Primera aparición de Embo, el letal cazarrecompensas de la raza Kyuzo (y su mascota Anooba) que será el villano de la película.",
        essential: false,
        tags: ['bounty-hunters']
      },
      {
        id: "tcw-t3-4",
        title: "The Clone Wars - T3, Ep 4",
        type: "series",
        duration: 22,
        reason: "Sphere of Influence. Establece la larga relación de Embo trabajando como mercenario político para los Hutt.",
        essential: false,
        tags: ['bounty-hunters', 'hutt']
      },
      {
        id: "tcw-t4-15-18",
        title: "The Clone Wars - T4, Eps 15 al 18",
        type: "series",
        duration: 88,
        reason: "Arco de Obi-Wan Infiltrado. Embo demuestra por qué es la élite de la galaxia sobreviviendo a pruebas brutales junto a otros cazarrecompensas míticos como Cad Bane.",
        essential: false,
        tags: ['bounty-hunters']
      },
      {
        id: "tcw-t4-20-22",
        title: "The Clone Wars - T4, Eps 20 y 22",
        type: "series",
        duration: 44,
        reason: "Bounty / Revenge. Muestra a Embo trabajando con un joven Boba Fett y forjando alianzas en el inframundo criminal.",
        essential: false,
        tags: ['bounty-hunters']
      },
      {
        id: "tcw-t5-1",
        title: "The Clone Wars - T5, Ep 1",
        type: "series",
        duration: 22,
        reason: "Eminence. Embo se enfrenta a mandalorianos y se entrelaza con el Sindicato de la Sombra y Darth Maul.",
        essential: false,
        tags: ['mandalore', 'bounty-hunters']
      },
      {
        id: "tcw-t6-5",
        title: "The Clone Wars - T6, Ep 5",
        type: "series",
        duration: 22,
        reason: "An Old Friend. La escena cumbre de Embo: usa su sombrero como tabla de snowboard en una persecución en la nieve y sobrevive a un duelo directo contra Anakin Skywalker.",
        essential: true,
        tags: ['bounty-hunters']
      },
      {
        id: "tcw-t7-9-12",
        title: "The Clone Wars - T7, Eps 9 al 12",
        type: "series",
        duration: 88,
        reason: "El Asedio de Mandalore. El evento traumático que dejó las cicatrices en Bo-Katan y explica la caída de la civilización mandaloriana antes de la llegada del Imperio.",
        essential: true,
        tags: ['mandalore']
      }
    ]
  },
  {
    id: "era3",
    eraNumber: 3,
    eraLabel: "El Imperio y el Proyecto Nigromante",
    description: "El trasfondo de por qué el Imperio persiguió a Grogu en primer lugar.",
    items: [
      {
        id: "bb-t1-15-16",
        title: "The Bad Batch - T1, Eps 15 y 16",
        type: "series",
        duration: 50,
        reason: "Muestra la destrucción de las instalaciones de clonación en Kamino y cómo el Imperio secuestra a los científicos para sus propios fines.",
        essential: false,
        tags: ['empire']
      },
      {
        id: "bb-t3-1-3-14-15",
        title: "The Bad Batch - T3, Eps 1 al 3 y los últimos dos",
        type: "series",
        duration: 125,
        reason: "Explora a fondo la base secreta del Monte Tantiss y se menciona por primera vez el Proyecto Nigromante (el plan para clonar la Fuerza y resucitar a Palpatine), la razón exacta por la que Moff Gideon quería la sangre de Grogu.",
        essential: true,
        tags: ['empire']
      }
    ]
  },
  {
    id: "era4",
    eraNumber: 4,
    eraLabel: "La Rebelión",
    description: "Thrawn, Zeb y el Sable Oscuro. Conoce a los aliados y a la gran amenaza militar que acecha en las sombras.",
    items: [
      {
        id: "rebels-t1-1-2",
        title: "Star Wars Rebels - T1, Eps 1 y 2",
        type: "series",
        duration: 44,
        reason: "Spark of Rebellion. Introducción del guerrero Lasat Garazeb 'Zeb' Orrelios (quien estará en la película como Ranger de la Nueva República) y su rifle-bo.",
        essential: false,
        tags: ['new-republic']
      },
      {
        id: "rebels-t2-17",
        title: "Star Wars Rebels - T2, Ep 17",
        type: "series",
        duration: 22,
        reason: "The Honorable Ones. Define la brújula moral de Zeb tras quedarse atrapado en una luna helada con su peor enemigo imperial.",
        essential: false,
        tags: ['new-republic']
      },
      {
        id: "rebels-t3-15",
        title: "Star Wars Rebels - T3, Ep 15",
        type: "series",
        duration: 22,
        reason: "Trials of the Darksaber. Cuenta la historia de Tarre Vizsla, el primer Jedi Mandaloriano, y el profundo significado religioso del Sable Oscuro para el pueblo de Din Djarin.",
        essential: true,
        tags: ['mandalore']
      },
      {
        id: "rebels-t3-t4",
        title: "Star Wars Rebels - Temporadas 3 y 4 (Arcos principales)",
        type: "series",
        duration: 220,
        reason: "Para ver en acción las tácticas despiadadas y calculadoras del Gran Almirante Thrawn antes de su exilio.",
        essential: true,
        tags: ['thrawn']
      }
    ]
  },
  {
    id: "era5",
    eraNumber: 5,
    eraLabel: "La Trilogía Original",
    description: "El Gremio y el fin de los Hutt. El contexto de la mafia galáctica y los 'colegas' de profesión de Din Djarin y Embo.",
    items: [
      {
        id: "ep4",
        title: "Episodio IV: Una Nueva Esperanza (1977)",
        type: "movie",
        duration: 121,
        reason: "Para captar todos los homenajes visuales a Mos Eisley, la cantina, los Jawas y los Moradores de las Arenas (Tuskens), tribus muy respetadas por Mando.",
        essential: false,
        tags: ['hutt']
      },
      {
        id: "ep5",
        title: "Episodio V: El Imperio Contraataca (1980)",
        type: "movie",
        duration: 124,
        reason: "Fíjate en la escena de Darth Vader contratando cazarrecompensas. Ahí está IG-88 (el modelo en el que se basa IG-11/IG-12 de Grogu) y Bossk. Favreau adora referenciar esta escena exacta.",
        essential: false,
        tags: ['bounty-hunters']
      },
      {
        id: "ep6",
        title: "Episodio VI: El Retorno del Jedi (1983)",
        type: "movie",
        duration: 131,
        reason: "La muerte de Jabba el Hutt a manos de Leia. Es el evento detonante que crea el vacío de poder en Tatooine que Rotta, los Gemelos Hutt y Boba Fett se disputarán en la película.",
        essential: true,
        tags: ['hutt']
      }
    ]
  },
  {
    id: "era6",
    eraNumber: 6,
    eraLabel: "El Mandoverso",
    description: "La trama principal y el camino al cine. La historia actual. Ahora que conoces el pasado de todos, verás cómo chocan en el presente.",
    items: [
      {
        id: "mando-t1",
        title: "The Mandalorian - Temporada 1 (Caps. 1 al 8)",
        type: "series",
        duration: 320,
        reason: "El credo, la traición al Gremio de Cazarrecompensas, el descubrimiento de Grogu y el primer cara a cara contra el remanente imperial de Gideon.",
        essential: true,
        tags: ['mandalore', 'empire']
      },
      {
        id: "mando-t2",
        title: "The Mandalorian - Temporada 2 (Caps. 9 al 16)",
        type: "series",
        duration: 320,
        reason: "La búsqueda de los Jedi (Ahsoka y Luke Skywalker), alianzas con Bo-Katan y la dolorosa separación temporal de Din y Grogu.",
        essential: true,
        tags: ['mandalore']
      },
      {
        id: "bobafett-1-4",
        title: "The Book of Boba Fett - Eps 1 al 4",
        type: "series",
        duration: 180,
        reason: "Introducción de los Gemelos Hutt y el Wookiee cazarrecompensas Black Krrsantan. Reclaman el imperio de Jabba y, sin duda, chocarán con Rotta en la película. Además, Boba se consolida como el Daimyo (jefe mafioso) local.",
        essential: false,
        tags: ['hutt', 'bounty-hunters']
      },
      {
        id: "bobafett-5-7",
        title: "The Book of Boba Fett - Eps 5 al 7",
        type: "series",
        duration: 135,
        reason: "Crucial. Explica cómo Mando consigue su nueva nave (el caza N-1) y por qué Grogu abandona su entrenamiento con Luke para volver con su papá adoptivo. Din y Boba se vuelven hermanos de armas aquí.",
        essential: true,
        tags: ['mandalore']
      },
      {
        id: "mando-t3",
        title: "The Mandalorian - Temporada 3 (Caps. 17 al 24)",
        type: "series",
        duration: 320,
        reason: "La redención de Mando en las Aguas Vivas, la unión de los clanes, la reconquista del planeta Mandalore, la adopción oficial de 'Din Grogu', y el pacto de Mando para trabajar cazando imperiales para la Nueva República (donde arranca la película).",
        essential: true,
        tags: ['mandalore', 'new-republic']
      },
      {
        id: "ahsoka-t1",
        title: "Ahsoka - Temporada 1",
        type: "series",
        duration: 360,
        reason: "El Consejo en la Sombra en The Mandalorian lo anticipó, pero aquí ocurre de verdad: El Gran Almirante Thrawn regresa a la galaxia. Su presencia es la principal razón por la que la Nueva República está al borde de una nueva guerra y necesita a Din Djarin.",
        essential: true,
        tags: ['thrawn', 'new-republic']
      },
      {
        id: "skeleton-crew-t1",
        title: "Skeleton Crew - Temporada 1",
        type: "series",
        duration: 360,
        reason: "Para entender cómo la piratería se ha salido de control en el Borde Exterior y por qué los Rangers de Adelphi (el escuadrón de la Nueva República donde están Carson Teva y Zeb) están tan desbordados que necesitan contratar cazarrecompensas privados como Mando.",
        essential: false,
        tags: ['new-republic']
      }
    ]
  }
];
