import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#f87171', '#a78bfa'];

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
        alert('Invalid JSON file');
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

  const getTopLessons = (dataset, program = null) => {
    return dataset
      .filter(u => (program ? u.Program === program : true))
      .sort((a, b) => b['Lessons Completed'] - a['Lessons Completed'])
      .slice(0, 5)
      .map(u => ({ name: u.Name, value: u['Lessons Completed'] }));
  };

  const charts = [
    { title: 'Top 5 Users by Lessons', data: getTopLessons(data) },
    { title: 'Top 5 in XPORT1-MX', data: getTopLessons(data, 'XPORT1-MX') },
    { title: 'Top 5 in XPORT2-MX', data: getTopLessons(data, 'XPORT2-MX') },
    { title: 'Top 5 in MXEPAMGOOGLE', data: getTopLessons(data, 'MXEPAMGOOGLE') },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col justify-between">
      <div>
        <header className="bg-blue-800 p-6 rounded-md shadow mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">License Usage - KodeKloud</h1>
          <div className="text-sm text-white">Last updated: {new Date().toLocaleDateString()}</div>
        </header>

        <section className="bg-gray-800 p-6 rounded-md shadow mb-6">
          <p className="text-xl mb-4">
            Active licenses in use:{' '}
            <span className="font-bold text-green-400">{activeCount}</span> / {licenseLimit}
          </p>
          <div className="space-x-2 mb-2 flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className="bg-white text-gray-900 px-3 py-1 rounded hover:bg-blue-200">All</button>
            <button onClick={() => setFilter('active')} className="bg-white text-gray-900 px-3 py-1 rounded hover:bg-blue-200">Active</button>
            <button onClick={() => setFilter('inactive')} className="bg-white text-gray-900 px-3 py-1 rounded hover:bg-blue-200">Inactive</button>
            <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Export to Excel</button>
            <label className="bg-yellow-500 text-black px-3 py-1 rounded cursor-pointer">
              Upload JSON
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-black px-2 py-1 rounded"
            />
            <label>Sort by:</label>
            <select onChange={e => setSortKey(e.target.value)} className="text-black px-2 py-1 rounded">
              <option value="Video Hours Watched">Video Hours</option>
              <option value="Name">Name</option>
              <option value="Program">Program</option>
            </select>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {charts.map((chart, index) => (
            <section key={index} className="bg-gray-800 p-6 rounded-md shadow">
              <h2 className="text-lg font-bold mb-4">{chart.title}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chart.data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={150} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </section>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-600">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Lessons</th>
                <th className="px-4 py-2">Video Hours</th>
                <th className="px-4 py-2">Labs</th>
                <th className="px-4 py-2">Program</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Status</th>
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

      <footer className="text-center mt-8 p-4 text-sm text-gray-400 border-t border-gray-700">
        Portal created by Luis Alvarez (luis_alvarez1@epam.com)
      </footer>
    </div>
  );
}
