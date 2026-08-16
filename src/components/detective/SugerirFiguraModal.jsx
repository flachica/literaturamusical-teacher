import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FIGURAS_LITERARIAS } from '../../data/initialData';

export default function SugerirFiguraModal({
  isOpen,
  onClose,
  cancion,
  versoActual,
  detectiveActivo,
  onEnviarSugerencia
}) {
  const [figuraSeleccionada, setFiguraSeleccionada] = useState(FIGURAS_LITERARIAS[0].id);
  const [comentario, setComentario] = useState('');
  const [enviadoExito, setEnviadoExito] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setEnviadoExito(false);
    setComentario('');
    setFiguraSeleccionada(versoActual?.figuraId || FIGURAS_LITERARIAS[0].id);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, versoActual, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const figObj = FIGURAS_LITERARIAS.find(f => f.id === figuraSeleccionada) || FIGURAS_LITERARIAS[0];

    const nuevaSugerencia = {
      id: `sug-${Date.now()}`,
      detectiveId: detectiveActivo?.id || 'default',
      detectiveNombre: detectiveActivo?.nombre || 'Detective',
      detectiveAvatar: detectiveActivo?.avatar || '🕵️‍♀️',
      cancionId: cancion.id,
      cancionTitulo: cancion.titulo,
      artistaNombre: cancion.artistaNombre,
      lineaTexto: versoActual?.texto || '',
      estrofaNum: versoActual?.estrofaNum || 1,
      figuraId: figObj.id,
      figuraNombre: figObj.nombre,
      figuraIcono: figObj.icono,
      figuraColor: figObj.color,
      comentario: comentario.trim() || '¡He descubierto este truco poético!',
      fecha: new Date().toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      estado: 'pendiente' // 'pendiente' | 'aprobada' | 'cena'
    };

    onEnviarSugerencia(nuevaSugerencia);
    setEnviadoExito(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
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
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '24px',
          borderRadius: '24px',
          border: '2px solid #ec4899',
          maxWidth: '560px',
          width: '100%',
          maxHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 40px rgba(236, 72, 153, 0.35)',
          textAlign: 'left'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔍 ¡He descubierto una figura literaria!
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#ec4899', margin: '4px 0 0 0', fontWeight: 700 }}>
              Propuesta de {detectiveActivo?.avatar} {detectiveActivo?.nombre || 'Detective'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {enviadoExito ? (
          <div style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '3.5rem' }}>🎉 📬</span>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#34d399', margin: 0 }}>
              ¡Sugerencia Enviada al Buzón Familiar!
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '400px' }}>
              +50 Puntos de Detective por tu lectura atenta. Papá y Mamá la revisarán en la sección de administración.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Frase / Verso Seleccionado */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px 16px', borderRadius: '14px', border: '1.5px solid rgba(139, 92, 246, 0.3)' }}>
              <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Estrofa / Verso Investigado de «{cancion.titulo}»:
              </span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0, fontStyle: 'italic' }}>
                «{versoActual?.texto || 'Línea de la canción'}»
              </p>
            </div>

            {/* Selector de Figura Poética */}
            <div>
              <label style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                ¿Qué truco o figura crees que es? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                {FIGURAS_LITERARIAS.map((fig) => {
                  const isSelected = figuraSeleccionada === fig.id;
                  return (
                    <button
                      key={fig.id}
                      type="button"
                      onClick={() => setFiguraSeleccionada(fig.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '10px',
                        background: isSelected ? `${fig.color}25` : 'rgba(30, 41, 59, 0.4)',
                        border: `1.5px solid ${isSelected ? fig.color : 'rgba(255, 255, 255, 0.08)'}`,
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{fig.icono}</span>
                      <span style={{ color: isSelected ? fig.color : '#cbd5e1' }}>{fig.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explicación / Comentario Opcional */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                ¿Por qué crees que es esta figura? (Opcional):
              </label>
              <textarea
                placeholder="Ej: Compara el sol con un reloj de oro sin usar la palabra como..."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#0f172a',
                  color: '#fff',
                  border: '1px solid #334155',
                  fontSize: '0.85rem',
                  resize: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '10px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(236, 72, 153, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Send size={15} /> 🚀 Enviar a Papá y Mamá (+50 PTS)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
