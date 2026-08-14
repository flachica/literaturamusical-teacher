import React, { useState } from 'react';
import { Sparkles, HelpCircle, Bot, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react';
import { FIGURAS_LITERARIAS } from '../data/initialData';

export default function LyricViewer({ cancion, modoIA, onSumarPuntos }) {
  const [versoSeleccionado, setVersoSeleccionado] = useState(cancion.versos[0]);
  const [explicacionIA, setExplicacionIA] = useState(null);
  const [cargandoIA, setCargandoIA] = useState(false);

  const handleSeleccionarVerso = (verso) => {
    setVersoSeleccionado(verso);
    setExplicacionIA(null);
  };

  const handlePedirExplicacionIA = (verso) => {
    setCargandoIA(true);
    setTimeout(() => {
      setCargandoIA(false);
      setExplicacionIA(
        `🤖 [Respuesta de Ollama/LLM]: ¡Hola Detective! En la estrofa «${verso.texto}», el poeta utiliza una ${verso.figuraNombre} para hacer volar tu imaginación. Imagina que las palabras pintan un cuadro en tu mente.`
      );
      if (onSumarPuntos) onSumarPuntos(15);
    }, 800);
  };

  const figuraActualInfo = FIGURAS_LITERARIAS.find(
    (f) => f.id === versoSeleccionado?.figuraId
  );

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="badge badge-purple" style={{ marginBottom: '6px' }}>
            <Bookmark size={14} /> Resaltador de Letras Interactivo
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Letra de la Canción y Figuras</h3>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Toca cualquier verso marcado ✨ para investigarlo
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Lines column */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Estrofas Seleccionadas:
          </h4>

          {cancion.versos.map((verso) => {
            const isSelected = versoSeleccionado?.linea === verso.linea;
            const figuraInfo = FIGURAS_LITERARIAS.find((f) => f.id === verso.figuraId);

            return (
              <div
                key={verso.linea}
                onClick={() => handleSeleccionarVerso(verso)}
                className={`verso-row ${isSelected ? 'active' : ''}`}
              >
                <span className="verso-num">#{verso.linea}</span>
                <div style={{ flex: 1 }}>
                  <p className="verso-texto">{verso.texto}</p>
                  {verso.figuraNombre && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: figuraInfo?.color || 'var(--primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '4px'
                      }}
                    >
                      {figuraInfo?.icono} {verso.figuraNombre}
                    </span>
                  )}
                </div>
                <ChevronRight size={18} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
              </div>
            );
          })}
        </div>

        {/* Detailed Explanation Panel for selected verse */}
        {versoSeleccionado && (
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '24px',
              borderRadius: '16px',
              border: `1.5px solid ${figuraActualInfo?.color || 'var(--primary)'}`,
              boxShadow: `0 0 20px ${figuraActualInfo?.color}22`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '2rem' }}>{figuraActualInfo?.icono || '✨'}</span>
                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: figuraActualInfo?.color }}>
                    {versoSeleccionado.figuraNombre}
                  </h4>
                  <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    +{figuraActualInfo?.puntos_detective || 100} Puntos Detective
                  </span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px' }}>
              <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 600 }}>
                «{versoSeleccionado.texto}»
              </p>
            </div>

            {/* Explanation box */}
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                💡 Explicación Didáctica (Para 9 años):
              </h5>
              <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {versoSeleccionado.explicacion}
              </p>
            </div>

            {/* Pista de detective */}
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #f59e0b', marginBottom: '16px' }}>
              <p style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={14} /> Pista Secreta del Detective:
              </p>
              <p style={{ fontSize: '0.85rem', color: '#fef08a', marginTop: '2px' }}>
                {versoSeleccionado.pista}
              </p>
            </div>

            {/* AI Assistant Section */}
            {modoIA ? (
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
                <button
                  onClick={() => handlePedirExplicacionIA(versoSeleccionado)}
                  disabled={cargandoIA}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Bot size={16} />
                  {cargandoIA ? 'Consultando a Ollama / LLM...' : '✨ Preguntar a la IA por otra metáfora similar'}
                </button>

                {explicacionIA && (
                  <div style={{ marginTop: '12px', background: 'rgba(139, 92, 246, 0.15)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    <p style={{ fontSize: '0.85rem', color: '#e9d5ff' }}>{explicacionIA}</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Usando explicaciones de respaldo didáctico (Modo Offline activo).</span>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
