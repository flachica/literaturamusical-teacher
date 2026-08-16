import React from 'react';
import { Plus, Download, Upload, RotateCcw } from 'lucide-react';

export default function SongManagerToolbar({
  mostrarForm,
  setMostrarForm,
  hayAudiosPerdidos,
  reparandoGlobal,
  onRepararTodos,
  onExportarJSON,
  onImportarJSON
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '20px',
      padding: '8px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      {/* Lado izquierdo: Añadir Nueva Canción (principal) */}
      <div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            background: mostrarForm ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.85rem',
            border: mostrarForm ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: mostrarForm ? 'none' : '0 0 14px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={16} /> {mostrarForm ? 'Cancelar' : 'Añadir Canción'}
        </button>
      </div>

      {/* Lado derecho: Acciones de catálogo e importación/exportación */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {hayAudiosPerdidos && (
          <button
            onClick={onRepararTodos}
            disabled={reparandoGlobal}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: reparandoGlobal
                ? 'rgba(71, 85, 105, 0.4)'
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: reparandoGlobal ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 12px rgba(245, 158, 11, 0.35)'
            }}
            title="Descarga los archivos de audio perdidos a partir de sus enlaces de YouTube"
          >
            <RotateCcw size={14} style={{ animation: reparandoGlobal ? 'spin 2s linear infinite' : 'none' }} />
            {reparandoGlobal ? '⏳ Reparando...' : '🔄 Reparar Audios'}
          </button>
        )}

        <button
          onClick={onExportarJSON}
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.03)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Download size={14} /> Exportar JSON
        </button>

        <label style={{
          padding: '8px 14px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          color: '#cbd5e1',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontWeight: 700,
          fontSize: '0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          <Upload size={14} /> Importar JSON
          <input type="file" accept=".json" onChange={onImportarJSON} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
}
