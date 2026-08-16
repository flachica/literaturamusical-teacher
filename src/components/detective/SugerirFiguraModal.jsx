import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, CheckSquare, Square, Layers } from 'lucide-react';
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
  const [lineasSeleccionadas, setLineasSeleccionadas] = useState([]);
  const [comentario, setComentario] = useState('');
  const [enviadoExito, setEnviadoExito] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setEnviadoExito(false);
    setComentario('');
    setFiguraSeleccionada(versoActual?.figuraId || FIGURAS_LITERARIAS[0].id);

    // Preseleccionar los versos de la estrofa actual
    if (cancion?.versos && versoActual) {
      const estrofaVersos = versoActual.estrofaNum
        ? cancion.versos.filter(v => v.estrofaNum === versoActual.estrofaNum)
        : [versoActual];
      setLineasSeleccionadas(estrofaVersos.map(v => v.linea));
    } else {
      setLineasSeleccionadas([versoActual?.linea || 1]);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, cancion, versoActual, onClose]);

  if (!isOpen) return null;

  const toggleSeleccionLinea = (lineaNum) => {
    if (lineasSeleccionadas.includes(lineaNum)) {
      if (lineasSeleccionadas.length > 1) {
        setLineasSeleccionadas(lineasSeleccionadas.filter(l => l !== lineaNum));
      }
    } else {
      setLineasSeleccionadas([...lineasSeleccionadas, lineaNum].sort((a, b) => a - b));
    }
  };

  const versosObjetosSeleccionados = (cancion?.versos || []).filter(v => lineasSeleccionadas.includes(v.linea));

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
      lineasTexto: versosObjetosSeleccionados.map(v => v.texto),
      lineaTexto: versosObjetosSeleccionados.map(v => v.texto).join(' / '),
      figuraId: figObj.id,
      figuraNombre: figObj.nombre,
      figuraIcono: figObj.icono,
      figuraColor: figObj.color,
      comentario: comentario.trim() || '¡He descubierto este truco poético entre estos versos!',
      fecha: new Date().toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      estado: 'pendiente'
    };

    onEnviarSugerencia(nuevaSugerencia);
    setEnviadoExito(true);
    confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });

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
        padding: '16px'
      }}
    >
      <div
        className="modal-content-animate"
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '18px 22px',
          borderRadius: '20px',
          border: '2px solid #ec4899',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 45px rgba(236, 72, 153, 0.35)',
          textAlign: 'left'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔍 Marca los versos del descubrimiento
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#ec4899', margin: '2px 0 0 0', fontWeight: 700 }}>
              Propuesta de {detectiveActivo?.avatar} {detectiveActivo?.nombre || 'Detective'} — «{cancion.titulo}»
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
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
          <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '3rem' }}>🎉 📬</span>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399', margin: 0 }}>
              ¡Sugerencia Enviada al Buzón Familiar!
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '400px', margin: 0 }}>
              +50 Puntos de Detective por tu investigación entre versos. Papá y Mamá la revisarán en la administración.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
            
            {/* Selector de Versos Multi-Estrofa (Mayor altura para ver 7-8 versos holgadamente) */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Layers size={14} color="#c084fc" /> Selecciona uno o varios versos de la canción ({lineasSeleccionadas.length} marcados):
              </label>
              
              <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '12px',
                border: '1.5px solid rgba(139, 92, 246, 0.3)',
                maxHeight: '260px',
                overflowY: 'auto',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {(cancion?.versos || []).map((v) => {
                  const isSelected = lineasSeleccionadas.includes(v.linea);
                  return (
                    <div
                      key={v.linea}
                      onClick={() => toggleSeleccionLinea(v.linea)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1.5px solid ${isSelected ? '#c084fc' : 'rgba(255, 255, 255, 0.06)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ color: isSelected ? '#c084fc' : '#64748b', display: 'flex', alignItems: 'center' }}>
                        {isSelected ? <CheckSquare size={15} color="#c084fc" /> : <Square size={15} />}
                      </span>
                      <span style={{ fontSize: '0.88rem', color: isSelected ? '#ffffff' : '#cbd5e1', fontWeight: isSelected ? 700 : 400, fontStyle: 'italic' }}>
                        «{v.texto}»
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selector de Figura Poética */}
            <div>
              <label style={{ fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                ¿Qué figura o truco literario hay en esta selección? *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
                {FIGURAS_LITERARIAS.map((fig) => {
                  const isSelected = figuraSeleccionada === fig.id;
                  return (
                    <button
                      key={fig.id}
                      type="button"
                      onClick={() => setFiguraSeleccionada(fig.id)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        background: isSelected ? `${fig.color}25` : 'rgba(30, 41, 59, 0.4)',
                        border: `1.5px solid ${isSelected ? fig.color : 'rgba(255, 255, 255, 0.08)'}`,
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        textAlign: 'left',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ fontSize: '1.1rem' }}>{fig.icono}</span>
                      <span style={{ color: isSelected ? fig.color : '#cbd5e1' }}>{fig.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explicación / Comentario Opcional */}
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                ¿Por qué crees que es esta figura? (Opcional):
              </label>
              <textarea
                placeholder="Ej: Se repite la palabra al inicio o compara el viento con un animal..."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  color: '#fff',
                  border: '1px solid #334155',
                  fontSize: '0.82rem',
                  resize: 'none'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '2px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '9px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(236, 72, 153, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} /> 🚀 Enviar al Buzón Familiar (+50 PTS)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
