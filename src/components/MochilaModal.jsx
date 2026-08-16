import React from 'react';
import { Award, Star, Sparkles, X, Trophy } from 'lucide-react';

export default function MochilaModal({
  isOpen,
  onClose,
  detectiveActivo,
  puntos,
  nivel,
  estrellas,
  logros,
  placasDesbloqueadas
}) {
  if (!isOpen || !detectiveActivo) return null;

  const obtenerRango = (pts) => {
    if (pts <= 150) return { nombre: 'Detective Novato', icono: '🔍', color: '#a78bfa', desc: '¡Estás dando tus primeros pasos en la investigación de letras!' };
    if (pts <= 350) return { nombre: 'Ayudante de Inspector', icono: '🧥', color: '#ec4899', desc: '¡Ya eres la mano derecha del inspector jefe de la poesía!' };
    if (pts <= 600) return { nombre: 'Inspector Literario', icono: '🕵️‍♀️', color: '#38bdf8', desc: '¡Analizas las figuras retóricas con una precisión asombrosa!' };
    return { nombre: 'Súper Detective de Oro', icono: '🏆', color: '#fbbf24', desc: '¡Leyenda de la Escuela de Detectives! Has descifrado todos los secretos.' };
  };

  const rango = obtenerRango(puntos);

  const listaLogros = [
    {
      id: 'lector',
      titulo: 'Placa del Lector',
      icono: '📖',
      desc: 'Por consultar el significado de palabras difíciles en el diccionario RAE.',
      actual: logros?.abiertasRAE || 0,
      meta: 5,
      mensajeExito: '¡Curioso como un búho!',
      color: '#c084fc'
    },
    {
      id: 'oido_lince',
      titulo: 'Oído de Lince',
      icono: '🦊',
      desc: 'Por escuchar estrofas individuales en el reproductor de karaoke.',
      actual: logros?.estrofasEscuchadas || 0,
      meta: 10,
      mensajeExito: '¡Oído musical súper agudo!',
      color: '#f472b6'
    },
    {
      id: 'racha_poetica',
      titulo: 'Racha Poética',
      icono: '✨',
      desc: 'Por responder 3 preguntas de comprensión seguidas sin fallar.',
      actual: logros?.rachaComprension || 0,
      meta: 3,
      mensajeExito: '¡Comprensión de acero!',
      color: '#38bdf8'
    },
    {
      id: 'melomano',
      titulo: 'Melómano Literario',
      icono: '🎵',
      desc: 'Por analizar versos en 3 canciones diferentes de tu catálogo.',
      actual: logros?.cancionesCompletadas?.length || 0,
      meta: 3,
      mensajeExito: '¡Gran explorador musical!',
      color: '#fbbf24'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="modal-content-animate glass-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1.5px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          color: '#ffffff',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: '#94a3b8',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title="Cerrar Mochila"
        >
          <X size={18} />
        </button>

        {/* Encabezado del perfil */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', marginBottom: '20px' }}>
          <div style={{
            fontSize: '3rem',
            background: 'rgba(139, 92, 246, 0.15)',
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(139, 92, 246, 0.4)'
          }}>
            {detectiveActivo.avatar}
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '0 0 4px 0' }}>
              Mochila de {detectiveActivo.nombre}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.82rem',
                background: 'rgba(15, 23, 42, 0.6)',
                color: rango.color,
                padding: '4px 10px',
                borderRadius: '8px',
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: `1.5px solid ${rango.color}40`
              }}>
                {rango.icono} {rango.nombre}
              </span>
            </div>
          </div>
        </div>

        {/* Descripción del Rango */}
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', background: 'rgba(15, 23, 42, 0.35)', padding: '12px 16px', borderRadius: '12px', borderLeft: `3px solid ${rango.color}`, margin: '0 0 20px 0', lineHeight: 1.5 }}>
          {rango.desc}
        </p>

        {/* Sub-tarjetas de estadísticas principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.45)', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Award size={16} color="#fbbf24" style={{ marginBottom: '2px' }} />
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>NIVEL</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fbbf24' }}>{nivel}</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.45)', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Star size={16} color="#ec4899" fill="#ec4899" style={{ marginBottom: '2px' }} />
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>ESTRELLAS</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f472b6' }}>{estrellas}</div>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.45)', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Sparkles size={16} color="#38bdf8" style={{ marginBottom: '2px' }} />
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>PUNTOS</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8' }}>{puntos}</div>
          </div>
        </div>

        {/* Lista de Placas de Logros */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#c084fc', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🏆 Álbum de Placas y Logros
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
          {listaLogros.map((item) => {
            const tienePlaca = placasDesbloqueadas.includes(item.id);
            const porcentaje = Math.min(100, Math.round((item.actual / item.meta) * 100));

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '16px',
                  background: tienePlaca ? 'rgba(30, 41, 59, 0.6)' : 'rgba(15, 23, 42, 0.25)',
                  border: `1.5px solid ${tienePlaca ? `${item.color}50` : 'rgba(255, 255, 255, 0.05)'}`,
                  opacity: tienePlaca ? 1 : 0.7
                }}
              >
                {/* Insignia visual */}
                <div style={{
                  fontSize: '2.2rem',
                  background: tienePlaca ? `${item.color}15` : 'rgba(255, 255, 255, 0.03)',
                  border: `1.5px ${tienePlaca ? 'solid' : 'dashed'} ${tienePlaca ? `${item.color}60` : 'rgba(255, 255, 255, 0.1)'}`,
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  filter: tienePlaca ? 'none' : 'grayscale(100%) opacity(40%)'
                }}>
                  {item.icono}
                </div>

                {/* Contenido e información */}
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 800, color: tienePlaca ? item.color : '#94a3b8', fontSize: '0.9rem' }}>
                      {item.titulo}
                    </span>
                    {tienePlaca ? (
                      <span style={{ fontSize: '0.68rem', background: '#10b981', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        CONSEGUIDO
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                        {item.actual} / {item.meta}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                    {item.desc}
                  </p>

                  {/* Barra de progreso si está bloqueado, o mensaje de éxito */}
                  {tienePlaca ? (
                    <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      ✨ {item.mensajeExito}
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${porcentaje}%`,
                        height: '100%',
                        background: `linear-gradient(to right, ${item.color}80, ${item.color})`,
                        borderRadius: '3px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
