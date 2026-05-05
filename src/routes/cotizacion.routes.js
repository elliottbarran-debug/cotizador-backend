import { Router } from 'express';
import { crearCotizacion } from '../controllers/cotizacion.controller.js';

const router = Router();

router.post('/', crearCotizacion);

export default router;