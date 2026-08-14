import React, { useState } from 'react';
import FamilySuggestions from './FamilySuggestions';
import SongManager from './SongManager';
import ConfirmModal from './ConfirmModal';
import { Settings, Database, Bot, Check, RotateCcw, Trophy, Star, Shield } from 'lucide-react';

export default function ModoAdmin({
  modoIA,
  setModoIA,
  canciones,
  onGuardarCanciones,
  onRestaurarCanciones,
  puntos,
  nivel,
  estrellas,
  onResetProgreso
}) {
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [guardado, setGuardado] = useState(false);
  const [mensajeProgreso, setMensajeProgreso] = useState('');
  const [mostrarConfirmReset, setMostrarConfirmReset] = useState(false);

  const handleGuardarConfig = (e) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

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
              Gestión del catálogo Local-First, IA local (Ollama) e importación/exportación de datos
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '9999px', fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            💾 Persistencia Activa (LocalStorage)
          </span>
        </div>
      </div>

      {/* Progress & Persistence Overview */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Trophy size={18} /> Progreso de la Detective Guardado en Local
          </h3>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', marginTop: '8px' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>🏆 Puntos: {puntos}</span>
            <span style={{ color: '#8b5cf6', fontWeight: 700 }}>⚡ Nivel: {nivel}</span>
            <span style={{ color: '#ec4899', fontWeight: 700 }}>✨ Estrellas: {estrellas}</span>
          </div>
        </div>

        <div>
          <button
            onClick={() => setMostrarConfirmReset(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} /> Reiniciar Progreso
          </button>
          {mensajeProgreso && (
            <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginTop: '4px' }}>{mensajeProgreso}</span>
          )}
        </div>
      </div>

      {/* Songs Catalog Manager */}
      <SongManager
        canciones={canciones}
        onGuardarCanciones={onGuardarCanciones}
        onRestaurarDefault={onRestaurarCanciones}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* IA Configuration Card */}
        <form onSubmit={handleGuardarConfig} className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={18} /> Configuración de IA Local (Ollama / LangChain)
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Endpoint HTTP Ollama:
            </label>
            <input
              type="text"
              value={ollamaEndpoint}
              onChange={(e) => setOllamaEndpoint(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Modelo de LLM Local:
            </label>
            <select
              value={ollamaModel}
              onChange={(e) => setOllamaModel(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '0.85rem'
              }}
            >
              <option value="llama3">Llama 3 (Recomendado)</option>
              <option value="mistral">Mistral 7B</option>
              <option value="gemma">Gemma 7B</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: '#ffffff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            {guardado ? <Check size={16} /> : <Settings size={16} />}
            {guardado ? '¡Configuración Guardada!' : 'Guardar Parámetros de IA'}
          </button>
        </form>

        {/* Database & Files Info Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} /> Arquitectura Local-First & JSON
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Todo se sincroniza en el navegador de forma privada sin requerir servidores externos. Puedes exportar e importar archivos <code>.json</code> en cualquier momento.
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#f59e0b" /> Catálogo actual: <strong>{canciones.length} canciones</strong>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <Shield size={14} color="#10b981" /> Llaves LocalStorage: <code>litmusical_user_progress_v1</code> y <code>litmusical_songs_catalog_v1</code>
            </p>
          </div>
        </div>

      </div>

      {/* Family Suggestions Section */}
      <FamilySuggestions />

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
