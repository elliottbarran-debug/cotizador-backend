import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 3000;

// 🚀 Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// 🧪 Verificar conexión DB
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error DB:', err);
  } else {
    console.log('DB conectada:', res.rows);
  }
});