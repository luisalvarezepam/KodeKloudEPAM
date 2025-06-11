import { useEffect, useState } from 'react';
import KodeKloudDashboard from './KodeKloudDashboard';
import AuthDebug from './AuthDebug';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rawAuth, setRawAuth] = useState(null);

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        console.log('🔐 Resultado de /.auth/me:', data);
        setRawAuth(data);
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
        } else {
          // 🔁 Redirige al login si no hay sesión
          window.location.href = '/.auth/login/aad';
        }
      })
      .catch(err => {
        console.error('❌ Error al consultar /.auth/me:', err);
        window.location.href = '/.auth/login/aad'; // redirige en error también
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center p-6">⏳ Verificando autenticación...</p>;
  }

  return <KodeKloudDashboard user={user} />;
}
