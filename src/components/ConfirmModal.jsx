import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  titulo = '¿Estás seguro?',
  mensaje = 'Esta acción no se puede deshacer.',
  textoConfirmar = 'Sí, continuar',
  textoCancelar = 'Cancelar',
  variante = 'peligro', // 'peligro' | 'advertencia'
  requiereCheck = false,
  onConfirm,
  onCancel
}) {
  const [confirmadoCheck, setConfirmadoCheck] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setConfirmadoCheck(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const colorBorder = variante === 'peligro' ? '#ef4444' : '#f59e0b';
  const colorGlow = variante === 'peligro' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.35)';
  const colorBoton = variante === 'peligro' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #f59e0b, #d97706)';

  return (
    <div
      className="modal-overlay-animate"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="modal-content-animate"
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: `2px solid ${colorBorder}`,
          borderRadius: '20px',
          padding: '24px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: `0 0 30px ${colorGlow}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: `${colorBorder}20`,
            border: `1px solid ${colorBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colorBorder,
            flexShrink: 0
          }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
              {titulo}
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '20px' }}>
          {mensaje}
        </p>

        {requiereCheck && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            background: 'rgba(239, 68, 68, 0.05)',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.15)'
          }}>
            <input
              type="checkbox"
              id="confirm-modal-checkbox"
              checked={confirmadoCheck}
              onChange={e => setConfirmadoCheck(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: colorBorder }}
            />
            <label htmlFor="confirm-modal-checkbox" style={{ fontSize: '0.82rem', color: '#fca5a5', fontWeight: 700, cursor: 'pointer', userSelect: 'none' }}>
              Entiendo que esta acción es permanente
            </label>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <X size={16} /> {textoCancelar}
          </button>

          <button
            onClick={onConfirm}
            disabled={requiereCheck && !confirmadoCheck}
            style={{
              padding: '9px 20px',
              borderRadius: '10px',
              background: colorBoton,
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: (requiereCheck && !confirmadoCheck) ? 'not-allowed' : 'pointer',
              opacity: (requiereCheck && !confirmadoCheck) ? 0.45 : 1,
              boxShadow: (requiereCheck && !confirmadoCheck) ? 'none' : `0 0 14px ${colorGlow}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Check size={16} /> {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
