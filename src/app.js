import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// ? RUTA PRINCIPAL (OBLIGATORIA)
app.get('/', (req, res) => {
  res.send('API funcionando ??');
});

// ? TEST
app.get('/test', (req, res) => {
  res.send('TEST OK');
});

// ? API
app.post('/api/cotizaciones', (req, res) => {
  const { items } = req.body;

  let subtotal = 0;

  items.forEach(item => {
    subtotal += item.cantidad * item.precio;
  });

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  res.json({ total });
});

export default app;