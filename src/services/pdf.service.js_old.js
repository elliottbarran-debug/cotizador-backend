import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const logoPath = path.resolve('src/assets/logo.png');

export const generarPDF = async (data) => {

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  // ✅ LOGO BASE64
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  // ✅ FOLIO REAL (VIENE DEL CONTROLLER)
  const folioFormateado = data.folio
    ? `COT-${String(data.folio).padStart(5, '0')}`
    : 'COT-00000';

  const html = `
<html lang="es">
<head>
<meta charset="UTF-8">

<style>
  body {
    font-family: Arial;
    padding: 40px;
    font-size: 12px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    page-break-inside: auto;
  }

  thead {
    display: table-header-group;
  }

  tr {
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #000;
    padding: 6px;
  }

  td:nth-child(1),
  td:nth-child(3),
  td:nth-child(4) {
    text-align: right;
  }

  /* ✅ COLOR AMARILLO QUE SÍ IMPRIME */
  th {
    background-color: #facc15;
    color: #000;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #000;
    padding-bottom: 10px;
  }

  .empresa {
    text-align: right;
  }

  .titulo {
    text-align: center;
    margin: 20px 0;
    font-size: 22px;
  }

  .cliente {
    margin-top: 10px;
    border: 1px solid #000;
    padding: 10px;
  }

  .texto {
    margin-top: 10px;
  }

  .totales {
    width: 300px;
    margin-left: auto;
    margin-top: 20px;
    border-top: 2px solid #000;
    padding-top: 10px;
  }

  .totales p {
    display: flex;
    justify-content: space-between;
    margin: 2px 0;
  }

  .total-final {
    font-size: 14px;
  }

  .footer {
    margin-top: 20px;
    font-size: 11px;
  }

  /* ✅ FIRMA FIJA ABAJO */
  .firma {
    position: fixed;
    bottom: 40px;
    width: 100%;
    text-align: center;
  }

  .linea-firma {
    width: 250px;
    margin: 0 auto;
    border-top: 1px solid #000;
  }

</style>
</head>

<body>

<!-- HEADER -->
<div class="header">
  <div class="logo">
    <img src="data:image/png;base64,${logoBase64}" width="120"/>
  </div>

  <div class="empresa">
    <strong>Tu Empresa S.A. de C.V.</strong><br>
    Dirección de la empresa<br>
    Mexicali, B.C.<br>
    Tel: 686-000-0000<br><br>

    Fecha: ${new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}<br>
    Cotización #: ${folioFormateado}
  </div>
</div>

<!-- TITULO -->
<div class="titulo">
  <strong>COTIZACIÓN</strong>
</div>

<!-- CLIENTE -->
<div class="cliente">
  <strong>Cliente:</strong> ${data.cliente || ''}<br>
  Teléfono: ${data.telefono || ''}<br>
  Dirección: ${data.direccion || ''}<br>
  Ciudad: ${data.ciudad || ''}
</div>

<!-- TEXTO -->
<div class="texto">
  En seguida tengo el gusto de presentar a su amable consideración el presupuesto solicitado:
</div>

<!-- TABLA -->
<table>
  <thead>
    <tr>
      <th>Cantidad</th>
      <th>Descripción</th>
      <th>Precio Unitario</th>
      <th>Importe</th>
    </tr>
  </thead>
  <tbody>
    ${data.items.map(item => {
      const totalItem = item.cantidad * item.precio;
      return `
        <tr>
          <td>${item.cantidad}</td>
          <td>${item.descripcion}</td>
          <td>${item.precio.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
          <td>${totalItem.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</td>
        </tr>
      `;
    }).join('')}
  </tbody>
</table>

<!-- TOTALES -->
<div class="totales">
  <p><span>Subtotal:</span> <span>${(data.subtotal || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span></p>
  <p><span>IVA:</span> <span>${(data.iva || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span></p>
  <p class="total-final">
    <strong>Total:</strong>
    <strong>${(data.total || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong>
  </p>
</div>

<!-- TERMINOS -->
<div class="footer">
  <p>PRECIOS SUJETOS A CAMBIO SIN PREVIO AVISO.</p>
  <p>VIGENCIA DE LA COTIZACIÓN: 7 DÍAS.</p>
  <p>TIEMPO DE ENTREGA: 5-7 DÍAS HÁBILES.</p>
</div>

<!-- FIRMA -->
<div class="firma">
  <p>Atentamente:</p>

  <br><br>

  <div class="linea-firma"></div>

  <p><strong>${data.representante || ''}</strong></p>
  <p>Departamento de Ventas</p>
</div>

</body>
</html>
`;

  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  });

  await browser.close();

  return pdf;
};