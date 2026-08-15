import React, { useState } from 'react';
import { FIGURAS_LITERARIAS } from '../data/initialData';
import { BookOpen, Sparkles, Star, Edit3, Trash2, Plus, X } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function FigureCatalog({ figuras, onGuardarFiguras }) {
  const listaFiguras = figuras || FIGURAS_LITERARIAS;
  const [figuraSeleccionada, setFiguraSeleccionada] = useState(listaFiguras[0]);
  const [figuraEditando, setFiguraEditando] = useState(null);
  const [esCreacion, setEsCreacion] = useState(false);
  const [figuraAEliminar, setFiguraAEliminar] = useState(null);

  // Form states for in-place editor
  const [editNombre, setEditNombre] = useState('');
  const [editColor, setEditColor] = useState('#f59e0b');
  const [editIcono, setEditIcono] = useState('');
  const [editDefinicion, setEditDefinicion] = useState('');
  const [editEjemplo, setEditEjemplo] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editPuntos, setEditPuntos] = useState(10);

  const iniciarEdicion = (e, fig) => {
    e.stopPropagation(); // Avoid triggering selection on click
    setFiguraEditando(fig);
    setEsCreacion(false);
    setEditNombre(fig.nombre || '');
    setEditColor(fig.color || '#f59e0b');
    setEditIcono(fig.icono || '📝');
    setEditDefinicion(fig.definicion_detective || fig.definicion_infantil || '');
    setEditEjemplo(fig.ejemplo_rapido || '');
    setEditBadge(fig.badge || '');
    setEditPuntos(fig.puntos_detective || 10);
  };

  const iniciarCreacion = () => {
    setEsCreacion(true);
    const nuevaId = `figura_${Date.now()}`;
    setFiguraEditando({
      id: nuevaId,
      nombre: '',
      color: '#06b6d4',
      icono: '📝',
      definicion_detective: '',
      ejemplo_rapido: '',
      badge: '',
      puntos_detective: 10
    });
    setEditNombre('');
    setEditColor('#06b6d4');
    setEditIcono('📝');
    setEditDefinicion('');
    setEditEjemplo('');
    setEditBadge('');
    setEditPuntos(10);
  };

  const guardarEdicion = (e) => {
    e.preventDefault();
    if (!figuraEditando) return;

    let nuevasFiguras;
    if (esCreacion) {
      const nuevaFig = {
        id: figuraEditando.id,
        nombre: editNombre,
        color: editColor,
        icono: editIcono,
        definicion_detective: editDefinicion,
        definicion_infantil: editDefinicion,
        ejemplo_rapido: editEjemplo,
        badge: editBadge,
        puntos_detective: Number(editPuntos),
        esNueva: true
      };
      nuevasFiguras = [...listaFiguras, nuevaFig];
      setFiguraSeleccionada(nuevaFig);
    } else {
      nuevasFiguras = listaFiguras.map(f => {
        if (f.id === figuraEditando.id) {
          return {
            ...f,
            nombre: editNombre,
            color: editColor,
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
      
      // Keep selected figure updated
      const updatedSel = nuevasFiguras.find(f => f.id === figuraSeleccionada.id);
      if (updatedSel) {
        setFiguraSeleccionada(updatedSel);
      }
    }

    onGuardarFiguras(nuevasFiguras);
    setFiguraEditando(null);
    setEsCreacion(false);
  };

  const ejecutarEliminacionFigura = () => {
    if (!figuraAEliminar) return;
    const nuevasFiguras = listaFiguras.filter(f => f.id !== figuraAEliminar.id);
    onGuardarFiguras(nuevasFiguras);
    setFiguraAEliminar(null);
    if (nuevasFiguras.length > 0) {
      setFiguraSeleccionada(nuevasFiguras[0]);
    }
  };

  return (
    <div className={onGuardarFiguras ? "" : "glass-panel"} style={{ padding: onGuardarFiguras ? '0px' : '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
            {onGuardarFiguras ? 'Gestión del Diccionario de Figuras' : 'Tarjetas de Figuras Literarias'}
          </h3>
        </div>
        
        {onGuardarFiguras && (
          <button
            onClick={iniciarCreacion}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 0.2s'
            }}
            title="Añadir nueva figura poética al diccionario"
          >
            <Plus size={16} /> Añadir Figura
          </button>
        )}
      </div>

      {/* Grid of Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {listaFiguras.map((figura) => {
          const isSelected = figuraSeleccionada.id === figura.id;
          const esDeFabrica = ['metafora', 'simil', 'personificacion', 'hiperbole', 'aliteracion', 'anafora'].includes(figura.id);
          
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
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                        title="Editar figura"
                      >
                        <Edit3 size={12} />
                      </button>

                      {!esDeFabrica && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFiguraAEliminar(figura);
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: '6px',
                            padding: '4px',
                            color: '#fca5a5',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          title="Eliminar figura"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
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
        <div
          className="modal-overlay-animate"
          style={{
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
          }}
        >
          <form
            onSubmit={guardarEdicion}
            className="modal-content-animate"
            style={{
              background: '#1e293b',
              padding: '24px',
              borderRadius: '20px',
              border: `1.5px solid ${editColor}`,
              maxWidth: '500px',
              width: '100%',
              boxShadow: `0 0 30px ${editColor}22`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {esCreacion ? '➕ Nueva Figura Poética' : `✏️ Editar Figura: ${figuraEditando.nombre}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setFiguraEditando(null);
                  setEsCreacion(false);
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nombre de la Figura *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Símil o Comparación"
                  value={editNombre}
                  onChange={e => setEditNombre(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Color (CSS) *</label>
                <select
                  value={editColor}
                  onChange={e => setEditColor(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', fontSize: '0.88rem' }}
                >
                  <option value="#06b6d4">🩵 Cian</option>
                  <option value="#f59e0b">🧡 Ámbar</option>
                  <option value="#8b5cf6">💜 Morado</option>
                  <option value="#ec4899">🩷 Rosa</option>
                  <option value="#10b981">💚 Esmeralda</option>
                  <option value="#3b82f6">💙 Azul</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Emoji *</label>
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
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Puntos Detective *</label>
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
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Definición Poética Didáctica *</label>
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
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Ejemplo Práctico Rápido *</label>
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
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Consejo Detective / Pista de búsqueda *</label>
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
                onClick={() => {
                  setFiguraEditando(null);
                  setEsCreacion(false);
                }}
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

      {/* Modal de confirmación para eliminar figura literaria personalizada */}
      <ConfirmModal
        isOpen={Boolean(figuraAEliminar)}
        titulo="¿Eliminar figura literaria?"
        mensaje={`¿Estás seguro de que deseas eliminar la figura «${figuraAEliminar?.nombre}»? Esta acción la borrará permanentemente de tu diccionario didáctico.`}
        textoConfirmar="Eliminar Figura"
        textoCancelar="Conservar"
        variante="peligro"
        requiereCheck={true}
        onConfirm={ejecutarEliminacionFigura}
        onCancel={() => setFiguraAEliminar(null)}
      />

    </div>
  );
}
