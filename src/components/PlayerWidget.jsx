import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Disc, Tv, Radio, Sparkles, ExternalLink, Upload } from 'lucide-react';

export default function PlayerWidget({
  cancion,
  isPlaying,
  setIsPlaying,
  posicion,
  setPosicion,
  localAudioSrc,
  setLocalAudioSrc
}) {
  const [provider, setProvider] = useState('youtube'); // 'youtube' | 'spotify' | 'audio'
  const audioRef = useRef(null);

  // Sync HTML5 audio element play/pause
  useEffect(() => {
    if (audioRef.current && localAudioSrc) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, localAudioSrc]);

  const handleAudioTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const currentPct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setPosicion(currentPct);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalAudioSrc(url);
      setProvider('audio');
      setIsPlaying(true);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', position: 'relative' }}>
      
      {/* Player Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="badge badge-gold" style={{ marginBottom: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Disc size={14} /> Reproductor de Música Principal
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{cancion.titulo}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            por <strong style={{ color: '#f8fafc' }}>{cancion.artistaNombre}</strong> • Álbum: {cancion.album}
          </p>
        </div>

        {/* Provider Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px', borderRadius: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setProvider('youtube')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: provider === 'youtube' ? 'linear-gradient(135deg, #ff0000, #cc0000)' : 'transparent',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: provider === 'youtube' ? '0 0 12px rgba(255, 0, 0, 0.4)' : 'none'
            }}
          >
            <Tv size={16} /> YouTube Vídeo
          </button>

          <button
            onClick={() => setProvider('spotify')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: provider === 'spotify' ? '#1db954' : 'transparent',
              color: provider === 'spotify' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Radio size={16} /> Spotify
          </button>

          <button
            onClick={() => setProvider('audio')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: provider === 'audio' ? 'var(--primary)' : 'transparent',
              color: provider === 'audio' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Volume2 size={16} /> Archivo MP3 Local
          </button>
        </div>
      </div>

      {/* Main Controls Header */}
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '12px 18px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: isPlaying ? 'linear-gradient(135deg, #ec4899, #ef4444)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} style={{ marginLeft: '3px' }} />}
          </button>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
              {isPlaying ? '▶️ Canción activa - Avance de versos activado' : '⏸️ Pulsa Play para reproducir e iniciar la lectura'}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
              La letra avanza sincronizada para que tu hija pueda leerla cómodamente
            </span>
          </div>
        </div>

        {provider === 'youtube' && cancion.youtubeId && (
          <a
            href={`https://www.youtube.com/watch?v=${cancion.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 0, 0, 0.15)',
              color: '#ff6b6b',
              border: '1px solid rgba(255, 0, 0, 0.3)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} /> Abrir en YouTube si el iframe se bloquea
          </a>
        )}
      </div>

      {/* Embed Display Box */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000000', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        
        {/* YOUTUBE */}
        {provider === 'youtube' && cancion.youtubeId && (
          <div style={{ position: 'relative', width: '100%', paddingTop: '36%', minHeight: '230px' }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              src={`https://www.youtube.com/embed/${cancion.youtubeId}?rel=0`}
              title={`YouTube Player - ${cancion.titulo}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* SPOTIFY */}
        {provider === 'spotify' && (
          <div style={{ padding: '12px', background: '#121212' }}>
            <iframe
              src={`https://open.spotify.com/embed/track/${cancion.spotifyTrackId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Embed Official"
            />
          </div>
        )}

        {/* MP3 LOCAL */}
        {provider === 'audio' && (
          <div style={{ padding: '24px', width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
            {localAudioSrc ? (
              <div>
                <p style={{ fontSize: '0.95rem', color: '#34d399', fontWeight: 800, marginBottom: '12px' }}>
                  🎵 Pista de audio MP3 cargada correctamente
                </p>
                <audio
                  ref={audioRef}
                  src={localAudioSrc}
                  onTimeUpdate={handleAudioTimeUpdate}
                  controls
                  style={{ width: '100%', maxWidth: '550px' }}
                />
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '1rem', color: '#f8fafc', fontWeight: 800, marginBottom: '6px' }}>
                  📂 Cargar audio en MP3 de «{cancion.titulo}»
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Sube el archivo MP3 original que tengas en tu ordenador para escuchar a {cancion.artistaNombre} mientras tu hija lee la letra.
                </p>
                <label style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <Upload size={18} /> Cargar MP3 desde mi PC
                  <input type="file" accept="audio/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
