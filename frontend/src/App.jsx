import React, { useState } from 'react';
import TaxDataGrid from './components/TaxDataGrid';
import CsvUploadModal from './components/CsvUploadModal';

export default function App() {
const [isModalOpen, setIsModalOpen] = useState(false);
const [dataGridRows, setDataGridRows] = useState([
    { id: 1, rut: '76.123.456-K', categoria: 'Primera Categoría', monto: 1250000, factor: 1.15 },
    { id: 2, rut: '77.987.654-3', categoria: 'Segunda Categoría', monto: 850000, factor: 1.05 },
]);

const handleDataLoaded = (newRows) => {
    setDataGridRows(newRows);
};

return (
    <div className="min-h-screen bg-gray-100 p-8">
    <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
        <h1 className="text-3xl font-bold text-gray-900">Módulo DJ1948 - Prototipo Tributario</h1>
        <p className="text-gray-600">Visualización de grilla de datos y gestión de factores.</p>
        </div>
        <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-medium"
        >
        + Cargar CSV
        </button>
    </header>

    <main className="max-w-7xl mx-auto">
        <TaxDataGrid rows={dataGridRows} />
    </main>

    <CsvUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDataLoaded={handleDataLoaded}
    />
    </div>
);
}