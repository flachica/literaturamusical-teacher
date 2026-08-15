import React, { useState } from 'react';
import SongManager from './SongManager';
import FigureCatalog from './FigureCatalog';
import ConfirmModal from './ConfirmModal';
import { Settings, Database, RotateCcw, Trophy, Star, Shield, Plus, Edit3, Trash2, Check, UserPlus } from 'lucide-react';

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

  // Estados locales para la gestión multidetective
  const [nuevoNombreDet, setNuevoNombreDet] = useState('');
  const [nuevoAvatarDet, setNuevoAvatarDet] = useState('🕵️‍♀️');
  const [detectiveEditandoId, setDetectiveEditandoId] = useState(null);
  const [nombreEditando, setNombreEditando] = useState('');
  const [detectiveAReiniciar, setDetectiveAReiniciar] = useState(null);

  const avataresDisponibles = ['🕵️‍♀️', '🦊', '🦁', '🐼', '🦄', '🐨', '🦖', '🐯', '🐸', '🦉', '🐙', '🐵'];

  const ejecutarResetProgreso = () => {
    if (!detectiveAReiniciar) return;
    onResetProgreso(detectiveAReiniciar.id);
    setMostrarConfirmReset(false);
    setDetectiveAReiniciar(null);
  };

  const handleCrearNuevoDetective = (e) => {
    e.preventDefault();
    if (!nuevoNombreDet.trim()) return;
    onCrearDetective(nuevoNombreDet, nuevoAvatarDet);
    setNuevoNombreDet('');
  };

  const handleIniciarRenombrar = (det) => {
    setDetectiveEditandoId(det.id);
    setNombreEditando(det.nombre);
  };

  const handleGuardarNombre = (id) => {
    if (!nombreEditando.trim()) return;
    onRenombrarDetective(id, nombreEditando);
    setDetectiveEditandoId(null);
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start', flexWrap: 'wrap' }}>
            
            {/* Listado de Detectives */}
            <div className="glass-panel" style={{ padding: '20px', minHeight: '300px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👥 Catálogo de Detectives Registrados
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {detectives.map((det) => {
                  const esActivo = det.activo;
                  const estaEditando = detectiveEditandoId === det.id;

                  return (
                    <div
                      key={det.id}
                      style={{
                        background: esActivo ? 'rgba(139, 92, 246, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                        border: `1.5px solid ${esActivo ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                        borderRadius: '14px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'all 0.25s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span style={{ fontSize: '2rem' }}>{det.avatar}</span>
                        <div style={{ flex: 1 }}>
                          {estaEditando ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <input
                                type="text"
                                value={nombreEditando}
                                onChange={e => setNombreEditando(e.target.value)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.9rem',
                                  borderRadius: '6px',
                                  background: '#0f172a',
                                  color: '#fff',
                                  border: '1px solid #8b5cf6',
                                  width: '100%',
                                  maxWidth: '150px'
                                }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleGuardarNombre(det.id)}
                                style={{
                                  background: '#10b981',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: esActivo ? '#c084fc' : '#ffffff' }}>
                                {det.nombre}
                              </span>
                              {esActivo && (
                                <span style={{ fontSize: '0.65rem', background: '#10b98122', color: '#10b981', border: '1px solid #10b98144', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                                  ACTIVO
                                </span>
                              )}
                            </div>
                          )}
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Nivel {det.nivel} • {det.puntos} PTS • {det.estrellas} ★
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                        {!estaEditando && (
                          <button
                            onClick={() => handleIniciarRenombrar(det)}
                            style={{
                              padding: '6px',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,0.02)',
                              color: '#94a3b8',
                              border: '1px solid rgba(255,255,255,0.05)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Renombrar detective"
                          >
                            <Edit3 size={12} />
                          </button>
                        )}

                        {!estaEditando && (
                          <button
                            onClick={() => {
                              setDetectiveAReiniciar(det);
                              setMostrarConfirmReset(true);
                            }}
                            style={{
                              padding: '6px',
                              borderRadius: '8px',
                              background: 'rgba(245, 158, 11, 0.1)',
                              color: '#fbbf24',
                              border: '1px solid rgba(245, 158, 11, 0.25)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Reiniciar progreso de este detective"
                          >
                            <RotateCcw size={12} />
                          </button>
                        )}

                        {detectives.length > 1 && (
                          <button
                            onClick={() => onEliminarDetective(det.id)}
                            style={{
                              padding: '6px',
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: '#fca5a5',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Eliminar detective"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Crear Detective */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} color="#10b981" /> Añadir Detective
              </h4>

              <form onSubmit={handleCrearNuevoDetective} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Nombre del Jugador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Valeria, Bruno..."
                    value={nuevoNombreDet}
                    onChange={e => setNuevoNombreDet(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Selecciona tu Avatar Emoji</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                    {avataresDisponibles.map((av) => {
                      const esSeleccionado = nuevoAvatarDet === av;
                      return (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setNuevoAvatarDet(av)}
                          style={{
                            fontSize: '1.6rem',
                            padding: '6px',
                            background: esSeleccionado ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                            border: `2px solid ${esSeleccionado ? '#10b981' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: esSeleccionado ? '0 0 10px rgba(16, 185, 129, 0.3)' : 'none'
                          }}
                        >
                          {av}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!nuevoNombreDet.trim()}
                  style={{
                    marginTop: '6px',
                    padding: '11px',
                    borderRadius: '10px',
                    background: nuevoNombreDet.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(71, 85, 105, 0.3)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: nuevoNombreDet.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: nuevoNombreDet.trim() ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={16} /> Registrar Detective
                </button>
              </form>
            </div>

          </div>

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

    </div>
  );
}
