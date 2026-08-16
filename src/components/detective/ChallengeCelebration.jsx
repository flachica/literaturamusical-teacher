import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Award } from 'lucide-react';

export default function ChallengeCelebration({
  versoActual,
  totalEstrofas,
  placasDesbloqueadas,
  onReiniciar,
  onCambiarEstrofa
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', height: '100%' }}>
      <div style={{
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(139, 92, 246, 0.12))',
        padding: '16px',
        borderRadius: '16px',
        border: '1.5px solid rgba(16, 185, 129, 0.35)',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🎉 🔮</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 950, color: '#ffffff', marginBottom: '4px' }}>
          ¡Gran Trabajo, Detective!
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#e2e8f0', maxWidth: '440px', margin: '0 auto 10px', lineHeight: 1.45 }}>
          {versoActual.explicacion}
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#ffffff', padding: '6px 14px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.82rem' }}>
          <Trophy size={14} /> +150 Puntos de Detective Añadidos
        </div>
      </div>

      {/* MINI ÁLBUM DE PLACAS DE LOGRO EN CELEBRACIÓN */}
      <div style={{
        padding: '12px',
        background: 'rgba(15, 23, 42, 0.45)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        textAlign: 'left'
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c084fc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Award size={14} /> Tu Progreso de Detective:
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px'
        }}>
          {[
            { id: 'lector', titulo: 'Lector', icono: '📖', color: '#c084fc' },
            { id: 'oido_lince', titulo: 'Oído', icono: '🦊', color: '#f472b6' },
            { id: 'racha_poetica', titulo: 'Racha', icono: '✨', color: '#38bdf8' },
            { id: 'melomano', titulo: 'Canciones', icono: '🎵', color: '#fbbf24' }
          ].map(p => {
            const conseguido = placasDesbloqueadas?.includes(p.id);
            return (
              <div key={p.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '8px',
                background: conseguido ? `${p.color}15` : 'rgba(30, 41, 59, 0.2)',
                border: `1px ${conseguido ? 'solid' : 'dashed'} ${conseguido ? `${p.color}50` : 'rgba(255, 255, 255, 0.08)'}`,
                opacity: conseguido ? 1 : 0.45
              }} title={p.titulo}>
                <span style={{ fontSize: '1.25rem', marginBottom: '2px', filter: conseguido ? 'none' : 'grayscale(100%)' }}>{p.icono}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: conseguido ? p.color : '#94a3b8' }}>{p.titulo}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={onReiniciar}
          style={{
            flexGrow: 1,
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            fontWeight: 700,
            fontSize: '0.82rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={12} /> Analizar de nuevo
        </button>
        {versoActual.estrofaNum < totalEstrofas && (
          <button
            onClick={() => onCambiarEstrofa((versoActual.estrofaNum || 1) + 1)}
            style={{
              flexGrow: 1.5,
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(139, 92, 246, 0.3)'
            }}
          >
            <span>Siguiente Estrofa</span> <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
