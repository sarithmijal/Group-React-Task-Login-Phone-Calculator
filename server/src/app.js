import express from 'express';
import { login, logout, requireAuth } from './auth.js';
import { calcular, sumar, CalcError } from './calculator.js';

export function crearApp() {
  const app = express();
  app.use(express.json());

  // CORS sencillo (sin librería) para que el front pueda llamar a la API
  // aunque esté en otro puerto.
  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // Estado de la API
  app.get('/api/health', (req, res) => {
    res.json({ ok: true, mensaje: 'API funcionando' });
  });

  // ---------- Auth ----------
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Usuario y contraseña son obligatorios' });
    }
    const token = login(username, password);
    if (!token) {
      return res.status(401).json({ ok: false, error: 'Usuario o contraseña incorrectos' });
    }
    res.json({ ok: true, token, username });
  });

  app.post('/api/logout', requireAuth, (req, res) => {
    logout(req.token);
    res.json({ ok: true });
  });

  // ---------- Operaciones (requieren token) ----------
  app.post('/api/sum', requireAuth, (req, res) => {
    const { num1, num2 } = req.body ?? {};
    try {
      res.json({ ok: true, resultado: sumar(num1, num2) });
    } catch (err) {
      if (err instanceof CalcError) return res.status(400).json({ ok: false, error: err.message });
      throw err;
    }
  });

  app.post('/api/calculate', requireAuth, (req, res) => {
    const { expresion } = req.body ?? {};
    try {
      res.json({ ok: true, expresion, resultado: calcular(expresion) });
    } catch (err) {
      if (err instanceof CalcError) return res.status(400).json({ ok: false, error: err.message });
      throw err;
    }
  });

  // Ruta no encontrada
  app.use((req, res) => {
    res.status(404).json({ ok: false, error: `No existe ${req.method} ${req.path}` });
  });

  // Errores inesperados (incluye JSON mal formado)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ ok: false, error: 'El cuerpo no es un JSON válido' });
    }
    console.error(err);
    res.status(500).json({ ok: false, error: 'Error interno del servidor' });
  });

  return app;
}
