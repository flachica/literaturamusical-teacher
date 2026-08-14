import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DICCIONARIO_RAE, FIGURAS_LITERARIAS } from '../data/mockData';
import { Book, CheckCircle, ArrowRight, Trophy, RotateCcw, ListMusic, Sparkles, Play, ChevronLeft, ChevronRight } from 'lucide-react';

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
  setMostrarLetraCompleta
}) {
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
    if (typeof tiempoInicio === 'number' && onSeekTime) {
      onSeekTime(tiempoInicio);
      if (setIsPlaying) setIsPlaying(true);
    }
  };

  const handleCambiarEstrofa = (nuevaEstrofaNum) => {
    const primerVersoDeEstrofa = cancion.versos.find(v => (v.estrofaNum || 1) === nuevaEstrofaNum);
    if (primerVersoDeEstrofa) {
      setVersoActual(primerVersoDeEstrofa);
      setPaso(1);
      setOpcionComprension(null);
      setOpcionFigura(null);

      if (onSeekTime && typeof primerVersoDeEstrofa.tiempoInicio === 'number') {
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
    if (opcion.correcta) {
      setTimeout(() => {
        setPaso(3);
      }, 600);
    }
  };

  const handleResponderFigura = (figuraId) => {
    setOpcionFigura(figuraId);
    if (figuraId === versoActual.figuraId) {
      setPaso(4);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (onGanarPuntos) onGanarPuntos(150);
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
                          fontSize: isCurrentLine ? '1.02rem' : '0.94rem',
                          fontWeight: isCurrentLine ? 800 : 500,
                          color: isCurrentLine ? '#ffffff' : isEstrofaActiva ? '#f1f5f9' : '#cbd5e1',
                          padding: '3px 6px',
                          borderRadius: '6px',
                          background: isCurrentLine ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>«{v.texto}»</span>
                        {isCurrentLine && <span style={{ fontSize: '0.75rem', color: '#ec4899', flexShrink: 0 }}>▶</span>}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COLUMN 2: ACTIVE VERSE DETECTIVE CHALLENGE (RIGHT PANEL / FULL WIDTH WHEN TOGGLED OFF) */}
      <div className="glass-panel" style={{ padding: '24px', height: 'fit-content', border: paso === 4 ? '2px solid #10b981' : '1px solid rgba(139, 92, 246, 0.3)' }}>
        
        {/* Step Badge Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            {paso === 1 && <span className="badge badge-purple">Paso 1: Leer y Comprender la Estrofa</span>}
            {paso === 2 && <span className="badge badge-cyan">Paso 2: Reto de Comprensión de la Letra</span>}
            {paso === 3 && <span className="badge badge-pink">Paso 3: Identificar la Figura Literaria</span>}
            {paso === 4 && <span className="badge" style={{ background: '#10b981', color: '#fff' }}>¡Reto Completado con Éxito! 🎉</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 800 }}>
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

        {/* Full Stanza Context Box (Single Continuous Poetic Block) */}
        {(() => {
          const estrofaVersos = versoActual.estrofaNum
            ? cancion.versos.filter(v => v.estrofaNum === versoActual.estrofaNum)
            : [versoActual];

          const tienePalabrasDificiles = estrofaVersos.some(v => v.palabrasDificiles && v.palabrasDificiles.length > 0);

          return (
            <div style={{
              background: 'rgba(15, 23, 42, 0.95)',
              padding: '22px 26px',
              borderRadius: '18px',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              marginBottom: '20px',
              textAlign: 'left',
              boxShadow: '0 4px 24px rgba(0,0,0,0.45)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  📜 Estrofa #{versoActual.estrofaNum || 1}
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

              {/* Single Continuous Poetic Block with a subtle purple left border */}
              <div style={{
                paddingLeft: '14px',
                borderLeft: '3px solid #8b5cf6',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {estrofaVersos.map((v) => (
                  <div key={v.linea} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f8fafc', lineHeight: 1.6 }}>
                    {v.texto.split(' ').map((palabra, i) => {
                      const limpia = palabra.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                      const esDificil = v.palabrasDificiles && v.palabrasDificiles.includes(limpia);
                      if (esDificil) {
                        return (
                          <span
                            key={i}
                            onClick={() => setPalabraRaeActiva(DICCIONARIO_RAE[limpia] || { palabra: limpia, definicion: 'Palabra destacada de la canción.' })}
                            style={{
                              color: '#fbbf24',
                              textDecoration: 'underline dotted #fbbf24',
                              cursor: 'pointer',
                              background: 'rgba(245, 158, 11, 0.25)',
                              padding: '2px 8px',
                              borderRadius: '8px',
                              margin: '0 2px'
                            }}
                            title="Haz clic para ver el secreto de la palabra en el Diccionario RAE"
                          >
                            {palabra}{' '}
                          </span>
                        );
                      }
                      return palabra + ' ';
                    })}
                  </div>
                ))}
              </div>

              {tienePalabrasDificiles && (
                <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Book size={14} /> Haz clic en la palabra destacada para desvelar su secreto RAE 🔍
                </div>
              )}
            </div>
          );
        })()}

        {/* RAE Word modal popup if clicked */}
        {palabraRaeActiva && (
          <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.95))', padding: '16px', borderRadius: '14px', border: '1px solid #f59e0b', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                📖 Diccionario RAE: {palabraRaeActiva.palabra}
              </h4>
              <button onClick={() => setPalabraRaeActiva(null)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}>✕ Cerrar</button>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.5, margin: 0 }}>
              {palabraRaeActiva.definicion}
            </p>
          </div>
        )}

        {/* DYNAMIC CHALLENGE SECTION WITHIN THE SAME UNIFIED CARD */}
        
        {/* PASO 1: CONFIRMAR LECTURA */}
        {paso === 1 && (
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
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
            }}
          >
            <span>He leído la estrofa → Resolver Reto de Comprensión</span> <ArrowRight size={18} />
          </button>
        )}

        {/* PASO 2: RETO DE COMPRENSIÓN DE LA HISTORIA */}
        {paso === 2 && (
          <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38bdf8', marginBottom: '12px' }}>
              {versoActual.preguntaComprension}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {versoActual.opcionesComprension.map((opcion) => {
                const isSelected = opcionComprension?.id === opcion.id;
                let bg = 'rgba(15, 23, 42, 0.6)';
                let border = '1px solid rgba(255, 255, 255, 0.1)';

                if (isSelected) {
                  bg = opcion.correcta ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
                  border = opcion.correcta ? '1px solid #10b981' : '1px solid #ef4444';
                }

                return (
                  <button
                    key={opcion.id}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{opcion.texto}</span>
                    {isSelected && opcion.correcta && <span style={{ color: '#34d399', fontWeight: 800 }}>¡Correcto! ✨</span>}
                    {isSelected && !opcion.correcta && <span style={{ color: '#f87171', fontWeight: 800 }}>¡Inténtalo otra vez! 🤔</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 3: IDENTIFICAR LA FIGURA LITERARIA */}
        {paso === 3 && (
          <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <p style={{ fontSize: '0.85rem', color: '#c084fc', marginBottom: '12px', fontWeight: 700 }}>
              Pista del detective: <em>"{versoActual.pista}"</em>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {FIGURAS_LITERARIAS.map((fig) => {
                const isSelected = opcionFigura === fig.id;
                const isCorrect = fig.id === versoActual.figuraId;

                let bg = 'rgba(15, 23, 42, 0.6)';
                let border = `1px solid ${fig.color}`;

                if (isSelected) {
                  bg = isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
                }

                return (
                  <button
                    key={fig.id}
                    onClick={() => handleResponderFigura(fig.id)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: bg,
                      border: border,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>{fig.icono}</span>
                    <div>
                      <div style={{ color: fig.color }}>{fig.nombre}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>+{fig.puntos_detective} pts</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 4: CELEBRACIÓN Y CONCLUSIÓN */}
        {paso === 4 && (
          <div style={{ paddingTop: '10px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(139, 92, 246, 0.15))', padding: '20px', borderRadius: '16px' }}>
            <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>🎉 🔮</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
              ¡Gran Trabajo, Detective Literaria!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#f8fafc', maxWidth: '600px', margin: '0 auto 14px', lineHeight: 1.5 }}>
              {versoActual.explicacion}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#10b981', color: '#ffffff', padding: '8px 16px', borderRadius: '9999px', fontWeight: 800, marginBottom: '14px' }}>
              <Trophy size={16} /> +150 Puntos de Detective Añadidos
            </div>

            <div>
              <button
                onClick={handleReiniciar}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} /> Volver a Analizar este Verso
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
