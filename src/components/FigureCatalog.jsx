import React, { useState } from 'react';
import { FIGURAS_LITERARIAS } from '../data/initialData';
import { BookOpen, Sparkles, Star, Edit3, X } from 'lucide-react';

export default function FigureCatalog({ figuras, onGuardarFiguras }) {
  const listaFiguras = figuras || FIGURAS_LITERARIAS;
  const [figuraSeleccionada, setFiguraSeleccionada] = useState(listaFiguras[0]);
  const [figuraEditando, setFiguraEditando] = useState(null);

  // Form states for in-place editor
  const [editIcono, setEditIcono] = useState('');
  const [editDefinicion, setEditDefinicion] = useState('');
  const [editEjemplo, setEditEjemplo] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editPuntos, setEditPuntos] = useState(10);

  const iniciarEdicion = (e, fig) => {
    e.stopPropagation(); // Avoid triggering selection on click
    setFiguraEditando(fig);
    setEditIcono(fig.icono || '📝');
    setEditDefinicion(fig.definicion_detective || fig.definicion_infantil || '');
    setEditEjemplo(fig.ejemplo_rapido || '');
    setEditBadge(fig.badge || '');
    setEditPuntos(fig.puntos_detective || 10);
  };

  const guardarEdicion = (e) => {
    e.preventDefault();
    if (!figuraEditando) return;

    const nuevasFiguras = listaFiguras.map(f => {
      if (f.id === figuraEditando.id) {
        return {
          ...f,
          icono: editIcono,
          definicion_detective: editDefinicion,
          definicion_infantil: editDefinicion,
          ejemplo_rapido: editEjemplo,
          badge: editBadge,
          puntos_detective: Number(editPuntos)
        };
      }
      return f;
    });

    onGuardarFiguras(nuevasFiguras);
    setFiguraEditando(null);

    // Keep active selected figure updated with modifications
    const updatedSel = nuevasFiguras.find(f => f.id === figuraSeleccionada.id);
    if (updatedSel) {
      setFiguraSeleccionada(updatedSel);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>
            <BookOpen size={14} /> Diccionario Didáctico
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            {onGuardarFiguras ? 'Gestión del Diccionario de Figuras' : 'Tarjetas de Figuras Literarias'}
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {onGuardarFiguras ? 'Edita los trucos poéticos en caliente' : 'Aprende qué significa cada truco poético'}
        </p>
      </div>

      {/* Grid of Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {listaFiguras.map((figura) => {
          const isSelected = figuraSeleccionada.id === figura.id;
          return (
            <div
              key={figura.id}
              onClick={() => setFiguraSeleccionada(figura)}
              style={{
                background: isSelected ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.6)',
                border: `2px solid ${isSelected ? figura.color : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isSelected ? `0 0 20px ${figura.color}33` : 'none',
                transform: isSelected ? 'translateY(-4px)' : 'none',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '2rem' }}>{figura.icono}</span>
                  {onGuardarFiguras && (
                    <button
                      onClick={(e) => iniciarEdicion(e, figura)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '4px',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      title="Editar figura literaria"
                    >
                      <Edit3 size={12} />
                    </button>
                  )}
                </div>
                <span className="badge" style={{ background: `${figura.color}22`, color: figura.color, border: `1px solid ${figura.color}44`, fontSize: '0.7rem' }}>
                  +{figura.puntos_detective} PTS
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: figura.color, marginBottom: '6px' }}>
                {figura.nombre}
              </h4>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
                {figura.definicion_detective || figura.definicion_infantil}
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.78rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                  Ejemplo: {figura.ejemplo_rapido}
                </p>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: figura.color, fontWeight: 700 }}>
                <Star size={12} fill={figura.color} />
                <span>{figura.badge}</span>
              </div>

            </div>
          );
        })}
      </div>

      {/* In-place Figures Editor Modal */}
      {figuraEditando && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <form
            onSubmit={guardarEdicion}
            style={{
              background: '#1e293b',
              padding: '24px',
              borderRadius: '20px',
              border: `1.5px solid ${figuraEditando.color}`,
              maxWidth: '500px',
              width: '100%',
              boxShadow: `0 0 30px ${figuraEditando.color}22`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✏️ Editar Figura: <span style={{ color: figuraEditando.color }}>{figuraEditando.nombre}</span>
              </h3>
              <button
                type="button"
                onClick={() => setFiguraEditando(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Icono</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={editIcono}
                  onChange={e => setEditIcono(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '1.4rem', textAlign: 'center', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Puntos Detective</label>
                <input
                  type="number"
                  required
                  min={5}
                  max={100}
                  value={editPuntos}
                  onChange={e => setEditPuntos(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Definición Poética Didáctica</label>
              <textarea
                required
                rows={3}
                value={editDefinicion}
                onChange={e => setEditDefinicion(e.target.value)}
                placeholder="Escribe la explicación adaptada para niños..."
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', fontSize: '0.88rem', resize: 'vertical', lineHeight: 1.4 }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Ejemplo Práctico Rápido</label>
              <input
                type="text"
                required
                value={editEjemplo}
                onChange={e => setEditEjemplo(e.target.value)}
                placeholder="Ej: El viento canta una canción..."
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Consejo Detective / Pista de búsqueda</label>
              <input
                type="text"
                required
                value={editBadge}
                onChange={e => setEditBadge(e.target.value)}
                placeholder="Ej: ¡Busca cosas humanas que hacen los objetos!"
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setFiguraEditando(null)}
                style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', fontWeight: 700, fontSize: '0.88rem' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
