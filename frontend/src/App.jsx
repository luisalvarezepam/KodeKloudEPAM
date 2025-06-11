import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KodeKloudDashboard from './KodeKloudDashboard';
import SignedOut from './SignedOut';

function RequireAuth({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.clientPrincipal || null);
      })
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <p className="p-6 text-center">⏳ Verificando autenticación...</p>;

  if (!user) return <p className="text-center p-6 text-red-600">❌ No autenticado</p>;

  return children({ user });
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signed-out" element={<SignedOut />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              {({ user }) => <KodeKloudDashboard user={user} />}
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
