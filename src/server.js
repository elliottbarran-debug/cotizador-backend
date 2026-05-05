import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 3000;

// 🚀 Servidor listo para Railway (IMPORTANTE host 0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// 🧪 Verificar conexión a la base de datos
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error DB:', err);
  } else {
    console.log('DB conectada correctamente:', res.rows);
  }
});