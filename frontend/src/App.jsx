import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KodeKloudDashboard from './KodeKloudDashboard';
import SignedOut from './SignedOut';

export default function App() {
  const [user, setUser] = useState(null); // ✅ Necesario
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal); // ✅ Este objeto se pasa a KodeKloudDashboard
        }
      })
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <p className="p-6 text-center">Cargando autenticación...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/signed-out" element={<SignedOut />} />
        <Route path="*" element={<KodeKloudDashboard user={user} />} />
      </Routes>
    </Router>
  );
}
