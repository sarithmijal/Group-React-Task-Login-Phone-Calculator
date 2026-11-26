// Cliente de la API REST.
// En desarrollo, Vite redirige /api -> http://localhost:3001 (ver vite.config.js).
// Si la API está en otra URL, define VITE_API_URL en un archivo .env.local.
const BASE_URL = (import.meta.env.VITE_API_URL || '') + '/api';

async function request(ruta, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE_URL + ruta, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con la API. ¿Está corriendo el servidor?');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}`);
  }
  return data;
}

export const api = {
  login: (username, password) =>
    request('/login', { method: 'POST', body: { username, password } }),

  logout: (token) => request('/logout', { method: 'POST', token }),

  sum: (token, num1, num2) =>
    request('/sum', { method: 'POST', token, body: { num1, num2 } }),

  calculate: (token, expresion) =>
    request('/calculate', { method: 'POST', token, body: { expresion } }),
};
