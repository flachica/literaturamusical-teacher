import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ModoDetectiveGuiado from './components/ModoDetectiveGuiado';
import ModoAdmin from './components/ModoAdmin';
import FigureCatalog from './components/FigureCatalog';
import PlayerWidget from './components/PlayerWidget';

import {
  loadUserProgress,
  saveUserProgress,
  resetUserProgress,
  loadSongsCatalog,
  saveSongsCatalog,
  resetSongsCatalog
} from './utils/storage';

import { Shield, Settings, Heart, FileText, Code2, BookOpen } from 'lucide-react';

export default function App() {
  const [modoIA, setModoIA] = useState(true);

  // User progress state (Persisted in LocalStorage)
  const [progreso, setProgreso] = useState(() => loadUserProgress());
  const { puntos, nivel, estrellas } = progreso;

  // Songs catalog state (Persisted in LocalStorage)
  const [canciones, setCanciones] = useState(() => loadSongsCatalog());
  const [modoPrincipal, setModoPrincipal] = useState('detective'); // 'detective' | 'admin' | 'diccionario'
  const [cancionActual, setCancionActual] = useState(() => canciones[0] || null);

  // Unified Playback State (Synchronized across PlayerWidget and WaveformScrubber)
  const [isPlaying, setIsPlaying] = useState(false);
  const [posicion, setPosicion] = useState(0); // 0 to 100%
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [localAudioSrc, setLocalAudioSrc] = useState(null);
  const audioRef = React.useRef(null);

  // Detective mission step & full lyrics toggle state
  const [paso, setPaso] = useState(1);
  const [mostrarLetraCompleta, setMostrarLetraCompleta] = useState(true);

  // Fetch latest catalog from disk endpoint (/api/songs) on mount
  useEffect(() => {
    fetch('/api/songs')
      .then(res => res.json())
      .then(diskSongs => {
        if (Array.isArray(diskSongs) && diskSongs.length > 0) {
          setCanciones(diskSongs);
          setCancionActual(prev => {
            const match = diskSongs.find(s => s.id === prev?.id);
            return match || diskSongs[0];
          });
        }
      })
      .catch(err => console.warn('Aviso al cargar canciones de disco:', err));
  }, []);

  // Reset playback position and detective step on song change
  useEffect(() => {
    setIsPlaying(false);
    setPosicion(0);
    setCurrentTime(0);
    setDuration(180);
    setLocalAudioSrc(null);
    setPaso(1);
  }, [cancionActual?.id]);

  const handleSeekTime = (targetSeconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = targetSeconds;
    }
    setCurrentTime(targetSeconds);
  };

  // Sync user progress to LocalStorage when changed
  useEffect(() => {
    saveUserProgress(progreso);
  }, [progreso]);

  // Sync songs catalog to LocalStorage when changed
  useEffect(() => {
    saveSongsCatalog(canciones);
    // Ensure selected song is valid
    if (!cancionActual || !canciones.some(c => c.id === cancionActual.id)) {
      setCancionActual(canciones[0] || null);
    }
  }, [canciones]);

  const handleSumarPuntos = (cantidad) => {
    const nuevosPuntos = puntos + cantidad;
    let nuevoNivel = nivel;
    let nuevasEstrellas = estrellas;

    if (nuevosPuntos >= 600 && nivel < 4) {
      nuevoNivel = 4;
      nuevasEstrellas = estrellas + 1;
    }

    setProgreso({
      puntos: nuevosPuntos,
      nivel: nuevoNivel,
      estrellas: nuevasEstrellas
    });
  };

  const handleResetProgreso = () => {
    const defaultProg = resetUserProgress();
    setProgreso(defaultProg);
  };

  const handleGuardarCanciones = (nuevoCatálogo) => {
    setCanciones(nuevoCatálogo);
  };

  const handleRestaurarCanciones = () => {
    const defaultCat = resetSongsCatalog();
    setCanciones(defaultCat);
    setCancionActual(defaultCat[0]);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px 40px' }}>
      
      {/* Navbar Header */}
      <Navbar
        modoIA={modoIA}
        setModoIA={setModoIA}
        puntos={puntos}
        nivel={nivel}
        estrellas={estrellas}
        modoPrincipal={modoPrincipal}
        setModoPrincipal={setModoPrincipal}
        onResetProgreso={handleResetProgreso}
      />

      {/* VIEW 1: MODO DETECTIVE GUIADO (LIMPIO Y PASO A PASO PARA 9 AÑOS) */}
      {modoPrincipal === 'detective' && (
        <div>
          {/* Song Switcher strip for Detective */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap' }}>Elegir Canción:</span>
            {canciones.map((c) => {
              const isSelected = cancionActual && cancionActual.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCancionActual(c)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: isSelected ? 'var(--primary)' : 'rgba(15, 23, 42, 0.6)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'}`,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  🎵 {c.titulo} ({c.artistaNombre})
                </button>
              );
            })}
          </div>

          {/* Synchronized Main Audio Player Widget */}
          {cancionActual && (
            <PlayerWidget
              cancion={cancionActual}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              posicion={posicion}
              setPosicion={setPosicion}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              duration={duration}
              setDuration={setDuration}
              localAudioSrc={localAudioSrc}
              setLocalAudioSrc={setLocalAudioSrc}
              audioRef={audioRef}
              paso={paso}
              setPaso={setPaso}
              mostrarLetraCompleta={mostrarLetraCompleta}
              setMostrarLetraCompleta={setMostrarLetraCompleta}
            />
          )}

          {/* Guided Detective Experience (Meaning first, then Figure labeling + RAE) */}
          {cancionActual && (
            <ModoDetectiveGuiado
              cancion={cancionActual}
              onGanarPuntos={handleSumarPuntos}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              posicion={posicion}
              setPosicion={setPosicion}
              currentTime={currentTime}
              onSeekTime={handleSeekTime}
              duration={duration}
              paso={paso}
              setPaso={setPaso}
              mostrarLetraCompleta={mostrarLetraCompleta}
              setMostrarLetraCompleta={setMostrarLetraCompleta}
            />
          )}
        </div>
      )}

      {/* VIEW 2: DICCIONARIO DE FIGURAS */}
      {modoPrincipal === 'diccionario' && (
        <FigureCatalog />
      )}

      {/* VIEW 3: MODO ADMIN / PADRES */}
      {modoPrincipal === 'admin' && (
        <ModoAdmin
          modoIA={modoIA}
          setModoIA={setModoIA}
          canciones={canciones}
          onGuardarCanciones={handleGuardarCanciones}
          onRestaurarCanciones={handleRestaurarCanciones}
          puntos={puntos}
          nivel={nivel}
          estrellas={estrellas}
          onResetProgreso={handleResetProgreso}
        />
      )}

    </div>
  );
}
