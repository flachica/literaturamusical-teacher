import React, { useState } from 'react';
import SongManager from './SongManager';
import FigureCatalog from './FigureCatalog';
import ConfirmModal from './ConfirmModal';
import DetectiveProfileManager from './admin/DetectiveProfileManager';

export default function ModoAdmin({
  canciones,
  figuras,
  audioStatus,
  onGuardarCanciones,
  onGuardarFiguras,
  puntos,
  nivel,
  estrellas,
  onResetProgreso,
  pestanaActiva,
  detectives = [],
  detectiveActivo,
  onSeleccionarDetective,
  onCrearDetective,
  onRenombrarDetective,
  onEliminarDetective
}) {
  const [mostrarConfirmReset, setMostrarConfirmReset] = useState(false);
  const [detectiveAReiniciar, setDetectiveAReiniciar] = useState(null);
  const [detectiveAEliminar, setDetectiveAEliminar] = useState(null);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);

  const ejecutarEliminarDetective = () => {
    if (!detectiveAEliminar) return;
    onEliminarDetective(detectiveAEliminar.id);
    setMostrarConfirmEliminar(false);
    setDetectiveAEliminar(null);
  };

  const ejecutarResetProgreso = () => {
    if (!detectiveAReiniciar) return;
    onResetProgreso(detectiveAReiniciar.id);
    setMostrarConfirmReset(false);
    setDetectiveAReiniciar(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '10px' }}>

      {/* Renderizado Condicional por Pestaña */}
      {pestanaActiva === 'canciones' && (
        <SongManager
          canciones={canciones}
          audioStatus={audioStatus}
          onGuardarCanciones={onGuardarCanciones}
        />
      )}

      {pestanaActiva === 'figuras' && (
        <FigureCatalog figuras={figuras} onGuardarFiguras={onGuardarFiguras} />
      )}

      {pestanaActiva === 'ajustes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Grid de Estadísticas de la Detective Activa */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              👤 Detective Activo actual: <span style={{ color: '#a78bfa' }}>{detectiveActivo?.avatar} {detectiveActivo?.nombre}</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              
              {/* Tarjeta 1: Puntos */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ fontSize: '2.2rem' }}>🏆</div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Puntos Totales</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fbbf24' }}>{puntos} PTS</span>
                </div>
              </div>

              {/* Tarjeta 2: Nivel */}
              <div style={{
                background: 'rgba(139, 92, 246, 0.06)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ fontSize: '2.2rem' }}>⚡</div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nivel de Rango</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#c084fc' }}>Nivel {nivel}</span>
                </div>
              </div>

              {/* Tarjeta 3: Estrellas */}
              <div style={{
                background: 'rgba(236, 72, 153, 0.06)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ fontSize: '2.2rem' }}>✨</div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estrellas Obtenidas</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f472b6' }}>{estrellas} ★</span>
                </div>
              </div>

            </div>
          </div>

          {/* Sección de Gestión Multidetective */}
          <DetectiveProfileManager
            detectives={detectives}
            onCrearDetective={onCrearDetective}
            onRenombrarDetective={onRenombrarDetective}
            onSolicitarReset={(det) => {
              setDetectiveAReiniciar(det);
              setMostrarConfirmReset(true);
            }}
            onSolicitarEliminar={(det) => {
              setDetectiveAEliminar(det);
              setMostrarConfirmEliminar(true);
            }}
          />

        </div>
      )}

      {/* Modal de confirmación para reiniciar progreso */}
      <ConfirmModal
        isOpen={mostrarConfirmReset}
        titulo={`¿Reiniciar progreso de ${detectiveAReiniciar?.nombre}?`}
        mensaje={`¿Seguro que quieres reiniciar las puntuaciones, nivel y estrellas acumuladas de ${detectiveAReiniciar?.nombre} a 0? Esta acción borrará permanentemente sus estadísticas.`}
        textoConfirmar="Sí, reiniciar todo"
        textoCancelar="Cancelar"
        variante="peligro"
        onConfirm={ejecutarResetProgreso}
        onCancel={() => {
          setMostrarConfirmReset(false);
          setDetectiveAReiniciar(null);
        }}
      />

      {/* Modal de confirmación para eliminar detective */}
      <ConfirmModal
        isOpen={mostrarConfirmEliminar}
        titulo={`¿Eliminar al detective ${detectiveAEliminar?.nombre}?`}
        mensaje={`¿Seguro que quieres eliminar a ${detectiveAEliminar?.nombre}? Se perderán definitivamente todos sus puntos, nivel y estrellas. Esta acción no se puede deshacer.`}
        textoConfirmar="Sí, eliminar"
        textoCancelar="Cancelar"
        variante="peligro"
        onConfirm={ejecutarEliminarDetective}
        onCancel={() => {
          setMostrarConfirmEliminar(false);
          setDetectiveAEliminar(null);
        }}
      />

    </div>
  );
}
