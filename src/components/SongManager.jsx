import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Upload, RotateCcw, Music, Sparkles, Check, AlertCircle, Bot, Edit3 } from 'lucide-react';
import { FIGURAS_LITERARIAS, TEMAS_EMOCIONES } from '../data/initialData';
import ConfirmModal from './ConfirmModal';

// Función auxiliar para extraer el ID de YouTube
const obtenerYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default function SongManager({ canciones, audioStatus, onGuardarCanciones, onRestaurarDefault }) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorImport, setErrorImport] = useState('');
  const [mostrarPromptLetraIA, setMostrarPromptLetraIA] = useState(false);

  // Estados de modal de confirmación integrado
  const [cancionAEliminar, setCancionAEliminar] = useState(null);
  const [mostrarConfirmRestaurar, setMostrarConfirmRestaurar] = useState(false);

  // Estado para el formulario de nueva canción
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoArtista, setNuevoArtista] = useState('');
  const [nuevoAlbum, setNuevoAlbum] = useState('');
  const [nuevoTemaId, setNuevoTemaId] = useState('amor');
  const [nuevoAudioUrl, setNuevoAudioUrl] = useState('');
  const [nuevoResumen, setNuevoResumen] = useState('');
  const [archivoMp3Nombre, setArchivoMp3Nombre] = useState('');
  const [youtubeUrlOriginal, setYoutubeUrlOriginal] = useState('');

  // Verso 1
  const [versoTexto, setVersoTexto] = useState('');
  const [versoFiguraId, setVersoFiguraId] = useState('metafora');
  const [versoPregunta, setVersoPregunta] = useState('');
  const [versoOpcionA, setVersoOpcionA] = useState(''); // Correcta
  const [versoOpcionB, setVersoOpcionB] = useState(''); // Incorrecta
  const [versoExplicacion, setVersoExplicacion] = useState('');

  // Estado para el asistente por pasos (Wizard de 3 Pasos)
  const [pasoWizard, setPasoWizard] = useState(1);

  // Descarga y conversión de audio de YouTube
  const [cargandoAudioYouTube, setCargandoAudioYouTube] = useState(false);

  // Estados para comprobar disponibilidad de audios y reparación
  const [reparandoGlobal, setReparandoGlobal] = useState(false);
  const [reparandoSongId, setReparandoSongId] = useState(null);

  const handleRecuperarAudio = async (song) => {
    let queryUrl = song.youtubeUrl;
    if (!queryUrl && song.youtubeId) {
      queryUrl = `https://www.youtube.com/watch?v=${song.youtubeId}`;
    }
    if (!queryUrl) {
      alert(`⚠️ No se puede recuperar el audio de «${song.titulo}» porque no tiene configurado un enlace o ID de YouTube.`);
      return;
    }

    setReparandoSongId(song.id);
    try {
      const res = await fetch('/api/download-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: queryUrl })
      });
      const data = await res.json();
      if (data.success && data.audioPath) {
        const ytId = obtenerYoutubeId(queryUrl) || song.youtubeId || '';
        const catalogoActualizado = canciones.map(c => {
          if (c.id === song.id) {
            return {
              ...c,
              audioPreviewUrl: data.audioPath,
              audioUrl: data.audioPath,
              youtubeUrl: queryUrl.includes('youtube.com') || queryUrl.includes('youtu.be') ? queryUrl : c.youtubeUrl || '',
              youtubeId: ytId || c.youtubeId || ''
            };
          }
          return c;
        });
        onGuardarCanciones(catalogoActualizado);
        setMensajeExito(`¡Audio de «${song.titulo}» recuperado correctamente!`);
        setTimeout(() => setMensajeExito(''), 3000);
      } else {
        alert(data.error || `No se pudo recuperar el audio para «${song.titulo}»`);
      }
    } catch (err) {
      alert(`Error al conectar con el servidor para recuperar «${song.titulo}»: ` + err.message);
    } finally {
      setReparandoSongId(null);
    }
  };

  const handleRepararTodosLosAudiosPerdidos = async () => {
    const perdidas = canciones.filter(c => audioStatus[c.id] === 'perdido');
    if (perdidas.length === 0) {
      alert('¡Todos los audios del catálogo están disponibles en este equipo!');
      return;
    }

    setReparandoGlobal(true);
    let exitosas = 0;
    let catalogoActualizado = [...canciones];

    for (const song of perdidas) {
      let queryUrl = song.youtubeUrl;
      if (!queryUrl && song.youtubeId) {
        queryUrl = `https://www.youtube.com/watch?v=${song.youtubeId}`;
      }
      if (!queryUrl) {
        console.warn(`Omitiendo «${song.titulo}» en reparación automática por falta de enlace de YouTube.`);
        continue;
      }

      setReparandoSongId(song.id);
      try {
        const res = await fetch('/api/download-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: queryUrl })
        });
        const data = await res.json();
        if (data.success && data.audioPath) {
          const ytId = obtenerYoutubeId(queryUrl) || song.youtubeId || '';
          catalogoActualizado = catalogoActualizado.map(c => {
            if (c.id === song.id) {
              return {
                ...c,
                audioPreviewUrl: data.audioPath,
                audioUrl: data.audioPath,
                youtubeUrl: queryUrl.includes('youtube.com') || queryUrl.includes('youtu.be') ? queryUrl : c.youtubeUrl || '',
                youtubeId: ytId || c.youtubeId || ''
              };
            }
            return c;
          });
          exitosas++;
        }
      } catch (err) {
        console.error(`Error al recuperar «${song.titulo}» en reparación global:`, err);
      }
    }

    onGuardarCanciones(catalogoActualizado);
    setReparandoGlobal(false);
    setReparandoSongId(null);
    setMensajeExito(`¡Sincronización finalizada! Se han recuperado ${exitosas} de ${perdidas.length} audios perdidos.`);
    setTimeout(() => setMensajeExito(''), 5000);
  };

  const handleConvertirAudioYouTube = async (urlAProcesar) => {
    let targetUrl = urlAProcesar || nuevoAudioUrl.trim();
    if (!targetUrl) {
      targetUrl = `${nuevoArtista.trim()} ${nuevoTitulo.trim()}`.trim();
    }
    if (!targetUrl) {
      alert('Introduce el nombre del tema o una URL de YouTube.');
      return;
    }
    setCargandoAudioYouTube(true);
    try {
      const res = await fetch('/api/download-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      if (data.success && data.audioPath) {
        setNuevoAudioUrl(data.audioPath);
        setArchivoMp3Nombre(`YouTube MP3 (${data.filename})`);
        setYoutubeUrlOriginal(targetUrl);
        setMensajeExito(`¡Audio procesado! Se ha descargado y convertido a ${data.filename} para reproducir en LitMusical.`);
      } else {
        alert(data.error || 'No se pudo convertir el audio de YouTube.');
      }
    } catch (err) {
      alert('Error de conexión con el servidor de conversión: ' + err.message);
    } finally {
      setCargandoAudioYouTube(false);
    }
  };

  // Búsqueda automática en Karaoke API
  const [cargandoAPI, setCargandoAPI] = useState(false);
  const [versosObtenidosAPI, setVersosObtenidosAPI] = useState(null);

  const handleBuscarLetraKaraokeAPI = async () => {
    const queryText = `${nuevoArtista.trim()} ${nuevoTitulo.trim()}`.trim();
    if (!queryText) {
      alert('Escribe al menos el Título de la canción o el Artista para buscar.');
      return;
    }
    setCargandoAPI(true);
    try {
      const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(queryText)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const match = data.find(d => d.syncedLyrics) || data[0];
        
        // Autorellenar automáticamente el título, artista y álbum si estaban vacíos
        if (match.trackName && !nuevoTitulo.trim()) setNuevoTitulo(match.trackName);
        if (match.artistName && !nuevoArtista.trim()) setNuevoArtista(match.artistName);
        if (match.albumName && !nuevoAlbum.trim()) setNuevoAlbum(match.albumName);

        const artistaFinal = match.artistName || nuevoArtista || 'Artista Desconocido';
        const tituloFinal = match.trackName || nuevoTitulo || 'Canción';

        if (match.syncedLyrics) {
          const rawLines = match.syncedLyrics.split('\n').filter(Boolean).map(l => {
            const m = l.match(/\[(\d+):(\d+\.\d+)\]\s*(.*)/);
            if (!m) return null;
            const totalSecs = Number((parseFloat(m[1]) * 60 + parseFloat(m[2])).toFixed(2));
            return { text: m[3], time: totalSecs };
          }).filter(Boolean);

          const versos = rawLines.map((l, idx) => ({
            linea: idx + 1,
            estrofaNum: Math.floor(idx / 6) + 1,
            texto: l.text,
            tiempoInicio: l.time,
            tiempoFin: rawLines[idx + 1] ? rawLines[idx + 1].time : l.time + 5,
            palabrasDificiles: [],
            preguntaComprension: `¿Qué transmite esta imagen poética de ${artistaFinal}?`,
            opcionesComprension: [
              { id: 'a', texto: 'Expresa emoción, libertad e imaginación con el lenguaje.', correcta: true },
              { id: 'b', texto: 'Una descripción común sin valor poético.', correcta: false }
            ],
            figuraId: 'metafora',
            figuraNombre: 'Metáfora',
            explicacion: `Verso de ${artistaFinal} extraído de la Karaoke API.`,
            pista: 'Reflexionar sobre el sentimiento de la letra.'
          }));

          setVersosObtenidosAPI(versos);
          setPasoWizard(2); // Avanzar automáticamente al Paso 2 (Vincular Audio)
          setMensajeExito(`¡Encontrada! «${tituloFinal}» de ${artistaFinal} (${versos.length} versos sincronizados). Avanzando al Paso 2...`);
        } else if (match.plainLyrics) {
          const plainLines = match.plainLyrics.split('\n').filter(l => l.trim().length > 0);
          const versos = plainLines.map((text, idx) => ({
            linea: idx + 1,
            estrofaNum: Math.floor(idx / 6) + 1,
            texto: text.trim(),
            tiempoInicio: idx * 6,
            tiempoFin: (idx + 1) * 6,
            palabrasDificiles: [],
            preguntaComprension: `¿Qué nos transmite esta parte de ${artistaFinal}?`,
            opcionesComprension: [
              { id: 'a', texto: 'Una historia contada con sentimiento.', correcta: true },
              { id: 'b', texto: 'Sin significado especial.', correcta: false }
            ],
            figuraId: 'metafora',
            figuraNombre: 'Metáfora',
            explicacion: `Verso de ${artistaFinal}.`,
            pista: 'Analiza la letra.'
          }));
          setVersosObtenidosAPI(versos);
          setPasoWizard(2);
          setMensajeExito(`¡Encontrada! «${tituloFinal}» de ${artistaFinal} (${versos.length} versos). Avanzando al Paso 2...`);
        }
      } else {
        alert(`No se encontraron resultados en la Karaoke API para "${queryText}".`);
      }
    } catch (err) {
      alert('Error al conectar con la Karaoke API: ' + err.message);
    } finally {
      setCargandoAPI(false);
    }
  };

  const handleMp3FileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNuevoAudioUrl(url);
      setArchivoMp3Nombre(file.name);
    }
  };

  const handleValidarSubmit = (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoArtista.trim()) {
      alert('Por favor, rellenar como mínimo el título y el artista de la canción.');
      return;
    }

    if (!versoTexto.trim() && (!versosObtenidosAPI || versosObtenidosAPI.length === 0)) {
      setMostrarPromptLetraIA(true);
    } else {
      guardarCancionFinal(false);
    }
  };

  const guardarCancionFinal = (solicitarIA) => {
    const temaObj = TEMAS_EMOCIONES.find(t => t.id === nuevoTemaId) || TEMAS_EMOCIONES[1];
    const figuraObj = FIGURAS_LITERARIAS.find(f => f.id === versoFiguraId) || FIGURAS_LITERARIAS[0];

    let versosConstruidos = [];
    if (versosObtenidosAPI && versosObtenidosAPI.length > 0) {
      versosConstruidos = versosObtenidosAPI;
    } else if (solicitarIA) {
      versosConstruidos = [
        {
          linea: 1,
          texto: `[Letra pendiente de renderizar por IA para ${nuevoTitulo}]`,
          palabrasDificiles: [],
          preguntaComprension: `¿Qué transmite esta canción de ${nuevoArtista}?`,
          opcionesComprension: [
            { id: 'a', texto: 'Una historia poética llena de imaginación y emoción.', correcta: true },
            { id: 'b', texto: 'Una descripción común sin imágenes literarias.', correcta: false }
          ],
          figuraId: figuraObj.id,
          figuraNombre: figuraObj.nombre,
          explicacion: 'Letra pendiente de análisis detallado por el servidor de IA local.',
          pista: 'Pendiente de renderizado inteligente.'
        }
      ];
    } else {
      versosConstruidos = [
        {
          linea: 1,
          texto: versoTexto.trim(),
          palabrasDificiles: [],
          preguntaComprension: versoPregunta.trim() || `¿Qué nos transmite este verso de ${nuevoArtista}?`,
          opcionesComprension: [
            { id: 'a', texto: versoOpcionA.trim() || 'Transmitir una emoción profunda con palabras poéticas.', correcta: true },
            { id: 'b', texto: versoOpcionB.trim() || 'Un significado literal y sin ninguna imagen poética.', correcta: false }
          ],
          figuraId: figuraObj.id,
          figuraNombre: figuraObj.nombre,
          explicacion: versoExplicacion.trim() || `Este verso utiliza una ${figuraObj.nombre} para enriquecer el lenguaje.`,
          pista: `Fíjate en cómo ${nuevoArtista} usa la expresión en el verso.`
        }
      ];
    }

    const nuevaCancion = {
      id: `custom-${Date.now()}`,
      titulo: nuevoTitulo.trim(),
      artistaId: nuevoArtista.toLowerCase().replace(/\s+/g, '-'),
      artistaNombre: nuevoArtista.trim(),
      album: nuevoAlbum.trim() || 'Sencillo Local',
      temaId: temaObj.id,
      temaNombre: temaObj.nombre,
      audioPreviewUrl: nuevoAudioUrl.trim() || '',
      youtubeUrl: youtubeUrlOriginal,
      youtubeId: obtenerYoutubeId(youtubeUrlOriginal),
      resumen_didactico: nuevoResumen.trim() || 'Canción añadida desde el panel de padres para karaoke didáctico.',
      letraPendienteIA: solicitarIA,
      versos: versosConstruidos
    };

    const nuevoCat = [...canciones, nuevaCancion];
    onGuardarCanciones(nuevoCat);

    // Limpiar campos
    setNuevoTitulo('');
    setNuevoArtista('');
    setNuevoAlbum('');
    setNuevoAudioUrl('');
    setYoutubeUrlOriginal('');
    setArchivoMp3Nombre('');
    setNuevoResumen('');
    setVersoTexto('');
    setVersoPregunta('');
    setVersoOpcionA('');
    setVersoOpcionB('');
    setVersoExplicacion('');
    setVersosObtenidosAPI(null);
    setMostrarForm(false);
    setMostrarPromptLetraIA(false);

    setMensajeExito(
      `¡«${nuevaCancion.titulo}» de ${nuevaCancion.artistaNombre} guardada y persistida en LocalStorage con ${nuevaCancion.versos.length} versos!`
    );
    setTimeout(() => setMensajeExito(''), 4000);
  };

  const handleSolicitarEliminar = (cancion) => {
    if (canciones.length <= 1) {
      setErrorImport('Debe quedar al menos 1 canción en el catálogo.');
      setTimeout(() => setErrorImport(''), 3000);
      return;
    }
    setCancionAEliminar(cancion);
  };

  const ejecutarEliminacionCancion = () => {
    if (cancionAEliminar) {
      const nuevoCat = canciones.filter(c => c.id !== cancionAEliminar.id);
      onGuardarCanciones(nuevoCat);
      setMensajeExito(`Canción «${cancionAEliminar.titulo}» eliminada del catálogo.`);
      setTimeout(() => setMensajeExito(''), 3000);
      setCancionAEliminar(null);
    }
  };

  const handleExportarJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(canciones, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `litmusical_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportarJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported) && imported.length > 0 && imported[0].titulo) {
          onGuardarCanciones(imported);
          setErrorImport('');
          setMensajeExito('¡Catálogo de canciones importado con éxito desde el archivo JSON!');
          setTimeout(() => setMensajeExito(''), 3000);
        } else {
          setErrorImport('El archivo JSON no tiene la estructura de catálogo válida.');
        }
      } catch (err) {
        setErrorImport('Error al parsear el archivo JSON: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={20} /> Gestión y Edición Local del Catálogo Karaoke
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Añade tus propias canciones descargando el MP3 y su letra en texto, edita el catálogo y exporta/importa en JSON local.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: mostrarForm ? '#334155' : 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> {mostrarForm ? 'Cancelar' : 'Añadir Nueva Canción'}
          </button>

          <button
            onClick={handleExportarJSON}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.2)',
              color: '#38bdf8',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={14} /> Exportar JSON
          </button>

          <label style={{
            padding: '8px 14px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.2)',
            color: '#c084fc',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}>
            <Upload size={14} /> Importar JSON
            <input type="file" accept=".json" onChange={handleImportarJSON} style={{ display: 'none' }} />
          </label>

          <button
            onClick={handleRepararTodosLosAudiosPerdidos}
            disabled={reparandoGlobal || !canciones.some(c => audioStatus[c.id] === 'perdido')}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: reparandoGlobal
                ? 'rgba(71, 85, 105, 0.4)'
                : canciones.some(c => audioStatus[c.id] === 'perdido')
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(245, 158, 11, 0.1)',
              color: canciones.some(c => audioStatus[c.id] === 'perdido') ? '#ffffff' : '#f59e0b',
              border: `1px solid ${canciones.some(c => audioStatus[c.id] === 'perdido') ? 'transparent' : 'rgba(245, 158, 11, 0.3)'}`,
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: (!canciones.some(c => audioStatus[c.id] === 'perdido') || reparandoGlobal) ? 'not-allowed' : 'pointer'
            }}
            title="Escanea y descarga los archivos de audio locales perdidos a partir de sus enlaces de YouTube"
          >
            <RotateCcw size={14} style={{ animation: reparandoGlobal ? 'spin 2s linear infinite' : 'none' }} />
            {reparandoGlobal ? '⏳ Reparando...' : '🔄 Reparar Audios Perdidos'}
          </button>

          <button
            onClick={() => setMostrarConfirmRestaurar(true)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Restaurar canciones iniciales por defecto"
          >
            <RotateCcw size={14} /> Restaurar
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      {mensajeExito && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {mensajeExito}
        </div>
      )}

      {errorImport && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #ef4444', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} /> {errorImport}
        </div>
      )}

      {/* Alerta de progreso de reparación global */}
      {reparandoGlobal && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.25)',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid #f59e0b',
          color: '#fbbf24',
          fontSize: '0.85rem',
          marginBottom: '16px',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '3px solid rgba(245, 158, 11, 0.3)',
            borderTop: '3px solid #f59e0b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span>⏳ Sincronización en lote en curso. Descargando audios locales perdidos desde YouTube... Por favor, espera a que finalice.</span>
        </div>
      )}

      {/* Form for adding a new song */}
      {mostrarForm && (
        <form onSubmit={handleValidarSubmit} style={{ background: 'rgba(15, 23, 42, 0.85)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Alta de Canción Karaoke (Audio MP3 + Letras)
          </h4>

          {/* Step Progress Pills Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            {[
              { step: 1, title: '1. Buscar Letra' },
              { step: 2, title: '2. Enlazar Audio' },
              { step: 3, title: '3. Emoción & Guardar' }
            ].map(s => (
              <div
                key={s.step}
                onClick={() => {
                  if (s.step === 1 || (s.step === 2 && versosObtenidosAPI) || (s.step === 3 && (nuevoAudioUrl || archivoMp3Nombre))) {
                    setPasoWizard(s.step);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: pasoWizard === s.step ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: pasoWizard === s.step ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: pasoWizard === s.step ? '1px solid #c084fc' : '1px solid transparent'
                }}
              >
                {s.title}
              </div>
            ))}
          </div>

          {/* PASO 1: Buscador Principal de Karaoke API */}
          {pasoWizard === 1 && (
            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))', padding: '16px', borderRadius: '12px', border: '1.5px solid #c084fc' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#f472b6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={18} /> Paso 1: Buscar Letra (Karaoke API)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                    Escribe el título o artista para descargar los versos con marcas LRC oficiales.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBuscarLetraKaraokeAPI}
                  disabled={cargandoAPI}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    background: cargandoAPI ? '#475569' : 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: cargandoAPI ? 'wait' : 'pointer',
                    boxShadow: '0 0 12px rgba(236, 72, 153, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {cargandoAPI ? '⏳ Buscando...' : '🔍 Importar Letra de Karaoke API'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Título de la Canción *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Soldadito Marinero"
                    value={nuevoTitulo}
                    onChange={e => setNuevoTitulo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBuscarLetraKaraokeAPI();
                      }
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#f8fafc', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Artista / Grupo (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: Fito & Fitipaldis"
                    value={nuevoArtista}
                    onChange={e => setNuevoArtista(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBuscarLetraKaraokeAPI();
                      }
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}
                  />
                </div>
              </div>

              {versosObtenidosAPI && (
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 800 }}>
                    ✓ Letra de «{nuevoTitulo}» ({versosObtenidosAPI.length} versos)
                  </span>
                  <button
                    type="button"
                    onClick={() => setPasoWizard(2)}
                    style={{ padding: '6px 14px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    Avanzar al Paso 2 ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: Vincular Música / Audio (YouTube o MP3) */}
          {pasoWizard === 2 && (
            <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '16px', borderRadius: '12px', border: '1.5px solid #38bdf8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
                  ✓ Paso 1 OK: Letra de «{nuevoTitulo}» por {nuevoArtista} ({versosObtenidosAPI?.length || 1} versos)
                </span>
                <button type="button" onClick={() => setPasoWizard(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}>
                  ✏️ Cambiar canción
                </button>
              </div>

              <span style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 900, display: 'block', marginBottom: '12px' }}>
                🎵 Paso 2: Vincular la Música o Vídeo
              </span>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent((nuevoArtista + ' ' + nuevoTitulo).trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  ▶️ Buscar audio en YouTube de «{(nuevoArtista + ' ' + nuevoTitulo).trim()}»
                </a>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>o</span>

                <label style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}>
                  <Upload size={16} /> Subir MP3 local
                  <input type="file" accept="audio/*" onChange={handleMp3FileUpload} style={{ display: 'none' }} />
                </label>

                {archivoMp3Nombre && (
                  <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
                    ✓ {archivoMp3Nombre}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Pega el enlace de YouTube o URL y pulsa ENTER o el botón para extraer el audio a MP3:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    placeholder="Ej: https://www.youtube.com/watch?v=..."
                    value={nuevoAudioUrl}
                    onChange={e => setNuevoAudioUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleConvertirAudioYouTube();
                      }
                    }}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleConvertirAudioYouTube()}
                    disabled={cargandoAudioYouTube || !nuevoAudioUrl.trim()}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: cargandoAudioYouTube ? '#475569' : 'linear-gradient(135deg, #0284c7, #38bdf8)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      border: 'none',
                      cursor: (cargandoAudioYouTube || !nuevoAudioUrl.trim()) ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cargandoAudioYouTube ? '⏳ Procesando...' : '⚡ Convertir a MP3 Local'}
                  </button>
                </div>
              </div>

              {/* Indicador visual de trabajo en progreso para el padre/madre */}
              {cargandoAudioYouTube && (
                <div style={{
                  background: 'rgba(2, 132, 199, 0.25)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #38bdf8',
                  color: '#38bdf8',
                  fontSize: '0.85rem',
                  marginBottom: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)'
                }}>
                  <div className="spinner" style={{ width: '20px', height: '20px', border: '3px solid rgba(56, 189, 248, 0.3)', borderTop: '3px solid #38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span>⏳ Descargando y convirtiendo el audio del vídeo de YouTube a MP3... Por favor, espera unos segundos.</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" onClick={() => setPasoWizard(1)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #475569', borderRadius: '6px', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}>
                  ⬅️ Atrás
                </button>
                <button
                  type="button"
                  onClick={() => setPasoWizard(3)}
                  disabled={!nuevoAudioUrl && !archivoMp3Nombre}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: (!nuevoAudioUrl && !archivoMp3Nombre) ? '#475569' : '#0284c7', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Avanzar al Paso 3 ➔
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Emoción Didáctica & Guardado Final */}
          {pasoWizard === 3 && (
            <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '16px', borderRadius: '12px', border: '1.5px solid #10b981' }}>
              <span style={{ fontSize: '0.95rem', color: '#34d399', fontWeight: 900, display: 'block', marginBottom: '12px' }}>
                ✨ Paso 3: Emoción & Guardado Final
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tema o Emoción Predominante</label>
                  <select value={nuevoTemaId} onChange={e => setNuevoTemaId(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}>
                    {TEMAS_EMOCIONES.filter(t => t.id !== 'todos').map(t => (
                      <option key={t.id} value={t.id}>{t.icono} {t.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Resumen Didáctico (¿De qué trata?)</label>
                  <input type="text" placeholder="Ej: Canción sobre las decisiones y el camino de la vida." value={nuevoResumen} onChange={e => setNuevoResumen(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" onClick={() => setPasoWizard(2)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #475569', borderRadius: '6px', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}>
                  ⬅️ Atrás
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={18} /> ✨ Guardar Canción en Catálogo (Disco)
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* PROMPT MODAL WHEN LYRICS ARE MISSING */}
      {mostrarPromptLetraIA && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            border: '2px solid #f59e0b',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '520px',
            width: '100%',
            boxShadow: '0 0 30px rgba(245, 158, 11, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fbbf24', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={22} /> No se ha introducido la letra para «{nuevoTitulo}»
            </h3>
            
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '20px' }}>
              Para que tu hija pueda cantar y resolver el reto de figuras literarias, la canción necesita la letra en texto. ¿Cómo prefieres proceder?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => setMostrarPromptLetraIA(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={20} />
                <div>
                  <div>✍️ Completar la letra manualmente ahora</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>Volver al formulario y escribir el verso principal</div>
                </div>
              </button>

              <button
                onClick={() => guardarCancionFinal(false)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <Music size={20} color="#94a3b8" />
                <div>
                  <div>💾 Guardar sin letra (modo borrador)</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)' }}>La canción se guardará y podrás editar su letra más tarde.</div>
                </div>
              </button>
            </div>

            <button
              onClick={() => setMostrarPromptLetraIA(false)}
              style={{ width: '100%', padding: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Catalog List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {canciones.map((c) => (
          <div
            key={c.id}
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>🎵 {c.titulo}</h4>
                <button
                  onClick={() => handleSolicitarEliminar(c)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                  title="Eliminar del catálogo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                {c.artistaNombre} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({c.album})</span>
              </p>

              {/* Indicador de estado del audio */}
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {audioStatus[c.id] === 'disponible' && (
                  <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    🟢 Audio en disco
                  </span>
                )}
                {audioStatus[c.id] === 'red' && (
                  <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    🌐 Audio en Red
                  </span>
                )}
                {audioStatus[c.id] === 'perdido' && (
                  <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ⚠️ Audio no encontrado
                  </span>
                )}
                {audioStatus[c.id] === 'checking' && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    🔍 Comprobando audio...
                  </span>
                )}

                {/* Botón de recuperar individual */}
                {audioStatus[c.id] === 'perdido' && (
                  <button
                    onClick={() => handleRecuperarAudio(c)}
                    disabled={reparandoSongId === c.id || reparandoGlobal}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: reparandoSongId === c.id ? '#475569' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      cursor: (reparandoSongId === c.id || reparandoGlobal) ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {reparandoSongId === c.id ? '⏳ Descargando...' : '⚡ Recuperar'}
                  </button>
                )}
              </div>

              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '8px', lineHeight: 1.4 }}>
                {c.resumen_didactico}
              </p>
            </div>

            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Versos interactivos: <strong>{c.versos ? c.versos.length : 0}</strong></span>
              <span style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c084fc', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                {c.temaNombre || 'Poesía'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación para eliminar canción */}
      <ConfirmModal
        isOpen={Boolean(cancionAEliminar)}
        titulo="¿Eliminar canción del catálogo?"
        mensaje={`¿Estás seguro de que deseas eliminar «${cancionAEliminar?.titulo}» de ${cancionAEliminar?.artistaNombre}? Esta acción eliminará sus versos del archivo local.`}
        textoConfirmar="Eliminar Canción"
        textoCancelar="Conservar"
        variante="peligro"
        onConfirm={ejecutarEliminacionCancion}
        onCancel={() => setCancionAEliminar(null)}
      />

      {/* Modal de confirmación para restaurar catálogo predeterminado */}
      <ConfirmModal
        isOpen={mostrarConfirmRestaurar}
        titulo="¿Restaurar catálogo original?"
        mensaje="Esta acción restablecerá las canciones iniciales por defecto. Las canciones personalizadas se mantendrán si están en el servidor."
        textoConfirmar="Restaurar Catálogo"
        textoCancelar="Cancelar"
        variante="advertencia"
        onConfirm={() => {
          onRestaurarDefault();
          setMostrarConfirmRestaurar(false);
          setMensajeExito('Catálogo predeterminado restaurado.');
          setTimeout(() => setMensajeExito(''), 3000);
        }}
        onCancel={() => setMostrarConfirmRestaurar(false)}
      />

    </div>
  );
}
