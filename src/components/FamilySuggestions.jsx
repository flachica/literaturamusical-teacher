import React, { useState } from 'react';
import { SUGERENCIAS_FAMILIARES_INICIALES } from '../data/initialData';
import { Heart, Plus, MessageSquare, User, Sparkles } from 'lucide-react';

export default function FamilySuggestions() {
  const [sugerencias, setSugerencias] = useState(SUGERENCIAS_FAMILIARES_INICIALES);
  const [nuevaCancion, setNuevaCancion] = useState('');
  const [nuevoArtista, setNuevoArtista] = useState('');
  const [motivo, setMotivo] = useState('');
  const [quien, setQuien] = useState('Tu Hija (9 años)');

  const handleAgregarSugerencia = (e) => {
    e.preventDefault();
    if (!nuevaCancion || !nuevoArtista) return;

    const nueva = {
      id: Date.now(),
      propuestoPor: quien,
      cancion: nuevaCancion,
      artista: nuevoArtista,
      motivo: motivo || '¡Nos encanta esta canción!',
      fecha: 'Justo ahora',
      meGusta: 1
    };

    setSugerencias([nueva, ...sugerencias]);
    setNuevaCancion('');
    setNuevoArtista('');
    setMotivo('');
  };

  const handleDarMeGusta = (id) => {
    setSugerencias(
      sugerencias.map((s) =>
        s.id === id ? { ...s, meGusta: s.meGusta + 1 } : s
      )
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '6px' }}>
            <MessageSquare size={14} /> Buzón Colaborativo
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Sugerencias de Hija y Mamá</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Proponed vuestros artistas y temas favoritos
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Form column */}
        <form
          onSubmit={handleAgregarSugerencia}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '14px', color: '#34d399' }}>
            ✨ Sugerir Nueva Canción o Artista
          </h4>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              ¿Quién hace la propuesta?
            </label>
            <select
              value={quien}
              onChange={(e) => setQuien(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '0.9rem'
              }}
            >
              <option value="Tu Hija (9 años)">👧 Tu Hija (9 años)</option>
              <option value="Mamá">👩 Mamá</option>
              <option value="Papá">👨 Papá</option>
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Nombre de la Canción:
            </label>
            <input
              type="text"
              placeholder="Ej. El Río del Tiempo"
              value={nuevaCancion}
              onChange={(e) => setNuevaCancion(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Artista o Grupo:
            </label>
            <input
              type="text"
              placeholder="Ej. Banda Educativa"
              value={nuevoArtista}
              onChange={(e) => setNuevoArtista(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              ¿Por qué te gusta o qué figura tiene? (Opcional):
            </label>
            <textarea
              placeholder="Ej. Tiene una metáfora genial en el estribillo..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                fontSize: '0.9rem',
                resize: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: '#ffffff',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Agregar al Buzón Familiar
          </button>
        </form>

        {/* List column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Propuestas recientes:
          </h4>

          {sugerencias.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '14px 18px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                    <User size={10} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.propuestoPor}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {item.fecha}</span>
                </div>

                <h5 style={{ fontSize: '1rem', fontWeight: 800 }}>
                  {item.cancion} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>de {item.artista}</span>
                </h5>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px', fontStyle: 'italic' }}>
                  «{item.motivo}»
                </p>
              </div>

              <button
                onClick={() => handleDarMeGusta(item.id)}
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  color: '#f472b6',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                <Heart size={14} fill="#f472b6" /> {item.meGusta}
              </button>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
