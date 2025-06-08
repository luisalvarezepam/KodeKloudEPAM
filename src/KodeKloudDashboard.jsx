import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export default function KodeKloudDashboard() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortKey, setSortKey] = useState('Video Hours Watched');
  const [search, setSearch] = useState('');
  const licenseLimit = 40;

  useEffect(() => {
    fetch('/data/kodekloud_data.json')
      .then(res => res.json())
      .then(setData);
  }, []);

  const normalize = val => String(val).trim().toLowerCase();
  const isActive = user => normalize(user['License Accepted']) === '✓';

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result);
        setData(json);
      } catch (err) {
        alert('Archivo JSON inválido');
      }
    };
    reader.readAsText(file);
  };

  const sorted = [...data].sort((a, b) => {
    if (sortKey === 'Name' || sortKey === 'Program') {
      return String(a[sortKey]).localeCompare(String(b[sortKey]));
    }
    return (b[sortKey] || 0) - (a[sortKey] || 0);
  });

  const filtered = sorted.filter(user => {
    const noActivity = user['Lessons Completed'] === 0 && user['Video Hours Watched'] === 0 && user['Labs Completed'] === 0;
    if (filter === 'active' && !isActive(user)) return false;
    if (filter === 'inactive' && isActive(user) && !noActivity) return false;
    if (search && !user.Name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = data.filter(isActive).length;

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usage');
    XLSX.writeFile(wb, 'kodekloud_usage.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="bg-blue-800 p-6 rounded-md shadow mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Uso de Licencias - KodeKloud</h1>
        <div className="text-sm text-white">Última actualización: {new Date().toLocaleDateString()}</div>
      </header>

      <section className="bg-gray-800 p-6 rounded-md shadow mb-6">
        <p className="text-xl mb-4">
          Licencias activas en uso:{' '}
          <span className="font-bold text-green-400">{activeCount}</span> / {licenseLimit}
        </p>
        <div className="space-x-2 mb-2 flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')} className="bg-white text-gray-900 px-3 py-1 rounded hover:bg-blue-200">Todos</button>
          <button onClick={() => setFilter('active')} className="bg-white text-gray-900 px-3 py-1 rounded hover:bg-blue-200">Activos</button>
          <button onClick={() => setFilter('inactive')} className="bg-white text-gray-900 px-3 py-1 rounded hover:bg-blue-200">Inactivos</button>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Exportar a Excel</button>
          <label className="bg-yellow-500 text-black px-3 py-1 rounded cursor-pointer">
            Subir JSON
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-black px-2 py-1 rounded"
          />
          <label>Ordenar por:</label>
          <select onChange={e => setSortKey(e.target.value)} className="text-black px-2 py-1 rounded">
            <option value="Video Hours Watched">Horas Video</option>
            <option value="Name">Nombre</option>
            <option value="Program">Programa</option>
          </select>
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-600">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Lessons</th>
              <th className="px-4 py-2">Horas Video</th>
              <th className="px-4 py-2">Labs</th>
              <th className="px-4 py-2">Programa</th>
              <th className="px-4 py-2">Activo</th>
              <th className="px-4 py-2">Estatus</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const noActivity = u['Lessons Completed'] === 0 && u['Video Hours Watched'] === 0 && u['Labs Completed'] === 0;
              return (
                <tr
                  key={i}
                  className={
                    noActivity
                      ? 'bg-red-100 text-red-900'
                      : !isActive(u)
                      ? 'bg-orange-100 text-orange-900'
                      : i % 2 === 0
                      ? 'bg-gray-800'
                      : 'bg-gray-700'
                  }
                >
                  <td className="px-4 py-2 whitespace-nowrap">{u.Name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{u.Email}</td>
                  <td className="px-4 py-2 text-center">{u['Lessons Completed']}</td>
                  <td className="px-4 py-2 text-center">{u['Video Hours Watched']}</td>
                  <td className="px-4 py-2 text-center">{u['Labs Completed']}</td>
                  <td className="px-4 py-2 text-center">{u.Program}</td>
                  <td className="px-4 py-2 text-center">{isActive(u) ? '✔️' : '❌'}</td>
                  <td className="px-4 py-2 text-center">
                    {noActivity ? 'No activity or progress' : u.Status || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
