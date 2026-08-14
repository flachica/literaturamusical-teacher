import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ModoDetectiveGuiado from './components/ModoDetectiveGuiado';
import ModoAdmin from './components/ModoAdmin';
import FigureCatalog from './components/FigureCatalog';
import PlayerWidget from './components/PlayerWidget';

import useAudioPlayer from './hooks/useAudioPlayer';
import useLocalCatalog from './hooks/useLocalCatalog';

export default function App() {
  const [modoIA, setModoIA] = useState(true);
  const [modoPrincipal, setModoPrincipal] = useState('detective'); // 'detective' | 'admin' | 'diccionario'
  const [cancionActual, setCancionActual] = useState(null);

  // Custom hook for catalogs, physical audio checks and user progress
  const {
    canciones,
    figuras,
    setFiguras,
    audioStatus,
    progreso,
    handleSumarPuntos,
    handleResetProgreso,
    handleGuardarCanciones,
    handleRestaurarCanciones
  } = useLocalCatalog(cancionActual, setCancionActual);

  const { puntos, nivel, estrellas } = progreso;

  // Custom hook for unified audio player playback state
  const {
    isPlaying,
    setIsPlaying,
    posicion,
    setPosicion,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    localAudioSrc,
    setLocalAudioSrc,
    audioRef,
    handleSeekTime
  } = useAudioPlayer(cancionActual);

  // Detective mission step & full lyrics toggle state
  const [paso, setPaso] = useState(1);
  const [mostrarLetraCompleta, setMostrarLetraCompleta] = useState(true);

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
              audioStatus={audioStatus}
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
              audioStatus={audioStatus}
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
        <FigureCatalog figuras={figuras} />
      )}

      {/* VIEW 3: MODO ADMIN / PADRES */}
      {modoPrincipal === 'admin' && (
        <ModoAdmin
          modoIA={modoIA}
          setModoIA={setModoIA}
          canciones={canciones}
          figuras={figuras}
          audioStatus={audioStatus}
          onGuardarCanciones={handleGuardarCanciones}
          onRestaurarCanciones={handleRestaurarCanciones}
          onGuardarFiguras={setFiguras}
          puntos={puntos}
          nivel={nivel}
          estrellas={estrellas}
          onResetProgreso={handleResetProgreso}
        />
      )}

    </div>
  );
}
