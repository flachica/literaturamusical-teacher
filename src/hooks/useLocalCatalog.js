import { useState, useEffect, useRef } from 'react';
import {
  loadSongsCatalog,
  saveSongsCatalog,
  loadFiguresCatalog,
  saveFiguresCatalog,
  loadDetectives,
  saveDetectives,
  loadSuggestions,
  saveSuggestions
} from '../utils/storage';
import { playSuccessSound, playFailureSound, playAchievementSound } from '../utils/audioEffects';

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
  const logros = detectiveActivo?.logros || { abiertasRAE: 0, estrofasEscuchadas: 0, rachaComprension: 0, cancionesCompletadas: [] };
  const placasDesbloqueadas = detectiveActivo?.placasDesbloqueadas || [];

  // Catalog states (Songs, Literary Figures, Plugins & Dictionary)
  const [canciones, setCanciones] = useState(() => loadSongsCatalog());
  const [figuras, setFiguras] = useState(() => loadFiguresCatalog());
  const [plugins, setPlugins] = useState([]);
  const [diccionarioPlugins, setDiccionarioPlugins] = useState({});
  const [sugerencias, setSugerencias] = useState(() => loadSuggestions());
  const [audioStatus, setAudioStatus] = useState({});

  const handleEnviarSugerencia = (nuevaSug) => {
    const listaActualizada = [nuevaSug, ...sugerencias];
    setSugerencias(listaActualizada);
    saveSuggestions(listaActualizada);
    handleSumarPuntos(50);
  };

  const handleAprobarSugerencia = (sugId) => {
    const listaActualizada = sugerencias.map(s => s.id === sugId ? { ...s, estado: 'aprobada' } : s);
    setSugerencias(listaActualizada);
    saveSuggestions(listaActualizada);
    
    // Reward detective with +100 points and +1 star
    const targetSug = sugerencias.find(s => s.id === sugId);
    if (targetSug) {
      setDetectives(prev => {
        const actualizados = prev.map(d => {
          if (d.id === targetSug.detectiveId) {
            return {
              ...d,
              puntos: d.puntos + 100,
              estrellas: d.estrellas + 1
            };
          }
          return d;
        });
        saveDetectives(actualizados);
        return actualizados;
      });
      playAchievementSound();
    }
  };

  const handleMarcarCenaSugerencia = (sugId) => {
    const listaActualizada = sugerencias.map(s => s.id === sugId ? { ...s, estado: 'cena' } : s);
    setSugerencias(listaActualizada);
    saveSuggestions(listaActualizada);
  };

  const handleEliminarSugerencia = (sugId) => {
    const listaActualizada = sugerencias.filter(s => s.id !== sugId);
    setSugerencias(listaActualizada);
    saveSuggestions(listaActualizada);
  };

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

  const isInitialMount = useRef(true);

  // Fetch latest catalogs from disk endpoints on mount
  useEffect(() => {
    fetch(`/api/songs?t=${Date.now()}`)
      .then(res => res.json())
      .then(diskSongs => {
        if (Array.isArray(diskSongs)) {
          try { localStorage.setItem('litmusical_songs_catalog_v1', JSON.stringify(diskSongs)); } catch (_) {}
          setCanciones(diskSongs);
          comprobarDisponibilidadAudios(diskSongs);
          if (setCancionActual) {
            setCancionActual(prev => {
              const match = diskSongs.find(s => s.id === prev?.id);
              return match || diskSongs[0] || null;
            });
          }
        }
      })
      .catch(err => console.warn('Aviso al cargar canciones de disco:', err));

    fetch('/api/figuras')
      .then(res => res.json())
      .then(diskFigures => {
        if (Array.isArray(diskFigures) && diskFigures.length > 0) {
          try { localStorage.setItem('litmusical_figures_catalog_v1', JSON.stringify(diskFigures)); } catch (_) {}
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

    fetch('/api/sugerencias')
      .then(res => res.json())
      .then(diskSuggestions => {
        if (Array.isArray(diskSuggestions)) {
          setSugerencias(diskSuggestions);
        }
      })
      .catch(err => console.warn('Aviso al cargar sugerencias de disco:', err));

    fetch(`/api/plugins?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlugins(data);
          const mergedDict = {};
          data.forEach(p => {
            if (p.dictionary && typeof p.dictionary === 'object') {
              Object.assign(mergedDict, p.dictionary);
            }
          });
          setDiccionarioPlugins(mergedDict);
        }
      })
      .catch(err => console.warn('Aviso al cargar plugins:', err));
  }, []);

  // Sync songs catalog when changed
  useEffect(() => {
    if (Array.isArray(canciones) && canciones.length > 0) {
      comprobarDisponibilidadAudios(canciones);
      if (setCancionActual) {
        setCancionActual(prev => {
          if (!prev || !canciones.some(c => c.id === prev.id)) {
            return canciones[0] || null;
          }
          return prev;
        });
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    saveSongsCatalog(canciones);
  }, [canciones]);

  // Sync figures catalog when changed
  useEffect(() => {
    saveFiguresCatalog(figuras);
  }, [figuras]);

  // Sumar puntos al detective activo y subir de nivel
  const handleSumarPuntos = (cantidad) => {
    // Reproducir feedback sonoro de éxito al ganar puntos
    playSuccessSound();

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
        activo: esElPrimero,
        logros: { abiertasRAE: 0, estrofasEscuchadas: 0, rachaComprension: 0, cancionesCompletadas: [] },
        placasDesbloqueadas: []
      };
      nuevoDetCreado = nuevoDet;
      const listaActualizada = [...prev, nuevoDet];
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
    return nuevoDetCreado;
  };

  // Lógica de registro y actualización de logros
  const handleRegistrarLecturaDiccionario = () => {
    setDetectives(prev => {
      const listaActualizada = prev.map(d => {
        if (d.activo) {
          const logros = d.logros || { abiertasRAE: 0, estrofasEscuchadas: 0, rachaComprension: 0, cancionesCompletadas: [] };
          const abiertasRAE = (logros.abiertasRAE || 0) + 1;
          const nuevasPlacas = [...(d.placasDesbloqueadas || [])];
          
          if (abiertasRAE >= 5 && !nuevasPlacas.includes('lector')) {
            nuevasPlacas.push('lector');
            setTimeout(() => playAchievementSound(), 150);
          }

          return {
            ...d,
            logros: { ...logros, abiertasRAE },
            placasDesbloqueadas: nuevasPlacas
          };
        }
        return d;
      });
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  const handleRegistrarEstrofaEscuchada = () => {
    setDetectives(prev => {
      const listaActualizada = prev.map(d => {
        if (d.activo) {
          const logros = d.logros || { abiertasRAE: 0, estrofasEscuchadas: 0, rachaComprension: 0, cancionesCompletadas: [] };
          const estrofasEscuchadas = (logros.estrofasEscuchadas || 0) + 1;
          const nuevasPlacas = [...(d.placasDesbloqueadas || [])];

          if (estrofasEscuchadas >= 10 && !nuevasPlacas.includes('oido_lince')) {
            nuevasPlacas.push('oido_lince');
            setTimeout(() => playAchievementSound(), 150);
          }

          return {
            ...d,
            logros: { ...logros, estrofasEscuchadas },
            placasDesbloqueadas: nuevasPlacas
          };
        }
        return d;
      });
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  const handleRegistrarResultadoComprension = (esCorrecta) => {
    if (!esCorrecta) {
      playFailureSound();
      setDetectives(prev => {
        const listaActualizada = prev.map(d => {
          if (d.activo) {
            const logros = d.logros || { abiertasRAE: 0, estrofasEscuchadas: 0, rachaComprension: 0, cancionesCompletadas: [] };
            return {
              ...d,
              logros: { ...logros, rachaComprension: 0 }
            };
          }
          return d;
        });
        saveDetectives(listaActualizada);
        return listaActualizada;
      });
      return;
    }

    setDetectives(prev => {
      const listaActualizada = prev.map(d => {
        if (d.activo) {
          const logros = d.logros || { abiertasRAE: 0, estrofasEscuchadas: 0, rachaComprension: 0, cancionesCompletadas: [] };
          const rachaComprension = (logros.rachaComprension || 0) + 1;
          const nuevasPlacas = [...(d.placasDesbloqueadas || [])];

          if (rachaComprension >= 3 && !nuevasPlacas.includes('racha_poetica')) {
            nuevasPlacas.push('racha_poetica');
            setTimeout(() => playAchievementSound(), 150);
          }

          return {
            ...d,
            logros: { ...logros, rachaComprension },
            placasDesbloqueadas: nuevasPlacas
          };
        }
        return d;
      });
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
  };

  const handleRegistrarCancionCompletada = (cancionId) => {
    setDetectives(prev => {
      const listaActualizada = prev.map(d => {
        if (d.activo) {
          const logros = d.logros || { abiertasRAE: 0, estrofasEscuchadas: 0, rachaComprension: 0, cancionesCompletadas: [] };
          const cancionesCompletadas = [...(logros.cancionesCompletadas || [])];
          if (!cancionesCompletadas.includes(cancionId)) {
            cancionesCompletadas.push(cancionId);
          }
          const nuevasPlacas = [...(d.placasDesbloqueadas || [])];

          if (cancionesCompletadas.length >= 3 && !nuevasPlacas.includes('melomano')) {
            nuevasPlacas.push('melomano');
            setTimeout(() => playAchievementSound(), 150);
          }

          return {
            ...d,
            logros: { ...logros, cancionesCompletadas },
            placasDesbloqueadas: nuevasPlacas
          };
        }
        return d;
      });
      saveDetectives(listaActualizada);
      return listaActualizada;
    });
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

    // Limpiar sugerencias del buzón familiar pertenecientes al detective eliminado
    setSugerencias(prev => {
      const listaFiltrada = prev.filter(s => s.detectiveId !== id);
      saveSuggestions(listaFiltrada);
      return listaFiltrada;
    });
  };

  // Limpieza automática de sugerencias huérfanas (de detectives eliminados previamente)
  useEffect(() => {
    if (Array.isArray(detectives)) {
      const idsValidos = new Set(detectives.map(d => d.id));
      setSugerencias(prev => {
        const filtradas = prev.filter(s => s.detectiveId && idsValidos.has(s.detectiveId));
        if (filtradas.length !== prev.length) {
          saveSuggestions(filtradas);
          return filtradas;
        }
        return prev;
      });
    }
  }, [detectives]);

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

  const handleRestaurarBackup = ({ detectives: dList, canciones: cList, figuras: fList, sugerencias: sList }) => {
    if (Array.isArray(dList) && dList.length > 0) {
      setDetectives(dList);
      saveDetectives(dList);
    }
    if (Array.isArray(cList)) {
      setCanciones(cList);
      saveSongsCatalog(cList);
    }
    if (Array.isArray(fList)) {
      setFiguras(fList);
      saveFiguresCatalog(fList);
    }
    if (Array.isArray(sList)) {
      setSugerencias(sList);
      saveSuggestions(sList);
    }
  };

  return {
    canciones,
    setCanciones,
    figuras,
    setFiguras,
    plugins,
    diccionarioPlugins,
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
    logros,
    placasDesbloqueadas,
    comprobarDisponibilidadAudios,
    handleSumarPuntos,
    handleResetProgreso,
    handleGuardarCanciones,
    handleRestaurarBackup,
    sugerencias,
    handleEnviarSugerencia,
    handleAprobarSugerencia,
    handleMarcarCenaSugerencia,
    handleEliminarSugerencia,
    handleRegistrarLecturaDiccionario,
    handleRegistrarEstrofaEscuchada,
    handleRegistrarResultadoComprension,
    handleRegistrarCancionCompletada
  };
}
