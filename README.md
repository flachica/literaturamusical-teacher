# 🎵📚 LitMusical - Aprendizaje Literario a través de la Música

**LitMusical** es una plataforma web gamificada y local-first diseñada para enseñar **figuras literarias** (metáforas, hipérboles, anáforas, personificaciones, etc.) a niños de 9 años analizando canciones educativas, rimas tradicionales y poemas adaptados a la música.

---

## 🚀 Guía Rápida

- **Protocolo de Desarrollo e IA:** Consulta la Skill en [`.agents/skills/litmusical-guide/SKILL.md`](.agents/skills/litmusical-guide/SKILL.md).
- **Estado del Proyecto y Roadmap:** Revisa el archivo [`BACKLOG.md`](BACKLOG.md) para ver la lista de versiones e iniciativas.

---

## 🛠️ Tecnologías y Arquitectura

- **Frontend:** React + Vite (Diseño infantil/joven gamificado).
- **Fuente de Verdad de Letras y Timestamps:** Modelo de datos estructurado en `.json` con timestamps a nivel de segundo para sincronización Karaoke.
- **Reproductor de Audio:** Audio HTML5 Local-First que utiliza archivos MP3 locales o sintetizados.
- **Persistencia:** Local-First (`LocalStorage`, importación/exportación JSON).
- **IA Assistant:** Cliente para Ollama local (`http://localhost:11434`) con sistema de Fallback Offline.

---

## 🔌 Plugins de Almacenamiento y Lecciones (Storage Plugins)

LitMusical soporta repositorios desacoplados de lecciones de tipo `storage` para sincronizar canciones, versos sincronizados, figuras literarias y definiciones RAE.

- **Repositorio de Ejemplo / Plantilla de Muestra:** Existe un repositorio de muestra pública para crear y publicar catálogos vacíos o nuevos conjuntos de lecciones:
  👉 [**literaturamusical-lessons-sample**](https://github.com/flachica/literaturamusical-lessons-sample) (`git@github.com:flachica/literaturamusical-lessons-sample.git`)

---

## 📄 Licencia y Uso
Proyecto educativo y familiar colaborativo.

