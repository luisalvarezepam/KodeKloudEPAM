import { useEffect, useState } from 'react';
import KodeKloudDashboard from './KodeKloudDashboard';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
        } else {
          // Redirige al login de Entra ID directamente
          window.location.href = '/.auth/login/aad';
        }
      })
      .catch(err => {
        console.error('Error fetching auth data', err);
        window.location.href = '/.auth/login/aad';
      });
  }, []);

  if (!user) return null;

  return <KodeKloudDashboard />;
}
