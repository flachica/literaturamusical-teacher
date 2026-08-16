import React, { useEffect } from 'react';
import { Disc, Music, X, Check, Sparkles } from 'lucide-react';

export default function SongSelectorModal({
  isOpen,
  onClose,
  canciones = [],
  cancionActual,
  onSeleccionarCancion,
  audioStatus = {}
}) {
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
          maxWidth: '680px',
          width: '100%',
          maxHeight: 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.35)',
          textAlign: 'left'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Disc size={22} color="#ec4899" /> 📦 Caja de Discos Poéticos
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Elige qué canción quieres escuchar e investigar hoy:
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

        {/* Songs Grid inside modal with safe internal scroll */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
          overflowY: 'auto',
          padding: '4px',
          maxHeight: '420px',
          marginBottom: '16px'
        }}>
          {canciones.map((c) => {
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
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15))'
                    : 'rgba(15, 23, 42, 0.5)',
                  border: `2px solid ${isSelected ? '#ec4899' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '16px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  boxShadow: isSelected ? '0 0 16px rgba(236, 72, 153, 0.25)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: isSelected ? '#ffffff' : '#f1f5f9', margin: 0, lineHeight: 1.3 }}>
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
          })}
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
