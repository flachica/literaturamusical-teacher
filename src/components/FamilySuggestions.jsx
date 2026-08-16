import React from 'react';
import { MessageSquare, Sparkles, Check, Heart, Trash2, Calendar, User } from 'lucide-react';

export default function FamilySuggestions({
  sugerencias = [],
  onAprobarSugerencia,
  onMarcarCenaSugerencia,
  onEliminarSugerencia
}) {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            <MessageSquare size={14} /> Buzón Familiar de Descubrimientos
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>
            📬 Descubrimientos Literarios Propuestos ({sugerencias.length})
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '380px', textAlign: 'right' }}>
          Revisa las figuras literarias que tu hija o hijo ha descubierto en las canciones y premia su lectura atenta.
        </p>
      </div>

      {sugerencias.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>📬✨</span>
          <h4 style={{ color: '#ffffff', fontWeight: 800, margin: '0 0 6px 0' }}>Buzón Vacío</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Tu detective aún no ha enviado descubrimientos. Cuando lea una estrofa en el Modo Detective y pulse <em>«¡He descubierto una figura!»</em>, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {sugerencias.map((item) => {
            const isAprobada = item.estado === 'aprobada';
            const isCena = item.estado === 'cena';

            return (
              <div
                key={item.id}
                style={{
                  background: isAprobada
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.8))'
                    : isCena
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(15, 23, 42, 0.8))'
                    : 'rgba(30, 41, 59, 0.7)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: `1.5px solid ${isAprobada ? '#10b981' : isCena ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  {/* Detective badge + date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#ec4899', fontWeight: 800, background: 'rgba(236, 72, 153, 0.15)', padding: '3px 10px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{item.detectiveAvatar}</span>
                      <span>{item.detectiveNombre}</span>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {item.fecha}
                    </span>
                  </div>

                  {/* Versos propuestos */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: '10px', borderLeft: `3.5px solid ${item.figuraColor || '#ec4899'}`, marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      🎵 {item.cancionTitulo} {item.lineasTexto?.length > 1 ? `(${item.lineasTexto.length} versos)` : ''}
                    </span>
                    {Array.isArray(item.lineasTexto) && item.lineasTexto.length > 0 ? (
                      item.lineasTexto.map((linea, idx) => (
                        <p key={idx} style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', margin: '2px 0', fontStyle: 'italic', lineHeight: 1.4 }}>
                          «{linea}»
                        </p>
                      ))
                    ) : (
                      <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', margin: 0, fontStyle: 'italic' }}>
                        «{item.lineaTexto}»
                      </p>
                    )}
                  </div>

                  {/* Figura propuesta por la niña */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Creemos que es:</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: item.figuraColor || '#38bdf8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>{item.figuraIcono}</span>
                      <span>{item.figuraNombre}</span>
                    </span>
                  </div>

                  {/* Explicación de la niña */}
                  {item.comentario && (
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', fontStyle: 'italic', margin: 0, background: 'rgba(0,0,0,0.2)', padding: '8px 10px', borderRadius: '8px' }}>
                      💬 "{item.comentario}"
                    </p>
                  )}
                </div>

                {/* Status Badges or Parent Actions */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  {isAprobada ? (
                    <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> ¡Aprobada! (+100 PTS y +1 ⭐ otorgadas)
                    </span>
                  ) : isCena ? (
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      💬 Guardada para hablar en la cena
                    </span>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                      <button
                        onClick={() => onAprobarSugerencia(item.id)}
                        style={{
                          flex: 2,
                          padding: '7px 10px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Sparkles size={13} /> Aprobar (+100 PTS)
                      </button>
                      
                      <button
                        onClick={() => onMarcarCenaSugerencia(item.id)}
                        style={{
                          flex: 1,
                          padding: '7px 8px',
                          borderRadius: '8px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                        title="Guardar para conversar durante la cena"
                      >
                        💬 Cena
                      </button>

                      <button
                        onClick={() => onEliminarSugerencia(item.id)}
                        style={{
                          padding: '7px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          cursor: 'pointer'
                        }}
                        title="Descartar sugerencia"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
