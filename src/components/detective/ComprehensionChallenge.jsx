import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { prepareQuizOptions } from '../../utils/quizUtils';

export default function ComprehensionChallenge({
  versoActual,
  cancion,
  opcionComprension,
  onResponderComprension,
  onSiguientePaso,
  onVolverPaso
}) {
  const pregunta = (() => {
    const pg = versoActual.preguntaComprension;
    if (!pg || pg.includes('esta imagen') || pg.includes('esta canción') || pg.includes('este verso de')) {
      return `¿Qué transmite esta estrofa de ${cancion.artistaNombre}?`;
    }
    return pg;
  })();

  // Barajar opciones dinámicamente cuando cambie el verso actual
  const opcionesBarajadas = useMemo(() => {
    return prepareQuizOptions(versoActual.opcionesComprension || []);
  }, [versoActual?.linea, versoActual?.opcionesComprension]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
      <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8', marginBottom: '6px', lineHeight: 1.4 }}>
        {pregunta}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {opcionesBarajadas.map((opcion) => {
          const isSelected = opcionComprension?.id === opcion.id;
          const isCorrectAnswerSelected = opcionComprension?.correcta === true;
          let bg = 'rgba(15, 23, 42, 0.6)';
          let border = '1px solid rgba(255, 255, 255, 0.1)';

          if (isSelected) {
            bg = opcion.correcta ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
            border = opcion.correcta ? '1px solid #10b981' : '1px solid #ef4444';
          }

          const isDisabled = isCorrectAnswerSelected && !isSelected;

          return (
            <button
              key={opcion.id}
              disabled={isDisabled}
              onClick={() => onResponderComprension(opcion)}
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                textAlign: 'left',
                background: bg,
                border: border,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: isDisabled ? 'default' : 'pointer',
                opacity: isDisabled ? 0.45 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{opcion.texto}</span>
              {isSelected && (
                <span style={{ color: opcion.correcta ? '#10b981' : '#ef4444', fontWeight: 800, fontSize: '1.1rem' }}>
                  {opcion.correcta ? '✓' : '✕'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {opcionComprension && !opcionComprension.correcta && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ❌ Vuelve a escuchar y leer la estrofa con atención. ¡Puedes conseguirlo!
        </div>
      )}

      {opcionComprension?.correcta && (
        <div
          className="modal-content-animate"
          style={{
            marginTop: '10px',
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.1))',
            border: '1.5px solid rgba(16, 185, 129, 0.45)',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)'
          }}
        >
          <p style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.4 }}>
            🌟 ¡Excelente! Has comprendido muy bien el mensaje de la estrofa.
          </p>
          <button
            onClick={onSiguientePaso}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Paso 3: Identificar la Figura Poética</span> <ArrowRight size={14} />
          </button>
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
          <span>⬅ Volver a Leer Estrofa</span>
        </button>
      </div>
    </div>
  );
}
