import React, { useState } from 'react';

export default function ManualEntryModal({ isOpen, onClose, onAddManualRow, currentEjercicio, currentMercado }) {
  const [formData, setFormData] = useState({
    instrumento: '',
    dividendo: 0,
    fecha_pago: '',
    valor_historico: '',
    descripcion: '',
    isfut: false,
    factor_actualizacion: 0,
    secuencia_evento: 10001 // Valor inicial superior a 10000 por defecto
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que la secuencia sea mayor a 10000 según la regla de negocio
    if (Number(formData.secuencia_evento) <= 10000) {
      alert("La secuencia de evento para activos manuales debe ser un valor superior a 10000.");
      return;
    }

    // Construir el nuevo registro heredando ejercicio y mercado del mantenedor
    const nuevaFila = {
      id: Date.now(),
      ejercicio: currentEjercicio || 2026,
      mercado: currentMercado || 'Acciones',
      instrumento: formData.instrumento,
      fecha_pago: formData.fecha_pago || '-',
      descripcion: formData.descripcion || 'Ingreso Manual',
      secuencia_evento: Number(formData.secuencia_evento),
      isfut_isift: formData.isfut ? 'ISFUT' : 'N/A',
      origen: 'Manual',
      factor_actualizacion: Number(formData.factor_actualizacion) || 0,
      factores_8_37: `Dividendo: ${formData.dividendo}, Val. Hist: ${formData.valor_historico || 0}`,
      fuente_ingreso: 'Manual'
    };

    onAddManualRow(nuevaFila);
    onClose();
  };

  return (
    <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-3">
          <div className="modal-header bg-dark text-white py-3">
            <h5 className="modal-title h6 font-weight-bold">Ingreso Manual de Calificación (Activo No Inscrito)</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="alert alert-secondary py-2 small mb-3">
                <span><strong>Mercado Heredado:</strong> {currentMercado || 'General'}</span> | &nbsp;
                <span><strong>Ejercicio Heredado:</strong> {currentEjercicio || '2026'}</span>
              </div>

              <div className="row g-3">
                {/* Instrumento */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Instrumento *</label>
                  <input
                    type="text"
                    name="instrumento"
                    required
                    placeholder="Ej. ACTIVO_NO_INSCRITO_X"
                    value={formData.instrumento}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                </div>

                {/* Secuencia de Evento (> 10000) */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Secuencia de Evento (&gt; 10000) *</label>
                  <input
                    type="number"
                    name="secuencia_evento"
                    required
                    min="10001"
                    value={formData.secuencia_evento}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                  <small className="text-muted" style={{ fontSize: '11px' }}>Debe ser estrictamente superior a 10000.</small>
                </div>

                {/* Fecha de pago (Selector de calendario) */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Fecha de Pago</label>
                  <input
                    type="date"
                    name="fecha_pago"
                    value={formData.fecha_pago}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                </div>

                {/* Dividendo (Defecto 0) */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Dividendo (Defecto 0)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="dividendo"
                    value={formData.dividendo}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                </div>

                {/* Valor Histórico */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Valor Histórico</label>
                  <input
                    type="number"
                    step="0.01"
                    name="valor_historico"
                    placeholder="Ej. 150000"
                    value={formData.valor_historico}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                </div>

                {/* Factor de Actualización (Defecto 0) */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Factor de Actualización (Defecto 0)</label>
                  <input
                    type="number"
                    step="0.001"
                    name="factor_actualizacion"
                    value={formData.factor_actualizacion}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                </div>

                {/* Descripción */}
                <div className="col-12">
                  <label className="form-label small fw-bold text-muted">Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Detalle o notas del activo no centralizado"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="form-control form-control-sm"
                  />
                </div>

                {/* Checkbox ISFUT */}
                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="isfut"
                      id="isfutCheck"
                      checked={formData.isfut}
                      onChange={handleChange}
                      className="form-check-input"
                    />
                    <label className="form-check-label small fw-bold text-dark" htmlFor="isfutCheck">
                      Aplica régimen ISFUT
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light py-2">
              <button type="button" className="btn btn-outline-secondary btn-sm px-4" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-naranja btn-sm px-4">
                OK
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}