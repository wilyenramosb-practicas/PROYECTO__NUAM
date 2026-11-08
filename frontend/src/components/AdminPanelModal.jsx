import React, { useState } from 'react';

export default function AdminPanelModal({ isOpen, onClose, onUpdateColumnasSII, onUpdateLlaveUnica }) {
  const [activeTab, setActiveTab] = useState('usuarios'); // 'usuarios' | 'columnas' | 'llave'

  // Simulación de lista de usuarios bajo norma ISO 27001
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Nicolás Pino', rol: 'Administrador', estado: 'Activo' },
    { id: 2, nombre: 'Corredor Principal', rol: 'Corredor', estado: 'Activo' },
    { id: 3, nombre: 'Auditor Compliance', rol: 'Auditor', estado: 'Activo' },
  ]);

  // Parámetros de la llave única modificables ante cambios legales
  const [llaveConfig, setLlaveConfig] = useState({
    campo1: 'Ejercicio',
    campo2: 'Instrumento',
    caseSensitive: false
  });

  // Homologación de columnas normativas del SII
  const [columnasSII, setColumnasSII] = useState([
    { id: 8, codigo: 'Col8', nombreOriginal: 'RENTAS ATRIBUIDAS (ISFUT)' },
    { id: 9, codigo: 'Col9', nombreOriginal: 'UTILIDADES AFECTAS A IGC O IA' },
    { id: 10, codigo: 'Col10', nombreOriginal: 'RENTAS EXENTAS DE IGC' },
  ]);

  if (!isOpen) return null;

  const handleToggleEstado = (id) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, estado: u.estado === 'Activo' ? 'Desactivado' : 'Activo' } : u));
  };

  const handleSaveLlave = (e) => {
    e.preventDefault();
    onUpdateLlaveUnica(llaveConfig);
    alert("Parámetros de la llave única actualizados con éxito.");
  };

  return (
    <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content border-0 shadow-lg rounded-3">
          
          <div className="modal-header bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h5 className="modal-title h6 mb-0 font-weight-bold">Panel de Administración de TI (ISO 27001)</h5>
              <small className="text-muted">Gestión de Accesos RBAC, Homologación de Columnas y Llave Única</small>
            </div>
            
            <ul className="nav nav-pills small">
              <li className="nav-item">
                <button 
                  className={`nav-link py-1 px-3 ${activeTab === 'usuarios' ? 'active bg-naranja text-white' : 'text-white-50'}`}
                  onClick={() => setActiveTab('usuarios')}
                >
                  Gestión Usuarios (RBAC)
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link py-1 px-3 ${activeTab === 'columnas' ? 'active bg-naranja text-white' : 'text-white-50'}`}
                  onClick={() => setActiveTab('columnas')}
                >
                  Homologación Columnas SII
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link py-1 px-3 ${activeTab === 'llave' ? 'active bg-naranja text-white' : 'text-white-50'}`}
                  onClick={() => setActiveTab('llave')}
                >
                  Configuración Llave Única
                </button>
              </li>
            </ul>
            <button type="button" className="btn-close btn-close-white" onClose={onClose} onClick={onClose}></button>
          </div>

          <div className="modal-body p-4" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            
            {/* PESTAÑA 1: GESTIÓN DE USUARIOS Y ROLES (RBAC ISO 27001) */}
            {activeTab === 'usuarios' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="font-weight-bold text-secondary mb-0">Directorio de Cuentas y Asignación de Perfiles</h6>
                  <span className="badge bg-success">Cumplimiento ISO 27001 Activo</span>
                </div>
                <div className="table-responsive border rounded">
                  <table className="table table-sm table-hover align-middle mb-0">
                    <thead className="table-secondary">
                      <tr>
                        <th className="px-3 py-2">Usuario</th>
                        <th className="px-3 py-2">Perfil Asignado (RBAC)</th>
                        <th className="px-3 py-2">Estado de Cuenta</th>
                        <th className="px-3 py-2 text-center">Acciones de TI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map(u => (
                        <tr key={u.id}>
                          <td className="px-3 font-weight-bold">{u.nombre}</td>
                          <td className="px-3">
                            <span className="badge bg-dark">{u.rol}</span>
                          </td>
                          <td className="px-3">
                            <span className={`badge ${u.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                              {u.estado}
                            </span>
                          </td>
                          <td className="px-3 text-center">
                            <button 
                              onClick={() => handleToggleEstado(u.id)}
                              className={`btn btn-sm py-0 px-2 ${u.estado === 'Activo' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              style={{ fontSize: '11px' }}
                            >
                              {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: HOMOLOGACIÓN DE COLUMNAS SII */}
            {activeTab === 'columnas' && (
              <div>
                <h6 className="font-weight-bold text-secondary mb-2">Homologación y Actualización de Nombres Normativos del SII</h6>
                <p className="text-muted small mb-3">Modifique las equivalencias si el Servicio de Impuestos Internos actualiza las especificaciones técnicas de los certificados.</p>
                <div className="row g-2">
                  {columnasSII.map((c, idx) => (
                    <div className="col-md-4" key={c.id}>
                      <div className="p-2 border rounded bg-white">
                        <label className="form-label small fw-bold text-naranja">{c.codigo}</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm"
                          value={c.nombreOriginal}
                          onChange={(e) => {
                            const nuevas = [...columnasSII];
                            nuevas[idx].nombreOriginal = e.target.value;
                            setColumnasSII(nuevas);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-end">
                  <button className="btn btn-naranja btn-sm" onClick={() => alert("Plantilla de homologación actualizada correctamente.")}>
                    Guardar Cambios de Homologación
                  </button>
                </div>
              </div>
            )}

            {/* PESTAÑA 3: CONFIGURACIÓN DE LLAVE ÚNICA */}
            {activeTab === 'llave' && (
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="card p-4 border bg-light">
                    <h6 className="font-weight-bold text-secondary mb-3">Parámetros de Llave Única para Cargas Masivas</h6>
                    <form onSubmit={handleSaveLlave}>
                      <div className="mb-3">
                        <label className="form-label small fw-bold">Primer Factor Identificador</label>
                        <select 
                          className="form-select form-select-sm"
                          value={llaveConfig.campo1}
                          onChange={(e) => setLlaveConfig({ ...llaveConfig, campo1: e.target.value })}
                        >
                          <option value="Ejercicio">Periodo Comercial (Ejercicio)</option>
                          <option value="Rut">RUT de la Entidad</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold">Segundo Factor Identificador</label>
                        <select 
                          className="form-select form-select-sm"
                          value={llaveConfig.campo2}
                          onChange={(e) => setLlaveConfig({ ...llaveConfig, campo2: e.target.value })}
                        >
                          <option value="Instrumento">Código de Instrumento</option>
                          <option value="Secuencia">Secuencia de Evento</option>
                        </select>
                      </div>

                      <div className="text-end">
                        <button type="submit" className="btn btn-dark btn-sm px-4">
                          Actualizar Llave Única
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="modal-footer bg-light py-2 px-4">
            <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={onClose}>
              Cerrar Panel TI
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}