# 📋 BACKLOG DE INICIATIVAS Y VERSIONES - LitMusical

Documento de seguimiento del proyecto **LitMusical**. Este archivo es actualizado al finalizar cada sesión de desarrollo con la IA siguiendo la Skill [`.agents/skills/litmusical-guide/SKILL.md`](.agents/skills/litmusical-guide/SKILL.md).

---

## 📍 ESTADO ACTUAL DEL PROYECTO

- **Estado de la Sesión:** 🔴 **SESIÓN 1 CERRADA** (Completadas Iteración 1, Iteración 2 e Iteración 3).
- **Subversión Alcanzada:** `v0.1.2 (Completada y probada)`
- **📌 Punto de Reanudación para la SESIÓN 2 / Iteración 4:** 
  > Al iniciar la **Sesión 2**, comenzar con la **Iteración 4 (v0.2.0)**: Implementar la persistencia automática de estrellas, puntos y nivel del usuario en `LocalStorage`, además del guardado y carga dinámica del catálogo de canciones desde JSON local.

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
7. **Protocolo de Memoria vía Skill:** Skill de Antigravity para continuidad de sesiones e iteraciones.

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

### 📦 `v0.2.0` - Persistencia Local-First & Guardado de Progreso (Target Próxima Iteración)
- [ ] Guardado automático de puntos, nivel y estrellas en `LocalStorage`.
- [ ] Editor local para añadir nuevas canciones desde la app.




### 🎮 `v0.1.2` - Motor de Juego Trivia y Puntuación
- [ ] Motor de preguntas y respuestas de figuras literarias.
- [ ] Cálculo de puntuación y animación de insignias.

### 📦 `v0.2.0` - Persistencia Local-First
- [ ] Guardado automático en `LocalStorage`.
- [ ] Importación y exportación de archivos `JSON`.

### 🤖 `v0.3.0` - Cliente Ollama / LangChain & Fallback Offline
- [ ] Cableado del servicio `aiService.js` con Ollama local (`http://localhost:11434`).
- [ ] Fallback automático al modo offline estático.

### 🏆 `v0.4.0` - Gamificación Avanzada
- [ ] Misiones diarias y sonidos de interacción.
