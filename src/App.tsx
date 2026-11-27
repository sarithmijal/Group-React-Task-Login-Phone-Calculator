import { useState } from 'react';
import './App.css';
import FormScreen from './FormScreen.tsx';

// Union type restricting the active screen state to valid view names.
type ViewName = 'login' | 'menu' | 'sum' | 'calculator' | 'form';

export default function App() {
  // Controla la pantalla actual: 'login' | 'menu' | 'sum' | 'calculator' | 'form'
  const [vista, setVista] = useState<ViewName>('login');

  // Estados para Login
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Estados para Sum
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [resultado, setResultado] = useState<number | string | null>(null);

  // Estado para Calculator
  const [pantalla, setPantalla] = useState<string>('');

  const handleSumar = (): void => {
    const suma = Number(num1) + Number(num2);
    setResultado(isNaN(suma) ? 'Error' : suma);
  };

  const handleCalcClick = (valor: string): void => {
    if (valor === 'C') {
      setPantalla('');
      return;
    }
    if (valor === '=') {
      try {
        if (!/^[0-9+\-*/.]+$/.test(pantalla)) return;
        const res = Function(`"use strict"; return (${pantalla})`)() as number;
        setPantalla(String(res));
      } catch {
        setPantalla('Error');
      }
      return;
    }
    setPantalla((prev) => (prev === 'Error' ? valor : prev + valor));
  };

  const botonesCalc: string[] = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="contenedor">
      {vista === 'form' ? (
        <FormScreen onBack={() => setVista('menu')} />
      ) : (
        <div className="tarjeta">
          {/* 1. PANTALLA LOGIN */}
          {vista === 'login' && (
            <div className="columna">
              <h2>Iniciar Sesión</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={() => setVista('menu')}>Ingresar</button>
            </div>
          )}

          {/* 2. PANTALLA MENÚ */}
          {vista === 'menu' && (
            <div className="columna">
              <h2>Menú Principal</h2>
              <button onClick={() => setVista('sum')}>Sum</button>
              <button onClick={() => setVista('calculator')}>Calculator</button>
              <button onClick={() => setVista('form')}>Form</button>
              <button className="btn-secundario" onClick={() => setVista('login')}>
                Salir
              </button>
            </div>
          )}

          {/* 3. PANTALLA SUM */}
          {vista === 'sum' && (
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
              <button onClick={handleSumar}>Calcular</button>
              <div className="resultado">
                Resultado: <strong>{resultado !== null ? resultado : '—'}</strong>
              </div>
              <button className="btn-secundario" onClick={() => setVista('menu')}>
                Volver
              </button>
            </div>
          )}

          {/* 4. PANTALLA CALCULATOR */}
          {vista === 'calculator' && (
            <div className="columna">
              <h2>Calculadora</h2>
              <input
                type="text"
                className="calc-display"
                value={pantalla}
                readOnly
                placeholder="0"
              />
              <div className="calc-grid">
                {botonesCalc.map((btn) => (
                  <button key={btn} onClick={() => handleCalcClick(btn)}>
                    {btn}
                  </button>
                ))}
              </div>
              <button className="btn-limpiar" onClick={() => handleCalcClick('C')}>
                C (Limpiar)
              </button>
              <button className="btn-secundario" onClick={() => setVista('menu')}>
                Volver
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
