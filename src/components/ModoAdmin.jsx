import React, { useState } from 'react';
import SongManager from './SongManager';
import FigureCatalog from './FigureCatalog';
import ConfirmModal from './ConfirmModal';
import { Settings, Database, RotateCcw, Trophy, Star, Shield } from 'lucide-react';

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
  pestanaActiva
}) {
  const [mensajeProgreso, setMensajeProgreso] = useState('');
  const [mostrarConfirmReset, setMostrarConfirmReset] = useState(false);

  const ejecutarResetProgreso = () => {
    onResetProgreso();
    setMostrarConfirmReset(false);
    setMensajeProgreso('¡Progreso reiniciado correctamente!');
    setTimeout(() => setMensajeProgreso(''), 3000);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Grid de Estadísticas de la Detective */}
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

          {/* Tarjeta de Control y Reseteo */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ maxWidth: '600px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Zona de Peligro: Reiniciar Datos de Juego
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Esta acción borrará de forma irreversible todo el progreso actual de la detective (puntuación, nivel, estrellas acumuladas y medallas obtenidas) restableciendo el perfil a cero.
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <button
                onClick={() => setMostrarConfirmReset(true)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <RotateCcw size={16} /> Reiniciar Historial
              </button>
              {mensajeProgreso && (
                <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700, display: 'block', marginTop: '4px' }}>{mensajeProgreso}</span>
              )}
            </div>
          </div>

        </div>
      )}



      {/* Modal de confirmación para reiniciar progreso */}
      <ConfirmModal
        isOpen={mostrarConfirmReset}
        titulo="¿Reiniciar progreso de la detective?"
        mensaje="¿Seguro que quieres reiniciar las puntuaciones, nivel y estrellas acumuladas a 0? Esta acción borrará el progreso almacenado en el disco."
        textoConfirmar="Sí, reiniciar todo"
        textoCancelar="Cancelar"
        variante="peligro"
        onConfirm={ejecutarResetProgreso}
        onCancel={() => setMostrarConfirmReset(false)}
      />

    </div>
  );
}
