import { CANCIONES, FIGURAS_LITERARIAS } from '../data/initialData';

const PROGRESS_KEY = 'litmusical_user_progress_v1';
const SONGS_KEY = 'litmusical_songs_catalog_v1';

// Initial default progress
export const DEFAULT_PROGRESS = {
  puntos: 450,
  nivel: 3,
  estrellas: 5
};

/**
 * Carga el progreso del usuario desde LocalStorage (o retorna por defecto)
 */
export function loadUserProgress() {
  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        puntos: typeof parsed.puntos === 'number' ? parsed.puntos : DEFAULT_PROGRESS.puntos,
        nivel: typeof parsed.nivel === 'number' ? parsed.nivel : DEFAULT_PROGRESS.nivel,
        estrellas: typeof parsed.estrellas === 'number' ? parsed.estrellas : DEFAULT_PROGRESS.estrellas
      };
    }
  } catch (err) {
    console.error('Error cargando progreso de LocalStorage:', err);
  }
  return DEFAULT_PROGRESS;
}

/**
 * Guarda el progreso del usuario en LocalStorage
 */
export function saveUserProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    // Persistir directamente en el fichero JSON del disco duro (public/data/user_progress.json)
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress)
    }).catch(err => console.warn('Aviso: Servidor estático sin API de fichero en disco:', err.message));
  } catch (err) {
    console.error('Error guardando progreso:', err);
  }
}

/**
 * Resetea el progreso a los valores iniciales
 */
export function resetUserProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEFAULT_PROGRESS)
    }).catch(() => {});
  } catch (err) {
    console.error('Error reseteando progreso:', err);
  }
  return DEFAULT_PROGRESS;
}

/**
 * Normaliza y sanitiza la lista de versos garantizando que tengan estrofaNum estructurado
 */
export function sanitizeSongVerses(versos) {
  if (!Array.isArray(versos) || versos.length === 0) return versos;

  // Filtrar versos con texto vacío o solo espacios
  const versosValidos = versos.filter(v => v.texto && v.texto.trim().length > 0);

  const primerEstrofa = versosValidos[0]?.estrofaNum;
  const todasTienenMismoNum = versosValidos.every(v => v.estrofaNum === primerEstrofa);

  if (!primerEstrofa || todasTienenMismoNum) {
    return versosValidos.map((v, idx) => ({
      ...v,
      linea: idx + 1,
      estrofaNum: Math.floor(idx / 6) + 1
    }));
  }

  return versosValidos.map((v, idx) => ({
    ...v,
    linea: idx + 1
  }));
}

/**
 * Carga el catálogo de canciones (LocalStorage o catálogo inicial por defecto)
 */
export function loadSongsCatalog() {
  try {
    const saved = localStorage.getItem(SONGS_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map(s => {
          // Si el elemento tenía guardada una URL directa de YouTube no reproducible, limpiar la URL de vista previa
          let fixedAudioUrl = s.audioPreviewUrl || s.audioUrl;
          if (fixedAudioUrl && (fixedAudioUrl.includes('youtube.com') || fixedAudioUrl.includes('youtu.be') || fixedAudioUrl.endsWith('.mp4'))) {
            fixedAudioUrl = `/audio/${s.id}.webm`;
          }
          return {
            ...s,
            audioPreviewUrl: fixedAudioUrl,
            audioUrl: fixedAudioUrl,
            versos: sanitizeSongVerses(s.versos)
          };
        });
      }
    }
  } catch (err) {
    console.error('Error cargando canciones de LocalStorage:', err);
  }
  
  const initialCatalog = CANCIONES.map(c => ({
    ...c,
    versos: sanitizeSongVerses(c.versos)
  }));
  saveSongsCatalog(initialCatalog);
  return initialCatalog;
}

/**
 * Guarda el catálogo completo de canciones en LocalStorage y en el fichero JSON del disco
 */
export function saveSongsCatalog(songs) {
  try {
    localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
    // Persistir directamente en el fichero JSON del disco duro (public/data/songs_catalog.json)
    fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(songs)
    }).catch(err => console.warn('Aviso: Servidor estático sin API de fichero en disco:', err.message));
  } catch (err) {
    console.error('Error guardando catálogo de canciones:', err);
  }
}

/**
 * Restaura el catálogo original por defecto
 */
export function resetSongsCatalog() {
  try {
    localStorage.removeItem(SONGS_KEY);
  } catch (err) {
    console.error('Error al restaurar catálogo original:', err);
  }
  return CANCIONES;
}

const FIGURES_KEY = 'litmusical_figures_catalog_v1';

/**
 * Carga el catálogo de figuras literarias (LocalStorage o catálogo inicial por defecto)
 */
export function loadFiguresCatalog() {
  try {
    const saved = localStorage.getItem(FIGURES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error cargando figuras de LocalStorage:', err);
  }
  
  const initialFigures = [...FIGURAS_LITERARIAS];
  saveFiguresCatalog(initialFigures);
  return initialFigures;
}

/**
 * Guarda el catálogo completo de figuras literarias en LocalStorage y en disco
 */
export function saveFiguresCatalog(figures) {
  try {
    localStorage.setItem(FIGURES_KEY, JSON.stringify(figures));
    fetch('/api/figuras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(figures)
    }).catch(err => console.warn('Aviso: Servidor estático sin API de figuras en disco:', err.message));
  } catch (err) {
    console.error('Error guardando catálogo de figuras:', err);
  }
}

/**
 * Restaura el catálogo de figuras literarias por defecto
 */
export function resetFiguresCatalog() {
  try {
    localStorage.removeItem(FIGURES_KEY);
  } catch (err) {
    console.error('Error al restaurar catálogo de figuras:', err);
  }
  return FIGURAS_LITERARIAS;
}

const DETECTIVES_KEY = 'litmusical_detectives_v1';

/**
 * Carga el catálogo de detectives desde LocalStorage, migrando el progreso antiguo si es necesario.
 */
export function loadDetectives() {
  try {
    const saved = localStorage.getItem(DETECTIVES_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error cargando detectives de LocalStorage:', err);
  }

  // Si no existen datos previos en absoluto (primera carga de la app)
  const progresoAntiguo = loadUserProgress();
  const defaultDetective = {
    id: 'detective_valeria',
    nombre: 'Valeria',
    puntos: progresoAntiguo.puntos,
    nivel: progresoAntiguo.nivel,
    estrellas: progresoAntiguo.estrellas,
    avatar: '🕵️‍♀️',
    activo: true
  };
  const lista = [defaultDetective];
  saveDetectives(lista);
  return lista;
}

/**
 * Guarda la lista de detectives en LocalStorage y sincroniza con el archivo físico en disco
 */
export function saveDetectives(list) {
  try {
    localStorage.setItem(DETECTIVES_KEY, JSON.stringify(list));
    fetch('/api/detectives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(list)
    }).catch(() => {});
  } catch (err) {
    console.error('Error guardando detectives:', err);
  }
}
