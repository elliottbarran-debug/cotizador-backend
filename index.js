import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get('/', (req, res) => {
  res.send('API OK');
});

// calcular cotización
app.post('/api/cotizaciones', (req, res) => {
  try {
    const { items } = req.body;

    let subtotal = 0;

    items.forEach(item => {
      subtotal += item.cantidad * item.precio;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    res.json({ subtotal, iva, total });

  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor activo');
});