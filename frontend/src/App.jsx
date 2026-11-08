import React, { useState } from 'react';
import TaxDataGrid from './components/TaxDataGrid';
import CsvUploadModal from './components/CsvUploadModal';
import ManualEntryModal from './components/ManualEntryModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Historial de Logs inalterable con registro detallado de los últimos movimientos
  const [bitacora, setBitacora] = useState([
    {
      id: 101,
      llaveUnica: '2026 - CHILE_ACCION_A',
      usuario: 'corredor',
      accion: 'MODIFICACIÓN',
      fechaHora: '08/11/2026 14:30:15',
      valorAntiguo: 'Factor Act: 1.12 | Regimen: N/A',
      valorNuevo: 'Factor Act: 1.15 | Regimen: ISFUT',
      metodo: 'Edición Manual (Montos/Factores)'
    },
    {
      id: 100,
      llaveUnica: '2025 - FONDOS_MUTUOS_B',
      usuario: 'corredor',
      accion: 'CREACIÓN',
      fechaHora: '08/11/2026 10:15:00',
      valorAntiguo: 'N/A',
      valorNuevo: 'Secuencia: 2 | Regimen: ISIFT',
      metodo: 'Ingreso Manual (HU-02)'
    }
  ]);

  const [filtros, setFiltros] = useState({
    mercado: '',
    origen: '',
    ejercicio: '2026'
  });

  const [dataGridRows, setDataGridRows] = useState([
    { id: 1, ejercicio: 2026, instrumento: 'CHILE_ACCION_A', fecha_pago: '2026-04-15', descripcion: 'Dividendo Provisorio', secuencia_evento: 1, isfut_isift: 'ISFUT', origen: 'Nacional', factor_actualizacion: 1.15, fuente_ingreso: 'Carga', ultimaModificacion: '08/11/2026 14:30:15' },
    { id: 2, ejercicio: 2025, instrumento: 'FONDOS_MUTUOS_B', fecha_pago: '2025-11-20', descripcion: 'Reparto de Utilidades', secuencia_evento: 2, isfut_isift: 'ISIFT', origen: 'Extranjero', factor_actualizacion: 1.05, fuente_ingreso: 'Manual', ultimaModificacion: '08/11/2026 10:15:00' },
  ]);

  if (!currentUser) {
    return <LoginModal onLogin={(user) => setCurrentUser(user)} />;
  }

  if (currentUser.rol === 'Administrador') {
    return <AdminDashboard onLogout={() => setCurrentUser(null)} />;
  }

  const rol = currentUser.rol;

  const handleInputChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleBuscar = (e) => {
    e.preventDefault();
  };

  const handleLimpiar = () => {
    setFiltros({ mercado: '', origen: '', ejercicio: '' });
  };

  // Registrar CREACIÓN en la bitácora
  const handleAddManualRow = (nuevaFila) => {
    setDataGridRows([nuevaFila, ...dataGridRows]);
    
    const nuevoMovimiento = {
      id: Date.now(),
      llaveUnica: `${nuevaFila.ejercicio} - ${nuevaFila.instrumento}`,
      usuario: currentUser.nombre || currentUser.username,
      accion: 'CREACIÓN',
      fechaHora: new Date().toLocaleString('es-CL'),
      valorAntiguo: 'N/A (Nuevo Registro)',
      valorNuevo: `Secuencia: ${nuevaFila.secuencia_evento} | Origen: ${nuevaFila.origen}`,
      metodo: 'Ingreso Manual (HU-02)'
    };

    setBitacora([nuevoMovimiento, ...bitacora]);
  };

  // Registrar ELIMINACIÓN en la bitácora
  const handleDeleteRow = (id, rowData) => {
    setDataGridRows(dataGridRows.filter(row => row.id !== id));

    const nuevoMovimiento = {
      id: Date.now(),
      llaveUnica: `${rowData.ejercicio} - ${rowData.instrumento}`,
      usuario: currentUser.nombre || currentUser.username,
      accion: 'ELIMINACIÓN',
      fechaHora: new Date().toLocaleString('es-CL'),
      valorAntiguo: `Instrumento: ${rowData.instrumento} (Secuencia: ${rowData.secuencia_evento})`,
      valorNuevo: 'REGISTRO ELIMINADO DE LA BASE DE DATOS',
      metodo: 'Eliminación Individual'
    };

    setBitacora([nuevoMovimiento, ...bitacora]);
  };

  // Registrar MODIFICACIÓN en la bitácora
  const handleUpdateRow = (siiData) => {
    const timestampActual = new Date().toLocaleString('es-CL');

    setDataGridRows(dataGridRows.map(row => {
      if (row.id === siiData.rowId) {
        return {
          ...row,
          montos: siiData.montos,
          factores: siiData.factores,
          ultimaModificacion: timestampActual
        };
      }
      return row;
    }));

    const nuevoMovimiento = {
      id: Date.now(),
      llaveUnica: `ID Registro: ${siiData.rowId}`,
      usuario: currentUser.nombre || currentUser.username,
      accion: 'MODIFICACIÓN',
      fechaHora: timestampActual,
      valorAntiguo: 'Montos/Factores Anteriores',
      valorNuevo: `Suma Factores (Col 8-16): ${siiData.sumaFactoresRestringidos}`,
      metodo: 'Modificación de Montos/Factores (HU-03)'
    };

    setBitacora([nuevoMovimiento, ...bitacora]);
  };

  // Registrar CARGA MASIVA en la bitácora
  const handleProcessBulkUpload = (filasCSV) => {
    const timestampActual = new Date().toLocaleString('es-CL');
    let copiaFilasActuales = [...dataGridRows];
    const nuevosMovimientos = [];

    filasCSV.forEach((filaNueva) => {
      const indiceExistente = copiaFilasActuales.findIndex(
        (r) => String(r.ejercicio) === String(filaNueva.ejercicio) && 
               String(r.instrumento).toUpperCase() === String(filaNueva.instrumento).toUpperCase()
      );

      if (indiceExistente !== -1) {
        copiaFilasActuales[indiceExistente] = {
          ...copiaFilasActuales[indiceExistente],
          ...filaNueva,
          fuente_ingreso: 'Carga Masiva (Actualizado)',
          ultimaModificacion: timestampActual
        };

        nuevosMovimientos.push({
          id: Date.now() + Math.random(),
          llaveUnica: `${filaNueva.ejercicio} - ${filaNueva.instrumento}`,
          usuario: currentUser.nombre || currentUser.username,
          accion: 'ACTUALIZACIÓN',
          fechaHora: timestampActual,
          valorAntiguo: 'Registro Preexistente',
          valorNuevo: `Actualización mediante doble llave (${filaNueva.ejercicio} / ${filaNueva.instrumento})`,
          metodo: 'Ingesta Masiva CSV (HU-04)'
        });
      } else {
        copiaFilasActuales.unshift({
          ...filaNueva,
          id: Date.now() + Math.random(),
          ultimaModificacion: timestampActual
        });

        nuevosMovimientos.push({
          id: Date.now() + Math.random(),
          llaveUnica: `${filaNueva.ejercicio} - ${filaNueva.instrumento}`,
          usuario: currentUser.nombre || currentUser.username,
          accion: 'CREACIÓN',
          fechaHora: timestampActual,
          valorAntiguo: 'N/A',
          valorNuevo: `Nuevo Registro Carga Masiva (Factor: ${filaNueva.factor_actualizacion})`,
          metodo: 'Ingesta Masiva CSV (HU-04)'
        });
      }
    });

    setDataGridRows(copiaFilasActuales);
    setBitacora([...nuevosMovimientos, ...bitacora]);
    alert("Carga masiva procesada y registrada en el historial.");
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* HEADER */}
      <header className="bg-white border-bottom shadow-sm mb-4">
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-naranja rounded-3 d-flex align-items-center justify-content-center font-weight-bold fs-4 text-white shadow-sm" style={{ width: '42px', height: '42px' }}>
              N
            </div>
            <div>
              <h1 className="h4 mb-0 font-weight-bold text-dark">Módulo DJ1948</h1>
              <small className="text-muted">Plataforma de Calificación Tributaria y Bursátil</small>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <div className="text-end">
              <span className="d-block fw-bold text-dark small">{currentUser.nombre}</span>
              <span className="badge bg-secondary" style={{ fontSize: '10px' }}>Rol: {rol}</span>
            </div>

            <div className="d-flex gap-2">
              {rol === 'Corredor' && (
                <>
                  <button onClick={() => setIsManualModalOpen(true)} className="btn btn-outline-dark btn-sm shadow-sm">
                    + Ingreso Manual
                  </button>
                  <button onClick={() => setIsCsvModalOpen(true)} className="btn btn-naranja btn-sm shadow-sm">
                    + Cargar Archivo Masivo
                  </button>
                </>
              )}

              <button onClick={() => setCurrentUser(null)} className="btn btn-outline-danger btn-sm">
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-5">
        {rol === 'Auditor' && (
          <div className="alert alert-warning py-2 mb-4 shadow-sm" role="alert">
            <strong>Modo Auditor de Compliance Activo (HU-06):</strong> Acceso exclusivo de fiscalización en <span className="badge bg-dark text-white">Solo Lectura</span> y revisión de Bitácora Completa.
          </div>
        )}

        {/* PANEL DE FILTROS */}
        <div className="card shadow-sm border-0 mb-4 rounded-3">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="card-title h6 mb-0 font-weight-bold text-uppercase text-secondary">Filtros de Búsqueda Avanzada</h5>
              <span className="badge bg-light text-naranja border border-naranja">Sesión: {rol}</span>
            </div>
            <form onSubmit={handleBuscar} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label small text-muted font-weight-medium">Tipo de Mercado</label>
                <select name="mercado" value={filtros.mercado} onChange={handleInputChange} className="form-select form-select-sm">
                  <option value="">Todos los mercados</option>
                  <option value="Acciones">Acciones</option>
                  <option value="CFI">CFI</option>
                  <option value="Fondos Mutuos">Fondos Mutuos</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small text-muted font-weight-medium">Origen</label>
                <select name="origen" value={filtros.origen} onChange={handleInputChange} className="form-select form-select-sm">
                  <option value="">Todos los orígenes</option>
                  <option value="Nacional">Nacional</option>
                  <option value="Extranjero">Extranjero</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small text-muted font-weight-medium">Periodo Comercial (Ejercicio)</label>
                <input type="number" name="ejercicio" placeholder="Ej. 2026" value={filtros.ejercicio} onChange={handleInputChange} className="form-control form-control-sm" />
              </div>

              <div className="col-md-3 d-flex gap-2">
                <button type="submit" className="btn btn-dark btn-sm w-100">Buscar</button>
                <button type="button" onClick={handleLimpiar} className="btn btn-outline-secondary btn-sm w-100">Limpiar</button>
              </div>
            </form>
          </div>
        </div>

        {/* GRILLA DE DATOS */}
        <TaxDataGrid 
          rows={dataGridRows} 
          onDeleteRow={handleDeleteRow} 
          onUpdateRow={handleUpdateRow} 
          isAuditor={rol === 'Auditor'} 
        />

        {/* BITÁCORA EXCLUSIVA PARA EL AUDITOR DE COMPLIANCE (HU-06) */}
        {rol === 'Auditor' && (
          <div className="card shadow-sm border-0 rounded-3 mt-4">
            <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-0 font-weight-bold">Bitácora de Logs Inalterable & Historial de Auditoría (HU-06)</h6>
                <small className="text-white-50">Trazabilidad completa de los últimos movimientos realizados en la plataforma</small>
              </div>
              <span className="badge bg-warning text-dark font-monospace py-2 px-3">
                {bitacora.length} Registros Auditados
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-sm table-striped table-hover mb-0 align-middle" style={{ fontSize: '11px' }}>
                <thead className="table-secondary text-uppercase">
                  <tr>
                    <th className="px-3 py-2">Llave / Activo</th>
                    <th className="px-3 py-2">Usuario Responsable</th>
                    <th className="px-3 py-2">Acción</th>
                    <th className="px-3 py-2">Fecha y Hora Exacta</th>
                    <th className="px-3 py-2">Valor Antiguo</th>
                    <th className="px-3 py-2">Valor Nuevo</th>
                    <th className="px-3 py-2">Método de Modificación</th>
                  </tr>
                </thead>
                <tbody>
                  {bitacora.map((b) => (
                    <tr key={b.id}>
                      <td className="px-3 font-weight-bold">{b.llaveUnica}</td>
                      <td className="px-3 font-weight-bold text-secondary">{b.usuario}</td>
                      <td className="px-3">
                        <span className={`badge ${
                          b.accion === 'MODIFICACIÓN' || b.accion === 'ACTUALIZACIÓN' ? 'bg-warning text-dark' : 
                          b.accion === 'ELIMINACIÓN' ? 'bg-danger' : 'bg-success'
                        }`}>
                          {b.accion}
                        </span>
                      </td>
                      <td className="px-3 font-monospace">{b.fechaHora}</td>
                      <td className="px-3 font-monospace text-muted">{b.valorAntiguo}</td>
                      <td className="px-3 font-monospace text-dark font-weight-bold">{b.valorNuevo}</td>
                      <td className="px-3">{b.metodo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <CsvUploadModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} onProcessBulkUpload={handleProcessBulkUpload} />
      <ManualEntryModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} onAddManualRow={handleAddManualRow} currentEjercicio={filtros.ejercicio} currentMercado={filtros.mercado} />
    </div>
  );
}