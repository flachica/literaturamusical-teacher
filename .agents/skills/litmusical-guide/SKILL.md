---
name: litmusical-guide
description: Guía de arquitectura, memoria de proyecto y protocolo de sesiones con IA para la app LitMusical (enseñanza de figuras literarias con música para niños). Usar en cada sesión para reanudar o cerrar el desarrollo.
---

# LitMusical - Guía de Proyecto y Protocolo de Sesiones e Iteraciones 🎵📚

## 🎯 Visión del Proyecto
**LitMusical** es una aplicación web gamificada y local-first diseñada para que una niña de 9 años aprenda a reconocer, interpretar y disfrutar de las figuras literarias (metáforas, hipérboles, anáforas, personificaciones...) a través de canciones educativas, poesía adaptada y música didáctica.

---

## 🔄 Protocolo Obligatorio para Sesiones e Iteraciones con la IA

> **Estructura de Trabajo:** Una **Sesión** se compone de varias **Iteraciones**. Cada iteración resuelve un incremento concreto de desarrollo (ej. Iteración 1: Prototipo visual v0.1.0, Iteración 2: Conexión de clics en versos v0.1.1).

### 1. Protocolo de INICIO DE SESIÓN / ITERACIÓN
Cuando una IA inicie una nueva sesión o iteración en este repositorio, DEBE ejecutar los siguientes pasos en orden:
1. **Cargar esta Skill:** Leer este archivo `SKILL.md` con `view_file`.
2. **Revisar el Backlog:** Leer el archivo [`BACKLOG.md`](../../BACKLOG.md).
3. **Rescatar la Memoria:** Identificar el número de Sesión, la Iteración actual y el hito de versión/subversión alcanzado.
4. **Validación Socrática:** Confirmar con el usuario el objetivo específico de la iteración actual antes de escribir código.


### 2. Protocolo de TRABAJO Y DESARROLLO
- **Principio Pedagógico Clave (Comprensión Primero):** Lo más importante para la niña es **entender el significado de la letra** antes de etiquetar la figura retórica. El flujo didáctico debe ser:
  1. *Escuchar y Leer la estrofa.*
  2. *Reto de Comprensión:* ¿Qué intenta decirnos el poeta aquí?
  3. *Etiquetar la Figura:* Una vez comprendida la historia, identificar si es Metáfora, Símil, etc.
- **Separación de Vistas (Modo Detective vs. Modo Admin):**
  - **Modo Detective (Para la niña):** Interfaz limpia, minimalista y guiada paso a paso por una sola canción sin sobrecargar la pantalla.
  - **Modo Admin / Padres:** Panel para gestionar canciones, ver sugerencias del buzón familiar y configurar la IA.
- **Visualizador de Ondas Musicales (Waveform Scrubber):** La música y las estrofas se leen y escuchan en sincronía. La niña puede desplazar un cursor horizontal sobre las ondas musicales para navegar por la canción, escuchando fragmentos y activando el verso correspondiente.
- **Diccionario Integrado (RAE / Palabras difíciles):** Herramienta integrada para hacer clic en palabras complejas (*mimbre, nardos, polisón, cimientos*) y desplegar su definición infantil.
- **Persistencia Local-First:** Progreso de puntos/estrellas y catálogo dinámico persistido en `LocalStorage` con importación/exportación JSON.

- **Idioma de Commits en Git:** Todos los mensajes de commit de Git DEBEN redactarse siempre en el idioma del usuario (**Español**). Ejemplo: `git commit -m "feat: prototipo v0.1.2 con Modo Detective, RAE y Ondas Musicales"`.
- **Debate Socrático & SDD:** Toda decisión técnica o funcional importante debe discutirse brevemente usando un enfoque SDD.

- **Enfoque de Desarrollo y Delegación de Pruebas:** 
  * Priorizar pasos de bebé extremadamente pequeños e incrementales (*babysteps*).
  * **Delegación de Pruebas:** La IA no ejecutará pruebas ni verificaciones de funcionamiento en la aplicación; el agente delegará al usuario la tarea de arrancar, usar e inspeccionar la aplicación para verificar los cambios.



### 3. Protocolo de CIERRE DE SESIÓN Y MEMORIA LOCAL
Al finalizar una sesión o antes de pausar el desarrollo:
1. **Verificación de Memoria Local:** Garantizar que las decisiones de arquitectura y la memoria de hito quedan guardadas localmente en este archivo `.agents/skills/litmusical-guide/SKILL.md` y en [`BACKLOG.md`](../../BACKLOG.md).
2. **Actualizar `BACKLOG.md`:** Registrar la Sesión como CERRADA, listar las iteraciones completadas en la sesión y marcar el número de versión/subversión alcanzado.
3. **Resumen de Estado:** Indicar claramente el punto de entrada para la próxima sesión (ej. Sesión 3 → Iteración 5 / `v0.3.0`).


---

## 🏛️ Decisiones de Arquitectura e Iniciativas

### ✅ Iniciativas Aprobadas
- **Frontend SPA Gamificado:** React + Vite con interfaz neón/vibrante tipo "Escuela de Detectives Literarios".
- **Lyric Highlighter:** Resaltador de versos interactivo con explicaciones adaptadas a 9 años.
- **Modo Detective Proactivo:** Botón para marcar descubrimien### 🛠️ Protocolo de Carga de Canciones Educativas (Audio Local y Karaoke API)
Cuando el usuario o la IA soliciten cargar o sincronizar una nueva canción educativa en el catálogo:

1. **Obtención de Letras y Timestamps Oficiales (LRCLIB Karaoke API):**
   - **NUNCA** hacer web scraping ni adivinar marcas de tiempo a ojo.
   - Consultar la **API abierta y gratuita de Karaoke LRCLIB**: `https://lrclib.net/api/search?q=ARTISTA+TITULO` (o Endpoint `/api/get`).
   - **Aprendizaje Clave de Desambiguación:** Al seleccionar los marcadores LRC de la API, verificar que corresponden a la **versión de estudio oficial del álbum** (ej. `28.87s` para Fito) y no a versiones de directo/teatro (ej. `39.81s`), para evitar desfases con el audio.
   - Extraer la propiedad `syncedLyrics` que contiene las marcas de tiempo oficiales LRC `[mm:ss.xx]` exactas al milisegundo.
   - Convertir los marcadores `[mm:ss.xx]` a segundos (`tiempoInicio` y `tiempoFin`) para la sincronización perfecta del reproductor HTML5.

2. **Descarga de Audio Local Segura (Audio Puro WebM/M4A & Protección en Git):**
   - El plugin backend `jsonStoragePlugin` en `vite.config.js` provee `/api/download-audio`.
   - **Formato de Audio Puro:** Usar siempre `-f "251/249/140/139/ba"` para descargar únicamente corrientes de sonido en `.webm` (Opus) o `.m4a` (AAC) compatibles al 100% con `<audio>` HTML5 y Web Audio API. (Evitar formatos de vídeo `.mp4` 18).
   - Invocación de `yt-dlp` con banderas de vídeo único y anti-403: `yt-dlp --no-playlist -f "251/249/140/139/ba" -o "public/audio/<id>.<ext>" "<url-o-busqueda>"`.
   - **Regla Legal e Integridad de Git:** Los archivos de audio (`*.webm`, `*.m4a`, `*.mp3`, `public/audio/*`) **NUNCA deben subirse a Git**. Estrictamente incluidos en `.gitignore`.

3. **Formulario Wizard en 3 Pasos Secuenciales (Ahorro de Espacio Vertical):**
   - Paso 1: Únicamente búsqueda de Letra (LRCLIB Karaoke API).
   - Paso 2: Vincular / Convertir Audio (YouTube o MP3 local).
   - Paso 3: Categoría de Emoción Didáctica & Guardado Final.
   - **Criterio UX Global:** Todos los campos de entrada de texto deben responder a la tecla `ENTER` ejecutando la acción correspondiente sin recargar la página.

4. **Componente de Confirmación Flotante (`ConfirmModal.jsx`):**
   - Sin diálogos nativos del navegador (`window.confirm`). Diálogos emergentes integrados con estética dark-glassmorphism.

### ❌ Iniciativas Descartadas
- **Integración con Spotify:** Descartada definitivamente para evitar dependencias de API o cuentas externas.
- **Addon de Odoo:** Descartada definitivamente para priorizar una arquitectura ligera, portable y local-first.

---

## 📌 Hoja de Ruta de Subversiones
- **v0.1.0:** Prototipo Visual e Interactivo (Maqueta visual completa con datos simulados).
- **v0.1.1:** Interactividad dinámica de versos y cambio de canciones.
- **v0.1.2:** Motor de preguntas/respuestas de la Trivia de Detectives y puntos.
- **v0.2.0 / v0.2.1:** Persistencia Local-First (archivos JSON y LocalStorage) + Editor de canciones. [COMPLETADO - SESIÓN 2]
- **v0.2.9 / v0.2.9c:** Refactorización Karaoke HTML5, Versos Sincronizados, Auto-Scroll Aislado, Tono Respetuoso 9 Años, Menú Hamburguesa Compacto, Navegación de Estrofas y Reproducción Focalizada. [COMPLETADO CON ÉXITO - SESIÓN 3]
- **v0.2.10:** Scrubber sin retardo (`isDraggingRef`), Temporizador ⏱️ en cabecera superior centrada, Karaoke continuo por estrofas/versos conjuntos en panel izquierdo, descarga de audio local segura (`yt-dlp` + `deno` ignorada en git) e integración con LRCLIB Karaoke API (47 versos de Marea Corazón de Mimbre). [COMPLETADO CON ÉXITO - SESIÓN 4]
- **v0.2.11:** Conversor de YouTube a MP3 local en backend (`yt-dlp` con banderas anti-403), Formulario Wizard en 3 pasos con tecla `ENTER`, indicador visual de trabajo para padres, retorno rápido a Modo Detective y `ConfirmModal.jsx` integrado. [COMPLETADO CON ÉXITO - SESIÓN 4]
- **v0.2.12:** Fortalecimiento de Arquitectura Local-First con persistencia de metadatos de YouTube, comprobación de existencia física de audios en backend, estado de disponibilidad en tarjetas de Modo Admin, y herramientas de recuperación/reparación individual y global de audios desde YouTube. [COMPLETADO CON ÉXITO - SESIÓN 5]
- **v0.2.13:** Refactorización de Arquitectura y Componetización (Desacoplar App.jsx mediante hooks personalizados como useAudioPlayer y useLocalCatalog). [COMPLETADO CON ÉXITO - SESIÓN 5]
- **v0.2.14:** Iteración de Usabilidad y Diccionario Editable (Rediseño visual, diccionario editable, modal para Arquitectura y reflexión sobre el multi-detective). [COMPLETADO CON ÉXITO - SESIÓN 6]
- **v0.3.0:** Persistencia Activa e Indicador Multi-Detective (Gestión y almacenamiento multi-perfil, avatar en navbar, refinamiento de teclado Esc/Enter en todos los modales y catálogo limpio sin canciones de prueba para producción). [COMPLETADO CON ÉXITO - SESIÓN 6]
- **v0.3.1:** Iteración de Usabilidad: Optimización del Modo Detective Guiado (Visualizador de ondas, scroll y tipografías infantiles) + Corrección de error 403 en descargas de listas de reproducción. [PLANIFICADO]
- **v0.4.0:** Gamificación Avanzada "Escuela de Detectives" (Rangos, Logros persistidos en LocalStorage, Audio Feedback sintetizado con Web Audio API). [PLANIFICADO]
- **v0.5.0:** Modo Detective Proactivo (Buzón Familiar, sugerencia de figuras de la niña). [PLANIFICADO]
- **v0.6.0:** Asistente de Comprensión con IA Local (Conexión Ollama, prompt system didáctico, botón generar retos, fallback offline). [PLANIFICADO]

---

### ⚠️ Incidencias de la Sesión y Fallos por Resolver
- **Fallo 403 de yt-dlp (YouTube)**:
  * **Problema**: YouTube devuelve 403 al pasarle URLs con parámetros de listas de reproducción (`&list=...` o similar) porque `yt-dlp` intenta descargar la información de la playlist y esto gatilla las protecciones contra scraping de YouTube.
  * **Solución acordada**: Sanitizar el enlace en el middleware backend en `vite.config.js` (`/api/download-audio`), extrayendo el ID de 11 caracteres y recomponiendo la URL como un enlace de vídeo directo `https://www.youtube.com/watch?v=VIDEO_ID` antes de ejecutar `yt-dlp`.

