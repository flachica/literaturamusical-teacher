import React from 'react';
import { Book, Play, ArrowRight, Sparkles } from 'lucide-react';
import { DICCIONARIO_RAE } from '../../data/initialData';

export default function StanzaReader({
  versoActual,
  cancion,
  onPlayEstrofa,
  palabraRaeActiva,
  setPalabraRaeActiva,
  onRegistrarLecturaDiccionario,
  onSiguientePaso,
  onAbrirSugerirModal
}) {
  const estrofaVersos = versoActual.estrofaNum
    ? cancion.versos.filter(v => v.estrofaNum === versoActual.estrofaNum)
    : [versoActual];

  const tienePalabrasDificiles = estrofaVersos.some(v => v.palabrasDificiles && v.palabrasDificiles.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* RAE Word modal popup if clicked */}
      {palabraRaeActiva && (
        <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(15, 23, 42, 0.95))', padding: '16px', borderRadius: '14px', border: '1px solid #f59e0b', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.92rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              📖 Diccionario RAE: {palabraRaeActiva.palabra}
            </h4>
            <button onClick={() => setPalabraRaeActiva(null)} style={{ background: 'none', border: 'none', color: '#fbbf24', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}>✕ Cerrar</button>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#f8fafc', lineHeight: 1.4, margin: 0 }}>
            {palabraRaeActiva.definicion}
          </p>
        </div>
      )}

      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '14px 18px',
        borderRadius: '18px',
        border: '1.5px solid rgba(139, 92, 246, 0.3)',
        textAlign: 'left',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            📖 Bloque Poético
          </span>
          <button
            onClick={() => onPlayEstrofa(estrofaVersos[0]?.tiempoInicio)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '0.76rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)'
            }}
            title="Escuchar esta estrofa completa desde su inicio"
          >
            <Play size={12} fill="#ffffff" /> Escuchar Estrofa
          </button>
        </div>

        {/* Poetic lines block */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          paddingLeft: '14px',
          borderLeft: '3.5px solid #8b5cf6'
        }}>
          {estrofaVersos.map((v) => {
            return (
              <div
                key={v.linea}
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  lineHeight: 1.55,
                  padding: '2px 0'
                }}
              >
                {v.texto.split(' ').map((palabra, i) => {
                  const limpia = palabra.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
                  const esDificil = v.palabrasDificiles && v.palabrasDificiles.includes(limpia);
                  if (esDificil) {
                    return (
                      <span
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPalabraRaeActiva(DICCIONARIO_RAE[limpia] || { palabra: limpia, definicion: 'Palabra destacada de la canción.' });
                          if (onRegistrarLecturaDiccionario) onRegistrarLecturaDiccionario();
                        }}
                        style={{
                          color: '#fbbf24',
                          textDecoration: 'underline dotted #fbbf24',
                          cursor: 'pointer',
                          background: 'rgba(245, 158, 11, 0.25)',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          margin: '0 2px',
                          display: 'inline-block'
                        }}
                        title="Haz clic para ver el secreto de la palabra en el Diccionario RAE"
                      >
                        {palabra}
                      </span>
                    );
                  }
                  return palabra + ' ';
                })}
              </div>
            );
          })}
        </div>

        {tienePalabrasDificiles && (
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Book size={12} /> Haz clic en las palabras amarillas para abrir el Diccionario RAE 🔍
          </div>
        )}
      </div>

      {/* Detective Proactivo: Botón "¡He descubierto una figura!" */}
      {onAbrirSugerirModal && (
        <button
          onClick={onAbrirSugerirModal}
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.2))',
            border: '1.5px solid #ec4899',
            color: '#f472b6',
            fontWeight: 800,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 0 12px rgba(236, 72, 153, 0.2)',
            transition: 'all 0.2s'
          }}
        >
          <Sparkles size={16} color="#ec4899" />
          <span>🔍 ¡He descubierto una nueva figura literaria en esta estrofa!</span>
        </button>
      )}

      <button
        onClick={onSiguientePaso}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
          flexShrink: 0
        }}
      >
        <span>He leído la estrofa → Resolver Reto de Comprensión</span> <ArrowRight size={18} />
      </button>
    </div>
  );
}
