import React, { useState } from 'react';
import SiiFactorsModal from './SiiFactorsModal';

export default function TaxDataGrid({ rows, onDeleteRow, onUpdateRow, isAuditor }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSiiModalOpen, setIsSiiModalOpen] = useState(false);
  
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenSiiModal = (row) => {
    setSelectedRow(row);
    setIsSiiModalOpen(true);
  };

  const handleSaveSiiFactors = (siiData) => {
    onUpdateRow(siiData);
    alert(`Registro actualizado exitosamente. Última modificación registrada: ${siiData.ultimaModificacion}`);
  };

  const handleOpenDeleteModal = (row) => {
    setRowToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete) {
      onDeleteRow(rowToDelete.id, rowToDelete);
      setIsDeleteModalOpen(false);
      setRowToDelete(null);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
      <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0 h6 font-weight-bold text-dark">Grilla de Calificaciones Tributarias</h5>
          <small className="text-muted">
            {isAuditor ? 'Vista de Compliance (Solo Lectura)' : 'Visualización, modificación y eliminación de registros'}
          </small>
        </div>
        <span className="badge bg-light text-dark border">
          {rows.length} registros
        </span>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 text-sm">
          <thead className="table-dark text-uppercase small">
            <tr>
              <th scope="col" className="px-3">Ejercicio</th>
              <th scope="col" className="px-3">Instrumento</th>
              <th scope="col" className="px-3">Fecha de pago</th>
              <th scope="col" className="px-3">Descripción</th>
              <th scope="col" className="px-3 text-center">Secuencia</th>
              <th scope="col" className="px-3">ISFUT/ISIFT</th>
              <th scope="col" className="px-3">Origen</th>
              <th scope="col" className="px-3">Fuente (Origen)</th>
              <th scope="col" className="px-3">Última Modificación</th>
              <th scope="col" className="px-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? (
              rows.map((row, index) => (
                <tr key={row.id || index}>
                  <td className="px-3 font-weight-bold">{row.ejercicio}</td>
                  <td className="px-3 font-weight-bold text-naranja">{row.instrumento}</td>
                  <td className="px-3 text-secondary">{row.fecha_pago || '-'}</td>
                  <td className="px-3 text-secondary">{row.descripcion || '-'}</td>
                  <td className="px-3 text-center">{row.secuencia_evento}</td>
                  <td className="px-3">
                    <span className="badge bg-light text-dark border">
                      {row.isfut_isift || '-'}
                    </span>
                  </td>
                  <td className="px-3">
                    <span className="badge bg-warning text-dark">
                      {row.origen || 'Acciones'}
                    </span>
                  </td>
                  {/* Visualización explícita de la columna de origen requerida por HU-06 */}
                  <td className="px-3">
                    <span className={`badge ${
                      row.fuente_ingreso === 'Manual' ? 'bg-info text-dark' :
                      row.fuente_ingreso?.includes('Actualizado') ? 'bg-warning text-dark' :
                      'bg-success'
                    }`}>
                      {row.fuente_ingreso || 'Carga'}
                    </span>
                  </td>
                  <td className="px-3 font-monospace small text-muted">
                    {row.ultimaModificacion || 'Original'}
                  </td>
                  <td className="px-3 text-center">
                    {isAuditor ? (
                      <span className="badge bg-secondary text-white" style={{ fontSize: '10px' }}>
                        🔒 Solo Lectura
                      </span>
                    ) : (
                      <div className="d-flex gap-1 justify-content-center">
                        <button 
                          onClick={() => handleOpenSiiModal(row)}
                          className="btn btn-outline-dark btn-sm py-0 px-2"
                          style={{ fontSize: '11px' }}
                        >
                          Modificar
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(row)}
                          className="btn btn-outline-danger btn-sm py-0 px-2"
                          style={{ fontSize: '11px' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-5 text-muted">
                  No hay registros disponibles en la base de datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SiiFactorsModal
        isOpen={isSiiModalOpen}
        onClose={() => setIsSiiModalOpen(false)}
        onSave={handleSaveSiiFactors}
        rowData={selectedRow}
      />

      {isDeleteModalOpen && (
        <div className="modal show d-block fade" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-danger text-white py-2">
                <h5 className="modal-title h6 font-weight-bold">Confirmar Eliminación de Registro</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsDeleteModalOpen(false)}></button>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="mb-2">¿Está seguro de que desea eliminar la calificación del instrumento?</p>
                <div className="p-2 bg-light rounded border mb-2">
                  <strong className="text-dark">{rowToDelete?.instrumento}</strong> <br />
                  <small className="text-muted">Ejercicio: {rowToDelete?.ejercicio}</small>
                </div>
                <small className="text-danger">Esta acción corregirá inconsistencias y eliminará el registro de la base de datos.</small>
              </div>
              <div className="modal-footer bg-light py-2">
                <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger btn-sm px-3" onClick={handleConfirmDelete}>
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}