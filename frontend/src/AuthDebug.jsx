import { useEffect, useState } from 'react';

export default function AuthDebug() {
  const [authInfo, setAuthInfo] = useState(null);

  useEffect(() => {
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        console.log('🔐 Datos de autenticación:', data);
        setAuthInfo(data);
      })
      .catch(err => {
        console.error('❌ Error al consultar /.auth/me:', err);
      });
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow mt-10 text-gray-800">
      <h2 className="text-xl font-semibold mb-4">🔍 Depuración de autenticación</h2>
      <p className="mb-4 text-gray-600">
        Este es el contenido crudo devuelto por <code>/.auth/me</code>.
      </p>
      <pre className="bg-gray-100 text-sm p-4 rounded overflow-auto">
        {authInfo ? JSON.stringify(authInfo, null, 2) : 'Cargando...'}
      </pre>
      <div className="mt-6 text-center">
        <a
          href="/.auth/login/aad"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Iniciar sesión con Microsoft
        </a>
      </div>
    </div>
  );
}
