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
  const [localAudioSrc, setLocalAudioSrc] = useState(null);

  // Reset playback position on song change
  useEffect(() => {
    setIsPlaying(false);
    setPosicion(0);
    setLocalAudioSrc(null);
  }, [cancionActual?.id]);

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
      />

      {/* Main Mode Switcher: Modo Detective (Hija) vs Modo Admin (Padres) */}
      <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setModoPrincipal('detective')}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              background: modoPrincipal === 'detective' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(15, 23, 42, 0.6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: modoPrincipal === 'detective' ? '0 0 15px rgba(139, 92, 246, 0.4)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Shield size={18} /> 👧 Modo Detective (Para Tu Hija)
          </button>

          <button
            onClick={() => setModoPrincipal('diccionario')}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              background: modoPrincipal === 'diccionario' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(15, 23, 42, 0.6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: modoPrincipal === 'diccionario' ? '0 0 15px rgba(6, 182, 212, 0.4)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={18} /> 📖 Diccionario de Figuras
          </button>
        </div>

        <button
          onClick={() => setModoPrincipal('admin')}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.9rem',
            background: modoPrincipal === 'admin' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(30, 41, 59, 0.7)',
            color: modoPrincipal === 'admin' ? '#ffffff' : '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <Settings size={18} /> 👨‍👩‍👧 Modo Admin y Padres
        </button>

      </div>

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
              localAudioSrc={localAudioSrc}
              setLocalAudioSrc={setLocalAudioSrc}
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

      {/* Footer linking to memory skill & backlog */}
      <footer style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
          <span>LitMusical v0.2.0 • Diseñado para aprender literatura con música</span> <Heart size={14} color="#ec4899" fill="#ec4899" />
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', fontSize: '0.8rem' }}>
          <a href="#" style={{ color: '#c084fc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={12} /> BACKLOG.md
          </a>
          <span>•</span>
          <a href="#" style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Code2 size={12} /> Skill: litmusical-guide
          </a>
        </div>
      </footer>

    </div>
  );
}
