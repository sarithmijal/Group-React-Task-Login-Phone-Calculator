import { useState } from 'react';
import { api } from '../api';

export default function Sum({ token, onVolver, onSesionExpirada }) {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSumar = async () => {
    setError('');
    setCargando(true);
    try {
      const data = await api.sum(token, num1, num2);
      setResultado(data.resultado);
    } catch (err) {
      if (err.message.startsWith('No autorizado')) return onSesionExpirada();
      setResultado(null);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="columna">
      <h2>Suma Rápida</h2>
      <input
        type="number"
        placeholder="NUM1"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
      />
      <input
        type="number"
        placeholder="NUM2"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
      />
      <button onClick={handleSumar} disabled={cargando}>
        {cargando ? 'Calculando…' : 'Calcular'}
      </button>
      {error && <div className="mensaje-error">{error}</div>}
      <div className="resultado">
        Resultado: <strong>{resultado !== null ? resultado : '—'}</strong>
      </div>
      <button className="btn-secundario" onClick={onVolver}>
        Volver
      </button>
    </div>
  );
}
