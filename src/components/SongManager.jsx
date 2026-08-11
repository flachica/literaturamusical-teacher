import React, { useState } from 'react';
import { Plus, Trash2, Download, Upload, RotateCcw, Music, Sparkles, Check, AlertCircle } from 'lucide-react';
import { FIGURAS_LITERARIAS, TEMAS_EMOCIONES } from '../data/mockData';

export default function SongManager({ canciones, onGuardarCanciones, onRestaurarDefault }) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorImport, setErrorImport] = useState('');

  // Estado para el formulario de nueva canción
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevoArtista, setNuevoArtista] = useState('');
  const [nuevoAlbum, setNuevoAlbum] = useState('');
  const [nuevoTemaId, setNuevoTemaId] = useState('amor');
  const [nuevoAudioUrl, setNuevoAudioUrl] = useState('');
  const [nuevoResumen, setNuevoResumen] = useState('');

  // Verso 1
  const [versoTexto, setVersoTexto] = useState('');
  const [versoFiguraId, setVersoFiguraId] = useState('metafora');
  const [versoPregunta, setVersoPregunta] = useState('');
  const [versoOpcionA, setVersoOpcionA] = useState(''); // Correcta
  const [versoOpcionB, setVersoOpcionB] = useState(''); // Incorrecta
  const [versoExplicacion, setVersoExplicacion] = useState('');

  const handleCrearCancion = (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim() || !nuevoArtista.trim() || !versoTexto.trim()) {
      alert('Por favor, rellenar como mínimo el título, artista y el primer verso.');
      return;
    }

    const temaObj = TEMAS_EMOCIONES.find(t => t.id === nuevoTemaId) || TEMAS_EMOCIONES[1];
    const figuraObj = FIGURAS_LITERARIAS.find(f => f.id === versoFiguraId) || FIGURAS_LITERARIAS[0];

    const nuevaCancion = {
      id: `custom-${Date.now()}`,
      titulo: nuevoTitulo.trim(),
      artistaId: nuevoArtista.toLowerCase().replace(/\s+/g, '-'),
      artistaNombre: nuevoArtista.trim(),
      album: nuevoAlbum.trim() || 'Sencillo Local',
      temaId: temaObj.id,
      temaNombre: temaObj.nombre,
      audioPreviewUrl: nuevoAudioUrl.trim() || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      resumen_didactico: nuevoResumen.trim() || 'Canción añadida desde el panel de padres para practicar figuras literarias.',
      versos: [
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
      ]
    };

    const nuevoCat = [...canciones, nuevaCancion];
    onGuardarCanciones(nuevoCat);

    // Limpiar campos
    setNuevoTitulo('');
    setNuevoArtista('');
    setNuevoAlbum('');
    setNuevoAudioUrl('');
    setNuevoResumen('');
    setVersoTexto('');
    setVersoPregunta('');
    setVersoOpcionA('');
    setVersoOpcionB('');
    setVersoExplicacion('');
    setMostrarForm(false);

    setMensajeExito('¡Nueva canción añadida correctamente al catálogo local!');
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleEliminarCancion = (id) => {
    if (canciones.length <= 1) {
      alert('Debe quedar al menos 1 canción en el catálogo.');
      return;
    }
    if (window.confirm('¿Seguro que quieres eliminar esta canción del catálogo?')) {
      const nuevoCat = canciones.filter(c => c.id !== id);
      onGuardarCanciones(nuevoCat);
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
            <Music size={20} /> Gestión y Edición Local del Catálogo de Canciones
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Añade tus propias canciones preferidas, edita el catálogo y exporta/importa en JSON local.
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
            onClick={() => {
              if (window.confirm('¿Deseas restaurar el catálogo predeterminado original?')) {
                onRestaurarDefault();
              }
            }}
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
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #10b981', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {mensajeExito}
        </div>
      )}

      {errorImport && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} /> {errorImport}
        </div>
      )}

      {/* Form for adding a new song */}
      {mostrarForm && (
        <form onSubmit={handleCrearCancion} style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Formulario para Nueva Canción Didáctica
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Título de la Canción *</label>
              <input type="text" required placeholder="Ej: El Río del Tiempo" value={nuevoTitulo} onChange={e => setNuevoTitulo(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Artista / Grupo *</label>
              <input type="text" required placeholder="Ej: Banda Educativa" value={nuevoArtista} onChange={e => setNuevoArtista(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Álbum / Año</label>
              <input type="text" placeholder="Ej: Un día en el mundo (2008)" value={nuevoAlbum} onChange={e => setNuevoAlbum(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tema o Emoción</label>
              <select value={nuevoTemaId} onChange={e => setNuevoTemaId(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}>
                {TEMAS_EMOCIONES.filter(t => t.id !== 'todos').map(t => (
                  <option key={t.id} value={t.id}>{t.icono} {t.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Resumen Didáctico (¿De qué trata?)</label>
            <input type="text" placeholder="Ej: Canción sobre dejarse llevar y afrontar los cambios de la vida." value={nuevoResumen} onChange={e => setNuevoResumen(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>URL de Audio MP3 / Preview (Opcional)</label>
            <input type="url" placeholder="https://..." value={nuevoAudioUrl} onChange={e => setNuevoAudioUrl(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
          </div>

          {/* Section for Verse & Question */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '14px', borderRadius: '10px', border: '1px dashed rgba(255, 255, 255, 0.1)', marginBottom: '16px' }}>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginBottom: '10px' }}>Verso y Reto Didáctico Inicial</h5>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Texto del Verso *</label>
              <input type="text" required placeholder="Ej: Se dejó llevar por la banda-educativa, a la deriva..." value={versoTexto} onChange={e => setVersoTexto(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Figura Literaria Principal</label>
                <select value={versoFiguraId} onChange={e => setVersoFiguraId(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }}>
                  {FIGURAS_LITERARIAS.map(f => (
                    <option key={f.id} value={f.id}>{f.icono} {f.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Pregunta de Comprensión del Verso</label>
                <input type="text" placeholder="Ej: ¿Qué significa 'dejarse llevar por la banda-educativa'?" value={versoPregunta} onChange={e => setVersoPregunta(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginBottom: '4px' }}>Opción Correcta (Respuesta didáctica)</label>
                <input type="text" placeholder="Ej: Dejarse fluir por las cosas que ocurren en la vida." value={versoOpcionA} onChange={e => setVersoOpcionA(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #10b981' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#f87171', display: 'block', marginBottom: '4px' }}>Opción Incorrecta (Falsa distracción)</label>
                <input type="text" placeholder="Ej: Nadar muy rápido en el mar con traje de baño." value={versoOpcionB} onChange={e => setVersoOpcionB(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #ef4444' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Explicación adaptada a 9 años</label>
              <input type="text" placeholder="Ej: Es una metáfora que compara la vida con la fuerza del agua marina." value={versoExplicacion} onChange={e => setVersoExplicacion(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid #334155' }} />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={18} /> Guardar Canción en el Catálogo Local
          </button>
        </form>
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
              justify: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>🎵 {c.titulo}</h4>
                <button
                  onClick={() => handleEliminarCancion(c.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                  title="Eliminar del catálogo"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                {c.artistaNombre} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({c.album})</span>
              </p>
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

    </div>
  );
}
