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
          window.location.href = '/login';
        }
      });
  }, []);

  if (!user) return null;  // espera redireccionar

  return <KodeKloudDashboard />;
}