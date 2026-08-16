import React, { useState, useEffect } from 'react';
import { Disc, Search, X, Check, Sparkles, Filter } from 'lucide-react';
import { TEMAS_EMOCIONES } from '../../data/initialData';

export default function SongSelectorModal({
  isOpen,
  onClose,
  canciones = [],
  cancionActual,
  onSeleccionarCancion,
  audioStatus = {}
}) {
  const [busqueda, setBusqueda] = useState('');
  const [temaFiltro, setTemaFiltro] = useState('todos');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtrado dinámico por texto y categoría
  const cancionesFiltradas = canciones.filter(c => {
    const textoMatch = !busqueda.trim() || 
      c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.artistaNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.resumen_didactico && c.resumen_didactico.toLowerCase().includes(busqueda.toLowerCase()));
    
    const temaMatch = temaFiltro === 'todos' || c.temaId === temaFiltro;

    return textoMatch && temaMatch;
  });

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
          border: '2px solid #8b5cf6',
          maxWidth: '720px',
          width: '100%',
          maxHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 45px rgba(139, 92, 246, 0.35)',
          textAlign: 'left'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Disc size={24} color="#ec4899" className="spin-animation" /> 📦 Caja de Discos Poéticos
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Explora y elige qué misterio musical investigar hoy ({canciones.length} disponibles):
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Buscador Integrado y Filtro por Temática */}
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Campo de Búsqueda */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="🔍 Buscar por título, artista o verso..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1.5px solid rgba(139, 92, 246, 0.3)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none'
              }}
              autoFocus
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtros de Categorías Poéticas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={12} /> Temas:
            </span>
            {TEMAS_EMOCIONES.map(t => {
              const isSelected = temaFiltro === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTemaFiltro(t.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: isSelected ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ec4899' : '#cbd5e1',
                    border: `1px solid ${isSelected ? '#ec4899' : 'rgba(255, 255, 255, 0.08)'}`,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{t.icono}</span>
                  <span>{t.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Songs Grid inside modal with safe internal scroll */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '14px',
          overflowY: 'auto',
          padding: '4px',
          maxHeight: '380px',
          marginBottom: '16px'
        }}>
          {cancionesFiltradas.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>🔍🎵</span>
              No se encontraron canciones que coincidan con la búsqueda.
            </div>
          ) : (
            cancionesFiltradas.map((c) => {
              const isSelected = cancionActual && cancionActual.id === c.id;
              const estadoAudio = audioStatus?.[c.id] || 'vacio';

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    onSeleccionarCancion(c);
                    onClose();
                  }}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: `2px solid ${isSelected ? '#ec4899' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '16px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(236, 72, 153, 0.3)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: isSelected ? '#ffffff' : '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
                        🎵 {c.titulo}
                      </h4>
                      {isSelected && (
                        <span style={{ background: '#ec4899', color: '#ffffff', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 800, flexShrink: 0 }}>
                          Sonando 🎶
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700, margin: '4px 0 0 0' }}>
                      {c.artistaNombre} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({c.album})</span>
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '6px' }}>
                      {c.versos ? c.versos.length : 0} versos
                    </span>
                    
                    {estadoAudio === 'disponible' && (
                      <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>🟢 Con Audio</span>
                    )}
                    {estadoAudio === 'red' && (
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>🌐 Red</span>
                    )}
                    {estadoAudio === 'perdido' && (
                      <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 700 }}>⚠️ Sin Audio</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
