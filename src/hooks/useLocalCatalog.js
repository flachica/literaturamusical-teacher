import { useState, useEffect } from 'react';
import {
  loadSongsCatalog,
  saveSongsCatalog,
  loadFiguresCatalog,
  saveFiguresCatalog,
  loadDetectives,
  saveDetectives
} from '../utils/storage';

/**
 * Hook personalizado para gestionar el progreso de los detectives (multi-jugador),
 * el catálogo de canciones, el catálogo de figuras literarias,
 * la persistencia local-first y la verificación física de audios.
 */
export default function useLocalCatalog(cancionActual, setCancionActual) {
  // Lista de detectives (persistencia local y disco)
  const [detectives, setDetectives] = useState(() => loadDetectives());

  // Detective activo actual
  const detectiveActivo = detectives.find(d => d.activo) || detectives[0] || null;
  const { puntos, nivel, estrellas } = detectiveActivo || { puntos: 0, nivel: 1, estrellas: 0 };

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
    fetch(`/api/songs?t=${Date.now()}`)
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

    fetch('/api/detectives')
      .then(res => res.json())
      .then(diskDetectives => {
        if (Array.isArray(diskDetectives) && diskDetectives.length > 0) {
          setDetectives(diskDetectives);
        }
      })
      .catch(err => console.warn('Aviso al cargar detectives de disco:', err));
  }, []);

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

  // Sumar puntos al detective activo y subir de nivel
  const handleSumarPuntos = (cantidad) => {
    setDetectives(prev => {
      const listaActualizada = prev.map(d => {
        if (d.activo) {
          const nuevosPuntos = d.puntos + cantidad;
          const nuevoNivel = Math.floor(nuevosPuntos / 300) + 1; // 300 pts por nivel
          const nuevasEstrellas = d.estrellas + Math.floor(cantidad / 100);
          return {
            ...d,
            puntos: nuevosPuntos,
            nivel: nuevoNivel,
            estrellas: nuevasEstrellas
          };
        }
        return d;
      });
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  // Cambiar el detective activo
  const handleSeleccionarDetective = (id) => {
    setDetectives(prev => {
      const listaActualizada = prev.map(d => ({
        ...d,
        activo: d.id === id
      }));
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  // Crear un nuevo detective
  const handleCrearDetective = (nombre, avatar = '🕵️‍♀️') => {
    let nuevoDetCreado;
    setDetectives(prev => {
      const esElPrimero = prev.length === 0;
      const nuevoDet = {
        id: `detective_${Date.now()}`,
        nombre: nombre.trim() || 'Nuevo Detective',
        puntos: 0,
        nivel: 1,
        estrellas: 0,
        avatar,
        activo: esElPrimero
      };
      nuevoDetCreado = nuevoDet;
      const listaActualizada = [...prev, nuevoDet];
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
    return nuevoDetCreado;
  };

  // Renombrar un detective
  const handleRenombrarDetective = (id, nuevoNombre) => {
    setDetectives(prev => {
      const listaActualizada = prev.map(d => {
        if (d.id === id) {
          return { ...d, nombre: nuevoNombre.trim() || d.nombre };
        }
        return d;
      });
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  // Eliminar un detective
  const handleEliminarDetective = (id) => {
    setDetectives(prev => {
      const estabaActivo = prev.find(d => d.id === id)?.activo;
      const listaActualizada = prev.filter(d => d.id !== id);
      if (estabaActivo && listaActualizada.length > 0) {
        listaActualizada[0].activo = true;
      }
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  // Resetear el progreso de un detective específico (o el activo por defecto)
  const handleResetProgreso = (id) => {
    const targetId = id || detectiveActivo.id;
    setDetectives(prev => {
      const listaActualizada = prev.map(d => {
        if (d.id === targetId) {
          return {
            ...d,
            puntos: 0,
            nivel: 1,
            estrellas: 0
          };
        }
        return d;
      });
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  const handleGuardarCanciones = (nuevoCat) => {
    setCanciones(nuevoCat);
  };

  return {
    canciones,
    setCanciones,
    figuras,
    setFiguras,
    audioStatus,
    detectives,
    detectiveActivo,
    handleSeleccionarDetective,
    handleCrearDetective,
    handleRenombrarDetective,
    handleEliminarDetective,
    puntos,
    nivel,
    estrellas,
    comprobarDisponibilidadAudios,
    handleSumarPuntos,
    handleResetProgreso,
    handleGuardarCanciones
  };
}
