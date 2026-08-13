export const FIGURAS_LITERARIAS = [
  {
    id: "metafora",
    nombre: "Metáfora",
    icono: "✨",
    color: "#8b5cf6", // Purple
    definicion_detective: "Comparar dos cosas diciendo que una ES la otra, sin usar la palabra 'como'. ¡Un truco de magia con palabras!",
    ejemplo_rapido: "«El tiempo es un río dorado» (Corre rápido y no se detiene).",
    puntos_detective: 100,
    badge: "🔮 Maestro de la Metáfora"
  },
  {
    id: "simil",
    nombre: "Símil o Comparación",
    icono: "🪞",
    color: "#06b6d4", // Cyan
    definicion_detective: "Comparar dos cosas usando palabras clave como 'como', 'parece' o 'igual que'.",
    ejemplo_rapido: "«Brilla como una estrella en el cielo»",
    puntos_detective: 80,
    badge: "🔍 Ojo de Águila del Símil"
  },
  {
    id: "personificacion",
    nombre: "Personificación",
    icono: "🦊",
    color: "#ec4899", // Pink
    definicion_detective: "Dar vida humana a objetos, plantas o animales (decir que ríen, cantan o sueñan).",
    ejemplo_rapido: "«El viento susurraba secretos a la luna»",
    puntos_detective: 90,
    badge: "🌟 Encantador de Objetos"
  },
  {
    id: "hiperbole",
    nombre: "Hipérbole",
    icono: "🚀",
    color: "#f59e0b", // Gold
    definicion_detective: "¡Una gran exageración para llamar la atención o transmitir emoción súper fuerte!",
    ejemplo_rapido: "«Te lo he dicho un millón de veces»",
    puntos_detective: 85,
    badge: "💥 Gigante del Ritmo"
  },
  {
    id: "anafora",
    nombre: "Anáfora",
    icono: "🔁",
    color: "#10b981", // Emerald
    definicion_detective: "Repetir la misma palabra al principio de varios versos para crear un eco musical.",
    ejemplo_rapido: "«Llora la noche, llora el viento, llora mi voz»",
    puntos_detective: 75,
    badge: "🎵 Eco Poético"
  },
  {
    id: "aliteracion",
    nombre: "Aliteración",
    icono: "🔔",
    color: "#3b82f6", // Blue
    definicion_detective: "Repetir sonidos o letras varias veces para que la canción suene a lo que describe.",
    ejemplo_rapido: "«En el silencio sólo se escuchaba un susurro de abejas»",
    puntos_detective: 70,
    badge: "🎧 Susurro Musical"
  }
];

export const TEMAS_EMOCIONES = [
  { id: "todos", nombre: "Todas las Canciones", icono: "🎨", color: "#64748b" },
  { id: "amor", nombre: "Amor y Cariño", icono: "❤️", color: "#ec4899" },
  { id: "paz", nombre: "Paz y Tranquilidad", icono: "🕊️", color: "#06b6d4" },
  { id: "protesta", nombre: "Valentía y Rebeldía", icono: "🔥", color: "#f59e0b" },
  { id: "naturaleza", nombre: "Naturaleza y Sueños", icono: "🌿", color: "#10b981" },
  { id: "reflexion", nombre: "Reflexión y Misterio", icono: "🌌", color: "#8b5cf6" }
];

export const ARTISTAS = [
  {
    id: "banda-educativa",
    nombre: "Banda Educativa",
    estilo: "Música Infantil y Didáctica",
    descripcion: "Melodías y canciones creadas para aprender figuras literarias, poesía y gramática de forma divertida.",
    imagen: "🎸",
    color: "#f59e0b"
  },
  {
    id: "poesia-clasica",
    nombre: "Poesía Clásica Popular",
    estilo: "Poesía Tradicional Adaptada",
    descripcion: "Grandes poemas y rimas del dominio público adaptados a la música para niños y niñas.",
    imagen: "🌙",
    color: "#8b5cf6"
  }
];

export const DICCIONARIO_RAE = {
  mimbre: {
    palabra: "Mimbre",
    definicion: "Tallo de un arbusto flexible y resistente que se usa para tejer cestas y muebles. Se puede doblar sin romperse.",
    ejemplo: "Las cestas de mimbre se doblan fácilmente."
  },
  abriles: {
    palabra: "Abriles",
    definicion: "Usado poéticamente para contar los años de vida o las primaveras vividas.",
    ejemplo: "Ya han pasado muchos abriles desde que era pequeño."
  },
  desbocado: {
    palabra: "Desbocado",
    definicion: "Que avanza a toda velocidad, sin freno y con mucha fuerza.",
    ejemplo: "El río bajaba desbocado tras la tormenta."
  },
  zurcir: {
    palabra: "Zurcir",
    definicion: "Coser un roto o desgarro en una prenda con puntadas muy finas.",
    ejemplo: "Mi abuela zurció el agujero de mi calcetín favorito."
  },
  jergón: {
    palabra: "Jergón",
    definicion: "Colchón antiguo o sencillo lleno de paja o lana.",
    ejemplo: "En la cabaña del bosque dormían en un cómodo jergón."
  },
  nardos: {
    palabra: "Nardos",
    definicion: "Flores de color blanco puro que huelen muy bien y suave.",
    ejemplo: "Las flores de nardo desprenden un gran perfume por la noche."
  },
  polisón: {
    palabra: "Polisón",
    definicion: "Vestido antiguo con forma abombada que se usaba en la espalda.",
    ejemplo: "Los vestidos de cuento antiguo solían llevar polisón."
  },
  cimientos: {
    palabra: "Cimientos",
    definicion: "La base de piedra o hormigón que sostiene una casa o edificio para que no se caiga.",
    ejemplo: "Los cimientos mantienen firme el edificio."
  },
  fragua: {
    palabra: "Fragua",
    definicion: "Taller donde el herrero calienta el hierro al fuego para darle forma.",
    ejemplo: "En la fragua salen chispas al golpear el hierro."
  }
};

export const CANCIONES = [
  {
    id: "el-rio-del-tiempo",
    titulo: "El Río del Tiempo",
    artistaId: "banda-educativa",
    artistaNombre: "Banda Educativa",
    album: "Detectives Poéticos (2024)",
    temaId: "amor",
    temaNombre: "Naturaleza y Reflexión",
    youtubeId: "",
    audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    resumen_didactico: "Una canción educativa sobre cómo el tiempo fluye suavemente y las emociones nos enseñan a crecer.",
    versos: [
      {
        linea: 1,
        estrofaNum: 1,
        texto: "El tiempo es un río suave que avanza sin descansar,",
        tiempoInicio: 5.0,
        tiempoFin: 12.0,
        palabrasDificiles: [],
        preguntaComprension: "¿Por qué se dice que el tiempo es un río suave?",
        opcionesComprension: [
          { id: "a", texto: "Porque avanza continuamente sin detenerse, como el agua de un río.", correcta: true },
          { id: "b", texto: "Porque necesitas un barco de verdad para medir la hora.", correcta: false }
        ],
        figuraId: "metafora",
        figuraNombre: "Metáfora",
        explicacion: "Compara el tiempo directamente con un río para explicar cómo fluye continuamente.",
        pista: "Fíjate en cómo dice que el tiempo ES un río."
      },
      {
        linea: 2,
        estrofaNum: 1,
        texto: "brillando como una estrella en medio del ancho mar.",
        tiempoInicio: 12.1,
        tiempoFin: 18.0,
        palabrasDificiles: [],
        preguntaComprension: "¿Cómo brilla la luz según este verso?",
        opcionesComprension: [
          { id: "a", texto: "Como una estrella radiante que guía a los navegantes.", correcta: true },
          { id: "b", texto: "Como una linterna apagada.", correcta: false }
        ],
        figuraId: "simil",
        figuraNombre: "Símil o Comparación",
        explicacion: "Utiliza la palabra 'como' para comparar el brillo con una estrella.",
        pista: "Busca la palabra 'como'."
      },
      {
        linea: 3,
        estrofaNum: 1,
        texto: "El viento le canta historias al árbol del callejón,",
        tiempoInicio: 18.1,
        tiempoFin: 24.0,
        palabrasDificiles: [],
        preguntaComprension: "¿Qué hace el viento en esta imagen poética?",
        opcionesComprension: [
          { id: "a", texto: "Se comporta como si fuera una persona que canta historias al árbol.", correcta: true },
          { id: "b", texto: "Tira todas las hojas al suelo sin decir nada.", correcta: false }
        ],
        figuraId: "personificacion",
        figuraNombre: "Personificación",
        explicacion: "Le da al viento la capacidad humana de cantar e inventar historias.",
        pista: "¿Los vientos pueden cantar de verdad?"
      },
      {
        linea: 4,
        estrofaNum: 1,
        texto: "y el corazón se despierta lleno de fe y de ilusión.",
        tiempoInicio: 24.1,
        tiempoFin: 30.0,
        palabrasDificiles: [],
        preguntaComprension: "¿Qué siente la persona al escuchar la melodía?",
        opcionesComprension: [
          { id: "a", texto: "Siente alegría y entusiasmo por seguir aprendiendo.", correcta: true },
          { id: "b", texto: "Siente ganas de quedarse dormida inmediatamente.", correcta: false }
        ],
        figuraId: "metafora",
        figuraNombre: "Metáfora",
        explicacion: "Decir que el corazón despierta simboliza sentirse motivado y alegre.",
        pista: "El corazón se despierta de alegría."
      }
    ]
  },
  {
    id: "la-luna-en-el-agua",
    titulo: "La Luna en el Agua",
    artistaId: "poesia-clasica",
    artistaNombre: "Poesía Clásica Popular",
    album: "Rimas del Viento",
    temaId: "naturaleza",
    temaNombre: "Naturaleza y Sueños",
    youtubeId: "",
    audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    resumen_didactico: "Un poema místico del dominio público adaptado donde la luna cobra vida e ilumina la noche.",
    versos: [
      {
        linea: 1,
        estrofaNum: 1,
        texto: "La luna vino al estanque con su vestido de plata,",
        tiempoInicio: 4.0,
        tiempoFin: 10.0,
        palabrasDificiles: ["nardos", "polisón"],
        preguntaComprension: "¿Qué está haciendo la luna en esta imagen?",
        opcionesComprension: [
          { id: "a", texto: "Se la imagina vistiendo traje de plata y caminando de visita.", correcta: true },
          { id: "b", texto: "Caen piedras dentro de la piscina.", correcta: false }
        ],
        figuraId: "personificacion",
        figuraNombre: "Personificación",
        explicacion: "Trata a la luna como si fuera una persona vestida elegantemente.",
        pista: "La luna lleva vestido de plata."
      },
      {
        linea: 2,
        estrofaNum: 1,
        texto: "mirando el agua serena donde la noche descansa.",
        tiempoInicio: 10.1,
        tiempoFin: 16.0,
        palabrasDificiles: [],
        preguntaComprension: "¿Qué transmite el estanque de agua?",
        opcionesComprension: [
          { id: "a", texto: "Paz, tranquilidad y reflejo del cielo nocturno.", correcta: true },
          { id: "b", texto: "Mucho ruido y olas agitadas.", correcta: false }
        ],
        figuraId: "personificacion",
        figuraNombre: "Personificación",
        explicacion: "Habla de la noche descansando en el agua como si reposara serenamente.",
        pista: "¿La noche puede descansar?"
      }
    ]
  },
  {
    id: "el-viento-y-las-hojas",
    titulo: "El Viento y las Hojas",
    artistaId: "banda-educativa",
    artistaNombre: "Banda Educativa",
    album: "Melodías Literarias (2024)",
    temaId: "reflexion",
    temaNombre: "Reflexión y Misterio",
    youtubeId: "",
    audioPreviewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    resumen_didactico: "Una canción didáctica sobre aprender a dejarse llevar por los aprendizajes como hojas al viento.",
    versos: [
      {
        linea: 1,
        estrofaNum: 1,
        texto: "Se dejó llevar por la brisa, volando hacia el horizonte...",
        tiempoInicio: 3.5,
        tiempoFin: 9.5,
        palabrasDificiles: [],
        preguntaComprension: "¿Qué significa 'dejarse llevar por la brisa'?",
        opcionesComprension: [
          { id: "a", texto: "Tener confianza y fluir con alegría ante los nuevos descubrimientos.", correcta: true },
          { id: "b", texto: "Usar un paraguas muy grande en un día sin viento.", correcta: false }
        ],
        figuraId: "metafora",
        figuraNombre: "Metáfora",
        explicacion: "Compara el proceso de aprendizaje y vida con el vuelo suave de una hoja en la brisa.",
        pista: "Pensar en fluir con el viento."
      }
    ]
  }
];

export const MOCK_SUGERENCIAS_FAMILIARES = [
  {
    id: 1,
    propuestoPor: "Tu Hija (9 años)",
    cancion: "El Viento y las Hojas",
    artista: "Banda Educativa",
    motivo: "¡Dice que 'la brisa canta una canción'! Creo que hay una personificación genial.",
    fecha: "Hoy",
    meGusta: 5
  },
  {
    id: 2,
    propuestoPor: "Mamá",
    cancion: "La Luna en el Agua",
    artista: "Poesía Clásica Popular",
    motivo: "La luna tiene vestido de plata como una reina. Es perfecta para explicar la personificación.",
    fecha: "Ayer",
    meGusta: 8
  }
];
