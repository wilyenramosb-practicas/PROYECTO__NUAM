import React, { useState } from 'react';

export default function CsvUploadModal({ isOpen, onClose, onDataLoaded }) {
const [file, setFile] = useState(null);

if (!isOpen) return null;

const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
    setFile(e.target.files[0]);
    }
};

const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
    const text = e.target.result;
      // Transformar las líneas del CSV a objetos JSON
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    const parsedData = lines.slice(1).map((line, index) => {
        const [rut, categoria, monto, factor] = line.split(',');
        return {
        id: index + 1,
        rut: rut ? rut.trim() : 'N/A',
        categoria: categoria ? categoria.trim() : 'Sin Categoría',
        monto: monto ? Number(monto.trim()) || 0 : 0,
        factor: factor ? Number(factor.trim()) || 1.0 : 1.0,
        };
    });

    onDataLoaded(parsedData);
    onClose();
    };

    reader.readAsText(file);
};

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Cargar Archivo CSV DJ1948</h3>
        
        <p className="text-sm text-gray-600 mb-4">
        Selecciona un archivo `.csv` con las columnas: <br />
        <code className="bg-gray-100 p-1 rounded text-xs">RUT, Categoria, Monto, Factor</code>
        </p>

        <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6 cursor-pointer"
        />

        <div className="flex justify-end space-x-3">
        <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
            Cancelar
        </button>
        <button
            onClick={handleUpload}
            disabled={!file}
            className={`px-4 py-2 text-white rounded-md transition ${
            file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
            }`}
        >
            Procesar CSV
        </button>
        </div>
    </div>
    </div>
);
}