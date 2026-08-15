import React, { useState, useRef, useEffect } from 'react';
import { Shield, Star, Award, Bot, WifiOff, Sparkles, Music, BookOpen, Settings, Menu, X, RotateCcw, FileText, Code2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

export default function Navbar({
  modoIA,
  setModoIA,
  puntos,
  nivel,
  estrellas,
  modoPrincipal,
  setModoPrincipal,
  onResetProgreso,
  pestanaActiva,
  setPestanaActiva
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarConfirmReset, setMostrarConfirmReset] = useState(false);
  const menuRef = useRef(null);

  const esAdmin = modoPrincipal === 'admin';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass-panel" style={{ padding: '12px 24px', marginBottom: '20px', position: 'sticky', top: '10px', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Logo & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setModoPrincipal('detective')}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(139, 92, 246, 0.4)'
          }}>
            <Music size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.55rem', fontWeight: 900, background: 'linear-gradient(to right, #f8fafc, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, lineHeight: 1.1 }}>
                LitMusical
              </h1>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>v0.2.4</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={12} color="#f59e0b" /> Escuela de Detectives Literarios
            </p>
          </div>
        </div>

        {/* User Stats Bar for Daughter (Visible in Detective & Diccionario modes) */}
        {!esAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.7)', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="#f59e0b" />
              <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.85rem' }}>Nivel {nivel}</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} color="#ec4899" fill="#ec4899" />
              <span style={{ fontWeight: 800, color: '#f472b6', fontSize: '0.85rem' }}>{estrellas} Estrellas</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '0.85rem' }}>{puntos} PTS</span>
            </div>
          </div>
        )}

        {/* Action Buttons: Return to Game / Dictionary + Hamburger Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }} ref={menuRef}>
          
          {/* Direct Return Button to Detective Mode when in Admin Mode */}
          {esAdmin ? (
            <>
              {/* Pestañas de administración en la Navbar para reducir el ruido */}
              <button
                onClick={() => setPestanaActiva('canciones')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  background: pestanaActiva === 'canciones' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  color: pestanaActiva === 'canciones' ? '#fbbf24' : '#cbd5e1',
                  border: `1.5px solid ${pestanaActiva === 'canciones' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: pestanaActiva === 'canciones' ? '0 0 10px rgba(245, 158, 11, 0.15)' : 'none'
                }}
              >
                🎵 Canciones
              </button>

              <button
                onClick={() => setPestanaActiva('figuras')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  background: pestanaActiva === 'figuras' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  color: pestanaActiva === 'figuras' ? '#fbbf24' : '#cbd5e1',
                  border: `1.5px solid ${pestanaActiva === 'figuras' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: pestanaActiva === 'figuras' ? '0 0 10px rgba(245, 158, 11, 0.15)' : 'none'
                }}
              >
                📖 Diccionario
              </button>

              <button
                onClick={() => setPestanaActiva('ajustes')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  background: pestanaActiva === 'ajustes' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  color: pestanaActiva === 'ajustes' ? '#fbbf24' : '#cbd5e1',
                  border: `1.5px solid ${pestanaActiva === 'ajustes' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: pestanaActiva === 'ajustes' ? '0 0 10px rgba(245, 158, 11, 0.15)' : 'none'
                }}
              >
                ⚙️ Ajustes
              </button>

              <button
                onClick={() => setModoPrincipal('detective')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                Volver al Juego
              </button>
            </>
          ) : (
            <>
              {/* Direct 1-Click Dictionary Button for Daughter */}
              <button
                onClick={() => setModoPrincipal(modoPrincipal === 'diccionario' ? 'detective' : 'diccionario')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  background: modoPrincipal === 'diccionario' ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(6, 182, 212, 0.2)',
                  color: modoPrincipal === 'diccionario' ? '#ffffff' : '#38bdf8',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: modoPrincipal === 'diccionario' ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none'
                }}
              >
                <BookOpen size={16} /> {modoPrincipal === 'diccionario' ? 'Volver al Juego' : 'Diccionario'}
              </button>

              {/* Direct 1-Click Parent Mode Button */}
              <button
                onClick={() => setModoPrincipal('admin')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  cursor: 'pointer'
                }}
              >
                Modo Padres
              </button>
            </>
          )}

          {/* Hamburger / Parent Settings Button */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(30, 41, 59, 0.7)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
            title="Ajustes y Documentación"
          >
            {menuAbierto ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Floating Dropdown Menu for Parent Options & Project Docs */}
          {menuAbierto && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '270px',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '14px',
              padding: '10px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
              zIndex: 200
            }}>
              <div style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }}>
                ⚙️ Ajustes Técnicos
              </div>

              {/* Servidor de IA Local (Ollama) - Ocultado temporalmente por reducción de ruido visual en v0.2.14
              <div style={{ padding: '6px 10px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Servidor de IA Local (Ollama):</span>
                <button
                  onClick={() => setModoIA(!modoIA)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: modoIA ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: modoIA ? '#c084fc' : '#fbbf24',
                    border: `1px solid ${modoIA ? '#8b5cf6' : '#f59e0b'}`,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {modoIA ? <Bot size={14} /> : <WifiOff size={14} />}
                  {modoIA ? 'IA Activa (Ollama)' : 'Modo Sin IA (Offline)'}
                </button>
              </div>
              */}

              {/* Proyecto y Documentación */}
              <div style={{ padding: '6px 10px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '8px', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Documentación del Proyecto:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <a
                    href="https://github.com/flachica/literaturamusical-teacher/blob/main/BACKLOG.md"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(192, 132, 252, 0.15)',
                      color: '#c084fc',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={14} /> Hoja de Ruta (BACKLOG.md)
                  </a>
                  <a
                    href="https://github.com/flachica/literaturamusical-teacher/blob/main/.agents/skills/litmusical-guide/SKILL.md"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Code2 size={14} /> Skill: litmusical-guide
                  </a>
                </div>
              </div>

              {onResetProgreso && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '8px', paddingTop: '8px' }}>
                  <button
                    onClick={() => {
                      setMostrarConfirmReset(true);
                      setMenuAbierto(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '6px 10px',
                      background: 'transparent',
                      color: '#f87171',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCcw size={12} /> Reiniciar Puntos
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Modal de confirmación integrado para reiniciar puntos */}
      <ConfirmModal
        isOpen={mostrarConfirmReset}
        titulo="¿Reiniciar puntos de la detective?"
        mensaje="Esta acción restablecerá las estrellas, el nivel y las puntuaciones acumuladas."
        textoConfirmar="Sí, reiniciar"
        textoCancelar="Cancelar"
        variante="peligro"
        onConfirm={() => {
          onResetProgreso();
          setMostrarConfirmReset(false);
        }}
        onCancel={() => setMostrarConfirmReset(false)}
      />

    </header>
  );
}
