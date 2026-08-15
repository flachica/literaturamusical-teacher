# 📋 BACKLOG DE INICIATIVAS Y VERSIONES - LitMusical (Próxima: Sesión 7)

Documento de seguimiento del desarrollo interactivo de **LitMusical** estructurado mediante la metodología **Impact-Driven Growth (IDG)** para garantizar que cada entrega genere cambios reales de comportamiento (*outcomes*) y valor en el aprendizaje pedagógico.

---

## 📍 ESTADO ACTUAL DEL PROYECTO

* **Sesión Actual**: 🔴 **SESIÓN 6 (CERRADA)** | **Próxima**: 🟢 **SESIÓN 7** (Iteración 13 - `v0.3.1`)
* **Subversión Alcanzada**: `v0.3.0` (Persistencia Activa, Indicador Multi-Detective y Modales Accesibles con Teclado).
* **Métrica Clave del Reto (CPVM)**: 
  $$\text{CPVM} = [\text{Retos de figuras literarias resueltos con éxito}] + [\text{por la niña de forma autónoma}]$$
* **Próxima Iteración**: Optimización de Usabilidad del Modo Detective Guiado (`v0.3.1`).

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

### 🔍 `v0.3.1` - Iteración de Usabilidad: Optimización del Modo Detective Guiado (PLANIFICADA)
* **Objetivo**: Mejorar la experiencia interactiva del juego para la niña de 9 años, asegurando que el flujo didáctico sea fluido y sin distracciones.
* **Entregables**:
  * Ajustes en la interfaz del visualizador de ondas y scroll de letras para asegurar una perfecta coherencia visual y de respuesta en pantallas táctiles y escritorio.
  * Simplificación del flujo de la trivia de comprensión de letras, guiando paso a paso de forma más amigable antes de pasar a la identificación de la figura.
  * Ajuste de tipografías y espaciados generales para mejorar la lectura infantil de los versos de la canción.

---

### 🏆 `v0.4.0` - Gamificación Avanzada "Escuela de Detectives" (PLANIFICADA)

> 🧪 **Hipótesis Causal**:
> **Si** implementamos rangos de progreso de detective, placas visuales de logros y efectos de sonido interactivos autogenerados,
> **Provocará** que la niña acceda a la app con más frecuencia semanal de forma voluntaria y use más el diccionario didáctico,
> **Moviendo** la CPVM de retos resueltos autónomamente y consolidando su comprensión literaria.

* [ ] **Rangos de Detective**:
  * Implementar progresión por niveles de experiencia basados en puntos:
    * *Nivel 1 (0-150 pts)*: Detective Novato 🔍
    * *Nivel 2 (151-350 pts)*: Ayudante de Inspector 🧥
    * *Nivel 3 (351-600 pts)*: Inspector Literario 🕵️‍♀️
    * *Nivel 4 (601+ pts)*: Superdetective de Oro 🏆
  * Mostrar de forma destacada el rango de la niña detective en la Navbar y el Modo Detective.
* [ ] **Álbum de Placas y Logros (Insignias)**:
  * Crear un panel visual en Modo Detective para ver los logros desbloqueados:
    * 📖 *Placa del Lector* (Por abrir el diccionario 5 veces).
    * 🦊 *Oído de Lince* (Por escuchar estrofas individuales 10 veces).
    * ✨ *Racha Poética* (Por responder 3 preguntas de comprensión seguidas sin fallar).
    * 🎵 *Melómano Literario* (Por completar 3 canciones diferentes).
* [ ] **Audio Feedback (Web Audio API)**:
  * Generar efectos de sonido dinámicos en la UI sintetizados en tiempo real (evita descargar archivos de audio):
    * Sonido de éxito/puntos (arpegio ascendente).
    * Sonido de fallo/pista (tono suave descendente).
    * Sonido de desbloqueo de placa (fanfarria pequeña).

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

1. **Persistencia Local-First**: LocalStorage es la base de datos de estado inmediato. Los ficheros JSON de disco (`songs_catalog.json`, `user_progress.json` y `detectives.json`) sincronizan el estado del servidor de desarrollo para asegurar la portabilidad del código y el despliegue sin dependencias.
2. **Audio Autogenerado**: Para evitar subir archivos de sonido pesados a Git, todos los efectos sonoros de recompensa de la v0.4.0 se sintetizan dinámicamente usando la **Web Audio API** del navegador (osciladores y envolventes de volumen).
3. **No Spotify**: Descartada para evitar barreras de autenticación OAuth e IDs de tracks de terceros, garantizando que el juego sea offline/local-first y duradero.
