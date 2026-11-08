import React, { useState } from 'react';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('usuarios');

  const [usuarios, setUsuarios] = useState([
    { id: 1, nombreCompleto: 'Nicolás Pino', rut: '12.345.678-9', email: 'n.pino@nuam.cl', rol: 'Administrador', estado: true, fecha_creacion: '2026-10-01' },
    { id: 2, nombreCompleto: 'Corredor Principal', rut: '15.987.654-K', email: 'corredor@nuam.cl', rol: 'Corredor', estado: true, fecha_creacion: '2026-10-05' },
    { id: 3, nombre: 'Auditor Compliance', rut: '18.111.222-3', email: 'auditor@nuam.cl', rol: 'Auditor', estado: true, fecha_creacion: '2026-10-10' },
  ]);

  const [bitacoraAdmin, setBitacoraAdmin] = useState([
    {
      idLog: 'LOG-9001',
      fechaHora: '08/11/2026 15:00:12',
      usuarioNombre: 'Administrador TI',
      accion: 'CREACIÓN DE USUARIO',
      valorAntiguo: 'N/A',
      valorNuevo: 'Usuario: Corredor Principal | Rol: Corredor'
    }
  ]);

  // Incluimos password en el estado inicial del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    rut: '',
    email: '',
    password: '',
    rol: 'Corredor'
  });

  const [columnasSII, setColumnasSII] = useState([
    { id: 8, codigo: 'Col 8', nombre: 'RENTAS ATRIBUIDAS (ISFUT)' },
    { id: 9, codigo: 'Col 9', nombre: 'UTILIDADES AFECTAS A IGC O IA' },
    { id: 10, codigo: 'Col 10', nombre: 'RENTAS EXENTAS DE IGC' },
  ]);

  const handleCrearUsuarioSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombreCompleto || !formData.email || !formData.rut || !formData.password) return;

    // Asignación de la contraseña cifrada (simulando hash)
    const nuevoUsuario = {
      id: Date.now(),
      rut: formData.rut,
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      passwordHash: `hash_${formData.password}`, // Contraseña asignada e ingresada
      rol: formData.rol,
      estado: true,
      fecha_creacion: new Date().toISOString().split('T')[0]
    };

    setUsuarios([nuevoUsuario, ...usuarios]);

    const nuevoLog = {
      idLog: `LOG-${Math.floor(Math.random() * 89999 + 10000)}`,
      fechaHora: new Date().toLocaleString('es-CL'),
      usuarioNombre: 'Administrador TI',
      accion: 'CREACIÓN DE CUENTA RBAC',
      valorAntiguo: 'N/A',
      valorNuevo: `Creación exitosa de ${nuevoUsuario.nombreCompleto} [Rol: ${nuevoUsuario.rol}] con credenciales asignadas`
    };
    setBitacoraAdmin([nuevoLog, ...bitacoraAdmin]);

    // Limpiar formulario
    setFormData({ nombreCompleto: '', rut: '', email: '', password: '', rol: 'Corredor' });
    alert("Usuario creado con su contraseña y rol asignados correctamente. Registro guardado en la bitácora.");
  };

  const handleDesactivarUsuario = (id) => {
    setUsuarios(usuarios.map(u => {
      if (u.id === id) {
        const nuevoEstado = !u.estado;
        setBitacoraAdmin([{
          idLog: `LOG-${Math.floor(Math.random() * 89999 + 10000)}`,
          fechaHora: new Date().toLocaleString('es-CL'),
          usuarioNombre: 'Administrador TI',
          accion: 'CAMBIO DE ESTADO',
          valorAntiguo: `Estado previo: ${u.estado ? 'Activo' : 'Inactivo'}`,
          valorNuevo: `Nuevo estado para ${u.nombreCompleto}: ${nuevoEstado ? 'Activo' : 'Inactivo'}`
        }, ...bitacoraAdmin]);

        return { ...u, estado: nuevoEstado };
      }
      return u;
    }));
  };

  return (
    <div className="min-vh-100 bg-light">
      <header className="bg-dark text-white shadow-sm mb-4">
        <div className="container py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-naranja rounded-3 d-flex align-items-center justify-content-center font-weight-bold fs-4 text-white shadow-sm" style={{ width: '42px', height: '42px' }}>
              TI
            </div>
            <div>
              <h1 className="h4 mb-0 font-weight-bold">Consola de Administración</h1>
              <small className="text-white-50">Control de Seguridad ISO 27001, RBAC y Base de Datos</small>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-danger py-2 px-3">Administrador TI</span>
            <button onClick={onLogout} className="btn btn-outline-light btn-sm">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container pb-5">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white py-0 border-0">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link py-3 px-4 fw-bold ${activeTab === 'usuarios' ? 'active text-naranja border-bottom border-naranja border-3' : 'text-secondary'}`}
                  onClick={() => setActiveTab('usuarios')}
                >
                  👤 Gestión de Usuarios (HU-07)
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link py-3 px-4 fw-bold ${activeTab === 'auditoria' ? 'active text-naranja border-bottom border-naranja border-3' : 'text-secondary'}`}
                  onClick={() => setActiveTab('auditoria')}
                >
                  📋 Bitácora de Creación
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link py-3 px-4 fw-bold ${activeTab === 'homologacion' ? 'active text-naranja border-bottom border-naranja border-3' : 'text-secondary'}`}
                  onClick={() => setActiveTab('homologacion')}
                >
                  📑 Homologación Columnas SII
                </button>
              </li>
            </ul>
          </div>
          
          <div className="card-body p-4">
            {activeTab === 'usuarios' && (
              <div className="row g-4">
                <div className="col-md-7">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="font-weight-bold text-dark mb-0">Usuarios Registrados en el Sistema</h6>
                    <span className="badge bg-success">Modelo: Usuario_sistema</span>
                  </div>
                  <div className="table-responsive border rounded bg-white">
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: '12px' }}>
                      <thead className="table-secondary">
                        <tr>
                          <th>Nombre Completo</th>
                          <th>RUT</th>
                          <th>Email</th>
                          <th>Rol (RBAC)</th>
                          <th>Estado</th>
                          <th className="text-center">Acción TI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((u) => (
                          <tr key={u.id}>
                            <td className="fw-bold">{u.nombreCompleto}</td>
                            <td className="font-monospace">{u.rut}</td>
                            <td className="text-muted">{u.email}</td>
                            <td>
                              <span className={`badge ${u.rol === 'Administrador' ? 'bg-dark' : u.rol === 'Corredor' ? 'bg-primary' : 'bg-secondary'}`}>
                                {u.rol}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${u.estado ? 'bg-success' : 'bg-danger'}`}>
                                {u.estado ? 'Activo' : 'Desactivado'}
                              </span>
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => handleDesactivarUsuario(u.id)}
                                className={`btn btn-sm py-0 px-2 ${u.estado ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                style={{ fontSize: '11px' }}
                              >
                                {u.estado ? 'Desactivar' : 'Activar'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="card bg-light border-0 p-4 rounded-3 shadow-sm">
                    <h6 className="fw-bold text-dark mb-2">Crear Nuevo Usuario (HU-07)</h6>
                    <small className="text-muted mb-3 d-block">Asigna contraseña y rol de seguridad (ISO 27001).</small>
                    
                    <form onSubmit={handleCrearUsuarioSubmit}>
                      <div className="mb-2">
                        <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={formData.nombreCompleto}
                          onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                          required
                          placeholder="Ej. Carlos Mendoza"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small fw-bold text-muted">RUT</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={formData.rut}
                          onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                          required
                          placeholder="Ej. 16.789.432-1"
                        />
                      </div>

                      <div className="mb-2">
                        <label className="form-label small fw-bold text-muted">Correo Electrónico</label>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="Ej. cmendoza@nuam.cl"
                        />
                      </div>

                      {/* CAMPO DE CONTRASEÑA AÑADIDO */}
                      <div className="mb-2">
                        <label className="form-label small fw-bold text-muted">Contraseña Temporal / Inicial</label>
                        <input
                          type="password"
                          className="form-control form-control-sm"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          placeholder="Ej. Pass123*"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">Rol Asignado (RBAC)</label>
                        <select
                          className="form-select form-select-sm fw-bold"
                          value={formData.rol}
                          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                        >
                          <option value="Corredor">Corredor de Bolsa</option>
                          <option value="Auditor">Auditor de Compliance</option>
                          <option value="Administrador">Administrador de TI</option>
                        </select>
                      </div>

                      <button type="submit" className="btn btn-naranja btn-sm w-100 fw-bold py-2 shadow-sm">
                        Crear Usuario y Asignar Credenciales
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'auditoria' && (
              <div>
                <h6 className="fw-bold text-dark mb-2">Bitácora Inalterable de Creación de Cuentas</h6>
                <div className="table-responsive border rounded bg-white">
                  <table className="table table-sm table-striped mb-0 align-middle" style={{ fontSize: '11px' }}>
                    <thead className="table-secondary">
                      <tr>
                        <th>ID Log</th>
                        <th>Fecha y Hora</th>
                        <th>Administrador Responsable</th>
                        <th>Acción</th>
                        <th>Valor Antiguo</th>
                        <th>Valor Nuevo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bitacoraAdmin.map((log, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold font-monospace">{log.idLog}</td>
                          <td className="font-monospace">{log.fechaHora}</td>
                          <td>{log.usuarioNombre}</td>
                          <td><span className="badge bg-success">{log.accion}</span></td>
                          <td className="text-muted font-monospace">{log.valorAntiguo}</td>
                          <td className="fw-bold font-monospace text-dark">{log.valorNuevo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'homologacion' && (
              <div>
                <h6 className="fw-bold text-dark mb-2">Homologación y Adaptación a Certificados del SII</h6>
                <div className="row g-3">
                  {columnasSII.map((c, idx) => (
                    <div className="col-md-4" key={c.id}>
                      <div className="p-3 border rounded bg-white">
                        <span className="badge bg-secondary mb-2">{c.codigo}</span>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={c.nombre}
                          onChange={(e) => {
                            const actualizadas = [...columnasSII];
                            actualizadas[idx].nombre = e.target.value;
                            setColumnasSII(actualizadas);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-end">
                  <button className="btn btn-naranja btn-sm px-4 fw-bold" onClick={() => alert("Plantilla tributaria del SII actualizada correctamente.")}>
                    Guardar Plantilla Tributaria
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}