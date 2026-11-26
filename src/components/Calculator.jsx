import { useState } from 'react';
import { api } from '../api';

const BOTONES = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
];

export default function Calculator({ token, onVolver, onSesionExpirada }) {
  const [pantalla, setPantalla] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const calcular = async () => {
    if (!pantalla) return;
    setCargando(true);
    try {
      const data = await api.calculate(token, pantalla);
      setPantalla(String(data.resultado));
    } catch (err) {
      if (err.message.startsWith('No autorizado')) return onSesionExpirada();
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleClick = (valor) => {
    if (valor === '=') return calcular();
    // Si había un error, el siguiente botón empieza de nuevo.
    if (error) {
      setError('');
      setPantalla(valor);
      return;
    }
    setPantalla((prev) => prev + valor);
  };

  const limpiar = () => {
    setPantalla('');
    setError('');
  };

  return (
    <div className="columna">
      <h2>Calculadora</h2>
      <input
        type="text"
        className="calc-display"
        value={error ? 'Error' : pantalla}
        readOnly
        placeholder="0"
      />
      {error && <div className="mensaje-error">{error}</div>}
      <div className="calc-grid">
        {BOTONES.map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)} disabled={cargando}>
            {btn}
          </button>
        ))}
      </div>
      <button className="btn-limpiar" onClick={limpiar}>
        C (Limpiar)
      </button>
      <button className="btn-secundario" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
}
