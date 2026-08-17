# 🎵📚 LitMusical - Aprendizaje Literario a través de la Música (v1.1.0)

**LitMusical** es una plataforma web gamificada, local-first y PWA diseñada para enseñar **figuras literarias** (metáforas, hipérboles, anáforas, personificaciones, etc.) a niños de 9 años mediante canciones educativas, poesía adaptada y música didáctica.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- **Node.js**: v18.0.0 o superior (`node -v`)
- **npm**: v9.0.0 o superior (`npm -v`)
- **Git**: Para clonar la aplicación y los plugins de lecciones.
- **yt-dlp + Node/Deno (Recomendado)**: Herramienta de sistema para la descarga local segura de pistas de audio desde YouTube (`/api/download-audio`).

### 🎵 Plugin Backend de Descarga de Audio (`vite.config.js`)
El plugin backend `jsonStoragePlugin` integrado en `vite.config.js` expone los endpoints `/api/download-audio` y `/api/check-audio`:
- **Motor de Extracción:** Ejecuta `yt-dlp` utilizando `node` (`/usr/bin/node`) o `deno` como ejecutable de JavaScript para resolver los desafíos anti-scraping de YouTube (`--js-runtimes node:/usr/bin/node`).
- **Formato Optimizado:** Extrae solo pistas de audio puro (`.webm` Opus / `.m4a` AAC) compatibles al 100% con HTML5 `<audio>` y Web Audio API.
- **Soberanía y Privacidad:** El audio descargado se guarda en `public/audio/` y está excluido de Git (`.gitignore`) para garantizar portabilidad legal y liviandad del repositorio.

---

## ⚡ Instalación Paso a Paso

### 1. Clonar el repositorio principal
[![GitHub Repo](https://img.shields.io/badge/GitHub-flachica%2Fliteraturamusical--teacher-181717?logo=github)](https://github.com/flachica/literaturamusical-teacher)
```bash
# Opción HTTPS (Recomendada):
git clone https://github.com/flachica/literaturamusical-teacher.git
# Opción SSH:
git clone git@github.com:flachica/literaturamusical-teacher.git

cd literaturamusical-teacher
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

Abre tu navegador en la URL indicada por Vite (por defecto `http://localhost:5173/` o `http://localhost:3000/`).

> 💡 **Persistencia Local por Defecto:** LitMusical funciona **out-of-the-box** almacenando todos los datos (canciones, figuras, detectives y sugerencias) localmente en la carpeta `public/data/`. No se requiere ninguna configuración ni clonar repositorios adicionales para empezar a usar la aplicación.

---

## 🚀 Ejecución en Desarrollo

Para iniciar el servidor de desarrollo local de Vite:

```bash
npm run dev
```

Abre tu navegador en la URL indicada por Vite (por defecto `http://localhost:5173/` o `http://localhost:3001/`).

---

## 🏗️ Construcción para Producción

Para compilar la aplicación PWA lista para producción:

```bash
npm run build
```

Para previsualizar la compilación localmente:

```bash
npm run preview
```

---

## 🔌 Arquitectura de Plugins de Almacenamiento (Storage Plugins)

Un plugin de almacenamiento de tipo `storage` es un repositorio desacoplado que contiene todas las lecciones, estado de detectives y sugerencias:

- `songs/songs_catalog.json`: Catálogo de canciones, letras LRC y retos didácticos.
- `figures/figuras_catalog.json`: Definiciones y medallas de figuras literarias.
- `dictionary/rae_dictionary.json`: Diccionario infantil de palabras complejas.
- `detectives/detectives.json`: Perfiles de detectives, puntos acumulados, nivel, estrellas e insignias.
- `progress/user_progress.json`: Puntos acumulados de la jugadora.
- `suggestions/sugerencias_detectives.json`: Descubrimientos poéticos propuestos por detectives en el Buzón Familiar.

### Principios del Almacenamiento:
- **Regla del Único Storage Activo:** La aplicación base detecta automáticamente los plugins en `plugins/` que tengan `"type": "storage"` en su `manifest.json`. El primer plugin storage encontrado se utiliza como fuente de verdad.
- **Persistencia en Repositorio Privado:** Al hacer commit/push en tu repositorio storage privado, **todo el progreso de los detectives y las sugerencias del buzón familiar quedan respaldados en Git de forma segura**.
- **Intercambiables sin Código:** Para cambiar de repositorio de lecciones, simplemente añade o quita la carpeta correspondiente dentro de `plugins/` sin tocar una sola línea de código ni variables de entorno.
- **Privacidad y Exclusión de Audio:** Los audios pesados (`*.webm`, `*.m4a`, `*.mp3`) están en `.gitignore` para garantizar repositorios ligeros y portables.

### 🔗 Repositorios del Ecosistema LitMusical

| Repositorio | Tipo | Descripción | Enlace Web (GitHub) | Comando de Clonación |
| :--- | :--- | :--- | :--- | :--- |
| 📱 **LitMusical App** | Aplicación Web | Plataforma PWA principal (*Escuela de Detectives*) | [flachica/literaturamusical-teacher](https://github.com/flachica/literaturamusical-teacher) | `git clone https://github.com/flachica/literaturamusical-teacher.git` |
| 🧪 **Storage Plugin (Sample)** | Storage Plugin | Repositorio de lecciones de muestra y plantilla didáctica | [flachica/literaturamusical-lessons-sample](https://github.com/flachica/literaturamusical-lessons-sample) | `git clone https://github.com/flachica/literaturamusical-lessons-sample.git` |

---

## 📖 Documentación y Guías

- **Guía de IA y Protocolo de Desarrollo:** [`.agents/skills/litmusical-guide/SKILL.md`](.agents/skills/litmusical-guide/SKILL.md)
- **Roadmap e Historial de Versiones:** [`BACKLOG.md`](BACKLOG.md)

---

## 📄 Licencia y Uso
Proyecto educativo y familiar colaborativo.

