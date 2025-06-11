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
        } else {
          // 🔁 Si no está autenticado, redirige al login
          window.location.href = '/.auth/login/aad';
        }
      })
      .catch(() => {
        // 🔁 Incluso si hay error, redirige
        window.location.href = '/.auth/login/aad';
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-center">Cargando...</p>;

  return <KodeKloudDashboard user={user} />;
}
