import { Router } from 'express';
import { crearCotizacion } from '../controllers/cotizacion.controller.js';

const router = Router();

// 🔥 TEST (para navegador)
router.get('/', (req, res) => {
  res.send('Ruta cotizaciones OK 🚀');
});

// 🔥 CREAR PDF
router.post('/', crearCotizacion);

export default router;