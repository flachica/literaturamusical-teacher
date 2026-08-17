import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playFailureSound } from '../utils/audioEffects';

import SongLyricsPanel from './detective/SongLyricsPanel';
import StanzaReader from './detective/StanzaReader';
import ComprehensionChallenge from './detective/ComprehensionChallenge';
import FigureChallenge from './detective/FigureChallenge';
import ChallengeCelebration from './detective/ChallengeCelebration';
import SugerirFiguraModal from './detective/SugerirFiguraModal';

export default function ModoDetectiveGuiado({
  cancion,
  figuras,
  diccionario,
  onGanarPuntos,
  detectiveActivo,
  onEnviarSugerencia,
  isPlaying,
  setIsPlaying,
  posicion,
  setPosicion,
  currentTime = 0,
  onSeekTime,
  duration,
  paso,
  setPaso,
  mostrarLetraCompleta,
  setMostrarLetraCompleta,
  audioStatus,
  logros,
  placasDesbloqueadas,
  onRegistrarLecturaDiccionario,
  onRegistrarEstrofaEscuchada,
  onRegistrarResultadoComprension,
  onRegistrarCancionCompletada
}) {
  const estadoAudio = audioStatus?.[cancion?.id] || 'vacio';
  const tieneAudio = cancion?.audioPreviewUrl && estadoAudio !== 'perdido' && estadoAudio !== 'vacio';

  const [versoActual, setVersoActual] = useState(cancion.versos[0]);
  const [palabraRaeActiva, setPalabraRaeActiva] = useState(null);
  const [opcionComprension, setOpcionComprension] = useState(null);
  const [opcionFigura, setOpcionFigura] = useState(null);
  const [sugerirModalAbierto, setSugerirModalAbierto] = useState(false);
  const estrofasDomRefs = React.useRef({});
  const lyricsContainerRef = React.useRef(null);

  const totalEstrofas = Math.max(...(cancion.versos?.map(v => v.estrofaNum || 1) || [1]));

  // Group verses by estrofaNum for continuous Karaoke display
  const estrofasAgrupadas = React.useMemo(() => {
    if (!cancion?.versos) return [];
    const map = {};
    cancion.versos.forEach(v => {
      const num = v.estrofaNum || 1;
      if (!map[num]) map[num] = [];
      map[num].push(v);
    });
    return Object.entries(map).map(([num, versos]) => ({
      estrofaNum: Number(num),
      versos
    }));
  }, [cancion?.versos]);

  const handlePlayEstrofa = (tiempoInicio) => {
    if (tieneAudio && typeof tiempoInicio === 'number' && onSeekTime) {
      onSeekTime(tiempoInicio);
      if (setIsPlaying) setIsPlaying(true);
      if (onRegistrarEstrofaEscuchada) onRegistrarEstrofaEscuchada();
    }
  };

  const handleCambiarEstrofa = (nuevaEstrofaNum) => {
    const primerVersoDeEstrofa = cancion.versos.find(v => (v.estrofaNum || 1) === nuevaEstrofaNum);
    if (primerVersoDeEstrofa) {
      setVersoActual(primerVersoDeEstrofa);
      setPaso(1);
      setOpcionComprension(null);
      setOpcionFigura(null);

      if (tieneAudio && onSeekTime && typeof primerVersoDeEstrofa.tiempoInicio === 'number') {
        onSeekTime(primerVersoDeEstrofa.tiempoInicio);
      }
    }
  };

  // Auto-scroll ONLY when changing stanzas
  React.useEffect(() => {
    const activeEstrofaNum = versoActual?.estrofaNum || 1;
    if (activeEstrofaNum && estrofasDomRefs.current[activeEstrofaNum] && lyricsContainerRef.current) {
      const container = lyricsContainerRef.current;
      const element = estrofasDomRefs.current[activeEstrofaNum];

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const targetScrollTop = container.scrollTop + (elementRect.top - containerRect.top) - (container.clientHeight / 2) + (element.clientHeight / 2);

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
  }, [versoActual?.estrofaNum]);

  // Automatically sync active verse smoothly based on real audio currentTime
  React.useEffect(() => {
    if (!tieneAudio) return;
    if (!cancion?.versos || cancion.versos.length === 0) return;

    let versoCorrespondiente = null;
    const tieneTimestamps = cancion.versos.some(v => typeof v.tiempoInicio === 'number');

    if (tieneTimestamps) {
      const effectiveTime = currentTime + 1.85;
      const validos = cancion.versos.filter(v => typeof v.tiempoInicio === 'number');
      for (let i = validos.length - 1; i >= 0; i--) {
        if (effectiveTime >= validos[i].tiempoInicio) {
          versoCorrespondiente = validos[i];
          break;
        }
      }
      if (!versoCorrespondiente && effectiveTime < validos[0].tiempoInicio) {
        versoCorrespondiente = validos[0];
      }
    } else {
      const idx = Math.min(
        Math.floor((posicion / 100) * cancion.versos.length),
        cancion.versos.length - 1
      );
      versoCorrespondiente = cancion.versos[idx];
    }

    if (versoCorrespondiente && versoCorrespondiente.linea !== versoActual?.linea) {
      const cambioDeEstrofa = (versoCorrespondiente.estrofaNum || 1) !== (versoActual?.estrofaNum || 1);
      setVersoActual(versoCorrespondiente);
      if (cambioDeEstrofa) {
        setPaso(1);
        setOpcionComprension(null);
        setOpcionFigura(null);
      }
    }
  }, [currentTime, cancion, versoActual?.linea, setPaso]);

  const handleResponderComprension = (opcion) => {
    setOpcionComprension(opcion);
    if (onRegistrarResultadoComprension) {
      onRegistrarResultadoComprension(opcion.correcta);
    }
    if (opcion.correcta && onGanarPuntos) {
      onGanarPuntos(50);
    }
  };

  const handleResponderFigura = (figuraId) => {
    setOpcionFigura(figuraId);
    if (figuraId === versoActual.figuraId) {
      setPaso(4);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onGanarPuntos) onGanarPuntos(150);
      if (onRegistrarCancionCompletada) onRegistrarCancionCompletada(cancion.id);
    } else {
      playFailureSound();
    }
  };

  const handleReiniciar = () => {
    setPaso(1);
    setOpcionComprension(null);
    setOpcionFigura(null);
    setPalabraRaeActiva(null);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: mostrarLetraCompleta ? 'minmax(340px, 1fr) 1.2fr' : '1fr',
      gap: '20px',
      maxWidth: mostrarLetraCompleta ? '1180px' : '780px',
      margin: '0 auto',
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      
      {/* COLUMN 1: FULL SONG LYRICS (LEFT PANEL) */}
      {mostrarLetraCompleta && (
        <SongLyricsPanel
          cancion={cancion}
          versoActual={versoActual}
          totalEstrofas={totalEstrofas}
          estrofasAgrupadas={estrofasAgrupadas}
          estrofasDomRefs={estrofasDomRefs}
          lyricsContainerRef={lyricsContainerRef}
          onSeekTime={onSeekTime}
        />
      )}

      {/* COLUMN 2: ACTIVE VERSE DETECTIVE CHALLENGE (RIGHT PANEL) */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        height: '560px',
        maxHeight: '560px',
        overflowY: 'auto',
        border: paso === 4 ? '2.5px solid #10b981' : '1px solid rgba(139, 92, 246, 0.35)',
        background: 'rgba(15, 23, 42, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease'
      }}>
        
        {/* Step Badge Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '16px', flexShrink: 0 }}>
          <div>
            {paso === 1 && <span className="badge badge-purple" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>Paso 1: Leer y Escuchar</span>}
            {paso === 2 && <span className="badge badge-cyan" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>Paso 2: Comprensión</span>}
            {paso === 3 && <span className="badge badge-pink" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>Paso 3: Figura Poética</span>}
            {paso === 4 && <span className="badge" style={{ background: '#10b981', color: '#fff', padding: '4px 10px', fontSize: '0.72rem' }}>¡Reto Superado! 🎉</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 800 }}>
              Estrofa {versoActual.estrofaNum || 1} de {totalEstrofas}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => handleCambiarEstrofa((versoActual.estrofaNum || 1) - 1)}
                disabled={(versoActual.estrofaNum || 1) <= 1}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  cursor: (versoActual.estrofaNum || 1) <= 1 ? 'not-allowed' : 'pointer',
                  opacity: (versoActual.estrofaNum || 1) <= 1 ? 0.4 : 1
                }}
                title="Estrofa Anterior"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => handleCambiarEstrofa((versoActual.estrofaNum || 1) + 1)}
                disabled={(versoActual.estrofaNum || 1) >= totalEstrofas}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '2px 6px',
                  cursor: (versoActual.estrofaNum || 1) >= totalEstrofas ? 'not-allowed' : 'pointer',
                  opacity: (versoActual.estrofaNum || 1) >= totalEstrofas ? 0.4 : 1
                }}
                title="Estrofa Siguiente"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT DYNAMIC CONTAINER */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* PASO 1: MOMENTO DE LECTURA */}
          {paso === 1 && (
            <StanzaReader
              versoActual={versoActual}
              cancion={cancion}
              onPlayEstrofa={handlePlayEstrofa}
              palabraRaeActiva={palabraRaeActiva}
              setPalabraRaeActiva={setPalabraRaeActiva}
              onRegistrarLecturaDiccionario={onRegistrarLecturaDiccionario}
              onSiguientePaso={() => setPaso(2)}
              onAbrirSugerirModal={() => setSugerirModalAbierto(true)}
              diccionario={diccionario}
            />
          )}

          {/* PASO 2: RETO DE COMPRENSIÓN */}
          {paso === 2 && (
            <ComprehensionChallenge
              versoActual={versoActual}
              cancion={cancion}
              opcionComprension={opcionComprension}
              onResponderComprension={handleResponderComprension}
              onSiguientePaso={() => setPaso(3)}
              onVolverPaso={() => {
                setOpcionComprension(null);
                setPaso(1);
              }}
            />
          )}

          {/* PASO 3: RETO DE ETIQUETADO DE FIGURA */}
          {paso === 3 && (
            <FigureChallenge
              versoActual={versoActual}
              opcionFigura={opcionFigura}
              onResponderFigura={handleResponderFigura}
              figuras={figuras}
              onVolverPaso={() => {
                setOpcionFigura(null);
                setPaso(2);
              }}
            />
          )}

          {/* PASO 4: CELEBRACIÓN Y CONCLUSIÓN */}
          {paso === 4 && (
            <ChallengeCelebration
              versoActual={versoActual}
              totalEstrofas={totalEstrofas}
              placasDesbloqueadas={placasDesbloqueadas}
              onReiniciar={handleReiniciar}
              onCambiarEstrofa={handleCambiarEstrofa}
            />
          )}

        </div>

      </div>

      {/* Modal Detective Proactivo para Sugerir Nuevas Figuras Literarias */}
      <SugerirFiguraModal
        isOpen={sugerirModalAbierto}
        onClose={() => setSugerirModalAbierto(false)}
        cancion={cancion}
        versoActual={versoActual}
        detectiveActivo={detectiveActivo}
        onEnviarSugerencia={onEnviarSugerencia}
      />

    </div>
  );
}
