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
        }
      })
      .catch(err => {
        console.error('❌ Error al consultar /.auth/me:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center p-6">⏳ Verificando autenticación...</p>;
  }

  if (!user) {
    return <AuthDebug rawData={rawAuth} />;
  }

  return <KodeKloudDashboard user={user} />;
}
