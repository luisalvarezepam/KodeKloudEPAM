import { useEffect } from 'react';
import KodeKloudDashboard from './KodeKloudDashboard';
import './index.css';

export default function App() {
  useEffect(() => {
    fetch("/.auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.clientPrincipal) {
          window.location.href = "/.auth/login/aad";
        }
      })
      .catch((err) => {
        console.error("Error verifying authentication:", err);
        window.location.href = "/.auth/login/aad";
      });
  }, []);

  return <KodeKloudDashboard />;
}
