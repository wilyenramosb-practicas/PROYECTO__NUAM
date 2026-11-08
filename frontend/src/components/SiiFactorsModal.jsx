import React, { useState, useEffect } from 'react';

const COLUMNAS_SII = [
  { id: 8, nombre: "Col. 8: RENTAS ATRIBUIDAS (ISFUT)", esFactorRestringido: true },
  { id: 9, nombre: "Col. 9: UTILIDADES AFECTAS A IGC O IA", esFactorRestringido: true },
  { id: 10, nombre: "Col. 10: RENTAS EXENTAS DE IGC", esFactorRestringido: true },
  { id: 11, nombre: "Col. 11: RENTAS NO CONSTITUTIVAS DE RENTA (INR)", esFactorRestringido: true },
  { id: 12, nombre: "Col. 12: EXCESO DE RETIROS", esFactorRestringido: true },
  { id: 13, nombre: "Col. 13: OTRAS RENTAS", esFactorRestringido: true },
  { id: 14, nombre: "Col. 14: RENTAS CON TASA DE PRIMERA CATEGORÍA", esFactorRestringido: true },
  { id: 15, nombre: "Col. 15: RENTAS CON IMPUESTO SUSTITUTIVO (ISIFT)", esFactorRestringido: true },
  { id: 16, nombre: "Col. 16: DEVOLUCIÓN DE CAPITAL (ART. 63 N° 1)", esFactorRestringido: true },
  { id: 17, nombre: "Col. 17: CREDITO IDPC CON DERECHO DEVOLUCION", esFactorRestringido: false },
  { id: 18, nombre: "Col. 18: CREDITO IDPC SIN DERECHO DEVOLUCION", esFactorRestringido: false },
  { id: 19, nombre: "Col. 19: CREDITO IPE", esFactorRestringido: false },
  { id: 20, nombre: "Col. 20: OTROS CREDITYOS", esFactorRestringido: false },
  { id: 21, nombre: "Col. 21: RETENCION IMPUESTO PRIMERA CATEGORÍA", esFactorRestringido: false },
  { id: 22, nombre: "Col. 22: MONTO INGRESO NO RENTA ART. 107 LIR", esFactorRestringido: false },
  { id: 23, nombre: "Col. 23: MONTO AFECTO A IMPUESTO ÚNICO", esFactorRestringido: false },
  { id: 24, nombre: "Col. 24: REAJUSTE DE CAPITAL", esFactorRestringido: false },
  { id: 25, nombre: "Col. 25: SALDO STUT", esFactorRestringido: false },
  { id: 26, nombre: "Col. 26: CREDITO ART. 33 BIS", esFactorRestringido: false },
  { id: 27, nombre: "Col. 27: FACTOR DE ACTUALIZACIÓN MONETARIA", esFactorRestringido: false },
  { id: 28, nombre: "Col. 28: IMPUESTO ADICIONAL PAGADO", esFactorRestringido: false },
  { id: 29, nombre: "Col. 29: IMPUESTO TERRITORIAL CREDITICIO", esFactorRestringido: false },
  { id: 30, nombre: "Col. 30: BASE IMPONIBLE TOTAL", esFactorRestringido: false },
  { id: 31, nombre: "Col. 31: MONTO BRUTO DISTRIBUIDO", esFactorRestringido: false },
  { id: 32, nombre: "Col. 32: RETENCIÓN ART. 74 N° 4", esFactorRestringido: false },
  { id: 33, nombre: "Col. 33: TASA EFECTIVA DE CRÉDITO", esFactorRestringido: false },
  { id: 34, nombre: "Col. 34: EXCESO DE DISTRIBUCIÓN", esFactorRestringido: false },
  { id: 35, nombre: "Col. 35: ASIGNACIÓN DE BENEFICIOS", esFactorRestringido: false },
  { id: 36, nombre: "Col. 36: SALDO ACUMULADO STUT SUBSIGUIENTE", esFactorRestringido: false },
];

export default function SiiFactorsModal({ isOpen, onClose, onSave, rowData }) {
  const [activeTab, setActiveTab] = useState('montos');
  
  const [montos, setMontos] = useState({});
  const [factores, setFactores] = useState({});
  const [sumaFactoresRestringidos, setSumaFactoresRestringidos] = useState(0);
  const [isValidated, setIsValidated] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Inicializar estados cuando se abre el modal con los datos de la fila
  useEffect(() => {
    if (rowData) {
      const montosIniciales = COLUMNAS_SII.reduce((acc, col) => ({ ...acc, [col.id]: rowData.montos?.[col.id] || 0 }), {});
      const factoresIniciales = COLUMNAS_SII.reduce((acc, col) => ({ ...acc, [col.id]: rowData.factores?.[col.id] || 0 }), {});
      setMontos(montosIniciales);
      setFactores(factoresIniciales);
      setIsValidated(false);
      setHasError(false);
      setSumaFactoresRestringidos(0);
    }
  }, [rowData, isOpen]);

  if (!isOpen) return null;

  const handleMontoChange = (colId, value) => {
    setMontos({ ...montos, [colId]: parseFloat(value) || 0 });
    setIsValidated(false);
  };

  const handleFactorChange = (colId, value) => {
    setFactores({ ...factores, [colId]: parseFloat(value) || 0 });
    setIsValidated(false);
  };

  const handleCalcular = () => {
    let sumaRestringida = 0;
    COLUMNAS_SII.forEach((col) => {
      if (col.esFactorRestringido) {
        sumaRestringida += Number(factores[col.id] || 0);
      }
    });

    sumaRestringida = parseFloat(sumaRestringida.toFixed(4));
    setSumaFactoresRestringidos(sumaRestringida);

    if (sumaRestringida > 1.0) {
      setHasError(true);
      setIsValidated(false);
    } else {
      setHasError(false);
      setIsValidated(true);
    }
  };

  const handleGrabar = () => {
    if (!isValidated || hasError) return;
    
    // Genera automáticamente la fecha y hora exacta de la última modificación
    const ultimaModificacion = new Date().toLocaleString('es-CL');

    onSave({
      rowId: rowData?.id,
      montos,
      factores,
      sumaFactoresRestringidos,
      ultimaModificacion
    });
    onClose();
  };

  return (
    <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg rounded-3">
          
          <div className="modal-header bg-dark text-white py-2 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="modal-title h6 mb-0 font-weight-bold">
                Modificación de Montos y Factores SII (DJ1948)
              </h5>
              <small className="text-muted">
                Instrumento: <strong className="text-naranja">{rowData?.instrumento}</strong> | 
                Última Modificación: <span className="text-info">{rowData?.ultimaModificacion || 'Sin modificaciones previas'}</span>
              </small>
            </div>
            
            <ul className="nav nav-pills small">
              <li className="nav-item">
                <button 
                  className={`nav-link py-1 px-3 ${activeTab === 'montos' ? 'active bg-naranja text-white' : 'text-white-50'}`}
                  onClick={() => setActiveTab('montos')}
                >
                  1. Modificar Montos (29 Cols)
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link py-1 px-3 ${activeTab === 'factores' ? 'active bg-naranja text-white' : 'text-white-50'}`}
                  onClick={() => setActiveTab('factores')}
                >
                  2. Revisión y Edición de Factores
                </button>
              </li>
            </ul>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            
            {hasError && (
              <div className="alert alert-danger py-2 mb-3">
                <strong>Alerta Legal:</strong> La suma de factores (Cols 8 al 16) es <strong>{sumaFactoresRestringidos}</strong>. Supera el límite de 1.0. Grabado deshabilitado.
              </div>
            )}

            {isValidated && !hasError && (
              <div className="alert alert-success py-2 mb-3">
                <strong>Validación Correcta:</strong> Suma de factores = {sumaFactoresRestringidos} (&le; 1.0). Listo para grabar con estampa de tiempo automática.
              </div>
            )}

            {activeTab === 'montos' && (
              <div className="row g-2">
                <div className="col-12 mb-2">
                  <span className="badge bg-light text-dark border">Modifique los montos normativos según corresponda</span>
                </div>
                {COLUMNAS_SII.map((col) => (
                  <div className="col-md-4" key={col.id}>
                    <div className="p-2 rounded border bg-white">
                      <label className="form-label small font-weight-bold text-truncate d-block mb-1" title={col.nombre}>
                        {col.nombre}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={montos[col.id] || 0}
                        onChange={(e) => handleMontoChange(col.id, e.target.value)}
                        className="form-control form-control-sm font-monospace"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'factores' && (
              <div>
                <div className="alert alert-info py-2 small mb-3">
                  Revise o edite directamente los factores asociados a cada columna antes de validar y calcular.
                </div>
                <div className="row g-2">
                  {COLUMNAS_SII.map((col) => (
                    <div className="col-md-4" key={col.id}>
                      <div className={`p-2 rounded border ${col.esFactorRestringido ? 'bg-light border-warning' : 'bg-white'}`}>
                        <label className="form-label small font-weight-bold text-truncate d-block mb-1" title={col.nombre}>
                          Factor {col.nombre.split(':')[0]} {col.esFactorRestringido && '(*)'}
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          value={factores[col.id] || 0}
                          onChange={(e) => handleFactorChange(col.id, e.target.value)}
                          className="form-control form-control-sm font-monospace"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button 
                    type="button" 
                    className="btn btn-naranja btn-sm px-4"
                    onClick={() => {
                      alert("Factores guardados temporalmente en memoria. Cambie a Calcular para verificar.");
                      setActiveTab('montos');
                    }}
                  >
                    OK (Confirmar Factores)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light py-2 px-4 d-flex justify-content-between">
            <div className="small text-muted">
              Suma Factores (8-16): <strong className={hasError ? 'text-danger' : 'text-dark'}>{sumaFactoresRestringidos}</strong> / 1.0
            </div>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={onClose}>
                Cancelar
              </button>
              <button type="button" className="btn btn-dark btn-sm px-4" onClick={handleCalcular}>
                Calcular
              </button>
              <button 
                type="button" 
                className="btn btn-naranja btn-sm px-4" 
                onClick={handleGrabar}
                disabled={!isValidated || hasError}
              >
                Grabar (Actualizar)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}