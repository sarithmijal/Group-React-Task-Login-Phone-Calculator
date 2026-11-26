import { useState } from 'react';
import './App.css';
import { api } from './api';
import Login from './components/Login';
import Menu from './components/Menu';
import Sum from './components/Sum';
import Calculator from './components/Calculator';

export default function App() {
  // Navegación simulada: 'login' | 'menu' | 'sum' | 'calculator'
  const [vista, setVista] = useState('login');
  // Sesión devuelta por la API al hacer login
  const [sesion, setSesion] = useState(null); // { token, username }

  const handleLogin = (token, username) => {
    setSesion({ token, username });
    setVista('menu');
  };

  const cerrarSesion = () => {
    setSesion(null);
    setVista('login');
  };

  const handleSalir = async () => {
    try {
      await api.logout(sesion.token);
    } catch {
      // Aunque falle la API, cerramos la sesión en el front.
    }
    cerrarSesion();
  };

  const volverAlMenu = () => setVista('menu');

  return (
    <div className="contenedor">
      <div className="tarjeta">
        {vista === 'login' && <Login onLogin={handleLogin} />}

        {vista === 'menu' && sesion && (
          <Menu username={sesion.username} onNavegar={setVista} onSalir={handleSalir} />
        )}

        {vista === 'sum' && sesion && (
          <Sum token={sesion.token} onVolver={volverAlMenu} onSesionExpirada={cerrarSesion} />
        )}

        {vista === 'calculator' && sesion && (
          <Calculator token={sesion.token} onVolver={volverAlMenu} onSesionExpirada={cerrarSesion} />
        )}
      </div>
    </div>
  );
}
