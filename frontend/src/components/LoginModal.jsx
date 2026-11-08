import React, { useState } from 'react';

// Base de datos simulada de credenciales corporativas (ISO 27001)
const USUARIOS_AUTORIZADOS = [
  { username: 'admin', password: '1234', nombre: 'Administrador TI', rol: 'Administrador' },
  { username: 'corredor', password: '1234', nombre: 'Corredor Principal', rol: 'Corredor' },
  { username: 'auditor', password: '1234', nombre: 'Auditor de Compliance', rol: 'Auditor' }
];

export default function LoginModal({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Buscar si el usuario y contraseña coinciden
    const encontrado = USUARIOS_AUTORIZADOS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );

    if (encontrado) {
      // Iniciar sesión exitosamente heredando el rol correspondiente
      onLogin({
        nombre: encontrado.nombre,
        rol: encontrado.rol
      });
    } else {
      setError('Credenciales incorrectas. Prueba con: admin / 1234, corredor / 1234, o auditor / 1234');
    }
  };

  return (
    <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: '#0f172a' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-dark text-white py-4 text-center d-block">
            <div className="bg-naranja rounded-3 d-inline-flex align-items-center justify-content-center font-weight-bold fs-3 text-white mb-2 shadow-sm" style={{ width: '50px', height: '50px' }}>
              N
            </div>
            <h4 className="modal-title h5 font-weight-bold mb-0">Módulo DJ1948 - Login</h4>
            <small className="text-white-50">Autenticación Segura Corporativa (ISO 27001)</small>
          </div>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="modal-body p-4 bg-light">
              
              {error && (
                <div className="alert alert-danger py-2 small mb-3">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Nombre de Usuario</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Ej. admin, corredor o auditor"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ej. 1234"
                />
              </div>

              <div className="p-2 bg-white rounded border small text-muted">
                <strong>Credenciales de prueba disponibles:</strong><br />
                • Administrador: <code>admin</code> / <code>1234</code><br />
                • Corredor: <code>corredor</code> / <code>1234</code><br />
                • Auditor: <code>auditor</code> / <code>1234</code>
              </div>
            </div>

            <div className="modal-footer bg-white py-3">
              <button type="submit" className="btn btn-naranja w-100 py-2 fw-bold shadow-sm">
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}