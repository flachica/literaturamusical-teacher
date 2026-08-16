import React from 'react';
import { Award, Star, Sparkles, X, MailCheck } from 'lucide-react';

export default function MochilaModal({
  isOpen,
  onClose,
  detectiveActivo,
  puntos,
  nivel,
  estrellas,
  logros,
  placasDesbloqueadas,
  sugerencias = []
}) {
  if (!isOpen || !detectiveActivo) return null;

  const obtenerRango = (pts) => {
    if (pts <= 150) return { nombre: 'Detective Novato', icono: '🔍', color: '#a78bfa', desc: '¡Estás dando tus primeros pasos en la investigación de letras!' };
    if (pts <= 350) return { nombre: 'Ayudante de Inspector', icono: '🧥', color: '#ec4899', desc: '¡Ya eres la mano derecha del inspector jefe de la poesía!' };
    if (pts <= 600) return { nombre: 'Inspector Literario', icono: '🕵️‍♀️', color: '#38bdf8', desc: '¡Analizas las figuras retóricas con una precisión asombrosa!' };
    return { nombre: 'Súper Detective de Oro', icono: '🏆', color: '#fbbf24', desc: '¡Leyenda de la Escuela de Detectives! Has descifrado todos los secretos.' };
  };

  const rango = obtenerRango(puntos);

  // Calcular descubrimientos pendientes de revisión por los padres
  const pendientesDetective = sugerencias.filter(
    s => s.detectiveId === detectiveActivo.id && s.estado === 'pendiente'
  );
  const sugerenciasPendientesCount = pendientesDetective.length;
  const puntosPendientesTotal = sugerenciasPendientesCount * 50;

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
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="modal-content-animate glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '2px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
          position: 'relative',
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column'
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
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            width: '34px',
            height: '34px',
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

        {/* Encabezado del perfil con Avatar y Rango */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px', marginBottom: '16px' }}>
          <div style={{
            fontSize: '3.2rem',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15))',
            width: '84px',
            height: '84px',
            borderRadius: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #a78bfa',
            flexShrink: 0,
            boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)'
          }}>
            {detectiveActivo.avatar}
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0', lineHeight: 1.2 }}>
              Mochila de {detectiveActivo.nombre}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.88rem',
                background: 'rgba(15, 23, 42, 0.7)',
                color: rango.color,
                padding: '4px 12px',
                borderRadius: '8px',
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: `1.5px solid ${rango.color}50`
              }}>
                {rango.icono} {rango.nombre}
              </span>
            </div>
          </div>
        </div>

        {/* Descripción del Rango (Legible) */}
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', background: 'rgba(15, 23, 42, 0.5)', padding: '10px 14px', borderRadius: '12px', borderLeft: `3.5px solid ${rango.color}`, margin: '0 0 16px 0', lineHeight: 1.45 }}>
          {rango.desc}
        </p>

        {/* Rejilla de Estadísticas de 4 Cajas (Con Puntos Pendientes del Buzón) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {/* Nivel */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 10px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid rgba(251, 191, 36, 0.3)' }}>
            <Award size={18} color="#fbbf24" style={{ marginBottom: '2px' }} />
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>NIVEL</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fbbf24' }}>{nivel}</div>
          </div>

          {/* Estrellas */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 10px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid rgba(236, 72, 153, 0.3)' }}>
            <Star size={18} color="#f472b6" fill="#f472b6" style={{ marginBottom: '2px' }} />
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>ESTRELLAS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f472b6' }}>{estrellas} ★</div>
          </div>

          {/* Puntos Actuales */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px 10px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid rgba(56, 189, 248, 0.3)' }}>
            <Sparkles size={18} color="#38bdf8" style={{ marginBottom: '2px' }} />
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>PUNTOS</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8' }}>{puntos} PTS</div>
          </div>

          {/* Puntos Pendientes en Buzón */}
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 10px', borderRadius: '14px', textAlign: 'center', border: '1.5px solid rgba(16, 185, 129, 0.4)' }}>
            <MailCheck size={18} color="#34d399" style={{ marginBottom: '2px' }} />
            <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 900, textTransform: 'uppercase' }}>EN REVISIÓN</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399' }}>
              +{puntosPendientesTotal} PTS
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              ({sugerenciasPendientesCount} en buzón)
            </span>
          </div>
        </div>

        {/* Sección de Placas y Logros (Tipografía Clara y Legible) */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#c084fc', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏆 Álbum de Placas y Logros
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', paddingRight: '4px' }}>
          {listaLogros.map((item) => {
            const tienePlaca = placasDesbloqueadas.includes(item.id);
            const porcentaje = Math.min(100, Math.round((item.actual / item.meta) * 100));

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: tienePlaca ? 'rgba(30, 41, 59, 0.7)' : 'rgba(15, 23, 42, 0.4)',
                  border: `1.5px solid ${tienePlaca ? `${item.color}60` : 'rgba(255, 255, 255, 0.08)'}`,
                  opacity: tienePlaca ? 1 : 0.8
                }}
              >
                {/* Insignia visual */}
                <div style={{
                  fontSize: '2.4rem',
                  background: tienePlaca ? `${item.color}20` : 'rgba(255, 255, 255, 0.03)',
                  border: `2px ${tienePlaca ? 'solid' : 'dashed'} ${tienePlaca ? item.color : 'rgba(255, 255, 255, 0.15)'}`,
                  width: '58px',
                  height: '58px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  filter: tienePlaca ? 'none' : 'grayscale(100%) opacity(40%)'
                }}>
                  {item.icono}
                </div>

                {/* Contenido e información con excelente lectura */}
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 900, color: tienePlaca ? item.color : '#f1f5f9', fontSize: '0.98rem' }}>
                      {item.titulo}
                    </span>
                    {tienePlaca ? (
                      <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: 900 }}>
                        ✓ CONSEGUIDO
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 800 }}>
                        {item.actual} / {item.meta}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                    {item.desc}
                  </p>

                  {/* Barra de progreso o mensaje */}
                  {tienePlaca ? (
                    <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      ✨ {item.mensajeExito}
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${porcentaje}%`,
                        height: '100%',
                        background: `linear-gradient(to right, ${item.color}80, ${item.color})`,
                        borderRadius: '4px',
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
