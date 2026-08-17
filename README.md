# 🎵📚 LitMusical - Aprendizaje Literario a través de la Música (v1.1.0)

**LitMusical** es una plataforma web gamificada, local-first y PWA diseñada para enseñar **figuras literarias** (metáforas, hipérboles, anáforas, personificaciones, etc.) a niños de 9 años mediante canciones educativas, poesía adaptada y música didáctica.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- **Node.js**: v18.0.0 o superior (`node -v`)
- **npm**: v9.0.0 o superior (`npm -v`)
- **Git**: Para clonar la aplicación y los plugins de lecciones.
- *(Opcional)* **yt-dlp + Python 3**: Si deseas descargar y procesar automáticamente audios locales desde enlaces de YouTube desde el panel de administración.

---

## ⚡ Instalación Paso a Paso

### 1. Clonar el repositorio principal
```bash
git clone git@github.com:flachica/literaturamusical-teacher.git
cd literaturamusical-teacher
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Instalar un Plugin de Lecciones (Storage Plugin)

LitMusical utiliza una arquitectura desacoplada donde el catálogo de canciones, figuras y diccionario vive en un repositorio de plugin de tipo `storage` dentro de la carpeta `plugins/`.

Elige una de las siguientes opciones:

#### 🔹 Opción A: Usar la plantilla de muestra limpia (Recomendado para pruebas o crear contenido desde 0)
```bash
git clone git@github.com:flachica/literaturamusical-lessons-sample.git plugins/literaturamusical-lessons-sample
```

#### 🔹 Opción B: Usar un catálogo oficial o propio existente
```bash
git clone git@github.com:flachica/literaturamusical-lessons.git plugins/literaturamusical-lessons
```

#### 🔹 Opción C: Clonar desde la interfaz web (Modo Admin)
Puedes omitir el comando manual, arrancar la app y clonar cualquier repositorio Git desde **Modo Admin > Ajustes / Plugins > Clonar Plugin Git**.

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

- **Regla del Único Storage Activo:** La aplicación base detecta automáticamente los plugins en `plugins/` que tengan `"type": "storage"` en su `manifest.json`. El primer plugin storage encontrado se utiliza como fuente de verdad.
- **Intercambiables sin Código:** Para cambiar de repositorio de lecciones, simplemente añade o quita la carpeta correspondiente dentro de `plugins/` sin tocar una sola línea de código ni variables de entorno.
- **Privacidad y Exclusión de Audio:** Los audios pesados (`*.webm`, `*.m4a`, `*.mp3`) están en `.gitignore` en todos los repositorios para garantizar repositorios ligeros y portables.

### Repositorio Plantilla / Muestra Público:
👉 [**literaturamusical-lessons-sample**](https://github.com/flachica/literaturamusical-lessons-sample) (`git@github.com:flachica/literaturamusical-lessons-sample.git`)

---

## 📖 Documentación y Guías

- **Guía de IA y Protocolo de Desarrollo:** [`.agents/skills/litmusical-guide/SKILL.md`](.agents/skills/litmusical-guide/SKILL.md)
- **Roadmap e Historial de Versiones:** [`BACKLOG.md`](BACKLOG.md)

---

## 📄 Licencia y Uso
Proyecto educativo y familiar colaborativo.
