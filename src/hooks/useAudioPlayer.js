import { useState, useEffect, useRef } from 'react';

/**
 * Hook personalizado para gestionar el estado del reproductor de audio,
 * control de tiempos, sincronización y volumen.
 */
export default function useAudioPlayer(cancionActual) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [posicion, setPosicion] = useState(0); // 0 to 100%
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [localAudioSrc, setLocalAudioSrc] = useState(null);
  const audioRef = useRef(null);

  // Reset playback position and state when the song changes
  useEffect(() => {
    setIsPlaying(false);
    setPosicion(0);
    setCurrentTime(0);
    setDuration(180);
    setLocalAudioSrc(null);
  }, [cancionActual?.id]);

  const handleSeekTime = (targetSeconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = targetSeconds;
    }
    setCurrentTime(targetSeconds);
  };

  return {
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
    handleSeekTime
  };
}
