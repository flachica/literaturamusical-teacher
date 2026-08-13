# 📋 BACKLOG DE INICIATIVAS Y VERSIONES - LitMusical

Documento de seguimiento del proyecto **LitMusical**. Este archivo es actualizado al finalizar cada sesión de desarrollo con la IA siguiendo la Skill [`.agents/skills/litmusical-guide/SKILL.md`](.agents/skills/litmusical-guide/SKILL.md).

---

## 📍 ESTADO ACTUAL DEL PROYECTO

- **Estado de la Sesión:** 🟢 **SESIÓN 3 COMPLETADA CON ÉXITO** (v0.2.9c - Auto-Scroll Contenido, 47 Versos LRCLIB, Navegación de Estrofas & Reproducción Focalizada).
- **Subversión Alcanzada:** `v0.2.9c (Auto-Scroll Interno Aislado, 47 Versos Sincronizados de Banda Educativa, Tono Detective 9 Años, Menú Hamburguesa Compacto y Reproducción Focalizada por Estrofa)`
- **📌 Punto de Reanudación para la SESIÓN 4 / Iteración 6:** 
  > Al iniciar la **Sesión 4**, comenzar con la **Iteración 6 (v0.3.0)**: Cablear el cliente del servicio de IA `aiService.js` con Ollama local (`http://localhost:11434`), fallback offline inteligente y generación dinámica de retos.

---


## 💡 INICIATIVAS

### ✅ Aprobadas
1. **Frontend Prototipo Gamificado:** Interfaz neón/vibrante tipo "Escuela de Detectives Literarios".
2. **Separación de Vistas (Modo Detective vs. Modo Admin):**
   - **Modo Detective (Hija):** Experiencia limpia, enfocada y guiada paso a paso por una sola canción con acceso en 1 clic a `📖 Diccionario`.
   - **Modo Admin (Padres):** Menú Hamburguesa `⚙️ Padres` para gestionar catálogo, configurar Ollama local e exportar JSON.
3. **Visualizador de Ondas Musicales (Waveform Scrubber):**
   - Cursor de desplazamiento horizontal sobre ondas neón con marcadores de estrellas ✨ donde están las metáforas.
   - Sincronización dinámica de la reproducción de audio HTML5 MP3 con el verso activo de la canción.
4. **Flujo Pedagógico "Comprensión Primero":**
   - *Paso 1: Leer estrofa + Diccionario RAE Didáctico.*
   - *Paso 2: Reto de Comprensión del Significado.*
   - *Paso 3: Etiquetar la Figura Literaria.*
   - *Paso 4: Celebración con Confetti + Puntos.*
5. **Diccionario RAE Infantil Integrado:** Palabras clave destacables (*mimbre, fragua, nardos, polisón, cimientos*).
6. **Reproductor Agnóstico Local-First:** Reproductor de Karaoke HTML5 unificado con soporte para audios MP3 locales.
7. **Persistencia Local-First (`v0.2.0`):**
   - Guardado automático de puntos, nivel y estrellas en `LocalStorage`.
   - Gestor y editor de canciones en Modo Admin (alta, baja, exportación/importación JSON y restauración por defecto).
8. **Layout a 2 Columnas Dinámicas (`v0.2.6 - v0.2.9`):**
   - Panel de Lectura Karaoke a la izquierda (100% texto completo sin recortes) y Reto Detective a la derecha.
   - Colapso fluido a 1 columna 100% centrada al ocultar la letra.
9. **Protocolo de Memoria vía Skill:** Skill de Antigravity para continuidad de sesiones e iteraciones.
10. **Skill de Extracción de Audio de YouTube (`yt-dlp` + Deno):** Protocolo estandarizado en Skill `.agents/skills/litmusical-guide/SKILL.md` para descargar audio real de YouTube a `public/audio/` para cualquier canción nueva y para la función de alta en Modo Admin.
11. **Buscador/Importador Automático LRCLIB API:** Conexión con la API pública y gratuita `https://lrclib.net/api/get` para importar letras `.lrc` y timestamps milimétricos (`start_ms`) en el Modo Admin sin esfuerzo manual de sincronización.
12. **Modo Detective Proactivo (Sugerir/Marcar Nuevas Figuras por la Hija):** 
    - Permitir a la niña marcar cualquier verso o estrofa en el Modo Detective y pulsar *"🔍 ¡He descubierto una figura aquí!"* para sugerir su interpretación o proponer nuevas figuras literarias (ej. *Onomatopeya, Hipérbaton*) al Buzón Familiar para revisión de los padres en Modo Admin.

### ❌ Descartadas
1. **Módulo de Odoo (`litmusical_odoo`):** Descartado para mantener una arquitectura local-first ligera, rápida y portable.
2. **Integración con Spotify (`spotifyTrackId`):** Descartada definitivamente para mantener la aplicación limpia y sin dependencias de API/cuentas externas de Spotify. YouTube + Audios locales cubren el 100% de los casos.

---

## 🗓️ HOJA DE RUTA POR SUBVERSIONES (ROADMAP)

### 🎨 `v0.1.0` - Prototipo Visual e Interactivo (COMPLETADA)
- [x] Configuración de la Skill `.agents/skills/litmusical-guide/SKILL.md`.
- [x] Creación de `README.md` y `BACKLOG.md`.
- [x] Inicialización del proyecto Vite + React en `/home/fernando/proyectos/litmusical`.
- [x] Componentes iniciales.

### ⚡ `v0.1.1` - UX Infantil, Comprensión Primero & Diccionario RAE (COMPLETADA)
- [x] Separación de interfaces: **Modo Detective (Niña)** vs **Modo Admin y Padres**.
- [x] Flujo didáctico paso a paso: *Lectura & RAE -> Comprensión de la Letra -> Identificar Figura -> Celebración*.
- [x] Integración de Diccionario RAE Didáctico.

### 🌊 `v0.1.2` - Visualizador de Ondas Musicales (Waveform Scrubber) (COMPLETADA)
- [x] Barra interactiva de ondas neón con cursor deslizante horizontal.
- [x] Marcadores ✨ en la onda musical donde ocurren las figuras literarias.
- [x] Sincronización en tiempo real del minutero, audio y verso activo.

### 📦 `v0.2.0` - Persistencia Local-First & Editor de Canciones (COMPLETADA)
- [x] Guardado automático de puntos, nivel y estrellas en `LocalStorage`.
- [x] Gestor local de canciones (`SongManager.jsx`) en el Modo Admin.
- [x] Exportación e Importación de catálogos en archivos `.json`.
- [x] Restauración de valores por defecto de canciones y de usuario.
- [x] `v0.2.1`: Actualización del ID de vídeo de Banda Educativa (*El Río del Tiempo*) y sincronización automática de `youtubeId` en LocalStorage.
- [x] `v0.2.9`: **Refactorización Karaoke Local-First & Layout 2 Columnas (COMPLETADA)**:
  - Unificación en un **Reproductor de Karaoke HTML5** con un único control Play/Pause sincronizado con el minutero y el avance de la letra.
  - Sincronización de `onSeekTime` desde la barra de ondas directamente sobre el MP3.
  - Flujo de alta de canciones con selector de MP3 local y prompt modal cuando falta la letra (manual vs IA).
  - Menú Hamburguesa `⚙️ Padres` en la Navbar para ocultar opciones técnicas a la niña.
  - Acceso directo en 1 clic al `📖 Diccionario` para la niña.
  - Layout a **2 Columnas Dinámicas** (Lectura Karaoke a la izquierda 100% íntegra + Reto Detective a la derecha).
  - Eliminación de manejador `onClick` en la letra para evitar parpadeos visuales.
- [x] `v0.2.9c`: **Perfeccionamiento UX 9 Años, Auto-Scroll Aislado & Navegación de Estrofas (COMPLETADA - SESIÓN 3)**:
  - Volcado e integración de los **47 versos completos** de *El Río del Tiempo* (5 min) desde la API de LRCLIB.
  - Normalizador defensivo de estrofas `sanitizeSongVerses` en `storage.js` (cuartetas de 4 versos equilibradas).
  - Auto-scroll centrado 100% aislado dentro de `lyricsContainerRef` (sin afectar a la ventana del navegador ni a la cabecera).
  - Rediseño de tono respetuoso sin expresiones condescendientes (`📖 Diccionario RAE`, `definicion_detective`).
  - Optimizador de espacio vertical trasladando los accesos a `BACKLOG.md` y `SKILL.md` al Menú Hamburguesa de Padres.
  - Navegación manual por estrofas (`←` / `→`) y botón verde **`▶ Escuchar Estrofa`** con sincronización bidireccional de `onSeekTime`.

### 🤖 `v0.3.0` - Cliente Ollama / LangChain & Fallback Offline (Target Próxima Iteración)
- [ ] Cableado del servicio `aiService.js` con Ollama local (`http://localhost:11434`).
- [ ] Fallback automático al modo offline estático si Ollama no está corriendo.
- [ ] Generación y renderizado automático de letras y retos didácticos para canciones registradas con `letraPendienteIA: true`.

### 🏆 `v0.4.0` - Gamificación Avanzada
- [ ] Misiones diarias y efectos de sonido de interacción.
