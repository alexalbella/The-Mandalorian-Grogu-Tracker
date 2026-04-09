export type SubItem = {
  id: string;
  title: string;
  duration: number;
};

export type MediaItem = {
  id: string;
  title: string;
  type: 'movie' | 'series';
  duration: number; // in minutes
  reason: string;
  synopsis?: string;
  essential: boolean;
  tags: string[];
  subItems?: SubItem[];
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
        reason: "Contexto sobre las carreras de vainas (Podracing) y los droides de foso (pit droids). Peli Motto tiene su taller lleno de chatarra de esta época, y es probable que veamos guiños visuales en Tatooine.",
        synopsis: "Un joven esclavo de Tatooine, Anakin Skywalker, es descubierto por los Jedi Qui-Gon Jinn y Obi-Wan Kenobi. Mientras la Trade Federation invade Naboo, el misterioso Sith Darth Maul acecha en las sombras —y el ecosistema de Tatooine queda grabado en la memoria galáctica.",
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
        reason: "Muestra el secuestro y rescate del bebé Rotta el Hutt (hijo de Jabba). Se espera que Rotta regrese en la película reclamando su posición como legítimo heredero del imperio criminal.",
        synopsis: "Anakin Skywalker y su nueva Padawan Ahsoka Tano son enviados a rescatar a Rotta, el hijo de Jabba el Hutt, en el planeta hostil Teth. El éxito de la misión podría abrir las rutas de suministro Hutt a la República —y el fracaso costaría la guerra.",
        essential: true,
        tags: ['hutt']
      },
      {
        id: "tcw-t2-12-14",
        title: "The Clone Wars - T2, Eps 12 al 14",
        type: "series",
        duration: 66,
        reason: "Arco de la Guardia de la Muerte. Presenta a la secta extremista mandaloriana (Death Watch) que años más tarde rescataría al niño Din Djarin, forjando sus creencias religiosas.",
        synopsis: "Obi-Wan Kenobi viaja a Mandalore para investigar el resurgimiento de la Guardia de la Muerte (Death Watch), facción separatista extremista que amenaza el pacifismo de la Duquesa Satine Kryze. El destino del planeta mandaloriano y su creed quedan en la balanza.",
        essential: true,
        tags: ['mandalore'],
        subItems: [
          { id: "tcw-t2-12", title: "Episodio 12: El Complot de Mandalore", duration: 22 },
          { id: "tcw-t2-13", title: "Episodio 13: Viaje de Tentación", duration: 22 },
          { id: "tcw-t2-14", title: "Episodio 14: La Duquesa de Mandalore", duration: 22 }
        ]
      },
      {
        id: "tcw-t2-17",
        title: "The Clone Wars - T2, Ep 17: Bounty Hunters",
        type: "series",
        duration: 22,
        reason: "Bounty Hunters. Primera aparición de Embo, el letal cazarrecompensas de la raza Kyuzo (y su mascota Anooba), quien ha sido confirmado como antagonista en la película.",
        synopsis: "Anakin, Obi-Wan y Ahsoka se alían con cazarrecompensas para proteger a un granjero de especias.",
        essential: false,
        tags: ['bounty-hunters']
      },
      {
        id: "tcw-t3-4",
        title: "The Clone Wars - T3, Ep 4: Sphere of Influence",
        type: "series",
        duration: 22,
        reason: "Sphere of Influence. Establece la larga relación de Embo trabajando como mercenario político para los Hutt, lo que explica su posible lealtad en el conflicto venidero.",
        synopsis: "La familia de Papanoida es secuestrada y retenida para pedir rescate.",
        essential: false,
        tags: ['bounty-hunters', 'hutt']
      },
      {
        id: "tcw-t4-15-18",
        title: "The Clone Wars - T4, Eps 15 al 18",
        type: "series",
        duration: 88,
        reason: "Arco de Obi-Wan Infiltrado. Embo demuestra por qué es considerado la élite de la galaxia, sobreviviendo a pruebas brutales junto a otros cazarrecompensas míticos como Cad Bane.",
        synopsis: "Para infiltrarse en una conspiración contra el Canciller, Obi-Wan Kenobi finge su propia muerte y adopta la identidad del mercenario Rako Hardeen. Sobrevivir a 'La Caja' —una trampa mortal diseñada por Moralo Eval junto a Cad Bane y Embo— será su mayor prueba.",
        essential: false,
        tags: ['bounty-hunters'],
        subItems: [
          { id: "tcw-t4-15", title: "Episodio 15: Decepción", duration: 22 },
          { id: "tcw-t4-16", title: "Episodio 16: Amigos y Enemigos", duration: 22 },
          { id: "tcw-t4-17", title: "Episodio 17: La Caja", duration: 22 },
          { id: "tcw-t4-18", title: "Episodio 18: Crisis en Naboo", duration: 22 }
        ]
      },
      {
        id: "tcw-t4-20-22",
        title: "The Clone Wars - T4, Eps 20 y 22",
        type: "series",
        duration: 44,
        reason: "Bounty / Revenge. Muestra a Embo trabajando con un joven Boba Fett y forjando alianzas en el inframundo criminal, conexiones que podrían ser relevantes en Tatooine.",
        synopsis: "Un joven Boba Fett lidera una célula de cazarrecompensas —entre ellos Embo— en una misión de protección que degenera en matanza. Savage Opress y Maul emergen de las sombras con un plan de venganza que sacude el bajo mundo galáctico.",
        essential: false,
        tags: ['bounty-hunters'],
        subItems: [
          { id: "tcw-t4-20", title: "Episodio 20: Recompensa", duration: 22 },
          { id: "tcw-t4-22", title: "Episodio 22: Venganza", duration: 22 }
        ]
      },
      {
        id: "tcw-t5-14",
        title: "The Clone Wars - T5, Ep 14: Eminence",
        type: "series",
        duration: 22,
        reason: "Eminence. Embo se enfrenta a mandalorianos y se entrelaza con el Sindicato de la Sombra y Darth Maul, mostrando su capacidad de supervivencia ante amenazas mayores.",
        synopsis: "Savage y Maul sellan una alianza con Death Watch.",
        essential: false,
        tags: ['mandalore', 'bounty-hunters']
      },
      {
        id: "tcw-t6-5",
        title: "The Clone Wars - T6, Ep 5: An Old Friend",
        type: "series",
        duration: 22,
        reason: "An Old Friend. Una de las escenas de acción más destacadas de Embo, donde usa su sombrero como tabla de snowboard y sobrevive a un duelo directo contra Anakin Skywalker.",
        synopsis: "Ahsoka avisa a Anakin y Obi-Wan sobre Maul, pero el ataque a Coruscant obliga a los Jedi a elegir.",
        essential: true,
        tags: ['bounty-hunters']
      },
      {
        id: "tcw-t7-9-12",
        title: "The Clone Wars - T7, Eps 9 al 12",
        type: "series",
        duration: 88,
        reason: "El Asedio de Mandalore. El evento traumático que dejó cicatrices en Bo-Katan y explica la caída de la civilización mandaloriana antes de la llegada del Imperio.",
        synopsis: "Ahsoka Tano dirige el Asedio de Mandalore junto a Bo-Katan Kryze para capturar a Darth Maul mientras la Orden 66 sacude la galaxia. La civilización mandaloriana queda al borde del colapso; Ahsoka y su clon Rex luchan por sobrevivir al fin de la República.",
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
        synopsis: "El Escuadrón de Élite regresa a Kamino justo cuando el Imperio prepara la destrucción definitiva de la instalación de clonación. Los laboratorios se hunden en el océano y con ellos el legado de los clones de la República Galáctica.",
        essential: false,
        tags: ['empire'],
        subItems: [
          { id: "bb-t1-15", title: "Episodio 15: Regreso a Kamino", duration: 25 },
          { id: "bb-t1-16", title: "Episodio 16: Kamino Perdido", duration: 25 }
        ]
      },
      {
        id: "bb-t3-1-3-14-15",
        title: "The Bad Batch - T3, Eps 1 al 3 y los últimos dos",
        type: "series",
        duration: 125,
        reason: "Explora a fondo la base secreta del Monte Tantiss y menciona por primera vez el Proyecto Nigromante (el plan para clonar la Fuerza y resucitar a Palpatine), revelando la razón por la que Moff Gideon buscaba la sangre de Grogu.",
        synopsis: "El Escuadrón de Élite descubre el Monte Tantiss, la base secreta donde el Imperio experimenta con sangre de niños fuerza-sensibles bajo el Proyecto Nigromante. La operación de rescate revela hasta dónde está dispuesto a llegar el Imperio para garantizar la inmortalidad de Palpatine.",
        essential: true,
        tags: ['empire'],
        subItems: [
          { id: "bb-t3-1", title: "Episodio 1: Confinados", duration: 25 },
          { id: "bb-t3-2", title: "Episodio 2: Caminos Desconocidos", duration: 25 },
          { id: "bb-t3-3", title: "Episodio 3: Sombras de Tantiss", duration: 25 },
          { id: "bb-t3-14", title: "Episodio 14: Ataque Rápido", duration: 25 },
          { id: "bb-t3-15", title: "Episodio 15: La Caballería Llega", duration: 25 }
        ]
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
        reason: "Spark of Rebellion. Introducción del guerrero Lasat Garazeb 'Zeb' Orrelios, quien ha sido confirmado para aparecer en la película como Ranger de la Nueva República.",
        synopsis: "Ezra Bridger, un joven ladrón fuerza-sensible, se une al equipo del Espectro: un grupo de rebeldes que opera bajo el yugo imperial en Lothal. El debut del guerrero Lasat Garazeb 'Zeb' Orrelios marca el inicio de la resistencia organizada en el Borde Exterior.",
        essential: false,
        tags: ['new-republic'],
        subItems: [
          { id: "rebels-t1-1", title: "Episodio 1: La Chispa de la Rebelión (Parte 1)", duration: 22 },
          { id: "rebels-t1-2", title: "Episodio 2: La Chispa de la Rebelión (Parte 2)", duration: 22 }
        ]
      },
      {
        id: "rebels-t2-17",
        title: "Star Wars Rebels - T2, Ep 17: The Honorable Ones",
        type: "series",
        duration: 22,
        reason: "The Honorable Ones. Define la brújula moral de Zeb tras quedarse atrapado en una luna helada con su peor enemigo imperial, dando profundidad a su personaje.",
        synopsis: "Zeb y el agente Kallus quedan aislados en un planeta helado.",
        essential: false,
        tags: ['new-republic']
      },
      {
        id: "rebels-t3-15",
        title: "Star Wars Rebels - T3, Ep 15: Trials of the Darksaber",
        type: "series",
        duration: 22,
        reason: "Trials of the Darksaber. Cuenta la historia de Tarre Vizsla, el primer Jedi Mandaloriano, y el profundo significado religioso del Sable Oscuro para el pueblo de Din Djarin.",
        synopsis: "Sabine empieza a entrenar con el Sable Oscuro y, al hacerlo, se enfrenta a su pasado.",
        essential: true,
        tags: ['mandalore']
      },
      {
        id: "rebels-t3-t4",
        title: "Star Wars Rebels - Temporadas 3 y 4 (Arcos principales)",
        type: "series",
        duration: 220,
        reason: "Muestra en acción las tácticas despiadadas y calculadoras del Gran Almirante Thrawn antes de su exilio, estableciéndolo como una amenaza estratégica formidable.",
        synopsis: "El Gran Almirante Thrawn asume el mando imperial en el Borde Exterior, y su inteligencia táctica despiadada amenaza con aplastar a los rebeldes. Estudia el arte y la cultura del enemigo para destruirlo con precisión quirúrgica —y nadie logra anticipar sus siguientes movimientos.",
        essential: true,
        tags: ['thrawn'],
        subItems: [
          { id: "rebels-t3-1", title: "T3 Ep 1: Pasos en la Sombra", duration: 44 },
          { id: "rebels-t3-5", title: "T3 Ep 5: El Último Combate de Hera", duration: 22 },
          { id: "rebels-t3-10", title: "T3 Ep 10: Un Infiltrado", duration: 22 },
          { id: "rebels-t3-17", title: "T3 Ep 17: A Través de Ojos Imperiales", duration: 22 },
          { id: "rebels-t3-21", title: "T3 Ep 21: Hora Cero", duration: 44 },
          { id: "rebels-t4-15", title: "T4 Ep 15: Reunión Familiar y Despedida", duration: 66 }
        ]
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
        reason: "Contexto visual de Mos Eisley, la cantina, los Jawas y los Moradores de las Arenas (Tuskens), tribus que Mando respeta y que probablemente veamos de nuevo.",
        synopsis: "Un joven granjero tatooiniano, Luke Skywalker, se ve arrastrado a la lucha galáctica al encontrar un mensaje secreto en el droide R2-D2. Junto a Han Solo, Obi-Wan Kenobi y los contrabandistas del Halcón Milenario, intentan rescatar a la Princesa Leia y destruir la Estrella de la Muerte.",
        essential: false,
        tags: ['hutt']
      },
      {
        id: "ep5",
        title: "Episodio V: El Imperio Contraataca (1980)",
        type: "movie",
        duration: 124,
        reason: "La escena de Darth Vader contratando cazarrecompensas incluye a IG-88 (modelo base de IG-11/IG-12) y Bossk. Es una referencia clásica que el equipo de The Mandalorian suele homenajear.",
        synopsis: "El Imperio destruye la base rebelde en Hoth y Darth Vader contrata a una élite de cazarrecompensas —IG-88, Bossk, Boba Fett— para rastrear al Halcón Milenario. Luke viaja a Dagobah para entrenarse con el Maestro Yoda mientras sus amigos caen en una trampa en Bespin.",
        essential: false,
        tags: ['bounty-hunters']
      },
      {
        id: "ep6",
        title: "Episodio VI: El Retorno del Jedi (1983)",
        type: "movie",
        duration: 131,
        reason: "La muerte de Jabba el Hutt a manos de Leia. Es el evento detonante que crea el vacío de poder en Tatooine, un conflicto que Rotta, los Gemelos Hutt y Boba Fett se disputarán.",
        synopsis: "El crimen organizado de Jabba el Hutt cae ante los héroes de la Alianza en Tatooine. Luke Skywalker se enfrenta al Emperador y a su padre Darth Vader en la Estrella de la Muerte, mientras la Batalla de Endor decide el destino de la galaxia —y la muerte de Jabba crea el vacío de poder que definirá Tatooine por décadas.",
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
        synopsis: "Un cazarrecompensas mandaloriano acepta un contrato misterioso que lo lleva a un objetivo inesperado: un anciano infante de la especie del Gran Maestro Yoda. El instinto paternal prevalece sobre el crédito, y el Gremio de Cazarrecompensas se convierte en su nuevo enemigo.",
        essential: true,
        tags: ['mandalore', 'empire'],
        subItems: [
          { id: "mando-t1-e1", title: "Capítulo 1: El Mandaloriano", duration: 40 },
          { id: "mando-t1-e2", title: "Capítulo 2: El Niño", duration: 40 },
          { id: "mando-t1-e3", title: "Capítulo 3: El Pecado", duration: 40 },
          { id: "mando-t1-e4", title: "Capítulo 4: Santuario", duration: 40 },
          { id: "mando-t1-e5", title: "Capítulo 5: El Pistolero", duration: 40 },
          { id: "mando-t1-e6", title: "Capítulo 6: El Prisionero", duration: 40 },
          { id: "mando-t1-e7", title: "Capítulo 7: El Ajuste de Cuentas", duration: 40 },
          { id: "mando-t1-e8", title: "Capítulo 8: Redención", duration: 40 }
        ]
      },
      {
        id: "mando-t2",
        title: "The Mandalorian - Temporada 2 (Caps. 9 al 16)",
        type: "series",
        duration: 320,
        reason: "La búsqueda de los Jedi (Ahsoka y Luke Skywalker), alianzas con Bo-Katan y la dolorosa separación temporal de Din y Grogu.",
        synopsis: "Din Djarin recorre la galaxia en busca de Jedis que puedan acoger a Grogu, cruzando caminos con Bo-Katan Kryze y recuperando el Sable Oscuro. El rescate del niño en el crucero de Moff Gideon culmina con la aparición legendaria de Luke Skywalker.",
        essential: true,
        tags: ['mandalore'],
        subItems: [
          { id: "mando-t2-e9", title: "Capítulo 9: El Marshal", duration: 40 },
          { id: "mando-t2-e10", title: "Capítulo 10: El Pasajero", duration: 40 },
          { id: "mando-t2-e11", title: "Capítulo 11: La Heredera", duration: 40 },
          { id: "mando-t2-e12", title: "Capítulo 12: El Asedio", duration: 40 },
          { id: "mando-t2-e13", title: "Capítulo 13: La Jedi", duration: 40 },
          { id: "mando-t2-e14", title: "Capítulo 14: La Tragedia", duration: 40 },
          { id: "mando-t2-e15", title: "Capítulo 15: El Creyente", duration: 40 },
          { id: "mando-t2-e16", title: "Capítulo 16: El Rescate", duration: 40 }
        ]
      },
      {
        id: "bobafett-1-4",
        title: "The Book of Boba Fett - Eps 1 al 4",
        type: "series",
        duration: 180,
        reason: "Introducción de los Gemelos Hutt y el Wookiee cazarrecompensas Black Krrsantan. Reclaman el imperio de Jabba y es muy probable que choquen con Rotta en el futuro. Boba se consolida como Daimyo local.",
        synopsis: "Boba Fett, resurgido del Sarlacc de Tatooine, reclama el trono del difunto Jabba como nuevo Daimyo. La aparición de los Gemelos Hutt y el wookiee Black Krrsantan advierte que el vacío de poder en el inframundo de Tatooine está lejos de resolverse.",
        essential: false,
        tags: ['hutt', 'bounty-hunters'],
        subItems: [
          { id: "bobafett-e1", title: "Capítulo 1: Forastero en Tierra Extraña", duration: 45 },
          { id: "bobafett-e2", title: "Capítulo 2: Las Tribus de Tatooine", duration: 45 },
          { id: "bobafett-e3", title: "Capítulo 3: Las Calles de Mos Espa", duration: 45 },
          { id: "bobafett-e4", title: "Capítulo 4: La Tormenta se Avecina", duration: 45 }
        ]
      },
      {
        id: "bobafett-5-7",
        title: "The Book of Boba Fett - Eps 5 al 7",
        type: "series",
        duration: 135,
        reason: "Crucial para la trama principal. Explica cómo Mando consigue su nueva nave (el caza N-1) y por qué Grogu abandona su entrenamiento con Luke para volver con Din. Además, Din y Boba se vuelven hermanos de armas.",
        synopsis: "Din Djarin obtiene un elegante caza N-1 de Naboo y Grogu abandona el entrenamiento jedi con Luke Skywalker para reunirse con Mando. Los dos aliados unen fuerzas para defender Freetown contra los Pykes y la Sombra Colectiva.",
        essential: true,
        tags: ['mandalore'],
        subItems: [
          { id: "bobafett-e5", title: "Capítulo 5: El Retorno del Mandaloriano", duration: 45 },
          { id: "bobafett-e6", title: "Capítulo 6: Del Desierto Llega un Forastero", duration: 45 },
          { id: "bobafett-e7", title: "Capítulo 7: En el Nombre del Honor", duration: 45 }
        ]
      },
      {
        id: "mando-t3",
        title: "The Mandalorian - Temporada 3 (Caps. 17 al 24)",
        type: "series",
        duration: 320,
        reason: "La redención de Mando en las Aguas Vivas, la unión de los clanes, la reconquista del planeta Mandalore, la adopción oficial de 'Din Grogu', y el pacto de Mando para cazar imperiales para la Nueva República (punto de partida de la película).",
        synopsis: "Din Djarin busca redención en las Aguas Vivas de Mandalore para recuperar su estatus bajo el Credo. La unión de los clanes mandalorianos culmina en la reconquista del planeta natal, mientras el Imperio sombra de Moff Gideon es destruido y Din adopta oficialmente a Grogu como Din Grogu.",
        essential: true,
        tags: ['mandalore', 'new-republic'],
        subItems: [
          { id: "mando-t3-e17", title: "Capítulo 17: El Apóstata", duration: 40 },
          { id: "mando-t3-e18", title: "Capítulo 18: Las Minas de Mandalore", duration: 40 },
          { id: "mando-t3-e19", title: "Capítulo 19: El Converso", duration: 40 },
          { id: "mando-t3-e20", title: "Capítulo 20: El Expósito", duration: 40 },
          { id: "mando-t3-e21", title: "Capítulo 21: El Pirata", duration: 40 },
          { id: "mando-t3-e22", title: "Capítulo 22: Mercenarios", duration: 40 },
          { id: "mando-t3-e23", title: "Capítulo 23: Los Espías", duration: 40 },
          { id: "mando-t3-e24", title: "Capítulo 24: El Regreso", duration: 40 }
        ]
      },
      {
        id: "ahsoka-t1",
        title: "Ahsoka - Temporada 1",
        type: "series",
        duration: 360,
        reason: "Confirma el regreso del Gran Almirante Thrawn a la galaxia conocida. Su presencia es la principal razón por la que la Nueva República está al borde de una nueva guerra y necesita la ayuda de Din Djarin.",
        synopsis: "Ahsoka Tano y Sabine Wren rastrean un mapa galáctico que revela la ubicación del Gran Almirante Thrawn en el exilio. La búsqueda los lleva más allá del mapa estelar conocido, a una galaxia distante donde Thrawn aguarda su regreso triunfal.",
        essential: true,
        tags: ['thrawn', 'new-republic'],
        subItems: [
          { id: "ahsoka-e1", title: "Parte 1: Maestro y Aprendiz", duration: 45 },
          { id: "ahsoka-e2", title: "Parte 2: Trabajo y Problemas", duration: 45 },
          { id: "ahsoka-e3", title: "Parte 3: Hora de Volar", duration: 45 },
          { id: "ahsoka-e4", title: "Parte 4: Jedi Caído", duration: 45 },
          { id: "ahsoka-e5", title: "Parte 5: El Guerrero de las Sombras", duration: 45 },
          { id: "ahsoka-e6", title: "Parte 6: Muy, Muy Lejos", duration: 45 },
          { id: "ahsoka-e7", title: "Parte 7: Sueños y Locura", duration: 45 },
          { id: "ahsoka-e8", title: "Parte 8: El Jedi, la Bruja y el Caudillo", duration: 45 }
        ]
      },
      {
        id: "skeleton-crew-t1",
        title: "Skeleton Crew - Temporada 1",
        type: "series",
        duration: 360,
        reason: "Muestra cómo la piratería se ha salido de control en el Borde Exterior, explicando por qué los Rangers de Adelphi (el escuadrón de Carson Teva y Zeb) están tan desbordados que necesitan contratar a cazarrecompensas como Mando.",
        synopsis: "Cuatro niños de At Attin, un planeta secreto de la Nueva República, quedan atrapados en el caótico Borde Exterior. Su desesperada búsqueda por volver a casa expone el desbordamiento pirata que abruma a los Rangers de Adelphi —y explica por qué la Nueva República necesita contratar cazarrecompensas como Din Djarin.",
        essential: false,
        tags: ['new-republic'],
        subItems: [
          { id: "skeleton-crew-e1", title: "Episodio 1: This Could Be a Real Adventure", duration: 45 },
          { id: "skeleton-crew-e2", title: "Episodio 2: Way, Way Out Past the Barrier", duration: 45 },
          { id: "skeleton-crew-e3", title: "Episodio 3: Very Interesting, As an Astrogation Problem", duration: 45 },
          { id: "skeleton-crew-e4", title: "Episodio 4: Can’t Say I Remember No At Attin", duration: 45 },
          { id: "skeleton-crew-e5", title: "Episodio 5: You Have a Lot to Learn About Pirates", duration: 45 },
          { id: "skeleton-crew-e6", title: "Episodio 6: Zero Friends Again", duration: 45 },
          { id: "skeleton-crew-e7", title: "Episodio 7: We’re Gonna Be In So Much Trouble", duration: 45 },
          { id: "skeleton-crew-e8", title: "Episodio 8: The Real Good Guys", duration: 45 }
        ]
      }
    ]
  }
];
