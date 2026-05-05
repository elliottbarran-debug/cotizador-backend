import app from './app.js';
import { pool } from './config/db.js';

const PORT = 3000;

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error DB:', err);
  } else {
    console.log('DB conectada:', res.rows);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});