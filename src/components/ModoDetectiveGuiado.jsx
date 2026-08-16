import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DICCIONARIO_RAE, FIGURAS_LITERARIAS } from '../data/initialData';
import { Book, CheckCircle, ArrowRight, Trophy, RotateCcw, ListMusic, Sparkles, Play, ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { playFailureSound } from '../utils/audioEffects';

export default function ModoDetectiveGuiado({
  cancion,
  onGanarPuntos,
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

  // Auto-scroll ONLY when changing stanzas (preventing scroll jitter on every single line)
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

  // Automatically sync active verse smoothly based on real audio currentTime with 350ms anticipation lead
  React.useEffect(() => {
    if (!tieneAudio) return; // Si no hay audio, la navegación es 100% manual
    if (!cancion?.versos || cancion.versos.length === 0) return;

    let versoCorrespondiente = null;
    const tieneTimestamps = cancion.versos.some(v => typeof v.tiempoInicio === 'number');

    if (tieneTimestamps) {
      // Offset de anticipación poética de +1.85s para leer cómodamente un instante antes de cantar
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
      
      {/* COLUMN 1: 100% FULL SONG LYRICS GROUPED BY STANZAS (LEFT PANEL) */}
      {mostrarLetraCompleta && (
        <div ref={lyricsContainerRef} className="glass-panel" style={{
          padding: '18px 20px',
          height: 'fit-content',
          maxHeight: '560px',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              📜 Lectura Completa — «{cancion.titulo}»
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>
              Estrofa {versoActual.estrofaNum || 1} de {totalEstrofas}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {estrofasAgrupadas.map(({ estrofaNum, versos }) => {
              const isEstrofaActiva = estrofaNum === (versoActual?.estrofaNum || 1);
              const primerTiempo = versos[0]?.tiempoInicio;

              return (
                <div
                  key={estrofaNum}
                  ref={(el) => (estrofasDomRefs.current[estrofaNum] = el)}
                  onClick={() => {
                    if (typeof primerTiempo === 'number' && onSeekTime) {
                      onSeekTime(primerTiempo);
                    }
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: isEstrofaActiva
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))'
                      : 'rgba(30, 41, 59, 0.4)',
                    border: `1.5px solid ${isEstrofaActiva ? '#ec4899' : 'rgba(255, 255, 255, 0.07)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isEstrofaActiva ? '0 0 16px rgba(236, 72, 153, 0.3)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.75rem', color: isEstrofaActiva ? '#ec4899' : '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Estrofa #{estrofaNum}
                    </span>
                    {isEstrofaActiva && (
                      <span style={{ fontSize: '0.68rem', background: '#ec4899', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                        Karaoke Activo 🎵
                      </span>
                    )}
                  </div>

                  {versos.map((v) => {
                    const isCurrentLine = v.linea === versoActual?.linea;
                    return (
                      <div
                        key={v.linea}
                        style={{
                          fontSize: isCurrentLine ? '1.25rem' : '1.05rem',
                          fontWeight: isCurrentLine ? 800 : 500,
                          color: isCurrentLine ? '#ffffff' : isEstrofaActiva ? '#f8fafc' : '#cbd5e1',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: isCurrentLine ? 'rgba(236, 72, 153, 0.25)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <span>«{v.texto}»</span>
                        {isCurrentLine && <span style={{ fontSize: '0.85rem', color: '#ec4899', flexShrink: 0 }}>▶</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COLUMN 2: ACTIVE VERSE DETECTIVE CHALLENGE (RIGHT PANEL) */}
      <div className="glass-panel" style={{
        padding: '24px',
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

          {/* RAE Word modal popup if clicked (Visible in Step 1) */}
          {paso === 1 && palabraRaeActiva && (
            <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.95))', padding: '16px', borderRadius: '14px', border: '1px solid #f59e0b', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.92rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📖 Diccionario RAE: {palabraRaeActiva.palabra}
                </h4>
                <button onClick={() => setPalabraRaeActiva(null)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>✕ Cerrar</button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#f8fafc', lineHeight: 1.4, margin: 0 }}>
                {palabraRaeActiva.definicion}
              </p>
            </div>
          )}

          {/* PASO 1: MOMENTO DE LECTURA */}
          {paso === 1 && (() => {
            const estrofaVersos = versoActual.estrofaNum
              ? cancion.versos.filter(v => v.estrofaNum === versoActual.estrofaNum)
              : [versoActual];

            const tienePalabrasDificiles = estrofaVersos.some(v => v.palabrasDificiles && v.palabrasDificiles.length > 0);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  padding: '20px 24px',
                  borderRadius: '18px',
                  border: '1.5px solid rgba(139, 92, 246, 0.3)',
                  textAlign: 'left',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      📖 Bloque Poético
                    </span>
                    <button
                      onClick={() => handlePlayEstrofa(estrofaVersos[0]?.tiempoInicio)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
                      }}
                      title="Escuchar esta estrofa completa desde su inicio"
                    >
                      <Play size={12} fill="#ffffff" /> Escuchar Estrofa
                    </button>
                  </div>

                  {/* Poetic lines block */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    paddingLeft: '14px',
                    borderLeft: '3.5px solid #8b5cf6'
                  }}>
                    {estrofaVersos.map((v) => {
                      return (
                        <div
                          key={v.linea}
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: '#f8fafc',
                            lineHeight: 1.7,
                            padding: '2px 0'
                          }}
                        >
                          {v.texto.split(' ').map((palabra, i) => {
                            const limpia = palabra.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                            const esDificil = v.palabrasDificiles && v.palabrasDificiles.includes(limpia);
                            if (esDificil) {
                              return (
                                <span
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPalabraRaeActiva(DICCIONARIO_RAE[limpia] || { palabra: limpia, definicion: 'Palabra destacada de la canción.' });
                                    if (onRegistrarLecturaDiccionario) onRegistrarLecturaDiccionario();
                                  }}
                                  style={{
                                    color: '#fbbf24',
                                    textDecoration: 'underline dotted #fbbf24',
                                    cursor: 'pointer',
                                    background: 'rgba(245, 158, 11, 0.25)',
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                    margin: '0 2px',
                                    display: 'inline-block'
                                  }}
                                  title="Haz clic para ver el secreto de la palabra en el Diccionario RAE"
                                >
                                  {palabra}
                                </span>
                              );
                            }
                            return palabra + ' ';
                          })}
                        </div>
                      );
                    })}
                  </div>

                  {tienePalabrasDificiles && (
                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Book size={12} /> Haz clic en las palabras amarillas para abrir el Diccionario RAE 🔍
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setPaso(2)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                    flexShrink: 0
                  }}
                >
                  <span>He leído la estrofa → Resolver Reto de Comprensión</span> <ArrowRight size={18} />
                </button>
              </div>
            );
          })()}

          {/* PASO 2: RETO DE COMPRENSIÓN DE LA HISTORIA */}
          {paso === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              
              {/* Recordatorio de Estrofa Compacto */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.4)',
                padding: '10px 14px',
                borderRadius: '12px',
                borderLeft: '4.5px solid #06b6d4',
                fontSize: '0.88rem',
                color: '#94a3b8',
                fontStyle: 'italic',
                lineHeight: 1.4
              }}>
                "{versoActual.texto}"
              </div>

              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8', marginBottom: '6px', lineHeight: 1.4 }}>
                {(() => {
                  const pg = versoActual.preguntaComprension;
                  if (!pg || pg.includes('esta imagen') || pg.includes('esta canción') || pg.includes('este verso de')) {
                    return `¿Qué transmite esta estrofa de ${cancion.artistaNombre}?`;
                  }
                  return pg;
                })()}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {versoActual.opcionesComprension.map((opcion) => {
                  const isSelected = opcionComprension?.id === opcion.id;
                  const isCorrectAnswerSelected = opcionComprension?.correcta === true;
                  let bg = 'rgba(15, 23, 42, 0.6)';
                  let border = '1px solid rgba(255, 255, 255, 0.1)';

                  if (isSelected) {
                    bg = opcion.correcta ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
                    border = opcion.correcta ? '1px solid #10b981' : '1px solid #ef4444';
                  }

                  const isDisabled = isCorrectAnswerSelected && !isSelected;

                  return (
                    <button
                      key={opcion.id}
                      disabled={isDisabled}
                      onClick={() => handleResponderComprension(opcion)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        textAlign: 'left',
                        background: bg,
                        border: border,
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: isDisabled ? 'default' : 'pointer',
                        opacity: isDisabled ? 0.45 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{opcion.texto}</span>
                      {isSelected && (
                        <span style={{ color: opcion.correcta ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '1.1rem' }}>
                          {opcion.correcta ? '✓' : '✕'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {opcionComprension && !opcionComprension.correcta && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ❌ Vuelve a escuchar y leer la estrofa con atención. ¡Puedes conseguirlo!
                </div>
              )}

              {opcionComprension?.correcta && (
                <div
                  className="modal-content-animate"
                  style={{
                    marginTop: '10px',
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.1))',
                    border: '1.5px solid rgba(16, 185, 129, 0.45)',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)'
                  }}
                >
                  <p style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    🌟 ¡Excelente! Has comprendido muy bien el mensaje de la estrofa.
                  </p>
                  <button
                    onClick={() => setPaso(3)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>Paso 3: Identificar la Figura Poética</span> <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PASO 3: RETO DE ETIQUETADO DE FIGURA LITERARIA */}
          {paso === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              
              {/* Recordatorio de Estrofa Compacto */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.4)',
                padding: '10px 14px',
                borderRadius: '12px',
                borderLeft: '4.5px solid #ec4899',
                fontSize: '0.88rem',
                color: '#94a3b8',
                fontStyle: 'italic',
                lineHeight: 1.4
              }}>
                "{versoActual.texto}"
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f472b6', marginBottom: '4px' }}>
                🔮 ¿Qué truco de magia poética utiliza el autor en esta estrofa?
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
                Pulsa sobre la figura literaria correcta para resolver el misterio:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {FIGURAS_LITERARIAS.map((fig) => {
                  const isSelected = opcionFigura === fig.id;
                  const esCorrecto = fig.id === versoActual.figuraId;
                  
                  let bg = 'rgba(15, 23, 42, 0.6)';
                  let border = '1.5px solid rgba(255, 255, 255, 0.08)';

                  if (opcionFigura) {
                    if (isSelected) {
                      bg = esCorrecto ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
                      border = esCorrecto ? '2px solid #10b981' : '2px solid #ef4444';
                    } else if (esCorrecto) {
                      // Resaltar la correcta sutilmente si ya respondió mal
                      border = '1.5px dashed rgba(16, 185, 129, 0.5)';
                    }
                  }

                  return (
                    <button
                      key={fig.id}
                      onClick={() => handleResponderFigura(fig.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: bg,
                        border: border,
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.3rem' }}>{fig.icono}</span>
                      <div>
                        <div style={{ color: fig.color, fontSize: '0.88rem' }}>{fig.nombre}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400 }}>+{fig.puntos_detective} pts</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 4: CELEBRACIÓN Y CONCLUSIÓN */}
          {paso === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', height: '100%' }}>
              
              <div style={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(139, 92, 246, 0.12))',
                padding: '16px',
                borderRadius: '16px',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                flexShrink: 0
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🎉 🔮</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#ffffff', marginBottom: '4px' }}>
                  ¡Gran Trabajo, Detective!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#e2e8f0', maxWidth: '440px', margin: '0 auto 10px', lineHeight: 1.45 }}>
                  {versoActual.explicacion}
                </p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#ffffff', padding: '6px 14px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.82rem' }}>
                  <Trophy size={14} /> +150 Puntos de Detective Añadidos
                </div>
              </div>

              {/* MINI ÁLBUM DE PLACAS DE LOGRO EN CELEBRACIÓN */}
              <div style={{
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.45)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c084fc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Award size={14} /> Tu Progreso de Detective:
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px'
                }}>
                  {[
                    { id: 'lector', titulo: 'Lector', icono: '📖', color: '#c084fc' },
                    { id: 'oido_lince', titulo: 'Oído', icono: '🦊', color: '#f472b6' },
                    { id: 'racha_poetica', titulo: 'Racha', icono: '✨', color: '#38bdf8' },
                    { id: 'melomano', titulo: 'Canciones', icono: '🎵', color: '#fbbf24' }
                  ].map(p => {
                    const conseguido = placasDesbloqueadas?.includes(p.id);
                    return (
                      <div key={p.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '6px',
                        borderRadius: '8px',
                        background: conseguido ? `${p.color}15` : 'rgba(30, 41, 59, 0.2)',
                        border: `1px ${conseguido ? 'solid' : 'dashed'} ${conseguido ? `${p.color}50` : 'rgba(255, 255, 255, 0.08)'}`,
                        opacity: conseguido ? 1 : 0.45
                      }} title={p.titulo}>
                        <span style={{ fontSize: '1.25rem', marginBottom: '2px', filter: conseguido ? 'none' : 'grayscale(100%)' }}>{p.icono}</span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: conseguido ? p.color : '#94a3b8' }}>{p.titulo}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                <button
                  onClick={handleReiniciar}
                  style={{
                    flexGrow: 1,
                    padding: '8px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={12} /> Analizar de nuevo
                </button>
                {versoActual.estrofaNum < totalEstrofas && (
                  <button
                    onClick={() => handleCambiarEstrofa((versoActual.estrofaNum || 1) + 1)}
                    style={{
                      flexGrow: 1.5,
                      padding: '8px 14px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(139, 92, 246, 0.3)'
                    }}
                  >
                    <span>Siguiente Estrofa</span> <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
