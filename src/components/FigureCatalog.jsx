import React, { useState } from 'react';
import { FIGURAS_LITERARIAS } from '../data/mockData';
import { BookOpen, Sparkles, Star } from 'lucide-react';

export default function FigureCatalog() {
  const [figuraSeleccionada, setFiguraSeleccionada] = useState(FIGURAS_LITERARIAS[0]);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '6px' }}>
            <BookOpen size={14} /> Diccionario Didáctico
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Tarjetas de Figuras Literarias</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Aprende qué significa cada truco poético
        </p>
      </div>

      {/* Grid of Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {FIGURAS_LITERARIAS.map((figura) => {
          const isSelected = figuraSeleccionada.id === figura.id;
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
                transform: isSelected ? 'translateY(-4px)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '2rem' }}>{figura.icono}</span>
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

    </div>
  );
}
