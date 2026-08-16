import React, { useEffect, useState } from 'react';
import { Play, Pause, Disc, Upload, ListMusic, ChevronDown } from 'lucide-react';
import SongSelectorModal from './detective/SongSelectorModal';

export default function PlayerWidget({
  cancion,
  canciones = [],
  onSeleccionarCancion,
  isPlaying,
  setIsPlaying,
  posicion,
  setPosicion,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  localAudioSrc,
  setLocalAudioSrc,
  audioRef,
  onSeekTime,
  onSeleccionarVersoPorTiempo,
  paso,
  mostrarLetraCompleta,
  setMostrarLetraCompleta,
  audioStatus
}) {
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  // Determine if physical audio file is available and not a mockup fallback
  const estadoAudio = audioStatus?.[cancion?.id] || 'vacio';
  const tieneAudio = cancion?.audioPreviewUrl && estadoAudio !== 'perdido' && estadoAudio !== 'vacio';
  const audioSrc = tieneAudio ? (localAudioSrc || cancion.audioPreviewUrl) : '';

  // Generate 42 visual waveform bars
  const bars = Array.from({ length: 42 }, (_, i) => {
    const heightPercent = 25 + Math.abs(Math.sin(i * 0.45) * 70);
    const isFigureMarker = i === 10 || i === 25 || i === 36;
    return { id: i, heightPercent, isFigureMarker };
  });

  const isDraggingRef = React.useRef(false);

  // Sync HTML5 audio playback state
  useEffect(() => {
    if (audioRef?.current && audioSrc) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.warn('Playback error / Autoplay blocked:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSrc, audioRef, setIsPlaying]);

  // Handle native audio time updates (only update slider when not dragging)
  const handleTimeUpdate = () => {
    if (audioRef?.current) {
      const cur = audioRef.current.currentTime || 0;
      const dur = audioRef.current.duration || 180;
      setCurrentTime(cur);
      if (dur > 0 && !isDraggingRef.current) {
        setDuration(dur);
        const pct = (cur / dur) * 100;
        setPosicion(pct);
      }
    }
  };

  // Perform smooth seek on HTML5 audio DOM element
  const executeSeek = (targetPos) => {
    const targetDuration = duration || 180;
    const targetSeconds = (targetPos / 100) * targetDuration;
    if (audioRef?.current) {
      audioRef.current.currentTime = targetSeconds;
    }
    setCurrentTime(targetSeconds);
    if (onSeekTime) {
      onSeekTime(targetSeconds);
    }
  };

  // Handle seeking via range slider or clicking waveform
  const handleSliderChange = (e) => {
    const newPos = Number(e.target.value);
    setPosicion(newPos);
    
    const targetDuration = duration || 180;
    const targetSeconds = (newPos / 100) * targetDuration;
    setCurrentTime(targetSeconds);

    if (!isDraggingRef.current) {
      executeSeek(newPos);
    }
  };

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      executeSeek(posicion);
    }
  };

  const formatearTiempo = (segundos) => {
    if (!segundos || isNaN(segundos)) return '0:00';
    const mins = Math.floor(segundos / 60);
    const segs = Math.floor(segundos % 60);
    return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '20px', position: 'relative' }}>
      
      {/* Hidden HTML5 Audio element */}
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (audioRef?.current?.duration) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Row 1: Unified Header (Song Title + Button to open Song Box Modal + Timer + Steps + Lyrics Toggle) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Disc size={22} color="#ec4899" className={isPlaying ? 'spin-animation' : ''} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc', margin: 0, lineHeight: 1.2 }}>
              {cancion.titulo} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem' }}>— {cancion.artistaNombre}</span>
            </h3>

            {canciones.length > 1 && (
              <button
                onClick={() => setSelectorAbierto(true)}
                style={{
                  background: 'rgba(139, 92, 246, 0.18)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s'
                }}
                title="Abrir Caja de Discos Poéticos"
              >
                <span>Cambiar Canción</span> <ChevronDown size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Top Center Prominent Timer Counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '6px 16px',
          borderRadius: '9999px',
          border: tieneAudio ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1.5px solid rgba(148, 163, 184, 0.3)',
          boxShadow: tieneAudio ? '0 0 14px rgba(251, 191, 36, 0.25)' : 'none'
        }}>
          <span style={{ fontSize: '0.85rem' }}>{tieneAudio ? '⏱️' : '📖'}</span>
          <span style={{ fontWeight: 900, fontSize: '1.05rem', color: tieneAudio ? '#fbbf24' : '#cbd5e1' }}>
            {tieneAudio ? formatearTiempo(currentTime) : 'Modo Lectura'}
          </span>
          {tieneAudio && (
            <span style={{ fontSize: '0.88rem', color: '#94a3b8', fontWeight: 700 }}>
              / {formatearTiempo(duration || 180)}
            </span>
          )}
        </div>

        {/* Unified Step Indicator Dots (1 2 3 4) + Lyrics Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {paso && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.7)', padding: '4px 8px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {[1, 2, 3, 4].map((stepNum) => {
                const isCompleted = paso > stepNum;
                const isCurrent = paso === stepNum;
                return (
                  <div
                    key={stepNum}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      background: isCompleted ? '#10b981' : isCurrent ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                      color: '#ffffff'
                    }}
                    title={`Paso ${stepNum}`}
                  >
                    {isCompleted ? '✓' : stepNum}
                  </div>
                );
              })}
            </div>
          )}

          {setMostrarLetraCompleta && (
            <button
              onClick={() => setMostrarLetraCompleta(!mostrarLetraCompleta)}
              style={{
                padding: '5px 10px',
                borderRadius: '8px',
                background: mostrarLetraCompleta ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                color: mostrarLetraCompleta ? '#c084fc' : 'var(--text-muted)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <ListMusic size={14} /> {mostrarLetraCompleta ? 'Ocultar Letra' : 'Ver Letra'}
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Unified Controls + Integrated Waveform Scrubber */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15, 23, 42, 0.95)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        
        {/* Single Play / Pause Button */}
        <button
          onClick={() => {
            if (tieneAudio) {
              setIsPlaying(!isPlaying);
            }
          }}
          disabled={!tieneAudio}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: !tieneAudio 
              ? 'rgba(71, 85, 105, 0.3)' 
              : isPlaying ? 'linear-gradient(135deg, #ec4899, #ef4444)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            color: !tieneAudio ? '#64748b' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: !tieneAudio ? 'none' : isPlaying ? '0 0 16px rgba(236, 72, 153, 0.7)' : '0 0 12px rgba(139, 92, 246, 0.5)',
            border: 'none',
            cursor: tieneAudio ? 'pointer' : 'not-allowed',
            flexShrink: 0
          }}
          title={tieneAudio ? (isPlaying ? 'Pausar karaoke' : 'Reproducir y sincronizar versos') : 'Audio no configurado en esta canción'}
        >
          {isPlaying && tieneAudio ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '3px' }} />}
        </button>

        {/* Integrated Waveform Visualizer & Interactive Slider */}
        <div style={{ flex: 1, position: 'relative', height: '44px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '10px', padding: '6px 10px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {bars.map((bar, i) => {
            const barPos = (i / bars.length) * 100;
            const isPassed = tieneAudio && (barPos <= posicion);

            let barColor = 'rgba(255, 255, 255, 0.12)';
            if (tieneAudio && isPassed) {
              barColor = bar.isFigureMarker ? '#f59e0b' : '#c084fc';
            }

            return (
              <div
                key={bar.id}
                style={{
                  flex: 1,
                  height: `${bar.heightPercent}%`,
                  background: barColor,
                  borderRadius: '2px',
                  position: 'relative'
                }}
              >
                {tieneAudio && bar.isFigureMarker && (
                  <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem' }}>
                    ✨
                  </span>
                )}
              </div>
            );
          })}

          {!tieneAudio && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontStyle: 'italic',
              pointerEvents: 'none'
            }}>
              Modo lectura interactiva: lee a tu propio ritmo
            </div>
          )}

          {/* Draggable Vertical Cursor Line */}
          {tieneAudio && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${posicion}%`,
                width: '3px',
                background: '#ec4899',
                boxShadow: '0 0 10px #ec4899',
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
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  border: '2px solid #ec4899'
                }}
              />
            </div>
          )}

          {/* Transparent Range Input Overlay */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={tieneAudio ? posicion : 0}
            onChange={tieneAudio ? handleSliderChange : undefined}
            onPointerDown={tieneAudio ? handlePointerDown : undefined}
            onPointerUp={tieneAudio ? handlePointerUp : undefined}
            onTouchEnd={tieneAudio ? handlePointerUp : undefined}
            disabled={!tieneAudio}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: tieneAudio ? 'ew-resize' : 'not-allowed',
              zIndex: 20
            }}
          />
        </div>

      </div>

      {/* Modal Caja de Discos Poéticos */}
      <SongSelectorModal
        isOpen={selectorAbierto}
        onClose={() => setSelectorAbierto(false)}
        canciones={canciones}
        cancionActual={cancion}
        onSeleccionarCancion={onSeleccionarCancion}
        audioStatus={audioStatus}
      />

    </div>
  );
}
