export const crearCotizacion = async (req, res) => {
  try {
    const { cliente, items } = req.body;

    let subtotal = 0;

    items.forEach(item => {
      subtotal += item.cantidad * item.precio;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    res.json({
      ok: true,
      total
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};