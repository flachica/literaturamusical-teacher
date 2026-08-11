---
name: litmusical-guide
description: Guía de arquitectura, memoria de proyecto y protocolo de sesiones con IA para la app LitMusical (enseñanza de figuras literarias con música para niños). Usar en cada sesión para reanudar o cerrar el desarrollo.
---

# LitMusical - Guía de Proyecto y Protocolo de Sesiones e Iteraciones 🎵📚

## 🎯 Visión del Proyecto
**LitMusical** es una aplicación web gamificada y local-first diseñada para que una niña de 9 años aprenda a reconocer, interpretar y disfrutar de las figuras literarias (metáforas, hipérboles, anáforas, personificaciones...) a través de canciones de sus grupos preferidos (Banda Educativa, poesía adaptada, rock nacional, etc.).

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

- **Enfoque por Subversiones e Iteraciones Granulares:** Avanzar paso a paso (ej. v0.1.0 mockup visual, v0.1.1 flujo guiado + RAE).


### 3. Protocolo de CIERRE DE SESIÓN Y MEMORIA LOCAL
Al finalizar una sesión o antes de pausar el desarrollo:
1. **Verificación de Memoria Local:** Garantizar que las decisiones de arquitectura y la memoria de hito quedan guardadas localmente en este archivo `.agents/skills/litmusical-guide/SKILL.md` y en [`BACKLOG.md`](../../BACKLOG.md). Esto asegura que Antigravity o cualquier IA que reanude el trabajo rescate el estado exacto sin perder ningún detalle.
2. **Actualizar `BACKLOG.md`:** Registrar la Sesión como CERRADA, listar las iteraciones completadas en la sesión y marcar el número de versión/subversión alcanzado.
3. **Resumen de Estado:** Indicar claramente el punto de entrada para la próxima sesión (ej. Sesión 3 → Iteración 5 / `v0.3.0`).


---

## 🏛️ Decisiones de Arquitectura e Iniciativas

### ✅ Iniciativas Aprobadas
- **Frontend SPA Gamificado:** React + Vite con interfaz neón/vibrante tipo "Escuela de Detectives Literarios".
- **Lyric Highlighter:** Resaltador de versos interactivo con explicaciones adaptadas a 9 años.
- **Audio Agnostic:** Soporte modular para Spotify, YouTube y Audio local.
- **Conexión Ollama / LangChain:** Cliente configurable con fallback inmediato a respuestas locales en caso de fin de cuota o desconexión.
- **Sugerencias Familiares:** Buzón intuitivo para aportaciones de la hija y su madre.
- **Persistencia Local-First:** Progreso y catálogo guardados en `LocalStorage` y exportables/importables en JSON.

### ❌ Iniciativas Descartadas
- **Addon de Odoo:** Descartado definitivamente para priorizar una arquitectura ligera, portable y local-first.

---

## 📌 Hoja de Ruta de Subversiones
- **v0.1.0:** Prototipo Visual e Interactivo (Maqueta visual completa con datos simulados).
- **v0.1.1:** Interactividad dinámica de versos y cambio de canciones.
- **v0.1.2:** Motor de preguntas/respuestas de la Trivia de Detectives y puntos.
- **v0.2.0:** Persistencia Local-First (archivos JSON y LocalStorage) + Editor de canciones. [COMPLETADO - SESIÓN 2]
- **v0.3.0:** Conexión activa con Ollama local y fallback offline inteligente. [PRÓXIMO OBJETIVO - SESIÓN 3]
- **v0.4.0:** Gamificación avanzada, insignias y efectos de sonido.
