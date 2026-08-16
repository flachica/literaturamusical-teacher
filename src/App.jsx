import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ModoDetectiveGuiado from './components/ModoDetectiveGuiado';
import ModoAdmin from './components/ModoAdmin';
import FigureCatalog from './components/FigureCatalog';
import PlayerWidget from './components/PlayerWidget';
import MochilaModal from './components/MochilaModal';
import { X } from 'lucide-react';

import useAudioPlayer from './hooks/useAudioPlayer';
import useLocalCatalog from './hooks/useLocalCatalog';

export default function App() {
  const [modoIA, setModoIA] = useState(true);
  const [modoPrincipal, setModoPrincipal] = useState('detective'); // 'detective' | 'admin' | 'diccionario'
  const [cancionActual, setCancionActual] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('canciones'); // 'canciones' | 'figuras' | 'ajustes'
  const [mostrarSelectorDetectives, setMostrarSelectorDetectives] = useState(false);
  const [mochilaAbierta, setMochilaAbierta] = useState(false);

  // Custom hook for catalogs, physical audio checks, user progress and multi-detectives
  const {
    canciones,
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
    logros,
    placasDesbloqueadas,
    handleSumarPuntos,
    handleResetProgreso,
    handleGuardarCanciones,
    handleRegistrarLecturaDiccionario,
    handleRegistrarEstrofaEscuchada,
    handleRegistrarResultadoComprension,
    handleRegistrarCancionCompletada
  } = useLocalCatalog(cancionActual, setCancionActual);

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

  React.useEffect(() => {
    if (!mostrarSelectorDetectives) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMostrarSelectorDetectives(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (detectiveActivo) {
          handleSeleccionarDetective(detectiveActivo.id);
        }
        setMostrarSelectorDetectives(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mostrarSelectorDetectives, detectiveActivo, handleSeleccionarDetective]);

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
        pestanaActiva={pestanaActiva}
        setPestanaActiva={setPestanaActiva}
        detectiveActivo={detectiveActivo}
        onAbrirSelector={() => setMostrarSelectorDetectives(true)}
        onAbrirMochila={() => setMochilaAbierta(true)}
      />

      {/* VIEW 1: MODO DETECTIVE GUIADO (LIMPIO Y PASO A PASO PARA 9 AÑOS) */}      {modoPrincipal === 'detective' && (
        <div>
          {detectives.length === 0 ? (
            <div className="glass-panel modal-content-animate" style={{ padding: '40px', textAlign: 'center', marginTop: '30px', border: '2px solid #8b5cf6', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)', borderRadius: '24px', maxWidth: '600px', margin: '40px auto 0' }}>
              <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '20px', lineHeight: 1 }}>🕵️‍♀️🔍</span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
                ¡Bienvenido a la Escuela de Detectives!
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                Para empezar a resolver divertidos misterios de la literatura musical, pídele a papá o mamá que registre tu perfil de detective en la sección de administración.
              </p>
              <button
                onClick={() => {
                  setModoPrincipal('admin');
                  setPestanaActiva('ajustes');
                }}
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Ir a Crear mi Detective 🚀
              </button>
            </div>
          ) : canciones.length === 0 ? (
            <div className="glass-panel modal-content-animate" style={{ padding: '40px', textAlign: 'center', marginTop: '30px', border: '2px solid #8b5cf6', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)', borderRadius: '24px', maxWidth: '600px', margin: '40px auto 0' }}>
              <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: '20px', lineHeight: 1 }}>🎵🔍</span>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginBottom: '12px' }}>
                ¡El catálogo está vacío!
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                Todavía no hay canciones disponibles para investigar. Pídele a papá o mamá que vaya a la sección de administración para añadir la primera canción con música y figuras literarias.
              </p>
              <button
                onClick={() => {
                  setModoPrincipal('admin');
                  setPestanaActiva('canciones');
                }}
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Ir a Añadir Canciones ➕
              </button>
            </div>
          ) : (
            <>
              {/* Synchronized Main Audio Player Widget */}
              {cancionActual && (
                <PlayerWidget
                  cancion={cancionActual}
                  canciones={canciones}
                  onSeleccionarCancion={setCancionActual}
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
                  logros={logros}
                  placasDesbloqueadas={placasDesbloqueadas}
                  onRegistrarLecturaDiccionario={handleRegistrarLecturaDiccionario}
                  onRegistrarEstrofaEscuchada={handleRegistrarEstrofaEscuchada}
                  onRegistrarResultadoComprension={handleRegistrarResultadoComprension}
                  onRegistrarCancionCompletada={handleRegistrarCancionCompletada}
                />
              )}
            </>
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
          canciones={canciones}
          figuras={figuras}
          audioStatus={audioStatus}
          onGuardarCanciones={handleGuardarCanciones}
          onGuardarFiguras={setFiguras}
          puntos={puntos}
          nivel={nivel}
          estrellas={estrellas}
          onResetProgreso={handleResetProgreso}
          pestanaActiva={pestanaActiva}
          detectives={detectives}
          detectiveActivo={detectiveActivo}
          onSeleccionarDetective={handleSeleccionarDetective}
          onCrearDetective={handleCrearDetective}
          onRenombrarDetective={handleRenombrarDetective}
          onEliminarDetective={handleEliminarDetective}
        />
      )}

      {/* Modal Selector de Detectives Infantil (Global y Seguro a nivel de raíz) */}
      {mostrarSelectorDetectives && (
        <div
          className="modal-overlay-animate"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
        >
          <div
            className="modal-content-animate"
            style={{
              background: '#1e293b',
              padding: '24px',
              borderRadius: '24px',
              border: '2px solid #8b5cf6',
              maxWidth: '460px',
              width: '100%',
              maxHeight: 'calc(100vh - 40px)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 35px rgba(139, 92, 246, 0.3)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              🕵️‍♂️ ¿Quién va a investigar hoy?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Selecciona tu perfil de detective para cargar tus puntos, nivel y estrellas.
            </p>

            {/* Listado con scroll interno seguro si hay muchos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '12px',
              marginBottom: '20px',
              overflowY: 'auto',
              maxHeight: '320px',
              padding: '4px'
            }}>
              {detectives.map(det => {
                const esActivo = det.id === detectiveActivo?.id;
                return (
                  <button
                    key={det.id}
                    onClick={() => {
                      handleSeleccionarDetective(det.id);
                      setMostrarSelectorDetectives(false);
                    }}
                    style={{
                      background: esActivo ? 'rgba(139, 92, 246, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                      border: `2px solid ${esActivo ? '#8b5cf6' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '18px',
                      padding: '16px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      boxShadow: esActivo ? '0 0 12px rgba(139, 92, 246, 0.2)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{det.avatar}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: esActivo ? '#c084fc' : '#ffffff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                      {det.nombre}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: esActivo ? '#a78bfa' : 'var(--text-muted)', fontWeight: 700 }}>
                      {det.puntos} PTS
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto' }}>
              <button
                type="button"
                onClick={() => setMostrarSelectorDetectives(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <X size={16} /> Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mochila de Detective (Logros y Placas) Popup Modal */}
      <MochilaModal
        isOpen={mochilaAbierta}
        onClose={() => setMochilaAbierta(false)}
        detectiveActivo={detectiveActivo}
        puntos={puntos}
        nivel={nivel}
        estrellas={estrellas}
        logros={logros}
        placasDesbloqueadas={placasDesbloqueadas}
      />

    </div>
  );
}
