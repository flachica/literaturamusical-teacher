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
  const [mostrarModalInfo, setMostrarModalInfo] = useState(false);
  const [hoverPersistencia, setHoverPersistencia] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  const ejecutarResetProgreso = () => {
    onResetProgreso();
    setMostrarConfirmReset(false);
    setMensajeProgreso('¡Progreso reiniciado correctamente!');
    setTimeout(() => setMensajeProgreso(''), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Admin Header Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '12px', color: '#fbbf24' }}>
            <Settings size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Panel de Control de Padres y Administración</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Gestión del catálogo Local-First y configuración de la experiencia didáctica
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setMostrarModalInfo(true)}
            onMouseEnter={() => setHoverPersistencia(true)}
            onMouseLeave={() => setHoverPersistencia(false)}
            style={{
              fontSize: '0.8rem',
              background: hoverPersistencia ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontWeight: 700,
              border: `1px solid ${hoverPersistencia ? '#34d399' : 'rgba(16, 185, 129, 0.3)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: hoverPersistencia ? '0 0 12px rgba(52, 211, 153, 0.25)' : 'none'
            }}
          >
            💾 Persistencia Activa (LocalStorage)
          </button>
        </div>
      </div>

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

      {/* Modal Técnico de Detalles de Persistencia (v0.2.14) */}
      {mostrarModalInfo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.25)',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Database size={22} /> Detalles de Persistencia Local-First
            </h3>
            
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
              Esta aplicación está diseñada con una arquitectura de almacenamiento local e independiente. Todo tu progreso y catálogo se guarda de forma segura y privada en tu propio navegador.
            </p>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Shield size={16} color="#f59e0b" /> Catálogo actual: <strong>{canciones.length} canciones</strong>
              </p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Shield size={16} color="#10b981" /> Llaves de LocalStorage:
              </p>
              <ul style={{ paddingLeft: '24px', color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.4, margin: '4px 0 8px 0' }}>
                <li><code>litmusical_user_progress_v1</code></li>
                <li><code>litmusical_songs_catalog_v1</code></li>
              </ul>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="#3b82f6" /> Modo de funcionamiento: <strong>Local y portable</strong>
              </p>
            </div>

            <button
              onClick={() => setMostrarModalInfo(false)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cerrar Detalles
            </button>
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
