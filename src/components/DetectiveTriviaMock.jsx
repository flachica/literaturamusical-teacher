import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Target, Trophy, Sparkles, CheckCircle, XCircle } from 'lucide-react';

export default function DetectiveTriviaMock({ onGanarPuntos }) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [completado, setCompletado] = useState(false);

  const pregunta = {
    verso: "«El tiempo es un río suave que avanza sin descansar»",
    cancion: "El Río del Tiempo - Banda Educativa",
    correcta: "metafora",
    opciones: [
      { id: "simil", texto: "Símil (Comparación con 'como')", icono: "🪞" },
      { id: "metafora", texto: "Metáfora (Decir que el tiempo ES un río)", icono: "✨" },
      { id: "hiperbole", texto: "Hipérbole (Exageración gigante)", icono: "🚀" }
    ]
  };

  const handleResponder = (opcionId) => {
    if (completado) return;
    setOpcionSeleccionada(opcionId);

    if (opcionId === pregunta.correcta) {
      setCompletado(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onGanarPuntos) onGanarPuntos(100);
    }
  };

  return (
    <div className="glass-panel glass-panel-glow" style={{ padding: '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-gold">
            <Target size={14} /> Misión de Detective
          </span>
          <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 700 }}>
            +100 Puntos
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Trivia de Demostración v0.1.0
        </span>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
        ¿Qué figura literaria se utiliza en este verso?
      </h3>

      <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px', borderLeft: '4px solid var(--primary)' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', fontStyle: 'italic' }}>
          {pregunta.verso}
        </p>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>— {pregunta.cancion}</span>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {pregunta.opciones.map((opcion) => {
          const isCorrect = opcion.id === pregunta.correcta;
          const isSelected = opcionSeleccionada === opcion.id;

          let btnBg = 'rgba(30, 41, 59, 0.7)';
          let btnBorder = 'rgba(255, 255, 255, 0.1)';

          if (isSelected) {
            if (isCorrect) {
              btnBg = 'rgba(16, 185, 129, 0.2)';
              btnBorder = '#10b981';
            } else {
              btnBg = 'rgba(239, 68, 68, 0.2)';
              btnBorder = '#ef4444';
            }
          }

          return (
            <button
              key={opcion.id}
              onClick={() => handleResponder(opcion.id)}
              disabled={completado}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderRadius: '12px',
                background: btnBg,
                border: `1.5px solid ${btnBorder}`,
                color: '#f8fafc',
                fontWeight: 700,
                fontSize: '0.95rem',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem' }}>{opcion.icono}</span>
                <span>{opcion.texto}</span>
              </div>

              {isSelected && (
                isCorrect ? (
                  <CheckCircle size={20} color="#10b981" />
                ) : (
                  <XCircle size={20} color="#ef4444" />
                )
              )}
            </button>
          );
        })}
      </div>

      {completado && (
        <div style={{ marginTop: '16px', background: 'rgba(16, 185, 129, 0.15)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy size={20} color="#10b981" />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399' }}>
              ¡Excelente trabajo, Detective! 🎉
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0' }}>
              ¡Has ganado 100 puntos y la insignia «Maestro de la Metáfora»!
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
