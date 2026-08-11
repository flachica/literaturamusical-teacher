# 📋 BACKLOG DE INICIATIVAS Y VERSIONES - LitMusical

Documento de seguimiento del proyecto **LitMusical**. Este archivo es actualizado al finalizar cada sesión de desarrollo con la IA siguiendo la Skill [`.agents/skills/litmusical-guide/SKILL.md`](.agents/skills/litmusical-guide/SKILL.md).

---

## 📍 ESTADO ACTUAL DEL PROYECTO

- **Estado de la Sesión:** 🔴 **SESIÓN 2 CERRADA** (Completada Iteración 4: `v0.2.0`).
- **Subversión Alcanzada:** `v0.2.0 (Completada y probada)`
- **📌 Punto de Reanudación para la SESIÓN 3 / Iteración 5:** 
  > Al iniciar la **Sesión 3**, comenzar con la **Iteración 5 (v0.3.0)**: Cablear el cliente del servicio de IA `aiService.js` con el servidor Ollama local (`http://localhost:11434`), con fallback automático al modo estático offline si no hay conexión.

---


## 💡 INICIATIVAS

### ✅ Aprobadas
1. **Frontend Prototipo Gamificado:** Interfaz neón/vibrante tipo "Escuela de Detectives Literarios".
2. **Separación de Vistas (Modo Detective vs. Modo Admin):**
   - **Modo Detective (Hija):** Experiencia limpia, enfocada y guiada paso a paso por una sola canción.
   - **Modo Admin (Padres):** Panel para gestionar catálogo, configurar Ollama local e exportar JSON.
3. **Visualizador de Ondas Musicales (Waveform Scrubber):**
   - Cursor de desplazamiento horizontal sobre ondas neón con marcadores de estrellas ✨ donde están las metáforas.
   - Sincronización dinámica de la reproducción de audio con el verso activo de la canción.
4. **Flujo Pedagógico "Comprensión Primero":**
   - *Paso 1: Leer estrofa + Diccionario RAE Didáctico.*
   - *Paso 2: Reto de Comprensión del Significado.*
   - *Paso 3: Etiquetar la Figura Literaria.*
   - *Paso 4: Celebración con Confetti + Puntos.*
5. **Diccionario RAE Infantil Integrado:** Palabras clave destacables (*mimbre, fragua, nardos, polisón, cimientos*).
6. **Reproductor Agnóstico:** Soporte modular para Spotify Embed, YouTube y Audio HTML5.
7. **Persistencia Local-First (`v0.2.0`):**
   - Guardado automático de puntos, nivel y estrellas en `LocalStorage`.
   - Gestor y editor de canciones en Modo Admin (alta, baja, exportación/importación JSON y restauración por defecto).
8. **Protocolo de Memoria vía Skill:** Skill de Antigravity para continuidad de sesiones e iteraciones.

### ❌ Descartadas
1. **Módulo de Odoo (`litmusical_odoo`):** Descartado para mantener una arquitectura local-first ligera, rápida y portable.

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

### 🤖 `v0.3.0` - Cliente Ollama / LangChain & Fallback Offline (Target Próxima Iteración)
- [ ] Cableado del servicio `aiService.js` con Ollama local (`http://localhost:11434`).
- [ ] Fallback automático al modo offline estático si Ollama no está corriendo.

### 🏆 `v0.4.0` - Gamificación Avanzada
- [ ] Misiones diarias y efectos de sonido de interacción.
