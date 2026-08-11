import React, { useEffect } from 'react';
import { Play, Pause, Sparkles, Music } from 'lucide-react';

export default function WaveformScrubber({
  cancion,
  isPlaying,
  setIsPlaying,
  posicion,
  setPosicion,
  onSeleccionarVersoPorTiempo
}) {
  // Generate 45 visual waveform bars
  const bars = Array.from({ length: 45 }, (_, i) => {
    const heightPercent = 20 + Math.abs(Math.sin(i * 0.45) * 75);
    const isFigureMarker = i === 12 || i === 28 || i === 38;
    return { id: i, heightPercent, isFigureMarker };
  });

  // Auto-advance timeline cursor smoothly when playing (WITHOUT any synth beeps!)
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setPosicion((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, setIsPlaying, setPosicion]);

  // Sync active verse based on scrubber position
  useEffect(() => {
    if (cancion.versos && cancion.versos.length > 0) {
      const idx = Math.min(
        Math.floor((posicion / 100) * cancion.versos.length),
        cancion.versos.length - 1
      );
      if (onSeleccionarVersoPorTiempo) {
        onSeleccionarVersoPorTiempo(cancion.versos[idx]);
      }
    }
  }, [posicion, cancion, onSeleccionarVersoPorTiempo]);

  const handleSliderChange = (e) => {
    setPosicion(Number(e.target.value));
  };

  const formatearTiempo = (porcentaje) => {
    const totalSegundos = 180; // 3 minutes total
    const actuales = Math.floor((porcentaje / 100) * totalSegundos);
    const mins = Math.floor(actuales / 60);
    const segs = actuales % 60;
    return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '16px', padding: '16px 20px', border: '1px solid rgba(139, 92, 246, 0.2)', marginBottom: '20px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isPlaying ? 'linear-gradient(135deg, #ec4899, #ef4444)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isPlaying ? '0 0 16px rgba(236, 72, 153, 0.6)' : '0 0 12px rgba(139, 92, 246, 0.4)',
              border: 'none',
              cursor: 'pointer'
            }}
            title={isPlaying ? 'Pausar avance de la canción' : 'Reproducir y sincronizar versos'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc' }}>
              Línea de Tiempo y Ondas «{cancion.titulo}»
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {isPlaying ? '▶️ Sincronizando avance con la lectura...' : 'Desplaza el marcador rosa para avanzar por la letra'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fbbf24', fontFamily: 'monospace' }}>
            {formatearTiempo(posicion)}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>/ 3:00 min</span>
        </div>
      </div>

      {/* Visualizer Bar Container */}
      <div style={{ position: 'relative', height: '70px', background: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '3px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
        
        {bars.map((bar, i) => {
          const barPos = (i / bars.length) * 100;
          const isPassed = barPos <= posicion;

          let barColor = 'rgba(255, 255, 255, 0.15)';
          if (isPassed) {
            barColor = bar.isFigureMarker ? '#f59e0b' : '#c084fc';
          }

          return (
            <div
              key={bar.id}
              style={{
                flex: 1,
                height: `${bar.heightPercent}%`,
                background: barColor,
                borderRadius: '3px',
                transition: 'background 0.15s ease',
                position: 'relative'
              }}
            >
              {bar.isFigureMarker && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem'
                  }}
                >
                  ✨
                </span>
              )}
            </div>
          );
        })}

        {/* Draggable Vertical Scrubber Cursor Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${posicion}%`,
            width: '3px',
            background: '#ec4899',
            boxShadow: '0 0 12px #ec4899',
            pointerEvents: 'none',
            zIndex: 10
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#ffffff',
              border: '3px solid #ec4899',
              boxShadow: '0 0 10px #ec4899'
            }}
          />
        </div>

        {/* Range slider over waveform */}
        <input
          type="range"
          min="0"
          max="100"
          value={posicion}
          onChange={handleSliderChange}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'ew-resize',
            zIndex: 20
          }}
        />
      </div>

      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={12} color="#f59e0b" /> Las estrellas ✨ indican dónde hay metáforas en la letra
        </span>
        <span>Arrastra para saltar a otra parte de la canción</span>
      </div>

    </div>
  );
}
