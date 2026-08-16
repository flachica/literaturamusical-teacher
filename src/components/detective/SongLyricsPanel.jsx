import React from 'react';

export default function SongLyricsPanel({
  cancion,
  versoActual,
  totalEstrofas,
  estrofasAgrupadas,
  estrofasDomRefs,
  lyricsContainerRef,
  onSeekTime
}) {
  return (
    <div ref={lyricsContainerRef} className="glass-panel" style={{
      padding: '18px 20px',
      height: 'fit-content',
      maxHeight: '560px',
      overflowY: 'auto',
      background: 'rgba(15, 23, 42, 0.85)',
      border: '1px solid rgba(56, 189, 248, 0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#38bdf8', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          📜 Lectura Completa — «{cancion.titulo}»
        </h4>
        <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>
          Estrofa {versoActual.estrofaNum || 1} de {totalEstrofas}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {estrofasAgrupadas.map(({ estrofaNum, versos }) => {
          const isEstrofaActiva = estrofaNum === (versoActual?.estrofaNum || 1);
          const primerTiempo = versos[0]?.tiempoInicio;

          return (
            <div
              key={estrofaNum}
              ref={(el) => (estrofasDomRefs.current[estrofaNum] = el)}
              onClick={() => {
                if (typeof primerTiempo === 'number' && onSeekTime) {
                  onSeekTime(primerTiempo);
                }
              }}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: isEstrofaActiva
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))'
                  : 'rgba(30, 41, 59, 0.4)',
                border: `1.5px solid ${isEstrofaActiva ? '#ec4899' : 'rgba(255, 255, 255, 0.07)'}`,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isEstrofaActiva ? '0 0 16px rgba(236, 72, 153, 0.3)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.75rem', color: isEstrofaActiva ? '#ec4899' : '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estrofa #{estrofaNum}
                </span>
                {isEstrofaActiva && (
                  <span style={{ fontSize: '0.68rem', background: '#ec4899', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                    Karaoke Activo 🎵
                  </span>
                )}
              </div>

              {versos.map((v) => {
                const isCurrentLine = v.linea === versoActual?.linea;
                return (
                  <div
                    key={v.linea}
                    style={{
                      fontSize: isCurrentLine ? '1.25rem' : '1.05rem',
                      fontWeight: isCurrentLine ? 800 : 500,
                      color: isCurrentLine ? '#ffffff' : isEstrofaActiva ? '#f8fafc' : '#cbd5e1',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: isCurrentLine ? 'rgba(236, 72, 153, 0.25)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <span>«{v.texto}»</span>
                    {isCurrentLine && <span style={{ fontSize: '0.85rem', color: '#ec4899', flexShrink: 0 }}>▶</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
