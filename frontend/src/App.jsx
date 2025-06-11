import { useEffect, useState } from 'react';
import KodeKloudDashboard from './KodeKloudDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
        }
      })
      .catch(err => {
        console.error('Error fetching auth data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center p-8">Cargando...</p>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
        <div className="bg-white p-8 rounded shadow max-w-md text-center">
          <img
            src="https://www.epam.com/etc.clientlibs/epam/clientlibs/clientlib-base/resources/images/logo.svg"
            alt="EPAM Logo"
            className="mx-auto mb-6 h-10"
          />
          <h1 className="text-2xl font-semibold mb-4">Bienvenido al portal de licencias KodeKloud</h1>
          <p className="mb-6 text-gray-600">
            Este sitio está restringido a usuarios del tenant de EPAM. Si tienes una cuenta autorizada, por favor inicia sesión.
          </p>
          <a
            href="/.auth/login/aad"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Iniciar sesión con Microsoft
          </a>
        </div>
      </div>
    );
  }

  return <KodeKloudDashboard user={user} />;
}
