import React, { useState, useRef } from 'react';
import { Download, Upload, CheckCircle2, AlertCircle, HardDrive } from 'lucide-react';

export default function BackupManager({
  detectives = [],
  canciones = [],
  figuras = [],
  sugerencias = [],
  onRestaurarBackup
}) {
  const [mensaje, setMensaje] = useState(null);
  const fileInputRef = useRef(null);

  // Exportar backup completo a archivo .json
  const handleExportarBackup = () => {
    try {
      const backupData = {
        app: 'LitMusical',
        version: 'v1.0.0',
        exportDate: new Date().toISOString(),
        detectives,
        canciones,
        figuras,
        sugerencias
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const fechaStr = new Date().toISOString().slice(0, 10);
      const link = document.createElement('a');
      link.href = url;
      link.download = `litmusical_backup_${fechaStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMensaje({ tipo: 'exito', texto: '¡Copia de seguridad exportada con éxito!' });
      setTimeout(() => setMensaje(null), 4000);
    } catch (err) {
      setMensaje({ tipo: 'error', texto: `Error al exportar backup: ${err.message}` });
    }
  };

  // Importar backup desde archivo .json seleccionado
  const handleImportarBackup = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') return;
        const parsed = JSON.parse(content);

        if (!parsed || (typeof parsed !== 'object')) {
          throw new Error('El archivo no tiene un formato JSON válido.');
        }

        const restoreData = {
          detectives: Array.isArray(parsed.detectives) ? parsed.detectives : detectives,
          canciones: Array.isArray(parsed.canciones) ? parsed.canciones : canciones,
          figuras: Array.isArray(parsed.figuras) ? parsed.figuras : figuras,
          sugerencias: Array.isArray(parsed.sugerencias) ? parsed.sugerencias : sugerencias
        };

        if (onRestaurarBackup) {
          onRestaurarBackup(restoreData);
        }

        setMensaje({ tipo: 'exito', texto: '¡Copia de seguridad restaurada correctamente!' });
        setTimeout(() => setMensaje(null), 4000);
      } catch (err) {
        setMensaje({ tipo: 'error', texto: `Error al importar backup: ${err.message}` });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '24px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <HardDrive style={{ color: '#60a5fa', width: 24, height: 24 }} />
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Gestión de Copias de Seguridad (Backup JSON)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Exporta o restaura todo el estado de la app (detectives, canciones, figuras y buzón).
          </p>
        </div>
      </div>

      {mensaje && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 600,
          background: mensaje.tipo === 'exito' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${mensaje.tipo === 'exito' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: mensaje.tipo === 'exito' ? '#4ade80' : '#f87171'
        }}>
          {mensaje.tipo === 'exito' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{mensaje.texto}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={handleExportarBackup}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Download size={18} />
          Exportar Backup (.json)
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-main)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Upload size={18} />
          Importar Backup (.json)
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportarBackup}
          accept=".json,application/json"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
