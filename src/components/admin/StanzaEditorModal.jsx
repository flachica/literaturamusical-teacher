import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Book, Sparkles, HelpCircle, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { FIGURAS_LITERARIAS } from '../../data/initialData';

export default function StanzaEditorModal({
  cancion,
  figuras,
  onGuardar,
  onCerrar
}) {
  const listadoFiguras = (figuras && Array.isArray(figuras) && figuras.length > 0) ? figuras : FIGURAS_LITERARIAS;

  // Agrupar versos por número de estrofa
  const estrofasMap = {};
  cancion.versos?.forEach((v) => {
    const num = v.estrofaNum || 1;
    if (!estrofasMap[num]) estrofasMap[num] = [];
    estrofasMap[num].push(v);
  });

  const estrofasNums = Object.keys(estrofasMap).map(Number).sort((a, b) => a - b);
  const [estrofaSeleccionada, setEstrofaSeleccionada] = useState(estrofasNums[0] || 1);

  // Paso del Wizard interno (1: Palabras RAE, 2: Figura Literaria, 3: Quiz de Comprensión)
  const [pasoWizard, setPasoWizard] = useState(1);

  // Datos editables de la estrofa seleccionada
  const versosDeEstrofa = estrofasMap[estrofaSeleccionada] || [];
  const primerVerso = versosDeEstrofa[0] || {};

  const [palabrasDificilesStr, setPalabrasDificilesStr] = useState(
    (primerVerso.palabrasDificiles || []).join(', ')
  );
  const [figuraId, setFiguraId] = useState(primerVerso.figuraId || 'metafora');
  const [textoLiteral, setTextoLiteral] = useState(primerVerso.textoLiteral || primerVerso.texto || '');
  const [significadoReal, setSignificadoReal] = useState(primerVerso.significadoReal || '');
  const [explicacionFigura, setExplicacionFigura] = useState(primerVerso.explicacionFigura || primerVerso.explicacion || '');
  const [pregunta, setPregunta] = useState(primerVerso.preguntaComprension || '');

  // Cargar de 2 a 4 opciones
  const opcionesIniciales = Array.isArray(primerVerso.opcionesComprension) && primerVerso.opcionesComprension.length >= 2
    ? primerVerso.opcionesComprension
    : [
        { id: 'a', texto: '', correcta: true },
        { id: 'b', texto: '', correcta: false }
      ];

  const [opciones, setOpciones] = useState(opcionesIniciales);

  // Cambiar de estrofa desde el desplazador horizontal
  const handleCambiarEstrofa = (num) => {
    setEstrofaSeleccionada(num);
    const versosNuevos = estrofasMap[num] || [];
    const primerV = versosNuevos[0] || {};
    setPalabrasDificilesStr((primerV.palabrasDificiles || []).join(', '));
    setFiguraId(primerV.figuraId || 'metafora');
    setTextoLiteral(primerV.textoLiteral || primerV.texto || '');
    setSignificadoReal(primerV.significadoReal || '');
    setExplicacionFigura(primerV.explicacionFigura || primerV.explicacion || '');
    setPregunta(primerV.preguntaComprension || '');
    setOpciones(Array.isArray(primerV.opcionesComprension) && primerV.opcionesComprension.length >= 2
      ? primerV.opcionesComprension
      : [
          { id: 'a', texto: '', correcta: true },
          { id: 'b', texto: '', correcta: false }
        ]
    );
  };

  const handleTogglePalabraTexto = (palabraLimpia) => {
    const arrActual = palabrasDificilesStr
      .split(',')
      .map(p => p.trim().toLowerCase())
      .filter(p => p.length > 0);

    let nuevoArr;
    if (arrActual.includes(palabraLimpia)) {
      nuevoArr = arrActual.filter(p => p !== palabraLimpia);
    } else {
      nuevoArr = [...arrActual, palabraLimpia];
    }
    setPalabrasDificilesStr(nuevoArr.join(', '));
  };

  const handleOpcionTextoChange = (index, nuevoTexto) => {
    setOpciones(prev => prev.map((op, idx) => idx === index ? { ...op, texto: nuevoTexto } : op));
  };

  const handleMarcarCorrecta = (index) => {
    setOpciones(prev => prev.map((op, idx) => ({ ...op, correcta: idx === index })));
  };

  const handleAddOpcion = () => {
    if (opciones.length >= 4) return;
    const ids = ['a', 'b', 'c', 'd'];
    const nuevoId = ids[opciones.length] || `op_${Date.now()}`;
    setOpciones(prev => [...prev, { id: nuevoId, texto: '', correcta: false }]);
  };

  const handleRemoveOpcion = (index) => {
    if (opciones.length <= 2) return;
    setOpciones(prev => {
      const filtradas = prev.filter((_, idx) => idx !== index);
      if (!filtradas.some(op => op.correcta) && filtradas.length > 0) {
        filtradas[0].correcta = true;
      }
      return filtradas;
    });
  };

  const handleGuardarCambios = () => {
    const palabrasArr = palabrasDificilesStr
      .split(',')
      .map(p => p.trim().toLowerCase())
      .filter(p => p.length > 0);

    const figuraObjeto = listadoFiguras.find(f => f.id === figuraId) || listadoFiguras[0];

    const versosActualizados = cancion.versos.map(v => {
      if ((v.estrofaNum || 1) === estrofaSeleccionada) {
        return {
          ...v,
          palabrasDificiles: palabrasArr,
          figuraId: figuraObjeto.id,
          figuraNombre: figuraObjeto.nombre,
          textoLiteral,
          significadoReal,
          explicacionFigura,
          explicacion: explicacionFigura || v.explicacion,
          preguntaComprension: pregunta,
          opcionesComprension: opciones
        };
      }
      return v;
    });

    onGuardar({
      ...cancion,
      versos: versosActualizados
    });
  };

  // Palabras únicas del texto de la estrofa para selección rápida RAE
  const palabrasEstrofaLimpias = Array.from(new Set(
    versosDeEstrofa.flatMap(v => v.texto.split(' '))
      .map(p => p.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ""))
      .filter(p => p.length > 3)
  ));

  return (
    <div
      className="modal-overlay-animate"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98), rgba(15, 23, 42, 0.98))',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          overflow: 'hidden'
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#38bdf8', margin: 0 }}>
              🎵 Editor de Lección: «{cancion.titulo}»
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Modo Padres • Configura estrofas, figuras, palabras RAE y trivias en 3 pasos sencillos
            </span>
          </div>
          <button
            onClick={onCerrar}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* DESPLAZADOR HORIZONTAL DE ESTROFAS (SCRUBBER) */}
        <div
          style={{
            padding: '12px 24px',
            background: 'rgba(15, 23, 42, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', flexShrink: 0, textTransform: 'uppercase' }}>
              Estrofas:
            </span>
            {estrofasNums.map(num => {
              const isSelected = estrofaSeleccionada === num;
              return (
                <button
                  key={num}
                  onClick={() => handleCambiarEstrofa(num)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: isSelected ? 'linear-gradient(135deg, #38bdf8, #0284c7)' : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Estrofa {num}
                </button>
              );
            })}
          </div>

          {/* VISUALIZACIÓN DE LA ESTROFA COMPLETA SELECCIONADA */}
          <div
            style={{
              marginTop: '10px',
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderLeft: '4px solid #38bdf8',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              📖 Estrofa {estrofaSeleccionada} Completa:
            </div>
            <div style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {versosDeEstrofa.map(v => v.texto).join('\n')}
            </div>
          </div>
        </div>

        {/* STEPPER WIZARD DE 3 PASOS */}
        <div
          style={{
            padding: '12px 24px 0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <button
            onClick={() => setPasoWizard(1)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              background: pasoWizard === 1 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: pasoWizard === 1 ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.08)',
              color: pasoWizard === 1 ? '#fbbf24' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>1. 📖 Palabras RAE</span>
          </button>

          <button
            onClick={() => setPasoWizard(2)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              background: pasoWizard === 2 ? 'rgba(244, 114, 182, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: pasoWizard === 2 ? '1.5px solid #f472b6' : '1px solid rgba(255, 255, 255, 0.08)',
              color: pasoWizard === 2 ? '#f472b6' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>2. 🔮 Figura Literaria</span>
          </button>

          <button
            onClick={() => setPasoWizard(3)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              background: pasoWizard === 3 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: pasoWizard === 3 ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              color: pasoWizard === 3 ? '#38bdf8' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>3. ❓ Quiz (3-4 Opciones)</span>
          </button>
        </div>

        {/* CONTENIDO DEL PASO SELECCIONADO */}
        <div style={{ flexGrow: 1, padding: '20px 24px', overflowY: 'auto', textAlign: 'left' }}>

          {/* PASO 1: SELECCIÓN DE PALABRAS RAE */}
          {pasoWizard === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📖 Palabras difíciles para los detectives (Diccionario RAE)
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                  Haz clic sobre las palabras de la estrofa para marcarlas o desmarcarlas, o escríbelas separadas por comas.
                </p>
              </div>

              {/* CHIPS DE PALABRAS DE LA ESTROFA */}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Selección rápida desde el texto de la estrofa:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {palabrasEstrofaLimpias.map(palabra => {
                    const arrActual = palabrasDificilesStr.split(',').map(p => p.trim().toLowerCase());
                    const isSelected = arrActual.includes(palabra);
                    return (
                      <button
                        key={palabra}
                        type="button"
                        onClick={() => handleTogglePalabraTexto(palabra)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                          border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: isSelected ? '#fbbf24' : '#94a3b8',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '} {palabra}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>
                  Lista de palabras seleccionadas (separadas por comas):
                </label>
                <input
                  type="text"
                  value={palabrasDificilesStr}
                  onChange={(e) => setPalabrasDificilesStr(e.target.value)}
                  placeholder="Ej: mimbre, abriles, desbocado"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>
          )}

          {/* PASO 2: FIGURA LITERARIA DE LA ESTROFA */}
          {pasoWizard === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f472b6', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🔮 Selecciona la Figura Literaria que contiene esta estrofa
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                  Haz clic en una tarjeta de figura para asignarla al reto de la detective.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {listadoFiguras.map(fig => {
                  const isSelected = figuraId === fig.id;
                  return (
                    <button
                      key={fig.id}
                      type="button"
                      onClick={() => setFiguraId(fig.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        background: isSelected ? 'rgba(236, 72, 153, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                        border: isSelected ? '2px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        boxShadow: isSelected ? '0 0 14px rgba(236, 72, 153, 0.3)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ fontSize: '1.5rem' }}>{fig.icono}</span>
                      <div>
                        <div style={{ fontWeight: 800, color: fig.color || '#f472b6', fontSize: '0.9rem' }}>
                          {fig.nombre} {isSelected && '✓'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px', lineHeight: 1.3 }}>
                          {fig.definicion_detective || fig.ejemplo_rapido}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* DESGLOSE DIDÁCTICO: LITERAL VS REAL Y EXPLICACIÓN */}
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f472b6' }}>
                  📝 Explicación Didáctica de la Figura Literaria para la Detective:
                </span>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                    📖 Lo que dice literalmente en el verso:
                  </label>
                  <input
                    type="text"
                    value={textoLiteral}
                    onChange={(e) => setTextoLiteral(e.target.value)}
                    placeholder="Ejemplo: tender mi pena al sol / la lluvia besa tu cara"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>
                    ✨ Lo que significa realmente para la niña:
                  </label>
                  <input
                    type="text"
                    value={significadoReal}
                    onChange={(e) => setSignificadoReal(e.target.value)}
                    placeholder="Ejemplo: Enfrentar la tristeza con serenidad / Las gotas caen suavemente como caricias de la naturaleza"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
                    💡 Explicación didáctica de por qué es esta figura:
                  </label>
                  <textarea
                    rows={2}
                    value={explicacionFigura}
                    onChange={(e) => setExplicacionFigura(e.target.value)}
                    placeholder="Ejemplo: Es una Personificación porque asigna el acto cariñoso de 'besar' a las gotas de lluvia."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: QUIZ DE COMPRENSIÓN DE 3 A 4 OPCIONES */}
          {pasoWizard === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ❓ Configuración de la Trivia de Comprensión (3 a 4 Opciones)
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
                  Escribe la pregunta y sus respuestas. Marca mediante el botón selector la respuesta que sea CORRECTA.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', marginBottom: '6px' }}>
                  Pregunta de comprensión para la niña:
                </label>
                <input
                  type="text"
                  value={pregunta}
                  onChange={(e) => setPregunta(e.target.value)}
                  placeholder="¿Qué quiere decir esta estrofa?"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>
                    🎯 Opciones de respuesta ({opciones.length} opciones configuradas):
                  </label>
                  {opciones.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddOpcion}
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid #10b981',
                        color: '#34d399',
                        borderRadius: '8px',
                        padding: '4px 10px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={12} /> Añadir Opción {opciones.length + 1}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {opciones.map((op, idx) => (
                    <div
                      key={op.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: op.correcta ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                        border: op.correcta ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                        padding: '8px 12px',
                        borderRadius: '10px'
                      }}
                    >
                      <input
                        type="radio"
                        name="opcionCorrecta"
                        checked={op.correcta === true}
                        onChange={() => handleMarcarCorrecta(idx)}
                        style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: '#10b981' }}
                        title="Marcar como respuesta correcta"
                      />
                      <input
                        type="text"
                        value={op.texto}
                        onChange={(e) => handleOpcionTextoChange(idx, e.target.value)}
                        placeholder={`Opción ${String.fromCharCode(65 + idx)} ${op.correcta ? '(✓ Correcta)' : ''}`}
                        style={{
                          flexGrow: 1,
                          background: 'transparent',
                          border: 'none',
                          color: '#ffffff',
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                      {opciones.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOpcion(idx)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Eliminar opción"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER WIZARD */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.8)'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {pasoWizard > 1 && (
              <button
                type="button"
                onClick={() => setPasoWizard(prev => prev - 1)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft size={14} /> Anterior
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {pasoWizard < 3 ? (
              <button
                type="button"
                onClick={() => setPasoWizard(prev => prev + 1)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Siguiente Paso <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGuardarCambios}
                style={{
                  padding: '8px 22px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Save size={16} /> Guardar Estrofa {estrofaSeleccionada} en Git y Disco
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
