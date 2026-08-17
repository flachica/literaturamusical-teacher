# 📋 BACKLOG DE INICIATIVAS Y VERSIONES - LitMusical (Versión v1.0.0 Final Alanzada)

Documento de seguimiento del desarrollo interactivo de **LitMusical** estructurado mediante la metodología **Impact-Driven Growth (IDG)** para garantizar que cada entrega genere cambios reales de comportamiento (*outcomes*) y valor en el aprendizaje pedagógico.

---

## 📍 ESTADO ACTUAL DEL PROYECTO

* **Sesión Actual**: 🟢 **SESIÓN 11 (CERRADA - HITO v1.1.0 ALCANZADO)**
* **Subversión Alcanzada**: `v1.1.0` (Arquitectura de Plugins Storage Intercambiables desacoplada en `vite.config.js` y repositorio público de prueba vacía `literaturamusical-lessons-sample`).
* **Fallo Pendiente de Solucionar**: Ninguno.
* **Métrica Clave del Reto (CPVM)**: 
  $$\text{CPVM} = [\text{Retos de figuras literarias resueltos con éxito}] + [\text{por la niña de forma autónoma}]$$
* **Estado Final**: Aplicación PWA Local-First completa con empaquetado offline, catálogo dinámico, edición en caliente y copias de seguridad JSON.

---

## 🗓️ HOJA DE RUTA DETALLADA POR SUBVERSIONES (ROADMAP IDG)

### 🎨 `v0.1.0` - `v0.2.12` (COMPLETADAS)
* Prototipo visual interactivo, modo detective vs. modo admin, visualizador de ondas neón, catálogo local, wizard de 3 pasos para añadir canciones y extractor de MP3 desde YouTube con control anti-403 en servidor local.

### 🏗️ `v0.2.13` - Refactorización de Arquitectura y Componetización (COMPLETADA - SESIÓN 5)
* **Objetivo**: Reducir el acoplamiento y el tamaño de `App.jsx` dividiéndolo en hooks personalizados independientes.
* **Entregables**:
  * Hook `useAudioPlayer` para encapsular todo el estado de sincronización, temporizador, reproducción y seek del widget de música.
  * Hook `useLocalCatalog` para encapsular la carga inicial de disco, verificación física de audios en caliente y guardado de canciones y figuras.
  * Simplificación de `App.jsx` para que actúe únicamente como router y orquestador minimalista de la interfaz.

---

### 🛠️ `v0.2.14` - Iteración de Usabilidad y Diccionario Editable (COMPLETADA - SESIÓN 6)
* **Objetivo**: Pulir la interfaz de administración para reducir el ruido visual, permitir editar figuras literarias y trasladar información técnica a modales.
* **Entregables**:
  * Integración de las pestañas de administración en la Navbar superior al lado del botón "Volver al Juego", eliminando el selector interno del cuerpo de la pantalla.
  * Limpieza del catálogo de canciones: eliminación del banner redundante y de la insignia permanente de IA. Unificación de botones en una barra de herramientas minimalista e inteligente (el botón de reparación solo aparece si hay audios perdidos).
  * Rediseño del formulario Wizard para añadir canciones: cristal translúcido suave en lugar de bordes naranjas llamativos, y un selector rápido interactivo para las temáticas/emociones poéticas en lugar del desplegable plano.
  * Refinamiento estético y de legibilidad de las tarjetas de canciones: tipografía un 20% más grande y elegante, mejores interlineados, efecto de elevación suave (hover) y papelera de borrado atenuada que solo brilla en rojo cuando el cursor pasa por encima.
  * Implementación de la **edición en caliente** del Diccionario de Figuras Poéticas (`FigureCatalog.jsx`) en Modo Admin mediante un modal interactivo que permite modificar la definición, el icono emoji, el consejo y los puntos de detective asociados.

---

### 👥 `v0.3.0` - Persistencia Activa e Indicador Multi-Detective (COMPLETADA - SESIÓN 6)
* **Objetivo**: Permitir que múltiples niños puedan jugar de forma independiente en el mismo dispositivo, gestionando sus propios puntos, estrellas y niveles con nombres y avatares personalizados.
* **Entregables**:
  * Implementación del almacén de datos multidetective en `storage.js` y `useLocalCatalog.js` con migración transparente del progreso previo de la niña "Valeria".
  * Integración en el panel de **Ajustes** de la administración de perfiles: visualización en cuadrícula de los detectives registrados con sus estadísticas individuales, adición de nuevos perfiles con selector de emoji y renombrado/eliminación en caliente.
  * Visualización dinámica del avatar emoji y el nombre del detective activo actual en la barra de estadísticas de la Navbar para feedback directo de la niña durante el juego.
  * Refinamiento de accesibilidad: captura global de la tecla `Esc` para cancelar/cerrar y `Enter` para confirmar la opción por defecto en todos los modales de la aplicación (ConfirmModal, Selector de Detectives, Editor de Figuras y Advertencia de Letra).
  * Limpieza de catálogo para producción: eliminación de canciones de prueba por defecto en `initialData.js` y `songs_catalog.json` para entregar la base de datos limpia y vacía, arreglando el bucle de recreación de canciones vacías en `storage.js` e implementando una interfaz guiada para catálogo vacío en `App.jsx`.

---

### 🔍 `v0.3.1` - Iteración de Usabilidad: Optimización del Modo Detective Guiado (COMPLETADA - SESIÓN 7)
* **Objetivo**: Mejorar la experiencia interactiva del juego para la niña de 9 años, asegurando que el flujo didáctico sea fluido y sin distracciones.
* **Entregables**:
  * Ajustes en la interfaz del visualizador de ondas y scroll de letras: se optimizó el seek del scrubber de música en `PlayerWidget.jsx` para evitar ruidos de buffer y desfases al arrastrar en caliente. El panel de lectura completa/karaoke mantiene la coherencia visual con scroll suave.
  * Simplificación del flujo de la trivia de comprensión de letras: se sustituyó el avance temporal automático tras responder por un panel de éxito que felicita a la detective y un botón explícito de avance al Paso 3 para guiar a la niña a su propio ritmo.
  * Ajuste de tipografías y espaciados generales: se incrementó el tamaño de la letra de los versos que avanzan con la música en la columna izquierda de karaoke (activo a `1.25rem`, inactivos a `1.05rem` con mayor padding). La estrofa del reto (columna derecha) se mantiene como un bloque poético uniforme de `1.25rem` sin señalamiento del verso actual, delegando esa interacción a la columna del karaoke.
  * Corrección en el Importador de Letras de la API: se modificó el parser de letras de LRCLIB en `SongManager.jsx` para tolerar marcas de tiempo sin decimales y filtrar líneas vacías o instrumentales, evitando la inyección de versos en blanco en la trivia.
  * Resolución definitiva del error 403 de YouTube: se incorporó el extractor remoto de JS `--remote-components ejs:github` y la combinación de clientes `--extractor-args "youtube:player_client=web_embedded,android"` en `vite.config.js` para evitar el bloqueo del tráfico de descarga de audio.

---

### 🏆 `v0.4.0` - Gamificación Avanzada "Escuela de Detectives" (COMPLETADA - SESIÓN 8)

> 🧪 **Hipótesis Causal**:
> **Si** implementamos rangos de progreso de detective, placas visuales de logros y efectos de sonido interactivos autogenerados,
> **Provocará** que la niña acceda a la app con más frecuencia semanal de forma voluntaria y use más el diccionario didáctico,
> **Moviendo** la CPVM de retos resueltos autónomamente y consolidando su comprensión literaria.

* **Entregables**:
  * **Rangos de Detective**: Se implementó una escala de progresión basada en la puntuación acumulada del detective activo. El rango actual (Novato 🔍, Ayudante 🧥, Inspector 🕵️‍♀️, Súper de Oro 🏆) se muestra en una insignia dinámica en la Navbar junto a su avatar y nombre.
  * **Álbum de Placas y Logros**: Se diseñó una mochila visual de detective en la columna izquierda que sigue el progreso en tiempo real de 4 logros didácticos:
    * 📖 *Placa del Lector*: 5 consultas al diccionario RAE.
    * 🦊 *Oído de Lince*: Escuchar estrofas individuales 10 veces en el karaoke.
    * ✨ *Racha Poética*: Responder 3 trivias de comprensión de textos seguidas sin fallar.
    * 🎵 *Melómano*: Resolver versos en al menos 3 canciones diferentes del catálogo.
  * **Audio Feedback (Web Audio API)**: Se desarrolló un sintetizador de audio en caliente (`audioEffects.js`) que genera arpegios y fanfarrias dulces con osciladores nativos del navegador, proporcionando feedback sonoro al ganar puntos (éxito), fallar respuestas (tono descendente) o desbloquear placas de logros.
  * **Puntuación por Comprensión**: Se añadieron 50 puntos extra al acertar la trivia de comprensión de textos de la estrofa, repartiendo el incentivo del juego entre la comprensión y la identificación formal de la figura literaria.

---

### 🔬 `v0.4.1` - Refinamiento de Gamificación y Rediseño de Flujo (COMPLETADA)

* **Objetivo**: Auditar la experiencia de juego de `v0.4.0` y rediseñar la transición de la tarjeta de retos de la derecha para evitar expansiones dinámicas molestas y desbordes.
* **Entregables**:
  * [x] **Revisión de Gamificación**:
    * Auditar y verificar el cálculo de rangos en la Navbar bajo diferentes puntuaciones de detective.
    * Auditar la mochila de logros: contadores del Álbum de Placas y condiciones de desbloqueo.
    * Verificar el volumen, frecuencia y durabilidad de los sonidos de Web Audio API para asegurar que sean amigables para el oído infantil.
  * [x] **Rediseño del botón "He leído la estrofa" y Transiciones del Reto**:
    * **Alternativa a mostrar campos ocultos**: Reemplazar la acumulación vertical de bloques en la misma tarjeta por un **wizard de contenido dinámico sustitutivo**. Cada paso (Paso 1: Estrofa, Paso 2: Trivia, Paso 3: Figura, Paso 4: Éxito) reemplazará por completo el cuerpo de la tarjeta derecha en lugar de mostrar campos ocultos adicionales hacia abajo.
    * **Limitación de alto y forzado de scroll**: Limpiar la expansión vertical de la tarjeta derecha limitando su alto máximo (`maxHeight: '560px'`) y forzando scroll interno (`overflowY: 'auto'`) para alinearse con la columna del karaoke de la izquierda y prevenir el scroll general de la ventana del navegador.
    * **Botones de retroceso ("Arrepentimiento")**: Permitir que la detective regrese al Paso 1 desde el Paso 2, o al Paso 2 desde el Paso 3 de forma fluida para corregir o releer.
    * **Limpieza de UI**: Quitar el bloque recordatorio de una sola línea aislada que ocupaba espacio innecesario en los retos.

---

### 🔒 Exclusión de Progreso en Control de Versiones (COMPLETADO - SESIÓN 8)

* **Objetivo**: Evitar que el historial de puntos y perfiles de detectives personales entren en el repositorio Git.
* **Entregables**:
  * [x] **Privacidad e Independencia Local**: Configurar `.gitignore` para omitir `public/data/detectives.json` y `public/data/user_progress.json`.
  * [x] **Desvinculación del Índice**: Eliminar la caché de Git de ambos archivos para dejar de rastrear cambios sin borrar el progreso local existente.
  * [x] **Alineación de Arquitectura**: Actualizar la Memoria de Decisiones para reflejar la persistencia local-first independiente del control de versiones.

---

### 🧹 `v0.4.2` - Refactorización de Componentes Extensos (COMPLETADA - SESIÓN 8)

* **Objetivo**: Reducir el tamaño y complejidad cognitiva de los ficheros de código más largos para optimizar el rendimiento y facilitar su lectura/mantenimiento por parte de desarrolladores e IAs.
* **Entregables**:
  * **Dividir `ModoDetectiveGuiado.jsx`**:
    * Extraer `StanzaReader.jsx` (Paso 1: Bloque poético, audio local de estrofas y diccionarios).
    * Extraer `ComprehensionChallenge.jsx` (Paso 2: Trivia de comprensión con opciones).
    * Extraer `FigureChallenge.jsx` (Paso 3: Cuestionario de identificación de figuras).
    * Extraer `ChallengeCelebration.jsx` (Paso 4: Mensaje de éxito, explicaciones didácticas de Valeria y mini álbum).
  * **Auditar otros ficheros extensos**:
    * Refactorizar [`SongManager.jsx`](file:///home/flachica/proyectos/pocs/literaturamusical-teacher/src/components/SongManager.jsx) para modularizar los formularios y la importación de letras LRC.
    * Modularizar [`ModoAdmin.jsx`](file:///home/flachica/proyectos/pocs/literaturamusical-teacher/src/components/ModoAdmin.jsx).

---

### 🔍 `v0.5.0` - Modo Detective Proactivo (Sugerencia de Figuras) (COMPLETADA CON ÉXITO - SESIÓN 9)

> 🧪 **Hipótesis Causal**:
> **Si** permitimos que la niña marque libremente palabras o frases y sugiera nuevas figuras que ha descubierto,
> **Provocará** que adopte un rol de lectura crítica activa en lugar de solo responder cuestionarios prefijados,
> **Moviendo** la CPVM de retos literarios al crear un círculo de co-creación familiar en el catálogo.

* [x] **Herramienta "¡He descubierto una figura!"**:
  * Permitir que la niña seleccione uno o varios versos (incluso de distintas estrofas) y proponga un descubrimiento con `SugerirFiguraModal.jsx`.
  * Formulario infantil simplificado donde elige qué figura cree que es y envía la propuesta recibiendo +50 PTS.
* [x] **Buzón Familiar en Modo Admin**:
  * Panel `FamilySuggestions.jsx` donde los padres visualizan los descubrimientos de la niña.
  * Opciones para *"Aprobar e integrar en la canción"* (otorgando +100 PTS y +1 Estrella extra) o *"Guardar para la cena"*.
* [x] **Mochila de Detective**:
  * Visualización en vivo de la tarjeta *"EN REVISIÓN (+100 PTS)"* con los descubrimientos pendientes de aprobación.

---

### 🔌 `v0.5.1` - Sistema de Plugins & Repositorios Git (COMPLETADA CON ÉXITO - SESIÓN 10)

* [x] **Estructura Decoupled de Plugin (`plugins/literaturamusical-lessons/`)**:
  * Creación de la estructura del primer repositorio de lecciones oficial con `manifest.json`, `songs/`, `figures/` y `dictionary/`.
* [x] **Exclusión Estricta de Audios**:
  * Archivos `.gitignore` configurados para evitar la subida de audios pesados (`*.webm`, `*.m4a`, `*.mp3`) a Git.
  * Preservación del metadato `youtubeUrl` en las lecciones para descargas locales de audios en 1 clic.
* [x] **Endpoints API & Persistencia Git Backend (`vite.config.js`)**:
  * Endpoints `/api/plugins`, `/api/plugins/register` (clone/pull) y exportación sincronizada en disco.

---

### 🎲 `v0.5.2` / `v0.5.3` - Motor Dinámico de Retos e Integridad Multi-Detective (COMPLETADA CON ÉXITO - SESIÓN 10)

* [x] **Barajado Aleatorio de Opciones (`quizUtils.js`)**:
  * Algoritmo Fisher-Yates en tiempo de ejecución para evitar la posición fija de la opción correcta.
* [x] **Consolidación de Figuras y Diccionario RAE desde Plugins**:
  * Lectura dinámica de figuras poéticas y términos difíciles de la RAE traídos desde los repositorios de lecciones.
* [x] **Limpieza de Sugerencias de Detectives Eliminados**:
  * Eliminación automática de sugerencias y descubrimientos del Buzón Familiar asociadas a detectives eliminados.

---

### 🤖 `v0.6.0` - Motor Dinámico de Retos, Plugins e Integración Didáctica (COMPLETADA CON ÉXITO - SESIÓN 10)

* [x] **Arquitectura de Lecciones decoupled por Plugins Git**:
  * Repositorios de lecciones en `plugins/literaturamusical-lessons/` autogenerables por LLMs fuera de banda.
* [x] **Edición en Caliente de Estrofas y Retos (`StanzaEditorModal.jsx`)**:
  * Interfaz de edición directa en Modo Admin para ajustar explicaciones y retos sin requerir middleware de IA runtime.
* [x] **Motor Dinámico de Trivia Infantil (`quizUtils.js`)**:
  * Algoritmo Fisher-Yates para rotar opciones A/B/C didácticas y evitar repetición de patrones.

---

### 🔌 `v1.1.0` - Arquitectura de Plugins Storage Intercambiables (COMPLETADA CON ÉXITO - SESIÓN 11)

* [x] **Desacoplamiento de Plugins Backend (`vite.config.js`)**: Detección dinámica del primer plugin activo de tipo `"storage"` sin hardcodear nombres de carpetas en el código de la app principal.
* [x] **Repositorio de Muestra Vacío (`literaturamusical-lessons-sample`)**: Repositorio público plantilla publicado en `git@github.com:flachica/literaturamusical-lessons-sample.git` para publicar e intercambiar lecciones sin exponer datos reales ni canciones familiares.
* [x] **Limpieza Estricta de Inicialización**: Eliminación del perfil inicial hardcodeado y puntos por defecto para garantizar que un inicio limpio comience a 0 PTS y con catálogo guiado.


---

## 🏛️ MEMORIA DE DECISIONES DE ARQUITECTURA (IDG)
1. **Persistencia Local-First y Privacidad de Progreso**: LocalStorage es la base de datos de estado inmediato. Los ficheros JSON de disco (`songs_catalog.json` y `figuras_catalog.json`) se sincronizan en Git para persistir el catálogo de canciones y diccionario de figuras. Sin embargo, los datos dinámicos de uso (`user_progress.json` y `detectives.json`) se escriben localmente en el servidor de desarrollo pero están excluidos de Git para que cada entorno sea independiente y el progreso no se comparta de forma global ni ensucie el control de versiones.
2. **Audio Autogenerado**: Para evitar subir archivos de sonido pesados a Git, todos los efectos sonoros de recompensa de la v0.4.0 se sintetizan dinámicamente usando la **Web Audio API** del navegador (osciladores y envolventes de volumen).
3. **Cierre de la v0.6.0 sin Middleware Complejo**: La v0.6.0 queda cerrada con la integración de plugins JSON y la edición visual en caliente (`StanzaEditorModal.jsx`), logrando la generación de retos y lecciones sin añadir complejidad ni latencia de red.
4. **Offline PWA y Backups JSON (`v1.0.0`)**: Incorporado manifiesto PWA, caché offline de navegador y panel de backups JSON para asegurar portabilidad y soberanía de datos del usuario.
5. **No Spotify**: Descartada para evitar barreras de autenticación OAuth e IDs de tracks de terceros, garantizando que el juego sea offline/local-first y duradero.
6. **Plugins Intercambiables de Tipo Storage**: El sistema admite plugins de tipo `"storage"`. Se permite estrictamente **uno y solo un plugin activo de tipo storage** a la vez en la app base. La persistencia backend en `vite.config.js` detecta dinámicamente el plugin storage instalado en `plugins/` sin hardcodear nombres de carpetas en el código de la aplicación principal.
7. **Protocolo Estricto de Copias de Seguridad Físicas y Preservación de Progreso**: La alternancia o prueba de plugins de lecciones (almacenamiento de canciones) es completamente independiente del progreso de los detectives del jugador (`detectives.json` y `user_progress.json`). Queda estrictamente prohibido el uso de extensiones temporales `.bak` para pruebas; cualquier operación de conmutación o prueba de origen de datos debe respaldar previamente la carpeta completa `public/data/` en el directorio físico `backups/data_backup/` para evitar reseteos accidentales.



