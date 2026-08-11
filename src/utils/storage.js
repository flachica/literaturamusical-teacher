import { CANCIONES } from '../data/mockData';

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
  } catch (err) {
    console.error('Error guardando progreso en LocalStorage:', err);
  }
}

/**
 * Resetea el progreso a los valores iniciales
 */
export function resetUserProgress() {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch (err) {
    console.error('Error reseteando progreso:', err);
  }
  return DEFAULT_PROGRESS;
}

/**
 * Carga el catálogo de canciones (LocalStorage o mockData por defecto)
 */
export function loadSongsCatalog() {
  try {
    const saved = localStorage.getItem(SONGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(savedSong => {
          const defaultSong = CANCIONES.find(c => c.id === savedSong.id);
          if (defaultSong) {
            return {
              ...savedSong,
              youtubeId: defaultSong.youtubeId,
              spotifyTrackId: defaultSong.spotifyTrackId || savedSong.spotifyTrackId
            };
          }
          return savedSong;
        });
      }
    }
  } catch (err) {
    console.error('Error cargando canciones de LocalStorage:', err);
  }
  return CANCIONES;
}

/**
 * Guarda el catálogo completo de canciones en LocalStorage
 */
export function saveSongsCatalog(songs) {
  try {
    localStorage.setItem(SONGS_KEY, JSON.stringify(songs));
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
