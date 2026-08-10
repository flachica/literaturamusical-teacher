import React, { useState } from 'react';
import { Play, Pause, Volume2, Disc, Tv, Radio, Sparkles } from 'lucide-react';

export default function PlayerWidget({ cancion }) {
  const [provider, setProvider] = useState('spotify'); // 'spotify' | 'youtube' | 'audio'
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Player Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span className="badge badge-gold" style={{ marginBottom: '8px' }}>
            <Disc size={14} /> Reproductor Agnóstico
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{cancion.titulo}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            por <strong style={{ color: '#f8fafc' }}>{cancion.artistaNombre}</strong> • Album: {cancion.album}
          </p>
        </div>

        {/* Provider Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px', borderRadius: '12px' }}>
          <button
            onClick={() => setProvider('spotify')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: provider === 'spotify' ? '#1db954' : 'transparent',
              color: provider === 'spotify' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Radio size={14} /> Spotify
          </button>

          <button
            onClick={() => setProvider('youtube')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: provider === 'youtube' ? '#ff0000' : 'transparent',
              color: provider === 'youtube' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Tv size={14} /> YouTube
          </button>

          <button
            onClick={() => setProvider('audio')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              background: provider === 'audio' ? 'var(--primary)' : 'transparent',
              color: provider === 'audio' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Volume2 size={14} /> Audio Directo
          </button>
        </div>
      </div>

      {/* Embed Container based on provider */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#000000', minHeight: '152px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {provider === 'spotify' && (
          <iframe
            src={`https://open.spotify.com/embed/track/${cancion.spotifyTrackId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Embed"
          />
        )}

        {provider === 'youtube' && (
          <iframe
            width="100%"
            height="220"
            src={`https://www.youtube.com/embed/${cancion.youtubeId}`}
            title="YouTube Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {provider === 'audio' && (
          <div style={{ padding: '24px', width: '100%', textAlign: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              🎵 Muestra de Audio Simulada HTML5
            </p>
            <audio controls style={{ width: '100%', maxWidth: '500px' }}>
              <source src={cancion.audioPreviewUrl} type="audio/mpeg" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )}
      </div>

      <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Sparkles size={14} color="#f59e0b" />
        <span>Tip Didáctico: Escucha la música mientras lees los versos abajo para sentir el ritmo y las figuras retóricas.</span>
      </div>

    </div>
  );
}
