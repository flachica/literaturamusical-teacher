import { useState, useEffect } from 'react';
import {
  loadUserProgress,
  saveUserProgress,
  resetUserProgress,
  loadSongsCatalog,
  saveSongsCatalog,
  resetSongsCatalog,
  loadFiguresCatalog,
  saveFiguresCatalog
} from '../utils/storage';

/**
 * Hook personalizado para gestionar el progreso de la detective,
 * el catálogo de canciones, el catálogo de figuras literarias,
 * la persistencia local-first y la verificación física de audios.
 */
export default function useLocalCatalog(cancionActual, setCancionActual) {
  // User progress state (Persisted in LocalStorage)
  const [progreso, setProgreso] = useState(() => loadUserProgress());
  const { puntos, nivel, estrellas } = progreso;

  // Catalog states (Songs & Literary Figures)
  const [canciones, setCanciones] = useState(() => loadSongsCatalog());
  const [figuras, setFiguras] = useState(() => loadFiguresCatalog());
  const [audioStatus, setAudioStatus] = useState({});

  // Verify availability of audio files on Deno/Node backend in development
  const comprobarDisponibilidadAudios = async (catalogToCheck = canciones) => {
    const statuses = {};
    for (const c of catalogToCheck) {
      if (c.audioPreviewUrl && c.audioPreviewUrl.startsWith('/audio/')) {
        try {
          const res = await fetch('/api/check-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: c.audioPreviewUrl })
          });
          const data = await res.json();
          statuses[c.id] = data.exists ? 'disponible' : 'perdido';
        } catch (err) {
          statuses[c.id] = 'error';
        }
      } else if (c.audioPreviewUrl && (c.audioPreviewUrl.startsWith('http://') || c.audioPreviewUrl.startsWith('https://'))) {
        statuses[c.id] = 'red'; // External URL
      } else {
        statuses[c.id] = 'vacio'; // No audio configured
      }
    }
    setAudioStatus(statuses);
  };

  // Fetch latest catalogs from disk endpoints on mount
  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(diskSongs => {
        if (Array.isArray(diskSongs) && diskSongs.length > 0) {
          setCanciones(diskSongs);
          comprobarDisponibilidadAudios(diskSongs);
          if (setCancionActual) {
            setCancionActual(prev => {
              const match = diskSongs.find(s => s.id === prev?.id);
              return match || diskSongs[0];
            });
          }
        }
      })
      .catch(err => console.warn('Aviso al cargar canciones de disco:', err));

    fetch('/api/figuras')
      .then(res => res.json())
      .then(diskFigures => {
        if (Array.isArray(diskFigures) && diskFigures.length > 0) {
          setFiguras(diskFigures);
        }
      })
      .catch(err => console.warn('Aviso al cargar figuras de disco:', err));
  }, []);

  // Sync user progress when changed
  useEffect(() => {
    saveUserProgress(progreso);
  }, [progreso]);

  // Sync songs catalog when changed
  useEffect(() => {
    saveSongsCatalog(canciones);
    comprobarDisponibilidadAudios(canciones);
    if (setCancionActual) {
      setCancionActual(prev => {
        if (!prev || !canciones.some(c => c.id === prev.id)) {
          return canciones[0] || null;
        }
        return prev;
      });
    }
  }, [canciones]);

  // Sync figures catalog when changed
  useEffect(() => {
    saveFiguresCatalog(figuras);
  }, [figuras]);

  const handleSumarPuntos = (cantidad) => {
    const nuevosPuntos = puntos + cantidad;
    const nuevoNivel = Math.floor(nuevosPuntos / 300) + 1; // 300 pts per level
    const nuevasEstrellas = estrellas + Math.floor(cantidad / 100);
    setProgreso({
      puntos: nuevosPuntos,
      nivel: nuevoNivel,
      estrellas: nuevasEstrellas
    });
  };

  const handleResetProgreso = () => {
    const defaultProgress = resetUserProgress();
    setProgreso(defaultProgress);
  };

  const handleGuardarCanciones = (nuevoCat) => {
    setCanciones(nuevoCat);
  };

  const handleRestaurarCanciones = () => {
    const originalCat = resetSongsCatalog();
    setCanciones(originalCat);
  };

  return {
    canciones,
    setCanciones,
    figuras,
    setFiguras,
    audioStatus,
    progreso,
    setProgreso,
    comprobarDisponibilidadAudios,
    handleSumarPuntos,
    handleResetProgreso,
    handleGuardarCanciones,
    handleRestaurarCanciones
  };
}
