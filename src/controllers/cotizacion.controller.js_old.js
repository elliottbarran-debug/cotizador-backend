import { pool } from '../config/db.js';
import { generarPDF } from '../services/pdf.service.js';

export const crearCotizacion = async (req, res) => {
  try {
    const {
      cliente,
      telefono,
      direccion,
      ciudad,
      representante,
      items
    } = req.body;

    // 1. Insertar cliente
    const clienteRes = await pool.query(
      'INSERT INTO clientes(nombre) VALUES($1) RETURNING *',
      [cliente]
    );

    const clienteId = clienteRes.rows[0].id;

    let total = 0;

    // 2. Insertar cotización (folio se genera en DB si usas SERIAL)
    const cotizacionRes = await pool.query(
      'INSERT INTO cotizaciones(cliente_id, total) VALUES($1, $2) RETURNING *',
      [clienteId, total]
    );

    const cotizacion = cotizacionRes.rows[0];
    const cotizacionId = cotizacion.id;

    // ?? ESTE ES EL FOLIO REAL
    const folio = cotizacion.folio;

    // 3. Insertar conceptos
    for (const item of items) {
      const subtotalItem = item.cantidad * item.precio;
      total += subtotalItem;

      await pool.query(
        `INSERT INTO conceptos(cotizacion_id, descripcion, cantidad, precio, total)
         VALUES($1, $2, $3, $4, $5)`,
        [
          cotizacionId,
          item.descripcion,
          item.cantidad,
          item.precio,
          subtotalItem
        ]
      );
    }

    // 4. Cálculos finales
    const subtotal = total;
    const iva = subtotal * 0.16;
    const totalFinal = subtotal + iva;

    // 5. Actualizar total en DB
    await pool.query(
      'UPDATE cotizaciones SET total = $1 WHERE id = $2',
      [totalFinal, cotizacionId]
    );

    // 6. Generar PDF (?? AQUÍ ESTÁ LA MAGIA)
    const pdf = await generarPDF({
      cliente,
      telefono,
      direccion,
      ciudad,
      representante,
      items,
      subtotal,
      iva,
      total: totalFinal,
      folio // ?? SE ENVÍA AL PDF
    });

    // 7. Respuesta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=cotizacion.pdf',
    });

    res.send(pdf);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};