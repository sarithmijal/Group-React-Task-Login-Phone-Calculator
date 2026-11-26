import { crearApp } from './app.js';

const PORT = process.env.PORT || 3001;

crearApp().listen(PORT, () => {
  console.log(`API REST escuchando en http://localhost:${PORT}`);
});
