import PDFDocument from 'pdfkit';

export const generarPDF = (data) => {
  const doc = new PDFDocument({ margin: 50 });

  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  return new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    // 🔥 LOGO (si tienes imagen)
// 🔥 LOGO
doc.image('src/assets/logo.png', 50, 45, { width: 100 });	  
    // doc.image('logo.png', 50, 45, { width: 100 });

    doc.fontSize(20).text('COTIZACIÓN', { align: 'center' });

    doc.moveDown();
    doc.fontSize(12).text(`Cliente: ${data.cliente}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    // 🔥 TABLA
    doc.text('------------------------------------------------------------');
    doc.text('Cant | Descripción | Precio | Total');
    doc.text('------------------------------------------------------------');

    data.items.forEach(item => {
      const totalItem = item.cantidad * item.precio;
      doc.text(
        `${item.cantidad} | ${item.descripcion} | $${item.precio} | $${totalItem}`
      );
    });

    doc.text('------------------------------------------------------------');

    doc.moveDown();

    // 🔥 TOTALES
    doc.text(`Subtotal: $${data.subtotal.toFixed(2)}`);
    doc.text(`IVA (16%): $${data.iva.toFixed(2)}`);
    doc.fontSize(14).text(`TOTAL: $${data.total.toFixed(2)}`, {
      align: 'right'
    });

    doc.moveDown();

    // 🔥 TÉRMINOS
    doc.fontSize(12).text('TÉRMINOS Y CONDICIONES', { underline: true });

    doc.fontSize(10).text(`
- Se requiere anticipo del 50%
- Precios más IVA
- Cotización válida por 15 días
- Cambios generan nueva cotización
    `);

    doc.moveDown();

    // 🔥 FOOTER EMPRESA
    doc.fontSize(10).text('Tu Empresa S.A. de C.V.', { align: 'center' });
    doc.text('Mexicali, Baja California', { align: 'center' });
    doc.text('Tel: 686-000-0000', { align: 'center' });

    doc.end();
  });
};