import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import WaveformScrubber from './WaveformScrubber';
import { DICCIONARIO_RAE, FIGURAS_LITERARIAS } from '../data/mockData';
import { Disc, HelpCircle, Book, CheckCircle, ArrowRight, Sparkles, Trophy, RotateCcw } from 'lucide-react';

export default function ModoDetectiveGuiado({ cancion, onGanarPuntos }) {
  const [paso, setPaso] = useState(1); // 1: Lectura + RAE, 2: Comprensión del Significado, 3: Identificar Figura, 4: ¡Éxito!
  const [versoActual, setVersoActual] = useState(cancion.versos[0]);
  const [palabraRaeActiva, setPalabraRaeActiva] = useState(null);
  const [opcionComprension, setOpcionComprension] = useState(null);
  const [opcionFigura, setOpcionFigura] = useState(null);

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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Step Indicator Progress */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '12px 20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🔍</span>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Misión: {cancion.titulo}</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>por {cancion.artistaNombre}</span>
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`badge ${paso >= 1 ? 'badge-purple' : ''}`} style={{ fontSize: '0.75rem' }}>1. Leer</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span className={`badge ${paso >= 2 ? 'badge-gold' : ''}`} style={{ fontSize: '0.75rem' }}>2. Significado</span>
          <span style={{ color: 'var(--text-muted)' }}>→</span>
          <span className={`badge ${paso >= 3 ? 'badge-cyan' : ''}`} style={{ fontSize: '0.75rem' }}>3. Figura</span>
        </div>
      </div>

      {/* Main Mission Container */}
      <div className="glass-panel glass-panel-glow" style={{ padding: '32px', textAlign: 'center' }}>
        
        {/* Interactive Audio Waveform Scrubber Timeline */}
        <WaveformScrubber
          cancion={cancion}
          onSeleccionarVersoPorTiempo={handleSeleccionarVersoPorTiempo}
        />

        {/* SONG VERSE BOX */}
        <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))', padding: '24px', borderRadius: '20px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '24px' }}>

          <span className="badge badge-purple" style={{ marginBottom: '10px' }}>
            <Disc size={14} /> Verso a Investigar
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', fontStyle: 'italic', margin: '8px 0 12px' }}>
            «{versoActual.texto}»
          </h2>
          
          {/* RAE Word clickers */}
          {versoActual.palabrasDificiles && versoActual.palabrasDificiles.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Book size={12} /> Palabras clave (Toca para ver RAE):
              </span>
              {versoActual.palabrasDificiles.map((p) => {
                const info = DICCIONARIO_RAE[p.toLowerCase()];
                return (
                  <button
                    key={p}
                    onClick={() => setPalabraRaeActiva(palabraRaeActiva === p ? null : p)}
                    style={{
                      background: palabraRaeActiva === p ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)',
                      color: palabraRaeActiva === p ? '#000000' : '#fbbf24',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      border: '1px solid #f59e0b'
                    }}
                  >
                    📖 {info ? info.palabra : p}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RAE Popup Card if active */}
        {palabraRaeActiva && DICCIONARIO_RAE[palabraRaeActiva.toLowerCase()] && (
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '16px', borderRadius: '16px', border: '1px solid #f59e0b', marginBottom: '24px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Book size={16} /> Diccionario RAE Didáctico: {DICCIONARIO_RAE[palabraRaeActiva.toLowerCase()].palabra}
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#fef08a' }}>
              {DICCIONARIO_RAE[palabraRaeActiva.toLowerCase()].definicion}
            </p>
          </div>
        )}

        {/* STEP 1: LECTURA Y ESCUCHA */}
        {paso === 1 && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
              Paso 1: Lee el verso con atención y comprende las palabras
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Escucha el tema y asegúrate de saber qué significa cada palabra antes de avanzar.
            </p>
            <button
              onClick={() => setPaso(2)}
              style={{
                padding: '14px 28px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ¡Entiendo el verso! Ir al Reto de Significado <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: RETO DE COMPRENSIÓN LÍRICA (¡LO MÁS IMPORTANTE!) */}
        {paso === 2 && (
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '10px' }}>
              <HelpCircle size={14} /> Paso 2: Comprensión de la Letra
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              {versoActual.preguntaComprension}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {versoActual.opcionesComprension.map((opc) => {
                const isSelected = opcionComprension?.id === opc.id;
                return (
                  <button
                    key={opc.id}
                    onClick={() => handleResponderComprension(opc)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '14px',
                      background: isSelected ? (opc.correcta ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)') : 'rgba(30, 41, 59, 0.8)',
                      border: `2px solid ${isSelected ? (opc.correcta ? '#10b981' : '#ef4444') : 'rgba(255, 255, 255, 0.1)'}`,
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textAlign: 'left'
                    }}
                  >
                    {opc.texto}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: ETIQUETAR LA FIGURA LITERARIA */}
        {paso === 3 && (
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '10px' }}>
              <Sparkles size={14} /> Paso 3: ¿Qué Figura Literaria es?
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              ¡Ya sabes lo que significa! Ahora, ¿qué truco poético usó el autor?
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {FIGURAS_LITERARIAS.slice(0, 4).map((fig) => {
                const isSelected = opcionFigura === fig.id;
                return (
                  <button
                    key={fig.id}
                    onClick={() => handleResponderFigura(fig.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '14px',
                      background: isSelected ? `${fig.color}33` : 'rgba(30, 41, 59, 0.8)',
                      border: `2px solid ${fig.color}`,
                      color: '#ffffff',
                      fontWeight: 800,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{fig.icono}</div>
                    <div style={{ color: fig.color, fontSize: '1rem' }}>{fig.nombre}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: CELEBRACIÓN Y RECOMPENSA */}
        {paso === 4 && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🏆</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399', marginBottom: '8px' }}>
              ¡Increíble Trabajo, Detective! 🎉
            </h2>
            <p style={{ fontSize: '1rem', color: '#e2e8f0', marginBottom: '20px' }}>
              Has entendido perfectamente la letra y descubierto la <strong>{versoActual.figuraNombre}</strong>. ¡Has ganado +150 Puntos y 1 Estrella!
            </p>

            <button
              onClick={handleReiniciar}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={16} /> Probar otra canción
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
