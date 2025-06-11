import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import KodeKloudDashboard from './KodeKloudDashboard';
import SignedOut from './SignedOut';

function RequireAuth({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
        }
      })
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <p className="p-6 text-center">Cargando...</p>;

  if (!user) {
    if (location.pathname !== '/signed-out') {
      window.location.href = '/.auth/login/aad';
    }
    return null;
  }

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
