import React from 'react';
import { Trash2 } from 'lucide-react';

export default function SongCard({
  cancion,
  audioStatus,
  reparandoSongId,
  reparandoGlobal,
  onSolicitarEliminar,
  onRecuperarAudio
}) {
  return (
    <div className="admin-song-card">
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.01em', marginBottom: '2px' }}>🎵 {cancion.titulo}</h4>
          <button
            onClick={() => onSolicitarEliminar(cancion)}
            className="btn-trash"
            style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
            title="Eliminar del catálogo"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#fbbf24', fontWeight: 700, marginTop: '2px' }}>
          {cancion.artistaNombre} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({cancion.album})</span>
        </p>

        {/* Indicador de estado del audio */}
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {audioStatus[cancion.id] === 'disponible' && (
            <span style={{ fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              🟢 Audio en disco
            </span>
          )}
          {audioStatus[cancion.id] === 'red' && (
            <span style={{ fontSize: '0.78rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '8px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              🌐 Audio en Red
            </span>
          )}
          {audioStatus[cancion.id] === 'perdido' && (
            <span style={{ fontSize: '0.78rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '3px 8px', borderRadius: '8px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ⚠️ Audio no encontrado
            </span>
          )}
          {audioStatus[cancion.id] === 'checking' && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              🔍 Comprobando audio...
            </span>
          )}

          {/* Botón de recuperar individual */}
          {audioStatus[cancion.id] === 'perdido' && (
            <button
              onClick={() => onRecuperarAudio(cancion)}
              disabled={reparandoSongId === cancion.id || reparandoGlobal}
              style={{
                padding: '3px 8px',
                borderRadius: '6px',
                background: reparandoSongId === cancion.id ? '#475569' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: (reparandoSongId === cancion.id || reparandoGlobal) ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {reparandoSongId === cancion.id ? '⏳ Descargando...' : '⚡ Recuperar'}
            </button>
          )}
        </div>

        <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '12px', lineHeight: 1.5 }}>
          {cancion.resumen_didactico}
        </p>
      </div>

      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <span>Versos interactivos: <strong>{cancion.versos ? cancion.versos.length : 0}</strong></span>
        <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
          {cancion.temaNombre || 'Poesía'}
        </span>
      </div>
    </div>
  );
}
