import React from 'react';
import { FIGURAS_LITERARIAS } from '../../data/initialData';

export default function FigureChallenge({
  versoActual,
  opcionFigura,
  onResponderFigura,
  onVolverPaso,
  figuras
}) {
  const listadoFiguras = (figuras && Array.isArray(figuras) && figuras.length > 0) ? figuras : FIGURAS_LITERARIAS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f472b6', marginBottom: '4px' }}>
        🔮 ¿Qué truco de magia poética utiliza el autor en esta estrofa?
      </h4>
      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>
        Pulsa sobre la figura literaria correcta para resolver el misterio:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {listadoFiguras.map((fig) => {
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

      {/* EXPLICACIÓN DIDÁCTICA AL SELECCIONAR FIGURA */}
      {opcionFigura && (
        <div
          style={{
            marginTop: '8px',
            padding: '14px 16px',
            borderRadius: '14px',
            background: opcionFigura === versoActual.figuraId ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(56, 189, 248, 0.1))' : 'rgba(239, 68, 68, 0.15)',
            border: opcionFigura === versoActual.figuraId ? '1.5px solid #10b981' : '1.5px solid #ef4444',
            textAlign: 'left',
            boxShadow: opcionFigura === versoActual.figuraId ? '0 4px 16px rgba(16, 185, 129, 0.15)' : 'none'
          }}
        >
          {opcionFigura === versoActual.figuraId ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🎉 ¡Excelente acertijo! Es una {versoActual.figuraNombre || 'Figura Literaria'}
              </div>

              {versoActual.textoLiteral && (
                <div style={{ fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.4 }}>
                  📖 <strong>Lo que dice literalmente:</strong> «{versoActual.textoLiteral}»
                </div>
              )}

              {versoActual.significadoReal && (
                <div style={{ fontSize: '0.82rem', color: '#fbbf24', lineHeight: 1.4 }}>
                  ✨ <strong>Lo que significa realmente:</strong> {versoActual.significadoReal}
                </div>
              )}

              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45, marginTop: '2px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
                💡 <strong>¿Por qué es una {versoActual.figuraNombre}?:</strong> {versoActual.explicacionFigura || versoActual.explicacion}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: '#fca5a5', fontWeight: 600 }}>
              ❌ No es esa figura. Lee con atención la estrofa y busca el truco de magia poética que utiliza el autor. ¡Puedes lograrlo!
            </div>
          )}
        </div>
      )}

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
