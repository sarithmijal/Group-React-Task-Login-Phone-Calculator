# Login + Suma + Calculadora (React + API REST)

Aplicación en **React + Vite** con tres pantallas (login, suma de dos números y calculadora) que consumen una **API REST en Node.js + Express**.

La navegación entre pantallas se simula con renderizado condicional (`useState`), sin librería de rutas.

## Estructura

```
├── src/                     # Frontend (React + Vite)
│   ├── api.js               # Cliente de la API (fetch)
│   ├── App.jsx              # Controla la vista actual y la sesión
│   └── components/
│       ├── Login.jsx
│       ├── Menu.jsx
│       ├── Sum.jsx
│       └── Calculator.jsx
└── server/                  # Backend (API REST con Express)
    ├── src/
    │   ├── index.js         # Arranca el servidor (puerto 3001)
    │   ├── app.js           # Rutas / endpoints
    │   ├── auth.js          # Login, tokens y middleware requireAuth
    │   └── calculator.js    # Suma y evaluador seguro de expresiones
    ├── test/                # Pruebas (node --test)
    └── api.http             # Peticiones de ejemplo (REST Client / Postman)
```

## Cómo ejecutarlo

Se necesitan **dos terminales**.

**1. Backend (API)**

```bash
cd server
npm install
npm start          # http://localhost:3001
```

**2. Frontend**

```bash
npm install
npm run dev        # http://localhost:5173
```

Vite redirige las llamadas a `/api` hacia `http://localhost:3001` (ver `vite.config.js`).

**Credenciales de prueba:** usuario `admin`, contraseña `1234`. Se pueden cambiar con las variables de entorno `API_USER` y `API_PASSWORD`.

## Endpoints

Base: `http://localhost:3001/api`

| Método | Ruta         | Requiere token | Body (JSON)                         | Respuesta OK                              |
|--------|--------------|----------------|-------------------------------------|-------------------------------------------|
| GET    | `/health`    | No             | —                                   | `{ ok: true, mensaje }`                   |
| POST   | `/login`     | No             | `{ "username", "password" }`        | `{ ok: true, token, username }`           |
| POST   | `/logout`    | Sí             | —                                   | `{ ok: true }`                            |
| POST   | `/sum`       | Sí             | `{ "num1": 5, "num2": 7 }`          | `{ ok: true, resultado: 12 }`             |
| POST   | `/calculate` | Sí             | `{ "expresion": "(2+3)*4" }`        | `{ ok: true, expresion, resultado: 20 }`  |

Las rutas protegidas reciben el token en la cabecera `Authorization: Bearer <token>`.

**Códigos de error**

- `400`: faltan datos, no son números, la expresión es inválida o hay una división para cero.
- `401`: credenciales incorrectas, o falta el token o ya no es válido.
- `404`: la ruta no existe.

Todas las respuestas de error tienen la forma `{ ok: false, error: "mensaje" }`.

### Ejemplo con curl

```bash
# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"1234"}'

# Suma (reemplaza TOKEN)
curl -X POST http://localhost:3001/api/sum \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"num1":5,"num2":7}'
```

## Pruebas del backend

```bash
cd server
npm test
```

## Notas

- Las sesiones se guardan en memoria: al reiniciar el servidor hay que volver a iniciar sesión.
- La calculadora **no usa `eval`**. El servidor tiene un parser propio que solo acepta números, `+ - * /`, paréntesis y negativos.
