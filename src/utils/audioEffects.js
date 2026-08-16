// Efectos de sonido dinámicos generados en tiempo real con Web Audio API.
// No requiere descargas de ficheros ni dependencias pesadas, idóneo para local-first.

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Toca un tono simple con una frecuencia, duración, tipo de onda y volumen dados.
 */
function playTone(freq, type, duration, delay = 0, volume = 0.1) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    // Envolvente de volumen para evitar chasquidos (clicks)
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (err) {
    console.warn('Web Audio no se pudo reproducir:', err);
  }
}

/**
 * Sonido de acierto/puntos: Arpegio ascendente alegre.
 */
export function playSuccessSound() {
  const vol = 0.08;
  // Arpegio de C mayor brillante (Do, Mi, Sol, Do)
  playTone(523.25, 'triangle', 0.15, 0, vol);      // C5
  playTone(659.25, 'triangle', 0.15, 0.07, vol);   // E5
  playTone(783.99, 'triangle', 0.15, 0.14, vol);   // G5
  playTone(1046.50, 'triangle', 0.4, 0.21, vol);   // C6
}

/**
 * Sonido de fallo/pista: Tono suave descendente y atenuado.
 */
export function playFailureSound() {
  const vol = 0.08;
  // Tono descendente melancólico pero no asustadizo
  playTone(329.63, 'sine', 0.15, 0, vol);     // E4
  playTone(261.63, 'sine', 0.4, 0.08, vol);    // C4
}

/**
 * Sonido de desbloqueo de placa/logro: Fanfarria triunfal brillante.
 */
export function playAchievementSound() {
  const vol = 0.07;
  // Pequeña fanfarria dorada (C5 - G5 - E5 - G5 - C6)
  playTone(523.25, 'triangle', 0.12, 0, vol);     // C5
  playTone(783.99, 'triangle', 0.12, 0.06, vol);    // G5
  playTone(659.25, 'triangle', 0.12, 0.12, vol);    // E5
  playTone(783.99, 'triangle', 0.12, 0.18, vol);    // G5
  playTone(1046.50, 'triangle', 0.5, 0.24, vol);   // C6
  
  // Agregar una nota brillante y cristalina arriba (oscilador sine alto)
  playTone(1318.51, 'sine', 0.6, 0.30, 0.03);      // E6
}
