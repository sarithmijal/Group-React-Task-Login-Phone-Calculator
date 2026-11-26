import { randomUUID } from 'node:crypto';

// Credenciales hardcodeadas (como pidió el ingeniero). Se pueden cambiar con
// variables de entorno: API_USER y API_PASSWORD.
const USUARIO = process.env.API_USER || 'admin';
const CONTRASENA = process.env.API_PASSWORD || '1234';

// Sesiones en memoria: se borran al reiniciar el servidor.
const sesiones = new Map(); // token -> username

export function login(username, password) {
  if (username !== USUARIO || password !== CONTRASENA) return null;
  const token = randomUUID();
  sesiones.set(token, username);
  return token;
}

export function logout(token) {
  return sesiones.delete(token);
}

export function usuarioDeToken(token) {
  return sesiones.get(token) ?? null;
}

// Middleware de Express: exige "Authorization: Bearer <token>".
export function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const username = token ? usuarioDeToken(token) : null;
  if (!username) {
    return res.status(401).json({ ok: false, error: 'No autorizado. Inicia sesión primero.' });
  }
  req.token = token;
  req.username = username;
  next();
}
