export const crearCotizacion = async (req, res) => {
  try {
    const { cliente, items } = req.body;

    let subtotal = 0;

    items.forEach(item => {
      subtotal += item.cantidad * item.precio;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    // ?? RESPUESTA TEMPORAL SIN PDF
    res.json({
      ok: true,
      cliente,
      subtotal,
      iva,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};