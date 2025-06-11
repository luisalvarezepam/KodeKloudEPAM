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
          window.location.href = '/.auth/login/aad';
        }
      })
      .catch(err => {
        console.error('Error fetching auth data', err);
        window.location.href = '/.auth/login/aad';
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center p-8">Cargando...</p>;
  if (!user) return null;

  return <KodeKloudDashboard user={user} />;
}
