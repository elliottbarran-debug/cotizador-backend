import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// ?? RUTA RAÍZ
app.get('/', (req, res) => {
  res.send('OK');
});

// ?? TEST
app.get('/test', (req, res) => {
  res.send('TEST OK');
});

// ?? API SIMPLE (SIN DB, SIN PDF)
app.post('/api/cotizaciones', (req, res) => {
  try {
    const { items } = req.body;

    let subtotal = 0;

    items.forEach(item => {
      subtotal += item.cantidad * item.precio;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    res.json({ ok: true, total });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;