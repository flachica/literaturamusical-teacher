export const FIGURAS_LITERARIAS = [
  {
    id: "metafora",
    nombre: "Metáfora",
    icono: "✨",
    color: "#8b5cf6", // Purple
    definicion_infantil: "Comparar dos cosas diciendo que una ES la otra, sin usar la palabra 'como'. ¡Un truco de magia con palabras!",
    ejemplo_rapido: "«Su corazón era de mimbre» (Es flexible y resistente).",
    puntos_detective: 100,
    badge: "🔮 Maestro de la Metáfora"
  },
  {
    id: "simil",
    nombre: "Símil o Comparación",
    icono: "🪞",
    color: "#06b6d4", // Cyan
    definicion_infantil: "Comparar dos cosas usando palabras mágicas como 'como', 'parece' o 'igual que'.",
    ejemplo_rapido: "«Brilla como una estrella en el cielo»",
    puntos_detective: 80,
    badge: "🔍 Ojo de Águila del Símil"
  },
  {
    id: "personificacion",
    nombre: "Personificación",
    icono: "🦊",
    color: "#ec4899", // Pink
    definicion_infantil: "Dar vida humana a objetos, plantas o animales (decir que ríen, cantan o sueñan).",
    ejemplo_rapido: "«El viento susurraba secretos a la luna»",
    puntos_detective: 90,
    badge: "🌟 Encantador de Objetos"
  },
  {
    id: "hiperbole",
    nombre: "Hipérbole",
    icono: "🚀",
    color: "#f59e0b", // Gold
    definicion_infantil: "¡Una gran exageración para llamar la atención o transmitir emoción súper fuerte!",
    ejemplo_rapido: "«Te lo he dicho un millón de veces»",
    puntos_detective: 85,
    badge: "💥 Gigante del Ritmo"
  },
  {
    id: "anafora",
    nombre: "Anáfora",
    icono: "🔁",
    color: "#10b981", // Emerald
    definicion_infantil: "Repetir la misma palabra al principio de varios versos para crear un eco musical.",
    ejemplo_rapido: "«Llora la noche, llora el viento, llora mi voz»",
    puntos_detective: 75,
    badge: "🎵 Eco Poético"
  },
  {
    id: "aliteracion",
    nombre: "Aliteración",
    icono: "🔔",
    color: "#3b82f6", // Blue
    definicion_infantil: "Repetir sonidos o letras varias veces para que la canción suene a lo que describe.",
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
    estilo: "Rock Poético Nacional",
    descripcion: "Grupo navarro célebre por la gran riqueza poética e imágenes metafóricas de sus letras compuestas por el poeta.",
    imagen: "🎸",
    color: "#f59e0b"
  },
  {
    id: "lorca",
    nombre: "Federico García Lorca",
    estilo: "Poesía Flamenca y Adaptaciones",
    descripcion: "Uno de los poetas más grandes de España, cuyos versos han sido musicalizados por muchísimos artistas.",
    imagen: "🌙",
    color: "#8b5cf6"
  },
  {
    id: "banda-educativa",
    nombre: "Banda Educativa",
    estilo: "Indie Rock en Español",
    descripcion: "Música llena de metáforas visuales, personificaciones y juegos literarios modernos.",
    imagen: "⛵",
    color: "#06b6d4"
  }
];

export const DICCIONARIO_RAE = {
  mimbre: {
    palabra: "Mimbre",
    definicion: "Tallo de un arbusto flexible y resistente que se usa para tejer cestas y muebles. Se puede doblar sin romperse.",
    ejemplo: "Las cestas de mimbre se doblan fácilmente."
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
    album: "Revolcón (2000)",
    temaId: "amor",
    temaNombre: "Amor y Valentía",
    spotifyTrackId: "4jV6vG6q8m5p2Jk1P8qJ85",
    youtubeId: "R9K-xL_b_kM",
    audioPreviewUrl: "",
    resumen_didactico: "Una canción preciosa sobre un corazón sensible que sabe resistir los golpes de la vida.",
    versos: [
      {
        linea: 1,
        texto: "Le dije que su corazón era de mimbre,",
        palabrasDificiles: ["mimbre"],
        preguntaComprension: "¿Qué significa decir que un corazón 'es de mimbre'?",
        opcionesComprension: [
          { id: "a", texto: "Que es flexible y fuerte: se dobla cuando sufre pero no se rompe.", correcta: true },
          { id: "b", texto: "Que está hecho de madera dura y fría como una mesa.", correcta: false },
          { id: "c", texto: "Que es un corazón muy pequeño y viejo.", correcta: false }
        ],
        figuraId: "metafora",
        figuraNombre: "Metáfora",
        explicacion: "Compara el corazón con el mimbre: no es duro como la piedra, sino flexible y fuerte.",
        pista: "¿De qué material está hecho el corazón en la canción?"
      },
      {
        linea: 2,
        texto: "brillando como un faro en la tormenta.",
        palabrasDificiles: [],
        preguntaComprension: "¿Qué hace la mirada de la persona según el poema?",
        opcionesComprension: [
          { id: "a", texto: "Guía y da luz y esperanza en medio de la oscuridad.", correcta: true },
          { id: "b", texto: "Provoca truenos y lluvia fuerte.", correcta: false }
        ],
        figuraId: "simil",
        figuraNombre: "Símil o Comparación",
        explicacion: "Usa la palabra 'COMO' para comparar la mirada con la luz de un faro.",
        pista: "Fíjate en la palabra clave 'como'."
      }
    ]
  },
  {
    id: "romance-luna-luna",
    titulo: "Romance de la Luna, Luna",
    artistaId: "lorca",
    artistaNombre: "Federico García Lorca / Camarón",
    album: "Romancero Gitano",
    temaId: "naturaleza",
    temaNombre: "Naturaleza y Sueños",
    spotifyTrackId: "4jVl2N4w1T2459Dq8B237X",
    youtubeId: "kYJv8Z1kK8U",
    audioPreviewUrl: "",
    resumen_didactico: "Un poema místico donde la luna cobra vida y visita un taller de noche.",
    versos: [
      {
        linea: 1,
        texto: "La luna vino a la fragua con su polisón de nardos.",
        palabrasDificiles: ["fragua", "polisón", "nardos"],
        preguntaComprension: "¿Qué está haciendo la luna en esta escena?",
        opcionesComprension: [
          { id: "a", texto: "Llega vestida con flores como si fuera una mujer caminando.", correcta: true },
          { id: "b", texto: "Cae del cielo y rompe el tejado de la casa.", correcta: false }
        ],
        figuraId: "personificacion",
        figuraNombre: "Personificación",
        explicacion: "Le da a la luna cualidades humanas como caminar y vestir ropa.",
        pista: "¿La luna puede vestirse de verdad?"
      }
    ]
  },
  {
    id: "el-rio-del-tiempo",
    titulo: "El Río del Tiempo",
    artistaId: "banda-educativa",
    artistaNombre: "Banda Educativa",
    album: "Un Día en el Mundo (2008)",
    temaId: "reflexion",
    temaNombre: "Reflexión y Misterio",
    spotifyTrackId: "3d74yP3g7D8vH4L60u6X5S",
    youtubeId: "R234w7R314w",
    audioPreviewUrl: "",
    resumen_didactico: "Una canción icónica sobre dejarse llevar por los acontecimientos de la vida como una banda-educativa.",
    versos: [
      {
        linea: 1,
        texto: "Se dejó llevar por la banda-educativa, a la deriva...",
        palabrasDificiles: [],
        preguntaComprension: "¿Qué intenta transmitir decir 'dejarse llevar por la banda-educativa'?",
        opcionesComprension: [
          { id: "a", texto: "Aceptar los cambios y dejarse fluir con la vida.", correcta: true },
          { id: "b", texto: "Nadar en el mar con salvavidas.", correcta: false }
        ],
        figuraId: "metafora",
        figuraNombre: "Metáfora",
        explicacion: "Compara las circunstancias de la vida con las corrientes del mar.",
        pista: "Pensar en dejarse fluir."
      }
    ]
  }
];


export const MOCK_SUGERENCIAS_FAMILIARES = [
  {
    id: 1,
    propuestoPor: "Tu Hija (9 años)",
    cancion: "El Río del Tiempo",
    artista: "Banda Educativa",
    motivo: "¡Dice que 'se dejó llevar por la banda-educativa'! Creo que hay una metáfora genial.",
    fecha: "Hoy",
    meGusta: 5
  },
  {
    id: 2,
    propuestoPor: "Mamá",
    cancion: "La leyenda del tiempo",
    artista: "Camarón / Lorca",
    motivo: "El sueño va sobre el tiempo flotando como un velero. Es perfecta para explicar el símil.",
    fecha: "Ayer",
    meGusta: 8
  }
];
