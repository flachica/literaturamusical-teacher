import React from 'react';
import { Shield, Star, Award, Bot, WifiOff, Sparkles, Music } from 'lucide-react';

export default function Navbar({ modoIA, setModoIA, puntos, nivel, estrellas }) {
  return (
    <header className="glass-panel" style={{ padding: '16px 28px', marginBottom: '24px', position: 'sticky', top: '12px', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
          }}>
            <Music size={28} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, background: 'linear-gradient(to right, #f8fafc, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                LitMusical
              </h1>
              <span className="badge badge-purple">v0.1.0</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#f59e0b" /> Escuela de Detectives Literarios
            </p>
          </div>
        </div>

        {/* User Stats Bar for Daughter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.7)', padding: '8px 16px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={18} color="#f59e0b" />
            <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.9rem' }}>Nivel {nivel}</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={18} color="#ec4899" fill="#ec4899" />
            <span style={{ fontWeight: 800, color: '#f472b6', fontSize: '0.9rem' }}>{estrellas} Estrellas</span>
          </div>
          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} color="#38bdf8" />
            <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>{puntos} PTS</span>
          </div>
        </div>

        {/* AI Toggle Indicator & Mode Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setModoIA(!modoIA)}
            className={`badge ${modoIA ? 'badge-purple' : 'badge-gold'}`}
            style={{
              padding: '10px 18px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: modoIA ? '0 0 15px rgba(139, 92, 246, 0.3)' : 'none'
            }}
          >
            {modoIA ? (
              <>
                <Bot size={16} color="#c084fc" />
                <span>Asistido por IA (Ollama)</span>
              </>
            ) : (
              <>
                <WifiOff size={16} color="#fbbf24" />
                <span>Modo Sin IA (Offline)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
