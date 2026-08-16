import React, { useEffect } from 'react';
import { AlertCircle, Edit3, Music } from 'lucide-react';

export default function MissingLyricsModal({
  isOpen,
  nuevoTitulo,
  onCompletarManualmente,
  onGuardarModoBorrador,
  onCancelar
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        onCancelar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancelar]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        border: '2px solid #f59e0b',
        borderRadius: '20px',
        padding: '24px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={22} /> No se ha introducido la letra para «{nuevoTitulo}»
        </h3>
        
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '20px' }}>
          Para que tu hija pueda cantar y resolver el reto de figuras literarias, la canción necesita la letra en texto. ¿Cómo prefieres proceder?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={onCompletarManualmente}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={20} />
            <div>
              <div>✍️ Completar la letra manualmente ahora</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>Volver al formulario y escribir el verso principal</div>
            </div>
          </button>

          <button
            onClick={onGuardarModoBorrador}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left',
              cursor: 'pointer'
            }}
          >
            <Music size={20} color="#94a3b8" />
            <div>
              <div>💾 Guardar sin letra (modo borrador)</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>La canción se guardará y podrás editar su letra más tarde.</div>
            </div>
          </button>
        </div>

        <button
          onClick={onCancelar}
          style={{ width: '100%', padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
