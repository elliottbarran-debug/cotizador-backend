import app from './app.js';
import { pool } from './config/db.js';
import cors from 'cors';

app.use(cors({
  origin: '*'
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});

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