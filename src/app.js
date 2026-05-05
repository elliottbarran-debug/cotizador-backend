import express from 'express';
import cors from 'cors';
import cotizacionRoutes from './routes/cotizacion.routes.js';

console.log('APP CARGADA');

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 RUTA TEST
app.get('/test', (req, res) => {
  res.send('ruta test OK');
});

// 🔥 RUTA BASE
app.get('/', (req, res) => {
  res.send('FUNCIONA BIEN');
});

// 🔥 API
app.use('/api/cotizaciones', cotizacionRoutes);

export default app;