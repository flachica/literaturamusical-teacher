# 📋 BACKLOG DE INICIATIVAS Y VERSIONES - LitMusical (Próxima: Sesión 8)

Documento de seguimiento del desarrollo interactivo de **LitMusical** estructurado mediante la metodología **Impact-Driven Growth (IDG)** para garantizar que cada entrega genere cambios reales de comportamiento (*outcomes*) y valor en el aprendizaje pedagógico.

---

## 📍 ESTADO ACTUAL DEL PROYECTO

* **Sesión Actual**: 🟢 **SESIÓN 8 (EN DESARROLLO)** | **Próxima**: 🔴 **SESIÓN 9** (Modo Detective Proactivo `v0.5.0`)
* **Subversión Alcanzada**: `v0.3.1` (Optimización de usabilidad del Modo Detective, resolución del error 403 en descargas, flujo de comprensión no intrusivo y tipografías aumentadas).
* **Fallo Pendiente de Solucionar (Próxima Sesión)**: Ninguno crítico registrado.
* **Métrica Clave del Reto (CPVM)**: 
  $$\text{CPVM} = [\text{Retos de figuras literarias resueltos con éxito}] + [\text{por la niña de forma autónoma}]$$
* **Próxima Iteración**: Modo Detective Proactivo (`v0.5.0`).

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

### 🧹 `v0.4.2` - Refactorización de Componentes Extensos (PLANIFICADA)

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

### 🔍 `v0.5.0` - Modo Detective Proactivo (Sugerencia de Figuras) (PLANIFICADA)

> 🧪 **Hipótesis Causal**:
> **Si** permitimos que la niña marque libremente palabras o frases y sugiera nuevas figuras que ha descubierto,
> **Provocará** que adopte un rol de lectura crítica activa en lugar de solo responder cuestionarios prefijados,
> **Moviendo** la CPVM de retos literarios al crear un círculo de co-creación familiar en el catálogo.

* [ ] **Herramienta "¡He descubierto una figura!"**:
  * Permitir que la niña haga clic o seleccione cualquier línea/palabra y pulse un botón interactivo de descubrimiento.
  * Formulario infantil simplificado donde elige qué figura cree que es (Metáfora, Símil, Personificación...) y por qué.
* [ ] **Buzón Familiar en Modo Admin**:
  * Panel donde los padres visualizan los descubrimientos de la niña.
  * Botones para *"Aprobar e integrar en la canción"* (otorgando estrellas extra a la niña) o *"Conversar en la cena"*.

---

### 🤖 `v0.6.0` - Asistente de IA con Ollama Local y Fallback Offline (PLANIFICADA)

> 🧪 **Hipótesis Causal**:
> **Si** permitimos que un LLM local (Ollama) genere automáticamente las preguntas de comprensión infantil y la explicación de figuras para canciones incompletas,
> **Provocará** que los padres dediquen un 90% menos de tiempo a escribir retos a mano en Modo Admin,
> **Moviendo** la CPVM al acelerar la incorporación de nuevas canciones en el catálogo.

* [ ] **Servicio de IA Local (`aiService.js`)**:
  * Conectar el frontend con el endpoint local `http://localhost:11434/api/chat` usando el modelo `llama3` u otro instalado.
  * Prompt System pedagógico refinado (tono respetuoso, adaptado a 9 años, en español).
* [ ] **Generador de Retos**:
  * Botón *"🤖 Generar Retos con IA"* para canciones marcadas con `letraPendienteIA: true`.
  * Generación y formateo automático de estrofas, preguntas de comprensión infantil con opciones A/B y explicaciones del verso.
* [ ] **Fallback Offline Inteligente**:
  * Si la llamada a Ollama falla o no está activo, autogenerar un reto simplificado estático por defecto sin bloquear el guardado de la canción.

---

## 🏛️ MEMORIA DE DECISIONES DE ARQUITECTURA (IDG)
1. **Persistencia Local-First y Privacidad de Progreso**: LocalStorage es la base de datos de estado inmediato. Los ficheros JSON de disco (`songs_catalog.json` y `figuras_catalog.json`) se sincronizan en Git para persistir el catálogo de canciones y diccionario de figuras. Sin embargo, los datos dinámicos de uso (`user_progress.json` y `detectives.json`) se escriben localmente en el servidor de desarrollo pero están excluidos de Git para que cada entorno sea independiente y el progreso no se comparta de forma global ni ensucie el control de versiones.
2. **Audio Autogenerado**: Para evitar subir archivos de sonido pesados a Git, todos los efectos sonoros de recompensa de la v0.4.0 se sintetizan dinámicamente usando la **Web Audio API** del navegador (osciladores y envolventes de volumen).
3. **No Spotify**: Descartada para evitar barreras de autenticación OAuth e IDs de tracks de terceros, garantizando que el juego sea offline/local-first y duradero.

