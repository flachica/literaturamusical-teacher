import React from 'react';
import { FIGURAS_LITERARIAS } from '../../data/initialData';

export default function FigureChallenge({
  versoActual,
  opcionFigura,
  onResponderFigura,
  onVolverPaso
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f472b6', marginBottom: '4px' }}>
        🔮 ¿Qué truco de magia poética utiliza el autor en esta estrofa?
      </h4>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
        Pulsa sobre la figura literaria correcta para resolver el misterio:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {FIGURAS_LITERARIAS.map((fig) => {
          const isSelected = opcionFigura === fig.id;
          const esCorrecto = fig.id === versoActual.figuraId;

          let bg = 'rgba(15, 23, 42, 0.6)';
          let border = '1.5px solid rgba(255, 255, 255, 0.08)';

          if (opcionFigura) {
            if (isSelected) {
              bg = esCorrecto ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
              border = esCorrecto ? '2px solid #10b981' : '2px solid #ef4444';
            } else if (esCorrecto) {
              border = '1.5px dashed rgba(16, 185, 129, 0.5)';
            }
          }

          return (
            <button
              key={fig.id}
              onClick={() => onResponderFigura(fig.id)}
              style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: bg,
                border: border,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{fig.icono}</span>
              <div>
                <div style={{ color: fig.color, fontSize: '0.88rem' }}>{fig.nombre}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400 }}>+{fig.puntos_detective} pts</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Botón de arrepentirse / volver atrás */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '6px' }}>
        <button
          type="button"
          onClick={onVolverPaso}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#94a3b8',
            borderRadius: '10px',
            padding: '6px 14px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            transition: 'all 0.2s'
          }}
        >
          <span>⬅ Volver al Reto de Comprensión</span>
        </button>
      </div>
    </div>
  );
}
