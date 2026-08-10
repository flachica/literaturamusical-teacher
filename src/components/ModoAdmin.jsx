import React, { useState } from 'react';
import FamilySuggestions from './FamilySuggestions';
import { Settings, Database, Bot, Download, Upload, Plus, FileText, Check } from 'lucide-react';

export default function ModoAdmin({ modoIA, setModoIA }) {
  const [ollamaEndpoint, setOllamaEndpoint] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('llama3');
  const [guardado, setGuardado] = useState(false);

  const handleGuardarConfig = (e) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const handleExportarJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ export: "litmusical_data" }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "litmusical_catalog.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Admin Header Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '10px', borderRadius: '12px', color: '#fbbf24' }}>
            <Settings size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Panel de Control de Padres y Administración</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Gestión del catálogo, IA local (Ollama) e importación/exportación de datos
            </p>
          </div>
        </div>

        <button
          onClick={handleExportarJSON}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.2)',
            color: '#38bdf8',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Download size={14} /> Exportar JSON
        </button>
      </div>

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
            <Database size={18} /> Persistencia y Datos Locales
          </h3>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Todos los datos del catálogo se estructuran en archivos JSON legibles para que cualquier IA o script local los explote fácilmente.
          </p>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} color="#f59e0b" /> <code>src/data/mockData.js</code> (3 canciones curadas)
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <FileText size={14} color="#10b981" /> <code>DICCIONARIO_RAE</code> (5 palabras clave)
            </p>
          </div>
        </div>

      </div>

      {/* Family Suggestions Section */}
      <FamilySuggestions />

    </div>
  );
}
