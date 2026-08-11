import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import WaveformScrubber from './WaveformScrubber';
import { DICCIONARIO_RAE, FIGURAS_LITERARIAS } from '../data/mockData';
import { Disc, HelpCircle, Book, CheckCircle, ArrowRight, Sparkles, Trophy, RotateCcw, ListMusic } from 'lucide-react';

export default function ModoDetectiveGuiado({
  cancion,
  onGanarPuntos,
  isPlaying,
  setIsPlaying,
  posicion,
  setPosicion
}) {
  const [paso, setPaso] = useState(1); // 1: Lectura + RAE, 2: Comprensión del Significado, 3: Identificar Figura, 4: ¡Éxito!
  const [versoActual, setVersoActual] = useState(cancion.versos[0]);
  const [palabraRaeActiva, setPalabraRaeActiva] = useState(null);
  const [opcionComprension, setOpcionComprension] = useState(null);
  const [opcionFigura, setOpcionFigura] = useState(null);
  const [mostrarLetraCompleta, setMostrarLetraCompleta] = useState(true);

  const handleSeleccionarVersoPorTiempo = (verso) => {
    if (verso && verso.linea !== versoActual?.linea) {
      setVersoActual(verso);
      setPaso(1);
      setOpcionComprension(null);
      setOpcionFigura(null);
    }
  };

  const handleResponderComprension = (opcion) => {
    setOpcionComprension(opcion);
    if (opcion.correcta) {
      setTimeout(() => {
        setPaso(3);
      }, 700);
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
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Step Indicator Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '12px 20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🔍</span>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Misión Detective: {cancion.titulo}</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>por {cancion.artistaNombre}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMostrarLetraCompleta(!mostrarLetraCompleta)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: mostrarLetraCompleta ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.06)',
              color: mostrarLetraCompleta ? '#c084fc' : 'var(--text-muted)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ListMusic size={14} /> {mostrarLetraCompleta ? 'Ocultar Letra Completa' : 'Ver Letra Completa'}
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4].map((stepNum) => {
              const isCompleted = paso > stepNum;
              const isCurrent = paso === stepNum;
              return (
                <div
                  key={stepNum}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    background: isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    boxShadow: isCurrent ? '0 0 10px var(--primary)' : 'none'
                  }}
                >
                  {isCompleted ? '✓' : stepNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synchronized Waveform Scrubber Component (WITHOUT BEEP SOUNDS) */}
      <WaveformScrubber
        cancion={cancion}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        posicion={posicion}
        setPosicion={setPosicion}
        onSeleccionarVersoPorTiempo={handleSeleccionarVersoPorTiempo}
      />

      {/* FULL SONG LYRICS VIEWER (FOR DAUGHTER TO READ ENTIRE LYRICS) */}
      {mostrarLetraCompleta && (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📜 Letra Completa para Lectura — «{cancion.titulo}»
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Toca sobre cualquier verso para seleccionarlo y resolver su reto literario:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {cancion.versos.map((v) => {
              const isSelected = v.linea === versoActual.linea;
              return (
                <div
                  key={v.linea}
                  onClick={() => {
                    setVersoActual(v);
                    setPaso(1);
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: isSelected ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))' : 'rgba(30, 41, 59, 0.5)',
                    border: `1px solid ${isSelected ? '#ec4899' : 'rgba(255, 255, 255, 0.06)'}`,
                    color: isSelected ? '#ffffff' : '#cbd5e1',
                    fontWeight: isSelected ? 800 : 500,
                    fontSize: isSelected ? '1.1rem' : '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 12px rgba(236, 72, 153, 0.3)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: isSelected ? '#ec4899' : 'var(--text-muted)', fontWeight: 800 }}>#{v.linea}</span>
                    <span>«{v.texto}»</span>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: '0.75rem', background: '#ec4899', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                      Leyendo ahora 🔍
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: LECTURA DE ESTROFA Y DICCIONARIO RAE DIDÁCTICO */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span className="badge badge-purple">Paso 1: Leer y Comprender el Verso Cantado</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verso {versoActual.linea} de {cancion.versos.length}</span>
        </div>

        {/* Verse display box */}
        <div style={{ background: 'rgba(15, 23, 42, 0.95)', padding: '22px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.4)', marginBottom: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <p style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.6, letterSpacing: '0.01em' }}>
            «{versoActual.texto.split(' ').map((palabra, i) => {
              const limpia = palabra.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
              const esDificil = versoActual.palabrasDificiles && versoActual.palabrasDificiles.includes(limpia);
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
                    title="Haz clic para ver la definición RAE infantil"
                  >
                    {palabra}{' '}
                  </span>
                );
              }
              return palabra + ' ';
            })}»
          </p>

          {versoActual.palabrasDificiles && versoActual.palabrasDificiles.length > 0 && (
            <div style={{ marginTop: '12px', fontSize: '0.82rem', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Book size={14} /> Haz clic en la palabra subrayada para ver su significado infantil
            </div>
          )}
        </div>

        {/* RAE Word modal popup if clicked */}
        {palabraRaeActiva && (
          <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.95))', padding: '18px', borderRadius: '14px', border: '1px solid #f59e0b', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ color: '#fbbf24', fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📖 Diccionario Didáctico RAE: {palabraRaeActiva.palabra}
              </h4>
              <button onClick={() => setPalabraRaeActiva(null)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 800, cursor: 'pointer', fontSize: '1rem' }}>✕ Cerrar</button>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#f8fafc', lineHeight: 1.5, marginBottom: '6px' }}>
              {palabraRaeActiva.definicion}
            </p>
            {palabraRaeActiva.ejemplo && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', italic: 'true' }}>
                Ejemplo: "{palabraRaeActiva.ejemplo}"
              </span>
            )}
          </div>
        )}

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
            <span>He leído el verso → Resolver Reto de Comprensión</span> <ArrowRight size={18} />
          </button>
        )}
      </div>

      {/* STEP 2: RETO DE COMPRENSIÓN PRIMERO (didáctica de 9 años) */}
      {paso >= 2 && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', border: paso === 2 ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="badge badge-cyan">Paso 2: ¿Qué nos cuenta el poeta / Lorca aquí?</span>
            {paso > 2 && <CheckCircle size={18} color="#10b981" />}
          </div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
            {versoActual.preguntaComprension}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {versoActual.opcionesComprension.map((opcion) => {
              const isSelected = opcionComprension?.id === opcion.id;
              let bg = 'rgba(15, 23, 42, 0.6)';
              let border = '1px solid rgba(255, 255, 255, 0.1)';

              if (isSelected) {
                if (opcion.correcta) {
                  bg = 'rgba(16, 185, 129, 0.25)';
                  border = '1px solid #10b981';
                } else {
                  bg = 'rgba(239, 68, 68, 0.25)';
                  border = '1px solid #ef4444';
                }
              }

              return (
                <button
                  key={opcion.id}
                  onClick={() => paso === 2 && handleResponderComprension(opcion)}
                  disabled={paso > 2}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    textAlign: 'left',
                    background: bg,
                    border: border,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: paso === 2 ? 'pointer' : 'default',
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

      {/* STEP 3: ETIQUETAR LA FIGURA LITERARIA */}
      {paso >= 3 && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', border: paso === 3 ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="badge badge-pink">Paso 3: ¿Qué figura literaria ha usado el poeta?</span>
            {paso > 3 && <CheckCircle size={18} color="#10b981" />}
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Pista del detective: <em>"{versoActual.pista}"</em>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
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
                  onClick={() => paso === 3 && handleResponderFigura(fig.id)}
                  disabled={paso > 3}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: bg,
                    border: border,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textAlign: 'left',
                    cursor: paso === 3 ? 'pointer' : 'default',
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

      {/* STEP 4: CELEBRACIÓN Y CONCLUSIÓN DIDÁCTICA */}
      {paso === 4 && (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(139, 92, 246, 0.2))', border: '2px solid #10b981' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉 🔮</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
            ¡Gran Trabajo, Detective Literaria!
          </h3>
          <p style={{ fontSize: '0.95rem', color: '#f8fafc', maxWidth: '600px', margin: '0 auto 16px', lineHeight: 1.5 }}>
            {versoActual.explicacion}
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#10b981', color: '#ffffff', padding: '8px 16px', borderRadius: '9999px', fontWeight: 800, marginBottom: '16px' }}>
            <Trophy size={18} /> +150 Puntos de Detective Añadidos
          </div>

          <div>
            <button
              onClick={handleReiniciar}
              style={{
                padding: '10px 20px',
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
  );
}
