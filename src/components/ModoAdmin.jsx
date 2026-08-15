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
  onRestaurarCanciones,
  onGuardarFiguras,
  puntos,
  nivel,
  estrellas,
  onResetProgreso
}) {
  const [pestanaActiva, setPestanaActiva] = useState('canciones');
  const [mensajeProgreso, setMensajeProgreso] = useState('');
  const [mostrarConfirmReset, setMostrarConfirmReset] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  const ejecutarResetProgreso = () => {
    onResetProgreso();
    setMostrarConfirmReset(false);
    setMensajeProgreso('¡Progreso reiniciado correctamente!');
    setTimeout(() => setMensajeProgreso(''), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '10px' }}>

      {/* Selector de Pestañas de Administración (Tab Bar) */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'canciones', label: 'Gestión de Canciones' },
          { id: 'figuras', label: 'Diccionario de Figuras' },
          { id: 'ajustes', label: 'Ajustes' }
        ].map(tab => {
          const isActive = pestanaActiva === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setPestanaActiva(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: isActive 
                  ? 'rgba(245, 158, 11, 0.18)' 
                  : (hoveredTab === tab.id ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)'),
                color: isActive ? '#fbbf24' : '#cbd5e1',
                border: '1.5px solid',
                borderColor: isActive ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.08)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isActive ? '0 0 12px rgba(245, 158, 11, 0.2)' : 'none',
                transform: hoveredTab === tab.id && !isActive ? 'translateY(-1px)' : 'none'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Renderizado Condicional por Pestaña */}
      {pestanaActiva === 'canciones' && (
        <SongManager
          canciones={canciones}
          audioStatus={audioStatus}
          onGuardarCanciones={onGuardarCanciones}
          onRestaurarDefault={onRestaurarCanciones}
        />
      )}

      {pestanaActiva === 'figuras' && (
        <FigureCatalog figuras={figuras} onGuardarFiguras={onGuardarFiguras} />
      )}

      {pestanaActiva === 'ajustes' && (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Trophy size={18} /> Progreso de la Detective Guardado en Local
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Visualiza el avance del perfil de la niña o restablece sus estadísticas a cero en caso de ser necesario.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: 'rgba(15, 23, 42, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', gap: '20px', fontSize: '0.95rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                🏆 Puntos: {puntos}
              </span>
              <span style={{ color: '#8b5cf6', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚡ Nivel: {nivel}
              </span>
              <span style={{ color: '#ec4899', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✨ Estrellas: {estrellas}
              </span>
            </div>
            <div>
              <button
                onClick={() => setMostrarConfirmReset(true)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <RotateCcw size={14} /> Reiniciar Progreso
              </button>
              {mensajeProgreso && (
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginTop: '4px', textAlign: 'right' }}>{mensajeProgreso}</span>
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
