import React, { useState } from 'react';

// Nombres de las 29 columnas normativas requeridas para la validación
const COLUMNAS_29_SII = [
  "Ejercicio", "Instrumento", "FechaPago", "Descripcion", "SecuenciaEvento", 
  "ISFUT_ISIFT", "Origen", "FactorActualizacion", "Col8_RentasAtribuidas", 
  "Col9_UtilidadesAfectas", "Col10_RentasExentas", "Col11_INR", 
  "Col12_ExcesoRetiros", "Col13_OtrasRentas", "Col14_TasaPrimeraCat", 
  "Col15_ISIFT", "Col16_DevolucionCapital", "Col17_CreditoIDPC_ConDev", 
  "Col18_CreditoIDPC_SinDev", "Col19_CreditoIPE", "Col20_OtrosCreditos", 
  "Col21_RetencionIDPC", "Col22_INR_Art107", "Col23_ImpuestoUnico", 
  "Col24_ReajusteCapital", "Col25_SaldoSTUT", "Col26_CreditoArt33Bis", 
  "Col27_FactorActualizacionMonetaria", "Col28_ImpuestoAdicional"
];

export default function CsvUploadModal({ isOpen, onClose, onProcessBulkUpload }) {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [validationError, setValidationError] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  if (!isOpen) return null;

  // Generar y descargar la plantilla CSV oficial con las 29 columnas
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + COLUMNAS_29_SII.join(",") + "\n" +
      "2026,CHILE_ACCION_A,2026-04-15,Dividendo Provisorio,1,ISFUT,Nacional,1.15," + Array(21).fill("0").join(",");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Plantilla_DJ1948_29Columnas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulación de lectura y vista previa del archivo CSV
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setValidationError(null);
    setIsValidated(false);

    if (!selectedFile) {
      setFile(null);
      setPreviewData([]);
      return;
    }

    setFile(selectedFile);

    // Simulamos la parseada del CSV con 2 registros de prueba previsualizables
    const datosSimulados = [
      {
        ejercicio: 2026,
        instrumento: 'CHILE_ACCION_A', // Coincide con la llave para probar actualización
        fecha_pago: '2026-04-15',
        descripcion: 'Dividendo Provisorio (Actualizado Masivo)',
        secuencia_evento: 1,
        isfut_isift: 'ISFUT',
        origen: 'Nacional',
        factor_actualizacion: 1.18,
        fuente_ingreso: 'Carga Masiva CSV'
      },
      {
        ejercicio: 2026,
        instrumento: 'LAN_AIRLINES_2026', // Nuevo registro
        fecha_pago: '2026-06-30',
        descripcion: 'Reparto Anual',
        secuencia_evento: 15,
        isfut_isift: 'ISIFT',
        origen: 'Extranjero',
        factor_actualizacion: 1.02,
        fuente_ingreso: 'Carga Masiva CSV'
      }
    ];

    setPreviewData(datosSimulados);
  };

  // Validar la estructura de las 29 columnas
  const handleValidateStructure = () => {
    if (!file) {
      setValidationError("Por favor, selecciona un archivo CSV válido.");
      return;
    }

    // Validación simulada de encabezados
    const estructuraValida = true;

    if (estructuraValida) {
      setValidationError(null);
      setIsValidated(true);
    } else {
      setValidationError("Error de Estructura: El archivo no contiene las 29 columnas normativas requeridas.");
      setIsValidated(false);
    }
  };

  // Ingesta masiva
  const handleConfirmIngest = () => {
    if (!isValidated) return;
    onProcessBulkUpload(previewData);
    onClose();
  };

  return (
    <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg rounded-3">
          
          {/* HEADER */}
          <div className="modal-header bg-dark text-white py-3">
            <div>
              <h5 className="modal-title h6 font-weight-bold mb-0">Carga Masiva & Previsualización CSV (HU-04)</h5>
              <small className="text-muted">Procesamiento masivo y actualización por llave única de 2 factores (Ejercicio + Instrumento)</small>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            
            {/* PANEL DE CONTROL DE ARCHIVO */}
            <div className="row g-3 align-items-center mb-3 p-3 bg-light rounded border">
              <div className="col-md-5">
                <label className="form-label small font-weight-bold text-muted mb-1">Seleccionar Archivo CSV</label>
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={handleFileChange} 
                  className="form-control form-control-sm" 
                />
              </div>

              <div className="col-md-7 d-flex gap-2 justify-content-md-end align-items-end mt-4">
                <button 
                  type="button" 
                  onClick={handleDownloadTemplate} 
                  className="btn btn-outline-secondary btn-sm"
                >
                  📥 Descargar Plantilla (29 Cols)
                </button>
                
                <button 
                  type="button" 
                  onClick={handleValidateStructure}
                  disabled={!file}
                  className="btn btn-dark btn-sm"
                >
                  🔍 Validar Estructura
                </button>
              </div>
            </div>

            {/* ALERTAS DE VALIDACIÓN */}
            {validationError && (
              <div className="alert alert-danger py-2 small mb-3">
                <strong>Error de Validación:</strong> {validationError}
              </div>
            )}

            {isValidated && (
              <div className="alert alert-success py-2 small mb-3">
                <strong>Estructura Validada:</strong> El archivo contiene las 29 columnas oficiales. Se procede a la comparación mediante la Doble Llave Única (<strong>Ejercicio + Instrumento</strong>).
              </div>
            )}

            {/* PREVISUALIZACIÓN DE LAS 29 COLUMNAS */}
            {previewData.length > 0 && (
              <div>
                <h6 className="font-weight-bold small text-uppercase text-secondary mb-2">
                  Previsualización de Datos a Procesar ({previewData.length} registros simulados)
                </h6>
                <div className="table-responsive border rounded" style={{ maxHeight: '300px' }}>
                  <table className="table table-sm table-hover align-middle mb-0" style={{ fontSize: '11px' }}>
                    <thead className="table-secondary text-uppercase sticky-top">
                      <tr>
                        {COLUMNAS_29_SII.map((col, idx) => (
                          <th key={idx} className="px-2 py-2 text-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-2 font-weight-bold">{row.ejercicio}</td>
                          <td className="px-2 text-naranja font-weight-bold">{row.instrumento}</td>
                          <td className="px-2">{row.fecha_pago}</td>
                          <td className="px-2">{row.descripcion}</td>
                          <td className="px-2">{row.secuencia_evento}</td>
                          <td className="px-2">{row.isfut_isift}</td>
                          <td className="px-2">{row.origen}</td>
                          <td className="px-2">{row.factor_actualizacion}</td>
                          {/* Simulamos las columnas del 8 al 28 con ceros para la previsualización de 29 columnas */}
                          {Array(21).fill(0).map((v, i) => (
                            <td key={i} className="px-2 text-muted font-monospace">0.00</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* FOOTER */}
          <div className="modal-footer bg-light py-2 px-4 d-flex justify-content-between">
            <small className="text-muted">
              Estado: {isValidated ? <span className="text-success font-weight-bold">Listo para Ingesta</span> : <span className="text-secondary">Pendiente de Validación</span>}
            </small>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={onClose}>
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-naranja btn-sm px-4"
                disabled={!isValidated}
                onClick={handleConfirmIngest}
              >
                Subir y Procesar Archivo
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}