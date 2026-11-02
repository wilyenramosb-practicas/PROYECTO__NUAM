export default function TaxDataGrid({ rows = [] }) {
  // Ya no necesitas la variable de estado "data" interna, usa directamente "rows"
return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 my-6">
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Registros Tributarios</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
        Total registros: {rows.length}
        </span>
    </div>

    <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT / Identificación</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto ($)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor Aplicado</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.rut}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.categoria}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${row.monto ? row.monto.toLocaleString('es-CL') : '0'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{row.factor}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
);
}